import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { getMetaCarrerasCo } from "@/lib/datos-co/carreras";
import { enteroCo, pesosCo } from "@/lib/datos-co/formato";
import {
  MIGAS_CARRERAS_CO,
  breadcrumbJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
} from "@/lib/datos-co/seo";
import type { PreguntaFaqCo } from "@/lib/datos-co/textos";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "co" }];
}

const TITLE = "Metodología: datos de carreras en Colombia (OLE y SNIES)";
const DESCRIPTION =
  "Cómo calculamos las medianas salariales en COP 2026 desde los 7 rangos SMMLV del OLE, el cierre del tramo >9 SMMLV en 12, las reglas de corte y los límites de la fuente.";

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
    path: "/co/datos/carreras/metodologia",
    keywords: [
      "metodologia ole colombia",
      "interpolacion smmlv ole",
      "snies graduados 2025",
    ],
  });
}

const TRAMOS_METODOLOGIA = [
  { tramo: "Hasta 1 SMMLV", limites: "0 – 1 SMMLV", cop2026: "Hasta $1.750.905" },
  { tramo: "Entre 1 y 1,5 SMMLV", limites: "1 – 1,5 SMMLV", cop2026: "$1.750.905 – $2.626.358" },
  { tramo: "Entre 1,5 y 2,5 SMMLV", limites: "1,5 – 2,5 SMMLV", cop2026: "$2.626.358 – $4.377.263" },
  { tramo: "Entre 2,5 y 4 SMMLV", limites: "2,5 – 4 SMMLV", cop2026: "$4.377.263 – $7.003.620" },
  { tramo: "Entre 4 y 6 SMMLV", limites: "4 – 6 SMMLV", cop2026: "$7.003.620 – $10.505.430" },
  { tramo: "Entre 6 y 9 SMMLV", limites: "6 – 9 SMMLV", cop2026: "$10.505.430 – $15.758.145" },
  {
    tramo: "Más de 9 SMMLV",
    limites: "9 – 12 SMMLV (cierre convencional para interpolar)",
    cop2026: "Más de $15.758.145",
  },
] as const;

const FAQS: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿Por qué no aparece una «tasa de vinculación» porcentual por carrera?",
    respuesta:
      "El tablero BI oficial del OLE que publicaba la tasa de vinculación devolvió error HTTP 500 al momento de la extracción. Para no inventar ni estimar tasas no verificadas, publicamos exclusivamente los conteos reales de graduados cotizantes en seguridad social de la Base IBC.",
  },
  {
    pregunta: "¿Por qué se cierra el tramo «Más de 9 SMMLV» en 12 SMMLV?",
    respuesta:
      "Es una convención matemática aplicada únicamente cuando el percentil 50 cae en el último tramo abierto, para poder interpolar linealmente una mediana finita sin sobreestimar colas extremas.",
  },
];

export default async function MetodologiaCarrerasCoPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: "Metodología", path: "/co/datos/carreras/metodologia" },
  ] as const;

  const jsonLd = [breadcrumbJsonLdCo(migas), faqJsonLdCo(FAQS)];

  return (
    <div className="bg-background">
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        <MigasDatos migas={migas} />

        <header className="space-y-3">
          <Badge variant="secondary">Transparencia metodológica · OLE &amp; SNIES</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Metodología: cómo calculamos los sueldos y datos de carreras en Colombia
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Documentamos las fuentes oficiales, las fórmulas de interpolación sobre los 7 rangos
            SMMLV del OLE, la conversión a pesos de 2026 y las limitaciones conocidas de la fuente.
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

        <Card className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="text-lg font-semibold text-foreground">
              1. Fuentes oficiales utilizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Ingresos y cotizantes (OLE):</strong>{" "}
              {meta.fuente_ole} De {enteroCo(meta.conteos.total_fuente)} programas en la fuente
              original, publicamos {enteroCo(meta.conteos.publicados)} con masa crítica de
              cotizantes, {enteroCo(meta.conteos.fichas)} fichas individuales y{" "}
              {enteroCo(meta.conteos.rankings)} programas habilitados en rankings.
            </p>
            <p>
              <strong className="text-foreground">Graduados recientes (SNIES):</strong>{" "}
              {meta.fuente_snies}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <a
                href={meta.fuente_ole_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
              >
                Observatorio Laboral para la Educación (OLE)
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
              <a
                href={meta.fuente_snies_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
              >
                SNIES — Ministerio de Educación Nacional
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="text-lg font-semibold text-foreground">
              2. Los 7 rangos SMMLV e interpolación lineal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              El OLE no publica el salario exacto de cada egresado, sino el conteo de graduados
              cotizantes en seguridad social distribuidos en 7 intervalos de SMMLV. Para estimar la
              mediana salarial, ubicamos el tramo que contiene el percentil 50 (acumulado ≥ 50 %) y
              aplicamos interpolación lineal dentro de ese intervalo.
            </p>
            <p>
              Cuando la mediana cae en el tramo superior abierto («Más de 9 SMMLV»), cerramos el
              límite superior en <strong className="text-foreground">12 SMMLV</strong> únicamente a
              efectos de interpolación. Todas las cifras en pesos se expresan multiplicando por el{" "}
              <strong className="text-foreground">
                SMMLV 2026 oficial ({pesosCo(meta.smmlv_2026_cop)})
              </strong>
              .
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                    <th className="py-2 pr-3">Tramo OLE</th>
                    <th className="px-3 py-2">Límites de interpolación</th>
                    <th className="pl-3 py-2 text-right">Equivalente COP 2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {TRAMOS_METODOLOGIA.map((t) => (
                    <tr key={t.tramo}>
                      <td className="py-2 pr-3 font-medium text-foreground">{t.tramo}</td>
                      <td className="px-3 py-2">{t.limites}</td>
                      <td className="pl-3 py-2 text-right tabular-nums text-foreground">
                        {t.cop2026}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-3 rounded-xl border border-amber-200 bg-amber-50/40 py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <AlertTriangle className="size-5 text-amber-700" aria-hidden="true" />
              3. Ausencia de tasa de vinculación y límites conocidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Sin tasa de vinculación porcentual:</strong> el
              módulo de consulta BI del OLE que entregaba la tasa de vinculación respondió con error{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">HTTP 500</code> durante la
              extracción oficial. Por rigor, no estimamos ni interpolamos tasas de vinculación:
              reportamos el volumen real de graduados cotizantes en seguridad social.
            </p>
            <p>
              <strong className="text-foreground">Umbral mínimo por institución y sector:</strong>{" "}
              el desglose por institución de educación superior (IES) y la comparativa Oficial vs.
              Privado se muestran únicamente cuando cada grupo alcanza al menos{" "}
              <strong className="text-foreground">30 graduados cotizantes</strong>.
            </p>
            <p>
              <strong className="text-foreground">Licencias:</strong> los conjuntos de datos de OLE
              y SNIES no declaran una licencia abierta estándar verificada, por lo que citamos a los
              organismos oficiales con sus enlaces directos sin atribuir licencias abiertas en los
              metadatos estructurados.
            </p>
          </CardContent>
        </Card>

        <CtaDatosCo
          pagina="/co/datos/carreras/metodologia"
          ctaPosition="metodologia_co"
        />

        <FaqDatos faqs={FAQS} />
      </div>
    </div>
  );
}
