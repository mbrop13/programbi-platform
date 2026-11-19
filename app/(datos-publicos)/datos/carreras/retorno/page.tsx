import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Badge } from "@/components/ui/badge";
import { CalculadoraRetorno } from "@/components/datos/CalculadoraRetorno";
import { FaqDatos } from "@/components/datos/FaqDatos";
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
            Calculadora de retorno · Edición {meta.edicion}
          </Badge>
          <h1 className="h1-datos text-foreground">
            ¿Cuánto cuesta estudiar una carrera y a cuántos sueldos equivale?
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Ajusta el arancel 2026, los años reales de estudio, el costo de titulación o la
            gratuidad para estimar la inversión directa frente al sueldo oficial de{" "}
            <strong className="font-medium text-foreground">mifuturo.cl</strong>.
          </p>
        </header>
      </div>

      <CalculadoraRetorno ranking={ranking} edicion={meta.edicion} pesosDe={meta.pesos_de} />

      <FaqDatos faqs={FAQS} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/datos/carreras" className="font-medium text-blue-700 hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link
          href="/datos/carreras/mejor-sueldo-por-arancel"
          className="font-medium text-blue-700 hover:underline"
        >
          Ver ranking sueldo por arancel →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
