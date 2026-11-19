import Link from "next/link";
import { Activity, CalendarDays, ChartNoAxesCombined, ChevronRight, CircleHelp, Database, Download, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { datosTerritorio, METADATOS, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, personas, puntos, tasa } from "@/lib/datos/formato";
import { buscarRegion, NACIONAL, REGIONES, RUTA_DESEMPLEO, rutaTerritorio } from "@/lib/datos/regiones";
import { breadcrumbs, dataset, faqSchema, metaObservatorio, MIGAS_DATOS } from "@/lib/datos/seo";
import { diferencia, lecturaRegional, movimiento, otrasTasas, resumenTerritorio } from "@/lib/datos/textos";
import { DatosEstructurados, Descargas, Fuente, Metodologia, Migas, MiniSerie, Preguntas, preguntasObservatorio, TablaHistorica } from "./ElementosDatos";
import { VistaDatos } from "./AccionesDatos";
import { ExploradorDesempleo } from "./ExploradorDesempleo";
import { MapaRanking, type FilaMapa } from "./MapaRanking";
import estilos from "./Observatorio.module.css";

const migasNacional = [...MIGAS_DATOS, { label: "Desempleo", path: RUTA_DESEMPLEO }];

export function Observatorio({ slug }: { slug: string }) {
  const region = buscarRegion(slug);
  const datos = datosTerritorio(slug);
  const chile = datosTerritorio(NACIONAL);
  if (!datos || !chile) notFound();
  const { serie, actual, indicadores, haceUnAno } = datos;
  const nombre = region?.nombre ?? "Chile";
  const trimestre = periodo(actual.p);
  const posicion = RANKING.findIndex((item) => item.slug === slug) + 1;
  const migas = region ? [...migasNacional, { label: nombre, path: rutaTerritorio(slug) }] : migasNacional;
  const resumen = resumenTerritorio(nombre, actual, indicadores, posicion, RANKING.length, region ? chile.actual : undefined);
  const preguntas = preguntasObservatorio(nombre, actual);
  const descripcion = metaObservatorio(slug, nombre).description ?? resumen[0];
  const nota = actual.notas.tasa ?? actual.notas.des;
  const comparable = indicadores.anterior_mismo_trimestre;
  const brecha = indicadores.vs_chile_pp ?? (actual.tasa - chile.actual.tasa);
  const cercanas = otrasTasas(indicadores, RANKING);
  const ordenRegional = REGIONES.findIndex((item) => item.slug === slug);
  const vecinas = [REGIONES[ordenRegional - 1], REGIONES[ordenRegional + 1]].filter(Boolean);
  const pares = [slug, ...cercanas.map((item) => item.slug)].join(",");
  const altas = RANKING.filter((item) => (item.yoy_pp ?? 0) > 0).length;
  const mayor = RANKING[0];
  const menor = RANKING.at(-1);
  const filasMapa: FilaMapa[] = REGIONES.flatMap(({ slug, nombre }) => {
    const datosRegion = datosTerritorio(slug);
    if (!datosRegion) return [];
    const { actual, indicadores } = datosRegion;
    return [{ slug, nombre, tasa: actual.tasa, yoy: indicadores.yoy_pp, nota: actual.notas.tasa ?? actual.notas.des }];
  });
  const itemList = {
    "@type": "ItemList",
    name: `Ranking de desocupación por región, ${trimestre}`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: RANKING.map((item, indice) => ({
      "@type": "ListItem", position: indice + 1, name: item.nombre, url: `${SITE_URL}${rutaTerritorio(item.slug)}`,
    })),
  };

  const cambios = [
    indicadores.yoy_pp !== null && `En ${nombre}, la tasa ${movimiento(indicadores.yoy_pp, "en doce meses")}.`,
    indicadores.anterior_pp !== null && `La tasa de ${nombre} ${movimiento(indicadores.anterior_pp, "frente al trimestre móvil anterior")}. Ambos períodos comparten dos meses.`,
    region
      ? `La región registró ${tasa(actual.tasa)} frente a ${tasa(chile.actual.tasa)} en Chile. Su tasa se ubicó ${diferencia(brecha)}.`
      : mayor && menor && `${mayor.nombre} registró la tasa regional más alta (${tasa(mayor.tasa)}). ${menor.nombre} tuvo la menor (${tasa(menor.tasa)}).`,
    region
      ? `Para esta misma ventana de meses, ${nombre} ocupa el puesto ${indicadores.rank_mismo_trimestre} de mayor a menor en su serie histórica.`
      : `En ${altas} de las ${RANKING.length} regiones, la tasa subió frente al mismo trimestre del año anterior.`,
  ].filter((texto): texto is string => typeof texto === "string");

  return (
    <article className={estilos.contenedor}>
      <DatosEstructurados nodos={[breadcrumbs(migas), dataset(slug, nombre, descripcion, serie), faqSchema(preguntas), ...(region ? [] : [itemList])]} />
      <VistaDatos territorio={slug} periodo={actual.p} />
      <Migas elementos={migas} />
      <header className={estilos.encabezado}>
        <p className={estilos.sello}><span><Activity size={15} aria-hidden="true" /></span> Observatorio del mercado laboral</p>
        <h1>Desempleo en {nombre}</h1>
        <p>{region ? `Tasa regional, comparación con Chile y evolución desde 2010.` : "Tasa de desocupación, evolución histórica y panorama de las 16 regiones de Chile."}</p>
      </header>
      <div className={estilos.heroes}>
        <section className={estilos.heroPrincipal} aria-label="Tasa de desocupación actual">
          <div className={estilos.heroIndicador}>
            <p className={estilos.periodo}><CalendarDays size={16} aria-hidden="true" /> {trimestre}</p>
            <p className={estilos.valorHero} data-tasa-hero={actual.tasa}>{cifra(actual.tasa)}<span> %</span>{nota && <sup aria-label={`Nota ${nota} de calidad`}>{nota}</sup>}</p>
            <p className={estilos.etiquetaHero}>Tasa de desocupación</p>
            <p className={estilos.recuento}>{personas(actual.des)} personas desocupadas{actual.notas.des && <sup aria-label={`Nota ${actual.notas.des} de calidad`}>{actual.notas.des}</sup>}</p>
          </div>
          <MiniSerie serie={serie} />
          <div className={estilos.heroFuente}><Fuente edicion /></div>
        </section>
        <section className={estilos.heroComparacion} aria-labelledby="comparacion-anual">
          <h2 id="comparacion-anual"><ChartNoAxesCombined size={19} aria-hidden="true" /> Variación en doce meses</h2>
          {haceUnAno && indicadores.yoy_pp !== null && <>
            <p className={estilos.valorDelta} data-yoy-hero={indicadores.yoy_pp}>{puntos(indicadores.yoy_pp)}</p>
            <dl className={estilos.parPeriodos}>
              <div><dt>{periodo(haceUnAno.p)}</dt><dd>{tasa(haceUnAno.tasa)}</dd></div>
              <div><dt>{trimestre}</dt><dd>{tasa(actual.tasa)}</dd></div>
            </dl>
            <p>{comparable
              ? `Último registro igual o mayor para estos meses: ${tasa(comparable.tasa)} en ${periodo(comparable.p)}.`
              : "Tasa más alta de la serie para este mismo trimestre móvil."}</p>
          </>}
          <div className={estilos.comparacionPie}>
            {indicadores.anterior_pp !== null && <span><strong>{puntos(indicadores.anterior_pp)}</strong> vs. trimestre anterior</span>}
            {region && <span><strong>{puntos(brecha)}</strong> vs. Chile · Puesto {posicion} de {RANKING.length}</span>}
          </div>
        </section>
      </div>

      <nav className={estilos.indice} aria-label="En esta página">
        <a href={region ? "#lectura-regional" : "#regiones"}><MapPin size={16} aria-hidden="true" /> {region ? "Panorama regional" : "Mapa y ranking"}</a>
        <a href="#historico"><ChartNoAxesCombined size={16} aria-hidden="true" /> Histórico y comparadores</a>
        <a href="#descargas"><Download size={16} aria-hidden="true" /> Descargas</a>
        <a href="#metodologia"><CircleHelp size={16} aria-hidden="true" /> Metodología</a>
      </nav>

      <div className={estilos.lecturaCorta}>
        <section className={estilos.resumen} aria-labelledby="titulo-resumen">
          <h2 id="titulo-resumen">En resumen</h2>
          {resumen.map((texto) => <p key={texto}>{texto}</p>)}
        </section>
        <section className={estilos.cambios} aria-labelledby="titulo-cambios">
          <h2 id="titulo-cambios">Qué cambió este mes</h2>
          <ul>{cambios.map((texto) => <li key={texto}>{texto}</li>)}</ul>
          <p className={estilos.secundario}>El INE advierte que las variaciones pequeñas pueden no ser estadísticamente significativas.</p>
        </section>
      </div>

      {region ? (
        <section id="lectura-regional" className={estilos.seccion} aria-labelledby="titulo-lectura">
          <h2 id="titulo-lectura">Cómo leer el desempleo en {nombre}</h2>
          <div className={estilos.lecturaRegional} data-lectura-regional>
            {lecturaRegional(nombre, actual, indicadores, serie, chile.actual, RANKING).map((texto) => <p key={texto}>{texto}</p>)}
          </div>
          <div className={estilos.regionesRelacionadas}>
            <div>
              <h3>Regiones vecinas en el mapa</h3>
              {vecinas.map((item) => <Link key={item.slug} href={rutaTerritorio(item.slug)}>Desempleo en {item.nombre}</Link>)}
            </div>
            <div>
              <h3>Tasas regionales más cercanas</h3>
              {cercanas.map((item) => <Link key={item.slug} href={rutaTerritorio(item.slug)}>{item.nombre} · {tasa(item.tasa)}</Link>)}
            </div>
            <div>
              <h3>Panorama nacional</h3>
              <Link href={RUTA_DESEMPLEO}>Desempleo en Chile</Link>
              <Link href={`${RUTA_DESEMPLEO}?comparar=${pares}#comparar-regiones`}>Comparar {nombre} con Chile y otras regiones</Link>
            </div>
          </div>
        </section>
      ) : (
        <section id="regiones" className={estilos.bloque} aria-labelledby="titulo-regiones">
          <div className={estilos.tituloSeccion}><h2 id="titulo-regiones">Desempleo por región</h2><p>Compara la tasa del trimestre {trimestre} y su variación anual. Selecciona una región para explorar su serie.</p></div>
          <MapaRanking filas={filasMapa} tasaChile={actual.tasa} periodo={trimestre} />
        </section>
      )}

      <section id="historico" className={estilos.bloque} aria-labelledby="titulo-historico">
        <div className={estilos.tituloSeccion}><h2 id="titulo-historico">Histórico y comparadores</h2><p>Tasas de desocupación por trimestre móvil. Usa la serie desde 2010 para explorar cambios por año, región o período.</p></div>
        <ExploradorDesempleo territorio={slug} nombre={nombre} version={METADATOS.version}>
          <TablaHistorica serie={serie} nombre={nombre} nacional={region ? chile.serie : undefined} />
        </ExploradorDesempleo>
        <Fuente />
      </section>

      <Descargas slug={slug} nombre={nombre} />
      <Metodologia nombre={nombre} slug={slug} actual={actual} />
      <Preguntas preguntas={preguntas} />
      <aside className={estilos.masDatos} aria-labelledby="titulo-mas-datos">
        <h2 id="titulo-mas-datos"><Database size={19} aria-hidden="true" /> Datos y guías de ProgramBI</h2>
        <Link href="/datos">Datos de Chile <ChevronRight aria-hidden="true" size={16} /></Link>
        <Link href="/sueldos-analista-datos-chile">Sueldos de analistas de datos en Chile <ChevronRight aria-hidden="true" size={16} /></Link>
        <Link href="/guias/sueldo-analista-de-datos-latinoamerica">Guía de sueldos de analistas en Latinoamérica <ChevronRight aria-hidden="true" size={16} /></Link>
      </aside>
    </article>
  );
}
