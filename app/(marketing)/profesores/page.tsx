import type { Metadata } from "next";
import Link from "next/link";
import TarjetaProfesor from "@/components/equipo/TarjetaProfesor";
import { EQUIPO_INDEXABLE } from "@/lib/data/equipo";
import {
  getEquipoCollectionJsonLd,
  getOrganizacionEquipoJsonLd,
  getPersonaJsonLd,
} from "@/lib/seo/course-jsonld";
import { SITE_URL, absoluteUrl, jsonLdString, pageOg, tituloSeo } from "@/lib/seo";

const TITULO = "Profesores y equipo docente";
const DESCRIPCION =
  "El equipo docente de ProgramBI: los profesionales que dictan los cursos en vivo de Power BI, SQL, Python y análisis de datos, con su formación y credenciales.";
const TITLE_FINAL = tituloSeo(TITULO);
const CANONICAL = absoluteUrl("/profesores");
const DESCRIPCION_ORG =
  "Institución líder de formación profesional y consultoría de Business Intelligence en Chile y Latinoamérica.";

const share = pageOg({
  title: TITLE_FINAL,
  description: DESCRIPCION,
  path: "/profesores",
  kicker: "Equipo docente",
  tags: ["Power BI", "SQL", "Python", "Análisis de datos"],
});

export const metadata: Metadata = {
  title: { absolute: TITLE_FINAL },
  description: DESCRIPCION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE_FINAL,
    description: DESCRIPCION,
    url: CANONICAL,
    type: "website",
    siteName: "ProgramBI",
    images: share.images,
  },
  twitter: share.twitter,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    getOrganizacionEquipoJsonLd(DESCRIPCION_ORG),
    ...EQUIPO_INDEXABLE.map(getPersonaJsonLd),
    ...getEquipoCollectionJsonLd(EQUIPO_INDEXABLE, CANONICAL, TITLE_FINAL, DESCRIPCION),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Profesores", item: CANONICAL },
      ],
    },
  ],
};

export default function ProfesoresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-canvas pb-20 pt-12 text-ink sm:pt-16">
        <section className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            Equipo docente
          </p>
          <h1 className="mt-3 max-w-[20ch] text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl">
            Quiénes dictan las clases
          </h1>
          <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">
            Los profesionales que dictan los cursos en vivo de ProgramBI, con su formación y los
            cursos de los que están a cargo.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPO_INDEXABLE.map((miembro) => (
              <TarjetaProfesor key={miembro.slug} miembro={miembro} />
            ))}
          </div>

          <p className="mt-10 text-sm text-mute">
            ¿Buscas un curso?{" "}
            <Link href="/cursos" className="font-semibold text-ink no-underline hover:underline">
              Ver el catálogo completo
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
