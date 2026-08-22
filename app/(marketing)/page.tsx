import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import Metrics from "@/components/marketing/Metrics";
import Flagship from "@/components/marketing/Flagship";
import Programs from "@/components/marketing/Programs";
import JobsBanner from "@/components/marketing/JobsBanner";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import LeadForm from "@/components/marketing/LeadForm";

export const revalidate = 3600;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Necesito saber programar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Partimos desde cero. La metodología está pensada para profesionales de finanzas, operaciones, minería y administración que quieren trabajar con datos sin depender de TI.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo son las clases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En vivo por Zoom, dos horas por sesión, en horario vespertino Chile. Todas las clases quedan grabadas de por vida.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si falto a una clase?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ves la grabación cuando quieras. El material y las clases quedan en el campus sin límite de tiempo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay certificado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Al finalizar el curso recibes un certificado digital.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <LogoSlider />
      <Metrics />
      <Flagship />
      <Programs />
      <JobsBanner />
      <Team />
      <Quote />
      <FaqSection />
      <LeadForm />
    </>
  );
}
