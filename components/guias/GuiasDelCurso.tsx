import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPais, ISO_CHILE } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import { guiaDeCurso, guiasDePais, guiasDelCurso, indiceGuias } from "@/lib/guias";
import { GUIAS } from "@/lib/guias/generado";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import type { Guia } from "@/lib/guias/tipos";

type Props = {
  /** Slug del curso, tal como aparece en lib/data/courses.ts. */
  curso: string;
  /** ISO del mercado de la ruta: la guía de ese país va primero. */
  pais: string;
};

/** Enlaces visibles en el bloque. */
const MAXIMO = 6;

function mercadoDe(guia: Guia): string {
  if (guia.country === "transversal") return "Latinoamérica";
  return getPais(guia.country).nombre;
}

/** 0 = guía del mercado de la ruta, 1 = transversal, 2 = otros países. */
function prioridad(guia: Guia, pais: string): number {
  if (guia.country === pais) return 0;
  if (guia.country === "transversal") return 1;
  return 2;
}

/**
 * Bloque de servidor «Guías de <curso>» para la ficha de curso.
 *
 * Prioriza la guía del país de la ruta (`guiaDeCurso`), después las
 * transversales y por último el resto de mercados con página publicada. Solo
 * enlaza guías cuya ruta existe de verdad (`esGuiaPublicada`), para no meter
 * 404 en el HTML de la ficha.
 *
 * Enlaces de cierre:
 *  - al hub de guías del mercado (`/guias` en Chile, `/<pais>/guias` fuera);
 *  - al hub general cuando ese mercado todavía no tiene guía del curso.
 */
export default function GuiasDelCurso({ curso, pais }: Props) {
  const iso = pais === "transversal" ? ISO_CHILE : pais;
  const nombre = getCourseBySlug(curso)?.title ?? curso;

  // Todas las guías publicadas del curso (incluye temas y variantes por país).
  const delCurso = GUIAS.filter((guia) => guia.course === curso && esGuiaPublicada(guia));
  if (delCurso.length === 0) return null;

  const vistos = new Set<string>();
  const destacada = guiaDeCurso(iso, curso);
  const candidatas = [
    ...(destacada && esGuiaPublicada(destacada) ? [destacada] : []),
    ...guiasDelCurso(curso),
    ...delCurso,
  ];
  const enlaces = candidatas
    .filter((guia) => {
      if (!esGuiaPublicada(guia) || vistos.has(guia.path)) return false;
      vistos.add(guia.path);
      return true;
    })
    .map((guia, orden) => ({ guia, orden }))
    .sort((a, b) => prioridad(a.guia, iso) - prioridad(b.guia, iso) || a.orden - b.orden)
    .slice(0, MAXIMO)
    .map(({ guia }) => guia);

  // ¿Hay alguna guía publicada del curso en el mercado de la ruta? No siempre
  // es la guía «curso-…»: Power BI tiene guías de tema por país.
  const hayGuiaLocal = delCurso.some((guia) => guia.country === iso);

  const hubMercado = indiceGuias(iso);
  const hayHubMercado = iso === ISO_CHILE || guiasDePais(iso).some(esGuiaPublicada);
  const nombreMercado = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const etiquetaHub = iso === ISO_CHILE ? "Ver todas las guías" : `Ver las guías de ${nombreMercado}`;

  return (
    <section
      data-testid="guias-del-curso"
      aria-labelledby="guias-del-curso"
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Guías del curso</p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="guias-del-curso"
            className="max-w-[30ch] text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Guías de {nombre}
          </h2>
          <Link
            href={hayHubMercado ? hubMercado : "/guias"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
          >
            {hayHubMercado ? etiquetaHub : "Ver todas las guías"}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-mute">
          Material de estudio del curso ordenado por mercado: precio local, ruta de aprendizaje y ejemplos para
          aplicar {nombre} en el trabajo.
          {hayGuiaLocal ? ` La primera es la guía de ${nombreMercado}.` : ""}
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {enlaces.map((guia) => (
            <li key={guia.path}>
              <Link
                href={guia.path}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper px-5 py-4 no-underline transition-colors hover:border-ink/25"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
                  {mercadoDe(guia)}
                </span>
                <span className="mt-1.5 text-sm font-semibold leading-snug text-ink">{guia.h1}</span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">
                  {guia.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {!hayGuiaLocal && hubMercado !== "/guias" ? (
          <p className="mt-6 text-sm text-mute">
            Todavía no hay una guía de {nombre} para {nombreMercado}.{" "}
            <Link href="/guias" className="font-semibold text-ink underline underline-offset-4">
              Ver el índice general de guías
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
