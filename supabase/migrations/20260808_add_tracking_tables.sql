-- ============================================
-- Migration: Add Class & Lesson Tracking Tables
-- ============================================

-- 1. Live Class Attendance Tracking Table
CREATE TABLE IF NOT EXISTS public.live_class_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_heartbeat_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0,
  device_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, user_id)
);

-- 2. Lesson View Logs Table
CREATE TABLE IF NOT EXISTS public.lesson_view_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  watch_duration_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, user_id)
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_live_attendance_class ON public.live_class_attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_user ON public.live_class_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_logs_lesson ON public.lesson_view_logs(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_logs_course ON public.lesson_view_logs(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_logs_user ON public.lesson_view_logs(user_id);

-- Enable RLS
ALTER TABLE public.live_class_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_view_logs ENABLE ROW LEVEL SECURITY;

-- Policies for live_class_attendance
CREATE POLICY "Users can insert/update own live attendance" ON public.live_class_attendance
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all live attendance" ON public.live_class_attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policies for lesson_view_logs
CREATE POLICY "Users can manage own lesson logs" ON public.lesson_view_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all lesson logs" ON public.lesson_view_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
