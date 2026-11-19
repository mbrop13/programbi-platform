import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObservatorioJovenes } from "@/components/datos/ObservatorioJovenes";
import { METADATOS } from "@/lib/datos/desempleo";
import { datosJovenes } from "@/lib/datos/desempleo-desgloses";
import { periodo, tasa } from "@/lib/datos/desempleo-formato";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";
const url = `${SITE_URL}/datos/desempleo/jovenes`;
const datos = datosJovenes();
const title = "Desempleo juvenil en Chile: datos del INE";
const description = datos ? `La desocupación de jóvenes de 15 a 24 años fue ${tasa(datos.tasa).replace(" ", " ")} en ${periodo(datos.actual.p)}, según el INE. Explora la evolución y descarga los datos oficiales por edad.` : "Datos oficiales sobre desempleo juvenil en Chile.";
const imagen = `${SITE_URL}/datos/desempleo/og/jovenes?v=${METADATOS.version}`;
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: url }, robots: { index: Boolean(datos), follow: true },
  openGraph: { type: "website", siteName: "ProgramBI", locale: "es_CL", url, title, description, images: [{ url: imagen, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [imagen] },
};
export default function JovenesPage() {
  if (!datos) notFound();
  return <ObservatorioJovenes datos={datos} />;
}
