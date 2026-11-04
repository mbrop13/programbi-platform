import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import type { TarjetaGuia } from "@/lib/guias/hub";

/** Dos iniciales para el fallback de los cursos sin portada. */
function iniciales(texto: string): string {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Tarjeta de guía: imagen del curso, curso + país, título, descripción y fecha.
 *
 * La portada va en un contenedor con aspect ratio fijo (`aspect-[16/10]`) y
 * `sizes` ajustado a la grilla real del hub, así que la imagen no mueve el
 * layout cuando carga (CLS). El título usa `text-pretty` y `break-words` para
 * que las palabras largas no se salgan de la tarjeta en mobile.
 */
export default function GuiaCard({ guia }: { guia: TarjetaGuia }) {
  return (
    <Link
      href={guia.path}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-wash">
        {guia.imageUrl ? (
          <CourseImage
            src={guia.imageUrl}
            alt={`Portada del curso ${guia.courseName}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) calc(50vw - 44px), 360px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-ink">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.16),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-canvas/80">
                {iniciales(guia.courseName)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint break-words">
          {guia.courseName} · {guia.countryName}
        </p>
        <h3 className="mt-1.5 text-pretty break-words text-base font-bold leading-snug tracking-tight text-ink">
          {guia.h1}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-mute">{guia.description}</p>
        <p className="mt-auto pt-3 text-xs text-faint">Actualizado el {guia.updatedLabel}</p>
      </div>
    </Link>
  );
}
