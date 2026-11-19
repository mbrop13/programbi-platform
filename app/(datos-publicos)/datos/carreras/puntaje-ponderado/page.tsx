import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Calculator } from "lucide-react";
import { CalculadoraPonderado } from "@/components/datos/CalculadoraPonderado";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { getMetaCarreras } from "@/lib/datos/carreras";
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
    pregunta: "¿Cómo se calcula el puntaje ponderado?",
    respuesta:
      "Se multiplica cada puntaje (NEM, Ranking y pruebas PAES) por el porcentaje de ponderación definido por la universidad para ese programa específico y se suman. Cuando Historia y Ciencias aparecen ambas con ponderación, el sistema toma automáticamente tu mejor puntaje entre las dos.",
  },
  {
    pregunta: "¿Las ponderaciones mostradas sirven para la Admisión 2027?",
    respuesta:
      "Las ponderaciones mostradas corresponden a las informadas en el Buscador de Carreras 2025–2026 de mifuturo.cl. Antes de postular, confirma las ponderaciones vigentes en la Oferta Definitiva del DEMRE para la Admisión 2027.",
  },
  {
    pregunta: "¿IP y CFT usan puntaje ponderado PAES?",
    respuesta:
      "En general, los Institutos Profesionales (IP) y Centros de Formación Técnica (CFT) no exigen PAES para ingresar, por lo que esta calculadora aplica a programas universitarios que publican ponderaciones.",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos/carreras/puntaje-ponderado",
    title: "Calculadora de puntaje ponderado PAES 2026 | ProgramBI",
    description:
      "Calcula tu puntaje ponderado con NEM, Ranking y PAES aplicando las ponderaciones reales por universidad y carrera en Chile.",
  });
}

export default function PuntajePonderadoPage() {
  const meta = getMetaCarreras();

  const migas = [
    ...MIGAS_BASE,
    { label: "Calculadora de puntaje ponderado", path: "/datos/carreras/puntaje-ponderado" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webAppSchema({
        path: "/datos/carreras/puntaje-ponderado",
        name: "Calculadora de puntaje ponderado PAES",
        description:
          "Simulador de puntaje ponderado usando NEM, Ranking y pruebas PAES según las ponderaciones informadas por carrera y universidad en mifuturo.cl.",
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
          <Calculator className="size-3.5" aria-hidden="true" />
          Simulador PAES · Edición {meta.edicion}
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          Calculadora de puntaje ponderado PAES
        </h1>
        <p className="mt-3 text-base text-[#5c5c58]">
          Ingresa tus puntajes de NEM, Ranking y PAES para simular tu ponderado en programas
          universitarios reales de Chile.
        </p>
      </header>

      <CalculadoraPonderado />

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
        <Link href="/datos/carreras/test" className="font-medium text-[#1890ff] hover:underline">
          Explorar carreras por filtros →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso className="mt-8 border-t border-[#e2e2dc] pt-6" />
    </div>
  );
}
