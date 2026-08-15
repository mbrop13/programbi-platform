import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityLanding from "@/components/comunidad/CommunityLanding";

export default async function ComunidadPage() {
  const profile = await getCurrentUserProfile();

  // /comunidad siempre muestra la landing (no redirige al portal)
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="page-reveal" data-page-reveal>
        <CommunityLanding isLoggedIn={!!profile} />
      </main>
      <Footer />
    </div>
  );
}
