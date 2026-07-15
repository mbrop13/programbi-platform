-- ============================================
-- GRAN PARTIDO — Predicciones y sorteo de curso
-- Date: 2026-07-15
-- Description: Votos de miembros sobre el gran partido
--              (España vs Argentina). Entre quienes acierten
--              se sortea un curso a elección.
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.match_prediction_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team TEXT NOT NULL CHECK (team IN ('espana', 'argentina')),
  preferred_course_slug TEXT NOT NULL,
  preferred_course_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT match_prediction_votes_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_match_prediction_votes_team
  ON public.match_prediction_votes (team);

CREATE INDEX IF NOT EXISTS idx_match_prediction_votes_created_at
  ON public.match_prediction_votes (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_match_prediction_votes_course
  ON public.match_prediction_votes (preferred_course_slug);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.match_prediction_votes ENABLE ROW LEVEL SECURITY;

-- Los miembros autenticados pueden insertar su propio voto
DROP POLICY IF EXISTS "Members can insert own match vote" ON public.match_prediction_votes;
CREATE POLICY "Members can insert own match vote"
  ON public.match_prediction_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Solo pueden leer su propio voto
DROP POLICY IF EXISTS "Members can read own match vote" ON public.match_prediction_votes;
CREATE POLICY "Members can read own match vote"
  ON public.match_prediction_votes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No se permite actualizar/eliminar desde el cliente (voto definitivo)
-- Los admins gestionan vía service role / admin client

-- ============================================
-- RPC: conteos públicos agregados (sin datos personales)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_match_prediction_stats()
RETURNS TABLE (
  espana_count BIGINT,
  argentina_count BIGINT,
  total_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) FILTER (WHERE team = 'espana')::BIGINT AS espana_count,
    COUNT(*) FILTER (WHERE team = 'argentina')::BIGINT AS argentina_count,
    COUNT(*)::BIGINT AS total_count
  FROM public.match_prediction_votes;
$$;

REVOKE ALL ON FUNCTION public.get_match_prediction_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_match_prediction_stats() TO anon, authenticated;

COMMENT ON TABLE public.match_prediction_votes IS
  'Predicciones de miembros sobre el gran partido España vs Argentina. Sorteo de curso entre acertantes.';
