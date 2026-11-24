import type { Metadata } from "next";
import { datosCursoParaGuia } from "@/lib/guias/paso-a-paso-curso";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { ogImageUrl } from "@/lib/og/url";
import { absoluteUrl, ORG_ID, pageOg, SITE_URL } from "@/lib/seo";

function limpiarEnlacesMarkdown(texto: string): string {
  return texto.replace(/\[([^\]]+)\]\((?:\/(?!\/)[^)\s]*|https?:\/\/[^)\s]+)\)/g, "$1");
}

function contarPalabrasTexto(texto: string | undefined): number {
  if (!texto) return 0;
  const tokens = limpiarEnlacesMarkdown(texto).trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Cuenta palabras visibles reales de la guía paso a paso excluyendo código fuente,
 * para `wordCount` en JSON-LD y estimación de tiempo de lectura.
 */
export function contarPalabrasGuiaPasoAPaso(guia: GuiaPasoAPaso): number {
  let total = 0;

  total += contarPalabrasTexto(guia.h1);
  total += contarPalabrasTexto(guia.subtitle);

  total += contarPalabrasTexto(guia.en30Segundos.queLogras);
  total += contarPalabrasTexto(guia.en30Segundos.herramienta);
  total += contarPalabrasTexto(guia.en30Segundos.tiempo);
  for (const b of guia.en30Segundos.bullets) total += contarPalabrasTexto(b);

  total += contarPalabrasTexto(guia.requisitos.version);
  total += contarPalabrasTexto(guia.requisitos.compatibilidadMacWeb);
  total += contarPalabrasTexto(guia.requisitos.avisoEducativo);
  for (const item of guia.requisitos.lista) total += contarPalabrasTexto(item);

  total += contarPalabrasTexto(guia.avisoPrivacidad);

  for (const sec of guia.secciones) {
    total += contarPalabrasTexto(sec.titulo);
    for (const p of sec.parrafos) total += contarPalabrasTexto(p);
    if (sec.lista) for (const li of sec.lista) total += contarPalabrasTexto(li);
    if (sec.listaOrdenada) for (const li of sec.listaOrdenada) total += contarPalabrasTexto(li);
    if (sec.alerta) {
      total += contarPalabrasTexto(sec.alerta.titulo);
      total += contarPalabrasTexto(sec.alerta.texto);
    }
    total += contarPalabrasTexto(sec.verificaResultado);
    if (sec.tabla) {
      total += contarPalabrasTexto(sec.tabla.caption);
      for (const h of sec.tabla.encabezados) total += contarPalabrasTexto(h);
      for (const row of sec.tabla.filas) {
        for (const cell of row) total += contarPalabrasTexto(cell);
      }
    }
    if (sec.subsecciones) {
      for (const sub of sec.subsecciones) {
        total += contarPalabrasTexto(sub.titulo);
        for (const p of sub.parrafos) total += contarPalabrasTexto(p);
        if (sub.lista) for (const li of sub.lista) total += contarPalabrasTexto(li);
        if (sub.tabla) {
          total += contarPalabrasTexto(sub.tabla.caption);
          for (const h of sub.tabla.encabezados) total += contarPalabrasTexto(h);
          for (const row of sub.tabla.filas) {
            for (const cell of row) total += contarPalabrasTexto(cell);
          }
        }
      }
    }
  }

  for (const err of guia.erroresComunes) {
    total += contarPalabrasTexto(err.error);
    total += contarPalabrasTexto(err.causa);
    total += contarPalabrasTexto(err.solucion);
  }

  for (const faq of guia.faqs) {
    total += contarPalabrasTexto(faq.q);
    total += contarPalabrasTexto(faq.a);
  }

  return total;
}

export function tiempoLecturaPasoAPaso(guia: GuiaPasoAPaso): number {
  const palabras = contarPalabrasGuiaPasoAPaso(guia);
  return Math.max(3, Math.round(palabras / 200));
}

export function metadataDeGuiaPasoAPaso(guia: GuiaPasoAPaso): Metadata {
  const path = `/guias/${guia.slug}`;
  const canonical = absoluteUrl(path);
  const curso = datosCursoParaGuia(guia.curso);
  const share = pageOg({
    title: guia.title,
    description: guia.meta,
    path,
    kicker: `Guía paso a paso · ${guia.herramienta}`,
    tags: [guia.herramienta, guia.nivel, "Chile"],
    accent: curso.accentColor,
  });

  return {
    title: { absolute: guia.title },
    description: guia.meta,
    alternates: { canonical },
    openGraph: {
      title: guia.title,
      description: guia.meta,
      url: canonical,
      type: "article",
      locale: "es_CL",
      siteName: "ProgramBI",
      publishedTime: guia.published,
      modifiedTime: guia.updated,
      images: share.images,
    },
    twitter: share.twitter,
  };
}

export function jsonLdDeGuiaPasoAPaso(guia: GuiaPasoAPaso) {
  const path = `/guias/${guia.slug}`;
  const canonical = absoluteUrl(path);
  const curso = datosCursoParaGuia(guia.curso);
  const wordCount = contarPalabrasGuiaPasoAPaso(guia);
  const mins = Math.max(3, Math.round(wordCount / 200));

  const ogUrl = ogImageUrl({
    kicker: `Guía paso a paso · ${guia.herramienta}`,
    title: guia.title,
    description: guia.meta,
    tags: [guia.herramienta, guia.nivel, "Chile"],
    accent: curso.accentColor,
    path: path.replace(/^\//, ""),
  });

  const org = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "ProgramBI",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
      width: 600,
      height: 160,
    },
  };

  const techArticle = {
    "@type": "TechArticle",
    "@id": `${canonical}#article`,
    headline: guia.h1,
    description: guia.meta,
    datePublished: guia.published,
    dateModified: guia.updated,
    inLanguage: "es-CL",
    wordCount,
    timeRequired: `PT${mins}M`,
    author: org,
    publisher: org,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    image: [absoluteUrl(ogUrl)],
  };

  const howToSteps = guia.secciones
    .filter((s) => s.esPasoHowTo)
    .map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.titulo,
      text: limpiarEnlacesMarkdown(s.parrafos[0] || s.resumenHowTo || s.titulo),
      url: `${canonical}#${s.id}`,
    }));

  const howTo: Record<string, unknown> = {
    "@type": "HowTo",
    "@id": `${canonical}#howto`,
    name: guia.h1,
    description: guia.meta,
    totalTime: guia.totalTimeIso,
    step: howToSteps,
  };

  if (guia.herramientasHowTo && guia.herramientasHowTo.length > 0) {
    howTo.tool = guia.herramientasHowTo.map((name) => ({
      "@type": "HowToTool",
      name,
    }));
  }
  if (guia.insumosHowTo && guia.insumosHowTo.length > 0) {
    howTo.supply = guia.insumosHowTo.map((name) => ({
      "@type": "HowToSupply",
      name,
    }));
  }

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: guia.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guías",
        item: absoluteUrl("/guias"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guia.h1,
        item: canonical,
      },
    ],
  };

  const graph: Record<string, unknown>[] = [techArticle];
  if (!guia.omitirHowTo && howToSteps.length > 0) {
    graph.push(howTo);
  }
  graph.push(faqPage, breadcrumbList);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
