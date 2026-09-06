import type { Metadata } from "next";
import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import Metrics from "@/components/marketing/Metrics";
import PackBand from "@/components/marketing/PackBand";
import Flagship from "@/components/marketing/Flagship";
import ProgramsCatalog from "@/components/marketing/ProgramsCatalog";
import JobsBanner from "@/components/marketing/JobsBanner";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import LeadForm from "@/components/marketing/LeadForm";
import { HOME_FAQS, PACK } from "@/lib/data/pack-adopcion";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Pack Adopción BI y cursos Power BI Chile | ProgramBI" },
  description:
    "Pack Adopción BI: tablero en producción + equipo autónomo. Cursos Power BI, SQL y Python en vivo en Chile. Diagnóstico 30 min. Factura directa.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pack Adopción BI y cursos Power BI Chile | ProgramBI",
    description:
      "Empresas: Pack Adopción BI. Particulares: cursos en vivo. De reportes eternos a decisiones en minutos.",
    url: SITE_URL,
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HeroSection />
      <LogoSlider />
      <PackBand />
      <Metrics />
      <ProgramsCatalog />
      <Flagship />
      <JobsBanner />
      <Team />
      <Quote />
      <FaqSection />
      <LeadForm />
      <p className="sr-only">
        {PACK.name}. {PACK.headline}. {PACK.tagline}.
      </p>
    </>
  );
}
