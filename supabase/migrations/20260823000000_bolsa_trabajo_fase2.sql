-- ============================================
-- MIGRATION: Bolsa de Trabajo — Fase 2
-- Date: 2026-08-23
-- - Vacantes destacadas (featured) + órdenes de pago Flow
-- - Alertas de vacantes por candidato (digest semanal)
-- - Solicitudes de contacto del directorio de talento
-- ============================================

-- ── 1. Vacantes destacadas ──
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_jobs_featured
  ON public.jobs(featured, published_at DESC)
  WHERE featured = TRUE;

-- Órdenes de pago por destacado (ciclo de pago Flow separado del de cursos)
CREATE TABLE IF NOT EXISTS public.job_feature_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.employer_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  days INTEGER NOT NULL CHECK (days > 0 AND days <= 90),
  amount_clp INTEGER NOT NULL CHECK (amount_clp > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'rejected', 'cancelled')) DEFAULT 'pending',
  flow_order TEXT UNIQUE,
  flow_token TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_orders_company
  ON public.job_feature_orders(company_id, created_at DESC);

ALTER TABLE public.job_feature_orders ENABLE ROW LEVEL SECURITY;

-- La empresa ve sus propias órdenes
CREATE POLICY "Employer can view own feature orders"
  ON public.job_feature_orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = job_feature_orders.company_id AND m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ── 2. Alertas de vacantes ──
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON public.job_alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON public.job_alerts(is_active) WHERE is_active = TRUE;

ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON public.job_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON public.job_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON public.job_alerts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON public.job_alerts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── 3. Solicitudes de contacto del directorio de talento ──
CREATE TABLE IF NOT EXISTS public.talent_contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.employer_companies(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talent_requests_candidate
  ON public.talent_contact_requests(candidate_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_requests_company
  ON public.talent_contact_requests(company_id, created_at DESC);

ALTER TABLE public.talent_contact_requests ENABLE ROW LEVEL SECURITY;

-- El candidato ve las solicitudes que le llegaron; la empresa, las que envió
CREATE POLICY "Candidates and requesters can view contact requests"
  ON public.talent_contact_requests
  FOR SELECT
  USING (
    auth.uid() = candidate_user_id
    OR auth.uid() = requester_user_id
    OR EXISTS (
      SELECT 1 FROM public.employer_members m
      WHERE m.company_id = talent_contact_requests.company_id AND m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Solo miembros de empresas aprobadas pueden solicitar contacto
CREATE POLICY "Employers can insert contact requests"
  ON public.talent_contact_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = requester_user_id
    AND EXISTS (
      SELECT 1 FROM public.employer_members m
      JOIN public.employer_companies c ON c.id = m.company_id
      WHERE m.company_id = talent_contact_requests.company_id
        AND m.user_id = auth.uid()
        AND c.status = 'approved'
    )
  );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
