import type { Indicadores, Observacion } from "./desempleo";
import { cifra, periodo, personas, puntos, tasa } from "./formato";

export function movimiento(delta: number, referencia: string) {
  if (cifra(Math.abs(delta)) === "0,0") return `se mantuvo al mismo nivel ${referencia} a un decimal`;
  return `${delta > 0 ? "subió" : "bajó"} ${puntos(delta, false)} ${referencia}`;
}

export function diferencia(delta: number) {
  if (cifra(Math.abs(delta)) === "0,0") return "al mismo nivel que la tasa de Chile a un decimal";
  return `${puntos(delta, false)} por ${delta > 0 ? "encima" : "debajo"} de Chile`;
}

export function resumenTerritorio(
  nombre: string,
  actual: Observacion,
  indicadores: Indicadores,
  posicion: number,
  total: number,
  nacional?: Observacion,
) {
  const trimestre = periodo(actual.p);
  return [
    `Según el INE, la tasa de desocupación en ${nombre} fue de ${tasa(actual.tasa)} en el trimestre móvil ${trimestre}${indicadores.yoy_pp === null ? "" : ` y ${movimiento(indicadores.yoy_pp, "respecto al mismo trimestre del año anterior")}`}.`,
    `El INE estimó ${personas(actual.des)} personas desocupadas en ${nombre} en ${trimestre}${actual.notas.des ? ` (estimación con nota ${actual.notas.des} de calidad)` : ""}.`,
    nacional && posicion
      ? `${nombre} ocupó el puesto ${posicion} de ${total} en el ranking de desocupación del INE de mayor a menor en ${trimestre}, con una tasa de ${tasa(actual.tasa)} frente al ${tasa(nacional.tasa)} nacional.`
      : `La tasa de ocupación en ${nombre} fue de ${tasa(actual.tasa_ocup)} en ${trimestre}, según la Encuesta Nacional de Empleo del INE.`,
  ];
}

export function lecturaRegional(
  nombre: string,
  actual: Observacion,
  indicadores: Indicadores,
  serie: readonly Observacion[],
  nacional: Observacion,
  ranking: readonly Indicadores[],
) {
  const actualLabel = periodo(actual.p);
  const posicion = ranking.findIndex(({ slug }) => slug === indicadores.slug) + 1;
  const cerca = otrasTasas(indicadores, ranking);
  const anterior = serie.at(-2);
  const anteriorAnual = serie.at(-13);
  const cinco = serie.at(-61);
  const anteriorComparable = indicadores.anterior_mismo_trimestre;
  const primer = serie[0];
  const maximo = indicadores.maximo;
  const minimo = indicadores.minimo;
  const brecha = indicadores.vs_chile_pp ?? actual.tasa - nacional.tasa;

  return [
    `En ${nombre}, el registro de ${actualLabel} equivale a ${cifra(actual.tasa)} personas desocupadas por cada cien personas en la fuerza de trabajo. La encuesta del INE estimó una fuerza de trabajo regional de ${personas(actual.ft)} personas, integrada por ${personas(actual.ocu)} ocupadas y ${personas(actual.des)} desocupadas. Los recuentos son estimaciones de la encuesta redondeadas a personas.`,
    anteriorAnual && indicadores.yoy_pp !== null
      ? `Para ${periodo(anteriorAnual.p)}, el INE registró ${tasa(anteriorAnual.tasa)} en ${nombre}. Al comparar esos mismos meses un año después (en ${actualLabel}), la tasa de ${nombre} ${movimiento(indicadores.yoy_pp, "en doce meses")}. Mirar el mismo trimestre ayuda a leer la evolución cuando la ocupación tiene patrones a lo largo del año.`
      : null,
    `En la serie de ${nombre} desde ${periodo(primer.p)}, el máximo de desocupación fue ${tasa(maximo.tasa)} en ${periodo(maximo.p)} y el mínimo fue ${tasa(minimo.tasa)} en ${periodo(minimo.p)}. Si se consideran solo las observaciones correspondientes a los meses de ${actualLabel.split(" ")[0]}, el dato actual queda en el puesto ${indicadores.rank_mismo_trimestre} de mayor a menor${anteriorComparable ? ` y el último registro igual o mayor fue de ${tasa(anteriorComparable.tasa)} en ${periodo(anteriorComparable.p)}` : ""}.`,
    `La tasa de ${nombre} en ${actualLabel} quedó ${diferencia(brecha)}. Con el ${tasa(nacional.tasa)} nacional como referencia, ${nombre} se ubicó en el puesto ${posicion} entre ${ranking.length} regiones. Las tasas regionales más cercanas en el mismo período fueron las de ${cerca.map((item) => `${item.nombre} (${tasa(item.tasa)})`).join(" y ")}.`,
    `En ${actualLabel}, ${nombre} tuvo una tasa de participación de ${tasa(actual.tasa_part)} y una tasa de ocupación de ${tasa(actual.tasa_ocup)}. La primera mide qué proporción de la población en edad de trabajar está ocupada o busca empleo. La segunda indica qué proporción de esa misma población tiene trabajo. Junto al ${tasa(actual.tasa)} de desocupación, estas medidas permiten entender cuánto cambia el empleo y cuántas personas forman parte del mercado laboral regional.`,
    anterior && cinco && indicadores.anterior_pp !== null
      ? `El trimestre inmediatamente anterior (${periodo(anterior.p)}) marcó ${tasa(anterior.tasa)} en ${nombre}. Respecto a esa medición, que comparte dos meses con ${actualLabel}, la tasa regional ${movimiento(indicadores.anterior_pp, "entre ambos trimestres")}. Para una lectura de más largo plazo, la tasa de ${nombre} en ${periodo(cinco.p)} fue de ${tasa(cinco.tasa)}. Las diferencias pequeñas pueden no ser estadísticamente significativas.`
      : null,
  ].filter((texto): texto is string => texto !== null);
}

export function otrasTasas(indicadores: Indicadores, ranking: readonly Indicadores[]) {
  return ranking.filter((item) => item.slug !== indicadores.slug)
    .sort((a, b) => Math.abs(a.tasa - indicadores.tasa) - Math.abs(b.tasa - indicadores.tasa))
    .slice(0, 2);
}
