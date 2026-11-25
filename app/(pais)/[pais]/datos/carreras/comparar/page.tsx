import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { ComparadorCarrerasCo } from "@/components/datos-co/carreras/ComparadorCarrerasCo";
import { getMetaCarrerasCo, getProgramasCo } from "@/lib/datos-co/carreras";
import { pesosCo } from "@/lib/datos-co/formato";
import {
  MIGAS_CARRERAS_CO,
  breadcrumbJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
  webApplicationJsonLdCo,
} from "@/lib/datos-co/seo";
import type { PreguntaFaqCo } from "@/lib/datos-co/textos";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "co" }];
}

const TITLE = "Comparar carreras en Colombia: sueldos y salida laboral (OLE)";
const DESCRIPTION =
  "Compara hasta 3 carreras universitarias, tecnológicas o técnicas de Colombia lado a lado: mediana salarial COP 2026, % con 4+ SMMLV, cotizantes y sector oficial vs privado.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") notFound();

  return metadataDatosCo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/co/datos/carreras/comparar",
    rutaHreflang: "/datos/carreras/comparar",
    keywords: [
      "comparar carreras colombia",
      "comparador sueldos carreras colombia",
      "ole comparar programas",
    ],
  });
}

const FAQS: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿Qué indicadores puedo comparar entre carreras de Colombia?",
    respuesta:
      "Puedes comparar mediana salarial en COP 2026 y en SMMLV, promedio salarial, porcentaje de graduados cotizantes con 4 SMMLV o más, cantidad de cotizantes OLE, graduados SNIES 2025 y brecha entre instituciones oficiales y privadas.",
  },
  {
    pregunta: "¿Por qué algunas carreras no muestran comparativa Oficial vs Privado?",
    respuesta:
      "Solo publicamos el desglose por sector cuando tanto las instituciones oficiales como las privadas alcanzan al menos 30 graduados cotizantes en el OLE para evitar sesgos de muestra pequeña.",
  },
];

export default async function CompararCarrerasColombiaPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();
  const programas = getProgramasCo();

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: "Comparar", path: "/co/datos/carreras/comparar" },
  ] as const;

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    webApplicationJsonLdCo({
      name: "Comparador de carreras en Colombia (OLE)",
      description: DESCRIPTION,
      path: "/co/datos/carreras/comparar",
      applicationCategory: "EducationalApplication",
    }),
    faqJsonLdCo(FAQS),
  ];

  return (
    <div className="bg-background">
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        <MigasDatos migas={migas} />

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Hasta 3 programas lado a lado</Badge>
            <Badge variant="outline">SMMLV 2026: {pesosCo(meta.smmlv_2026_cop)}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comparador de carreras en Colombia: sueldos y salida laboral
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Elige hasta 3 programas publicados por el OLE y compara su mediana salarial en COP
            2026, porcentaje con 4 SMMLV o más, volumen de graduados cotizantes y sector IES.
          </p>
          <Link
            href="/co/datos/carreras"
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al observatorio de carreras
          </Link>
        </header>

        <ComparadorCarrerasCo programas={programas} />

        <CtaDatosCo
          pagina="/co/datos/carreras/comparar"
          ctaPosition="comparar_co"
        />

        <FaqDatos faqs={FAQS} />
      </div>
    </div>
  );
}
