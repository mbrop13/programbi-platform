-- Migration: Add allow_stacking column to coupons table
-- File: platform/supabase/migrations/20260627000100_add_allow_stacking_to_coupons.sql

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS allow_stacking BOOLEAN DEFAULT false;
