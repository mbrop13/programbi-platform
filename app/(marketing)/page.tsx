import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import CoursesSection from "@/components/marketing/CoursesSection";
import GallerySection from "@/components/marketing/GallerySection";
import DiagnosticSection from "@/components/marketing/DiagnosticSection";
import MentorsSection from "@/components/marketing/MentorsSection";
import FounderSection from "@/components/marketing/FounderSection";
import FaqSection from "@/components/marketing/FaqSection";
import ContactSection from "@/components/marketing/ContactSection";
import CtaBanner from "@/components/marketing/CtaBanner";

// FAQ JSON-LD for Google Rich Results (FAQ Snippet)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Necesito tener conocimientos previos de programación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, en absoluto. Nuestra metodología está diseñada para que puedas empezar desde cero. Te guiaremos paso a paso para que adquieras todos los fundamentos de la programación y el análisis de datos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo es la modalidad de las clases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El bootcamp se imparte en modalidad online con clases en directo. Esto te permite interactuar con los profesores y compañeros en tiempo real. Además, todas las clases quedan grabadas para que puedas repasarlas cuando quieras en nuestro campus virtual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si no puedo asistir a una clase en directo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hay problema. Todas las clases en directo se graban y se suben a nuestra plataforma. Tendrás acceso ilimitado a las grabaciones y a todo el material del curso para que puedas estudiar a tu propio ritmo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Recibiré un certificado al finalizar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Al completar cada módulo obtendrás un certificado y, al finalizar el bootcamp y presentar tu Capstone Project, recibirás el certificado final que acredita todas las competencias adquiridas.",
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
      <CoursesSection />
      <GallerySection />
      <DiagnosticSection />
      <MentorsSection />
      <FounderSection />
      <FaqSection />
      <CtaBanner />
      <ContactSection />
    </>
  );
}
