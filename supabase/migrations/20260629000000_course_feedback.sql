-- Migration: Course Feedback / NPS Survey (Google-Forms style)
-- File: platform/supabase/migrations/20260629000000_course_feedback.sql
--
-- Almacena respuestas de la encuesta pública de satisfacción de cursos.
-- Cualquiera (incluido anon) puede insertar; solo admins pueden leer.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Tabla principal de respuestas
-- ============================================
CREATE TABLE IF NOT EXISTS public.course_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 1. Datos básicos
  name TEXT,
  email TEXT NOT NULL,
  courses_taken TEXT[] DEFAULT '{}',         -- Power BI, Python, SQL, Otros...
  courses_other TEXT,                         -- especificación de "Otros"
  last_course_year TEXT,                      -- 2023..2026

  -- 2. Satisfacción general
  nps_score INTEGER,                          -- 0..10
  overall_rating INTEGER,                     -- 1..5

  -- 3. Evaluación detallada (1..5)
  rating_content_quality INTEGER,
  rating_instructor_clarity INTEGER,
  rating_practical_use INTEGER,
  rating_materials INTEGER,
  rating_support INTEGER,
  rating_platform INTEGER,
  rating_value_price INTEGER,

  -- 4. Impacto profesional
  applied_knowledge TEXT,                     -- 'mucho' | 'algo' | 'poco' | 'no'
  concrete_results TEXT,                      -- texto abierto

  -- 5. Cursos futuros
  desired_courses TEXT[] DEFAULT '{}',        -- lista de intereses IA / avanzados
  desired_courses_other TEXT,
  preferred_formats TEXT[] DEFAULT '{}',      -- grabados, vivo, mini, bootcamp

  -- 6. Opinión abierta
  open_feedback TEXT,

  -- Metadata (sin FK a profiles para evitar dependencias; el feedback es mayoritariamente anónimo)
  user_id UUID,
  source TEXT,                                -- 'web', 'email', etc
  is_anon BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_feedback_submitted_at
  ON public.course_feedback (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_feedback_email
  ON public.course_feedback (email);
CREATE INDEX IF NOT EXISTS idx_course_feedback_nps
  ON public.course_feedback (nps_score);

-- ============================================
-- 2. Row Level Security
-- ============================================
ALTER TABLE public.course_feedback ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar respuestas (formulario público anónimo)
DROP POLICY IF EXISTS "Anyone can submit course feedback" ON public.course_feedback;
CREATE POLICY "Anyone can submit course feedback"
  ON public.course_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Solo el dueño puede ver su propia respuesta (por user_id) y solo admins todas
DROP POLICY IF EXISTS "Users read own course feedback" ON public.course_feedback;
CREATE POLICY "Users read own course feedback"
  ON public.course_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Los admins leen todo vía service_role (RLS bypass). No creamos policy SELECT
-- pública para evitar que se expongan datos de otros alumnos.

-- ============================================
-- 3. Comentarios / habilitación
-- ============================================
COMMENT ON TABLE public.course_feedback IS
  'Respuestas de la encuesta pública de satisfacción de cursos ProgramBI. Solo admins leen vía service_role.';
