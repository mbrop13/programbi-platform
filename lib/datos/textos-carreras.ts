import {
  getCarreras,
  getInstitucionesCarrera,
  getMetaCarreras,
  getRankingCarreras,
  mediana,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
  type CarreraRecord,
  type CarreraTipoData,
  type RankingItem,
  type TipoIesKey,
} from "./carreras";
import {
  anosDesdeSemestres,
  entero,
  pesos,
  porcentaje,
  semestres,
  variacionPorcentual,
} from "./formato";

export interface PreguntaFaq {
  pregunta: string;
  respuesta: string;
}

export interface ContextoComparativoFicha {
  tipo: TipoIesKey;
  data: CarreraTipoData;
  posicionTipo: number;
  totalTipo: number;
  medianaTipo: number | null;
  medianaArea: number | null;
  diffMedianaAreaPct: number | null;
  diffMedianaTotalPct: number | null;
  anteriorEnRanking: RankingItem | null;
  siguienteEnRanking: RankingItem | null;
}

export function contextoComparativoFicha(
  carrera: CarreraRecord,
  tipoForzado?: TipoIesKey
): ContextoComparativoFicha | null {
  const principal = tipoPrincipalDeCarrera(carrera);
  const tipo = tipoForzado ?? principal?.key;
  const data = tipo ? carrera.tipos[tipo] : undefined;
  if (!tipo || !data) return null;

  const ranking = getRankingCarreras();
  const delTipo = ranking
    .filter((r) => r.tipo === tipo && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0));

  const idx = delTipo.findIndex((r) => r.slug === carrera.slug);
  const posicionTipo = idx >= 0 ? idx + 1 : delTipo.length;
  const medianaTipo = mediana(delTipo.map((r) => r.ing4).filter((x): x is number => x !== null));

  const delArea = delTipo.filter((r) => r.area === carrera.area);
  const medianaArea = mediana(delArea.map((r) => r.ing4).filter((x): x is number => x !== null));

  const ing4 = data.ing[3];
  const diffMedianaAreaPct =
    ing4 !== null && medianaArea ? Math.round(((ing4 - medianaArea) / medianaArea) * 100) : null;
  const diffMedianaTotalPct =
    ing4 !== null && medianaTipo ? Math.round(((ing4 - medianaTipo) / medianaTipo) * 100) : null;

  return {
    tipo,
    data,
    posicionTipo,
    totalTipo: delTipo.length,
    medianaTipo,
    medianaArea,
    diffMedianaAreaPct,
    diffMedianaTotalPct,
    anteriorEnRanking: idx > 0 ? delTipo[idx - 1] : null,
    siguienteEnRanking: idx >= 0 && idx < delTipo.length - 1 ? delTipo[idx + 1] : null,
  };
}

/**
 * Bloque "En resumen" citable para el hub `/datos/carreras` (3–5 frases autocontenidas).
 */
export function resumenHubCarreras(): string[] {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const carreras = getCarreras();

  const topU = ranking.filter((r) => r.tipo === "u" && r.ing4 !== null).sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))[0];
  const topIp = ranking.filter((r) => r.tipo === "ip" && r.ing4 !== null).sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))[0];
  const topCft = ranking.filter((r) => r.tipo === "cft" && r.ing4 !== null).sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))[0];

  const topEmp = ranking
    .filter((r) => r.emp1 !== null && (r.titulados ?? 0) >= 100)
    .sort((a, b) => (b.emp1 ?? 0) - (a.emp1 ?? 0))[0];

  const ico = carreras.find((c) => c.slug === "ingenieria-comercial")?.tipos?.u;
  const totalTitulados = ranking.reduce((acc, r) => acc + (r.titulados ?? 0), 0);

  const frases: string[] = [];
  if (topU && topIp && topCft) {
    frases.push(
      `Según mifuturo.cl (Mineduc, edición ${meta.edicion}), los mayores ingresos promedio brutos al 4.º año de titulación en pesos de septiembre de 2025 corresponden a ${topU.nombre} en universidades (${pesos(topU.ing4)}), ${topIp.nombre} en institutos profesionales (${pesos(topIp.ing4)}) y ${topCft.nombre} en centros de formación técnica (${pesos(topCft.ing4)}).`
    );
  }
  if (topEmp) {
    frases.push(
      `Entre las carreras con al menos 100 titulados en 2024, la mayor empleabilidad al primer año se registra en ${topEmp.nombre} (${TIPO_ETIQUETAS[topEmp.tipo].plural}), con ${porcentaje(topEmp.emp1)} de titulados percibiendo ingresos iguales o superiores al sueldo mínimo.`
    );
  }
  if (ico?.pct.p10_5 && ico?.pct.p90_5) {
    frases.push(
      `La dispersión salarial dentro de una misma carrera es amplia: en Ingeniería Comercial (universidades), el 10 % que menos gana al 5.º año percibe hasta ${pesos(ico.pct.p10_5)} brutos mensuales, mientras que el 10 % superior supera los ${pesos(ico.pct.p90_5)}.`
    );
  }
  frases.push(
    `Este observatorio cubre ${meta.conteos.genericas_unicas} carreras genéricas únicas (${meta.conteos.filas_A} combinaciones por tipo de institución), ${entero(totalTitulados)} titulados en 2024 y ${entero(meta.conteos.filas_C)} programas con oferta vigente para 2026.`
  );
  return frases;
}

export function faqsHubCarreras(): PreguntaFaq[] {
  const meta = getMetaCarreras();
  return [
    {
      pregunta: "¿De dónde salen los sueldos y cómo se calculan?",
      respuesta: `Todos los ingresos provienen de Estadísticas por Carrera del SIES (mifuturo.cl, edición ${meta.edicion}), construidas mediante cruces administrativos con el Servicio de Impuestos Internos (SII). Corresponden al promedio anual dividido por 12 de remuneraciones, honorarios y retiros brutos (antes de impuestos), expresados en pesos reales de septiembre de 2025.`,
    },
    {
      pregunta: "¿El promedio incluye a quienes están sin empleo?",
      respuesta:
        "No. Según la metodología oficial del SIES, el cálculo de ingreso promedio considera únicamente a los titulados con información tributaria que perciben ingresos iguales o superiores al sueldo mínimo mensual.",
    },
    {
      pregunta: "¿Qué significa exactamente la empleabilidad en mifuturo.cl?",
      respuesta:
        "Es un proxy: mide el porcentaje de titulados que obtuvo ingresos iguales o superiores al sueldo mínimo al 1.er o 2.º año de titulación. No indica si trabajan en el área de su carrera ni si cuentan con contrato indefinido.",
    },
    {
      pregunta: "¿Por qué la curva de 1.º a 5.º año no es la trayectoria de una misma persona?",
      respuesta:
        "Porque cada columna mide cohortes distintas de titulación en la misma fecha de cálculo (por ejemplo, primer año reúne titulados 2021–2023 y cuarto año reúne titulados 2018–2020). Por eso muestra una foto transversal del mercado.",
    },
    {
      pregunta: "¿Por qué no hay sueldos por región, jornada ni sexo?",
      respuesta:
        "La metodología del Mineduc establece que el SII no autoriza desagregar ingresos por sexo, edad, jornada ni región para resguardar el secreto tributario y los mínimos estadísticos de publicación. El filtro regional y de jornada aplica solo a la oferta de programas.",
    },
    {
      pregunta: "¿Qué diferencia hay entre pesos de septiembre de 2025 y pesos de hoy?",
      respuesta:
        "Los datos oficiales ya vienen reajustados por IPC a septiembre de 2025. El selector «Pesos de hoy» aplica el factor de variación oficial del IPC (INE vía Banco Central) para expresar ese mismo poder de compra al último mes publicado.",
    },
  ];
}

/**
 * Genera el bloque "En resumen" citable de una ficha de carrera.
 */
export function resumenFichaCarrera(carrera: CarreraRecord, ctx: ContextoComparativoFicha): string[] {
  const { data, tipo, posicionTipo, totalTipo, medianaArea, diffMedianaAreaPct } = ctx;
  const meta = getMetaCarreras();
  const tipoLabel = TIPO_ETIQUETAS[tipo].plural.toLowerCase();
  const ing4 = data.ing[3];
  const ing1 = data.ing[0];

  const frases: string[] = [];
  if (ing4 !== null) {
    frases.push(
      `Según mifuturo.cl (Mineduc, edición ${meta.edicion}), ${carrera.nombre} en ${tipoLabel} registra un ingreso bruto mensual promedio de ${pesos(ing4)} al 4.º año de titulación${ing1 !== null ? ` y de ${pesos(ing1)} al 1.er año` : ""}, en pesos de septiembre de 2025.`
    );
  }
  if (data.emp1 !== null) {
    frases.push(
      `En ${tipoLabel}, ocupa el puesto ${posicionTipo} de ${totalTipo} carreras evaluadas por ingreso al 4.º año${diffMedianaAreaPct !== null && medianaArea !== null ? ` (${diffMedianaAreaPct >= 0 ? `+${diffMedianaAreaPct}` : `${diffMedianaAreaPct}`} % frente a la mediana del área ${carrera.area}, de ${pesos(medianaArea)})` : ""}, con una empleabilidad al 1.er año de ${porcentaje(data.emp1)}.`
    );
  }
  if (data.pct.p10_5 !== null && data.pct.p90_5 !== null) {
    frases.push(
      `Al 5.º año de egreso, el 10 % de menores ingresos percibe hasta ${pesos(data.pct.p10_5)} brutos mensuales, mientras que el 10 % superior alcanza desde ${pesos(data.pct.p90_5)} (mediana P50: ${pesos(data.pct.p50_5)}).`
    );
  }
  if (data.variacion.crec_20_24 !== null) {
    frases.push(
      `Entre los años de cálculo 2020 y 2024, el ingreso real al 4.º año varió ${variacionPorcentual(data.variacion.crec_20_24)}${data.variacion.yoy_23_24 !== null ? ` (${variacionPorcentual(data.variacion.yoy_23_24)} entre 2023 y 2024)` : ""}, con una duración real promedio de ${semestres(data.dur_real)}.`
    );
  }
  return frases;
}

/**
 * Genera ≥ 250 palabras de análisis único y determinista por ficha a partir de datos reales,
 * combinando cifras específicas para garantizar similitud < 60 % entre fichas.
 */
export function narrativaUnicaFicha(carrera: CarreraRecord, ctx: ContextoComparativoFicha): string[] {
  const { data, tipo, posicionTipo, totalTipo, medianaTipo, medianaArea, diffMedianaAreaPct, diffMedianaTotalPct } = ctx;
  const instituciones = getInstitucionesCarrera(carrera.slug).filter((i) => i.tipo === tipo);
  const conTramo = instituciones.filter((i) => i.tramo !== null);
  const instAcreditadas = instituciones.filter((i) => i.acred_anos > 0);
  const oferta = data.oferta ?? carrera.oferta;
  const tipoPlural = TIPO_ETIQUETAS[tipo].plural;
  const ing1 = data.ing[0];
  const ing4 = data.ing[3];
  const ing5 = data.ing[4];

  const parrafos: string[] = [];

  // Párrafo 1: Posición salarial y comparación con área y total del sistema
  const brecha1a5 = ing1 && ing5 ? Math.round(((ing5 - ing1) / ing1) * 100) : null;
  parrafos.push(
    `En el panorama de ${tipoPlural.toLowerCase()} en Chile, ${carrera.nombre} integra el área de ${carrera.area} y se ubica en el lugar ${posicionTipo} de ${totalTipo} carreras con información salarial publicada al cuarto año. Su ingreso bruto mensual promedio al cuarto año asciende a ${pesos(ing4)} en pesos de septiembre de 2025${medianaTipo ? `, lo que la posiciona ${diffMedianaTotalPct !== null && diffMedianaTotalPct >= 0 ? `${diffMedianaTotalPct} % por encima` : `${Math.abs(diffMedianaTotalPct ?? 0)} % por debajo`} de la mediana general de ${tipoPlural.toLowerCase()} (${pesos(medianaTipo)})` : ""}. Dentro de ${carrera.area}${medianaArea ? `, donde la mediana sectorial alcanza ${pesos(medianaArea)}, la diferencia observada es de ${diffMedianaAreaPct !== null && diffMedianaAreaPct >= 0 ? `+${diffMedianaAreaPct}` : diffMedianaAreaPct} %` : ""}.${brecha1a5 !== null ? ` Comparando las cohortes medidas al primer año (${pesos(ing1)}) frente a las medidas al quinto año (${pesos(ing5)}), se observa una diferencia de ${brecha1a5 >= 0 ? `+${brecha1a5}` : brecha1a5} % entre egresados recientes y con mayor trayectoria.` : ""}`
  );

  // Párrafo 2: Dispersión (P10-P90), empleabilidad y evolución real
  const ratioDispersion =
    data.pct.p10_5 && data.pct.p90_5 ? (data.pct.p90_5 / data.pct.p10_5).toFixed(1).replace(".", ",") : null;
  parrafos.push(
    `Más allá del promedio, la distribución de ingresos de ${carrera.nombre} muestra la heterogeneidad del mercado laboral chileno: al quinto año, el decil inferior (P10) registra hasta ${pesos(data.pct.p10_5)}, la mediana (P50) marca ${pesos(data.pct.p50_5)} y el decil superior (P90) supera los ${pesos(data.pct.p90_5)}${ratioDispersion ? `, una relación de ${ratioDispersion} veces entre el tramo superior y el inferior` : ""}. En inserción laboral, el ${porcentaje(data.emp1)} de los titulados obtuvo ingresos iguales o superiores al sueldo mínimo durante el primer año${data.emp2 !== null ? ` y el ${porcentaje(data.emp2)} lo hizo al segundo año` : ""}.${data.variacion.crec_20_24 !== null ? ` En la serie histórica ajustada por inflación (2020–2024), el ingreso al cuarto año acumuló una variación real de ${variacionPorcentual(data.variacion.crec_20_24)}${data.variacion.edicion_anterior_yoy_real !== null ? `, mientras que frente a la edición 2024–2025 del SIES ajustada por IPC el cambio real observado es de ${variacionPorcentual(data.variacion.edicion_anterior_yoy_real)}` : ""}.` : ""}`
  );

  // Párrafo 3: Duración real vs formal, retención, titulados y composición
  const excesoSem =
    data.dur_real !== null && data.dur_formal !== null
      ? Math.round((data.dur_real - data.dur_formal) * 10) / 10
      : null;
  const pctMujeres =
    data.titulados.m !== null && data.titulados.t
      ? porcentaje(data.titulados.m / data.titulados.t)
      : null;
  parrafos.push(
    `Respecto de la duración efectiva de los estudios en ${carrera.nombre}, el plan formal promedia ${semestres(data.dur_formal)}, pero los titulados de 2024 demoraron en promedio ${semestres(data.dur_real)} (${anosDesdeSemestres(data.dur_real)})${excesoSem !== null && excesoSem > 0 ? `, es decir, ${semestres(excesoSem)} adicionales sobre el tiempo teórico` : ""}. En la cohorte más reciente se titularon ${entero(data.titulados.t)} personas${pctMujeres ? ` (con ${pctMujeres} de mujeres)` : ""} y la matrícula total 2025 suma ${entero(data.matricula.total)} estudiantes${data.retencion.r1 !== null ? `, con una retención de primer año de ${porcentaje(data.retencion.r1)}` : ""}${data.retencion.r2 !== null ? ` y de segundo año de ${porcentaje(data.retencion.r2)}` : ""}.${data.origen.subvencionado !== null ? ` Según dependencia del colegio de origen, el ${porcentaje(data.origen.subvencionado)} proviene de establecimientos particulares subvencionados, el ${porcentaje(data.origen.municipal)} de liceos municipales o SLEP y el ${porcentaje(data.origen.pagado)} de colegios particulares pagados.` : ""}`
  );

  // Párrafo 4: Oferta 2026, aranceles, regiones e instituciones
  if (oferta && oferta.programas > 0) {
    parrafos.push(
      `Para el proceso de admisión, el Buscador de Carreras 2025–2026 del Mineduc registra ${entero(oferta.programas)} programas activos de ${carrera.nombre} en ${entero(oferta.instituciones)} instituciones a lo largo de ${oferta.regiones.length} ${oferta.regiones.length === 1 ? "región" : "regiones"} de Chile (${oferta.regiones.slice(0, 5).join(", ")}${oferta.regiones.length > 5 ? `, entre otras` : ""}).${oferta.arancel ? ` Los aranceles anuales 2026 publicados oscilan entre ${pesos(oferta.arancel.min)} y ${pesos(oferta.arancel.max)}, con una mediana de ${pesos(oferta.arancel.med)}${oferta.costo_titulacion_med ? ` y un costo de titulación mediano de ${pesos(oferta.costo_titulacion_med)}` : ""}.` : ""}${conTramo.length > 0 ? ` Al revisar el detalle por casa de estudios, ${conTramo.length} programas institucionales cuentan con tramo de ingresos reportado y ${instAcreditadas.length} corresponden a instituciones acreditadas ante la CNA al 30 de octubre de 2025.` : ""}`
    );
  }

  return parrafos;
}

export function faqsFichaCarrera(carrera: CarreraRecord, ctx: ContextoComparativoFicha): PreguntaFaq[] {
  const { data, tipo } = ctx;
  const oferta = data.oferta ?? carrera.oferta;
  const tipoLabel = TIPO_ETIQUETAS[tipo].plural.toLowerCase();

  return [
    {
      pregunta: `¿Cuánto gana en promedio un titulado de ${carrera.nombre} al salir?`,
      respuesta: data.ing[0]
        ? `Al primer año de titulación en ${tipoLabel}, el ingreso bruto mensual promedio de ${carrera.nombre} es de ${pesos(data.ing[0])} (pesos de septiembre de 2025). El 25 % inferior parte bajo ${pesos(data.pct.p25_1)} y el 25 % superior supera ${pesos(data.pct.p75_1)}.`
        : `Mifuturo.cl no publica promedio al primer año para ${carrera.nombre} en ${tipoLabel} cuando la cohorte no alcanza el mínimo de 50 casos.`,
    },
    {
      pregunta: `¿Cuánto sube el ingreso de ${carrera.nombre} al quinto año?`,
      respuesta: data.ing[4]
        ? `El promedio bruto al 5.º año es de ${pesos(data.ing[4])} mensuales (mediana P50: ${pesos(data.pct.p50_5)}). El rango entre el 10 % inferior y el 10 % superior va desde ${pesos(data.pct.p10_5)} hasta ${pesos(data.pct.p90_5)}. Estas cifras corresponden a cohortes distintas medidas en el mismo período.`
        : `No hay cifra suficiente publicada al 5.º año para este segmento en la edición vigente.`,
    },
    {
      pregunta: `¿Cuál es la empleabilidad real de ${carrera.nombre}?`,
      respuesta: data.emp1 !== null
        ? `La empleabilidad oficial al 1.er año es de ${porcentaje(data.emp1)}${data.emp2 !== null ? ` y al 2.º año alcanza ${porcentaje(data.emp2)}` : ""}. Este indicador mide el porcentaje de titulados que obtiene ingresos iguales o superiores al sueldo mínimo; no verifica si trabajan en su área.`
        : `La edición vigente no publica porcentaje de empleabilidad por insuficiencia de casos en este segmento.`,
    },
    {
      pregunta: `¿Cuánto dura realmente estudiar ${carrera.nombre} en Chile?`,
      respuesta:
        data.dur_formal !== null && data.dur_real !== null
          ? `Aunque la duración formal promedio es de ${semestres(data.dur_formal)}, la duración real de los titulados 2024 fue de ${semestres(data.dur_real)} (${anosDesdeSemestres(data.dur_real)}).`
          : `La duración formal de los programas publicados puede consultarse en la tabla de oferta de esta página.`,
    },
    {
      pregunta: `¿Cuánto cuesta estudiar ${carrera.nombre} en 2026?`,
      respuesta: oferta?.arancel
        ? `Según el Buscador de Carreras 2026, el arancel anual mediano es de ${pesos(oferta.arancel.med)}, con un rango entre ${pesos(oferta.arancel.min)} y ${pesos(oferta.arancel.max)} según institución, sede y jornada.${oferta.costo_titulacion_med ? ` El costo de titulación mediano es de ${pesos(oferta.costo_titulacion_med)}.` : ""}`
        : `Revisa los aranceles actualizados directamente en cada institución o en mifuturo.cl.`,
    },
  ];
}
