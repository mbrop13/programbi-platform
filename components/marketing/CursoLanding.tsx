import Link from "next/link";
import { FileText } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import type { Course } from "@/lib/data/courses";
import {
  LANDING_CURSOS,
  seoLandingCurso,
  type LandingCursoCopy,
} from "@/lib/data/landing-cursos";
import type { LandingCursoContenido } from "@/lib/paises/landing-curso";
import { getPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { localizarMercado } from "@/lib/paises/precios";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { rutaLocal } from "@/lib/paises/rutas";

export default function CursoLanding({
  copy,
  course,
  contenido,
}: {
  copy: LandingCursoCopy;
  course: Course;
  contenido: LandingCursoContenido;
}) {
  const iso = contenido.iso;
  const L = (texto: string) => localizarMercado(texto, iso);
  const href = (destino: string) => rutaLocal(iso, destino);
  const otro =
    copy.path === "/curso-sql-online"
      ? LANDING_CURSOS["curso-python"]
      : LANDING_CURSOS["curso-sql-online"];
  const otroSeo = seoLandingCurso(otro, iso);
  // La FAQ de precio del mercado se arma en lib/paises/landing-curso con el
  // monto dentro del texto: se reescribe sin cifras y el arancel vive solo en
  // el brochure PDF.
  const mediosPago = getPais(iso).mediosPago;
  const faqs = contenido.faqs.map((faq) =>
    /cu[aá]nto cuesta/i.test(faq.q)
      ? {
          ...faq,
          a: `El arancel vigente se descarga en el brochure PDF del curso, junto con el detalle de las cuotas sin interés. Los medios de pago publicados para ${contenido.paisNombre} son: ${mediosPago.join("; ")}. El checkout confirma las opciones disponibles para la cohorte.`,
        }
      : faq
  );

  return (
    <article className="bg-canvas px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-mute" aria-label="Migas">
          <Link href={href("/")} className="no-underline hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2 text-faint">/</span>
          <Link href={href("/cursos")} className="no-underline hover:text-ink">
            Cursos
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink">{contenido.h1}</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          {contenido.kicker}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {contenido.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mute">{L(copy.lead)}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={courseBrochurePath(course.slug, iso)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
          >
            <FileText size={16} aria-hidden /> Descargar brochure PDF con precios →
          </Link>
          <Link
            href={href(`/cursos/${course.slug}`)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Ver ficha y fechas
          </Link>
          <WhatsAppCta
            page={href(copy.path)}
            intent="curso"
            course={course.title}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            WhatsApp
          </WhatsAppCta>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Arancel y cuotas
            </p>
            <Link
              href={courseBrochurePath(course.slug, iso)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-lg font-bold leading-snug tracking-tight text-ink no-underline hover:text-mute"
            >
              <FileText size={18} aria-hidden /> Ver precios y temario en el brochure PDF →
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              El brochure trae el arancel vigente en {contenido.paisNombre}, el descuento publicado y{" "}
              {textoCuotas(iso)}.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mute">{contenido.cohorteTexto}</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Horario local
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {contenido.horario.inicio} a {contenido.horario.fin}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Hora de {contenido.paisNombre} ({contenido.horario.offset}).{" "}
              {iso === "cl"
                ? ""
                : `En Chile: ${contenido.horario.inicioChile} a ${contenido.horario.finChile}.`}
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Para quién es</h2>
          <p className="mt-4 text-base leading-relaxed text-mute">{L(copy.audience)}</p>
          <p className="mt-4 text-base leading-relaxed text-mute">{L(copy.intro)}</p>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            {contenido.horas} horas por nivel
            {contenido.niveles.length > 0 ? ` · ${contenido.niveles.join(" y ")}` : ""}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Qué puedes hacer con el temario en {contenido.paisNombre}
          </h2>
          {contenido.usos.some((uso) => uso.sector) ? (
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Escenarios de trabajo por sector en {contenido.paisNombre}. No son casos de clientes
              ni cifras de resultados: son ejercicios para practicar con la lógica de cada
              industria.
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {contenido.usos.map((uso) => (
              <article key={uso.title} className="rounded-2xl border border-line bg-paper p-5">
                {uso.sector ? (
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                    {uso.sector}
                  </p>
                ) : null}
                <h3 className={`text-base font-semibold text-ink${uso.sector ? " mt-3" : ""}`}>
                  {L(uso.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{L(uso.body)}</p>
                {uso.fuente ? (
                  <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                    <span className="font-semibold text-mute">Datos de partida:</span>{" "}
                    {uso.fuente}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Temario del curso abierto</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            El nivel avanzado se detalla en la ficha del curso.
          </p>
          <div className="mt-6 space-y-4">
            {contenido.syllabus.map((section) => (
              <div key={section.name} className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="text-base font-semibold text-ink">{section.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{section.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Preguntas frecuentes</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-line bg-paper p-6">
          <h2 className="text-xl font-bold tracking-tight text-ink">Sigue con el otro curso</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            {L(otro.lead)}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href(otro.path)}
              className="inline-flex text-sm font-semibold text-ink no-underline"
            >
              {otroSeo.h1}
            </Link>
            <Link
              href={href(`/cursos/${course.slug}`)}
              className="inline-flex text-sm font-semibold text-ink no-underline"
            >
              Ficha de {course.title}
            </Link>
          </div>
        </section>

        <nav className="mt-14 border-t border-line pt-8" aria-label="Relacionados">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">Sigue leyendo</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={href("/cursos/analisis-de-datos")}
                className="text-sm font-semibold text-ink no-underline hover:text-mute"
              >
                Programa de análisis de datos (SQL + Power BI + Python)
              </Link>
            </li>
            <li>
              <Link
                href={href("/cursos")}
                className="text-sm font-semibold text-ink no-underline hover:text-mute"
              >
                Catálogo de cursos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </article>
  );
}
