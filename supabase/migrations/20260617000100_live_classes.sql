-- Migration: Add live classes table and security policies
-- File: platform/supabase/migrations/20260617000100_live_classes.sql

-- 1. Create live_classes table
CREATE TABLE IF NOT EXISTS public.live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  room_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'active', 'completed'
  youtube_stream_key TEXT,
  youtube_video_id TEXT,
  livekit_egress_id TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Anyone authenticated can view live classes" ON public.live_classes;
CREATE POLICY "Anyone authenticated can view live classes" 
  ON public.live_classes
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins have full control of live classes" ON public.live_classes;
CREATE POLICY "Admins have full control of live classes" 
  ON public.live_classes
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
