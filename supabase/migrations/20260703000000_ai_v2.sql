-- ════════════════════════════════════════════════════════════════════════
-- AI v2: nuevo esquema de chat basado en "parts" (UIMessage)
-- Reemplaza ai_conversations / ai_messages por ai_chats / ai_chat_messages.
-- Las tablas viejas se conservan como respaldo (migración best-effort de data).
-- ════════════════════════════════════════════════════════════════════════

-- ─── Tabla de chats (reemplaza ai_conversations) ───
create table if not exists ai_chats (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  title       text,
  model       text,
  pinned      boolean not null default false,
  archived    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_ai_chats_profile_updated
  on ai_chats (profile_id, updated_at desc);

-- ─── Tabla de mensajes basada en parts (UIMessage) ───
-- parts: [{type:'text'|'reasoning'|'tool'|'file'|'image'|'source-url', ...}]
create table if not exists ai_chat_messages (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid not null references ai_chats(id) on delete cascade,
  role        text not null check (role in ('user','assistant')),
  parts       jsonb not null default '[]'::jsonb,
  model       text,
  tokens      int,
  attachments jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_ai_chat_messages_chat_created
  on ai_chat_messages (chat_id, created_at);

-- ─── Row Level Security: solo el dueño (vía chat.profile_id = auth.uid()) ───
alter table ai_chats enable row level security;
drop policy if exists "ai_chats owner" on ai_chats;
create policy "ai_chats owner" on ai_chats
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

alter table ai_chat_messages enable row level security;
drop policy if exists "ai_chat_messages owner" on ai_chat_messages;
create policy "ai_chat_messages owner" on ai_chat_messages
  for all
  using (
    exists (select 1 from ai_chats c where c.id = chat_id and c.profile_id = auth.uid())
  )
  with check (
    exists (select 1 from ai_chats c where c.id = chat_id and c.profile_id = auth.uid())
  );

-- ─── updated_at automático ───
create or replace function touch_ai_chat()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_chats_touch on ai_chats;
create trigger ai_chats_touch
  before update on ai_chats
  for each row execute function touch_ai_chat();

-- ─── Storage bucket privado para adjuntos del chat ───
insert into storage.buckets (id, name, public)
values ('ai-attachments', 'ai-attachments', false)
on conflict (id) do nothing;

-- RLS sobre los objetos del bucket: el dueño puede gestionar sus archivos
-- (path = profile_id/uuid.ext)
drop policy if exists "ai_attachments owner select" on storage.objects;
create policy "ai_attachments owner select" on storage.objects
  for select using (
    bucket_id = 'ai-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ai_attachments owner insert" on storage.objects;
create policy "ai_attachments owner insert" on storage.objects
  for insert with check (
    bucket_id = 'ai-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ai_attachments owner update" on storage.objects;
create policy "ai_attachments owner update" on storage.objects
  for update using (
    bucket_id = 'ai-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ai_attachments owner delete" on storage.objects;
create policy "ai_attachments owner delete" on storage.objects
  for delete using (
    bucket_id = 'ai-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ════════════════════════════════════════════════════════════════════════
-- Migración best-effort de la data vieja.
-- Convierte content (texto plano) → parts: [{type:'text', text:content}]
-- Las tablas viejas NO se eliminan (quedan como respaldo).
-- Defensiva: si las tablas viejas no existen, no rompe el DDL (DO + EXCEPTION).
-- ════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  INSERT INTO ai_chats (id, profile_id, title, created_at, updated_at)
  SELECT id, profile_id, title, created_at, coalesce(updated_at, created_at)
  FROM ai_conversations
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN NULL; -- tabla vieja no existe: nada que migrar
END $$;

DO $$
BEGIN
  INSERT INTO ai_chat_messages (id, chat_id, role, parts, model, created_at)
  SELECT
    id,
    conversation_id,
    role,
    CASE
      WHEN content IS NULL OR content = '' THEN '[]'::jsonb
      ELSE jsonb_build_array(jsonb_build_object('type','text','text',content))
    END,
    model,
    created_at
  FROM ai_messages
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;
