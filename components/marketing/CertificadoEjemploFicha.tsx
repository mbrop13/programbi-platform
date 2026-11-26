import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";

/**
 * Vista previa ilustrativa del certificado de ProgramBI para fichas de curso.
 * Mantiene la estética de CertificadoPublico sin inventar alumnos ni testimonios.
 */
export default function CertificadoEjemploFicha({
  courseTitle,
}: {
  courseTitle: string;
}) {
  return (
    <section
      aria-label="Certificado verificable en línea"
      className="mt-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Certificado verificable
          </h2>
          <p className="mt-1.5 text-sm text-mute">
            Al completar el curso recibes un certificado digital con código único para validar en línea o sumar a LinkedIn.
          </p>
        </div>
        <Link
          href="/verificar-certificado"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
        >
          Verificar un certificado emitido
        </Link>
      </div>

      <article className="relative mt-6 overflow-hidden rounded-[22px] border border-line-strong bg-paper p-1.5 shadow-[0_24px_60px_-42px_rgba(23,23,22,0.35)]">
        <div className="relative rounded-[16px] border border-line px-5 py-6 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l border-t border-amber-500/30" />
          <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r border-t border-amber-500/30" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b border-l border-amber-500/30" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b border-r border-amber-500/30" />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Image
              src="/images/logo-nav.webp"
              alt="ProgramBI"
              width={299}
              height={77}
              className="h-6 w-auto"
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
              Ejemplo ilustrativo
            </span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600">
              Certificado de finalización
            </p>
            <p className="mt-3 text-xs text-mute">ProgramBI certifica que</p>
            <p className="mt-1 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Nombre y apellido del participante
            </p>
            <div className="mx-auto my-3.5 h-px w-36 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <p className="text-xs text-mute">completó satisfactoriamente el curso</p>
            <p className="mt-1 text-base font-semibold text-ink sm:text-lg">
              {courseTitle}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                Código:
              </span>
              <code className="rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-ink">
                PBI-EJEMPLO-2026
              </code>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <ShieldCheck className="h-3.5 w-3.5 text-mute" aria-hidden="true" />
              Verificable en línea
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
