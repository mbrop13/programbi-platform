-- ============================================
-- MIGRATION: Bolsa de Trabajo — mejoras de producción
-- Date: 2026-08-22
-- - expiry_notified_at: controla el email de aviso de expiración (cron diario)
-- ============================================

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS expiry_notified_at TIMESTAMPTZ;

-- Reabrir/extender una vacante rehabilita el aviso de expiración
COMMENT ON COLUMN public.jobs.expiry_notified_at IS
  'Fecha del último email de aviso de expiración enviado (cron diario); NULL = sin aviso pendiente';
