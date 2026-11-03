-- Migration: leads magnet (descarga de plantillas / recursos)
-- File: supabase/migrations/20261102000000_leads_magnet.sql
--
-- Guarda solo el email, el país de la landing y el recurso descargado.
-- No aplicar sin OK explícito de Manu.
--
-- Controles antiabuso en base de datos:
--   - largo y formato de email, país y recurso;
--   - email y país siempre en minúsculas;
--   - un registro por email + recurso para evitar duplicados por reintentos.
--
-- RLS: sin policies para roles públicos. El backend (service_role) es el único
-- que inserta y lee; el formulario pasa por /api/leads-magnet.

CREATE TABLE IF NOT EXISTS public.leads_magnet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  pais TEXT NOT NULL DEFAULT 'cl',
  recurso TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT leads_magnet_email_len
    CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT leads_magnet_email_lower
    CHECK (email = lower(email)),
  CONSTRAINT leads_magnet_email_format
    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT leads_magnet_pais_lower
    CHECK (pais = lower(pais)),
  CONSTRAINT leads_magnet_pais_format
    CHECK (pais ~ '^[a-z]{2}$'),
  CONSTRAINT leads_magnet_recurso_lower
    CHECK (recurso = lower(recurso)),
  CONSTRAINT leads_magnet_recurso_format
    CHECK (recurso ~ '^[a-z0-9][a-z0-9-]{1,59}$')
);

-- Evita filas repetidas si el usuario reintenta la descarga.
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_magnet_email_recurso
  ON public.leads_magnet (email, recurso);

CREATE INDEX IF NOT EXISTS idx_leads_magnet_created_at
  ON public.leads_magnet (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_magnet_recurso_pais
  ON public.leads_magnet (recurso, pais);

ALTER TABLE public.leads_magnet ENABLE ROW LEVEL SECURITY;

-- El formulario público pasa por /api/leads-magnet, que valida la entrada,
-- aplica rate limit y antibot. La tabla no expone INSERT directo a roles
-- públicos: de lo contrario se saltarían esos controles y se podría enumerar
-- emails usando el índice único.
DROP POLICY IF EXISTS "Anyone can register a lead magnet" ON public.leads_magnet;

-- Defensa en profundidad: anon/authenticated no pueden leer ni escribir.
-- service_role (backend) omite RLS y conserva sus privilegios.
REVOKE ALL ON TABLE public.leads_magnet FROM anon, authenticated;

COMMENT ON TABLE public.leads_magnet IS
  'Leads capturados antes de descargar una plantilla o recurso. Escritura y lectura solo con service_role (backend).';
COMMENT ON COLUMN public.leads_magnet.recurso IS
  'Slug del recurso descargado, por ejemplo plantilla-ventas-powerbi.';
