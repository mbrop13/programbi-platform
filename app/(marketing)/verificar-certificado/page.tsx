import type { Metadata } from "next";
import { EyeOff, FileSearch, ShieldCheck } from "lucide-react";

import FormularioVerificacion from "@/components/certificado/FormularioVerificacion";
import { absoluteUrl, DEFAULT_OG_IMAGE, twitterShare } from "@/lib/seo";

const PATH = "/verificar-certificado";
const TITLE = "Verificar certificado de ProgramBI";
const DESCRIPTION =
  "Verifica en línea un certificado de ProgramBI con su código de validación. Consulta el curso, el alumno y la fecha de emisión registrados.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    type: "website",
    locale: "es_CL",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterShare(TITLE, DESCRIPTION),
};

const AYUDAS = [
  {
    icon: FileSearch,
    titulo: "Dónde está el código",
    texto:
      "Aparece al pie del certificado, con el formato PBI-XXX-XXXXXX. También puedes pegar la URL completa del certificado.",
  },
  {
    icon: ShieldCheck,
    titulo: "Qué muestra la ficha",
    texto:
      "El nombre del alumno, el curso, la fecha de emisión y el código de validación registrados por ProgramBI.",
  },
  {
    icon: EyeOff,
    titulo: "Qué no publicamos",
    texto:
      "La ficha pública nunca muestra el correo ni otros datos de contacto del alumno, y no lista certificados de terceros.",
  },
];

export default function VerificarCertificadoPage() {
  return (
    <div className="bg-canvas text-ink">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600">
          Certificados ProgramBI
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Verifica un certificado
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute">
          Ingresa el código de validación que aparece al pie del certificado. Te mostraremos los
          datos registrados por ProgramBI para ese código: alumno, curso y fecha de emisión.
        </p>

        <FormularioVerificacion />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {AYUDAS.map(({ icon: Icono, titulo, texto }) => (
            <div key={titulo} className="rounded-2xl border border-line bg-paper p-5">
              <Icono className="h-5 w-5 text-ink" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-ink">{titulo}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-mute">{texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">¿El código no funciona?</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-mute">
            Revisa que no falten guiones ni caracteres. Si el problema continúa, escríbenos a{" "}
            <a
              href="mailto:contacto@programbi.cl"
              className="font-medium text-ink underline underline-offset-4"
            >
              contacto@programbi.cl
            </a>{" "}
            con el código y el nombre que aparece en el certificado.
          </p>
        </div>
      </section>
    </div>
  );
}
