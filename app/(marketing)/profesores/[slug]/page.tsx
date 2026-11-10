import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PerfilProfesor from "@/components/equipo/PerfilProfesor";
import {
  EQUIPO,
  getMiembroPorSlug,
  perfilIndexable,
  rutaPerfil,
  type MiembroEquipo,
} from "@/lib/data/equipo";
import {
  getOrganizacionEquipoJsonLd,
  getPersonaJsonLd,
  getProfilePageJsonLd,
} from "@/lib/seo/course-jsonld";
import { ROBOTS_NOINDEX_FOLLOW } from "@/lib/seo/metadata-base";
import { SITE_URL, absoluteUrl, jsonLdString, pageOg, tituloSeo } from "@/lib/seo";

export const dynamicParams = false;

const DESCRIPCION_ORG =
  "Institución líder de formación profesional y consultoría de Business Intelligence en Chile y Latinoamérica.";

/** Descripción factual: rol y dos credenciales. Sin inventar trayectoria. */
function descripcionPerfil(miembro: MiembroEquipo): string {
  return `${miembro.nombre}, ${miembro.rol}. ${miembro.credenciales.slice(0, 2).join(" ")}`;
}

export function generateStaticParams() {
  return EQUIPO.map((miembro) => ({ slug: miembro.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const miembro = getMiembroPorSlug(slug);
  if (!miembro) return { title: "Profesor no encontrado" };

  const title = tituloSeo(`${miembro.nombre} — Profesor`);
  const description = descripcionPerfil(miembro);
  const canonical = absoluteUrl(rutaPerfil(miembro.slug));
  const share = pageOg({
    title,
    description,
    path: `profesores/${miembro.slug}`,
    kicker: "Equipo docente",
    tags: [miembro.rol, miembro.cargo],
  });

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    // Publicación por miembro: solo las fichas con datos base quedan fuera del
    // noindex. La bio larga no es requisito.
    ...(perfilIndexable(miembro) ? {} : { robots: ROBOTS_NOINDEX_FOLLOW }),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "profile",
      siteName: "ProgramBI",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

export default async function ProfesorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const miembro = getMiembroPorSlug(slug);
  if (!miembro) notFound();

  const canonical = absoluteUrl(rutaPerfil(miembro.slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getProfilePageJsonLd(miembro),
      getPersonaJsonLd(miembro),
      getOrganizacionEquipoJsonLd(DESCRIPCION_ORG),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Profesores",
            item: absoluteUrl("/profesores"),
          },
          { "@type": "ListItem", position: 3, name: miembro.nombre, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-canvas pb-20 pt-10 text-ink sm:pt-14">
        <PerfilProfesor miembro={miembro} />
      </div>
    </>
  );
}
