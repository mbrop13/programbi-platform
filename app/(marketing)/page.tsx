import type { Metadata } from "next";
import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import Metrics from "@/components/marketing/Metrics";
import Programs from "@/components/marketing/Programs";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import CountryContent from "@/components/marketing/CountryContent";
import BloqueLocalContenido from "@/components/paises/BloqueLocalContenido";
import HomeDeferred from "@/components/marketing/HomeDeferred";
import { ObjetivosCursos, RecursosDatos } from "@/components/marketing/EnlacesPrioritarios";
import IndicePais from "@/components/paises/IndicePais";
import BloqueLocalPais from "@/components/paises/BloqueLocalPais";
import { homeFaqs } from "@/lib/data/site";
import { getBloqueLocal, getContenidoPais } from "@/lib/data/contenido-paises";
import { courses } from "@/lib/data/courses";
import { catalogHours, publicLevelCount } from "@/lib/data/course-views";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import {
  DEFAULT_OG_IMAGE,
  ORG_ID,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  jsonLdString,
} from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { localizarMercado } from "@/lib/paises/precios";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.home.title },
  description: PAGE_SEO.home.description,
  alternates: { canonical: absoluteUrl("/"), languages: hreflangDe("/") },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: SITE_URL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const { pais: raw } = await params;
  const pais = normalizarPais(raw);
  const contenido = getContenidoPais(pais);
  const bloque = getBloqueLocal(pais);
  const homeUrl = absoluteUrl(rutaLocal(pais, "/"));
  const idioma = getPais(pais).idioma;
  // La FAQ del hub es la del bloque local cuando existe: así el texto visible
  // y el FAQPage JSON-LD salen de la misma lista.
  const faqs = bloque
    ? bloque.faqs
    : contenido
      ? contenido.faqs
      : homeFaqs.map((faq) => ({
          q: localizarMercado(faq.q, pais),
          a: localizarMercado(faq.a, pais),
        }));
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: localizarMercado(PAGE_SEO.home.title, pais),
        description: localizarMercado(PAGE_SEO.home.description, pais),
        inLanguage: idioma,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${homeUrl}#cursos` },
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#cursos`,
        name: localizarMercado("Cursos de análisis de datos en vivo | ProgramBI", pais),
        numberOfItems: courses.length,
        itemListElement: courses.map((course, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: localizarMercado(course.title, pais),
          url: absoluteUrl(rutaLocal(pais, `/cursos/${course.slug}`)),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${homeUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd) }} />
      <HeroSection pais={pais} contenido={contenido} />
      <LogoSlider />
      <Metrics />
      <Programs
        schedules={schedules}
        catalog={courses.map((c) => ({
          slug: c.slug,
          title: c.title,
          shortDescription: c.shortDescription,
          imageUrl: c.imageUrl,
          durationHours: catalogHours(c),
          techStack: c.techStack,
          badgeLabel: c.badgeLabel,
          levelsCount: publicLevelCount(c),
        }))}
      />
      {pais === ISO_CHILE ? <ObjetivosCursos /> : null}
      {contenido ? <CountryContent contenido={contenido} /> : null}
      {bloque ? (
        <BloqueLocalPais iso={pais} bloque={bloque} contexto="hub" conEnlaces={false} />
      ) : null}
      <BloqueLocalContenido iso={pais} ruta="hub" conFaqJsonLd={false} />
      <Team />
      <Quote />
      <FaqSection
        faqs={faqs}
        titulo={contenido ? `Preguntas frecuentes en ${getPais(pais).nombre}` : undefined}
      />
      {/* Cierre de navegación: recursos para decidir (solo Chile) y el índice
          completo de fichas y guías del mercado, que no cabe en las seis
          tarjetas visibles de «Cursos». */}
      {pais === ISO_CHILE ? <RecursosDatos /> : null}
      <IndicePais pais={pais} />
      <HomeDeferred />
    </>
  );
}
