import { FREE_PREVIEW_ACCESS_ENABLED } from "@/lib/data/community-flags";

export type Access = "full" | "trial" | "free" | "locked";

export type AccessProfile = {
  role?: string | null;
  subscription_plan?: string | null;
  subscription_expires_at?: string | null;
  is_on_trial?: boolean | null;
};

export function subscriptionIsActive(profile: AccessProfile | null | undefined): boolean {
  if (!profile?.subscription_plan) return false;
  if (!profile.subscription_expires_at) return true;
  return new Date(profile.subscription_expires_at) >= new Date();
}

export function canAccessFull(
  profile: AccessProfile | null | undefined,
  isAdmin: boolean
): boolean {
  return isAdmin || subscriptionIsActive(profile);
}

export function communityAccess(options: {
  isAdmin: boolean;
  profile: AccessProfile | null | undefined;
  enrollmentAccess?: Access | string | null;
  isHiddenCourse?: boolean;
}): Access {
  const { isAdmin, profile, enrollmentAccess, isHiddenCourse } = options;
  if (isAdmin) return "full";
  if (enrollmentAccess === "full") return "full";
  if (isHiddenCourse) {
    if (enrollmentAccess === "trial") return "trial";
    if (enrollmentAccess === "free") return "free";
    return enrollmentAccess === "full" ? "full" : "locked";
  }
  if (canAccessFull(profile, isAdmin)) return "full";
  if (profile?.is_on_trial || enrollmentAccess === "trial") return "trial";
  if (enrollmentAccess === "free" || FREE_PREVIEW_ACCESS_ENABLED) return "free";
  return "locked";
}

export function lessonUnlocked(
  access: Access,
  lesson: { is_free_preview?: boolean | null },
  indexInCourse: number
): boolean {
  if (access === "full") return true;
  if (access === "locked") return false;
  if (access === "trial") return indexInCourse < 2;
  return lesson.is_free_preview === true;
}
