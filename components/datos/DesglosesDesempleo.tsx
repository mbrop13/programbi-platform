import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Users } from "lucide-react";
import { EDAD, INFORMALIDAD, SEXO, seriesSectores, type FuenteDesglose } from "@/lib/datos/desempleo-desgloses";
import { personas, periodo, tasa } from "@/lib/datos/desempleo-formato";
import { NACIONAL } from "@/lib/datos/regiones";
import type { Nota } from "@/lib/datos/desempleo";
import estilo from "./DesglosesDesempleo.module.css";

type Medida = { nombre: string; valor: number | undefined; nota?: Nota };
const tramos = [
  ["15-24", "15 a 24 años"], ["25-34", "25 a 34 años"], ["35-44", "35 a 44 años"],
  ["45-54", "45 a 54 años"], ["55-64", "55 a 64 años"], ["65-mas", "65 años y más"],
];

export function NotaDesglose({ nota }: { nota?: Nota }) {
  return nota ? (
    <sup aria-label={nota === "a" ? "Estimación poco fiable" : "Estimación no fiable"}>{nota}</sup>
  ) : null;
}

export function FuenteDesgloses({ fuente, periodoCodigo }: { fuente: FuenteDesglose; periodoCodigo?: string }) {
  return (
    <p className={estilo.fuente}>
      {periodoCodigo && <>{periodo(periodoCodigo)} · </>}
      <a href={fuente.url}>INE, Encuesta Nacional de Empleo</a> · Edición {fuente.fecha_actualizacion}
    </p>
  );
}

function Barras({ medidas, escala = 100 }: { medidas: Medida[]; escala?: number }) {
  return (
    <dl className={estilo.barras}>
      {medidas.map(({ nombre, valor, nota }) => (
        <div key={nombre}>
          <dt>{nombre}</dt>
          <dd>
            {valor === undefined ? "Sin estimación" : tasa(valor)} <NotaDesglose nota={nota} />
            <span className={estilo.canal} aria-hidden="true">
              {valor !== undefined && <span style={{ width: `${Math.min(100, valor / escala * 100)}%` }} />}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function variacionPersonas(valor: number) {
  return `${valor === 0 ? "" : valor > 0 ? "+" : "−"}${personas(Math.abs(valor))}`;
}

function Sectores({ territorio }: { territorio: string }) {
  const datos = seriesSectores(territorio);
  if (!datos) return null;
  const orden = [...datos.filas].sort((a, b) => b.variacion - a.variacion);
  const fiables = orden.filter((fila) =>
    fila.nota_actual !== "b" && fila.nota_anterior !== "b" && !fila.sector.startsWith("no_sabe"),
  );
  const alzas = fiables.filter(({ variacion }) => variacion > 0).slice(0, 3);
  const caidas = fiables.filter(({ variacion }) => variacion < 0).slice(-3).reverse();
  return (
    <section className={estilo.tarjeta} aria-labelledby="ramas-titulo">
      <h3 id="ramas-titulo"><BriefcaseBusiness size={19} aria-hidden="true" /> Qué sectores cambiaron en doce meses</h3>
      <p>Variación estimada de personas ocupadas entre {periodo(datos.periodo_anterior)} y {periodo(datos.periodo)}.</p>
      <div className={estilo.columnas}>
        {[{ titulo: "Mayores aumentos", filas: alzas }, { titulo: "Mayores caídas", filas: caidas }].map(({ titulo, filas }) => (
          <div key={titulo}>
            <h4>{titulo}</h4>
            {filas.length ? (
              <dl className={estilo.listas}>
                {filas.map((fila) => (
                  <div key={fila.sector}>
                    <dt>{fila.nombre} <NotaDesglose nota={fila.nota_actual ?? fila.nota_anterior} /></dt>
                    <dd>{variacionPersonas(fila.variacion)}</dd>
                  </div>
                ))}
              </dl>
            ) : <p>Sin estimaciones comparables para este grupo.</p>}
          </div>
        ))}
      </div>
      <details className={estilo.detalle}>
        <summary>Ver tabla por actividad económica</summary>
        <div className={estilo.tablaScroll} role="region" aria-label="Ocupación y variación por actividad económica" tabIndex={0}>
          <table className={estilo.tabla}>
            <caption>Personas ocupadas por rama y variación en doce meses</caption>
            <thead><tr><th scope="col">Actividad</th><th scope="col">{periodo(datos.periodo_anterior)}</th><th scope="col">{periodo(datos.periodo)}</th><th scope="col">Variación</th></tr></thead>
            <tbody>{orden.map((fila) => (
              <tr key={fila.sector}>
                <th scope="row">{fila.nombre}</th>
                <td>{personas(fila.anterior)} <NotaDesglose nota={fila.nota_anterior} /></td>
                <td>{personas(fila.actual)} <NotaDesglose nota={fila.nota_actual} /></td>
                <td>{variacionPersonas(fila.variacion)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </details>
      <FuenteDesgloses fuente={datos.fuente} />
    </section>
  );
}

export function DesglosesDesempleo({ territorio, nombre }: { territorio: string; nombre: string }) {
  const hombres = SEXO.series[`${territorio}:hombres`]?.at(-1);
  const mujeres = SEXO.series[`${territorio}:mujeres`]?.at(-1);
  const informalidad = INFORMALIDAD.series[territorio]?.at(-1);
  const edades = tramos.map(([clave, nombre]) => {
    const fila = EDAD.series[clave]?.at(-1);
    return { nombre, valor: fila?.valores.tasa, nota: fila?.notas.tasa ?? fila?.notas.des };
  });

  return (
    <section id="desgloses" className={estilo.bloque} aria-labelledby="desgloses-titulo">
      <h2 id="desgloses-titulo">Mercado laboral en {nombre}</h2>
      <p>{territorio === NACIONAL
        ? "Desocupación por sexo y edad, informalidad y cambios por actividad económica."
        : "Desocupación por sexo, informalidad y cambios regionales por actividad económica."}</p>
      <div className={estilo.columnas}>
        {hombres && mujeres && (
          <section className={estilo.tarjeta} aria-labelledby="sexo-titulo">
            <h3 id="sexo-titulo"><Users size={19} aria-hidden="true" /> Desocupación por sexo</h3>
            <Barras escala={Math.max(15, hombres.valores.tasa ?? 0, mujeres.valores.tasa ?? 0)} medidas={[
              { nombre: "Mujeres", valor: mujeres.valores.tasa, nota: mujeres.notas.tasa ?? mujeres.notas.des },
              { nombre: "Hombres", valor: hombres.valores.tasa, nota: hombres.notas.tasa ?? hombres.notas.des },
            ]} />
            <FuenteDesgloses fuente={SEXO.fuente} periodoCodigo={hombres.p} />
          </section>
        )}
        {informalidad && (
          <section className={estilo.tarjeta} aria-labelledby="informalidad-titulo">
            <h3 id="informalidad-titulo"><BriefcaseBusiness size={19} aria-hidden="true" /> Ocupación informal</h3>
            <Barras medidas={[
              { nombre: "Total", valor: informalidad.valores.tasa, nota: informalidad.notas.tasa },
              { nombre: "Mujeres", valor: informalidad.valores.mujeres, nota: informalidad.notas.mujeres },
              { nombre: "Hombres", valor: informalidad.valores.hombres, nota: informalidad.notas.hombres },
            ]} />
            <p>Porcentaje de las personas ocupadas cuyo empleo se clasifica como informal.</p>
            <FuenteDesgloses fuente={INFORMALIDAD.fuente} periodoCodigo={informalidad.p} />
          </section>
        )}
      </div>
      {territorio === NACIONAL && edades.some((edad) => edad.valor !== undefined) && (
        <section className={estilo.tarjeta} aria-labelledby="edad-titulo">
          <h3 id="edad-titulo">Desocupación por tramo de edad</h3>
          <Barras escala={Math.max(30, ...edades.map((edad) => edad.valor ?? 0))} medidas={edades} />
          <Link className={estilo.enlace} href="/datos/desempleo/jovenes">
            Ver empleo juvenil en Chile <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <FuenteDesgloses fuente={EDAD.fuente} periodoCodigo={EDAD.series["15-24"]?.at(-1)?.p} />
        </section>
      )}
      <Sectores territorio={territorio} />
      <p className={estilo.fuente}>Las notas a y b señalan estimaciones poco fiables o no fiables, respectivamente. Los cambios pequeños pueden no ser estadísticamente significativos.</p>
    </section>
  );
}
