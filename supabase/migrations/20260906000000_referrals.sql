-- ProgramBI referrals v1
-- Pack Adopción: 15% del neto cobrado del primer Pack atribuido.
-- Intros se califican manualmente. Comisión solo al cobro. Clawback 60 días.

create extension if not exists pgcrypto;

create table if not exists public.referrers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  type text not null default 'other'
    check (type in ('alumni', 'client', 'partner', 'other')),
  status text not null default 'active'
    check (status in ('pending', 'active', 'suspended')),
  referral_code text not null unique,
  bank_payload text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  prospect_name text not null,
  prospect_company text not null,
  prospect_role text not null,
  prospect_email text,
  prospect_phone text,
  prospect_linkedin text,
  notes text,
  source text not null default 'other',
  status text not null default 'submitted'
    check (status in (
      'submitted', 'in_review', 'qualified', 'diagnosis_scheduled',
      'proposal_sent', 'won', 'lost', 'paid', 'clawback'
    )),
  lost_reason text,
  suggested_from_cookie boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null unique references public.referrals(id) on delete restrict,
  deal_amount_clp bigint not null check (deal_amount_clp > 0),
  percent numeric(5,2) not null default 15,
  commission_amount_clp bigint not null check (commission_amount_clp >= 0),
  status text not null default 'payable'
    check (status in ('accrued', 'payable', 'paid', 'clawed_back')),
  paid_at timestamptz,
  payment_ref text,
  clawback_at timestamptz,
  clawback_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  meta jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);

create table if not exists public.referral_lead_hints (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null,
  lead_name text,
  lead_email text,
  lead_company text,
  lead_phone text,
  landing_path text,
  status text not null default 'suggested'
    check (status in ('suggested', 'confirmed', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists referrers_user_id_idx on public.referrers (user_id);
create index if not exists referrers_code_idx on public.referrers (referral_code);
create index if not exists referrals_referrer_idx on public.referrals (referrer_id);
create index if not exists referrals_status_idx on public.referrals (status);
create index if not exists referrals_created_idx on public.referrals (created_at desc);
create index if not exists referral_commissions_status_idx on public.referral_commissions (status);
create index if not exists referral_audit_at_idx on public.referral_audit_log (at desc);
create index if not exists referral_hints_code_idx on public.referral_lead_hints (referral_code);

create or replace function public.referrals_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists referrers_updated_at on public.referrers;
create trigger referrers_updated_at
  before update on public.referrers
  for each row execute function public.referrals_set_updated_at();

drop trigger if exists referrals_updated_at on public.referrals;
create trigger referrals_updated_at
  before update on public.referrals
  for each row execute function public.referrals_set_updated_at();

drop trigger if exists referral_commissions_updated_at on public.referral_commissions;
create trigger referral_commissions_updated_at
  before update on public.referral_commissions
  for each row execute function public.referrals_set_updated_at();

alter table public.referrers enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_commissions enable row level security;
alter table public.referral_audit_log enable row level security;
alter table public.referral_lead_hints enable row level security;

drop policy if exists referrers_select_own on public.referrers;
create policy referrers_select_own on public.referrers
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists referrers_update_own on public.referrers;
create policy referrers_update_own on public.referrers
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists referrers_insert_own on public.referrers;
create policy referrers_insert_own on public.referrers
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists referrals_select_own on public.referrals;
create policy referrals_select_own on public.referrals
  for select to authenticated
  using (
    exists (
      select 1 from public.referrers r
      where r.id = referrer_id and r.user_id = auth.uid()
    )
  );

drop policy if exists referrals_insert_own on public.referrals;
create policy referrals_insert_own on public.referrals
  for insert to authenticated
  with check (
    exists (
      select 1 from public.referrers r
      where r.id = referrer_id and r.user_id = auth.uid() and r.status = 'active'
    )
  );

drop policy if exists commissions_select_own on public.referral_commissions;
create policy commissions_select_own on public.referral_commissions
  for select to authenticated
  using (
    exists (
      select 1
      from public.referrals rf
      join public.referrers r on r.id = rf.referrer_id
      where rf.id = referral_id and r.user_id = auth.uid()
    )
  );

-- Audit + lead hints: no client access. Service role bypasses RLS.
revoke all on public.referral_audit_log from anon, authenticated;
revoke all on public.referral_lead_hints from anon, authenticated;
grant select, insert, update, delete on public.referral_audit_log to service_role;
grant select, insert, update, delete on public.referral_lead_hints to service_role;

comment on table public.referrers is 'Referidores del Pack Adopción BI. bank_payload cifrado en app.';
comment on table public.referrals is 'Intros. Status qualified+ solo por admin.';
comment on table public.referral_commissions is '15% floor del neto cobrado del primer Pack atribuido.';
