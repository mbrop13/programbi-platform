import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GuiaToolVisual, GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
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

/**
 * Quita los montos que traen las descripciones de las guías.
 *
 * El arancel vive en el brochure PDF del curso, no en un listado de enlaces.
 */
function sinMontos(texto: string): string {
  return texto
    .replace(/\$\s?\d[\d.,]*/g, "el arancel vigente")
    .replace(
      /\b\d{1,3}(?:\.\d{3})+\s?(?:CLP|ARS|MXN|PEN|COP|UYU|USD)\b/g,
      "el arancel vigente"
    )
    .replace(/\s{2,}/g, " ");
}

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
 * Grilla de tarjetas visuales táctiles ordenadas por mercado.
 */
export default function GuiasDelCurso({ curso, pais }: Props) {
  const iso = pais === "transversal" ? ISO_CHILE : pais;
  const nombre = getCourseBySlug(curso)?.title ?? curso;

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

  const hayGuiaLocal = delCurso.some((guia) => guia.country === iso);

  const hubMercado = indiceGuias(iso);
  const hayHubMercado = iso === ISO_CHILE || guiasDePais(iso).some(esGuiaPublicada);
  const nombreMercado = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const etiquetaHub = iso === ISO_CHILE ? "Ver todas las guías" : `Ver las guías de ${nombreMercado}`;

  return (
    <section
      data-testid="guias-del-curso"
      aria-labelledby="guias-del-curso"
      className="guias-scope !min-h-0 border-t border-[var(--g-border)] bg-[var(--g-bg)] px-4 py-16 text-[var(--g-ink)] sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px]">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          Guías del curso
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="guias-del-curso"
            className="max-w-[30ch] text-2xl font-bold tracking-tight text-[var(--g-ink)] sm:text-3xl"
          >
            Guías de {nombre}
          </h2>
          <Link
            href={hayHubMercado ? hubMercado : "/guias"}
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)] sm:min-h-0"
          >
            {hayHubMercado ? etiquetaHub : "Ver todas las guías"}
          </Link>
        </div>

        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-[var(--g-muted)]">
          Material de estudio del curso ordenado por mercado: precio local, ruta de aprendizaje y ejemplos para
          aplicar {nombre} en el trabajo.
          {hayGuiaLocal ? ` La primera es la guía de ${nombreMercado}.` : ""}
        </p>

        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {enlaces.map((guia, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            const esLocal = guia.country === iso;
            return (
              <li key={guia.path}>
                <Link
                  href={guia.path}
                  className="group flex h-full min-h-[44px] flex-col justify-between gap-4 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 no-underline shadow-[var(--g-card-shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <GuiaToolVisual tool={curso} course={curso} size="sm" />
                      <span className="font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]">
                        {num}
                      </span>
                    </div>
                    <GuiaVisualBadge tone={esLocal ? "accent" : "neutral"}>
                      {mercadoDe(guia)}
                    </GuiaVisualBadge>
                  </div>

                  <div>
                    <span className="block text-base font-bold leading-snug text-[var(--g-ink)] group-hover:text-[var(--g-accent)]">
                      {sinMontos(guia.h1)}
                    </span>
                    <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
                      {sinMontos(guia.description)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--g-accent)]">
                    Leer guía
                    <ArrowUpRight size={13} aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {!hayGuiaLocal && hubMercado !== "/guias" ? (
          <p className="mt-6 text-sm text-[var(--g-muted)]">
            Todavía no hay una guía de {nombre} para {nombreMercado}.{" "}
            <Link
              href="/guias"
              className="font-semibold text-[var(--g-accent)] underline underline-offset-4"
            >
              Ver el índice general de guías
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
