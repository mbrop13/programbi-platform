import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import HeroPreview from "@/components/marketing/HeroPreview";
import { HERO_TABS, type HeroCursos } from "@/components/marketing/hero-demo";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { stats } from "@/components/marketing/Metrics";
import { mentors } from "@/lib/data/mentors";
import { courses } from "@/lib/data/courses";
import { catalogHours } from "@/lib/data/course-views";
import {
  formatShortDate,
  getNearestSchedule,
  nextCohortForCourse,
  type CourseSchedule,
} from "@/lib/data/course-schedules";
import { zonaDe } from "@/lib/paises/horarios";
import { PAGE_SEO } from "@/lib/seo/money";
import { getPais, ISO_CHILE, muestraPrecioDirecto } from "@/config/paises";
import type { ContenidoPais } from "@/lib/data/contenido-paises/tipos";
import { descuentoPublico, localizarMercado, type PromocionAplicable } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

/** Próxima cohorte con fecha real; la arma la página desde los horarios activos. */
export type ProximoInicio = { fecha: string; curso: string; href: string };

/** Cada punto sale de la FAQ de la home: no prometer nada que no esté ahí. */
const BENEFICIOS = [
  "Desde cero",
  "Cada clase queda grabada",
  "Certificado digital",
] as const;

/** «en vivo» no se parte entre líneas: es la promesa del titular. */
function SinCorte({ texto }: { texto: string }) {
  const i = texto.indexOf("en vivo");
  if (i < 0) return texto;
  return (
    <>
      {texto.slice(0, i)}
      <span className="whitespace-nowrap">en vivo</span>
      {texto.slice(i + "en vivo".length)}
    </>
  );
}

function HomeH1({ h1, nombre }: { h1: string; nombre: string }) {
  const marca = h1.lastIndexOf(nombre);
  if (marca <= 0) return <SinCorte texto={h1} />;
  return (
    <>
      <SinCorte texto={h1.slice(0, marca)} />
      <em className="italic font-semibold">{nombre}</em>
      {h1.slice(marca + nombre.length)}
    </>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] shrink-0 fill-[#1fa855]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Próxima cohorte, horas y descuento de los tres cursos que muestra el panel. */
function cursosDelPanel(
  pais: string,
  schedules: CourseSchedule[],
  promotions: readonly PromocionAplicable[] = [],
): HeroCursos {
  const zona = zonaDe(pais);
  return Object.fromEntries(
    HERO_TABS.map((tab) => {
      const curso = courses.find((c) => c.slug === tab.slug);
      // El hero promete «desde cero»: primero la cohorte del nivel básico, que
      // es la misma que abre la ficha. Si no hay, la más cercana de otro nivel.
      const propias = schedules
        .filter((s) => s.course_slug === tab.slug)
        .map((s) => ({ ...s, is_active: s.is_active !== false }));
      const cercana =
        getNearestSchedule(propias.filter((s) => s.level_name === "Básico")) ??
        getNearestSchedule(propias);
      const cohorte = cercana ? nextCohortForCourse(tab.slug, [cercana], zona) : null;
      return [
        tab.id,
        {
          href: rutaLocal(pais, `/cursos/${tab.slug}`),
          inicio: cercana ? formatShortDate(cercana.start_date) : null,
          dias: cohorte?.days ?? null,
          hora: cohorte?.time ?? null,
          horas: curso ? catalogHours(curso) : 0,
          descuento: descuentoPublico(pais, tab.slug, promotions),
        },
      ];
    }),
  ) as HeroCursos;
}

export default function HeroSection({
  pais = ISO_CHILE,
  contenido = null,
  proximo = null,
  schedules = [],
  promotions = [],
}: {
  pais?: string;
  contenido?: ContenidoPais | null;
  proximo?: ProximoInicio | null;
  schedules?: CourseSchedule[];
  promotions?: readonly PromocionAplicable[];
}) {
  const nombre = getPais(pais).nombre;
  const h1 = contenido?.hero.h1 ?? localizarMercado(PAGE_SEO.home.h1, pais);
  const profesor = mentors.find((m) => m.isFounder && m.imageUrl) ?? null;

  return (
    <section id="inicio" className="bg-bg text-text-primary">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:px-8 lg:pt-10 lg:pb-16 xl:gap-14 xl:px-10">
        <div className="min-w-0">
          {proximo ? (
            <Link
              href={proximo.href}
              className="mb-5 inline-flex min-h-[44px] max-w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary no-underline transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5]"
            >
              <span className="size-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
              <span className="truncate">
                <span className="font-semibold text-text-primary tabular-nums">
                  Próximo inicio: {proximo.fecha}
                </span>
                {" · "}
                {proximo.curso}
              </span>
            </Link>
          ) : (
            <p className="mb-5 inline-flex min-h-[40px] items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary">
              <span className="size-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
              <span className="font-semibold text-text-primary">Inscripciones abiertas</span>
            </p>
          )}

          <h1 className="max-w-[18ch] text-balance text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-text-primary sm:text-5xl sm:leading-[1.06] xl:text-[3.5rem]">
            <HomeH1 h1={h1} nombre={nombre} />
          </h1>

          <p className="mt-5 max-w-[34rem] text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {contenido?.hero.parrafo ??
              "Aprende Power BI, SQL y Python en clases en vivo por Zoom, con profesores que trabajan con datos en banca, retail y minería."}
          </p>

          {contenido ? (
            <p className="mt-3 text-xs font-medium text-text-muted">{contenido.hero.nota}</p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={rutaLocal(pais, "/cursos")}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-text-primary px-6 text-[15px] font-semibold text-surface no-underline transition-colors hover:bg-text-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5]"
            >
              Ver cursos y fechas
            </Link>
            {muestraPrecioDirecto(pais) ? (
              <a
                href="#cotizar"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface px-5 text-[15px] font-semibold text-text-primary no-underline transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5]"
              >
                Cotizar o recibir temario
              </a>
            ) : (
              <WhatsAppCta
                page="/"
                intent="general"
                country={pais}
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-surface px-5 text-[15px] font-semibold text-text-primary no-underline transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5]"
              >
                <WhatsAppGlyph />
                Hablar por WhatsApp
              </WhatsAppCta>
            )}
          </div>
          <p className="mt-3 text-sm text-text-muted">Te respondemos con fechas y valores.</p>

          <ul className="mt-6 flex flex-col gap-2 text-sm font-medium text-text-primary sm:flex-row sm:flex-wrap sm:gap-x-5">
            {BENEFICIOS.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-text-primary text-surface">
                  <Check size={11} strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid max-w-[34rem] grid-cols-3 border-t border-border pt-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse ${i > 0 ? "border-l border-border pl-4 sm:pl-6" : "pr-2"}`}
              >
                <dt className="mt-1 text-xs leading-snug text-text-secondary">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-text-primary tabular-nums sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <HeroPreview cursos={cursosDelPanel(pais, schedules, promotions)}>
            {profesor?.imageUrl ? (
              <div className="flex shrink-0 items-center gap-2.5">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                  <Image
                    src={profesor.imageUrl}
                    alt={`${profesor.name}, profesor de ProgramBI`}
                    width={40}
                    height={40}
                    className="size-full object-cover object-[center_18%]"
                  />
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-xs font-medium text-white">{profesor.name}</p>
                  <p className="inline-flex items-center gap-1.5 text-[11px] text-[#b4b7c0]">
                    <span className="size-1.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
                    En vivo
                  </p>
                </div>
              </div>
            ) : null}
          </HeroPreview>
        </div>
      </div>
    </section>
  );
}
