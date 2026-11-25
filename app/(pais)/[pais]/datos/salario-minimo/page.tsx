import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Bus,
  FileSpreadsheet,
  GraduationCap,
  Info,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pesosCo, tasaCo } from "@/lib/datos-co/formato";
import { getSalarioMinimoCo } from "@/lib/datos-co/macro";
import {
  breadcrumbJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
  MIGAS_BASE_CO,
} from "@/lib/datos-co/seo";
import { GUIAS_PASO_A_PASO_CO } from "@/lib/guias/paso-a-paso-co";
import { jsonLdString } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return [{ pais: "co" }];
}

const PATH = "/co/datos/salario-minimo";

const MIGAS = [
  ...MIGAS_BASE_CO,
  { label: "Salario mínimo 2026", path: PATH },
] as const;

const FAQS = [
  {
    pregunta: "¿Cuál es el salario mínimo en Colombia para 2026?",
    respuesta:
      "El Salario Mínimo Mensual Legal Vigente (SMMLV) para 2026 en Colombia es de $1.750.905 COP, conforme al Decreto 1469 de 2025 mantenido por el Decreto transitorio 0159 de 2026 del Ministerio del Trabajo.",
  },
  {
    pregunta: "¿Cuánto es el auxilio de transporte en 2026 y quién lo recibe?",
    respuesta:
      "El auxilio de transporte para 2026 es de $249.095 COP (Decreto 1470 de 2025). Lo reciben los trabajadores que devengan hasta 2 SMMLV ($3.501.810 COP). Sumado al SMMLV, el total mensual asciende a $2.000.000 COP.",
  },
  {
    pregunta: "¿Qué descuentos de ley se aplican al salario del trabajador?",
    respuesta:
      "Al trabajador se le descuenta el 4 % para salud y el 4 % para pensión sobre su Ingreso Base de Cotización (sobre 1 SMMLV equivale a $70.036 cada uno). Quienes devengan 4 SMMLV o más ($7.003.620) aportan adicionalmente al Fondo de Solidaridad Pensional (FSP).",
  },
  {
    pregunta: "¿Ya existe cifra oficial para el salario mínimo 2027 en Colombia?",
    respuesta:
      "No. A noviembre de 2026 el decreto del salario mínimo para 2027 aún no ha sido publicado por el Gobierno Nacional. Esta página solo reporta cifras oficiales vigentes.",
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") return {};
  return metadataDatosCo({
    title: "Salario mínimo 2026 en Colombia y auxilio de transporte",
    description:
      "SMMLV 2026 en Colombia: $1.750.905 + auxilio de transporte $249.095 ($2.000.000). Aportes a salud, pensión, FSP, cesantías, prima y guías en Excel.",
    path: PATH,
    keywords: [
      "salario minimo 2026 colombia",
      "smmlv 2026",
      "auxilio de transporte 2026 colombia",
      "prestaciones sociales colombia 2026",
    ],
  });
}

export default async function SalarioMinimoColombiaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const sm = getSalarioMinimoCo();
  const descuentoSalud = Math.round((sm.smmlv_cop * sm.salud_empleado_pct) / 100);
  const descuentoPension = Math.round((sm.smmlv_cop * sm.pension_empleado_pct) / 100);
  const netoSmmlvSinAux = sm.smmlv_cop - descuentoSalud - descuentoPension;
  const netoSmmlvConAux = netoSmmlvSinAux + sm.auxilio_transporte_cop;
  const topeFspCop = sm.smmlv_cop * sm.fsp_desde_smmlv;

  const filasAportes = [
    {
      concepto: "Salud (aporte del trabajador)",
      regla: `${sm.salud_empleado_pct} % sobre el salario base`,
      valor1Smmlv: pesosCo(descuentoSalud),
      nota: "Se descuenta en nómina mensual.",
    },
    {
      concepto: "Pensión (aporte del trabajador)",
      regla: `${sm.pension_empleado_pct} % sobre el salario base`,
      valor1Smmlv: pesosCo(descuentoPension),
      nota: "Se descuenta en nómina mensual.",
    },
    {
      concepto: "Fondo de Solidaridad Pensional (FSP)",
      regla: `Desde ${sm.fsp_desde_smmlv} SMMLV (${pesosCo(topeFspCop)})`,
      valor1Smmlv: "$0 (no aplica a 1 SMMLV)",
      nota: "Aporte adicional progresivo a partir de 4 SMMLV.",
    },
    {
      concepto: "Auxilio de transporte",
      regla: `Hasta ${sm.tope_auxilio_transporte_smmlv} SMMLV (${pesosCo(sm.tope_auxilio_transporte_cop)})`,
      valor1Smmlv: pesosCo(sm.auxilio_transporte_cop),
      nota: "Decreto 1470 de 2025. No constituye salario para aportes, pero sí entra en prima y cesantías.",
    },
    {
      concepto: "Prima de servicios",
      regla: "1 mes de salario por año trabajado (2 pagos: jun y dic)",
      valor1Smmlv: `${pesosCo(sm.total_smmlv_mas_auxilio_cop)} / año`,
      nota: "Incluye auxilio de transporte si el trabajador tiene derecho a él.",
    },
    {
      concepto: "Cesantías",
      regla: "1 mes de salario por año trabajado",
      valor1Smmlv: `${pesosCo(sm.total_smmlv_mas_auxilio_cop)} / año`,
      nota: "Se consignan en el fondo de cesantías antes del 14 de febrero.",
    },
    {
      concepto: "Intereses a las cesantías",
      regla: `${sm.intereses_cesantias_pct_anual} % anual sobre el saldo de cesantías`,
      valor1Smmlv: pesosCo((sm.total_smmlv_mas_auxilio_cop * sm.intereses_cesantias_pct_anual) / 100),
      nota: "Se pagan directamente al trabajador a más tardar en enero.",
    },
    {
      concepto: "Vacaciones remuneradas",
      regla: "15 días hábiles por año trabajado",
      valor1Smmlv: `${pesosCo(sm.smmlv_cop / 2)} (15 días)`,
      nota: "Se liquidan sobre el salario básico, sin incluir auxilio de transporte.",
    },
  ] as const;

  const resumenFrases = [
    `El SMMLV 2026 en Colombia es de ${pesosCo(sm.smmlv_cop)} y el auxilio de transporte es de ${pesosCo(sm.auxilio_transporte_cop)}, para un total de ${pesosCo(sm.total_smmlv_mas_auxilio_cop)}.`,
    `Sobre 1 SMMLV, los descuentos obligatorios del trabajador (${tasaCo(sm.salud_empleado_pct, 1).replace(",0", "")} salud + ${tasaCo(sm.pension_empleado_pct, 1).replace(",0", "")} pensión) suman ${pesosCo(descuentoSalud + descuentoPension)}, dejando un neto estimado de ${pesosCo(netoSmmlvConAux)} con auxilio de transporte.`,
    "El decreto correspondiente al salario mínimo de 2027 aún no ha sido expedido; no se publican proyecciones no oficiales.",
  ];

  const jsonLd = [breadcrumbJsonLdCo(MIGAS), faqJsonLdCo(FAQS)];

  return (
    <div className="mx-auto max-w-[1180px] space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS} />

        <header className="space-y-2.5">
          <p className="text-sm font-semibold text-emerald-700">
            Ministerio del Trabajo · Parámetros laborales vigentes {sm.anio}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Salario mínimo en Colombia 2026: valor, auxilio y prestaciones
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Cifras oficiales del SMMLV, auxilio de transporte, deducciones de nómina y liquidación
            de prestaciones sociales vigentes en Colombia para 2026.
          </p>
        </header>
      </div>

      <section aria-label="Valores oficiales 2026" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          valor={pesosCo(sm.smmlv_cop)}
          etiqueta="SMMLV 2026"
          subtitulo="Decreto 1469 de 2025, mantenido por Decreto transitorio 0159/2026."
          fuente="MinTrabajo"
          icono={<Briefcase className="size-4" aria-hidden="true" />}
          variante="primary"
        />
        <KpiCard
          valor={pesosCo(sm.auxilio_transporte_cop)}
          etiqueta="Auxilio de transporte 2026"
          delta={`Tope ${pesosCo(sm.tope_auxilio_transporte_cop)}`}
          subtitulo={`Aplica para salarios de hasta ${sm.tope_auxilio_transporte_smmlv} SMMLV.`}
          fuente="Decreto 1470 de 2025"
          icono={<Bus className="size-4" aria-hidden="true" />}
        />
        <KpiCard
          valor={pesosCo(sm.total_smmlv_mas_auxilio_cop)}
          etiqueta="Total SMMLV + auxilio"
          delta={`Neto aprox. ${pesosCo(netoSmmlvConAux)}`}
          subtitulo={`Tras descontar ${pesosCo(descuentoSalud + descuentoPension)} de salud (4 %) y pensión (4 %).`}
          fuente="Cálculo nómina 2026"
          icono={<Wallet className="size-4" aria-hidden="true" />}
        />
      </section>

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Aportes, descuentos y prestaciones sociales en 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted/70 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium">Regla legal</th>
                <th className="px-4 py-3 font-medium">Referencia 1 SMMLV</th>
                <th className="px-5 py-3 font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filasAportes.map((fila) => (
                <tr key={fila.concepto} className="align-top hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium text-foreground">{fila.concepto}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{fila.regla}</td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-foreground">
                    {fila.valor1Smmlv}
                  </td>
                  <td className="px-5 py-3.5 text-xs leading-relaxed text-muted-foreground">
                    {fila.nota}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800"
      >
        <Info className="mt-0.5 size-4 shrink-0 text-slate-600" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Sobre el salario mínimo 2027:</strong> el decreto oficial para 2027 aún no se
          publica. No inventamos ni proyectamos cifras antes de la publicación normativa del
          Ministerio del Trabajo.
        </p>
      </div>

      <section aria-labelledby="guias-nomina-titulo" className="space-y-4">
        <div>
          <h2 id="guias-nomina-titulo" className="text-xl font-semibold tracking-tight text-foreground">
            Calcula tu nómina y prestaciones con nuestras 5 guías en Excel
          </h2>
          <p className="text-sm text-muted-foreground">
            Incluyen fórmulas listas y plantillas descargables configuradas con el SMMLV 2026.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIAS_PASO_A_PASO_CO.map((guia) => (
            <Link
              key={guia.slug}
              href={`/co/guias/${guia.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-emerald-500/70"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <FileSpreadsheet className="size-4" aria-hidden="true" />
                  <span>Guía + plantilla Excel</span>
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-800">
                  {guia.h1}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{guia.meta}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                Ir a la guía
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <EnResumen
        frases={resumenFrases}
        fuente={`Fuentes: ${sm.fuentes.smmlv} | ${sm.fuentes.auxilio_transporte}`}
      />

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Automatiza nómina y reportes en tu empresa</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Domina Excel y Análisis de Datos con casos de Colombia
            </h2>
            <p className="text-sm text-muted-foreground">
              Clases en vivo con proyectos reales, disponibles en 3 cuotas sin interés y con clase
              gratis de prueba.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/co/cursos/excel"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 gap-1.5 rounded-lg px-4 text-sm font-medium"
              )}
            >
              Curso Excel
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/co/cursos/analisis-de-datos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 gap-1.5 rounded-lg px-4 text-sm font-medium"
              )}
            >
              Análisis de Datos
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <WhatsAppCta
              page={PATH}
              country="co"
              intent="curso"
              course="Excel y Análisis de Datos"
              courseSlug="excel"
              ctaPosition="salario_minimo_co_cta"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 gap-2 rounded-lg px-4 text-sm font-medium"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </WhatsAppCta>
          </div>
        </CardContent>
      </Card>

      <FaqDatos faqs={FAQS} />

      <p className="text-xs text-muted-foreground">
        Referencia normativa:{" "}
        <a
          href={sm.fuentes.mintrabajo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Ministerio del Trabajo de Colombia
        </a>
        .
      </p>
    </div>
  );
}
