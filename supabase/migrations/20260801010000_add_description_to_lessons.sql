-- ============================================
-- Agregar columna description a la tabla lessons
-- ============================================

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN public.lessons.description IS
  'Descripción o resumen detallado de la lección para la vista de alumnos en el aula virtual';
