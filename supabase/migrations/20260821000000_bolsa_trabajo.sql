-- ============================================
-- MIGRATION: Bolsa de Trabajo (Job Board) — Fase 1
-- Date: 2026-08-21
-- Tables: employer_companies, employer_members,
--         candidate_profiles, jobs, job_applications, saved_jobs
-- Storage: cvs (privado), company-logos (público)
-- ============================================

-- ============================================
-- 1. EMPLOYER_COMPANIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.employer_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  description TEXT,
  size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  city TEXT,
  country TEXT DEFAULT 'Chile',
  contact_email TEXT NOT NULL,
  contact_whatsapp TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  rejection_reason TEXT,
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employer_companies_status ON public.employer_companies(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employer_companies_slug ON public.employer_companies(slug);

-- ============================================
-- 2. EMPLOYER_MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.employer_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.employer_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'recruiter')) DEFAULT 'recruiter',
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (company_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_employer_members_user ON public.employer_members(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_members_company ON public.employer_members(company_id);

-- ============================================
-- 3. CANDIDATE_PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  city TEXT,
  country TEXT DEFAULT 'Chile',
  remote_ok BOOLEAN DEFAULT TRUE,
  years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 50),
  availability TEXT CHECK (availability IN ('full_time', 'part_time', 'freelance')),
  desired_role TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  cv_url TEXT,
  cv_filename TEXT,
  is_searchable BOOLEAN DEFAULT TRUE,
  expected_salary_clp INTEGER CHECK (expected_salary_clp >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. JOBS
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.employer_companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location_city TEXT,
  location_country TEXT DEFAULT 'Chile',
  modality TEXT NOT NULL CHECK (modality IN ('remoto', 'presencial', 'hibrido')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contrato', 'freelance', 'practica')),
  seniority TEXT NOT NULL CHECK (seniority IN ('junior', 'semi', 'senior')) DEFAULT 'semi',
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  salary_min_clp INTEGER CHECK (salary_min_clp >= 0),
  salary_max_clp INTEGER CHECK (salary_max_clp >= 0),
  salary_visible BOOLEAN DEFAULT FALSE,
  apply_via TEXT NOT NULL CHECK (apply_via IN ('plataforma', 'email', 'url')) DEFAULT 'plataforma',
  apply_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'paused', 'closed')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_published ON public.jobs(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON public.jobs USING GIN (skills);

-- ============================================
-- 5. JOB_APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('sent', 'viewed', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')) DEFAULT 'sent',
  cover_letter TEXT,
  candidate_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  recruiter_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job ON public.job_applications(job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON public.job_applications(user_id, created_at DESC);

-- ============================================
-- 6. SAVED_JOBS
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, job_id)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- ── employer_companies ──
ALTER TABLE public.employer_companies ENABLE ROW LEVEL SECURITY;

-- Pública: solo empresas aprobadas son visibles
CREATE POLICY "Anyone can view approved companies"
  ON public.employer_companies
  FOR SELECT
  USING (status = 'approved'
    OR owner_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- El dueño puede actualizar su empresa
CREATE POLICY "Owner can update own company"
  ON public.employer_companies
  FOR UPDATE
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

-- Usuarios autenticados pueden registrar una empresa (queda pending)
CREATE POLICY "Authenticated can insert company"
  ON public.employer_companies
  FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id AND auth.uid() IS NOT NULL);

-- ── employer_members ──
ALTER TABLE public.employer_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own memberships"
  ON public.employer_members
  FOR SELECT
  USING (user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.employer_companies c
      WHERE c.id = employer_members.company_id AND c.owner_user_id = auth.uid()
    ));

CREATE POLICY "Owner can insert members"
  ON public.employer_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employer_companies c
      WHERE c.id = employer_members.company_id AND c.owner_user_id = auth.uid()
    )
  );

-- ── candidate_profiles ──
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own candidate profile"
  ON public.candidate_profiles
  FOR SELECT
  USING (auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

CREATE POLICY "Users can insert own candidate profile"
  ON public.candidate_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own candidate profile"
  ON public.candidate_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── jobs ──
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Pública: vacantes publicadas, no expiradas, de empresas aprobadas
CREATE POLICY "Anyone can view published jobs"
  ON public.jobs
  FOR SELECT
  USING (
    (status = 'published' AND expires_at > NOW()
      AND EXISTS (
        SELECT 1 FROM public.employer_companies c
        WHERE c.id = jobs.company_id AND c.status = 'approved'
      ))
    OR EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = jobs.company_id AND m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Miembros de la empresa pueden crear vacantes (solo si empresa aprobada)
CREATE POLICY "Employer members can insert jobs"
  ON public.jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employer_members m
      JOIN public.employer_companies c ON c.id = m.company_id
      WHERE m.company_id = jobs.company_id AND m.user_id = auth.uid() AND c.status = 'approved'
    )
  );

-- Miembros de la empresa pueden actualizar sus vacantes
CREATE POLICY "Employer members can update own jobs"
  ON public.jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = jobs.company_id AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = jobs.company_id AND m.user_id = auth.uid()
    )
  );

-- Miembros de la empresa pueden eliminar sus vacantes
CREATE POLICY "Employer members can delete own jobs"
  ON public.jobs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = jobs.company_id AND m.user_id = auth.uid()
    )
  );

-- ── job_applications ──
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Candidato ve las suyas; la empresa ve las de sus vacantes; admin todas
CREATE POLICY "Candidate can view own applications"
  ON public.job_applications
  FOR SELECT
  USING (user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_members m ON m.company_id = j.company_id
      WHERE j.id = job_applications.job_id AND m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Candidato crea sus postulaciones (solo a vacantes publicadas)
CREATE POLICY "Candidate can insert own application"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_applications.job_id AND j.status = 'published' AND j.expires_at > NOW()
    ));

-- Candidato puede retirar su postulación; la empresa puede actualizar estado/notas
CREATE POLICY "Candidate can update own application"
  ON public.job_applications
  FOR UPDATE
  USING (user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_members m ON m.company_id = j.company_id
      WHERE j.id = job_applications.job_id AND m.user_id = auth.uid()
    ))
  WITH CHECK (user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_members m ON m.company_id = j.company_id
      WHERE j.id = job_applications.job_id AND m.user_id = auth.uid()
    ));

-- ── saved_jobs ──
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved jobs"
  ON public.saved_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved jobs"
  ON public.saved_jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved jobs"
  ON public.saved_jobs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- CVs: bucket PRIVADO (solo el dueño y acceso vía signed URL del backend)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs', 'cvs', FALSE, 5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own cv"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own cv"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own cv"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Logos de empresa: bucket PÚBLICO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos', 'company-logos', TRUE, 2097152,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Miembros de la empresa pueden subir el logo en la carpeta de su empresa
CREATE POLICY "Employer members can upload logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'company-logos'
    AND EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id::text = (storage.foldername(name))[1] AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Employer members can delete logos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'company-logos'
    AND EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id::text = (storage.foldername(name))[1] AND m.user_id = auth.uid()
    )
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_bolsa_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_employer_companies_updated_at
  BEFORE UPDATE ON public.employer_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_bolsa_updated_at();

CREATE TRIGGER trigger_candidate_profiles_updated_at
  BEFORE UPDATE ON public.candidate_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_bolsa_updated_at();

CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_bolsa_updated_at();

CREATE TRIGGER trigger_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_bolsa_updated_at();

-- ============================================
-- RPC: incrementar vistas de vacante (sin RLS issues)
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_job_views(p_job_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs
  SET views_count = views_count + 1
  WHERE id = p_job_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_job_applications(p_job_id UUID, p_delta INTEGER DEFAULT 1)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs
  SET applications_count = GREATEST(0, applications_count + p_delta)
  WHERE id = p_job_id;
END;
$$;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
