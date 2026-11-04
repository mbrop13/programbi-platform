export const revalidate = 3600;

/**
 * La ficha por país reexporta la página de marketing para no duplicar la
 * lógica de precios, horarios y JSON-LD. El bloque «Guías de <curso>»
 * (components/guias/GuiasDelCurso) se monta una sola vez allí y también sale
 * en /<pais>/cursos/<slug>, priorizando la guía del país que trae la ruta.
 */
export { default, generateMetadata, generateStaticParams } from "../../../../(marketing)/cursos/[slug]/page";
