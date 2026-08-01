-- ============================================
-- Limpieza de nombres de cursos para la comunidad y el panel admin
-- Remueve sufijos descontextualizados ("Expert", "Experto", etc.)
-- ============================================

UPDATE public.courses
SET title = 'Power BI'
WHERE slug = 'power-bi' AND (title ILIKE '%expert%' OR title ILIKE '%experto%');

UPDATE public.courses
SET title = 'Excel'
WHERE slug = 'excel' AND (title ILIKE '%expert%' OR title ILIKE '%experto%');

UPDATE public.courses
SET title = 'Análisis de Datos'
WHERE slug = 'analisis-de-datos' AND title = 'Curso de Análisis de Datos';
