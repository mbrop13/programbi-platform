import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Calculator } from "lucide-react";
import { CalculadoraRetorno } from "@/components/datos/CalculadoraRetorno";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
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
    pregunta: "¿Qué incluye el costo estimado de estudiar una carrera?",
    respuesta:
      "Multiplica el arancel anual 2026 (mediano o el de la institución que elijas) por la duración real promedio en años (semestres reales divididos por 2), y suma el costo mediano de titulación. Si activas gratuidad o beca de arancel, el arancel pasa a $0.",
  },
  {
    pregunta: "¿Por qué se ajustan los sueldos con el IPC?",
    respuesta:
      "Los sueldos de mifuturo.cl están publicados en pesos de septiembre de 2025, mientras que los aranceles corresponden a 2026. Ajustar por el IPC del INE permite comparar ambos montos en pesos equivalentes de hoy.",
  },
  {
    pregunta: "¿Por qué no descuenta impuestos ni costo de vida?",
    respuesta:
      "Porque las cotizaciones, tramos de impuesto a la renta y gastos de mantención varían según cada persona y hogar. La herramienta entrega una referencia transparente con supuestos editables.",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos/carreras/retorno",
    title: "Calculadora de retorno de carrera en Chile | ProgramBI",
    description:
      "Estima cuánto cuesta estudiar una carrera en Chile (arancel 2026 y años reales) y a cuántos meses de sueldo bruto equivale al 1.º y 4.º año.",
  });
}

export default function RetornoCarreraPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();

  const migas = [
    ...MIGAS_BASE,
    { label: "Calculadora de retorno", path: "/datos/carreras/retorno" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webAppSchema({
        path: "/datos/carreras/retorno",
        name: "Calculadora de retorno de carreras en Chile",
        description:
          "Estima el costo total de estudiar una carrera según su arancel 2026 y duración real, y compáralo con el ingreso bruto al 1.º y 4.º año.",
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
          Calculadora de retorno · Edición {meta.edicion}
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          ¿Cuánto cuesta estudiar una carrera y a cuántos sueldos equivale?
        </h1>
        <p className="mt-3 text-base text-[#5c5c58]">
          Ajusta el arancel 2026, los años reales de estudio, el costo de titulación o la gratuidad
          para estimar la inversión directa frente al sueldo bruto oficial de{" "}
          <span className="font-medium text-[#171716]">mifuturo.cl</span>.
        </p>
      </header>

      <CalculadoraRetorno
        ranking={ranking}
        edicion={meta.edicion}
        pesosDe={meta.pesos_de}
      />

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
        <Link href="/datos/carreras/mejor-sueldo-por-arancel" className="font-medium text-[#1890ff] hover:underline">
          Ver ranking sueldo por arancel →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso className="mt-8 border-t border-[#e2e2dc] pt-6" />
    </div>
  );
}
