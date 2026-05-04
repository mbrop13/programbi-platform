import type { Metadata } from "next";
import WebinarClient from "./WebinarClient";

export const metadata: Metadata = {
  title: "Webinar Gratuito — De Excel a Analista de Alto Impacto | ProgramBI",
  description:
    "Descubre el roadmap que usan los analistas mejor pagados. Aprende cómo SQL, Power BI, Python e IA pueden transformar tu carrera profesional. Evento en vivo y gratuito.",
};

export default function WebinarPage() {
  return <WebinarClient />;
}
