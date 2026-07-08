import { redirect } from "next/navigation";
import { getCurrentUserProfile, isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import ChatShell from "@/components/comunidad/ai-v2/ChatShell";

export default async function AiPage() {
  const profile = await getCurrentUserProfile();
  const isAdmin = await isCurrentUserAdmin();
  const enrollmentData = await getMyEnrollments();

  // If not logged in, redirect to home/login
  if (!profile) {
    redirect("/auth/login");
  }

  const enrollments = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;
  const hasCourses = enrollments && enrollments.length > 0;
  const hasSubscription = !!profile?.subscription_plan && 
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) >= new Date());
  const canAccessFull = isAdmin || hasSubscription;
  const isGuest = !canAccessFull && !hasCourses;

  const restrictedView = !canAccessFull && hasCourses;

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-black">
      <ChatShell
        isRestricted={restrictedView}
        userName={profile.full_name}
        avatarUrl={profile.avatar_url ?? null}
        subscriptionPlan={profile.subscription_plan}
        isAdmin={isAdmin}
        isGuest={isGuest}
      />
    </div>
  );
}
