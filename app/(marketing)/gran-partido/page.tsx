import type { Metadata } from "next";
import GranPartidoClient from "./GranPartidoClient";
import { DEFAULT_OG_IMAGE, twitterShare } from "@/lib/seo";

export const metadata: Metadata = {
  title: "¿Quién ganará la final? — Predice y gana un curso",
  description:
    "¿Quién ganará la final? España o Argentina. Predice el resultado como miembro de ProgramBI y participa por un curso a tu elección.",
  alternates: { canonical: "/gran-partido" },
  openGraph: {
    title: "¿Quién ganará la final? — Predice y gana un curso",
    description:
      "Predice quién se lleva la final entre España y Argentina. Si aciertas, entras al sorteo de un curso a tu elección.",
    type: "website",
    url: "https://www.programbi.com/gran-partido",
    siteName: "ProgramBI",
    locale: "es_CL",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterShare(
    "¿Quién ganará la final? — Predice y gana un curso",
    "Predice el resultado entre España y Argentina y participa por un curso de ProgramBI."
  ),
};

export default function GranPartidoPage() {
  return <GranPartidoClient />;
}
