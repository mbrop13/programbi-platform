-- Migration: Add organizations and RLS policies for ProgramBI Business
-- File: platform/supabase/migrations/20260617000000_business_organizations.sql

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Helper Security Definer Functions (Recursion-free)
-- ============================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- Get current user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT organization_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.get_user_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_organization_id() TO service_role;

-- ============================================
-- 2. Core Tables
-- ============================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_managers (
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, profile_id)
);

-- ============================================
-- 3. Profile Column Additions
-- ============================================
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS study_streak INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0;

-- ============================================
-- 4. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS Policies for Organizations
-- ============================================

DROP POLICY IF EXISTS "Admins have full access to organizations" ON public.organizations;
CREATE POLICY "Admins have full access to organizations" ON public.organizations
  FOR ALL TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Managers can view own organization" ON public.organizations;
CREATE POLICY "Managers can view own organization" ON public.organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_managers
      WHERE organization_managers.organization_id = id AND organization_managers.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Employees can view own organization" ON public.organizations;
CREATE POLICY "Employees can view own organization" ON public.organizations
  FOR SELECT TO authenticated
  USING (
    id = public.get_user_organization_id()
  );

-- ============================================
-- 6. RLS Policies for Organization Managers
-- ============================================

DROP POLICY IF EXISTS "Admins have full access to organization managers" ON public.organization_managers;
CREATE POLICY "Admins have full access to organization managers" ON public.organization_managers
  FOR ALL TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Managers can view own manager records" ON public.organization_managers;
CREATE POLICY "Managers can view own manager records" ON public.organization_managers
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Employees can view their organization managers" ON public.organization_managers;
CREATE POLICY "Employees can view their organization managers" ON public.organization_managers
  FOR SELECT TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
  );

-- ============================================
-- 7. RLS Policies for Profiles (coworkers, managers, admins)
-- ============================================

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
CREATE POLICY "Admins can delete all profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Managers can view employee profiles" ON public.profiles;
CREATE POLICY "Managers can view employee profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_managers
      WHERE organization_managers.organization_id = profiles.organization_id AND organization_managers.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Employees can view coworker profiles" ON public.profiles;
CREATE POLICY "Employees can view coworker profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    organization_id IS NOT NULL AND organization_id = public.get_user_organization_id()
  );
