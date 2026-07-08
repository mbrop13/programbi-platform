-- ============================================
-- STORAGE SETUP — COURSE LESSON RESOURCES
-- Date: 2026-07-08
-- ============================================

-- Create the course-resources bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-resources',
  'course-resources',
  TRUE,  -- Public bucket so public URLs can resolve directly
  10485760,  -- 10MB file size limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Anyone (students and public) can view or download course resources
DROP POLICY IF EXISTS "Anyone can view course resources" ON storage.objects;
CREATE POLICY "Anyone can view course resources"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-resources');

-- 2. INSERT: Only administrators can upload new resources to the bucket
DROP POLICY IF EXISTS "Admins can insert course resources" ON storage.objects;
CREATE POLICY "Admins can insert course resources"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'course-resources'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 3. UPDATE: Only administrators can update existing resources in the bucket
DROP POLICY IF EXISTS "Admins can update course resources" ON storage.objects;
CREATE POLICY "Admins can update course resources"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'course-resources'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 4. DELETE: Only administrators can delete resources from the bucket
DROP POLICY IF EXISTS "Admins can delete course resources" ON storage.objects;
CREATE POLICY "Admins can delete course resources"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'course-resources'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
