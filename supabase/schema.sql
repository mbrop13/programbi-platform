-- ============================================
-- ProgramBI LMS — Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor after creating a new project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. COURSES
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  badge_label TEXT,
  badge_color TEXT DEFAULT '#1890FF',
  tech_stack TEXT[],
  duration_hours INTEGER,
  modality TEXT DEFAULT 'online' CHECK (modality IN ('online', 'presencial', 'hibrido')),
  level TEXT DEFAULT 'principiante' CHECK (level IN ('principiante', 'intermedio', 'avanzado')),
  price_clp INTEGER,
  image_url TEXT,
  icon TEXT,
  accent_color TEXT DEFAULT '#1890FF',
  syllabus JSONB,
  what_you_learn TEXT[],
  requirements TEXT[],
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. LESSONS
-- ============================================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  module_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  lesson_order INTEGER NOT NULL,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'document', 'quiz', 'live')),
  video_url TEXT,
  duration_minutes INTEGER,
  content_markdown TEXT,
  resources JSONB,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ENROLLMENTS
-- ============================================
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- ============================================
-- 5. USER PROGRESS
-- ============================================
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percent INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================
-- 6. CERTIFICATES
-- ============================================
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  UNIQUE(user_id, course_id)
);

-- ============================================
-- 7. LEADS (Contact Form)
-- ============================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  interests TEXT[],
  message TEXT,
  source TEXT DEFAULT 'web',
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'convertido')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. MENTORS
-- ============================================
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  credentials TEXT[],
  icon TEXT DEFAULT 'user',
  linkedin_url TEXT,
  image_url TEXT,
  is_founder BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Profiles: users can read their own, admins can read all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses: public read
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are publicly visible" ON public.courses
  FOR SELECT USING (is_published = true);

-- Lessons: public read (for now; restrict premium content later)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are publicly visible" ON public.lessons
  FOR SELECT USING (true);

-- Enrollments: users can see own
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress: users can manage own
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Certificates: users can see own
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Leads: anyone can insert (public form), only admins can read
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Mentors: public read
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are publicly visible" ON public.mentors
  FOR SELECT USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_leads_email ON leads(email);

-- ============================================
-- 9. COMMUNITIES (Comunidad 1.1 Migration)
-- ============================================
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  icon TEXT DEFAULT 'users',
  category TEXT DEFAULT 'General',
  show_title BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. COMMUNITY PLANS
-- ============================================
CREATE TABLE public.community_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_monthly NUMERIC,
  price_annual NUMERIC,
  is_dynamic BOOLEAN DEFAULT false,
  stripe_price_id TEXT,
  trial_days INTEGER DEFAULT 0,
  features JSONB,
  restrictions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. COMMUNITY MEMBERS
-- ============================================
CREATE TABLE public.community_members (
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (community_id, profile_id)
);

-- ============================================
-- 12. POSTS (Community Feed)
-- ============================================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id TEXT DEFAULT 'general',
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. POST COMMENTS
-- ============================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. CHAT CHANNELS
-- ============================================
CREATE TABLE public.chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'support', 'announcement')),
  target_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. CHAT MESSAGES
-- ============================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. SUPER CLASS NOTES
-- ============================================
CREATE TABLE public.super_class_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, lesson_id)
);

-- ============================================
-- 17. AI CONVERSATIONS
-- ============================================
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nueva Conversación',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 18. AI MESSAGES
-- ============================================
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are publicly visible if is_public=true" ON public.communities FOR SELECT USING (is_public = true);

-- Community Plans
ALTER TABLE public.community_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Community plans are publicly visible" ON public.community_plans FOR SELECT USING (true);

-- Community Members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view members of communities they joined" ON public.community_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm WHERE cm.community_id = community_id AND cm.profile_id = auth.uid()
  ) OR auth.uid() = profile_id
);

-- Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view posts in their communities" ON public.posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm WHERE cm.community_id = community_id AND cm.profile_id = auth.uid()
  )
);
CREATE POLICY "Users can insert posts in their communities" ON public.posts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.community_members cm WHERE cm.community_id = community_id AND cm.profile_id = auth.uid()
  ) AND auth.uid() = author_id
);

-- Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view comments on accessible posts" ON public.comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.community_members cm ON p.community_id = cm.community_id
    WHERE p.id = post_id AND cm.profile_id = auth.uid()
  )
);
CREATE POLICY "Users can insert comments on accessible posts" ON public.comments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.community_members cm ON p.community_id = cm.community_id
    WHERE p.id = post_id AND cm.profile_id = auth.uid()
  ) AND auth.uid() = author_id
);

-- Chat Channels & Messages (Basic access, to be refined if needed)
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view channels in their communities" ON public.chat_channels FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.community_members cm WHERE cm.community_id = community_id AND cm.profile_id = auth.uid()
  )
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in accessible channels" ON public.chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_channels ch
    JOIN public.community_members cm ON ch.community_id = cm.community_id
    WHERE ch.id = channel_id AND cm.profile_id = auth.uid()
  )
);
CREATE POLICY "Users can send messages in accessible channels" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_channels ch
    JOIN public.community_members cm ON ch.community_id = cm.community_id
    WHERE ch.id = channel_id AND cm.profile_id = auth.uid()
  ) AND auth.uid() = author_id
);

-- Super Class Notes
ALTER TABLE public.super_class_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only manage their own notes" ON public.super_class_notes FOR ALL USING (auth.uid() = profile_id);

-- AI Conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only manage their own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = profile_id);

-- AI Messages
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own AI messages" ON public.ai_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND c.profile_id = auth.uid()
  )
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_community_members_comm ON community_members(community_id);
CREATE INDEX idx_community_members_prof ON community_members(profile_id);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_chat_channels_comm ON chat_channels(community_id);
CREATE INDEX idx_chat_messages_chan ON chat_messages(channel_id);
CREATE INDEX idx_super_class_notes_prof ON super_class_notes(profile_id);
CREATE INDEX idx_ai_conversations_prof ON ai_conversations(profile_id);
CREATE INDEX idx_ai_messages_conv ON ai_messages(conversation_id);

-- ============================================
-- 19. GLOBAL PROMOTIONS
-- ============================================
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('courses', 'plans', 'all', 'specific_course', 'specific_plan')),
  target_id TEXT,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  is_active BOOLEAN DEFAULT false,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promotions are publicly readable" ON public.promotions FOR SELECT USING (true);
-- Write permissions are restricted to admins through API/Server logic.
