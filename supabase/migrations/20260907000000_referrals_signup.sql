-- Atribución por registro: el referido queda ligado a la cuenta ProgramBI.
alter table public.referrals
  add column if not exists prospect_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists referrals_prospect_user_id_uidx
  on public.referrals (prospect_user_id)
  where prospect_user_id is not null;

comment on column public.referrals.prospect_user_id is
  'Usuario de ProgramBI que se registró con el link del referidor.';
