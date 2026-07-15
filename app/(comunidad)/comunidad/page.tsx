import { redirect } from "next/navigation";
import { getCurrentUserProfile, isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import SubscriptionGate from "@/components/comunidad/SubscriptionGate";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityFeatures from "@/components/comunidad/CommunityFeatures";
import CommunityFaq from "@/components/comunidad/CommunityFaq";
import LogoSlider from "@/components/marketing/LogoSlider";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import FounderSection from "@/components/marketing/FounderSection";

export default async function ComunidadPage() {
  const profile = await getCurrentUserProfile();
  const isAdmin = await isCurrentUserAdmin();
  const enrollmentData = await getMyEnrollments();
  const enrollments = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;

  const hasCourses = enrollments && enrollments.length > 0;
  const hasSubscription = !!profile?.subscription_plan && 
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) >= new Date());
  const canAccessFull = isAdmin || hasSubscription;

  // If they don't have access, show them the Marketing Subscription Gate page
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-0">
        {/* ─── HERO & LOGOS CONTAINER ─── */}
        <div className="relative isolate w-full overflow-hidden bg-white">
          <SubscriptionGate 
            isLoggedIn={!!profile}
            heroOnly
            transparent
            currentPlanId={profile?.subscription_plan}
          />

          <LogoSlider transparent />
        </div>
        {/* ─── FEATURES ZIGZAG (clases en vivo, material, IA) ─── */}
        <CommunityFeatures />
        {/* ─── PLANES Y PRECIOS ─── */}
        <SubscriptionGate 
          isLoggedIn={!!profile}
          currentPlanId={profile?.subscription_plan}
        />
        {/* ─── TESTIMONIOS ─── */}
        <TestimonialsSection />
        {/* ─── EL PROFESOR ─── */}
        <FounderSection />
        {/* ─── FAQ ─── */}
        <CommunityFaq />
      </main>
      <Footer />
    </div>
  );
}
