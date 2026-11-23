import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { DatosEstructurados, Fuente } from "@/components/datos/ElementosDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, puntos } from "@/lib/datos/desempleo-formato";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { entero, mesCorto, mesLargo, pesos, porcentaje, variacionPorcentual } from "@/lib/datos/formato";
import { getFotoInstitucion } from "@/lib/datos/instituciones-fotos";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";
import { NACIONAL, RUTA_DESEMPLEO } from "@/lib/datos/regiones";
import { breadcrumbs, dataset, metaObservatorio, MIGAS_DATOS } from "@/lib/datos/seo";
import { resumenTerritorio } from "@/lib/datos/textos";

export const dynamic = "force-static";
const baseMeta = metaObservatorio(NACIONAL, "Chile", true);
const nacionalMeta = datosTerritorio(NACIONAL);
const descripcion = nacionalMeta
  ? `Desempleo en Chile: ${cifra(nacionalMeta.actual.tasa)} % en ${periodo(nacionalMeta.actual.p)}, según el INE. Explora carreras, capacitación e IPC con datos oficiales, compara y descarga las series.`
  : "Explora datos oficiales de Chile sobre desempleo, carreras, capacitación e inflación.";
const titulo = "Datos de Chile: empleo, carreras e inflación";
export const metadata = {
  ...baseMeta,
  title: { absolute: titulo },
  description: descripcion,
  openGraph: { ...baseMeta.openGraph, title: titulo, description: descripcion },
  twitter: { ...baseMeta.twitter, title: titulo, description: descripcion },
};

const PREGUNTAS = [
  { href: "/datos/carreras/medicina", texto: "¿Cuánto gana un médico en Chile?" },
  { href: "/datos/inflacion", texto: "¿Mi sueldo le ganó a la inflación?" },
  { href: `${RUTA_DESEMPLEO}#regiones`, texto: "¿Cómo está el empleo en mi región?" },
  { href: "/datos/carreras/test", texto: "¿Qué carrera calza conmigo?" },
  { href: "/datos/carreras/mejor-sueldo-por-arancel", texto: "¿Qué carrera rinde más por lo que cuesta?" },
] as const;

const HERRAMIENTAS = [
  {
    href: "/datos/carreras/comparar",
    tema: "Carreras",
    titulo: "Comparar carreras",
    desc: "Hasta 3 carreras lado a lado: sueldo, empleabilidad y arancel.",
  },
  {
    href: "/datos/carreras/test",
    tema: "Carreras",
    titulo: "Test por prioridades",
    desc: "5 preguntas sobre tus intereses y presupuesto, y un ranking a tu medida.",
  },
  {
    href: "/datos/carreras/retorno",
    tema: "Carreras",
    titulo: "Calculadora de retorno",
    desc: "Cuánto cuesta estudiar y a cuántos sueldos equivale.",
  },
  {
    href: "/datos/carreras/puntaje-ponderado",
    tema: "Carreras",
    titulo: "Puntaje ponderado PAES",
    desc: "Simula tu ponderación con las ponderaciones oficiales.",
  },
  {
    href: `${RUTA_DESEMPLEO}#regiones`,
    tema: "Empleo",
    titulo: "Mapa del desempleo por región",
    desc: "Ubica tu región y compárala con el resto del país.",
  },
  {
    href: `${RUTA_DESEMPLEO}/jovenes`,
    tema: "Empleo",
    titulo: "Empleo juvenil",
    desc: "Cómo les va a quienes tienen entre 15 y 29 años.",
  },
  {
    href: "/datos/capacitacion",
    tema: "Empleo",
    titulo: "Capacitación SENCE",
    desc: "Participaciones en cursos con franquicia tributaria, por región.",
  },
  {
    href: "/datos/carreras/tecnologia-y-datos",
    tema: "Carreras",
    titulo: "Tecnología y datos",
    desc: "Ranking de informática, redes y estadística.",
  },
] as const;

const TEMA_CLASE: Record<(typeof HERRAMIENTAS)[number]["tema"], string> = {
  Carreras: "bg-carreras-suave text-blue-800",
  Empleo: "bg-empleo-suave text-empleo",
};

/** Línea simple de la serie de desempleo para la portada esmeralda (sin JS en el cliente). */
function SparkDesempleo({ tasas }: { tasas: readonly number[] }) {
  const ancho = 320;
  const alto = 96;
  const max = Math.max(...tasas);
  const min = Math.min(...tasas);
  const rango = max - min || 1;
  const pts = tasas.map((t, i) => {
    const x = 6 + (i * (ancho - 12)) / Math.max(tasas.length - 1, 1);
    const y = alto - 10 - ((t - min) / rango) * (alto - 28);
    return [x, y] as const;
  });
  const ultimo = pts.at(-1)!;
  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      width={ancho}
      height={alto}
      className="h-auto w-full max-w-[320px]"
      aria-hidden="true"
    >
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx={ultimo[0]} cy={ultimo[1]} r="6.5" fill="#ffd84d" stroke="#0e7a55" strokeWidth="2" />
    </svg>
  );
}

export default function DatosPage() {
  const nacional = datosTerritorio(NACIONAL);
  if (!nacional) notFound();
  const { actual, serie, indicadores } = nacional;
  const resumen = resumenTerritorio("Chile", actual, indicadores, 0, RANKING.length);
  const carrerasMeta = getMetaCarreras();
  const medicina = getRankingCarreras().find(
    (item) => item.slug === "medicina" && item.tipo === "u"
  );
  const ipcSerie = getIpcSeries();
  const ultimoIpc = getUltimoIpc();
  const [ultY, ultM] = ultimoIpc.m.split("-");
  const mesHace12 = `${Number(ultY) - 1}-${ultM}`;
  const var12 = variacionIpc(mesHace12, ultimoIpc.m, ipcSerie);
  const equivalente = var12 !== null ? Math.round(1_000_000 * (1 + var12)) : null;
  const foto = getFotoInstitucion("UNIVERSIDAD DE CHILE");
  const tasasRecientes = serie.slice(-24).map((o) => o.tasa);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-6 pb-4 sm:px-6 lg:pt-8">
      <DatosEstructurados
        nodos={[breadcrumbs(MIGAS_DATOS), dataset(NACIONAL, "Chile", descripcion, serie)]}
      />

      <MigasDatos migas={MIGAS_DATOS} />

      {/* Portada: el titular y las preguntas con que llega la gente */}
      <header className="mt-6 max-w-4xl sm:mt-10">
        <h1 className="h1-datos text-foreground">
          Datos de Chile, <span className="marcador">explicados en simple</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Sueldos de carreras, inflación, desempleo y capacitación con cifras oficiales del INE,
          Mineduc y SENCE. Gratis y sin registro.
        </p>
      </header>

      <nav aria-label="Preguntas frecuentes de la gente" className="mt-7">
        <p className="text-sm font-semibold text-foreground">Empieza por una pregunta</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PREGUNTAS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white px-4 text-[15px] font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white active:bg-black"
              >
                {p.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Observatorio 1: Carreras. Foto real de campus + cifra de ejemplo */}
      <section
        aria-labelledby="hub-carreras"
        className="mt-12 grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:mt-16 lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative aspect-[16/10] min-h-[220px] bg-wash lg:aspect-auto">
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
          ) : null}
          <span className="sticker absolute top-4 left-4 bg-carreras text-[15px] text-white">
            {carrerasMeta.conteos.genericas_unicas} carreras
          </span>
          <span className="sticker absolute bottom-4 left-5 rotate-[2deg] bg-resalte text-[15px] text-foreground">
            {entero(carrerasMeta.conteos.filas_C)} programas 2026
          </span>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-9">
          <div>
            <p className="text-sm font-semibold text-blue-700">Carreras y sueldos</p>
            <h2 id="hub-carreras" className="h2-datos mt-2 text-foreground">
              ¿Cuánto ganan, qué tan rápido encuentran pega y cuánto cuesta estudiar?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Universidades, institutos profesionales y CFT con datos de mifuturo.cl (Mineduc),
              edición {carrerasMeta.edicion}.
            </p>
          </div>

          {medicina && medicina.ing4 !== null ? (
            <Link
              href="/datos/carreras/medicina"
              className="group block rounded-2xl bg-carreras-suave p-5 transition-colors hover:bg-blue-100"
            >
              <span className="text-sm font-medium text-blue-800">
                Ejemplo: Medicina en universidades, al 4.º año
              </span>
              <span className="mt-1 block font-display text-4xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-5xl">
                {pesos(medicina.ing4)}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                bruto mensual promedio · {porcentaje(medicina.emp1)} con empleo al 1.er año
              </span>
            </Link>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Link
              href="/datos/carreras"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-foreground px-5 text-[15px] font-semibold text-white transition-colors hover:bg-slate-700 active:bg-black"
            >
              Ver el ranking de carreras
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/datos/carreras/comparar"
              className="inline-flex min-h-12 items-center rounded-xl border border-line-strong px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-wash active:bg-slate-200"
            >
              Comparar carreras
            </Link>
          </div>

          {foto ? (
            <p className="text-xs text-muted-foreground">
              Foto: {foto.alt}. Autor:{" "}
              <a href={foto.fuenteUrl} className="underline underline-offset-2 hover:text-foreground">
                {foto.autor}
              </a>{" "}
              ({foto.licencia}) vía Wikimedia Commons.
            </p>
          ) : null}
        </div>
      </section>

      {/* Observatorios 2 y 3: dos portadas de color con la cifra como protagonista */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section
          aria-labelledby="hub-ipc"
          className="flex flex-col justify-between gap-8 rounded-[1.75rem] bg-ipc p-6 text-foreground sm:p-9"
        >
          <div>
            <p className="text-sm font-semibold">Inflación (IPC) · INE, {mesLargo(ultimoIpc.m)}</p>
            <h2 id="hub-ipc" className="sr-only">
              Calculadora de inflación
            </h2>
            <p className="mt-4 font-display text-[clamp(3.5rem,9vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.05em] tabular-nums">
              {var12 !== null ? variacionPorcentual(var12) : "s/d"}
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug font-medium">
              subieron los precios en los últimos 12 meses.
            </p>
          </div>

          {equivalente !== null ? (
            <p className="max-w-md rounded-2xl bg-white/85 p-4 text-[15px] leading-relaxed">
              Lo que en {mesCorto(mesHace12)} costaba <strong>$1.000.000</strong>, hoy cuesta{" "}
              <strong className="marcador tabular-nums">{pesos(equivalente)}</strong>.
            </p>
          ) : null}

          <Link
            href="/datos/inflacion"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-foreground px-5 text-[15px] font-semibold text-white transition-colors hover:bg-slate-700 active:bg-black"
          >
            Actualizar un monto por IPC
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <section
          aria-labelledby="hub-desempleo"
          className="flex flex-col justify-between gap-8 rounded-[1.75rem] bg-empleo p-6 text-white sm:p-9"
        >
          <div>
            <p className="text-sm font-semibold text-white">
              Desempleo · INE, {periodo(actual.p)}
            </p>
            <h2 id="hub-desempleo" className="sr-only">
              Observatorio de Desempleo en Chile
            </h2>
            <p
              className="mt-4 font-display text-[clamp(3.5rem,9vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.05em] tabular-nums"
              data-tasa-hero={actual.tasa}
            >
              {cifra(actual.tasa)}
              <span className="text-[0.55em]"> %</span>
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug font-medium">
              de la fuerza de trabajo está buscando empleo.
              {indicadores.yoy_pp !== null ? (
                <span data-yoy-hero={indicadores.yoy_pp} className="block text-white">
                  {puntos(indicadores.yoy_pp)} respecto de hace un año.
                </span>
              ) : null}
            </p>
          </div>

          <figure className="m-0">
            <SparkDesempleo tasas={tasasRecientes} />
            <figcaption className="mt-1 text-sm text-white">
              Últimos 24 trimestres móviles
            </figcaption>
          </figure>

          <div className="flex flex-wrap gap-2">
            <Link
              href={RUTA_DESEMPLEO}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-resalte active:bg-[#f5c400]"
            >
              Ver desempleo por región
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={`${RUTA_DESEMPLEO}/jovenes`}
              className="inline-flex min-h-12 items-center rounded-xl border border-white/50 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15 active:bg-white/25"
            >
              Empleo juvenil
            </Link>
          </div>
        </section>
      </div>

      {/* Herramientas como índice de revista, no como grilla de tarjetas */}
      <section aria-labelledby="hub-herramientas" className="mt-16 lg:mt-24">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
          <div>
            <h2 id="hub-herramientas" className="h2-datos text-foreground">
              Herramientas para decidir
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Calculadoras, comparadores y mapas. Todas funcionan en el navegador, sin crear cuenta.
            </p>
          </div>

          <ol className="grid border-t border-line-strong sm:grid-cols-2 sm:gap-x-8">
            {HERRAMIENTAS.map((tool) => (
              <li key={tool.href} className="border-b border-line">
                <Link
                  href={tool.href}
                  className="group flex min-h-[88px] items-start justify-between gap-4 py-4 transition-colors"
                >
                  <span className="min-w-0">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${TEMA_CLASE[tool.tema]}`}
                    >
                      {tool.tema}
                    </span>
                    <span className="mt-1.5 block font-display text-lg font-bold text-foreground group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                      {tool.titulo}
                    </span>
                    <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">
                      {tool.desc}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-7 size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lectura editorial del panorama laboral */}
      <section
        aria-labelledby="hub-resumen"
        className="mt-16 rounded-[1.75rem] border border-line bg-white p-6 sm:p-10 lg:mt-24"
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
          <h2 id="hub-resumen" className="h2-datos text-foreground">
            El mercado laboral, en resumen
          </h2>
          <div className="prose-datos space-y-3 text-[17px] leading-relaxed text-slate-700">
            {resumen.map((texto) => (
              <p key={texto}>{texto}</p>
            ))}
            <div className="pt-2 text-sm text-muted-foreground">
              <Fuente edicion />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
