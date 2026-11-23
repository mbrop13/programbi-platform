import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowRight } from "lucide-react";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { TarjetaInstitucion } from "@/components/datos/TarjetaInstitucion";
import { getMetaCarreras } from "@/lib/datos/carreras";
import { anosDesdeSemestres, entero, pesos, porcentaje } from "@/lib/datos/formato";
import { getFotoInstitucion } from "@/lib/datos/instituciones-fotos";
import {
  getInstitucionesConPagina,
  getPaginaInstitucion,
  getTarjetasInstituciones,
  nombreInstitucion,
  type CarreraEnInstitucion,
} from "@/lib/datos/instituciones-paginas";
import { ajustarTitulo, breadcrumbsSchema, MIGAS_BASE } from "@/lib/datos/seo-carreras";
import { jsonLdString, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

const TIPO_LARGO = { u: "Universidad", ip: "Instituto profesional", cft: "Centro de formación técnica" };

export function generateStaticParams() {
  return getInstitucionesConPagina()
    .filter((i) => getPaginaInstitucion(i.slug))
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pagina = getPaginaInstitucion(slug);
  if (!pagina) notFound();
  const nombre = nombreInstitucion(pagina.visual);
  const foto = getFotoInstitucion(pagina.key);
  const path = `/datos/carreras/instituciones/${slug}`;
  const tituloCompleto = `${nombre}: carreras, aranceles y sedes 2026`;
  const tituloCorto = `${pagina.visual.nombreCorto}: carreras, aranceles y sedes 2026`;
  const titulo =
    tituloCompleto.length <= 60
      ? tituloCompleto
      : tituloCorto.length <= 60
        ? tituloCorto
        : ajustarTitulo(tituloCorto, false);
  const descripcion = `${pagina.carreras.length} carreras y ${entero(pagina.programas)} programas de ${nombre} en 2026: aranceles, jornadas, sedes y acreditación según el SIES (Mineduc).`;
  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: { canonical: `${SITE_URL}${path}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_CL",
      url: `${SITE_URL}${path}`,
      title: titulo,
      description: descripcion,
      images: foto ? [{ url: `${SITE_URL}${foto.src}`, width: 1200, height: 750, alt: foto.alt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

function rangoArancel(c: CarreraEnInstitucion): string {
  if (c.arancelMin === null || c.arancelMax === null) return "Sin dato";
  if (c.arancelMin === c.arancelMax) return pesos(c.arancelMin);
  return `${pesos(c.arancelMin)} a ${pesos(c.arancelMax)}`;
}

export default async function InstitucionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pagina = getPaginaInstitucion(slug);
  if (!pagina) notFound();

  const meta = getMetaCarreras();
  const nombre = nombreInstitucion(pagina.visual);
  const foto = getFotoInstitucion(pagina.key);
  const path = `/datos/carreras/instituciones/${slug}`;
  const migas = [
    ...MIGAS_BASE,
    { label: "Instituciones", path: "/datos/carreras/instituciones" },
    { label: pagina.visual.nombreCorto, path },
  ];

  const porArea = new Map<string, CarreraEnInstitucion[]>();
  for (const c of pagina.carreras) {
    const lista = porArea.get(c.area) ?? [];
    lista.push(c);
    porArea.set(c.area, lista);
  }
  const areas = [...porArea.entries()].sort((a, b) => b[1].length - a[1].length);
  const idArea = (area: string) =>
    `area-${area
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")}`;

  const masPagadas = pagina.carreras
    .filter((c) => c.nacional?.ing4)
    .sort((a, b) => (b.nacional?.ing4 ?? 0) - (a.nacional?.ing4 ?? 0))
    .slice(0, 3);

  const otras = getTarjetasInstituciones()
    .filter((t) => t.tipo === pagina.visual.tipo && t.key !== pagina.key && t.slug)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbsSchema(migas),
      {
        "@type": pagina.tipo === "u" ? "CollegeOrUniversity" : "EducationalOrganization",
        name: nombre,
        url: `${SITE_URL}${path}`,
        ...(foto ? { image: `${SITE_URL}${foto.src}` } : {}),
        address: { "@type": "PostalAddress", addressCountry: "CL" },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 lg:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <MigasDatos migas={migas} />

      {/* Portada: foto del campus + ficha rápida */}
      <header className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <figure className="m-0 min-w-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-wash">
            {foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={foto.src}
                alt={foto.alt}
                width={1200}
                height={750}
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: pagina.visual.color }}
                aria-hidden="true"
              >
                <span className="font-display text-7xl font-extrabold text-white">
                  {pagina.visual.sigla.replace(/^(IP|CFT) /, "")}
                </span>
              </div>
            )}
            {pagina.acreditacion ? (
              <span className="sticker absolute top-4 left-4 bg-resalte text-base text-foreground">
                {pagina.acreditacion} años de acreditación
              </span>
            ) : null}
          </div>
          {foto ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              Foto:{" "}
              <a href={foto.fuenteUrl} className="underline underline-offset-2 hover:text-foreground">
                {foto.autor}
              </a>{" "}
              ({foto.licencia}) vía Wikimedia Commons.
            </figcaption>
          ) : null}
        </figure>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-700">
            {TIPO_LARGO[pagina.tipo]}
            {pagina.visual.ciudad ? ` · Casa central en ${pagina.visual.ciudad}` : ""}
          </p>
          <h1 className="h1-datos mt-2 text-foreground">{nombre}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-carreras p-4 text-white">
              <dt className="text-sm font-medium">Programas 2026</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">
                {entero(pagina.programas)}
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-sm font-medium text-muted-foreground">Carreras distintas</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">
                {pagina.carreras.length}
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-sm font-medium text-muted-foreground">Arancel anual mediano</dt>
              <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                {pagina.arancelMediano ? pesos(pagina.arancelMediano) : "Sin dato"}
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-sm font-medium text-muted-foreground">
                {pagina.regiones.length === 1 ? "Región con sede" : "Regiones con sede"}
              </dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">
                {pagina.regiones.length}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {pagina.regiones.join(" · ")}
          </p>
        </div>
      </header>

      {/* Carreras mejor pagadas que imparte (indicador nacional de la carrera) */}
      {masPagadas.length > 0 ? (
        <section aria-labelledby="inst-destacadas" className="mt-14">
          <h2 id="inst-destacadas" className="h2-datos text-foreground">
            Sus carreras con <span className="marcador">mejores sueldos</span>
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Sueldo bruto mensual promedio al 4.º año de la carrera en todo Chile. El Mineduc no
            publica sueldos por institución, así que es una referencia de la carrera, no de{" "}
            {pagina.visual.nombreCorto}.
          </p>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {masPagadas.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`/datos/carreras/${c.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-foreground"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-lg leading-tight font-bold group-hover:underline group-hover:underline-offset-4">
                      {c.nombre}
                    </span>
                    <span aria-hidden="true" className="font-display text-2xl font-extrabold text-blue-200">
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-display text-3xl font-extrabold tabular-nums">
                      {pesos(c.nacional?.ing4 ?? null)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {c.nacional?.emp1 !== null && c.nacional?.emp1 !== undefined
                        ? `${porcentaje(c.nacional.emp1)} con empleo al 1.er año`
                        : "al 4.º año de titulación"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Todas las carreras, agrupadas por área */}
      <section aria-labelledby="inst-carreras" className="mt-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="inst-carreras" className="h2-datos text-foreground">
            Todas sus carreras ({pagina.carreras.length})
          </h2>
          <nav aria-label="Ir a un área" className="flex flex-wrap gap-2">
            {areas.map(([area, lista]) => (
              <a
                key={area}
                href={`#${idArea(area)}`}
                className="group inline-flex min-h-10 items-center rounded-full border border-line-strong bg-white px-3.5 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white"
              >
                {area} <span className="ml-1.5 text-muted-foreground group-hover:text-white">{lista.length}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 space-y-8">
          {areas.map(([area, lista]) => (
            <div key={area} id={idArea(area)} className="scroll-mt-24">
              <h3 className="font-display text-xl font-bold text-foreground">{area}</h3>
              <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
                {lista.map((c) => (
                  <li key={c.slug} className="border-b border-line last:border-b-0">
                    <Link
                      href={`/datos/carreras/${c.slug}`}
                      className="group grid gap-x-6 gap-y-1 px-5 py-4 transition-colors hover:bg-slate-50 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-center"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground group-hover:underline group-hover:underline-offset-4">
                          {c.nombre}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {c.jornadas.join(" · ")}
                          {c.programas > 1 ? ` · ${c.programas} programas` : ""}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {c.durFormal ? `Duración formal ${anosDesdeSemestres(c.durFormal)}` : "Duración sin dato"}
                        {c.paesProm ? ` · PAES prom. ${entero(c.paesProm)}` : ""}
                      </span>
                      <span className="text-sm">
                        <span className="text-muted-foreground">Arancel anual </span>
                        <span className="font-semibold text-foreground tabular-nums">{rangoArancel(c)}</span>
                      </span>
                      <ArrowRight
                        className="hidden size-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-foreground md:block"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {otras.length > 0 ? (
        <section aria-labelledby="inst-otras" className="mt-16">
          <h2 id="inst-otras" className="h2-datos text-foreground">
            Otras instituciones para comparar
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otras.map((t) => (
              <li key={t.key}>
                <TarjetaInstitucion inst={t} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-14">
        <FuenteLinea
          fuente={`Fuente: Buscador de Carreras del SIES (Mineduc), oferta 2026, edición ${meta.edicion}. Sueldos y empleabilidad: Estadísticas por Carrera de mifuturo.cl, promedio nacional de cada carrera.`}
          conAviso={false}
        />
      </div>
    </div>
  );
}
