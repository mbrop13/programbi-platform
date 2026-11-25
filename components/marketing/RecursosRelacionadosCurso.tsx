import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { enlacesDeCurso } from "@/lib/seo/enlaces";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Enlaces canónicos complementarios por curso.
 *
 * Copia del mapa de `CourseLeadSections` (módulo cliente): este bloque se
 * renderiza en el servidor y no debe arrastrar código de cliente al HTML.
 * Mantener ambos mapas en sincronía si se agregan o cambian recursos por curso.
 */
const COURSE_RESOURCE_LINKS: Record<string, { href: string; label: string }[]> = {
  "analisis-de-datos": [
    { href: "/guias/sueldo-analista-de-datos-latinoamerica", label: "Guía: sueldo de analista de datos en Latinoamérica" },
    { href: "/test-nivel", label: "Test de nivel SQL y Excel" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  "power-bi": [
    { href: "/guias/power-bi-vs-excel", label: "Guía: Power BI vs. Excel" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  "power-automate": [
    { href: "/guias/curso-power-automate-chile", label: "Guía: automatización con Power Automate" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
  "sql-server": [
    { href: "/test-nivel/sql", label: "Test de nivel SQL" },
    { href: "/versus/sql-server-vs-postgresql", label: "Comparativa: SQL Server vs. PostgreSQL" },
  ],
  excel: [
    { href: "/test-nivel/excel", label: "Test de nivel Excel" },
    { href: "/guias/power-bi-vs-excel", label: "Guía: Power BI vs. Excel" },
  ],
  python: [
    { href: "/versus/python-vs-r", label: "Comparativa: Python vs. R" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  chatgpt: [
    { href: "/guias/chatgpt-para-analisis-de-datos", label: "Guía: ChatGPT para análisis de datos" },
    { href: "/guias/curso-chatgpt-chile", label: "Guía: curso de ChatGPT en Chile" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
  gemini: [
    { href: "/guias/gemini-para-analisis-de-datos", label: "Guía: Gemini para análisis de datos" },
    { href: "/guias/curso-gemini-chile", label: "Guía: curso de Gemini en Chile" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
};

/** Tipo de recurso según su ruta. El kicker de la tarjeta lo muestra. */
function tipoDeRecurso(href: string): string {
  const path = href.replace(/^\/[a-z]{2}(?=\/)/, "");
  if (path.startsWith("/datos")) return "Datos";
  if (path.startsWith("/guias")) return "Guía";
  if (path.startsWith("/casos")) return "Testimonios";
  if (path.startsWith("/versus")) return "Comparativa";
  if (path.startsWith("/test-nivel")) return "Test de nivel";
  if (path.startsWith("/precios")) return "Precios";
  if (path.startsWith("/empresas")) return "Empresas";
  if (path.startsWith("/cursos")) return "Curso";
  return "Especialización";
}

/** El kicker ya anuncia el tipo: se evita repetirlo al inicio del título. */
function tituloVisible(label: string): string {
  const limpio = label.replace(/^(Guía|Comparativa):\s*/i, "");
  if (limpio === label) return limpio;
  // Al quitar el prefijo la frase queda en minúscula: se recompone la inicial.
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/**
 * Sección de cierre «Recursos relacionados» de la ficha de curso.
 *
 * Es un componente de servidor a propósito: los enlaces internos (landings,
 * guías, comparativas, testimonios y catálogo) tienen que viajar en el HTML
 * inicial para conservar el valor SEO que antes aportaba la lista de enlaces
 * del hero. Deduplica por `href` y no pinta nada si no queda ningún destino.
 */
export default function RecursosRelacionadosCurso({ slug, pais }: { slug: string; pais: string }) {
  const extraCurso = COURSE_RESOURCE_LINKS[slug] ?? [];
  const extraPorPais: { href: string; label: string }[] =
    pais === "pe" && (slug === "analisis-de-datos" || slug === "power-bi")
      ? [
          { href: "/pe/datos/carreras", label: "Carreras mejor pagadas en Perú" },
          { href: "/pe/datos", label: "Datos de Perú: sueldos por carrera y Excel" },
        ]
      : pais === "co" && (slug === "analisis-de-datos" || slug === "power-bi")
        ? [
            { href: "/co/datos/carreras", label: "Carreras de datos en Colombia" },
            {
              href: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
              label: "Cuánto gana un analista de datos en Colombia",
            },
          ]
        : pais === "mx" && (slug === "analisis-de-datos" || slug === "power-bi")
          ? [
              { href: "/mx/datos/carreras", label: "Carreras y sueldos en México" },
              { href: "/mx/datos/carreras-mejor-pagadas", label: "Carreras mejor pagadas en México" },
            ]
          : pais === "ar"
            ? slug === "analisis-de-datos" || slug === "power-bi"
              ? [{ href: "/ar/datos/carreras", label: "Carreras y sueldos de datos en Argentina" }]
              : slug === "excel"
                ? [
                    { href: "/ar/guias/calcular-aguinaldo-excel", label: "Guía: calcular el aguinaldo en Excel" },
                    { href: "/ar/datos/inflacion", label: "Datos de inflación en Argentina (IPC INDEC)" },
                  ]
                : []
            : [];

  // Landings propias del curso primero; guías, comparativas, testimonios y el catálogo cierran la lista.
  const candidatos = [
    ...enlacesDeCurso(slug),
    ...extraPorPais,
    ...extraCurso,
    { href: rutaLocal(pais, "/cursos"), label: "Todos los cursos" },
  ];

  const vistos = new Set<string>();
  const enlaces: { href: string; label: string }[] = [];
  for (const enlace of candidatos) {
    if (vistos.has(enlace.href)) continue;
    vistos.add(enlace.href);
    enlaces.push(enlace);
  }
  if (enlaces.length === 0) return null;

  return (
    <section
      aria-labelledby="recursos-relacionados"
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Sigue aprendiendo</p>
        <h2
          id="recursos-relacionados"
          className="mt-3 max-w-[30ch] text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Recursos relacionados
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/25"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
                  {tipoDeRecurso(enlace.href)}
                </span>
                <span className="mt-2 flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold leading-snug text-ink">
                    {tituloVisible(enlace.label)}
                  </span>
                  <ArrowRight
                    size={15}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-mute transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
