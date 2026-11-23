import type { Metadata } from "next";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TarjetaInstitucion } from "@/components/datos/TarjetaInstitucion";
import { getMetaCarreras } from "@/lib/datos/carreras";
import { getTarjetasInstituciones } from "@/lib/datos/instituciones-paginas";
import { breadcrumbsSchema, MIGAS_BASE } from "@/lib/datos/seo-carreras";
import { jsonLdString, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const PATH = "/datos/carreras/instituciones";
const TITULO = "Universidades, institutos y CFT en Chile: carreras y aranceles 2026";
const DESCRIPCION =
  "Fichas de las principales universidades, institutos profesionales y CFT de Chile: carreras que imparten, sedes, aranceles y acreditación según el SIES.";

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ProgramBI",
    locale: "es_CL",
    url: `${SITE_URL}${PATH}`,
    title: TITULO,
    description: DESCRIPCION,
  },
};

const GRUPOS = [
  { tipo: "U", titulo: "Universidades" },
  { tipo: "IP", titulo: "Institutos profesionales" },
  { tipo: "CFT", titulo: "Centros de formación técnica" },
] as const;

export default function InstitucionesPage() {
  const meta = getMetaCarreras();
  const tarjetas = getTarjetasInstituciones();
  const migas = [...MIGAS_BASE, { label: "Instituciones", path: PATH }];

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 lg:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString({ "@context": "https://schema.org", ...breadcrumbsSchema(migas) }) }}
      />
      <MigasDatos migas={migas} />

      <header className="mt-6 max-w-3xl">
        <h1 className="h1-datos text-foreground">
          Dónde estudiar: <span className="marcador">las instituciones</span> por dentro
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Qué carreras imparte cada institución, en qué regiones, cuánto cuesta el arancel y cuántos
          años de acreditación tiene. Elige una para ver su oferta completa 2026.
        </p>
      </header>

      <nav aria-label="Ir a un tipo de institución" className="mt-6 flex flex-wrap gap-2">
        {GRUPOS.map((g) => (
          <a
            key={g.tipo}
            href={`#tipo-${g.tipo.toLowerCase()}`}
            className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white px-4 text-[15px] font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white"
          >
            {g.titulo}
          </a>
        ))}
      </nav>

      {GRUPOS.map((g) => {
        const lista = tarjetas.filter((t) => t.tipo === g.tipo);
        if (lista.length === 0) return null;
        return (
          <section
            key={g.tipo}
            id={`tipo-${g.tipo.toLowerCase()}`}
            aria-labelledby={`titulo-${g.tipo}`}
            className="mt-14 scroll-mt-24"
          >
            <h2 id={`titulo-${g.tipo}`} className="h2-datos text-foreground">
              {g.titulo}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {lista.map((t) => (
                <li key={t.key}>
                  <TarjetaInstitucion inst={t} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="mt-14">
        <FuenteLinea
          fuente={`Fuente: Buscador de Carreras del SIES (Mineduc), oferta 2026, edición ${meta.edicion}. Fotos de campus vía Wikimedia Commons con licencia libre; el crédito está en la ficha de cada institución.`}
          conAviso={false}
        />
      </div>
    </div>
  );
}
