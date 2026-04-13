import { redirect } from "next/navigation";
import { getCurrentUserProfile, isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import SubscriptionGate from "@/components/comunidad/SubscriptionGate";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityBenefits from "@/components/comunidad/CommunityBenefits";
import CommunityFaq from "@/components/comunidad/CommunityFaq";

export default async function ComunidadPage() {
  const profile = await getCurrentUserProfile();
  const isAdmin = await isCurrentUserAdmin();
  const enrollmentData = await getMyEnrollments();
  const enrollments = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;

  const hasCourses = enrollments && enrollments.length > 0;
  const hasSubscription = !!profile?.subscription_plan;
  const canAccessFull = isAdmin || hasSubscription;

  // If the user has access to the community portal (via courses or subscription), send them to the dashboard
  if (canAccessFull || hasCourses) {
    redirect("/comunidad/inicio");
  }

  // If they don't have access, show them the Marketing Subscription Gate page
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-[34px]">
        <SubscriptionGate 
          isLoggedIn={!!profile}
        />
        <CommunityBenefits />
        <CommunityFaq />
      </main>
      <Footer />
    </div>
  );
}
