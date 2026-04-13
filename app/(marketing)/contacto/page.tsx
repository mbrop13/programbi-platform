import type { Metadata } from "next";
import ContactSection from "@/components/marketing/ContactSection";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para solicitar información sobre nuestros cursos de análisis de datos, Power BI, Python, SQL y más.",
};

export default function ContactoPage() {
  return (
    <div className="-mt-20 lg:-mt-24 pt-20 lg:pt-24">
      <ContactSection />
    </div>
  );
}
