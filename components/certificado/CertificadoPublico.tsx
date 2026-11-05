import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Linkedin, ShieldCheck } from "lucide-react";

import BotonImprimir from "./BotonImprimir";
import type { CertificadoVerificado } from "@/lib/certificados/consulta";
import { formatearFechaEmision } from "@/lib/certificados/fecha";
import { urlCertificadoLinkedIn } from "@/lib/certificados/linkedin";

/**
 * Ficha pública del certificado. Es un Server Component: los datos llegan ya
 * consultados con service_role y aquí solo se renderizan las cuatro columnas
 * públicas. No recibe ni muestra el email del alumno.
 */
export default function CertificadoPublico({
  certificado,
}: {
  certificado: CertificadoVerificado;
}) {
  const fecha = formatearFechaEmision(certificado.issued_at);
  const linkedIn = urlCertificadoLinkedIn({
    curso: certificado.course_title,
    codigo: certificado.certificate_code,
    emitidoEn: certificado.issued_at,
  });

  return (
    <main className="min-h-dvh bg-canvas px-4 py-10 text-ink sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm print:hidden">
          <Link
            href="/verificar-certificado"
            className="font-medium text-ink no-underline underline-offset-4 hover:underline"
          >
            ← Verificar otro certificado
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-mute">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verificado en programbi.com
          </span>
        </div>

        <article
          aria-labelledby="titulo-certificado"
          className="print-diploma relative overflow-hidden rounded-[26px] border border-line-strong bg-paper p-2 shadow-[0_30px_80px_-48px_rgba(23,23,22,0.45)]"
        >
          <div className="relative rounded-[20px] border border-line px-5 py-10 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 rounded-tl-xl border-l border-t border-amber-500/30" />
            <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-tr-xl border-r border-t border-amber-500/30" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 rounded-bl-xl border-b border-l border-amber-500/30" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 rounded-br-xl border-b border-r border-amber-500/30" />

            <header className="flex flex-col items-center text-center">
              <Image
                src="/images/logo-nav.webp"
                alt="ProgramBI"
                width={299}
                height={77}
                priority
                className="h-8 w-auto"
              />
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600">
                Certificado de finalización
              </p>
              <h1
                id="titulo-certificado"
                className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Certificado verificado
              </h1>
              <p className="mt-8 text-sm text-mute">ProgramBI certifica que</p>
              <p className="mt-2 max-w-3xl break-words font-dancing text-4xl leading-tight text-ink sm:text-6xl">
                {certificado.student_name}
              </p>
              <div className="my-7 h-px w-44 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <p className="text-sm text-mute">completó satisfactoriamente el curso</p>
              <p className="mt-2 max-w-2xl text-xl font-semibold leading-snug text-ink sm:text-2xl">
                {certificado.course_title}
              </p>
            </header>

            <dl className="mt-10 grid gap-6 border-t border-line pt-8 text-center sm:grid-cols-3 sm:text-left">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Fecha de emisión
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">
                  {fecha ?? "Sin fecha registrada"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Código de validación
                </dt>
                <dd className="mt-1.5">
                  <code className="inline-block rounded-md border border-line bg-canvas px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-ink">
                    {certificado.certificate_code}
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Emisor
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">ProgramBI · Chile</dd>
              </div>
            </dl>

            <footer className="mt-10 flex flex-col items-center gap-2 border-t border-line pt-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2 text-xs font-medium text-ink">
                <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Código registrado en la base de certificados de ProgramBI
              </span>
              <p className="max-w-xl text-[11px] leading-relaxed text-mute">
                Esta ficha muestra solo el nombre del alumno, el curso, la fecha de emisión y el
                código de validación. No publica el correo ni otros datos de contacto.
              </p>
            </footer>
          </div>
        </article>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#004182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]/40 sm:w-auto"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            Agregar a LinkedIn
          </a>
          <BotonImprimir />
          <Link
            href="/verificar-certificado"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-line-strong bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash sm:w-auto"
          >
            Verificar otro código
          </Link>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-mute print:hidden">
          ¿El código no corresponde a la persona que lo presenta?{" "}
          <a
            href="mailto:contacto@programbi.cl"
            className="font-medium text-ink underline underline-offset-4"
          >
            Escríbenos
          </a>
          .
        </p>
      </div>
    </main>
  );
}
