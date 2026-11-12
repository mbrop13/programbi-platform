import { PAISES_CARPETA } from "@/config/paises";
import { courses } from "@/lib/data/courses";

export const revalidate = 86400;
export const dynamicParams = false;

/**
 * La ficha por país reexporta la página de marketing para no duplicar la
 * lógica del gate de precios, los horarios y el JSON-LD. El bloque «Guías de <curso>»
 * (components/guias/GuiasDelCurso) se monta una sola vez allí y también sale
 * en /<pais>/cursos/<slug>, priorizando la guía del país que trae la ruta.
 *
 * `generateStaticParams` vive acá y no en la página de marketing: esta ruta
 * tiene dos segmentos dinámicos ([pais] y [slug]) y hay que emitir el par
 * completo. Son todos los países con carpeta (Chile vive en la raíz) por todos
 * los cursos del catálogo publicado, el mismo conjunto que anuncia el sitemap.
 * Con `dynamicParams = false`, cualquier otro país o slug da 404 estático.
 */
export function generateStaticParams(): { pais: string; slug: string }[] {
  return PAISES_CARPETA.flatMap((pais) =>
    courses.map((course) => ({ pais: pais.iso, slug: course.slug }))
  );
}

export { default, generateMetadata } from "../../../../(marketing)/cursos/[slug]/page";
