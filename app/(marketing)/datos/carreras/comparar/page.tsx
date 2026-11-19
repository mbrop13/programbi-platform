import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GitCompare } from "lucide-react";
import { Comparador, type ComparadorCarreraItem } from "@/components/datos/Comparador";
import { EnResumen } from "@/components/datos/EnResumen";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TablaDatos } from "@/components/datos/TablaDatos";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCarrera,
  getCarreras,
  getMetaCarreras,
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  tipoPrincipalDeCarrera,
} from "@/lib/datos/carreras";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";
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
    pregunta: "¿Cómo se comparan dos carreras de distinto tipo de institución?",
    respuesta:
      "El comparador permite elegir por separado si cada carrera corresponde a Universidad (U), Instituto Profesional (IP) o Centro de Formación Técnica (CFT), porque los sueldos, empleabilidad y duración real son distintos en cada tipo de institución.",
  },
  {
    pregunta: "¿En qué moneda están expresados los sueldos del gráfico?",
    respuesta:
      "Todos los ingresos promedio brutos del 1.º al 5.º año de titulación provienen de mifuturo.cl (Mineduc) y están expresados en pesos de septiembre de 2025.",
  },
  {
    pregunta: "¿Puedo compartir una comparación específica por enlace o imagen?",
    respuesta:
      "Sí. Cada cambio actualiza la URL (?c=...&t=...) para copiarla directamente y genera una tarjeta descargable en PNG con las cifras oficiales de las dos primeras carreras seleccionadas.",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos/carreras/comparar",
    title: "Comparador de carreras en Chile: sueldos y empleo",
    description:
      "Compara hasta 3 carreras en Chile lado a lado: sueldos 1.º al 5.º año, empleabilidad, duración real y aranceles 2026 con datos oficiales de mifuturo.cl.",
  });
}

export default function CompararCarrerasPage() {
  const meta = getMetaCarreras();
  const carrerasRaw = getCarreras();

  const carrerasSlim: ComparadorCarreraItem[] = carrerasRaw.map((c) => {
    const tipos: ComparadorCarreraItem["tipos"] = {};
    for (const k of TIPO_ORDEN) {
      const t = c.tipos[k];
      if (!t) continue;
      tipos[k] = {
        ing: t.ing,
        emp1: t.emp1,
        emp2: t.emp2,
        dur_formal: t.dur_formal,
        dur_real: t.dur_real,
        arancel_med: t.oferta?.arancel?.med ?? null,
        costo_tit_med: t.oferta?.costo_titulacion_med ?? null,
      };
    }
    return {
      slug: c.slug,
      nombre: c.nombre,
      area: c.area,
      tipos,
    };
  });

  const ejA = getCarrera("ingenieria-comercial");
  const ejB = getCarrera("ingenieria-civil-industrial");
  const ejATipo = ejA ? tipoPrincipalDeCarrera(ejA) : null;
  const ejBTipo = ejB ? tipoPrincipalDeCarrera(ejB) : null;

  const frasesResumen: string[] = [];
  if (ejA && ejB && ejATipo && ejBTipo) {
    frasesResumen.push(
      `Ejemplo por defecto: ${ejA.nombre} (${TIPO_ETIQUETAS[ejATipo.key].corto}) registra un ingreso bruto de ${pesos(ejATipo.data.ing[3] ?? null)} al 4.º año y una empleabilidad de ${porcentaje(ejATipo.data.emp1)} al 1.er año.`
    );
    frasesResumen.push(
      `En contraste, ${ejB.nombre} (${TIPO_ETIQUETAS[ejBTipo.key].corto}) alcanza ${pesos(ejBTipo.data.ing[3] ?? null)} al 4.º año, con ${porcentaje(ejBTipo.data.emp1)} de empleabilidad al 1.er año y una duración real de ${semestres(ejBTipo.data.dur_real)}.`
    );
    frasesResumen.push(
      "Selecciona hasta 3 carreras y sus tipos de institución (U, IP o CFT) para superponer sus curvas de ingresos del 1.º al 5.º año."
    );
  }

  const migas = [
    ...MIGAS_BASE,
    { label: "Comparador de carreras", path: "/datos/carreras/comparar" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webAppSchema({
        path: "/datos/carreras/comparar",
        name: "Comparador de carreras en Chile",
        description:
          "Herramienta interactiva para comparar sueldos del 1.º al 5.º año, empleabilidad, duración real y aranceles de carreras en Chile según mifuturo.cl.",
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
        <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1063b8] uppercase">
          <GitCompare className="size-3.5" aria-hidden="true" />
          Comparador oficial · Edición {meta.edicion}
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          Comparador de carreras en Chile
        </h1>
        <p className="mt-3 text-base text-[#5c5c58]">
          Compara hasta 3 carreras genéricas lado a lado según datos oficiales de{" "}
          <span className="font-medium text-[#171716]">mifuturo.cl</span>: ingresos brutos del 1.º al
          5.º año, empleabilidad, duración real y arancel mediano 2026.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        }
      >
        <Comparador
          carreras={carrerasSlim}
          edicion={meta.edicion}
          pesosDe={meta.pesos_de}
        />
      </Suspense>

      {frasesResumen.length > 0 ? (
        <div className="mt-10 space-y-6">
          <EnResumen
            titulo="Ejemplo: Ingeniería Comercial vs Ingeniería Civil Industrial"
            frases={frasesResumen}
            fuente={`Fuente: mifuturo.cl (Mineduc) · Edición ${meta.edicion}`}
          />

          {ejA && ejB && ejATipo && ejBTipo ? (
            <TablaDatos caption="Comparación de ejemplo: Ingeniería Comercial vs Ingeniería Civil Industrial">
              <thead>
                <tr>
                  <th>Indicador oficial</th>
                  <th>{ejA.nombre} ({TIPO_ETIQUETAS[ejATipo.key].corto})</th>
                  <th>{ejB.nombre} ({TIPO_ETIQUETAS[ejBTipo.key].corto})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Ingreso bruto 1.er año</td>
                  <td>{pesos(ejATipo.data.ing[0] ?? null)}</td>
                  <td>{pesos(ejBTipo.data.ing[0] ?? null)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Ingreso bruto 4.º año</td>
                  <td className="font-bold text-[#1063b8]">{pesos(ejATipo.data.ing[3] ?? null)}</td>
                  <td className="font-bold text-[#9a5200]">{pesos(ejBTipo.data.ing[3] ?? null)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Empleabilidad 1.er año</td>
                  <td>{porcentaje(ejATipo.data.emp1)}</td>
                  <td>{porcentaje(ejBTipo.data.emp1)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Duración real promedio</td>
                  <td>{semestres(ejATipo.data.dur_real)}</td>
                  <td>{semestres(ejBTipo.data.dur_real)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Arancel anual mediano 2026</td>
                  <td>{pesos(ejATipo.data.oferta?.arancel?.med ?? null)}</td>
                  <td>{pesos(ejBTipo.data.oferta?.arancel?.med ?? null)}</td>
                </tr>
              </tbody>
            </TablaDatos>
          ) : null}
        </div>
      ) : null}

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
        <Link href="/datos/carreras" className="font-medium text-[#1063b8] hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link href="/datos/carreras/retorno" className="font-medium text-[#1063b8] hover:underline">
          Calcular retorno estimado →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso className="mt-8 border-t border-[#e2e2dc] pt-6" />
    </div>
  );
}
