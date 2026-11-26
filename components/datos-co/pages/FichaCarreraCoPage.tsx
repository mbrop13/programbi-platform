import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { GraficoRangosCo } from "@/components/datos-co/carreras/GraficoRangosCo";
import {
  getFichaPorSlugCo,
  getIesPorCarreraCo,
  getMetaCarrerasCo,
  medianaNivelCo,
  posicionEnNivelCo,
} from "@/lib/datos-co/carreras";
import { cursosAfinesCo } from "@/lib/datos-co/cursos-afines";
import {
  enteroCo,
  nombreIesCo,
  nombreProgramaCo,
  pesosCo,
  plural,
  porcentajeCo,
  smmlvCo,
} from "@/lib/datos-co/formato";
import {
  MIGAS_CARRERAS_CO,
  breadcrumbJsonLdCo,
  datasetJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
} from "@/lib/datos-co/seo";
import {
  faqsFichaCo,
  h1FichaCo,
  metaFichaCo,
  narrativaUnicaFichaCo,
  relacionadasFichaCo,
  tituloFichaCo,
} from "@/lib/datos-co/textos";
import type { NivelFormacionCo } from "@/lib/datos-co/types";

export async function metadataCoFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}): Promise<Metadata> {
  const { pais, slug } = await params;
  if (pais !== "co") notFound();

  const carrera = getFichaPorSlugCo(slug);
  if (!carrera) notFound();

  return metadataDatosCo({
    title: tituloFichaCo(carrera),
    description: metaFichaCo(carrera),
    path: `/co/datos/carreras/${carrera.slug}`,
    keywords: [
      `${nombreProgramaCo(carrera.programa)} salario colombia`,
      `cuanto gana ${nombreProgramaCo(carrera.programa)} colombia`,
      "datos ole colombia",
    ],
  });
}

function enlaceRankingPorNivel(nivel: string): { href: string; label: string } {
  if (nivel === "Tecnológico") {
    return {
      href: "/co/datos/carreras/tecnologicas-mejor-pagadas",
      label: "Ranking de carreras tecnológicas",
    };
  }
  if (nivel === "Formación técnica profesional") {
    return {
      href: "/co/datos/carreras/mejor-pagadas#ranking-tecnicas",
      label: "Ranking de técnicas profesionales",
    };
  }
  return {
    href: "/co/datos/carreras/mejor-pagadas#ranking-universitarias",
    label: "Ranking de carreras universitarias",
  };
}

/** Nombre del nivel en plural para frases como «la mediana de las carreras tecnológicas». */
function nivelEnFrase(nivel: NivelFormacionCo | string): string {
  if (nivel === "Tecnológico") return "las carreras tecnológicas";
  if (nivel === "Formación técnica profesional") return "las técnicas profesionales";
  if (nivel === "Universitario") return "las carreras universitarias";
  return `su nivel (${nivel})`;
}

const H2 = "text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem]";

/** Barra horizontal comparativa: siempre parte en cero para no exagerar diferencias. */
function BarraComparada({
  etiqueta,
  valor,
  max,
  destacada,
}: {
  etiqueta: string;
  valor: number;
  max: number;
  destacada?: boolean;
}) {
  const ancho = Math.max(2, Math.min(100, (valor / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={destacada ? "font-semibold text-ink" : "text-mute"}>{etiqueta}</span>
        <span className={`tabular-nums ${destacada ? "font-semibold text-ink" : "text-mute"}`}>
          {smmlvCo(valor)}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-wash" aria-hidden="true">
        <div
          className={`h-full rounded-full ${destacada ? "bg-[#0b63c5]" : "bg-[#0b63c5]/35"}`}
          style={{ width: `${ancho}%` }}
        />
      </div>
    </div>
  );
}

function Dato({
  valor,
  etiqueta,
  detalle,
}: {
  valor: string;
  etiqueta: string;
  detalle?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <dt className="text-sm text-mute">{etiqueta}</dt>
      <dd className="mt-2 text-2xl font-bold tracking-tight text-ink tabular-nums sm:text-[1.75rem]">
        {valor}
      </dd>
      {detalle ? <dd className="mt-1 text-sm text-mute tabular-nums">{detalle}</dd> : null}
    </div>
  );
}

export async function PageCoFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}) {
  const { pais, slug } = await params;
  if (pais !== "co") notFound();

  const carrera = getFichaPorSlugCo(slug);
  if (!carrera) notFound();

  const meta = getMetaCarrerasCo();
  const nombre = nombreProgramaCo(carrera.programa);
  const pos = posicionEnNivelCo(carrera.slug);
  const medNivel = medianaNivelCo(carrera.nivel_formacion);
  const narrativa = narrativaUnicaFichaCo(carrera);
  const faqs = faqsFichaCo(carrera);
  const iesLista = getIesPorCarreraCo(carrera.slug);
  const relacionadas = relacionadasFichaCo(carrera, 4);
  const cursos = cursosAfinesCo(carrera);
  const rankingLink = enlaceRankingPorNivel(carrera.nivel_formacion);
  const maxComparacion = Math.max(carrera.mediana_smmlv, medNivel.mediana_smmlv) * 1.1;
  const maxIes = Math.max(...iesLista.map((i) => i.mediana_smmlv), 0.01);
  const iesOrdenadas = [...iesLista].sort((a, b) => b.mediana_smmlv - a.mediana_smmlv);
  // Carreras como Administración tienen más de 100 instituciones: se muestran 10 y el resto se despliega.
  const IES_VISIBLES = 10;
  // Las fuentes vienen con raya y punto final; se presentan con dos puntos y sin punto doble.
  const limpiarFuente = (f: string) => f.replace(/\s—\s/g, ": ").replace(/\.$/, "");
  const fuenteOle = limpiarFuente(meta.fuente_ole);
  const fuenteSnies = limpiarFuente(meta.fuente_snies);

  const filaIes = (item: (typeof iesLista)[number]) => (
    <li
      key={item.ies}
      className={`grid gap-3 p-4 sm:items-center sm:gap-6 sm:px-6 ${
        iesLista.length > 1 ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_8rem]" : "sm:grid-cols-[minmax(0,1fr)_8rem]"
      }`}
    >
      <div className="min-w-0">
        <p className="font-semibold text-ink">{nombreIesCo(item.ies)}</p>
        <p className="mt-0.5 text-sm text-mute tabular-nums">
          {item.sector_ies} · {plural(item.graduados_cotizantes, "cotizante", "cotizantes")} ·{" "}
          {porcentajeCo(item.pct_4plus_smmlv)} con 4 SMMLV o más
        </p>
      </div>
      {/* Con una sola institución la barra no compara nada: se omite. */}
      {iesLista.length > 1 ? (
        <div className="h-2 overflow-hidden rounded-full bg-wash" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#0b63c5]"
            style={{ width: `${Math.max(3, (item.mediana_smmlv / maxIes) * 100)}%` }}
          />
        </div>
      ) : null}
      <p className="text-left font-semibold text-ink tabular-nums sm:text-right">
        {pesosCo(item.mediana_cop_2026)}
        <span className="block text-xs font-normal text-mute">{smmlvCo(item.mediana_smmlv)}</span>
      </p>
    </li>
  );

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: nombre, path: `/co/datos/carreras/${carrera.slug}` },
  ] as const;

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    datasetJsonLdCo({
      id: `dataset-carrera-${carrera.slug}`,
      name: `${nombre} en Colombia: salarios y graduados cotizantes (OLE)`,
      description: metaFichaCo(carrera),
      path: `/co/datos/carreras/${carrera.slug}`,
      isBasedOn: { name: meta.fuente_ole, url: meta.fuente_ole_url },
      variableMeasured: [
        "Mediana salarial interpolada (SMMLV y COP 2026)",
        "Porcentaje de graduados cotizantes con 4 SMMLV o más",
        "Distribución en 7 rangos SMMLV",
        "Graduados cotizantes en seguridad social",
      ],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
    }),
    faqJsonLdCo(faqs),
  ];

  return (
    <div className="bg-canvas">
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Encabezado: la pregunta y la respuesta, con su comparación */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 lg:pt-8 lg:pb-14">
          <MigasDatos migas={migas} />

          {/*
            Tres celdas: título, tarjeta de la mediana y texto. En móvil la tarjeta va justo
            después del título (la cifra es la respuesta); en escritorio queda a la derecha.
          */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-12 lg:gap-y-0">
            <div className="order-1 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-end">
              <p className="text-sm font-medium text-mute">
                {carrera.nivel_formacion} · {carrera.area_conocimiento}
              </p>
              <h1 className="mt-3 max-w-[24ch] text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.07] font-bold tracking-[-0.035em] text-balance text-ink">
                {h1FichaCo(carrera)}
              </h1>
            </div>
            <div className="order-3 min-w-0 lg:order-none lg:col-start-1 lg:row-start-2">
              <p className="max-w-[60ch] text-lg leading-relaxed text-pretty text-mute lg:mt-5">
                Sus graduados que cotizan en seguridad social ganan una mediana de{" "}
                <strong className="font-semibold text-ink">{pesosCo(carrera.mediana_cop_2026)}</strong> al mes,
                según el seguimiento {meta.anio_seguimiento} del Observatorio Laboral para la Educación (cohorte{" "}
                {meta.cohorte}, a valores del salario mínimo de 2026).
              </p>
              <nav aria-label="Más carreras" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <Link href="/co/datos/carreras" prefetch={false} className="text-[#0b63c5] underline-offset-4 hover:underline">
                  Todas las carreras
                </Link>
                <Link href={rankingLink.href} prefetch={false} className="text-[#0b63c5] underline-offset-4 hover:underline">
                  {rankingLink.label}
                </Link>
                <Link href="/co/datos/carreras/comparar" prefetch={false} className="text-[#0b63c5] underline-offset-4 hover:underline">
                  Comparar carreras
                </Link>
              </nav>
            </div>

            <section
              aria-label="Mediana salarial"
              className="order-2 rounded-3xl border border-line bg-canvas p-6 sm:p-7 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-end"
            >
              <p className="text-sm font-medium text-mute">Mediana mensual</p>
              <p className="mt-1 text-[clamp(2.5rem,6vw,3.25rem)] leading-none font-bold tracking-[-0.04em] text-ink tabular-nums">
                {pesosCo(carrera.mediana_cop_2026)}
              </p>
              <p className="mt-2 text-sm text-mute tabular-nums">
                {smmlvCo(carrera.mediana_smmlv)}
                {pos ? (
                  <>
                    {" · "}
                    <span className="font-semibold text-ink">
                      puesto {pos.posicion} de {pos.total}
                    </span>{" "}
                    en {carrera.nivel_formacion}
                  </>
                ) : null}
              </p>
              <div className="mt-6 space-y-4 border-t border-line pt-5">
                <BarraComparada etiqueta="Esta carrera" valor={carrera.mediana_smmlv} max={maxComparacion} destacada />
                <BarraComparada
                  etiqueta={`Mediana de ${nivelEnFrase(carrera.nivel_formacion).replace(/^las /, "")}`}
                  valor={medNivel.mediana_smmlv}
                  max={maxComparacion}
                />
              </div>
            </section>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:py-16">
        {/* Cifras de apoyo */}
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Dato
            etiqueta="Ganan 4 SMMLV o más"
            valor={porcentajeCo(carrera.pct_4plus_smmlv)}
            detalle={`${pesosCo(meta.smmlv_2026_cop * 4)} o más al mes`}
          />
          <Dato
            etiqueta="Ingreso promedio"
            valor={pesosCo(carrera.promedio_cop_2026)}
            detalle={smmlvCo(carrera.promedio_smmlv)}
          />
          <Dato
            etiqueta="Graduados que cotizan"
            valor={enteroCo(carrera.graduados_cotizantes)}
            detalle={`en ${plural(carrera.n_ies, "institución", "instituciones")}`}
          />
          {carrera.snies_2025 ? (
            <Dato
              etiqueta="Graduados en 2025"
              valor={enteroCo(carrera.snies_2025.graduados_2025)}
              detalle={`SNIES, ${plural(carrera.snies_2025.n_ies, "institución", "instituciones")}`}
            />
          ) : (
            <Dato etiqueta="Cohorte medida" valor={meta.cohorte} detalle={`Seguimiento ${meta.anio_seguimiento}`} />
          )}
        </dl>

        {/* Distribución */}
        <section aria-labelledby="distribucion-titulo" className="space-y-5">
          <div className="max-w-[62ch] space-y-2">
            <h2 id="distribucion-titulo" className={H2}>
              ¿Cuánto ganan sus graduados?
            </h2>
            <p className="text-base leading-relaxed text-mute">
              Cómo se reparten los graduados según su ingreso, medido en salarios mínimos (SMMLV). La mediana
              es el ingreso del graduado que queda justo al medio.
            </p>
          </div>
          <GraficoRangosCo
            rangos={carrera.rangos_smmlv}
            totalCotizantes={carrera.graduados_cotizantes}
            nombrePrograma={nombre}
            smmlvCop={meta.smmlv_2026_cop}
            medianaSmmlv={carrera.mediana_smmlv}
          />
        </section>

        {/* Lectura de los datos */}
        <section aria-labelledby="analisis-titulo" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
          <h2 id="analisis-titulo" className={H2}>
            Qué dicen los datos de {nombre}
          </h2>
          <div className="space-y-4 text-[17px] leading-[1.7] text-mute">
            {narrativa.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-sm text-faint">
              Fuente: {fuenteOle}. Montos convertidos con el SMMLV 2026 ({pesosCo(meta.smmlv_2026_cop)}).
            </p>
          </div>
        </section>

        {/* Oficial vs privado */}
        {carrera.sector_ies ? (
          <section aria-labelledby="sector-titulo" className="space-y-5">
            <div className="max-w-[62ch] space-y-2">
              <h2 id="sector-titulo" className={H2}>
                Instituciones oficiales y privadas
              </h2>
              <p className="text-base leading-relaxed text-mute">
                Mediana de sus graduados según dónde estudiaron (ambos grupos tienen al menos 30 cotizantes).
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { titulo: "Oficiales (públicas)", data: carrera.sector_ies.oficial },
                  { titulo: "Privadas", data: carrera.sector_ies.privado },
                ] as const
              ).map((sec) => (
                <div key={sec.titulo} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-mute">{sec.titulo}</h3>
                  <p className="mt-2 text-[1.75rem] font-bold tracking-tight text-ink tabular-nums">
                    {pesosCo(sec.data.mediana_cop_2026)}
                  </p>
                  <p className="mt-1 text-sm text-mute tabular-nums">
                    {smmlvCo(sec.data.mediana_smmlv)} · {porcentajeCo(sec.data.pct_4plus_smmlv)} gana 4 SMMLV o más
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-sm text-mute tabular-nums">
                    {plural(sec.data.graduados_cotizantes, "cotizante", "cotizantes")} en{" "}
                    {plural(sec.data.n_ies, "institución", "instituciones")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Por institución */}
        {iesLista.length > 0 ? (
          <section aria-labelledby="ies-titulo" className="space-y-5">
            <div className="max-w-[62ch] space-y-2">
              <h2 id="ies-titulo" className={H2}>
                Dónde se estudia y cuánto ganan sus graduados
              </h2>
              <p className="text-base leading-relaxed text-mute">
                {iesLista.length === 1
                  ? "La institución con 30 o más graduados cotizantes en el seguimiento del OLE."
                  : `Las ${iesLista.length} instituciones con 30 o más graduados cotizantes, ordenadas por mediana.`}
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-line bg-paper">
              <ul className="divide-y divide-line">{iesOrdenadas.slice(0, IES_VISIBLES).map(filaIes)}</ul>
              {iesOrdenadas.length > IES_VISIBLES ? (
                <details className="group border-t border-line">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-center px-4 text-sm font-semibold text-[#0b63c5] hover:bg-canvas [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">
                      Ver las otras {iesOrdenadas.length - IES_VISIBLES} instituciones
                    </span>
                    <span className="hidden group-open:inline">Ocultar las otras instituciones</span>
                  </summary>
                  <ul className="divide-y divide-line border-t border-line">
                    {iesOrdenadas.slice(IES_VISIBLES).map(filaIes)}
                  </ul>
                </details>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Relacionadas */}
        {relacionadas.length > 0 ? (
          <section aria-labelledby="relacionadas-titulo" className="space-y-5">
            <h2 id="relacionadas-titulo" className={H2}>
              Carreras parecidas en {carrera.nivel_formacion}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relacionadas.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/co/datos/carreras/${rel.slug}`}
                    prefetch={false}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/40"
                  >
                    <span className="text-[15px] leading-snug font-semibold text-ink group-hover:underline group-hover:underline-offset-4">
                      {nombreProgramaCo(rel.programa)}
                    </span>
                    <span className="mt-4 block border-t border-line pt-3">
                      <span className="block text-lg font-bold text-ink tabular-nums">
                        {pesosCo(rel.mediana_cop_2026)}
                      </span>
                      <span className="text-sm text-mute tabular-nums">
                        {porcentajeCo(rel.pct_4plus_smmlv)} gana 4 SMMLV o más
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <CtaDatosCo
          pagina={`/co/datos/carreras/${carrera.slug}`}
          cursos={cursos}
          carreraNombre={nombre}
          ctaPosition="ficha_co"
        />

        <FaqDatos faqs={faqs} />

        <footer className="border-t border-line pt-6 text-sm leading-relaxed text-mute">
          <p>
            Fuentes:{" "}
            <a href={meta.fuente_ole_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">
              {fuenteOle}
            </a>{" "}
            y{" "}
            <a href={meta.fuente_snies_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">
              {fuenteSnies}
            </a>
            . Son cifras referenciales de graduados que cotizan en seguridad social; no son una oferta de sueldo.{" "}
            <Link href="/co/datos/carreras/metodologia" prefetch={false} className="font-semibold text-ink underline underline-offset-4">
              Ver metodología
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
