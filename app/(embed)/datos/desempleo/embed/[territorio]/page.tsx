import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmbedAnalytics } from "@/components/datos/EmbedAnalytics";
import { datosTerritorio, RANKING, regionesPublicables } from "@/lib/datos/desempleo";
import { periodo, tasa } from "@/lib/datos/desempleo-formato";
import { NACIONAL, nombreTerritorio, rutaTerritorio } from "@/lib/datos/regiones";
import estilos from "./embed.module.css";

export const dynamic = "force-static";
export const dynamicParams = false;
export const metadata: Metadata = { robots: { index: false, follow: true } };
export function generateStaticParams() {
  return [NACIONAL, ...regionesPublicables().map(({ slug }) => slug)].map((territorio) => ({ territorio }));
}

export default async function EmbedPage({ params }: { params: Promise<{ territorio: string }> }) {
  const { territorio } = await params;
  const datos = datosTerritorio(territorio);
  if (!datos || (territorio !== NACIONAL && !regionesPublicables().some((region) => region.slug === territorio))) notFound();
  const nombre = nombreTerritorio(territorio);
  const ultimos = datos.serie.slice(-24);
  const valores = ultimos.map((item) => item.tasa);
  const min = Math.min(...valores), max = Math.max(...valores), rango = max - min || 1;
  const puntos = valores.map((valor, i) => `${(i / Math.max(valores.length - 1, 1) * 300).toFixed(1)},${(48 - (valor - min) / rango * 40).toFixed(1)}`).join(" ");
  const posicion = RANKING.findIndex((item) => item.slug === territorio) + 1;
  return <main className={estilos.tarjeta}>
    <EmbedAnalytics territorio={territorio} />
    <div><p className={estilos.eyebrow}>Encuesta Nacional de Empleo</p><h1>Desempleo en {nombre}</h1>
      <p className={estilos.cifra}>{tasa(datos.actual.tasa)}{datos.actual.notas.des && <sup>{datos.actual.notas.des}</sup>}</p>
      <p className={estilos.periodo}>{periodo(datos.actual.p)} · tasa de desocupación</p>
      <svg viewBox="0 0 300 56" preserveAspectRatio="none" role="img" aria-label={`Evolución de la tasa de desocupación en ${nombre} durante los últimos ${ultimos.length} trimestres móviles`} className={estilos.grafico}><polyline points={puntos} fill="none" stroke="#1264a7" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /></svg>
      {territorio === NACIONAL ? <p className={estilos.ranking}>Mayor tasa regional: {RANKING[0]?.nombre} ({tasa(RANKING[0].tasa)})</p> : <p className={estilos.ranking}>Puesto {posicion} de {RANKING.length} regiones, de mayor a menor tasa.</p>}
      {datos.actual.notas.des && <p className={estilos.nota}>Nota {datos.actual.notas.des}: estimación {datos.actual.notas.des === "b" ? "no fiable" : "poco fiable"} según INE.</p>}
    </div>
    <footer>Datos: INE · Visualización: <a href={`https://www.programbi.com${rutaTerritorio(territorio)}`} target="_blank" rel="noopener">ProgramBI</a></footer>
  </main>;
}
