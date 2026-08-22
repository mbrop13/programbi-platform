import type { Metadata } from "next";
import LandingHero from "@/components/empleos/landing/LandingHero";
import Manifesto from "@/components/empleos/landing/Manifesto";
import StatsCine from "@/components/empleos/landing/StatsCine";
import CandidatesSection from "@/components/empleos/landing/CandidatesSection";
import CompaniesSection from "@/components/empleos/landing/CompaniesSection";
import SkillsMarquee from "@/components/empleos/landing/SkillsMarquee";
import FaqLanding from "@/components/empleos/landing/FaqLanding";
import FinalCta from "@/components/empleos/landing/FinalCta";

export const metadata: Metadata = {
  title: "Bolsa de Trabajo",
  description:
    "La bolsa de trabajo de datos de ProgramBI: perfiles estilo LinkedIn con certificados verificados. Pre-inscripción abierta para candidatos y empresas.",
  alternates: { canonical: "/empleos" },
  openGraph: {
    title: "Bolsa de Trabajo ProgramBI — Lanzamiento pronto",
    description:
      "Candidatos con certificados verificados en Python, Power BI y SQL. Empresas: publica gratis durante el lanzamiento.",
    url: "/empleos",
  },
};

/**
 * Landing de pre-lanzamiento de la Bolsa de Trabajo (cinemática).
 * Al lanzar oficialmente: mover este archivo (p. ej. a /empleos/lanzamiento)
 * y devolver el listado a /empleos desde app/(marketing)/empleos/vacantes.
 */
export default function EmpleosLandingPage() {
  return (
    <>
      <LandingHero />
      <Manifesto />
      <StatsCine />
      <CandidatesSection />
      <CompaniesSection />
      <SkillsMarquee />
      <FaqLanding />
      <FinalCta />
    </>
  );
}
