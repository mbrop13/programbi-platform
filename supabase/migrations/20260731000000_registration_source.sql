-- ============================================
-- Origen de registro de miembros
-- Guarda desde qué página se registró cada usuario
-- (comunidad, curso, inicio, etc.) para el panel admin.
-- ============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS registration_source TEXT;

COMMENT ON COLUMN public.profiles.registration_source IS
  'Ruta o página desde la que el usuario se registró (ej. /comunidad, /cursos/analisis-de-datos)';

CREATE INDEX IF NOT EXISTS idx_profiles_registration_source
  ON public.profiles (registration_source);

-- Actualizar handle_new_user para copiar registration_source desde user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  dept TEXT;
  reg_source TEXT;
BEGIN
  -- 1. Check if there is a specific invitation for this email
  SELECT organization_id, department INTO org_id, dept
  FROM public.organization_invitations
  WHERE email = NEW.email;

  -- 2. If no invitation, check for domain-based auto-association
  IF org_id IS NULL THEN
    SELECT id, 'General' INTO org_id, dept
    FROM public.organizations
    WHERE domain IS NOT NULL AND NEW.email LIKE '%@' || domain;
  END IF;

  -- 3. Origen de registro (desde metadata del signUp / OAuth)
  reg_source := NULLIF(TRIM(NEW.raw_user_meta_data->>'registration_source'), '');

  -- 4. Insert profile with organization details if found
  INSERT INTO public.profiles (id, full_name, email, organization_id, department, phone, company, registration_source)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    org_id,
    COALESCE(dept, 'General'),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone')), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'company'), ''),
    reg_source
  );

  -- 5. Delete the invitation if it was used
  IF org_id IS NOT NULL THEN
    DELETE FROM public.organization_invitations WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
