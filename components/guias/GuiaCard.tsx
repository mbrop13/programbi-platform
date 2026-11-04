import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { getPais } from "@/config/paises";
import { fichaCurso } from "@/lib/guias/curso";
import { fechaActualizado } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";

/** Etiqueta del mercado de la guía. */
function mercado(guia: Guia): string {
  if (guia.country === "transversal") return "Latinoamérica";
  return getPais(guia.country).nombre;
}

/** Tarjeta de guía: imagen del curso, curso + país, título y fecha. */
export default function GuiaCard({ guia }: { guia: Guia }) {
  const ficha = fichaCurso(guia.course);
  return (
    <Link
      href={guia.path}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/25"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-wash">
        <CourseImage
          src={ficha.imagen}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
          {ficha.nombre} · {mercado(guia)}
        </p>
        <p className="mt-1.5 text-base font-bold leading-snug tracking-tight text-ink">{guia.h1}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{guia.description}</p>
        <p className="mt-auto pt-3 text-xs text-faint">Actualizado el {fechaActualizado(guia.updated)}</p>
      </div>
    </Link>
  );
}
