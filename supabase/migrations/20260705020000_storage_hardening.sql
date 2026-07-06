-- ============================================
-- STORAGE HARDENING — OWASP ASVS L3 Audit
-- Date: 2026-07-05
-- Fixes:
--   A-24 / V12.1.1: project-submissions bucket was PUBLIC → make private.
--                   Public buckets serve objects WITHOUT going through RLS,
--                   so anyone with the URL could download student submissions.
--   V12.6.2:        'application/octet-stream' invalidated the MIME allowlist.
--   A-25 (related): tighten allowed MIME types.
-- ============================================

-- Make project-submissions private. Objects must now be served via signed URLs.
UPDATE storage.buckets
SET public = FALSE
WHERE id = 'project-submissions';

-- Replace the MIME allowlist without the wildcard octet-stream.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
    'image/jpg'
]
WHERE id = 'project-submissions';

-- Enforce a per-bucket size limit on the AI attachments bucket too, so that
-- a client cannot bypass the 10MB app-level check by uploading directly via
-- the SDK with its JWT.
UPDATE storage.buckets
SET file_size_limit = 10485760  -- 10MB
WHERE id = 'ai-attachments' AND file_size_limit IS NULL;
