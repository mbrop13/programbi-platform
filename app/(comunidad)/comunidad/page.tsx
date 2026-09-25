import type { Metadata } from "next";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityLanding from "@/components/comunidad/CommunityLanding";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Una clase semanal en vivo que queda grabada. Un solo plan de $29.990 al mes. La suscripción empieza a correr desde la primera clase.",
};

export default async function ComunidadPage() {
  const profile = await getCurrentUserProfile();

  // /comunidad siempre muestra la landing (no redirige al portal)
  return (
    <div className="min-h-dvh bg-canvas">
      <Navbar />
      <main>
        <CommunityLanding isLoggedIn={!!profile} />
      </main>
      <Footer />
    </div>
  );
}
