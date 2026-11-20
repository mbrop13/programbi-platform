import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Badge } from "@/components/ui/badge";
import { ComparadorActivador } from "@/components/datos/ComparadorActivador";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { OcultarSiParam } from "@/components/datos/OcultarSiParam";
import { TablaDatos } from "@/components/datos/TablaDatos";
import {
  getCarrera,
  getMetaCarreras,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
} from "@/lib/datos/carreras";
import { anosDesdeSemestres, pesos, porcentaje, semestres } from "@/lib/datos/formato";
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
            Comparador oficial · Edición {meta.edicion}
          </Badge>
          <h1 className="h1-datos text-foreground">Comparador de carreras en Chile</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Compara hasta 3 carreras lado a lado con cifras oficiales de{" "}
            <strong className="font-medium text-foreground">mifuturo.cl</strong>: sueldos del 1.º al
            5.º año, empleabilidad, duración real y arancel anual 2026.
          </p>
          <p className="text-sm text-muted-foreground">
            Comparte el enlace con <code className="rounded bg-muted px-1 py-0.5 text-xs">?c=</code>{" "}
            para abrir una comparación directa.
          </p>
        </header>
      </div>

      {/* Comparador interactivo protagonista */}
      <ComparadorActivador edicion={meta.edicion} pesosDe={meta.pesos_de} />

      {/* Referencia SSR: se oculta en cliente cuando la URL trae ?c= */}
      <OcultarSiParam param="c">
        {frasesResumen.length > 0 ? (
        <div className="space-y-6">
          <EnResumen
            titulo="Ejemplo de referencia: Ingeniería Comercial vs Ingeniería Civil Industrial"
            frases={frasesResumen}
            fuente={`Fuente: mifuturo.cl (Mineduc) · Edición ${meta.edicion}`}
          />

          {ejA && ejB && ejATipo && ejBTipo ? (
            <TablaDatos caption="Comparación de ejemplo: Ingeniería Comercial vs Ingeniería Civil Industrial">
              <thead>
                <tr>
                  <th>Indicador oficial</th>
                  <th>
                    {ejA.nombre} ({TIPO_ETIQUETAS[ejATipo.key].corto})
                  </th>
                  <th>
                    {ejB.nombre} ({TIPO_ETIQUETAS[ejBTipo.key].corto})
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Sueldo bruto 1.er año</td>
                  <td>{pesos(ejATipo.data.ing[0] ?? null)}</td>
                  <td>{pesos(ejBTipo.data.ing[0] ?? null)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Sueldo bruto 4.º año</td>
                  <td className="font-semibold text-blue-700">
                    {pesos(ejATipo.data.ing[3] ?? null)}
                  </td>
                  <td className="font-semibold text-amber-700">
                    {pesos(ejBTipo.data.ing[3] ?? null)}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Empleabilidad 1.er año</td>
                  <td>{porcentaje(ejATipo.data.emp1)}</td>
                  <td>{porcentaje(ejBTipo.data.emp1)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Duración real promedio</td>
                  <td>{anosDesdeSemestres(ejATipo.data.dur_real)}</td>
                  <td>{anosDesdeSemestres(ejBTipo.data.dur_real)}</td>
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
      </OcultarSiParam>

      <FaqDatos faqs={FAQS} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/datos/carreras" className="font-medium text-[#0b63c5] hover:underline">
          ← Volver al ranking de carreras
        </Link>
        <Link href="/datos/carreras/retorno" className="font-medium text-[#0b63c5] hover:underline">
          Calcular retorno estimado →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
