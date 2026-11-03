import type { Metadata } from "next";
import WebinarClient from "./WebinarClient";
import { tituloSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: tituloSeo("Webinar: de Excel a analista de datos") },
  description:
    "Descubre el roadmap que usan los analistas mejor pagados. Aprende cómo SQL, Power BI, Python e IA pueden transformar tu carrera profesional. Evento en vivo y gratuito.",
  alternates: { canonical: "/webinar" },
};

export default function WebinarPage() {
  return <WebinarClient />;
}
