import Link from "next/link";
import { ArrowRight, Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { rutaPerfil, type MiembroEquipo } from "@/lib/data/equipo";
import { inicialesDe } from "./iniciales";

/** Tarjeta del índice /profesores. Solo muestra los datos que existen. */
export default function TarjetaProfesor({ miembro }: { miembro: MiembroEquipo }) {
  const perfil = rutaPerfil(miembro.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-paper transition-colors hover:border-ink/20">
      <Link href={perfil} className="relative block aspect-[4/3] bg-wash no-underline" tabIndex={-1}>
        {miembro.imageUrl ? (
          <CourseImage
            src={miembro.imageUrl}
            alt={miembro.nombre}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className="object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center font-display text-4xl font-black text-faint"
            aria-hidden="true"
          >
            {inicialesDe(miembro.nombre)}
          </span>
        )}
        {miembro.esFundador ? (
          <span className="absolute left-4 top-4 rounded-full border border-line bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
            Fundador
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          {miembro.rol}
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
          <Link href={perfil} className="text-ink no-underline hover:underline">
            {miembro.nombre}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-mute">{miembro.cargo}</p>

        {miembro.bio ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-mute">{miembro.bio}</p>
        ) : miembro.credenciales.length > 0 ? (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-mute">
            {miembro.credenciales[0]}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <Link
            href={perfil}
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink no-underline hover:underline"
          >
            Ver perfil
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {miembro.linkedinUrl ? (
            <a
              href={miembro.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn de ${miembro.nombre}`}
              className="text-faint transition-colors hover:text-ink"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
