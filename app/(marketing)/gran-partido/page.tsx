import type { Metadata } from "next";
import GranPartidoClient from "./GranPartidoClient";

export const metadata: Metadata = {
  title: "¿Quién ganará la final? — Predice y gana un curso | ProgramBI",
  description:
    "¿Quién ganará la final? España o Argentina. Predice el resultado como miembro de ProgramBI y participa por un curso a tu elección.",
  openGraph: {
    title: "¿Quién ganará la final? — Predice y gana un curso | ProgramBI",
    description:
      "Predice quién se lleva la final entre España y Argentina. Si aciertas, entras al sorteo de un curso a tu elección.",
    type: "website",
  },
};

export default function GranPartidoPage() {
  return <GranPartidoClient />;
}
