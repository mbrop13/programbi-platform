-- ============================================
-- ADD SUBSCRIPTION COLUMNS TO PROFILES
-- Date: 2026-07-10
-- Description: Adds missing columns `subscription_plan` and `subscription_expires_at`
--              to public.profiles table to support admin subscription management.
-- ============================================

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ DEFAULT NULL;
