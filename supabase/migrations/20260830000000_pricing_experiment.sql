-- A/B visibilidad de precio: variante en perfiles/leads + exposiciones únicas.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pricing_variant TEXT;

COMMENT ON COLUMN public.profiles.pricing_variant IS
  'Brazo del experimento pricing_visibility al registrarse: gate (candado) o direct (vio precio).';

CREATE INDEX IF NOT EXISTS idx_profiles_pricing_variant
  ON public.profiles (pricing_variant);

ALTER TABLE public.course_leads
  ADD COLUMN IF NOT EXISTS pricing_variant TEXT;

COMMENT ON COLUMN public.course_leads.pricing_variant IS
  'Brazo del experimento pricing_visibility al enviar el contacto: gate o direct.';

CREATE INDEX IF NOT EXISTS idx_course_leads_pricing_variant
  ON public.course_leads (pricing_variant);

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS pricing_variant TEXT;

COMMENT ON COLUMN public.payments.pricing_variant IS
  'Brazo del experimento al crear el pago: gate o direct. Sirve para contar ventas por opción.';

CREATE INDEX IF NOT EXISTS idx_payments_pricing_variant
  ON public.payments (pricing_variant);

CREATE TABLE IF NOT EXISTS public.experiment_exposures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id TEXT NOT NULL DEFAULT 'pricing_visibility',
  visitor_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  course_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (experiment_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_experiment_exposures_variant
  ON public.experiment_exposures (experiment_id, variant);

ALTER TABLE public.experiment_exposures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read experiment exposures" ON public.experiment_exposures;
CREATE POLICY "Admins can read experiment exposures"
  ON public.experiment_exposures
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  dept TEXT;
  reg_source TEXT;
  price_variant TEXT;
BEGIN
  SELECT organization_id, department INTO org_id, dept
  FROM public.organization_invitations
  WHERE email = NEW.email;

  IF org_id IS NULL THEN
    SELECT id, 'General' INTO org_id, dept
    FROM public.organizations
    WHERE domain IS NOT NULL AND NEW.email LIKE '%@' || domain;
  END IF;

  reg_source := NULLIF(TRIM(NEW.raw_user_meta_data->>'registration_source'), '');
  price_variant := NULLIF(TRIM(NEW.raw_user_meta_data->>'pricing_variant'), '');
  IF price_variant IS NOT NULL AND price_variant NOT IN ('gate', 'direct') THEN
    price_variant := NULL;
  END IF;

  INSERT INTO public.profiles (
    id, full_name, email, organization_id, department, phone, company,
    registration_source, pricing_variant
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    org_id,
    COALESCE(dept, 'General'),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone')), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'company'), ''),
    reg_source,
    price_variant
  );

  IF org_id IS NOT NULL THEN
    DELETE FROM public.organization_invitations WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
