import {
  getRankingCarreras,
  mediana,
  TIPO_ETIQUETAS,
  type RankingItem,
  type TipoIesKey,
} from "./carreras";
import { millonesCorto, pesos, porcentaje, variacionPorcentual } from "./formato";

export type PresetSlug =
  | "mejor-pagadas"
  | "mas-empleabilidad"
  | "mejor-sueldo-por-arancel"
  | "baratas-con-buena-empleabilidad"
  | "crecieron-en-sueldo-real"
  | "mejor-pagadas-vespertinas";

export interface PresetDefinicion {
  slug: PresetSlug;
  tituloCorto: string;
  h1: string;
  /** Fragmento literal del H1 que lleva el marcador azul (motivo de identidad de /datos). */
  h1Marcador: string;
  titleSeo: string;
  descriptionSeo: string;
  metodologia: string[];
  queryFiltros: string;
  columnaExtraLabel: string;
  faqs: { pregunta: string; respuesta: string }[];
}

export const PRESETS_MAP: Record<PresetSlug, PresetDefinicion> = {
  "mejor-pagadas": {
    slug: "mejor-pagadas",
    tituloCorto: "Mejor pagadas",
    h1: "Carreras mejor pagadas en Chile: ranking por tipo de institución",
    h1Marcador: "mejor pagadas",
    titleSeo: "Carreras mejor pagadas en Chile 2025-2026: U, IP y CFT",
    descriptionSeo:
      "Ranking oficial de las 25 carreras mejor pagadas en Chile en universidades, IP y CFT al 4.º año según mifuturo.cl (Mineduc), con empleabilidad y sueldo.",
    metodologia: [
      "Este listado ordena las carreras genéricas publicadas por el Servicio de Información de Educación Superior (SIES) según el ingreso promedio bruto mensual al cuarto año de titulación, expresado en pesos de septiembre de 2025.",
      "Dado que las condiciones formativas, la duración y el mercado laboral difieren según el tipo de institución, el ranking separa Universidades, Institutos Profesionales (IP) y Centros de Formación Técnica (CFT). Los ingresos consideran únicamente a titulados con ingresos iguales o superiores al sueldo mínimo.",
      "Para evitar lecturas sesgadas por el promedio, cada fila incorpora la empleabilidad al primer año y los tramos P10–P90 cuando están publicados, recordando que la dispersión dentro de una misma carrera suele ser amplia.",
    ],
    queryFiltros: "?orden=ing4",
    columnaExtraLabel: "Ingreso 4.º año",
    faqs: [
      {
        pregunta: "¿Los sueldos del ranking son líquidos o brutos?",
        respuesta:
          "Son ingresos brutos mensualizados (antes de descuentos de salud, AFP e impuestos), calculados a partir de declaraciones tributarias ante el SII divididas por 12 y expresadas en pesos de septiembre de 2025.",
      },
      {
        pregunta: "¿Por qué se separan Universidades, IP y CFT?",
        respuesta:
          "El SIES publica estadísticas separadas por tipo de institución porque la duración formal, el nivel del título y las cohortes de titulados no son comparables de forma directa en una sola lista mezclada.",
      },
    ],
  },
  "mas-empleabilidad": {
    slug: "mas-empleabilidad",
    tituloCorto: "Más empleabilidad",
    h1: "Carreras con mayor empleabilidad en Chile al primer año",
    h1Marcador: "mayor empleabilidad",
    titleSeo: "Carreras con más empleabilidad en Chile (≥ 100 titulados)",
    descriptionSeo:
      "Top 25 carreras con mayor empleabilidad al 1.er año en Chile según mifuturo.cl (Mineduc), filtradas con al menos 100 titulados 2024 para evitar extremos chicos.",
    metodologia: [
      "El Servicio de Información de Educación Superior (SIES) define la empleabilidad como el porcentaje de titulados con información tributaria que registró ingresos iguales o superiores al sueldo mínimo durante el primer año posterior a su titulación.",
      "Para evitar que carreras con muy pocos egresados dominen el primer lugar por variaciones estadísticas puntuales, esta vista filtra únicamente combinaciones carrera-tipo con al menos 100 titulados en 2024.",
      "Es fundamental recordar que la empleabilidad oficial es un proxy de inserción formal o de generación de ingresos mínimos, pero no mide si el titulado trabaja en su área de estudios ni el tipo de jornada o contrato.",
    ],
    queryFiltros: "?orden=emp1&min_titulados=100",
    columnaExtraLabel: "Empleabilidad 1.º",
    faqs: [
      {
        pregunta: "¿Qué mide exactamente la empleabilidad de mifuturo.cl?",
        respuesta:
          "Mide el porcentaje de titulados que obtuvo ingresos iguales o superiores al ingreso mínimo mensual durante el primer año tras titularse. No verifica si el trabajo corresponde a la carrera estudiada.",
      },
      {
        pregunta: "¿Por qué se exige un mínimo de 100 titulados en esta vista?",
        respuesta:
          "Porque carreras con cohortes muy pequeñas pueden alcanzar porcentajes cercanos al 100 % en un año puntual y variar bruscamente en el siguiente. El corte de 100 titulados entrega mayor estabilidad comparativa.",
      },
    ],
  },
  "mejor-sueldo-por-arancel": {
    slug: "mejor-sueldo-por-arancel",
    tituloCorto: "Mejor sueldo por arancel",
    h1: "Carreras con mejor relación entre sueldo y arancel en Chile",
    h1Marcador: "entre sueldo y arancel",
    titleSeo: "Carreras con mejor retorno por arancel en Chile 2026",
    descriptionSeo:
      "Compara el ingreso bruto anual al 4.º año frente al costo total estimado de arancel y titulación en Chile 2026 según datos oficiales de mifuturo.cl.",
    metodologia: [
      "Esta vista calcula la razón entre el ingreso bruto anualizado al cuarto año de titulación (ingreso mensual promedio × 12, en pesos de septiembre de 2025) y el costo total estimado de estudiar la carrera sin gratuidad ni becas.",
      "El costo total estimado se obtiene multiplicando el arancel anual mediano 2026 informado en el Buscador de Carreras por la duración real promedio en años (duración real en semestres ÷ 2), más el costo de titulación mediano cuando existe dato.",
      "El indicador se expresa como «cada $1 de arancel estimado se asocia a $X de ingreso bruto anual al 4.º año». Es una referencia descriptiva que no descuenta impuestos, costo de vida ni financiamiento con gratuidad.",
    ],
    queryFiltros: "?orden=ing4",
    columnaExtraLabel: "Ingreso anual / costo",
    faqs: [
      {
        pregunta: "¿Este cálculo considera gratuidad o becas estatales?",
        respuesta:
          "No. Esta vista compara el costo completo de arancel mediano y duración real para medir el esfuerzo financiero de lista. Si cuentas con gratuidad, usa la calculadora de retorno para fijar tu arancel en $0.",
      },
      {
        pregunta: "¿Por qué se usa la duración real y no la duración formal?",
        respuesta:
          "Porque en Chile muchas carreras se extienden más semestres que su duración formal. Multiplicar por la duración real refleja de manera más honesta el desembolso efectivo de estudiar.",
      },
    ],
  },
  "baratas-con-buena-empleabilidad": {
    slug: "baratas-con-buena-empleabilidad",
    tituloCorto: "Baratas con buena empleabilidad",
    h1: "Carreras más económicas con alta empleabilidad en Chile",
    h1Marcador: "alta empleabilidad",
    titleSeo: "Carreras baratas con alta empleabilidad en Chile 2026",
    descriptionSeo:
      "Carreras en el cuartil más económico de arancel 2026 de su tipo de institución y en el 25 % superior de empleabilidad al 1.er año, según mifuturo.cl.",
    metodologia: [
      "Para identificar opciones accesibles con sólida inserción laboral inicial, esta vista evalúa por separado cada tipo de institución (Universidades, Institutos Profesionales y CFT).",
      "Califican únicamente las carreras cuyo arancel anual mediano 2026 se ubica en el 25 % más bajo (cuartil Q1) de su tipo de institución y cuya empleabilidad al primer año se sitúa en el 25 % más alto (percentil 75 o superior) de ese mismo segmento.",
      "Las filas seleccionadas se ordenan de menor a mayor arancel anual mediano, permitiendo revisar al mismo tiempo su ingreso bruto al cuarto año y su duración real promedio.",
    ],
    queryFiltros: "?orden=arancel_asc",
    columnaExtraLabel: "Arancel mediano",
    faqs: [
      {
        pregunta: "¿Qué significa estar en el cuartil más bajo de arancel?",
        respuesta:
          "Significa que el arancel anual mediano 2026 de la carrera es menor o igual al 25 % de las carreras más económicas dentro de su mismo tipo de institución (U, IP o CFT).",
      },
      {
        pregunta: "¿Los aranceles pueden bajar con becas o gratuidad?",
        respuesta:
          "Sí. Los valores corresponden al arancel anual referencial de lista informado por las instituciones al SIES para la oferta 2026 y no descuentan beneficios estudiantiles.",
      },
    ],
  },
  "crecieron-en-sueldo-real": {
    slug: "crecieron-en-sueldo-real",
    tituloCorto: "Crecieron en sueldo real",
    h1: "Carreras que más crecieron en sueldo real en Chile (2020–2024)",
    h1Marcador: "más crecieron en sueldo real",
    titleSeo: "Carreras que más subieron de sueldo real en Chile 2020-2024",
    descriptionSeo:
      "Carreras con mayor aumento real del ingreso bruto al 4.º año entre los años de ingreso 2020 y 2024 en Chile, en pesos constantes de septiembre de 2025.",
    metodologia: [
      "El archivo Estadísticas por Carrera del SIES publica la serie del ingreso promedio al cuarto año de titulación para los años de cálculo 2020, 2021, 2022, 2023 y 2024, toda ya reajustada por IPC a pesos constantes de septiembre de 2025.",
      "Esta vista incluye únicamente carreras con datos válidos en los cinco años de la serie y al menos 100 titulados en 2024, evitando distorsiones por cohortes pequeñas o series incompletas.",
      "El crecimiento refleja la variación real observada entre las cohortes medidas en 2020 y 2024, no una proyección garantizada de aumentos futuros para quien ingresa hoy.",
    ],
    queryFiltros: "?orden=crec&min_titulados=100",
    columnaExtraLabel: "Var. real 2020–2024",
    faqs: [
      {
        pregunta: "¿La variación 2020–2024 ya descuenta la inflación?",
        respuesta:
          "Sí. Todos los montos de la serie histórica del SIES vienen expresados en pesos reales de septiembre de 2025, por lo que el porcentaje muestra crecimiento por sobre el IPC.",
      },
      {
        pregunta: "¿Por qué se excluyen carreras con años sin información?",
        respuesta:
          "Cuando una cohorte no alcanza el mínimo de 25 casos exigido por el SIES, aparece como sin información (s/i). Esta vista exige los cinco puntos completos para no comparar períodos desiguales.",
      },
    ],
  },
  "mejor-pagadas-vespertinas": {
    slug: "mejor-pagadas-vespertinas",
    tituloCorto: "Vespertinas mejor pagadas",
    h1: "Carreras vespertinas mejor pagadas en Chile",
    h1Marcador: "vespertinas mejor pagadas",
    titleSeo: "Carreras vespertinas mejor pagadas en Chile 2026",
    descriptionSeo:
      "Ranking de carreras con oferta vespertina en Chile en 2026 ordenadas por ingreso bruto al 4.º año según mifuturo.cl (Mineduc), con advertencia metodológica.",
    metodologia: [
      "Esta vista cruza el Buscador de Carreras 2026 con las Estadísticas por Carrera del SIES para listar las carreras genéricas que cuentan con al menos un programa en jornada Vespertina en 2026.",
      "Aviso metodológico obligatorio: el Servicio de Impuestos Internos (SII) no autoriza al Mineduc a desagregar los ingresos de titulados por jornada ni por región debido a restricciones estadísticas de mínimo de casos. Por ello, el sueldo mostrado corresponde al promedio nacional de la carrera genérica en ese tipo de institución.",
      "De todas formas, identificar qué carreras de altos ingresos ofrecen matrícula vespertina es clave para quienes trabajan mientras estudian.",
    ],
    queryFiltros: "?jornada=Vespertina&orden=ing4",
    columnaExtraLabel: "Ingreso 4.º año",
    faqs: [
      {
        pregunta: "¿El sueldo mostrado corresponde solo a titulados de jornada vespertina?",
        respuesta:
          "No. Mifuturo.cl no publica ingresos separados por jornada porque el SII no permite cruzar esa desagregación. La cifra corresponde al ingreso promedio de la carrera genérica en ese tipo de institución.",
      },
      {
        pregunta: "¿Dónde puedo ver qué universidades o IP dictan la carrera en vespertino?",
        respuesta:
          "En la ficha de cada carrera o activando el filtro de jornada Vespertina en el ranking principal de /datos/carreras.",
      },
    ],
  },
};

export const PRESET_SLUGS = Object.keys(PRESETS_MAP) as PresetSlug[];

export interface PresetRow extends RankingItem {
  valorMetrica: number | null;
  textoMetrica: string;
}

function ratioSueldoArancel(item: RankingItem): number | null {
  if (!item.ing4 || !item.arancel_med || !item.dur_real || item.arancel_med <= 0 || item.dur_real <= 0) {
    return null;
  }
  const costoTotal = item.arancel_med * (item.dur_real / 2) + (item.costo_tit_med ?? 0);
  if (costoTotal <= 0) return null;
  return (item.ing4 * 12) / costoTotal;
}

function cuantil(arr: number[], q: number): number | null {
  if (arr.length === 0) return null;
  const s = [...arr].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return s[base + 1] !== undefined ? s[base] + rest * (s[base + 1] - s[base]) : s[base];
}

export function filasPreset(slug: PresetSlug, tipoFiltro?: TipoIesKey): PresetRow[] {
  const ranking = getRankingCarreras();
  const base = tipoFiltro ? ranking.filter((r) => r.tipo === tipoFiltro) : ranking;

  if (slug === "mejor-pagadas") {
    return base
      .filter((r) => r.ing4 !== null)
      .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
      .slice(0, 25)
      .map((r) => ({ ...r, valorMetrica: r.ing4, textoMetrica: pesos(r.ing4) }));
  }

  if (slug === "mas-empleabilidad") {
    return base
      .filter((r) => r.emp1 !== null && (r.titulados ?? 0) >= 100)
      .sort((a, b) => (b.emp1 ?? 0) - (a.emp1 ?? 0) || (b.ing4 ?? 0) - (a.ing4 ?? 0))
      .slice(0, 25)
      .map((r) => ({ ...r, valorMetrica: r.emp1, textoMetrica: porcentaje(r.emp1) }));
  }

  if (slug === "mejor-sueldo-por-arancel") {
    return base
      .map((r) => ({ item: r, ratio: ratioSueldoArancel(r) }))
      .filter((x): x is { item: RankingItem; ratio: number } => x.ratio !== null)
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 25)
      .map(({ item, ratio }) => ({
        ...item,
        valorMetrica: ratio,
        textoMetrica: `$${ratio.toFixed(2).replace(".", ",")} / $1`,
      }));
  }

  if (slug === "baratas-con-buena-empleabilidad") {
    const califican: RankingItem[] = [];
    for (const tk of ["u", "ip", "cft"] as const) {
      if (tipoFiltro && tk !== tipoFiltro) continue;
      const seg = ranking.filter((r) => r.tipo === tk);
      const aranceles = seg.map((r) => r.arancel_med).filter((x): x is number => x !== null && x > 0);
      const emps = seg.map((r) => r.emp1).filter((x): x is number => x !== null);
      const q25Arancel = cuantil(aranceles, 0.25);
      const q75Emp = cuantil(emps, 0.75);
      if (q25Arancel === null || q75Emp === null) continue;
      for (const r of seg) {
        if (r.arancel_med !== null && r.arancel_med <= q25Arancel && r.emp1 !== null && r.emp1 >= q75Emp) {
          califican.push(r);
        }
      }
    }
    return califican
      .sort((a, b) => (a.arancel_med ?? Infinity) - (b.arancel_med ?? Infinity))
      .slice(0, 25)
      .map((r) => ({ ...r, valorMetrica: r.arancel_med, textoMetrica: pesos(r.arancel_med) }));
  }

  if (slug === "crecieron-en-sueldo-real") {
    return base
      .filter((r) => r.yoy_real_4 !== null && (r.titulados ?? 0) >= 100)
      .sort((a, b) => (b.yoy_real_4 ?? -99) - (a.yoy_real_4 ?? -99))
      .slice(0, 25)
      .map((r) => ({
        ...r,
        valorMetrica: r.yoy_real_4,
        textoMetrica: variacionPorcentual(r.yoy_real_4),
      }));
  }

  // mejor-pagadas-vespertinas
  return base
    .filter((r) => r.jornadas.includes("Vespertina") && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 25)
    .map((r) => ({ ...r, valorMetrica: r.ing4, textoMetrica: pesos(r.ing4) }));
}

export function resumenPreset(slug: PresetSlug, filas: PresetRow[]): string[] {
  const def = PRESETS_MAP[slug];
  if (filas.length === 0) return [def.descriptionSeo];
  const top = filas[0];
  const medIng = mediana(filas.map((f) => f.ing4).filter((x): x is number => x !== null));
  const medEmp = filas.map((f) => f.emp1).filter((x): x is number => x !== null);
  const avgEmp = medEmp.length ? medEmp.reduce((a, b) => a + b, 0) / medEmp.length : null;

  return [
    `Según mifuturo.cl (Mineduc), en la vista «${def.tituloCorto}» lidera ${top.nombre} (${TIPO_ETIQUETAS[top.tipo].plural}), con ${top.textoMetrica} en ${def.columnaExtraLabel.toLowerCase()} y un ingreso promedio al 4.º año de ${millonesCorto(top.ing4)} (pesos de septiembre de 2025).`,
    `El grupo de las ${filas.length} carreras destacadas registra una mediana de ingreso bruto de ${pesos(medIng)} al cuarto año${avgEmp !== null ? ` y una empleabilidad promedio al primer año de ${porcentaje(avgEmp)}` : ""}.`,
    `Todos los valores provienen de las bases oficiales SIES 2025–2026 y se presentan sin ajustes causales: la posición refleja promedios históricos de titulados.`,
  ];
}
