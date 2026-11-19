import type { Metadata } from "next";
import { SenceObservatorio } from "@/components/datos/SenceObservatorio";
import data from "@/data/datos-fase3/sence.json";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: { absolute: "Capacitación en Chile: cifras SENCE por región" },
  description: `Explora las participaciones en cursos de capacitación mediante franquicia tributaria por región en ${data.year}, con datos oficiales del Anuario SENCE en Chile.`,
  alternates: { canonical: "https://www.programbi.com/datos/capacitacion" },
  robots: { index: true, follow: true },
};

export default function CapacitacionPage() {
  const structured = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Datos de Chile", item: "https://www.programbi.com/datos" },
      { "@type": "ListItem", position: 2, name: "Capacitación", item: "https://www.programbi.com/datos/capacitacion" },
    ] },
    { "@context": "https://schema.org", "@type": "Dataset", name: `Capacitación por franquicia tributaria en Chile ${data.year}`, description: data.methodology, creator: { "@type": "Organization", name: "SENCE" }, isBasedOn: data.source, temporalCoverage: `${data.year}`, spatialCoverage: "Chile", variableMeasured: ["Participaciones totales", "Participaciones aprobadas"], distribution: { "@type": "DataDownload", encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", contentUrl: data.source } },
  ];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} /><SenceObservatorio /></>;
}
