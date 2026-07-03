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
        {/* ─── HERO (solo título y subtítulo, sin planes) ─── */}
        <SubscriptionGate 
          isLoggedIn={!!profile}
          heroOnly
        />
        {/* ─── LOGOS DE EMPRESAS ─── */}
        <LogoSlider />
        {/* ─── FEATURES ZIGZAG (clases en vivo, material, IA) ─── */}
        <CommunityFeatures />
        {/* ─── TESTIMONIOS ─── */}
        <TestimonialsSection />
        {/* ─── PLANES Y PRECIOS ─── */}
        <SubscriptionGate 
          isLoggedIn={!!profile}
        />
        {/* ─── FAQ ─── */}
        <CommunityFaq />
      </main>
      <Footer />
    </div>
  );
}
