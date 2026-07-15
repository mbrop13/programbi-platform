import type { Metadata } from "next";
import GranPartidoClient from "./GranPartidoClient";

export const metadata: Metadata = {
  title: "El Gran Partido — Predice y gana un curso | ProgramBI",
  description:
    "¿Quién ganará el gran partido? España o Argentina. Predice el resultado como miembro de ProgramBI y participa por un curso a tu elección.",
  openGraph: {
    title: "El Gran Partido — Predice y gana un curso | ProgramBI",
    description:
      "Predice quién se lleva el gran partido entre España y Argentina. Si aciertas, entras al sorteo de un curso a tu elección.",
    type: "website",
  },
};

export default function GranPartidoPage() {
  return <GranPartidoClient />;
}
