import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Badge } from "@/components/ui/badge";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TestCarrera } from "@/components/datos/TestCarrera";
import { Skeleton } from "@/components/ui/skeleton";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import {
  breadcrumbsSchema,
  faqPageSchema,
  metadataSimpleDatos,
  MIGAS_BASE,
  webAppSchema,
} from "@/lib/datos/seo-carreras";

export const dynamic = "force-static";

const FAQS = [
  {
    pregunta: "¿Es un test vocacional o psicológico?",
    respuesta:
      "No. No mide aptitudes ni intereses psicológicos: ordena carreras reales publicadas en mifuturo.cl (Mineduc) según tus filtros prácticos (área, presupuesto, PAES, región y jornada) y el peso que le des al ingreso, la empleabilidad y la duración real.",
  },
  {
    pregunta: "¿Qué pasa si salto todas las preguntas?",
    respuesta:
      "Todas las preguntas son opcionales. Si las saltas, igual obtendrás un Top 5 ordenado con la fórmula transparente por defecto (40 % ingreso al 4.º año, 40 % empleabilidad 1.er año y 20 % menor duración real), que puedes ajustar con los controles.",
  },
  {
    pregunta: "¿Por qué a veces aparecen carreras fuera de un filtro?",
    respuesta:
      "Si la combinación de área, presupuesto, PAES, región y jornada deja menos de 5 carreras con datos oficiales completos, la herramienta amplía gradualmente los filtros e indica exactamente qué criterio se relajó.",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos/carreras/test",
    title: "Explorador de carreras en Chile según datos oficiales 2026",
    description:
      "Ordena carreras en Chile en 5 pasos según área, presupuesto, PAES, región y jornada con cifras oficiales de sueldos y empleabilidad de mifuturo.cl.",
  });
}

export default function TestCarrerasPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();

  const migas = [
    ...MIGAS_BASE,
    { label: "Explorador de carreras", path: "/datos/carreras/test" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webAppSchema({
        path: "/datos/carreras/test",
        name: "Explorador de carreras en Chile según datos",
        description:
          "Herramienta de 5 pasos que ordena carreras en Chile según filtros prácticos y ponderación transparente de sueldo, empleabilidad y duración real.",
      }),
      breadcrumbsSchema(migas),
      faqPageSchema(FAQS),
    ],
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-4">
        <MigasDatos migas={migas} />

        <header className="max-w-3xl space-y-2.5">
          <Badge
            variant="secondary"
            className="h-auto rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            Explorador en 5 pasos · Edición {meta.edicion}
          </Badge>
          <h1 className="h1-datos text-foreground">
            ¿Qué carrera conviene explorar según tus prioridades?
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Elige tus áreas de interés, presupuesto, puntaje PAES, región y jornada para ordenar
            carreras reales con datos oficiales de{" "}
            <strong className="font-medium text-foreground">mifuturo.cl</strong>.
          </p>
        </header>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <TestCarrera ranking={ranking} edicion={meta.edicion} />
      </Suspense>

      <FaqDatos faqs={FAQS} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/datos/carreras" className="font-medium text-blue-700 hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link href="/datos/carreras/comparar" className="font-medium text-blue-700 hover:underline">
          Ir al comparador →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
