import Link from "next/link";
import { Activity, ArrowUpRight, BookOpen, Calculator, ChartNoAxesCombined, GraduationCap, MapPin, Percent, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { DatosEstructurados, Fuente, Migas, MiniSerie } from "@/components/datos/ElementosDatos";
import estilos from "@/components/datos/Observatorio.module.css";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, puntos } from "@/lib/datos/desempleo-formato";
import { getMetaCarreras, getRankingCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { pesos, porcentaje } from "@/lib/datos/formato";
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
export const metadata = { ...baseMeta, title: { absolute: titulo }, description: descripcion,
  openGraph: { ...baseMeta.openGraph, title: titulo, description: descripcion },
  twitter: { ...baseMeta.twitter, title: titulo, description: descripcion },
};

export default function DatosPage() {
  const nacional = datosTerritorio(NACIONAL);
  if (!nacional) notFound();
  const { actual, serie, indicadores } = nacional;
  const resumen = resumenTerritorio("Chile", actual, indicadores, 0, RANKING.length);
  const carreras = getMetaCarreras();
  const medicina = getRankingCarreras().find((item) => item.slug === "medicina" && item.tipo === "u");
  return <div className={estilos.contenedor}>
    <DatosEstructurados nodos={[breadcrumbs(MIGAS_DATOS), dataset(NACIONAL, "Chile", descripcion, serie)]} />
    <Migas elementos={MIGAS_DATOS} />
    <header className={estilos.hubEncabezado}>
      <p className={estilos.sello}><span><Activity size={15} aria-hidden="true" /></span> Datos de ProgramBI</p>
      <h1>Datos de Chile,<br /> explicados en simple</h1>
      <p>Explora cifras oficiales sobre empleo, estudios, capacitación e inflación. Entiende qué miden y utiliza los datos en tu propio análisis.</p>
    </header>
    <section className={estilos.hubTarjeta} aria-labelledby="hub-desempleo">
      <div><p className={estilos.periodo}>{periodo(actual.p)}</p><h2 id="hub-desempleo">Observatorio de Desempleo</h2>
        <p className={estilos.valorHub} data-tasa-hero={actual.tasa}>{cifra(actual.tasa)}<span> %</span></p>
        <p>Tasa de desocupación en Chile {indicadores.yoy_pp !== null && <span data-yoy-hero={indicadores.yoy_pp}>· {puntos(indicadores.yoy_pp)} en doce meses</span>}</p>
        <Fuente edicion /><Link className={estilos.botonPrincipal} href={RUTA_DESEMPLEO}>Explorar desempleo en Chile <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div><MiniSerie serie={serie} variante="hub" />
    </section>
    <section className={estilos.seccion} aria-labelledby="hub-resumen"><h2 id="hub-resumen">En resumen</h2>{resumen.map((texto) => <p key={texto}>{texto}</p>)}</section>
    <section className={estilos.seccion} aria-labelledby="hub-observatorios"><h2 id="hub-observatorios">Explora los datos por tema</h2>
      <div className={estilos.hubAccesos}>
        <Link href={`${RUTA_DESEMPLEO}/jovenes`}><GraduationCap aria-hidden="true" /><strong>Empleo juvenil</strong><span>Desocupación, estudios y búsqueda de empleo entre jóvenes de 15 a 24 años.</span></Link>
        <Link href="/datos/capacitacion"><BookOpen aria-hidden="true" /><strong>Capacitación en Chile</strong><span>Participaciones por región en cursos con franquicia tributaria, según SENCE.</span></Link>
        <Link href="/datos/carreras"><TrendingUp aria-hidden="true" /><strong>Carreras y empleabilidad</strong><span>{medicina && medicina.ing4 !== null ? `Medicina (${TIPO_ETIQUETAS[medicina.tipo].plural}): ${pesos(medicina.ing4)} de ingreso bruto mensual al cuarto año y ${porcentaje(medicina.emp1)} de empleabilidad al primero. Fuente: Mi Futuro, edición ${carreras.edicion}; pesos de ${carreras.pesos_de}.` : "Compara ingresos y empleabilidad con datos de Mi Futuro."}</span></Link>
        <Link href="/datos/inflacion"><Percent aria-hidden="true" /><strong>Inflación e IPC</strong><span>Compara montos de distintos períodos con el índice de precios.</span></Link>
      </div>
    </section>
    <section className={estilos.seccion} aria-labelledby="hub-herramientas"><h2 id="hub-herramientas">Herramientas para explorar</h2>
      <div className={estilos.hubAccesos}>
        <Link href={`${RUTA_DESEMPLEO}#regiones`}><MapPin aria-hidden="true" /><strong>Mapa y ranking regional</strong><span>Ubica tu región y compara tasas.</span></Link>
        <Link href={`${RUTA_DESEMPLEO}#historico`}><ChartNoAxesCombined aria-hidden="true" /><strong>Histórico de desempleo</strong><span>Compara regiones y trimestres móviles.</span></Link>
        <Link href="/datos/carreras/comparar"><TrendingUp aria-hidden="true" /><strong>Comparar carreras</strong><span>Revisa ingresos y empleabilidad lado a lado.</span></Link>
        <Link href="/datos/carreras/retorno"><Calculator aria-hidden="true" /><strong>Calculadora de retorno</strong><span>Estima el costo de estudiar y su relación con el ingreso.</span></Link>
        <Link href="/datos/carreras/puntaje-ponderado"><Calculator aria-hidden="true" /><strong>Calculadora PAES</strong><span>Consulta las ponderaciones de los programas.</span></Link>
      </div>
    </section>
  </div>;
}
