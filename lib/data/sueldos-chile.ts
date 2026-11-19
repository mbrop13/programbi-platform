export interface SueldoReferenciaChile {
  id: string;
  fuente: string;
  url: string;
  cargo: string;
  montoClp: number | null;
  rangoLabel: string;
  muestraOMetodo: string;
  tipoDato: "Sueldo pretendido" | "Promedio avisos" | "Aviso específico" | "Bandas en avisos tech";
  fechaConsulta: string;
  nota: string;
}

export interface StackProgressionStage {
  id: string;
  etapa: string;
  herramientas: string[];
  quePidenLosAvisos: string;
  referenciaAsociada: string;
  siguientePasoLabel: string;
  siguientePasoHref: string;
}

export interface SueldoChileFaq {
  q: string;
  a: string;
}

export const DISCLAIMER_LEGAL =
  "Estimación referencial; no reemplaza liquidación legal ni considera topes imponibles en UF, asignaciones no imponibles (colación/movilización), gratificación ni cargas familiares.";

export const REFERENCIAS_SUELDO_CHILE: SueldoReferenciaChile[] = [
  {
    id: "chiletrabajos-datos",
    fuente: "Chiletrabajos",
    url: "https://www.chiletrabajos.cl/sueldos/analista/datos",
    cargo: "Analista de Datos",
    montoClp: 979205,
    rangoLabel: "$906.243 – $1.045.880",
    muestraOMetodo: "58.686 postulaciones (últimos 12 meses)",
    tipoDato: "Sueldo pretendido",
    fechaConsulta: "4 nov 2026",
    nota: "Mide lo que piden los postulantes al postular, no necesariamente el sueldo pagado por las empresas.",
  },
  {
    id: "indeed-bi",
    fuente: "Indeed Chile",
    url: "https://cl.indeed.com/career/analista-bi/salaries",
    cargo: "Analista BI",
    montoClp: 1035380,
    rangoLabel: "Promedio portal",
    muestraOMetodo: "Avisos y reportes publicados en el portal",
    tipoDato: "Promedio avisos",
    fechaConsulta: "4 nov 2026",
    nota: "La cifra varía según los avisos activos publicados en la plataforma.",
  },
  {
    id: "chiletrabajos-bi",
    fuente: "Chiletrabajos",
    url: "https://www.chiletrabajos.cl/sueldos/analista/bi",
    cargo: "Analista BI",
    montoClp: 1147226,
    rangoLabel: "$990.898 – $1.425.339",
    muestraOMetodo: "16.005 postulaciones (últimos 12 meses)",
    tipoDato: "Sueldo pretendido",
    fechaConsulta: "Noviembre 2026",
    nota: "El promedio pretendido de Analista BI supera al de Analista de Datos por el peso de Power BI y SQL en el perfil.",
  },
  {
    id: "chiletrabajos-aviso-sap",
    fuente: "Chiletrabajos (Aviso 3787550)",
    url: "https://www.chiletrabajos.cl/trabajo/analista-power-bi-san-bernardo-3787550",
    cargo: "Analista Power BI (San Bernardo)",
    montoClp: 1500000,
    rangoLabel: "Oferta publicada (aviso expirado)",
    muestraOMetodo: "Aviso real publicado en feb 2026",
    tipoDato: "Aviso específico",
    fechaConsulta: "Febrero 2026 (citado nov 2026)",
    nota: "Pedía 3 años de experiencia con Power BI, SQL y deseable ERP SAP; ilustra cómo el stack técnico eleva la renta ofrecida.",
  },
  {
    id: "getonboard-tech",
    fuente: "GetOnBoard",
    url: "https://www.getonboard.com/empleos/data-analytics",
    cargo: "Data & Analytics (tech)",
    montoClp: null,
    rangoLabel: "Bandas publicadas por aviso",
    muestraOMetodo: "Ofertas tech con rango salarial visible",
    tipoDato: "Bandas en avisos tech",
    fechaConsulta: "Referencia continua",
    nota: "Útil para revisar bandas reales vigentes en empresas de tecnología, fintech y retail digital (muchas veces en CLP o USD).",
  },
];

export const BENCHMARK_BAR_ITEMS = [
  {
    id: "ct-datos",
    label: "Chiletrabajos · Analista Datos (pretendido)",
    monto: 979205,
  },
  {
    id: "indeed-bi",
    label: "Indeed Chile · Analista BI (promedio)",
    monto: 1035380,
  },
  {
    id: "ct-bi",
    label: "Chiletrabajos · Analista BI (pretendido)",
    monto: 1147226,
  },
  {
    id: "aviso-pbi-sql",
    label: "Aviso real · Analista Power BI + SQL + SAP",
    monto: 1500000,
  },
] as const;

export const STACK_PROGRESSION: StackProgressionStage[] = [
  {
    id: "excel-operativo",
    etapa: "1. Excel operativo",
    herramientas: ["Tablas dinámicas", "BUSCARV / BUSCARX", "Reportes manuales"],
    quePidenLosAvisos:
      "Asistente de control de gestión, analista operativo o administrativo contable. Reportes semanales armados a mano desde el ERP.",
    referenciaAsociada: "Zona base de Analista Datos ($906.243 – $979.205 ref. pretendido).",
    siguientePasoLabel: "Dar el salto a Power BI",
    siguientePasoHref: "/cursos/power-bi",
  },
  {
    id: "power-bi-dax",
    etapa: "2. Power BI + DAX",
    herramientas: ["Power Query (ETL)", "Modelo estrella", "DAX (CALCULATE, Time Intelligence)"],
    quePidenLosAvisos:
      "Analista BI o Control de Gestión BI. Automatizar cierres mensuales, tableros gerenciales y métricas de margen o stock.",
    referenciaAsociada: "Analista BI ($1.035.380 Indeed – $1.147.226 pretendido Chiletrabajos).",
    siguientePasoLabel: "Sumar SQL Server",
    siguientePasoHref: "/cursos/sql-server",
  },
  {
    id: "sql-power-bi",
    etapa: "3. SQL + Power BI",
    herramientas: ["Consultas SQL (JOIN, GROUP BY)", "Power BI + DAX", "Integración ERP / SAP"],
    quePidenLosAvisos:
      "Analista Power BI / BI con 2–3 años de experiencia que extrae sus propios datos sin depender de TI (ej. aviso $1.500.000 con SQL + SAP).",
    referenciaAsociada: "Tramo superior de avisos técnicos ($1.425.339 – $1.500.000+ ref.).",
    siguientePasoLabel: "Validar nivel con PL-300",
    siguientePasoHref: "/simulador-pl-300",
  },
  {
    id: "full-stack-datos",
    etapa: "4. SQL + Power BI + Python",
    herramientas: ["SQL Server", "Power BI + DAX", "Python (Pandas) y automatización"],
    quePidenLosAvisos:
      "Analista de Datos completo en banca, minería, retail y empresas tech (GetOnBoard): limpieza masiva, modelado y tableros productivos.",
    referenciaAsociada: "Acceso a bandas tech publicadas en GetOnBoard y cargos senior.",
    siguientePasoLabel: "Ver programa completo",
    siguientePasoHref: "/cursos/analisis-de-datos",
  },
];

export interface CalculoSueldoInput {
  monto: number;
  afpPct: number;
  saludPct: number;
  tipoContrato: "indefinido" | "plazo_fijo";
  valorUtm: number;
}

export interface CalculoSueldoResult {
  bruto: number;
  liquido: number;
  afp: number;
  salud: number;
  afc: number;
  baseTributable: number;
  impuestoUnico: number;
  totalDescuentos: number;
  tasaDescuentoPct: number;
}

/**
 * Tramos legales del Impuesto Único de Segunda Categoría en UTM (SII Chile).
 * Cada tramo indica límite superior en UTM, factor marginal y rebaja en UTM.
 */
const TRAMOS_IMPUESTO_UNICO_UTM: { hastaUtm: number; factor: number; rebajaUtm: number }[] = [
  { hastaUtm: 13.5, factor: 0, rebajaUtm: 0 },
  { hastaUtm: 30, factor: 0.04, rebajaUtm: 0.54 },
  { hastaUtm: 50, factor: 0.08, rebajaUtm: 1.74 },
  { hastaUtm: 70, factor: 0.135, rebajaUtm: 4.49 },
  { hastaUtm: 90, factor: 0.23, rebajaUtm: 11.14 },
  { hastaUtm: 120, factor: 0.304, rebajaUtm: 17.8 },
  { hastaUtm: 310, factor: 0.35, rebajaUtm: 23.32 },
  { hastaUtm: Infinity, factor: 0.4, rebajaUtm: 38.82 },
];

export const DEFAULT_AFP_PCT = 11.44;
export const DEFAULT_SALUD_PCT = 7;
export const DEFAULT_AFC_INDEFINIDO_PCT = 0.6;
export const DEFAULT_UTM_CLP = 66628;

export function calcularImpuestoUnicoClp(baseTributableClp: number, valorUtm: number): number {
  if (baseTributableClp <= 0 || valorUtm <= 0) return 0;
  const baseEnUtm = baseTributableClp / valorUtm;
  const tramo =
    TRAMOS_IMPUESTO_UNICO_UTM.find((t) => baseEnUtm <= t.hastaUtm) ??
    TRAMOS_IMPUESTO_UNICO_UTM[TRAMOS_IMPUESTO_UNICO_UTM.length - 1];
  const impuestoUtm = Math.max(0, baseEnUtm * tramo.factor - tramo.rebajaUtm);
  return Math.round(impuestoUtm * valorUtm);
}

/**
 * Calcula una estimación referencial de Sueldo Líquido desde Bruto en Chile.
 */
export function calcularBrutoALiquido(input: CalculoSueldoInput): CalculoSueldoResult {
  const bruto = Math.max(0, Math.round(input.monto));
  const afp = Math.round(bruto * (Math.max(0, input.afpPct) / 100));
  const salud = Math.round(bruto * (Math.max(0, input.saludPct) / 100));
  const afcPct = input.tipoContrato === "indefinido" ? DEFAULT_AFC_INDEFINIDO_PCT : 0;
  const afc = Math.round(bruto * (afcPct / 100));

  const baseTributable = Math.max(0, bruto - afp - salud - afc);
  const impuestoUnico = calcularImpuestoUnicoClp(baseTributable, input.valorUtm);
  const totalDescuentos = afp + salud + afc + impuestoUnico;
  const liquido = Math.max(0, bruto - totalDescuentos);
  const tasaDescuentoPct = bruto > 0 ? (totalDescuentos / bruto) * 100 : 0;

  return {
    bruto,
    liquido,
    afp,
    salud,
    afc,
    baseTributable,
    impuestoUnico,
    totalDescuentos,
    tasaDescuentoPct,
  };
}

/**
 * Estima el sueldo bruto aproximado necesario para obtener un sueldo líquido objetivo.
 */
export function estimarBrutoDesdeLiquido(
  liquidoObjetivo: number,
  opciones: Omit<CalculoSueldoInput, "monto">
): CalculoSueldoResult {
  const objetivo = Math.max(0, Math.round(liquidoObjetivo));
  if (objetivo === 0) {
    return calcularBrutoALiquido({ ...opciones, monto: 0 });
  }

  let low = objetivo;
  let high = Math.round(objetivo * 2.2) + 100000;

  for (let i = 0; i < 32; i++) {
    const mid = Math.round((low + high) / 2);
    const res = calcularBrutoALiquido({ ...opciones, monto: mid });
    if (res.liquido < objetivo) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return calcularBrutoALiquido({ ...opciones, monto: high });
}

export function formatClp(valor: number): string {
  const entero = Math.round(Number.isFinite(valor) ? valor : 0);
  return "$" + entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const SUELDOS_CHILE_FAQS: SueldoChileFaq[] = [
  {
    q: "¿Cuánto gana un analista de datos o BI en Chile según fuentes públicas?",
    a: "Las referencias públicas consultadas en noviembre de 2026 muestran un sueldo pretendido promedio de $979.205 CLP al mes para Analista de Datos en Chiletrabajos (rango $906.243–$1.045.880), $1.035.380 CLP para Analista BI en Indeed Chile y $1.147.226 CLP pretendido para Analista BI en Chiletrabajos (rango $990.898–$1.425.339). Avisos con Power BI + SQL y 3 años de experiencia han ofrecido $1.500.000 CLP.",
  },
  {
    q: "¿Cuál es la diferencia entre sueldo pretendido y sueldo ofrecido?",
    a: "El sueldo pretendido (como el índice de Chiletrabajos) refleja lo que los postulantes declaran que desean ganar al postular. El sueldo ofrecido en avisos (o bandas visibles en GetOnBoard) corresponde a lo que presupuesta la empresa contratante. Conviene usar ambos como referencia y no como cifra garantizada.",
  },
  {
    q: "¿Por qué un Analista BI suele ganar más que un Analista de Datos junior solo con Excel?",
    a: "En los avisos chilenos, el título de Analista BI suele exigir modelamiento estrella, medidas DAX en Power BI y extracción directa con SQL desde ERPs como SAP, mientras que muchos cargos iniciales de datos se limitan a planillas Excel operativas.",
  },
  {
    q: "¿Los sueldos de las ofertas en Chile se publican en bruto o en líquido?",
    a: "Depende del portal y la empresa. En consultoras y empresas grandes es común negociar en renta bruta (antes de AFP, Salud, AFC e Impuesto Único), mientras que muchos avisos de pymes y postulaciones en Chiletrabajos se expresan en sueldo líquido. Aclara siempre este punto en la primera entrevista.",
  },
  {
    q: "¿Cómo se calculan los descuentos legales aproximados en Chile?",
    a: "Sobre la renta imponible se descuenta cotización obligatoria de AFP (~11,44% referencial según AFP, compuesto por 10% + comisión), Salud (7% en Fonasa o el plan pactado en Isapre), Seguro de Cesantía (0,6% en contrato indefinido; 0% para el trabajador en plazo fijo) y el Impuesto Único de Segunda Categoría si la base tributable supera 13,5 UTM.",
  },
  {
    q: "¿Qué herramientas aumentan más rápido la empleabilidad en Chile?",
    a: "La combinación más repetida en avisos chilenos es Power BI + DAX junto con SQL Server (consultas y cruces). Sumar Python (Pandas) y preparación para la certificación PL-300 abre acceso a roles mejor pagados en banca, minería, retail y tecnología.",
  },
  {
    q: "¿Esta calculadora reemplaza una liquidación de sueldo oficial?",
    a: "No. Es una estimación referencial para comparar ofertas brutas y líquidas. Una liquidación real depende de tu AFP exacta, plan de Isapre en UF, topes imponibles legales, asignaciones no imponibles (colación, movilización) y gratificación legal o pactada.",
  },
];
