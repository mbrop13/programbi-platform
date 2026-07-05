-- ════════════════════════════════════════════════════════════════════════
-- Cuotas de tokens IA por plan (free / pro / max / ultra)
--
-- Dos tablas:
--   ai_token_usage  → ledger inmutable (append-only) de cada consumo.
--   ai_quota_state  → cache por usuario del consumo acumulado por ventana.
--
-- Seguridad:
--   - Escritura: SOLO con service role (server). RLS no permite INSERT/UPDATE
--     desde la sesión del cliente.
--   - Lectura: el dueño puede leer SU propio estado (para la UI).
-- ════════════════════════════════════════════════════════════════════════

-- ─── Tabla 1: Ledger de consumo (fuente de verdad para auditoría) ───
create table if not exists ai_token_usage (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  chat_id       uuid references ai_chats(id) on delete set null,
  model         text,
  input_tokens  int  not null default 0,
  output_tokens int  not null default 0,
  total_tokens  int  not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_ai_token_usage_profile_created
  on ai_token_usage (profile_id, created_at desc);

create index if not exists idx_ai_token_usage_chat
  on ai_token_usage (chat_id);

-- ─── Tabla 2: Estado de cuotas por usuario (cache para el gate) ───
create table if not exists ai_quota_state (
  profile_id             uuid primary key references profiles(id) on delete cascade,
  monthly_used           int not null default 0,
  weekly_used            int not null default 0,
  five_hour_used         int not null default 0,
  monthly_window_start   timestamptz not null default now(),
  weekly_window_start    timestamptz not null default now(),
  five_hour_window_start timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── Row Level Security ───
-- ai_token_usage: solo el dueño puede LEER sus consumos.
alter table ai_token_usage enable row level security;
drop policy if exists "ai_token_usage owner select" on ai_token_usage;
create policy "ai_token_usage owner select" on ai_token_usage
  for select using (profile_id = auth.uid());

-- ai_quota_state: el dueño puede LEER su estado (la UI lo consulta).
alter table ai_quota_state enable row level security;
drop policy if exists "ai_quota_state owner select" on ai_quota_state;
create policy "ai_quota_state owner select" on ai_quota_state
  for select using (profile_id = auth.uid());

-- NOTA: No creamos políticas INSERT/UPDATE/DELETE → esas operaciones solo
-- son posibles con la service role key (bypass RLS), que se usa exclusivamente
-- en el servidor (API routes). Esto evita que un cliente manipule sus cuotas.

-- ─── updated_at automático para ai_quota_state ───
create or replace function touch_ai_quota_state()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_quota_state_touch on ai_quota_state;
create trigger ai_quota_state_touch
  before update on ai_quota_state
  for each row execute function touch_ai_quota_state();

-- ─── Función SQL de reset de ventanas (refill top-up) ───
-- Recibe el profile_id y los ms de cada ventana. Si una ventana expiró,
-- reinicia su contador a 0 y actualiza el window_start a now().
-- Se invoca desde el servidor antes de chequear la cuota.
-- (Defensiva: si la fila no existe, no hace nada.)
create or replace function reset_ai_quota_windows(
  p_profile_id uuid,
  p_five_hour_ms bigint,
  p_weekly_ms bigint,
  p_monthly_ms bigint
) returns void as $$
declare
  now_ts timestamptz := now();
  s ai_quota_state%rowtype;
begin
  select * into s from ai_quota_state where profile_id = p_profile_id;
  if not found then return; end if;

  if extract(epoch from (now_ts - s.five_hour_window_start)) * 1000 >= p_five_hour_ms then
    s.five_hour_used := 0;
    s.five_hour_window_start := now_ts;
  end if;

  if extract(epoch from (now_ts - s.weekly_window_start)) * 1000 >= p_weekly_ms then
    s.weekly_used := 0;
    s.weekly_window_start := now_ts;
  end if;

  if extract(epoch from (now_ts - s.monthly_window_start)) * 1000 >= p_monthly_ms then
    s.monthly_used := 0;
    s.monthly_window_start := now_ts;
  end if;

  update ai_quota_state set
    five_hour_used = s.five_hour_used,
    weekly_used = s.weekly_used,
    monthly_used = s.monthly_used,
    five_hour_window_start = s.five_hour_window_start,
    weekly_window_start = s.weekly_window_start,
    monthly_window_start = s.monthly_window_start
  where profile_id = p_profile_id;
end;
$$ language plpgsql;

-- ─── Incremento atómico de contadores (tras registrar uso) ───
-- Suma p_total a los tres contadores del usuario. Crea la fila si no existe.
create or replace function increment_ai_quota_usage(
  p_profile_id uuid,
  p_total int
) returns void as $$
begin
  insert into ai_quota_state (profile_id, five_hour_used, weekly_used, monthly_used)
  values (p_profile_id, p_total, p_total, p_total)
  on conflict (profile_id) do update
    set
      five_hour_used = ai_quota_state.five_hour_used + p_total,
      weekly_used    = ai_quota_state.weekly_used    + p_total,
      monthly_used   = ai_quota_state.monthly_used   + p_total;
end;
$$ language plpgsql;
