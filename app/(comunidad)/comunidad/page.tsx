import type { Metadata } from "next";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityLanding from "@/components/comunidad/CommunityLanding";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Clases prácticas semanales para decidir en administración: informes comerciales, control de gestión, proyectos y finanzas, con Power BI, Python y SQL Server. Promoción $29.990 al mes, para siempre.",
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
