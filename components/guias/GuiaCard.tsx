import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { getPais } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import { nombreCurso } from "@/lib/guias/hub";
import { fechaActualizado } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";

/** Etiqueta del mercado de la guía. */
function mercado(guia: Guia): string {
  if (guia.country === "transversal") return "Latinoamérica";
  return getPais(guia.country).nombre;
}

/** Dos iniciales para el fallback de los cursos sin portada. */
function iniciales(texto: string): string {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

/** Tarjeta de guía: imagen del curso, curso + país, título y fecha. */
export default function GuiaCard({ guia }: { guia: Guia }) {
  const curso = getCourseBySlug(guia.course);
  const nombre = nombreCurso(guia.course);

  return (
    <Link
      href={guia.path}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-wash">
        {curso?.imageUrl ? (
          <CourseImage
            src={curso.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-ink">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.16),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-canvas/80">{iniciales(nombre)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
          {nombre} · {mercado(guia)}
        </p>
        <p className="mt-1.5 text-base font-bold leading-snug tracking-tight text-ink">{guia.h1}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{guia.description}</p>
        <p className="mt-auto pt-3 text-xs text-faint">Actualizado el {fechaActualizado(guia.updated)}</p>
      </div>
    </Link>
  );
}
