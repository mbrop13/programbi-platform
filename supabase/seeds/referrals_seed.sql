-- Demo seed referidos ProgramBI
-- Requiere 3 usuarios en auth.users:
--   leo.a@example.org (admin — también en profiles.role = admin)
--   tom.h@example.org
--   paula.r@example.org
--
-- Si los emails no existen, este seed no inserta filas (no falla).

do $$
declare
  admin_id uuid;
  r1_user uuid;
  r2_user uuid;
  r1 uuid;
  r2 uuid;
  ref_a uuid;
  ref_b uuid;
  ref_c uuid;
  ref_d uuid;
  ref_e uuid;
begin
  select id into admin_id from auth.users where email = 'leo.a@example.org' limit 1;
  select id into r1_user from auth.users where email = 'tom.h@example.org' limit 1;
  select id into r2_user from auth.users where email = 'paula.r@example.org' limit 1;

  if r1_user is null or r2_user is null then
    raise notice 'Seed referidos: crea usuarios demo (camila/andres) e intenta de nuevo.';
    return;
  end if;

  insert into public.referrers (user_id, name, email, phone, type, status, referral_code)
  values
    (r1_user, 'Camila Soto', 'tom.h@example.org', '+56911111111', 'alumni', 'active', 'PBCAMILA'),
    (r2_user, 'Andrés Pérez', 'paula.r@example.org', '+56922222222', 'client', 'active', 'PBANDRES')
  on conflict (user_id) do update
    set name = excluded.name, referral_code = excluded.referral_code
  returning id into r1;

  select id into r1 from public.referrers where user_id = r1_user;
  select id into r2 from public.referrers where user_id = r2_user;

  -- Camila: pipeline mix
  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    prospect_email, prospect_phone, notes, source, status
  ) values
    (r1, 'María López', 'Comercial Andina', 'Controller', 'maria.lopez@example.com', '+56970000001',
     'Cierre Excel de 4 días. Área comercial.', 'linkedin', 'submitted')
  returning id into ref_a;

  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    prospect_email, prospect_phone, notes, source, status
  ) values
    (r1, 'Diego Fuentes', 'Minera del Norte', 'Gerente Control de Gestión', 'diego.fuentes@example.com', '+56970000002',
     'Reportes mensuales en 12 planillas.', 'whatsapp', 'qualified')
  returning id into ref_b;

  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    prospect_email, notes, source, status
  ) values
    (r1, 'Carolina Vidal', 'Retail Pacífico', 'Gerenta Finanzas', 'carolina.vidal@example.com',
     'Quiere tablero de margen por tienda.', 'email', 'proposal_sent')
  returning id into ref_c;

  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    prospect_email, notes, source, status
  ) values
    (r1, 'Jorge Salinas', 'Logística Sur', 'Gerente Ops', 'jorge.salinas@example.com',
     'Pack cerrado y cobrado. Primer Pack del área.', 'whatsapp', 'won')
  returning id into ref_d;

  -- Andrés: lost + paid
  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    notes, source, status, lost_reason
  ) values
    (r2, 'Patricia Núñez', 'Agro Valle', 'Controller',
     'Timing: presupuesto 2027.', 'linkedin', 'lost', 'Sin presupuesto este trimestre')
  returning id into ref_e;

  insert into public.referrals (
    referrer_id, prospect_name, prospect_company, prospect_role,
    prospect_email, notes, source, status
  ) values
    (r2, 'Felipe Rojas', 'Inmobiliaria Cóndor', 'Gerente Comercial', 'felipe.rojas@example.com',
     'Pack cobrado. Comisión ya pagada.', 'in_person', 'paid');

  -- Comisión won (por pagar) Camila / Logística Sur $3.200.000 → 480.000
  insert into public.referral_commissions (
    referral_id, deal_amount_clp, percent, commission_amount_clp, status
  )
  select id, 3200000, 15, 480000, 'payable'
  from public.referrals
  where referrer_id = r1 and prospect_company = 'Logística Sur'
  on conflict (referral_id) do nothing;

  -- Comisión pagada Andrés / Inmobiliaria Cóndor $2.900.000 → 435.000
  insert into public.referral_commissions (
    referral_id, deal_amount_clp, percent, commission_amount_clp, status, paid_at, payment_ref
  )
  select id, 2900000, 15, 435000, 'paid', now() - interval '10 days', 'TRX-DEMO-435'
  from public.referrals
  where referrer_id = r2 and prospect_company = 'Inmobiliaria Cóndor'
  on conflict (referral_id) do nothing;

  insert into public.referral_audit_log (actor_email, action, entity_type, meta)
  values (
    'leo.a@example.org',
    'seed',
    'referrals',
    '{"note":"demo seed v1"}'::jsonb
  );

  raise notice 'Seed referidos OK. Camila=% Andrés=%', r1, r2;
end $$;
