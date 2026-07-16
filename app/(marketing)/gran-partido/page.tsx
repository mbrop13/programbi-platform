import type { Metadata } from "next";
import GranPartidoClient from "./GranPartidoClient";

export const metadata: Metadata = {
  title: "¿Quién ganará la final? — Predice y gana un curso",
  description:
    "¿Quién ganará la final? España o Argentina. Predice el resultado como miembro de ProgramBI y participa por un curso a tu elección.",
  openGraph: {
    title: "¿Quién ganará la final? — Predice y gana un curso | ProgramBI",
    description:
      "Predice quién se lleva la final entre España y Argentina. Si aciertas, entras al sorteo de un curso a tu elección.",
    type: "website",
    url: "https://programbi.com/gran-partido",
    siteName: "ProgramBI",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Quién ganará la final? — Predice y gana un curso | ProgramBI",
    description:
      "Predice el resultado entre España y Argentina y participa por un curso de ProgramBI.",
  },
};

export default function GranPartidoPage() {
  return <GranPartidoClient />;
}
