import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, Cpu, TrendingUp } from "lucide-react";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TablaDatos } from "@/components/datos/TablaDatos";
import { Badge } from "@/components/ui/badge";
import {
  getMetaCarreras,
  getRankingCarreras,
  TIPO_ETIQUETAS,
} from "@/lib/datos/carreras";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";
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
        (RE_TEC_DATOS.test(r.slug) || RE_TEC_DATOS.test(r.nombre)) &&
        r.ing4 !== null
    )
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0));

  const top1 = items[0] ?? null;
  const mejorEmp = [...items]
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <MigasDatos migas={migas} className="mb-6" />

      <header className="mb-8 max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
          <Cpu className="size-3.5" aria-hidden="true" />
          Tecnología y datos · Edición {meta.edicion}
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          Carreras de tecnología y datos en Chile: sueldos y empleabilidad
        </h1>
        <p className="mt-3 text-base text-[#5c5c58]">
          Ranking oficial filtrado para computación, informática, conectividad y redes,
          telecomunicaciones y matemática/estadística según{" "}
          <span className="font-medium text-[#171716]">mifuturo.cl</span>.
        </p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {top1 ? (
          <KpiCard
            valor={pesos(top1.ing4)}
            etiqueta="Mayor ingreso 4.º año"
            subtitulo={`${top1.nombre} (${TIPO_ETIQUETAS[top1.tipo].corto})`}
            variante="primary"
          />
        ) : null}
        {mejorEmp ? (
          <KpiCard
            valor={porcentaje(mejorEmp.emp1)}
            etiqueta="Mayor empleo 1.er año"
            subtitulo={`${mejorEmp.nombre} (${TIPO_ETIQUETAS[mejorEmp.tipo].corto})`}
            variante="accent"
          />
        ) : null}
        <KpiCard
          valor={String(items.length)}
          etiqueta="Programas en el ranking"
          subtitulo="U, IP y CFT con datos oficiales"
        />
      </div>

      <EnResumen
        frases={frasesResumen}
        fuente={`Fuente: mifuturo.cl (Mineduc) · Edición ${meta.edicion}`}
        className="mb-8"
      />

      <section aria-labelledby="tabla-tec-titulo" className="mb-10 space-y-4">
        <h2 id="tabla-tec-titulo" className="h2-datos text-[#171716]">
          Ranking oficial de tecnología, informática y datos
        </h2>
        <TablaDatos caption="Ranking de carreras de tecnología y datos en Chile">
          <thead>
            <tr>
              <th>#</th>
              <th>Carrera</th>
              <th>Tipo</th>
              <th>Ingreso 4.º año</th>
              <th>Ingreso 1.er año</th>
              <th>Empleo 1.er año</th>
              <th>Duración real</th>
              <th>Arancel 2026</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, idx) => (
              <tr key={`${r.slug}-${r.tipo}`}>
                <td className="font-bold text-[#5c5c58]">{idx + 1}</td>
                <td>
                  <Link
                    href={`/datos/carreras/${r.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#171716] hover:text-[#1890ff] hover:underline"
                  >
                    {r.nombre}
                    <ArrowUpRight className="size-3.5 shrink-0 text-[#8a8a84]" />
                  </Link>
                </td>
                <td>
                  <Badge variant="outline" className="text-xs">
                    {TIPO_ETIQUETAS[r.tipo].corto}
                  </Badge>
                </td>
                <td className="font-bold text-[#1890ff]">{pesos(r.ing4)}</td>
                <td>{pesos(r.ing1)}</td>
                <td>{porcentaje(r.emp1)}</td>
                <td>{semestres(r.dur_real)}</td>
                <td>{pesos(r.arancel_med)}</td>
              </tr>
            ))}
          </tbody>
        </TablaDatos>
      </section>

      {/* Sección: Cómo aumentar tu empleabilidad (estudies lo que estudies) */}
      <section
        aria-labelledby="empleabilidad-titulo"
        className="mb-10 rounded-xl border border-[#e2e2dc] bg-white p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
          <TrendingUp className="size-4" aria-hidden="true" />
          Habilidades transversales
        </div>
        <h2 id="empleabilidad-titulo" className="h2-datos mt-2 text-[#171716]">
          Cómo aumentar tu empleabilidad (estudies lo que estudies)
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5c5c58]">
          El análisis de datos dejó de ser exclusivo de ingeniería informática. Sumar herramientas
          prácticas como planillas avanzadas, bases de datos y visualización ayuda a perfiles de
          administración, salud, ingeniería y ciencias sociales a responder con evidencia en su
          primer empleo.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURSOS_EMPLEABILIDAD.map((curso) => (
            <Link
              key={curso.href}
              href={curso.href}
              className="group flex flex-col justify-between rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-4 transition-colors hover:border-[#1890ff] hover:bg-white"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#171716] group-hover:text-[#1890ff]">
                  {curso.titulo}
                  <ArrowUpRight className="size-3.5" />
                </span>
                <p className="mt-1 text-xs text-[#5c5c58]">{curso.desc}</p>
              </div>
            </Link>
          ))}

          <Link
            href="/sueldos-analista-datos-chile"
            className="group flex flex-col justify-between rounded-lg border border-[#d6e6f5] bg-[#e9f4ff]/50 p-4 transition-colors hover:border-[#1890ff] hover:bg-[#e9f4ff]"
          >
            <div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-[#1890ff]">
                Sueldos de Analista de Datos en Chile
                <ArrowUpRight className="size-3.5" />
              </span>
              <p className="mt-1 text-xs text-[#5c5c58]">
                Revisa nuestra guía específica sobre el rol de analista de datos y sus rangos referenciales.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <CtaDatos pagina="/datos/carreras/tecnologia-y-datos" className="mb-10" />

      <FaqDatos faqs={FAQS} className="mb-8" />

      <div className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link href="/datos/carreras" className="font-medium text-[#1890ff] hover:underline">
          ← Volver al ranking completo
        </Link>
        <Link href="/datos/carreras/comparar" className="font-medium text-[#1890ff] hover:underline">
          Comparar carreras lado a lado →
        </Link>
      </div>

      <FuenteLinea edicion={meta.edicion} conAviso className="border-t border-[#e2e2dc] pt-6" />
    </div>
  );
}
