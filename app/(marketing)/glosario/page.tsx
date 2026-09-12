import type { Metadata } from "next";
import GlosarioClient from "./GlosarioClient";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glosario de términos de datos",
  description:
    "Diccionario de SQL, Power BI, DAX, Python y Machine Learning. Definiciones claras para analistas y profesionales de datos en Chile.",
  alternates: { canonical: "/glosario" },
  openGraph: {
    title: "Glosario de términos de datos",
    description:
      "Diccionario de SQL, Power BI, DAX, Python y Machine Learning. Definiciones claras para analistas y profesionales de datos en Chile.",
    url: absoluteUrl("/glosario"),
    type: "website",
  },
};

export default function GlosarioPage() {
  return <GlosarioClient />;
}
