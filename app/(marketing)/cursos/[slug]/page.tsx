import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug, type Course } from "@/lib/data/courses";
import { getActivePromotions, getActiveSchedules, getMarketingDescription } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import BloquePaisFicha from "@/components/paises/BloquePaisFicha";
import BloqueLocalPais from "@/components/paises/BloqueLocalPais";
import BloqueLocalContenido from "@/components/paises/BloqueLocalContenido";
import FichaSeoExtra from "@/components/marketing/FichaSeoExtra";
import ComparativaCursosIA from "@/components/marketing/ComparativaCursosIA";
import PlantillaVentasPowerBi from "@/components/marketing/PlantillaVentasPowerBi";
import GuiasDelCurso from "@/components/guias/GuiasDelCurso";
import RecursosRelacionadosCurso from "@/components/marketing/RecursosRelacionadosCurso";
import ExpandibleMovil from "@/components/marketing/ExpandibleMovil";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import CourseSummaryBox, { faqsResumenCurso } from "@/components/marketing/CourseSummaryBox";
import PeruPowerBiSection from "@/components/paises/PeruPowerBiSection";
import { ogImageUrl } from "@/lib/og/url";
import { absoluteUrl, jsonLdString, tituloLocal } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import { COURSE_SEO } from "@/lib/seo/money";
import { esRutaIndexablePais } from "@/lib/seo/indexabilidad";
import { ROBOTS_INDEX_FOLLOW } from "@/lib/seo/metadata-base";
import { normalizarPais, esIndexable, ISO_CHILE } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";
import { conPais, robotsLocal } from "@/lib/paises/metadata";
import { getBloqueLocal, getSeoBloque, esRutaSeoLocal } from "@/lib/data/contenido-paises";
import { detalleCursoLocal } from "@/lib/paises/detalle-curso";
import { horarioDeCohorte } from "@/lib/paises/horarios";
import { aplicarSeoLocal } from "@/lib/paises/contenido-local/seo";
import { rutaCursoBloque } from "@/lib/paises/contenido-local";

export const revalidate = 86400;

/**
 * Solo existen como ficha los slugs del catálogo publicado. Con
 * `dynamicParams = false` un slug desconocido responde 404 estático: no se
 * renderiza al vuelo (cada render dinámico gastaba CPU y consultas a Supabase).
 */
export const dynamicParams = false;

type Params = Promise<{ slug: string; pais?: string }>;

/**
 * Cursos cuya ficha monta el bloque completo «Preguntas frecuentes»
 * (`CourseFaq`): las FAQ de `COURSE_SEO` más las del mercado. Es la misma
 * lista que `COURSE_CRO_SLUGS` de `components/marketing/CourseLeadSections.tsx`;
 * se repite acá porque ese módulo es `"use client"` y un Server Component no
 * puede leer sus exports. Si cambia allá, cambia acá: el FAQPage declara solo
 * las preguntas que la ficha pinta.
 */
const FICHA_CON_FAQ_CURSO = new Set<string>([
  "analisis-de-datos",
  "power-bi",
  "power-automate",
  "python",
  "sql-server",
  "chatgpt",
  "gemini",
]);

/**
 * Copia del curso sin montos para el componente cliente.
 *
 * Los props de un Server Component viajan en el flight data de RSC dentro del
 * HTML: si `originalPrice` o `levels[].price` van en el prop, el precio queda
 * expuesto aunque la tarjeta no lo pinte. El monto se calcula en cliente con
 * `precioVenta`, así que el cliente no necesita ninguno de estos campos.
 */
function cursoSinPrecios(course: Course): Course {
  const limpio: Course = { ...course, levels: course.levels?.map((level) => ({ ...level })) };
  delete limpio.originalPrice;
  limpio.levels?.forEach((level) => {
    delete level.price;
    delete level.originalPrice;
  });
  return limpio;
}

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, pais: rawPais } = await params;
  const pais = normalizarPais(rawPais);
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const seo = COURSE_SEO[slug];
  const titleCl = pais === ISO_CHILE ? seo?.titleCl : undefined;
  const titleBase = titleCl ?? seo?.title ?? `${course.title} — Curso en vivo Chile`;
  // Perú y México tienen title/meta escritos para su mercado; el resto sigue
  // localizando el título chileno.
  const seoLocal = esRutaSeoLocal(slug) ? getSeoBloque(pais, slug) : null;
  const title =
    pais === ISO_CHILE
      ? titleBase
      : seoLocal
        ? tituloLocal(seoLocal.title)
        : tituloLocal(conPais(localizarMercado(titleBase, pais), pais))
            .replace(/,?\s+de\s+básico(\s+a)?$/i, "")
            .replace(/\s+(y|e|o|u|de|del|en|para|con|a|la|el|los|las)(\s+con|\s+de|\s+en|\s+a)?$/i, "")
            .replace(/[\s:;,.|\-–—]+$/, "");
  const dbDescription = await getMarketingDescription(slug);
  // Chile puede declarar el precio en la meta; los demás mercados usan la
  // versión sin monto porque su precio va en otra moneda.
  const descripcionBase =
    pais === ISO_CHILE && seo?.descriptionCl
      ? seo.descriptionCl
      : seo?.description || dbDescription || course.description;
  const rawDescription = seoLocal ? seoLocal.description : localizarMercado(descripcionBase, pais);
  const description =
    pais === "do" && rawDescription.length > 155
      ? rawDescription.replace(/República Dominicana/g, "Rep. Dominicana")
      : rawDescription;
  const canon = absoluteUrl(rutaLocal(pais, `/cursos/${slug}`));

  // Tarjeta OG de marca (tipográfica, papel-monócromo) — reemplaza las
  // portadas remotas de estilo antiguo.
  const h1Base = (pais === ISO_CHILE && seo?.h1Cl) || seo?.h1 || course.title;
  const shareImage = ogImageUrl({
    kicker: localizarMercado("Curso en vivo Chile", pais),
    title: localizarMercado(h1Base, pais),
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}`,
  });

  // Solo las rutas indexables del país entran en el juego de hreflang. En
  // países secundarios con whitelist, se pisa el `noindex` del `[pais]/layout.tsx`
  // con `ROBOTS_INDEX_FOLLOW`.
  const ruta = `/cursos/${slug}`;
  const indexable = esRutaIndexablePais(pais, ruta);

  const metadata: Metadata = {
    title: pais === "cl" ? (titleCl ?? seo?.title ? { absolute: titleCl ?? seo!.title } : titleBase) : { absolute: title },
    description,
    alternates: {
      canonical: canon,
      ...(indexable ? { languages: hreflangDe(ruta) } : {}),
    },
    ...(indexable
      ? esIndexable(pais)
        ? {}
        : { robots: ROBOTS_INDEX_FOLLOW }
      : { robots: robotsLocal(pais) }),
    openGraph: {
      title,
      description,
      url: canon,
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };

  return aplicarSeoLocal(metadata, pais, rutaCursoBloque(slug));
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug, pais: rawPais } = await params;
  const pais = normalizarPais(rawPais);
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const seo = COURSE_SEO[slug];
  const [dbDescription, schedulesData, promotionsRaw] = await Promise.all([
    getMarketingDescription(slug),
    getActiveSchedules(),
    getActivePromotions(),
  ]);
  const promotions = pais === ISO_CHILE ? promotionsRaw : [];
  if (dbDescription && !seo) {
    course.description = dbDescription;
  } else if (seo) {
    course.description = pais === ISO_CHILE && seo.descriptionCl ? seo.descriptionCl : seo.description;
  }

  const schedules = schedulesData as CourseSchedule[];

  // Horario local y preguntas de pie de página (incluye precio vigente del mercado).
  const cohorte = schedules.find((s) => s.course_slug === course.slug);
  const { inicio, fin } = horarioDeCohorte(cohorte?.schedule_time);
  const detalle = detalleCursoLocal({
    iso: pais,
    slug: course.slug,
    courseTitle: course.title,
    inicio,
    fin,
    promotions,
  });

  const courseJsonLd = getCourseJsonLd(course, "publico", pais, { schedules, promotions });
  const bloque = getBloqueLocal(pais, { curso: slug });
  // El bloque «Preguntas frecuentes» de la ficha sale de dos fuentes y el
  // FAQPage declara exactamente las que se ven: `CourseFaq` pinta las de
  // `COURSE_SEO[slug]` (filtradas por `soloChile` y sin duplicar el precio si
  // ya lo aporta `detalle.faqs`) más `detalle.faqs`, y `CourseLocalSeo` pinta
  // solo `detalle.faqs` en los cursos sin plantilla CRO.
  const tienePrecioEnDetalle = detalle.faqs.some((faq) => /^¿cuánto cuesta\b/i.test(faq.q));
  const faqsCursoRaw = FICHA_CON_FAQ_CURSO.has(slug)
    ? (seo?.faqs ?? [])
        .filter((faq) => !faq.soloChile || pais === ISO_CHILE)
        .filter((faq) => !(tienePrecioEnDetalle && /^¿cuánto cuesta\b/i.test(faq.q)))
        .map((faq) => ({
          q: localizarMercado(faq.q, pais),
          a: localizarMercado(faq.a, pais),
        }))
    : [];
  const esChatgptOGemini = slug === "chatgpt" || slug === "gemini";
  const preguntasExistentes = new Set(
    [...faqsCursoRaw, ...detalle.faqs].map((faq) => faq.q.toLowerCase())
  );
  // ChatGPT y Gemini muestran exactamente 8 FAQs (2 dinámicas + 6 específicas), sin faqsResumen extra.
  const faqsResumen = esChatgptOGemini
    ? []
    : faqsResumenCurso(course, pais, detalle.horario).filter(
        (faq) => !preguntasExistentes.has(faq.q.toLowerCase())
      );
  detalle.faqs = [...detalle.faqs, ...faqsResumen];

  const vistosFaq = new Set<string>();
  const faqsJsonLd = [...faqsCursoRaw, ...detalle.faqs]
    .filter((faq) => {
      const clave = faq.q.trim().toLowerCase();
      if (vistosFaq.has(clave)) return false;
      vistosFaq.add(clave);
      return true;
    })
    .map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      courseJsonLd,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(rutaLocal(pais, "/")) },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl(rutaLocal(pais, "/cursos")) },
          {
            "@type": "ListItem",
            position: 3,
            name: localizarMercado((pais === ISO_CHILE && seo?.h1Cl) || seo?.h1 || course.title, pais),
            item: absoluteUrl(rutaLocal(pais, `/cursos/${slug}`)),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqsJsonLd,
      },
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      {/* `?para=` y `?nivel=` los lee el cliente desde la URL: si un Server
          Component espera `searchParams`, la ficha entera vuelve a renderizarse
          dinámica y se pierde el ISR. */}
      <CourseDetailClient
        key={course.slug}
        course={cursoSinPrecios(course)}
        initialSchedules={schedules}
        detalleLocal={detalle}
        promotions={promotions}
        referenceDateIso={new Date().toISOString().slice(0, 10)}
        resumen={
          <CourseSummaryBox
            course={course}
            pais={pais}
            inicio={inicio}
            fin={fin}
            promotions={promotions}
            tieneCohorteConfirmada={Boolean(cohorte)}
          />
        }
        // Citas reales de alumnos de este curso (LinkedIn), justo después del
        // profesor: es prueba social y no puede quedar bajo los bloques SEO. Se
        // oculta sola si no hay testimonios o con NEXT_PUBLIC_TESTIMONIOS=0.
        testimonios={<TestimoniosDeCurso cursoSlug={course.slug} />}
        comparativa={
          course.slug === "chatgpt" || course.slug === "gemini" ? (
            <ComparativaCursosIA slug={course.slug} pais={pais} />
          ) : null
        }
      />
      <PeruPowerBiSection pais={pais} slug={course.slug} />
      {/* Bloque propio del mercado: texto, horario, FAQ y enlaces internos.
          Reemplaza a CountryContext, que repetía los mismos datos. */}
      {/* Bloques largos de texto: en celular se muestran recortados con
          «Ver más» (ExpandibleMovil). El HTML completo se mantiene para SEO. */}
      <ExpandibleMovil etiqueta="Ver más del curso en tu país">
        <BloquePaisFicha curso={course} pais={pais} inicio={inicio} fin={fin} promotions={promotions} />
      </ExpandibleMovil>
      {/* Datos del mercado para la ficha: precio en moneda local (gate del
          brochure), horario convertido, pago, cuotas, clase gratis y
          certificado, más el resto de fichas y guías del país. */}
      {bloque ? (
        <ExpandibleMovil>
          <BloqueLocalPais iso={pais} bloque={bloque} contexto="ficha" conEnlaces />
        </ExpandibleMovil>
      ) : null}
      <ExpandibleMovil fondo="var(--color-wash)">
        <BloqueLocalContenido
          iso={pais}
          ruta={rutaCursoBloque(course.slug)}
          inicio={inicio}
          fin={fin}
          conFaqJsonLd={false}
        />
      </ExpandibleMovil>
      <ExpandibleMovil etiqueta="Ver programa completo">
        <FichaSeoExtra slug={course.slug} pais={pais} />
      </ExpandibleMovil>
      {/* Bloque único de la antigua landing /curso-power-bi (plantilla CSV),
          migrado aquí antes de convertir esa landing en 301. */}
      {course.slug === "power-bi" ? (
        <ExpandibleMovil fondo="var(--color-paper)">
          <PlantillaVentasPowerBi pais={pais} />
        </ExpandibleMovil>
      ) : null}
      <ExpandibleMovil fondo="var(--g-bg, var(--color-canvas))" etiqueta="Ver todas las guías">
        <GuiasDelCurso curso={course.slug} pais={pais} />
      </ExpandibleMovil>
      {/* Enlaces internos que antes iban en el hero: landings, guías, caso y
          catálogo, en tarjetas y renderizados en el servidor (valor SEO). */}
      <ExpandibleMovil etiqueta="Ver más recursos">
        <RecursosRelacionadosCurso slug={course.slug} pais={pais} />
      </ExpandibleMovil>
      {course.slug === "chatgpt" || course.slug === "gemini" ? (
        <div className="border-t border-line bg-canvas px-4 py-6 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-[1400px] text-xs leading-relaxed text-faint">
            ProgramBI no está afiliado a OpenAI ni a Google. ChatGPT es marca de OpenAI; Gemini y
            Google Workspace son marcas de Google.
          </p>
        </div>
      ) : null}
    </>
  );
}
