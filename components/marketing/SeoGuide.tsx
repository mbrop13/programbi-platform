import Link from "next/link";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { PACK } from "@/lib/data/pack-adopcion";

export type GuideSection = { h2: string; paragraphs: string[] };
export type GuideFaq = { q: string; a: string };
export type GuideLink = { href: string; label: string };

export default function SeoGuide({
  kicker,
  h1,
  lead,
  crumbs,
  sections,
  faqs,
  related,
  pagePath,
}: {
  kicker: string;
  h1: string;
  lead: string;
  crumbs: GuideLink[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  related: GuideLink[];
  pagePath: string;
}) {
  return (
    <article className="bg-canvas px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-sm text-mute" aria-label="Migas">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 ? <span className="mx-2 text-faint">/</span> : null}
              {i === crumbs.length - 1 ? (
                <span className="text-ink">{c.label}</span>
              ) : (
                <Link href={c.href} className="no-underline hover:text-ink">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">{kicker}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mute">{lead}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/empresas"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
          >
            Ver Pack Adopción
          </Link>
          <WhatsAppCta
            page={pagePath}
            intent="pack"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            WhatsApp
          </WhatsAppCta>
        </div>

        {sections.map((section) => (
          <section key={section.h2} className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-ink">{section.h2}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-mute">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-line bg-paper p-6">
          <h2 className="text-xl font-bold tracking-tight text-ink">{PACK.headline}</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            {PACK.dashboards} dashboards + adopción {PACK.trainingWeeks} semanas + {PACK.postGoLiveWeeks} semanas post
            go-live. {PACK.priceLabel} ({PACK.priceFromLabel}). Factura directa.
          </p>
          <Link href="/empresas" className="mt-4 inline-flex text-sm font-semibold text-ink">
            Ir a /empresas
          </Link>
        </section>

        {faqs.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Preguntas frecuentes</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <nav className="mt-14 border-t border-line pt-8" aria-label="Relacionados">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">Sigue leyendo</p>
          <ul className="mt-3 space-y-2">
            {related.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm font-semibold text-ink no-underline hover:text-mute">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
