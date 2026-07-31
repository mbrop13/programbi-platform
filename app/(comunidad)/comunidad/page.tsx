import { redirect } from "next/navigation";
import { getCurrentUserProfile, isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityLanding from "@/components/comunidad/CommunityLanding";
import { FREE_PREVIEW_ACCESS_ENABLED } from "@/lib/data/community-flags";

export default async function ComunidadPage() {
  const profile = await getCurrentUserProfile();
  const isAdmin = await isCurrentUserAdmin();
  const enrollmentData = await getMyEnrollments();
  const enrollments = Array.isArray(enrollmentData)
    ? enrollmentData
    : enrollmentData.enrollments;

  const hasCourses = enrollments && enrollments.length > 0;
  const hasSubscription =
    !!profile?.subscription_plan &&
    (!profile?.subscription_expires_at ||
      new Date(profile.subscription_expires_at) >= new Date());
  const canAccessFull = isAdmin || hasSubscription;

  // Logged-in users go into the portal
  if (profile && (canAccessFull || hasCourses || FREE_PREVIEW_ACCESS_ENABLED)) {
    redirect("/comunidad/cursos");
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <CommunityLanding isLoggedIn={!!profile} />
      </main>
      <Footer />
    </div>
  );
}
