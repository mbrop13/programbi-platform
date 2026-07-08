-- ════════════════════════════════════════════════════════════════════════
-- Migración para soportar importación manual y masiva de certificados
-- ════════════════════════════════════════════════════════════════════════

-- 1. Quitar la restricción de obligatoriedad para user_id y course_id
ALTER TABLE public.certificates ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.certificates ALTER COLUMN course_id DROP NOT NULL;

-- 2. Agregar nuevas columnas de respaldo
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS course_title TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS student_name TEXT;

-- 3. Backfillear datos existentes en perfiles y cursos
UPDATE public.certificates c
SET 
  email = COALESCE(c.email, p.email),
  student_name = COALESCE(c.student_name, p.full_name),
  course_title = COALESCE(c.course_title, co.title)
FROM public.profiles p
LEFT JOIN public.courses co ON TRUE
WHERE c.user_id = p.id AND (co.id = c.course_id OR c.course_id IS NULL)
  AND (c.email IS NULL OR c.student_name IS NULL OR c.course_title IS NULL);

-- Para registros que aún queden con NULL por inconsistencias en perfiles o cursos de prueba:
UPDATE public.certificates c 
SET email = 'unknown@programbi.com' 
WHERE email IS NULL;

UPDATE public.certificates c 
SET student_name = 'Estudiante ProgramBI' 
WHERE student_name IS NULL;

UPDATE public.certificates c 
SET course_title = 'Curso Completo' 
WHERE course_title IS NULL;

-- 4. Establecer las columnas como NOT NULL
ALTER TABLE public.certificates ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.certificates ALTER COLUMN student_name SET NOT NULL;
ALTER TABLE public.certificates ALTER COLUMN course_title SET NOT NULL;

-- 5. Eliminar la antigua clave de unicidad compuesta por IDs
ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS certificates_user_id_course_id_key;

-- Eliminar duplicados para evitar fallas al crear el nuevo índice de unicidad
DELETE FROM public.certificates a
USING public.certificates b
WHERE a.id < b.id 
  AND a.email = b.email 
  AND a.course_title = b.course_title;

-- 6. Crear la nueva restricción única basada en email y course_title
ALTER TABLE public.certificates ADD CONSTRAINT certificates_email_course_title_key UNIQUE (email, course_title);

-- 7. Actualizar la política de RLS para lectura de certificados
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (
    auth.uid() = user_id 
    OR email = auth.jwt() ->> 'email'
    OR email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );
