import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Compass } from "lucide-react";
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
    title: "Explorador de carreras en Chile según datos oficiales",
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <MigasDatos migas={migas} className="mb-6" />

      <header className="mb-8 max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
          <Compass className="size-3.5" aria-hidden="true" />
          Explorador en 5 pasos · Edición {meta.edicion}
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          ¿Qué carrera conviene explorar según tus datos?
        </h1>
        <p className="mt-3 text-base text-[#5c5c58]">
          Filtra por área, presupuesto, PAES, región y jornada. Fórmula transparente con cifras
          oficiales de <span className="font-medium text-[#171716]">mifuturo.cl</span>.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <TestCarrera ranking={ranking} edicion={meta.edicion} />
      </Suspense>

      <section className="mt-10 rounded-xl border border-[#e2e2dc] bg-white p-6">
        <h2 className="text-lg font-bold text-[#171716]">Preguntas frecuentes</h2>
        <dl className="mt-4 space-y-4">
          {FAQS.map((f) => (
            <div key={f.pregunta} className="border-b border-[#f0f0ec] pb-4 last:border-b-0 last:pb-0">
              <dt className="text-sm font-bold text-[#171716]">{f.pregunta}</dt>
              <dd className="mt-1 text-sm text-[#5c5c58]">{f.respuesta}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/datos/carreras" className="font-medium text-[#1890ff] hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link href="/datos/carreras/comparar" className="font-medium text-[#1890ff] hover:underline">
          Ir al comparador →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso className="mt-8 border-t border-[#e2e2dc] pt-6" />
    </div>
  );
}
