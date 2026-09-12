import type { Metadata } from "next";
import GlosarioClient from "./GlosarioClient";
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE, jsonLdString, twitterShare } from "@/lib/seo";

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
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterShare(
    "Glosario de términos de datos",
    "Diccionario de SQL, Power BI, DAX, Python y Machine Learning. Definiciones claras para analistas y profesionales de datos en Chile."
  ),
};

export default function GlosarioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Glosario", path: "/glosario" },
            ])
          ),
        }}
      />
      <GlosarioClient />
    </>
  );
}
