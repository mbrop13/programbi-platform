import { cache } from "react";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type CampusUser = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  subscription_plan: string | null;
  subscription_expires_at: string | null;
};

export type CampusSession = {
  user: CampusUser | null;
  isAdmin: boolean;
  isOrgManager: boolean;
  hasCourses: boolean;
};

export const getCampusSession = cache(async (): Promise<CampusSession> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false, isOrgManager: false, hasCourses: false };
  }

  const adminDb = createAdminClient();
  const [profileRes, memberRes, orgRes, enrollCountRes] = await Promise.all([
    adminDb
      .from("profiles")
      .select("id, full_name, email, avatar_url, role, subscription_plan, subscription_expires_at")
      .eq("id", user.id)
      .maybeSingle(),
    adminDb
      .from("community_members")
      .select("role")
      .eq("profile_id", user.id)
      .eq("role", "admin")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("organization_managers")
      .select("organization_id")
      .eq("profile_id", user.id)
      .maybeSingle(),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  const profile = profileRes.data;
  const isAdmin = profile?.role === "admin" || !!memberRes.data;

  const campusUser: CampusUser = {
    id: profile?.id || user.id,
    full_name: profile?.full_name || user.email || "Usuario",
    email: profile?.email || user.email || "",
    avatar_url: profile?.avatar_url ?? null,
    role: profile?.role || "student",
    subscription_plan: isAdmin ? profile?.subscription_plan || "ultra" : profile?.subscription_plan ?? null,
    subscription_expires_at: profile?.subscription_expires_at ?? null,
  };

  return {
    user: campusUser,
    isAdmin,
    isOrgManager: !!orgRes.data,
    hasCourses: (enrollCountRes.count || 0) > 0,
  };
});

/** @deprecated Use getCampusSession. Kept as alias during the campus split. */
export const getCampusBootstrap = getCampusSession;
