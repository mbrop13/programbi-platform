/* eslint-disable @next/next/no-html-link-for-pages -- Enlaces estáticos para que el observatorio pueda navegar antes de cargar React. */
import { ChevronRight, ImageDown } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { CARTOGRAFIA, FECHA_EDICION, FUENTE_ENE, LICENCIA, METADATOS, REVISION_DESEMPLEO, TERMINOS_INE, hayPbix, type Observacion } from "@/lib/datos/desempleo";
import { fechaCorta, periodo, tasa } from "@/lib/datos/desempleo-formato";
import type { Migaja, Pregunta } from "@/lib/datos/seo";
import { CopiarDatos, EnlaceDatos } from "./AccionesDatos";
import { EmbedDialog } from "./EmbedDialog";
import estilos from "./Observatorio.module.css";

export function Migas({ elementos }: { elementos: readonly Migaja[] }) {
  return (
    <nav aria-label="Ruta de navegación" className={estilos.migas}>
      <ol>
        {elementos.map(({ label, path }, index) => (
          <li key={path}>
            {index > 0 && <ChevronRight aria-hidden="true" size={13} />}
            {index === elementos.length - 1 ? <span aria-current="page">{label}</span> : <a href={path}>{label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function DatosEstructurados({ nodos }: { nodos: Record<string, unknown>[] }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": nodos }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function Fuente({ edicion = false }: { edicion?: boolean }) {
  const fechaIne = METADATOS.ine_fecha_actualizacion;
  return (
    <p className={estilos.fuente}>
      {edicion && <>Actualizado por ProgramBI el <time dateTime={FECHA_EDICION}>{fechaCorta(FECHA_EDICION)}</time>. </>}
      Fuente: <a href={FUENTE_ENE}>INE, Encuesta Nacional de Empleo</a>, actualizada el {
        /^\d{4}-/.test(fechaIne) ? fechaCorta(fechaIne) : fechaIne
      }.
    </p>
  );
}

export function MiniSerie({ serie, variante = "hero" }: {
  serie: readonly Observacion[];
  variante?: "hero" | "hub";
}) {
  const datos = serie.slice(-24);
  const anchura = 350;
  const altura = 124;
  const max = Math.max(...datos.map(({ tasa }) => tasa));
  const min = Math.min(...datos.map(({ tasa }) => tasa));
  const rango = max - min || 1;
  const puntos = datos.map(({ tasa }, indice) => {
    const x = 9 + indice * (anchura - 18) / Math.max(datos.length - 1, 1);
    const y = altura - 18 - (tasa - min) / rango * (altura - 40);
    return [x.toFixed(1), y.toFixed(1)];
  });
  const [ultimoX, ultimoY] = puntos.at(-1)!;
  const linea = puntos.map((punto) => punto.join(",")).join(" ");
  return (
    <figure className={`${estilos.miniSerie} ${variante === "hub" ? estilos.miniSerieHub : ""}`}>
      <figcaption><span>Últimos 24 trimestres móviles</span></figcaption>
      <svg aria-hidden="true" viewBox={`0 0 ${anchura} ${altura}`} width={anchura} height={altura}>
        <path d="M9 32H341 M9 70H341 M9 107H341" className={estilos.miniGuia} />
        <polyline points={linea} className={estilos.miniLinea} fill="none" />
        <circle cx={ultimoX} cy={ultimoY} r="7" className={estilos.miniPunto} />
      </svg>
      <div className={estilos.miniFechas}><span>{periodo(datos[0].p)}</span><span>{periodo(datos.at(-1)!.p)}</span></div>
    </figure>
  );
}

export function TablaHistorica({ serie, nombre, nacional }: {
  serie: readonly Observacion[]; nombre: string; nacional?: readonly Observacion[];
}) {
  const tasasChile = new Map(nacional?.map((dato) => [dato.p, dato.tasa]));
  // The table is static server content. Escape every dynamic value before
  // serializing its rows as one RSC value, preserving the native HTML table.
  const escape = (valor: string) => valor.replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[caracter]!);
  const filas = [...serie].reverse().map((fila) => {
    const chile = tasasChile.get(fila.p);
    const nota = fila.notas.tasa ?? fila.notas.des;
    return `<tr><th scope="row">${escape(periodo(fila.p))}</th><td>${escape(tasa(fila.tasa))}${nota ? `<sup aria-label="${escape(`Nota ${nota} en desocupación`)}">${escape(nota)}</sup>` : ""}</td>${nacional ? `<td>${escape(chile === undefined ? "—" : tasa(chile))}</td>` : ""}</tr>`;
  }).join("");
  return (
    <div data-tabla-servidor>
      <div className={estilos.tablaScroll} tabIndex={0} role="region" aria-label={`Tabla histórica de ${nombre}`}>
        <table className={estilos.tabla}>
          <caption>Desocupación por trimestre móvil en {nombre}, desde {periodo(serie[0].p)}</caption>
          <thead><tr><th scope="col">Trimestre móvil</th><th scope="col">{nombre}</th>{nacional && <th scope="col">Chile</th>}</tr></thead>
          <tbody dangerouslySetInnerHTML={{ __html: filas }} />
        </table>
      </div>
      <p className={estilos.secundario}>Nota a: estimación poco fiable. Nota b: estimación no fiable.</p>
      <Fuente />
    </div>
  );
}

export function Descargas({ slug, nombre }: { slug: string; nombre: string }) {
  const csv = `/datos/desempleo/csv/${slug}.csv`;
  const powerQuery = `let
    Origen = Csv.Document(Web.Contents("${SITE_URL}${csv}"), [Delimiter=";", Columns=8, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Filas = Table.Skip(Origen, 3),
    Encabezados = Table.PromoteHeaders(Filas, [PromoteAllScalars=true]),
    Tipos = Table.TransformColumnTypes(Encabezados, {{"p", type text}, {"tasa", type number}, {"tasa_ocup", type number}, {"tasa_part", type number}, {"ft", type number}, {"ocu", type number}, {"des", type number}}, "es-CL")
in
    Tipos`;
  return (
    <section id="descargas" className={estilos.descargas} aria-labelledby="titulo-descargas">
      <div className={estilos.cardDescarga}>
        <div>
          <h2 id="titulo-descargas">Descarga los datos</h2>
          <p>La serie de {nombre} en CSV o un libro Excel con Chile y las 16 regiones. Los archivos derivados se publican con licencia <a href={LICENCIA}>CC BY-SA 4.0</a>.</p>
        </div>
        <div className={estilos.acciones}>
          <EnlaceDatos texto="Descargar CSV" href={csv} formato="csv" territorio={slug} />
          <EnlaceDatos texto="Descargar Excel" href="/datos/desempleo/desempleo-chile.xlsx" formato="xlsx" territorio={slug} />
          <EmbedDialog territorio={slug} nombre={nombre} />
          {slug !== "nacional" && (
            <a className={estilos.botonClaro} href={`/datos/desempleo/og/comparar-${slug}?v=${REVISION_DESEMPLEO}`} download={`${slug}-vs-chile.png`}>
              <ImageDown size={16} aria-hidden="true" /> Guardar tarjeta comparativa
            </a>
          )}
          {hayPbix() && <EnlaceDatos texto="Descargar Power BI" href="/datos/desempleo/observatorio-desempleo.pbix" formato="pbix" territorio={slug} />}
        </div>
        <details className={estilos.detalle}>
          <summary>Conecta Power BI a estos datos</summary>
          <p>En Power BI Desktop, abre una consulta en blanco y pega este código en el Editor avanzado.</p>
          <pre className={estilos.codigo}><code>{powerQuery}</code></pre>
          <CopiarDatos texto={powerQuery} etiqueta="Copiar código M" territorio={slug} powerQuery />
        </details>
      </div>
      <aside className={estilos.cardCurso}>
        <h2>Aprende a construir este dashboard</h2>
        <p>Practica con series públicas. Aprende a importar los datos, modelar períodos y crear visualizaciones en Power BI.</p>
        <a href="/cursos/power-bi">Curso de Power BI</a>
        <a href="/cursos/analisis-de-datos">Curso de análisis de datos</a>
      </aside>
    </section>
  );
}

export function Metodologia({ nombre, slug, actual }: { nombre: string; slug: string; actual: Observacion }) {
  const fechaIne = METADATOS.ine_fecha_actualizacion;
  const fechaFuente = /^\d{4}-/.test(fechaIne) ? fechaCorta(fechaIne) : fechaIne;
  const cita = `ProgramBI, Observatorio de Desempleo: ${nombre}, ${periodo(actual.p)}. Fuente: INE, Encuesta Nacional de Empleo, actualizada el ${fechaFuente}. ${SITE_URL}/datos/desempleo${slug === "nacional" ? "" : `/${slug}`}`;
  return (
    <section id="metodologia" className={estilos.seccion} aria-labelledby="titulo-metodo">
      <h2 id="titulo-metodo">Metodología y fuentes</h2>
      <div className={estilos.metodoGrid}>
        <div>
          <h3>Cómo leer las cifras</h3>
          <dl className={estilos.definiciones}>
            <div><dt>Trimestre móvil</dt><dd>Estimación que reúne observaciones de tres meses consecutivos. Dos períodos seguidos comparten dos de sus meses.</dd></div>
            <div><dt>Fuerza de trabajo</dt><dd>Personas ocupadas y desocupadas. La tasa de desocupación divide el total de personas desocupadas por la fuerza de trabajo y lo expresa como porcentaje.</dd></div>
            <div><dt>Notas de calidad del INE</dt><dd><strong>a</strong> indica una estimación poco fiable y <strong>b</strong> una estimación no fiable. Junto a la tasa también señalamos las notas del recuento de desocupados, que es su numerador. Las variaciones pequeñas pueden no ser estadísticamente significativas.</dd></div>
            <div><dt>Revisiones y cobertura regional</dt><dd>El INE revisa su historia cada año. Desde 2010, la serie de Ñuble corresponde a la antigua provincia de Ñuble y la de Biobío excluye ese territorio.</dd></div>
          </dl>
        </div>
        <div className={estilos.cita}>
          <h3>Cómo citar</h3>
          <p>{cita}</p>
          <CopiarDatos texto={cita} etiqueta="Copiar cita" territorio={slug} />
          <p>ProgramBI transformó las series y elaboró las visualizaciones. Su publicación no implica respaldo del INE. Datos derivados bajo <a href={LICENCIA}>CC BY-SA 4.0</a>, según los <a href={TERMINOS_INE}>términos del INE</a>.</p>
          <p><a href={CARTOGRAFIA}>Cartografía: Biblioteca del Congreso Nacional de Chile</a>. Base regional simplificada para la visualización.</p>
        </div>
      </div>
    </section>
  );
}

export function preguntasObservatorio(nombre: string, actual: Observacion): Pregunta[] {
  return [
    { pregunta: `¿Cuál es la tasa de desempleo en ${nombre}?`, respuesta: `El INE estimó una tasa de desocupación de ${tasa(actual.tasa)} en ${nombre} para el trimestre móvil ${periodo(actual.p)}.` },
    { pregunta: "¿Qué mide la tasa de desocupación?", respuesta: "Es la proporción de personas desocupadas dentro de la fuerza de trabajo. La fuerza de trabajo incluye a las personas ocupadas y a las desocupadas." },
    { pregunta: "¿Cada cuánto se actualiza la tasa de desempleo?", respuesta: "El INE publica mensualmente las estimaciones de la Encuesta Nacional de Empleo. ProgramBI actualiza sus series cuando valida una nueva edición de los cuadros oficiales." },
    { pregunta: "¿Por qué el INE usa trimestres móviles?", respuesta: "La Encuesta Nacional de Empleo publica estimaciones que reúnen tres meses consecutivos. Cada edición avanza un mes, por lo que dos trimestres consecutivos comparten dos meses." },
    { pregunta: "¿Cuál es la diferencia entre desocupado y cesante?", respuesta: "El total de personas desocupadas comprende a quienes trabajaron antes y están cesantes, y a quienes buscan trabajo por primera vez. Para la encuesta, deben estar disponibles para trabajar y haber buscado empleo." },
    { pregunta: "¿De dónde salen los datos del observatorio?", respuesta: "De los cuadros de series vigentes de la Encuesta Nacional de Empleo del Instituto Nacional de Estadísticas de Chile. ProgramBI los transforma para visualizar y descargar las series." },
  ];
}

export function Preguntas({ preguntas }: { preguntas: readonly Pregunta[] }) {
  return (
    <section className={estilos.seccion} aria-labelledby="titulo-preguntas">
      <h2 id="titulo-preguntas">Preguntas frecuentes</h2>
      <div className={estilos.faq}>
        {preguntas.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className={estilos.detalle}><summary>{pregunta}</summary><p>{respuesta}</p></details>
        ))}
      </div>
    </section>
  );
}
