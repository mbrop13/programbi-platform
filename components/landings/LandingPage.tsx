import LogoSlider from "@/components/marketing/LogoSlider";
import { buildLandingJsonLd } from "@/lib/data/landings-nicho";
import type { NicheLanding } from "@/lib/data/landings-nicho";
import { jsonLdString } from "@/lib/seo";
import { LandingClosing } from "./LandingClosing";
import { LandingContactSection } from "./LandingContactSection";
import { LandingFaq } from "./LandingFaq";
import { LandingHero } from "./LandingHero";
import { LandingLinks } from "./LandingLinks";
import { LandingPricing } from "./LandingPricing";
import { LandingSectionBlock } from "./LandingSectionBlock";

/**
 * Layout compartido de las cuatro landings de nicho. El contenido viene de
 * `lib/data/landings-nicho.ts`; acá solo se compone y se agrega el JSON-LD.
 */
export function LandingPage({ landing }: { landing: NicheLanding }) {
  const jsonLd = buildLandingJsonLd(landing);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <article className="bg-canvas text-ink">
        <LandingHero landing={landing} />

        {landing.showLogos ? <LogoSlider className="border-0 bg-transparent" /> : null}

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-14 lg:py-16">
            {landing.sections.map((section) => (
              <LandingSectionBlock key={section.h2} section={section} />
            ))}

            <LandingPricing landing={landing} />
            <LandingFaq faqs={landing.faqs} />
            <LandingLinks title="Guías para seguir" links={landing.guides} />
            <LandingLinks title="Sigue en ProgramBI" links={landing.related} />

            {landing.contact ? <LandingContactSection /> : null}
          </div>
        </div>

        <LandingClosing closing={landing.closing} />
      </article>
    </>
  );
}
