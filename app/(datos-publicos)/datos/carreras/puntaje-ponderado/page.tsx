import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Badge } from "@/components/ui/badge";
import { CalculadoraPonderado } from "@/components/datos/CalculadoraPonderado";
import { FaqDatos } from "@/components/datos/FaqDatos";
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
            Simulador PAES · Edición {meta.edicion}
          </Badge>
          <h1 className="h1-datos text-foreground">Calculadora de puntaje ponderado PAES</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Ingresa tus puntajes de NEM, Ranking y PAES para simular tu puntaje ponderado con las
            ponderaciones reales de las universidades en Chile.
          </p>
        </header>
      </div>

      <CalculadoraPonderado />

      <FaqDatos faqs={FAQS} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/datos/carreras" className="font-medium text-blue-700 hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link href="/datos/carreras/test" className="font-medium text-blue-700 hover:underline">
          Explorar carreras en 5 pasos →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
