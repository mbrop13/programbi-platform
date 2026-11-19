import Link from "next/link";
import { Activity, ArrowUpRight, BookOpen, ChartNoAxesCombined, Download, GraduationCap, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { DatosEstructurados, Fuente, Migas, MiniSerie } from "@/components/datos/ElementosDatos";
import estilos from "@/components/datos/Observatorio.module.css";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, puntos } from "@/lib/datos/desempleo-formato";
import { NACIONAL, RUTA_DESEMPLEO } from "@/lib/datos/regiones";
import { breadcrumbs, dataset, metaObservatorio, MIGAS_DATOS } from "@/lib/datos/seo";
import { resumenTerritorio } from "@/lib/datos/textos";

export const dynamic = "force-static";
export const metadata = metaObservatorio(NACIONAL, "Chile", true);

export default function DatosPage() {
  const nacional = datosTerritorio(NACIONAL);
  if (!nacional) notFound();
  const { actual, serie, indicadores } = nacional;
  const resumen = resumenTerritorio("Chile", actual, indicadores, 0, RANKING.length);
  return (
    <div className={estilos.contenedor}>
      <DatosEstructurados nodos={[breadcrumbs(MIGAS_DATOS), dataset(NACIONAL, "Chile", metadata.description ?? resumen[0], serie)]} />
      <Migas elementos={MIGAS_DATOS} />
      <header className={estilos.hubEncabezado}>
        <p className={estilos.sello}><span><Activity size={15} aria-hidden="true" /></span> Datos de ProgramBI</p>
        <h1>Datos de Chile,<br /> explicados en simple</h1>
        <p>Explora las cifras oficiales del país, entiende cómo se calculan y descarga las series para usarlas en tu propio análisis.</p>
      </header>
      <section className={estilos.hubTarjeta} aria-labelledby="hub-desempleo">
        <div>
          <p className={estilos.periodo}>{periodo(actual.p)}</p>
          <h2 id="hub-desempleo">Observatorio de Desempleo</h2>
          <p className={estilos.valorHub} data-tasa-hero={actual.tasa}>{cifra(actual.tasa)}<span> %</span></p>
          <p>Tasa de desocupación en Chile {indicadores.yoy_pp !== null && <span data-yoy-hero={indicadores.yoy_pp}>· {puntos(indicadores.yoy_pp)} en doce meses</span>}</p>
          <Fuente edicion />
          <Link className={estilos.botonPrincipal} href={RUTA_DESEMPLEO}>Explorar desempleo en Chile <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <MiniSerie serie={serie} variante="hub" />
      </section>
      <div className={estilos.hubAccesos}>
        <Link href={`${RUTA_DESEMPLEO}#regiones`}><MapPin aria-hidden="true" /><strong>Mapa de las 16 regiones</strong><span>Ubica tu región y revisa su posición.</span></Link>
        <Link href={`${RUTA_DESEMPLEO}#historico`}><ChartNoAxesCombined aria-hidden="true" /><strong>Histórico desde 2010</strong><span>Compara regiones y trimestres móviles.</span></Link>
        <Link href={`${RUTA_DESEMPLEO}#descargas`}><Download aria-hidden="true" /><strong>Descargas en CSV y Excel</strong><span>Reutiliza las series en tus propios proyectos.</span></Link>
      </div>
      <section className={estilos.seccion} aria-labelledby="hub-otros-observatorios">
        <h2 id="hub-otros-observatorios">Explora el empleo y la capacitación</h2>
        <div className={estilos.hubAccesos}>
          <Link href={`${RUTA_DESEMPLEO}/jovenes`}>
            <GraduationCap aria-hidden="true" />
            <strong>Empleo juvenil</strong>
            <span>Desocupación, estudios y duración de la búsqueda de empleo entre los 15 y 24 años.</span>
          </Link>
          <Link href="/datos/capacitacion">
            <BookOpen aria-hidden="true" />
            <strong>Capacitación en Chile</strong>
            <span>Participaciones por región en cursos con franquicia tributaria, según SENCE.</span>
          </Link>
        </div>
      </section>
      <section className={estilos.seccion} aria-labelledby="hub-resumen">
        <h2 id="hub-resumen">En resumen</h2>
        {resumen.map((texto) => <p key={texto}>{texto}</p>)}
      </section>
    </div>
  );
}
