-- ============================================
-- MIGRATION: Notifications + Projects System
-- Date: 2026-07-02
-- ============================================

-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'like', 'mention', 'announcement', 'course', 'achievement', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast unread count queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read, created_at DESC);

-- Index for fetching recent notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_recent 
  ON public.notifications(user_id, created_at DESC) 
  WHERE is_read = FALSE;

-- RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert notifications (via service role or triggers)
-- No explicit INSERT policy needed since we use service_role in server actions

-- ============================================
-- 2. PROJECTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug TEXT NOT NULL REFERENCES public.courses(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  language TEXT,
  xp_reward INTEGER DEFAULT 100,
  accepts_files BOOLEAN DEFAULT FALSE,
  allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'txt', 'md', 'json', 'csv', 'xlsx', 'pbix', 'png', 'jpg', 'jpeg'],
  max_file_size_mb INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching published projects by course
CREATE INDEX IF NOT EXISTS idx_projects_course_published 
  ON public.projects(course_slug, is_published, sort_order)
  WHERE is_published = TRUE;

-- RLS Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view published projects
CREATE POLICY "Anyone can view published projects"
  ON public.projects
  FOR SELECT
  USING (is_published = TRUE);

-- Only admins can manage projects
CREATE POLICY "Admins can manage projects"
  ON public.projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 3. PROJECT_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Code submission (for coding projects)
  code TEXT,
  execution_result JSONB,
  test_results JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  
  -- File submission (for file-based projects)
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  
  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'auto_graded', 'reviewed', 'completed')) DEFAULT 'draft',
  feedback TEXT,
  
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each user can only have one submission per project
  UNIQUE(project_id, user_id)
);

-- Index for fetching submissions by project (admin view)
CREATE INDEX IF NOT EXISTS idx_submissions_project 
  ON public.project_submissions(project_id, submitted_at DESC);

-- Index for fetching user's submissions
CREATE INDEX IF NOT EXISTS idx_submissions_user 
  ON public.project_submissions(user_id, submitted_at DESC);

-- Index for completed submissions (for progress tracking)
CREATE INDEX IF NOT EXISTS idx_submissions_completed 
  ON public.project_submissions(project_id, user_id)
  WHERE status = 'completed';

-- RLS Policies
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.project_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON public.project_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions"
  ON public.project_submissions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.project_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admins can update submissions (for grading)
CREATE POLICY "Admins can update submissions"
  ON public.project_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 4. STORAGE BUCKET FOR PROJECT FILES
-- ============================================

-- Create storage bucket for project submissions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-submissions',
  'project-submissions',
  TRUE,
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can upload files to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-submissions' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can view files in their own folder
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-submissions' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete files in their own folder
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'project-submissions' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all files
CREATE POLICY "Admins can view all files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-submissions'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$;

-- Function to mark all notifications as read for current user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE user_id = auth.uid() AND is_read = FALSE;
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*) INTO count
  FROM public.notifications
  WHERE user_id = auth.uid() AND is_read = FALSE;
  
  RETURN count;
END;
$$;

-- ============================================
-- 6. UPDATED_AT TRIGGERS
-- ============================================

-- Trigger for notifications
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notifications_updated_at();

-- Trigger for projects
CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_projects_updated_at();

-- Trigger for project_submissions
CREATE OR REPLACE FUNCTION public.update_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_submissions_updated_at
  BEFORE UPDATE ON public.project_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_submissions_updated_at();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
