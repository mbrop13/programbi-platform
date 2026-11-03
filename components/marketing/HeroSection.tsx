import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import HeroPreviewLazy from "@/components/marketing/HeroPreviewLazy";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { PAGE_SEO } from "@/lib/seo/money";
import { getPais, ISO_CHILE } from "@/config/paises";
import type { ContenidoPais } from "@/lib/data/contenido-paises/tipos";
import { localizarMercado } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

function HomeH1({ h1, nombre }: { h1: string; nombre: string }) {
  const line = h1.indexOf("datos en vivo");
  const marca = h1.lastIndexOf(nombre);
  if (line <= 0 || marca < line) return h1;
  return (
    <>
      {h1.slice(0, line)}
      <br />
      {h1.slice(line, marca)}
      <em className="italic font-semibold">{nombre}</em>
      {h1.slice(marca + nombre.length)}
    </>
  );
}

export default function HeroSection({
  pais = ISO_CHILE,
  contenido = null,
}: {
  pais?: string;
  contenido?: ContenidoPais | null;
}) {
  const nombre = getPais(pais).nombre;
  const h1 = contenido?.hero.h1 ?? localizarMercado(PAGE_SEO.home.h1, pais);
  return (
    <section id="inicio" className="relative overflow-hidden lg:min-h-[calc(100dvh-72px)]">
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-12 lg:pt-20 lg:pb-20 xl:gap-14">
        <div className="min-w-0">
          <h1 className="max-w-[22ch] text-balance text-4xl font-bold leading-[1.2] tracking-tight text-ink sm:text-5xl sm:leading-[1.16] lg:text-[3.5rem] lg:leading-[1.16]">
            <HomeH1 h1={h1} nombre={nombre} />
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            {contenido?.hero.parrafo ??
              "Academia de datos en vivo por Zoom: análisis de datos, Power BI y Power Automate."}
          </p>

          {contenido ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-faint">
              {contenido.hero.nota}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-2.5">
            <Link
              href={rutaLocal(pais, "/cursos")}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3.5 no-underline transition-colors hover:border-ink/25 hover:bg-wash"
            >
              <span className="min-w-0">
                <span className="mt-0.5 block text-base font-semibold tracking-tight text-ink">
                  Ver cursos
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-mute">
                  Explora el catálogo completo.
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-ink transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <WhatsAppCta
              page="/"
              intent="general"
              country={pais}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas px-4 py-3.5 no-underline transition-colors hover:border-ink/25 hover:bg-wash"
            >
              <span className="min-w-0">
                <span className="mt-0.5 block text-base font-semibold tracking-tight text-ink">
                  Hablar por WhatsApp
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-mute">
                  Te respondemos con fechas y valores.
                </span>
              </span>
              <MessageCircle size={16} className="shrink-0 text-ink" />
            </WhatsAppCta>
          </div>

        </div>

        <HeroPreviewLazy />
      </div>
    </section>
  );
}
