/* eslint-disable @next/next/no-html-link-for-pages -- Enlaces estáticos para que el observatorio pueda navegar antes de cargar React. */
import { DatosEstructurados, Migas } from "@/components/datos/ElementosDatos";
import { FuenteDesgloses, NotaDesglose } from "@/components/datos/DesglosesDesempleo";
import { VistaDatos } from "@/components/datos/AccionesDatos";
import { EDAD, JOVENES_NINI, DURACION, datosJovenes, fechaIsoDesglose, type PuntoDesglose } from "@/lib/datos/desempleo-desgloses";
import { cifra, periodo, personas, tasa } from "@/lib/datos/desempleo-formato";
import { breadcrumbs, MIGAS_DATOS } from "@/lib/datos/seo";
import { SITE_URL, ORG_ID } from "@/lib/seo";
import styles from "./ObservatorioJovenes.module.css";

type Datos = NonNullable<ReturnType<typeof datosJovenes>>;
const path = "/datos/desempleo/jovenes";
const migas = [...MIGAS_DATOS, { label: "Desempleo", path: "/datos/desempleo" }, { label: "Jóvenes", path }];
const nota = (fila: PuntoDesglose | undefined, campo: string) => fila?.notas[campo];
const valor = (fila: PuntoDesglose | undefined, campo: string, formato: (n: number) => string) => {
  const dato = fila?.valores[campo];
  return dato === undefined ? "Sin datos" : formato(dato);
};

export function ObservatorioJovenes({ datos }: { datos: Datos }) {
  const { actual, tasas, nini, duracion } = datos;
  const ultimoNini = nini.at(-1), ultimaDuracion = duracion.at(-1);
  const grupos = [["15-24", "15 a 24 años"], ["15-19", "15 a 19 años"], ["20-24", "20 a 24 años"]] as const;
  const porPeriodoNini = new Map(nini.map((fila) => [fila.p, fila]));
  const porPeriodoDuracion = new Map(duracion.map((fila) => [fila.p, fila]));
  const ultimos = tasas.slice(-36);
  const valores = ultimos.flatMap((fila) => fila.valores.tasa === undefined ? [] : [fila.valores.tasa]);
  const min = Math.min(...valores), max = Math.max(...valores), rango = max - min || 1;
  const puntos = valores.map((n, i) => `${i / Math.max(valores.length - 1, 1) * 300},${48 - (n - min) / rango * 40}`).join(" ");
  const descripcion = `Tasa de desocupación, ocupación, jóvenes que no estudian ni están ocupados y duración de búsqueda en Chile.`;
  const dataset = {
    "@type": "Dataset", name: "Mercado laboral juvenil en Chile", description: descripcion, url: `${SITE_URL}${path}`,
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: [EDAD.fuente.url, JOVENES_NINI.fuente.url, DURACION.fuente.url], license: EDAD.fuente.licencia,
    dateModified: fechaIsoDesglose(EDAD.fuente.fecha_actualizacion), temporalCoverage: `${tasas[0].p}/${actual.p}`,
    spatialCoverage: { "@type": "Country", name: "Chile" }, variableMeasured: ["Tasa de desocupación", "Tasa de ocupación", "Jóvenes que no estudian ni están ocupados", "Duración de la búsqueda"],
    distribution: [
      { "@type": "DataDownload", name: "Jóvenes que no estudian ni están ocupados en CSV", encodingFormat: "text/csv", contentUrl: `${SITE_URL}/datos/desempleo/csv/jovenes.csv` },
      ...["edad", "nini", "duracion"].map((archivo) => ({ "@type": "DataDownload", name: `${archivo} en JSON`, encodingFormat: "application/json", contentUrl: `${SITE_URL}/datos/desempleo/${archivo}.json` })),
    ],
  };
  return <article className={styles.page}>
    <DatosEstructurados nodos={[breadcrumbs(migas), dataset]} /><VistaDatos territorio="jovenes" periodo={actual.p} /><Migas elementos={migas} />
    <header className={styles.header}><p className={styles.kicker}>Datos de Chile · Encuesta Nacional de Empleo</p><h1>Desempleo juvenil en Chile</h1><p>Una mirada al mercado laboral de jóvenes de 15 a 24 años, con cifras nacionales del INE.</p></header>
    <section className={styles.hero} aria-labelledby="cifra-jovenes"><div><p className={styles.label}>{periodo(actual.p)}</p><h2 id="cifra-jovenes">Tasa de desocupación juvenil</h2><p className={styles.big}>{tasa(datos.tasa)} <NotaDesglose nota={nota(actual, "tasa") ?? nota(actual, "des")} /></p><p>Entre las personas jóvenes que participan en la fuerza de trabajo.</p><FuenteDesgloses fuente={EDAD.fuente} periodoCodigo={actual.p} /></div><div className={styles.trend}><p>Últimos trimestres móviles</p><svg viewBox="0 0 300 56" role="img" aria-label="Evolución reciente de la tasa de desocupación juvenil" preserveAspectRatio="none"><polyline points={puntos} fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg><a href="#historico">Ver tabla histórica</a></div></section>
    <section className={styles.summary}><h2>En resumen</h2><ul><li>Según el INE, la tasa de desocupación de jóvenes de 15 a 24 años en Chile fue {tasa(datos.tasa)} en {periodo(actual.p)}.</li>{actual.valores.tasa_ocup !== undefined && <li>En {periodo(actual.p)}, la tasa de ocupación de jóvenes de 15 a 24 años en Chile fue {tasa(actual.valores.tasa_ocup)}, según el INE.</li>}{ultimoNini?.valores.total !== undefined && <li>Según el INE, en {periodo(ultimoNini.p)} había {personas(ultimoNini.valores.total)} jóvenes de 15 a 24 años que no estudiaban ni estaban ocupados en Chile.</li>}{ultimaDuracion?.valores.promedio_meses !== undefined && <li>En {periodo(ultimaDuracion.p)}, el tiempo promedio de búsqueda de las personas jóvenes desocupadas en Chile fue {cifra(ultimaDuracion.valores.promedio_meses)} meses, según el INE.</li>}</ul></section>
    <div className={styles.grid}><section className={styles.card}><h2>Ocupación juvenil</h2><p className={styles.metric}>{valor(actual, "tasa_ocup", tasa)} <NotaDesglose nota={nota(actual, "tasa_ocup")} /></p><p>Porcentaje de todas las personas de 15 a 24 años que están ocupadas. Su denominador es distinto al de la tasa de desocupación.</p><FuenteDesgloses fuente={EDAD.fuente} periodoCodigo={actual.p} /></section>
    {ultimaDuracion && <section className={styles.card}><h2>Duración de la búsqueda</h2><p className={styles.metric}>{valor(ultimaDuracion, "promedio_meses", cifra)} meses <NotaDesglose nota={nota(ultimaDuracion, "promedio_meses")} /></p><p>Tiempo promedio de búsqueda entre jóvenes desocupados. La proporción con búsqueda de larga duración es {valor(ultimaDuracion, "proporcion_larga", tasa)} <NotaDesglose nota={nota(ultimaDuracion, "proporcion_larga")} /> de las personas desocupadas; no es una tasa sobre la fuerza de trabajo.</p><FuenteDesgloses fuente={DURACION.fuente} periodoCodigo={ultimaDuracion.p} /></section>}</div>
    {ultimoNini && <section className={styles.card}><h2>Jóvenes que no estudian ni están ocupados</h2><p>Personas de 15 a 24 años, por edad y sexo. Esta categoría incluye personas fuera de la fuerza de trabajo y no equivale al desempleo.</p><div className={styles.scroll} role="region" aria-label="Jóvenes que no estudian ni están ocupados por edad y sexo" tabIndex={0}><table><caption>Personas estimadas, por tramo de edad y sexo</caption><thead><tr><th scope="col">Edad</th><th scope="col">Período</th><th scope="col">Total</th><th scope="col">Mujeres</th><th scope="col">Hombres</th></tr></thead><tbody>{grupos.map(([clave, nombre]) => { const fila = JOVENES_NINI.series[clave]?.at(-1); return <tr key={clave}><th scope="row">{nombre}</th><td>{fila ? periodo(fila.p) : "Sin datos"}</td>{(["total", "mujeres", "hombres"] as const).map((campo) => <td key={campo}>{valor(fila, campo, personas)} <NotaDesglose nota={nota(fila, campo)} /></td>)}</tr>; })}</tbody></table></div><FuenteDesgloses fuente={JOVENES_NINI.fuente} /></section>}
    <section className={styles.card} id="historico"><h2>Histórico y cobertura</h2><p>Las series pueden comenzar en períodos distintos. «Sin datos» indica que no hay una observación disponible para ese período; no significa cero.</p><details><summary>Ver tabla histórica de jóvenes</summary><div className={styles.scroll} role="region" aria-label="Tabla histórica de empleo juvenil" tabIndex={0}><table><caption>Indicadores nacionales de jóvenes de 15 a 24 años por trimestre móvil</caption><thead><tr><th scope="col">Período</th><th scope="col">Desocupación</th><th scope="col">Ocupación</th><th scope="col">No estudian ni ocupados</th><th scope="col">Búsqueda promedio</th></tr></thead><tbody>{[...tasas].reverse().map((fila) => { const n = porPeriodoNini.get(fila.p), d = porPeriodoDuracion.get(fila.p); return <tr key={fila.p}><th scope="row">{periodo(fila.p)}</th><td>{valor(fila, "tasa", tasa)} <NotaDesglose nota={nota(fila, "tasa") ?? nota(fila, "des")} /></td><td>{valor(fila, "tasa_ocup", tasa)} <NotaDesglose nota={nota(fila, "tasa_ocup")} /></td><td>{valor(n, "total", personas)} <NotaDesglose nota={nota(n, "total")} /></td><td>{d?.valores.promedio_meses === undefined ? "Sin datos" : `${cifra(d.valores.promedio_meses)} meses`} <NotaDesglose nota={nota(d, "promedio_meses")} /></td></tr>; })}</tbody></table></div></details></section>
    <section className={styles.card}><h2>Descargas y metodología</h2><p>El INE mide la desocupación entre quienes no tienen trabajo, están disponibles y buscan empleo. Un trimestre móvil reúne tres meses y se actualiza mensualmente. Las marcas a y b indican estimaciones poco fiables y no fiables, respectivamente. Las variaciones pequeñas pueden no ser estadísticamente significativas.</p><p>ProgramBI transformó los datos del INE; el INE no respalda esta visualización. Datos derivados bajo <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</p><ul className={styles.links}><li><a href="/datos/desempleo/csv/jovenes.csv" download>Descargar CSV de jóvenes que no estudian ni están ocupados</a></li>{["edad", "nini", "duracion"].map((nombre) => <li key={nombre}><a href={`/datos/desempleo/${nombre}.json`} download>Descargar JSON: {nombre}</a></li>)}</ul><p>Conoce el <a href="/datos/desempleo">observatorio nacional de desempleo</a>, el <a href="/cursos/analisis-de-datos">curso de análisis de datos</a> y la <a href="/guias/sueldo-analista-de-datos-latinoamerica">guía de sueldos para analistas de datos</a>.</p></section>
  </article>;
}
