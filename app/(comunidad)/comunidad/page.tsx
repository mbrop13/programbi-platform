import type { Metadata } from "next";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommunityLanding from "@/components/comunidad/CommunityLanding";
import { getCommunityClasses } from "@/lib/comunidad/community-classes";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Una clase práctica de 2 horas por semana: Clase o Clase avanzada. Informes comerciales, control de gestión, proyectos y finanzas, con Power BI, Python y SQL Server. Promoción $29.990 al mes, para siempre.",
};

export default async function ComunidadPage() {
  const [profile, classes] = await Promise.all([getCurrentUserProfile(), getCommunityClasses()]);

  // /comunidad siempre muestra la landing (no redirige al portal)
  return (
    <div className="min-h-dvh bg-canvas">
      <Navbar />
      <main>
        <CommunityLanding isLoggedIn={!!profile} classes={classes} />
      </main>
      <Footer />
    </div>
  );
}
