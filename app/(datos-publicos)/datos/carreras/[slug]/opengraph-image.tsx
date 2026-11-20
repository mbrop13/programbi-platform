import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard, type OgBarra } from "@/lib/datos/og-card";
import {
  getCarrera,
  getCarreras,
  getMetaCarreras,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
} from "@/lib/datos/carreras";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Sueldo y empleabilidad de carrera en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getCarreras().map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  const meta = getMetaCarreras();
  const logoSrc = await loadLogoDataUrl();
  const principal = carrera ? tipoPrincipalDeCarrera(carrera) : null;

  const nombre = carrera?.nombre ?? "Carrera en Chile";
  const area = carrera?.area ?? "Datos de Chile";
  const tipoLabel = principal ? TIPO_ETIQUETAS[principal.key].plural : "Educación Superior";
  const ing4 = principal?.data.ing[3] ?? null;
  const emp1 = principal?.data.emp1 ?? null;
  const durReal = principal?.data.dur_real ?? null;

  // Curva real de ingresos 1.º→5.º año (solo puntos publicados en el JSON).
  const barras: OgBarra[] = (principal?.data.ing ?? [])
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v !== null)
    .map(({ v, i }) => ({
      label: `${i + 1}.º año`,
      valor: v,
      valorTexto: pesos(v),
    }));

  return new ImageResponse(
    renderOgCard({
      titulo: nombre,
      cifra: pesos(ing4),
      cifraLabel: "ingreso bruto 4.º año",
      subtitulo: `${area} · Empleabilidad 1.er año: ${porcentaje(emp1)} · Duración real: ${semestres(durReal)}`,
      badge: `${tipoLabel} · Edición ${meta.edicion}`,
      miniVisual:
        barras.length > 0
          ? {
              tipo: "barras",
              caption: `Ingreso bruto por año de titulación · pesos ${meta.pesos_de}`,
              barras,
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: mifuturo.cl (Mineduc)",
      urlCorta: `programbi.com/datos/carreras/${slug}`,
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
