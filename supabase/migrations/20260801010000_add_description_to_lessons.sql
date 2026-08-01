-- ============================================
-- Columnas de lecciones usadas por el panel admin
-- (description + superclass_language)
-- ============================================

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS superclass_language TEXT;

COMMENT ON COLUMN public.lessons.description IS
  'Descripción o resumen detallado de la lección para la vista de alumnos en el aula virtual';

COMMENT ON COLUMN public.lessons.superclass_language IS
  'Lenguaje de SuperClase (python, sql, etc.) si la lección habilita el playground';
