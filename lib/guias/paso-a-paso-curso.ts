import { textoCuotas } from "@/config/cuotas";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import { courses } from "@/lib/data/courses";
import { getCourseSyllabus, type SyllabusTopic } from "@/lib/data/syllabuses";
import type { CursoGuiaSlug } from "@/lib/guias/paso-a-paso-tipos";
import { formatMoneda } from "@/lib/paises/precios";

export interface DatosCursoGuia {
  slug: CursoGuiaSlug;
  nombre: string;
  descripcionCorta: string;
  horas: number;
  accentColor: string;
  imageUrl: string;
  temarioBullets: [string, string, string];
  precio: number | null;
  precioFormateado: string | null;
  precioLista: number | null;
  precioListaFormateado: string | null;
  textoCuotas: string;
}

function limpiarTextoTemario(raw: string): string {
  return raw
    .replace(/^(?:Objetivo|Funciones|Ejercicios?):\s*/i, "")
    .replace(/\s*\(\d+\s*horas?\)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extraerTresVinetas(slug: CursoGuiaSlug): [string, string, string] {
  const course = courses.find((c) => c.slug === slug);
  if (!course) {
    return [
      "Fundamentos aplicados con ejercicios reales",
      "Casos prácticos guiados paso a paso",
      "Proyecto integrador con retroalimentación en vivo",
    ];
  }

  const syllabus = getCourseSyllabus(course);
  const candidates: string[] = [];
  const seen = new Set<string>();

  const pushClean = (raw: string | SyllabusTopic) => {
    const text = typeof raw === "string" ? raw : raw.title;
    const clean = limpiarTextoTemario(text);
    if (!clean || seen.has(clean.toLowerCase())) return;
    seen.add(clean.toLowerCase());
    candidates.push(clean);
  };

  // Toma hasta 1 tema concreto de los primeros módulos para cubrir amplitud real.
  for (const level of syllabus.levels) {
    for (const mod of level.modules) {
      if (mod.topics.length > 0) {
        pushClean(mod.topics[0]);
      } else if (mod.title) {
        pushClean(mod.title);
      }
      if (candidates.length >= 3) break;
    }
    if (candidates.length >= 3) break;
  }

  // Si algún módulo tuvo menos, completa con otros topics reales del temario.
  if (candidates.length < 3) {
    for (const level of syllabus.levels) {
      for (const mod of level.modules) {
        for (const topic of mod.topics) {
          pushClean(topic);
          if (candidates.length >= 3) break;
        }
        if (candidates.length >= 3) break;
      }
      if (candidates.length >= 3) break;
    }
  }

  // Último respaldo con whatYouLearn del propio curso.
  if (candidates.length < 3) {
    for (const item of course.whatYouLearn) {
      pushClean(item);
      if (candidates.length >= 3) break;
    }
  }

  return [
    candidates[0] ?? course.shortDescription,
    candidates[1] ?? course.title,
    candidates[2] ?? `${course.durationHours} horas en vivo`,
  ];
}

export function datosCursoParaGuia(curso: CursoGuiaSlug): DatosCursoGuia {
  const found = courses.find((c) => c.slug === curso);
  const precio = precioPublico("cl", curso);
  const precioLista = precioListaPublico("cl", curso);

  return {
    slug: curso,
    nombre: found?.title ?? curso,
    descripcionCorta: found?.shortDescription ?? "",
    horas: found?.durationHours ?? 20,
    accentColor: found?.accentColor ?? "#171716",
    imageUrl: found?.imageUrl ?? "/images/courses/power-bi-card.webp",
    temarioBullets: extraerTresVinetas(curso),
    precio,
    precioFormateado: precio != null ? formatMoneda("cl", precio) : null,
    precioLista,
    precioListaFormateado: precioLista != null ? formatMoneda("cl", precioLista) : null,
    textoCuotas: textoCuotas("cl"),
  };
}
