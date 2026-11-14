import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, MessageCircle, Users, Video } from "lucide-react";
import { getPais, normalizarPais } from "@/config/paises";
import { CLASE_GRATIS, CLASE_GRATIS_HABILITADA, claseGratisPublicada } from "@/config/flags";
import { metadataLocal } from "@/lib/paises/metadata";
import { rutaLocal } from "@/lib/paises/rutas";
import { whatsappHref } from "@/lib/whatsapp";
import FormularioClase from "@/components/clase-gratis/FormularioClase";

type Params = Promise<{ pais?: string }>;

const PATH = "/clase-gratis";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** YYYY-MM-DD → "23 de noviembre de 2026", sin pasar por zonas horarias. */
function fechaLarga(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  // Con el flag apagado la ruta responde 404: no hay metadata que publicar.
  if (!CLASE_GRATIS_HABILITADA) notFound();
  const pais = normalizarPais((await params).pais);
  const base = metadataLocal({
    pais,
    path: PATH,
    title: "Clase gratis de datos en vivo en Chile",
    description:
      "Clase gratis de ProgramBI: datos, Power BI y el camino a analista. Reserva tu cupo cuando se confirme la próxima fecha.",
  });

  // Mientras el flag esté apagado (o no haya fecha real) la página no se indexa:
  // no queremos que Google posicione una página sin fecha ni contenido propio.
  if (!claseGratisPublicada()) {
    return {
      ...base,
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  }
  return base;
}

export default async function ClaseGratisPage({ params }: { params: Params }) {
  // Mientras el flag esté apagado la página no existe para el público: 404
  // real, no un 200 con noindex. Se reevalúa en cada revalidación.
  if (!CLASE_GRATIS_HABILITADA) notFound();
  const iso = normalizarPais((await params).pais);
  const pais = getPais(iso);
  const href = (destino: string) => rutaLocal(iso, destino);
  const publicada = claseGratisPublicada();
  const fechaTexto = CLASE_GRATIS.fecha ? fechaLarga(CLASE_GRATIS.fecha) : null;
  const whatsapp = whatsappHref({
    page: PATH,
    intent: "fechas",
    course: "la clase gratis",
    country: iso,
  });

  return (
    <div className="min-h-screen bg-canvas px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-sm text-mute" aria-label="Migas">
          <Link href={href("/")} className="no-underline hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink">Clase gratis</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Clase gratis · {pais.nombre}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Clase gratis de datos en vivo en {pais.nombre}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mute">
          Una clase abierta para conocer cómo se trabaja con datos en Power BI, SQL y Python, y
          resolver tus dudas antes de inscribirte en un curso.
        </p>

        {publicada && fechaTexto ? (
          <section className="mt-8 rounded-[26px] border border-line bg-paper p-6">
            <h2 className="text-xl font-bold tracking-tight text-ink">Próxima clase</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-mute">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Fecha
                </dt>
                <dd className="mt-1 font-semibold text-ink">{fechaTexto}</dd>
              </div>
              {CLASE_GRATIS.hora ? (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-mute">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> Hora
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">{CLASE_GRATIS.hora}</dd>
                </div>
              ) : null}
              {CLASE_GRATIS.cupos != null ? (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-mute">
                    <Users className="h-3.5 w-3.5" aria-hidden /> Cupos
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">{CLASE_GRATIS.cupos}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-mute">
              <Video className="h-4 w-4" aria-hidden />
              En vivo por {CLASE_GRATIS.modalidad}
            </p>
            <div className="mt-6">
              <FormularioClase pais={iso} fechaTexto={fechaTexto} />
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-[26px] border border-line bg-paper p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Todavía no hay fecha confirmada
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Estamos cerrando la próxima fecha de la clase gratis. Cuando esté confirmada, vas a
              poder reservar tu cupo en esta misma página, sin costo y sin crear cuenta.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Si quieres que te avisemos o prefieres coordinar una fecha, escríbenos por WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Avisarme por WhatsApp
              </a>
              <Link
                href={href("/cursos")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline hover:bg-wash"
              >
                Ver los cursos
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-[26px] border border-line bg-paper p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-ink">Mientras esperas la fecha</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mute">
            <li>
              Revisa los cursos en vivo:{" "}
              <Link href={href("/cursos/power-bi")} className="font-semibold text-ink underline">
                Power BI
              </Link>
              ,{" "}
              <Link href={href("/cursos/sql-server")} className="font-semibold text-ink underline">
                SQL Server
              </Link>{" "}
              y{" "}
              <Link href={href("/cursos/python")} className="font-semibold text-ink underline">
                Python
              </Link>
              .
            </li>
            <li>
              Mide tu nivel con un{" "}
              <Link href={href("/test-nivel")} className="font-semibold text-ink underline">
                test de nivel gratis
              </Link>
              .
            </li>
            <li>
              Revisa precios, duración y medios de pago en{" "}
              <Link href={href("/precios")} className="font-semibold text-ink underline">
                /precios
              </Link>
              .
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
