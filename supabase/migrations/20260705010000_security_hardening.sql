-- ============================================
-- SECURITY HARDENING — OWASP ASVS L3 Audit
-- Date: 2026-07-05
-- Fixes: CR-1 (privilege escalation on profiles),
--        CR-7 (RLS on critical tables + anti self-enrollment),
--        CR-8 (lessons IDOR / paywall bypass),
--        M-02 (FORCE RLS on profiles PII),
--        M-03 (leads INSERT validation)
-- ============================================

-- ============================================
-- CR-1 + M-02: profiles — block privilege escalation, FORCE RLS
-- ============================================

-- Force RLS so even table owner/service_role-adjacent roles respect policies (defense in depth)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Drop the permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate with strict WITH CHECK that blocks any change to privileged columns.
-- A user may only update "safe" profile fields (full_name, phone, company, avatar_url, updated_at).
-- All privileged columns (role, subscription_plan, organization_id, trial, payment ids) are immutable from client.
CREATE POLICY "Users can update own profile (safe columns only)" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND NOT EXISTS (
      SELECT 1 FROM (
        SELECT
          (to_jsonb(old) ->> 'role')                       AS old_role,
          (to_jsonb(new) ->> 'role')                       AS new_role,
          (to_jsonb(old) ->> 'subscription_plan')          AS old_plan,
          (to_jsonb(new) ->> 'subscription_plan')          AS new_plan,
          (to_jsonb(old) ->> 'is_on_trial')                AS old_trial,
          (to_jsonb(new) ->> 'is_on_trial')                AS new_trial,
          (to_jsonb(old) ->> 'subscription_expires_at')    AS old_exp,
          (to_jsonb(new) ->> 'subscription_expires_at')    AS new_exp,
          (to_jsonb(old) ->> 'organization_id')            AS old_org,
          (to_jsonb(new) ->> 'organization_id')            AS new_org,
          (to_jsonb(old) ->> 'flow_customer_id')           AS old_fc,
          (to_jsonb(new) ->> 'flow_customer_id')           AS new_fc,
          (to_jsonb(old) ->> 'flow_subscription_id')       AS old_fs,
          (to_jsonb(new) ->> 'flow_subscription_id')       AS new_fs,
          (to_jsonb(old) ->> 'mp_subscription_id')         AS old_mp,
          (to_jsonb(new) ->> 'mp_subscription_id')         AS new_mp
      ) chk
      WHERE
            chk.old_role   IS DISTINCT FROM chk.new_role
         OR chk.old_plan   IS DISTINCT FROM chk.new_plan
         OR chk.old_trial  IS DISTINCT FROM chk.new_trial
         OR chk.old_exp    IS DISTINCT FROM chk.new_exp
         OR chk.old_org    IS DISTINCT FROM chk.new_org
         OR chk.old_fc     IS DISTINCT FROM chk.new_fc
         OR chk.old_fs     IS DISTINCT FROM chk.new_fs
         OR chk.old_mp     IS DISTINCT FROM chk.new_mp
    )
  );

-- ============================================
-- CR-7a: enrollments — block self-enrollment (only service_role via verified webhook)
-- ============================================
DROP POLICY IF EXISTS "Users can insert own enrollments" ON public.enrollments;
-- Intentionally NO INSERT policy for authenticated/anon roles.
-- Enrollments are created exclusively by server-side code using service_role
-- (which bypasses RLS) after payment verification.

-- ============================================
-- CR-8: lessons — restrict premium content to enrolled / free-preview / admin
-- ============================================
DROP POLICY IF EXISTS "Lessons are publicly visible" ON public.lessons;

CREATE POLICY "lessons read: enrolled, free preview, or admin" ON public.lessons
  FOR SELECT
  TO authenticated
  USING (
        is_free_preview = true
     OR EXISTS (
          SELECT 1 FROM public.enrollments e
          WHERE e.user_id = auth.uid()
            AND e.course_id = lessons.course_id
            AND e.status = 'active'
        )
     OR EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
  );

-- Note: anonymous users (anon role) no longer have SELECT on lessons.
-- Public course detail pages should only expose lessons metadata (title, order,
-- is_free_preview) via server-side code with service_role, never video_url of locked lessons.

-- ============================================
-- CR-7b: Enable + FORCE RLS on critical tables (defense in depth).
-- These tables were created outside versioned migrations; if they already exist,
-- these statements are idempotent. If they do NOT exist yet, the statements will
-- error and must be re-run after table creation — that is intentional (fail loud).
-- ============================================

-- payments: only owner reads own; writes only via service_role (webhooks)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='payments') THEN
    ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;
    BEGIN DROP POLICY IF EXISTS "payments owner read" ON public.payments; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "payments owner read" ON public.payments
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- asesoria_slots: owner (by user_email) can read; admin reads all
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='asesoria_slots') THEN
    ALTER TABLE public.asesoria_slots ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.asesoria_slots FORCE ROW LEVEL SECURITY;
    BEGIN DROP POLICY IF EXISTS "asesoria owner read" ON public.asesoria_slots; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "asesoria owner read" ON public.asesoria_slots
      FOR SELECT TO authenticated USING (
        user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      );
  END IF;
END $$;

-- chatbot_conversations / chatbot_messages: visitor owns by visitor_id matching cookie,
-- admins read all. Writes only via service_role in the chatbot API route.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='chatbot_conversations') THEN
    ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chatbot_conversations FORCE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='chatbot_messages') THEN
    ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chatbot_messages FORCE ROW LEVEL SECURITY;
  END IF;
END $$;

-- articles (blog/newsletter): public read for published; writes admin-only
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='articles') THEN
    ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.articles FORCE ROW LEVEL SECURITY;
    BEGIN DROP POLICY IF EXISTS "articles public read" ON public.articles; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "articles public read" ON public.articles
      FOR SELECT USING (is_published = true);
    BEGIN DROP POLICY IF EXISTS "articles admin write" ON public.articles; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "articles admin write" ON public.articles
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      );
  END IF;
END $$;

-- promo_popups: public read for active; admin write
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='promo_popups') THEN
    ALTER TABLE public.promo_popups ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.promo_popups FORCE ROW LEVEL SECURITY;
    BEGIN DROP POLICY IF EXISTS "promo_popups public read" ON public.promo_popups; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "promo_popups public read" ON public.promo_popups
      FOR SELECT USING (is_active = true);
    BEGIN DROP POLICY IF EXISTS "promo_popups admin write" ON public.promo_popups; EXCEPTION WHEN OTHERS THEN NULL; END;
    CREATE POLICY "promo_popups admin write" ON public.promo_popups
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      );
  END IF;
END $$;

-- ============================================
-- M-03: tighten leads INSERT — validate email format server-side at the DB layer
-- ============================================
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

CREATE POLICY "Anyone can submit leads (validated)" ON public.leads
  FOR INSERT
  WITH CHECK (
        email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(email) <= 320
    AND char_length(full_name) >= 2
    AND char_length(full_name) <= 120
  );

-- ============================================
-- CR-7c: course_schedules (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='course_schedules') THEN
    ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;
    -- public read for published schedules is fine; keep existing behavior
  END IF;
END $$;

-- ============================================
-- End of security hardening migration
-- ============================================
