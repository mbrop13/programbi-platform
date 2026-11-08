import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { ISO_CHILE } from "@/config/paises";
import { NOTA_CUOTAS, textoCuotas } from "@/config/cuotas";
import { getCourseBySlug } from "@/lib/data/courses";
import { levelsForView } from "@/lib/data/course-views";
import { courseBrochurePath } from "@/lib/pricing-gate";
import type { NicheLanding } from "@/lib/data/landings-nicho";
import { LandingCta } from "./LandingCta";

export function LandingPricing({ landing }: { landing: NicheLanding }) {
  const pricing = landing.pricing;

  const rows =
    pricing.mode === "catalog"
      ? pricing.slugs.map((slug) => {
          const course = getCourseBySlug(slug);
          return {
            slug,
            title: course?.title ?? slug,
            porNivel: course ? levelsForView(course, "publico").length > 1 : false,
          };
        })
      : [];

  return (
    <section
      id="precio"
      className="mt-14 scroll-mt-24 rounded-[26px] border border-line bg-paper p-6 sm:p-8"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        {pricing.mode === "catalog" ? "Precio y cuotas" : "Cotización"}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
        {pricing.mode === "catalog" ? "Valor publicado" : "Cotización del programa"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-mute">{pricing.intro}</p>

      {pricing.mode === "catalog" ? (
        <>
          <div className="mt-5">
            {rows.map((row) => (
              <div
                key={row.slug}
                className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-4 first:border-t-0 first:pt-0"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{row.title}</p>
                  <p className="mt-0.5 text-xs text-faint">
                    {row.porNivel ? "Por nivel" : "Valor del curso"}
                  </p>
                </div>
                <div className="text-right">
                  <Link
                    href={courseBrochurePath(row.slug, ISO_CHILE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline hover:text-mute"
                  >
                    <FileText size={14} aria-hidden /> Ver precios y temario en el brochure PDF →
                  </Link>
                  <Link
                    href={`/cursos/${row.slug}`}
                    className="mt-1 block text-xs font-semibold text-mute no-underline hover:text-ink"
                  >
                    Ver ficha
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-wash px-4 py-3">
            <p className="text-sm font-semibold text-ink">{textoCuotas(ISO_CHILE)}</p>
            <p className="mt-1 text-xs leading-relaxed text-mute">{NOTA_CUOTAS}</p>
          </div>
        </>
      ) : (
        <>
          <ul className="mt-5 space-y-2.5">
            {pricing.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-mute">
                <Check className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <LandingCta link={landing.primaryCta} />
          </div>
        </>
      )}

      <p className="mt-4 text-xs leading-relaxed text-faint">
        {pricing.mode === "catalog" ? (
          <>
            El arancel vigente de cada curso, con sus descuentos y cuotas, está en el brochure PDF.
            Revisa el detalle en{" "}
            <Link href="/precios" className="font-semibold text-mute underline-offset-2 hover:underline">
              /precios
            </Link>{" "}
            y las condiciones en{" "}
            <Link href="/faq" className="font-semibold text-mute underline-offset-2 hover:underline">
              /faq
            </Link>
            .
          </>
        ) : (
          <>
            La propuesta se envía con temas, formato y valor según el alcance. Revisa las
            condiciones generales en{" "}
            <Link href="/faq" className="font-semibold text-mute underline-offset-2 hover:underline">
              /faq
            </Link>
            .
          </>
        )}
      </p>
    </section>
  );
}
