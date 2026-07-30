import { createClient } from "@supabase/supabase-js";

/**
 * Compat layer for Maverlang chat code that imports `@/lib/supabase`.
 * Uses ProgramBI env names with Maverlang fallbacks.
 */
function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
}

function getAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-key"
  );
}

function getServiceRoleKey() {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  );
}

export const supabase = createClient(getSupabaseUrl(), getAnonKey());

/** Server-side client with service role (bypasses RLS). */
export function createServiceClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: { persistSession: false },
  });
}
