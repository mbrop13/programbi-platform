import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TablaDatos } from "@/components/datos/TablaDatos";
import {
  getMetaCarreras,
  getRankingCarreras,
  TIPO_ETIQUETAS,
} from "@/lib/datos/carreras";
import { anosDesdeSemestres, pesos, porcentaje } from "@/lib/datos/formato";
import {
  breadcrumbsSchema,
  datasetCarrerasSchema,
  faqPageSchema,
  itemListSchema,
  metadataSimpleDatos,
  MIGAS_BASE,
} from "@/lib/datos/seo-carreras";

export const dynamic = "force-static";

const RE_TEC_DATOS =
  /computacion|informatica|conectividad|redes|telecomunicaciones|matematica|estadistica|datos/i;

const FAQS = [
  {
    pregunta: "¿Qué carreras de tecnología y datos tienen mejores sueldos en Chile?",
    respuesta:
      "Según los datos de mifuturo.cl, las ingenierías civiles y profesionales en Computación e Informática, Automatización, Conectividad y Redes, Telecomunicaciones, y Matemática y Estadística lideran los ingresos del área digital, tanto en universidades como en institutos profesionales.",
  },
  {
    pregunta: "¿Es necesario estudiar una carrera de 5 años para trabajar en tecnología?",
    respuesta:
      "No necesariamente. En Chile existen carreras técnicas de nivel superior (CFT e IP) e ingenierías de ejecución o profesionales de 4 años en Computación, Informática y Conectividad y Redes con alta empleabilidad al primer año y menor duración real.",
  },
  {
    pregunta: "¿Qué herramientas digitales sirven aunque estudies otra carrera?",
    respuesta:
      "El manejo práctico de Excel avanzado, SQL, Power BI y Python se utiliza transversalmente en administración, salud, ingeniería, ciencias sociales y operaciones para analizar datos y automatizar reportes.",
  },
] as const;

const CURSOS_EMPLEABILIDAD = [
  {
    href: "/cursos/excel",
    titulo: "Excel",
    desc: "Tablas dinámicas, fórmulas y modelamiento de datos para gestión diaria.",
  },
  {
    href: "/cursos/sql-server",
    titulo: "SQL Server",
    desc: "Consultas, cruces y extracción de datos directamente desde bases empresariales.",
  },
  {
    href: "/cursos/power-bi",
    titulo: "Power BI",
    desc: "Tableros interactivos y métricas de negocio con DAX y Power Query.",
  },
  {
    href: "/cursos/python",
    titulo: "Python",
    desc: "Automatización de procesos y análisis exploratorio de datos.",
  },
  {
    href: "/cursos/analisis-de-datos",
    titulo: "Análisis de Datos",
    desc: "Ruta integral desde planillas hasta visualización y reportería.",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos/carreras/tecnologia-y-datos",
    title: "Carreras de tecnología y datos en Chile: sueldos 2026",
    description:
      "Ranking oficial de carreras de tecnología, informática, redes, telecomunicaciones y estadística en Chile: sueldos, empleabilidad y aranceles.",
  });
}

export default function TecnologiaYDatosPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();

  const items = ranking
    .filter(
      (r) =>
        (RE_TEC_DATOS.test(r.slug) || RE_TEC_DATOS.test(r.nombre)) && r.ing4 !== null
    )
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0));

  const top1 = items[0] ?? null;
  const mejorEmp =
    [...items]
      .filter((r) => r.emp1 !== null)
      .sort((a, b) => (b.emp1 ?? 0) - (a.emp1 ?? 0))[0] ?? null;

  const frasesResumen: string[] = [];
  if (top1) {
    frasesResumen.push(
      `En el segmento de computación, informática, redes, telecomunicaciones y matemática/estadística, ${top1.nombre} (${TIPO_ETIQUETAS[top1.tipo].corto}) lidera con un ingreso bruto promedio de ${pesos(top1.ing4)} al 4.º año.`
    );
  }
  if (mejorEmp) {
    frasesResumen.push(
      `La mayor empleabilidad al primer año dentro de este grupo la registra ${mejorEmp.nombre} (${TIPO_ETIQUETAS[mejorEmp.tipo].corto}) con ${porcentaje(mejorEmp.emp1)}.`
    );
  }
  frasesResumen.push(
    `El listado reúne ${items.length} combinaciones carrera-tipo con cifras oficiales de mifuturo.cl en pesos de ${meta.pesos_de}.`
  );

  const migas = [
    ...MIGAS_BASE,
    { label: "Tecnología y datos", path: "/datos/carreras/tecnologia-y-datos" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetCarrerasSchema({
        path: "/datos/carreras/tecnologia-y-datos",
        name: "Ranking de carreras de tecnología y datos en Chile",
        description:
          "Ingresos, empleabilidad, duración real y aranceles de carreras de informática, redes, telecomunicaciones y estadística en Chile.",
      }),
      itemListSchema(
        "Carreras de tecnología y datos en Chile",
        items.slice(0, 25).map((r) => ({ nombre: r.nombre, slug: r.slug, tipo: r.tipo }))
      ),
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
            Especial Tecnología y Datos · Edición {meta.edicion}
          </Badge>
          <h1 className="h1-datos text-foreground">
            Carreras de tecnología y datos en Chile: sueldos y empleabilidad
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Ranking oficial filtrado para computación, informática, conectividad y redes,
            telecomunicaciones y matemática/estadística según{" "}
            <strong className="font-medium text-foreground">mifuturo.cl</strong>.
          </p>
        </header>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {top1 ? (
          <KpiCard
            valor={pesos(top1.ing4)}
            etiqueta="Mayor sueldo 4.º año"
            subtitulo={`${top1.nombre} (${TIPO_ETIQUETAS[top1.tipo].corto})`}
            variante="primary"
          />
        ) : null}
        {mejorEmp ? (
          <KpiCard
            valor={porcentaje(mejorEmp.emp1)}
            etiqueta="Mayor empleabilidad 1.er año"
            subtitulo={`${mejorEmp.nombre} (${TIPO_ETIQUETAS[mejorEmp.tipo].corto})`}
          />
        ) : null}
        <KpiCard
          valor={String(items.length)}
          etiqueta="Programas en el ranking"
          subtitulo="U, IP y CFT con datos oficiales"
        />
      </div>

      <section aria-labelledby="tabla-tec-titulo" className="space-y-3">
        <h2 id="tabla-tec-titulo" className="h2-datos text-foreground">
          Ranking oficial de tecnología, informática y datos
        </h2>
        <TablaDatos caption="Ranking de carreras de tecnología y datos en Chile">
          <thead>
            <tr>
              <th>#</th>
              <th>Carrera</th>
              <th>Tipo</th>
              <th className="text-right">Sueldo 4.º año</th>
              <th className="text-right">Sueldo 1.er año</th>
              <th className="text-right">Empleabilidad</th>
              <th className="text-right">Duración real</th>
              <th className="text-right">Arancel 2026</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, idx) => (
              <tr key={`${r.slug}-${r.tipo}`}>
                <td className="font-medium text-muted-foreground">{idx + 1}</td>
                <td>
                  <Link
                    href={`/datos/carreras/${r.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-blue-700 hover:underline"
                  >
                    {r.nombre}
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </td>
                <td>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {TIPO_ETIQUETAS[r.tipo].corto}
                  </Badge>
                </td>
                <td className="text-right font-semibold text-blue-700">{pesos(r.ing4)}</td>
                <td className="text-right">{pesos(r.ing1)}</td>
                <td className="text-right">{porcentaje(r.emp1)}</td>
                <td className="text-right">
                  {r.dur_real !== null ? anosDesdeSemestres(r.dur_real) : "Sin dato"}
                </td>
                <td className="text-right">{pesos(r.arancel_med)}</td>
              </tr>
            ))}
          </tbody>
        </TablaDatos>
      </section>

      <EnResumen
        frases={frasesResumen}
        fuente={`Fuente: mifuturo.cl (Mineduc) · Edición ${meta.edicion}`}
      />

      <Card
        aria-labelledby="empleabilidad-titulo"
        className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0"
      >
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-4 text-blue-600" aria-hidden="true" />
            <span>Habilidades transversales</span>
          </div>
          <h2 id="empleabilidad-titulo" className="h2-datos mt-2 text-foreground">
            Cómo aumentar tu empleabilidad (estudies lo que estudies)
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            El análisis de datos dejó de ser exclusivo de ingeniería informática. Sumar herramientas
            prácticas como planillas avanzadas, bases de datos y visualización ayuda a perfiles de
            administración, salud, ingeniería y ciencias sociales a destacar desde su primer empleo.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CURSOS_EMPLEABILIDAD.map((curso) => (
              <Link
                key={curso.href}
                href={curso.href}
                className="group flex flex-col justify-between rounded-lg border border-border bg-background/60 p-4 transition-all hover:border-slate-300 hover:bg-card"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-blue-700">
                    {curso.titulo}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{curso.desc}</p>
                </div>
              </Link>
            ))}

            <Link
              href="/sueldos-analista-datos-chile"
              className="group flex flex-col justify-between rounded-lg border border-blue-200/80 bg-blue-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-800">
                  Sueldos de Analista de Datos en Chile
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Revisa nuestra guía específica sobre el rol de analista de datos y sus rangos
                  referenciales.
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      <CtaDatos pagina="/datos/carreras/tecnologia-y-datos" />

      <FaqDatos faqs={FAQS} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/datos/carreras" className="font-medium text-blue-700 hover:underline">
          ← Volver al ranking completo
        </Link>
        <Link href="/datos/carreras/comparar" className="font-medium text-blue-700 hover:underline">
          Comparar carreras lado a lado →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
