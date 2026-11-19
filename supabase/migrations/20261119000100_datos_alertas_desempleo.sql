create table public.datos_alertas_desempleo (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and length(email) between 5 and 254),
  baja_token uuid not null unique default gen_random_uuid(),
  confirmacion_hash text unique check (confirmacion_hash ~ '^[0-9a-f]{64}$'),
  confirmacion_expira timestamptz,
  confirmacion_solicitada timestamptz,
  activo_desde timestamptz,
  creado_en timestamptz not null default now()
);

create table public.datos_alertas_ediciones (
  periodo text primary key check (periodo ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  detectado_en timestamptz not null default now(),
  finalizado_en timestamptz
);

create table public.datos_alertas_envios (
  periodo text not null references public.datos_alertas_ediciones (periodo),
  suscripcion_id uuid not null references public.datos_alertas_desempleo (id) on delete cascade,
  reservado_en timestamptz not null default now(),
  enviado_en timestamptz,
  primary key (periodo, suscripcion_id)
);

create index datos_alertas_desempleo_activas
  on public.datos_alertas_desempleo (id) where activo_desde is not null;

alter table public.datos_alertas_desempleo enable row level security;
alter table public.datos_alertas_ediciones enable row level security;
alter table public.datos_alertas_envios enable row level security;

revoke all on public.datos_alertas_desempleo, public.datos_alertas_ediciones, public.datos_alertas_envios
  from public, anon, authenticated;
grant select, insert, update, delete
  on public.datos_alertas_desempleo, public.datos_alertas_ediciones, public.datos_alertas_envios
  to service_role;

create function public.datos_preparar_alerta_desempleo(correo text, huella text)
returns boolean
language sql
set search_path = ''
as $$
  with preparada as (
    insert into public.datos_alertas_desempleo as alerta
      (email, confirmacion_hash, confirmacion_expira, confirmacion_solicitada)
    values (correo, huella, now() + interval '48 hours', now())
    on conflict (email) do update set
      confirmacion_hash = excluded.confirmacion_hash,
      confirmacion_expira = excluded.confirmacion_expira,
      confirmacion_solicitada = excluded.confirmacion_solicitada
    where alerta.activo_desde is null
      and (alerta.confirmacion_solicitada is null
        or alerta.confirmacion_solicitada < now() - interval '30 minutes')
    returning 1
  )
  select exists (select 1 from preparada);
$$;

revoke all on function public.datos_preparar_alerta_desempleo(text, text) from public, anon, authenticated;
grant execute on function public.datos_preparar_alerta_desempleo(text, text) to service_role;
