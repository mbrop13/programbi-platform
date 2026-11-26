import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_COLOMBIA_2026 } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "cesantias-2026",
  pais: "co",
  title: "Cesantías 2026 en Colombia: cálculo en Excel y fechas",
  meta: "Calcula las cesantías 2026 en Excel para Colombia: SMMLV $1.750.905, auxilio $249.095, fórmula con DIAS360 y plazo de consignación 14 de febrero.",
  h1: "Cómo calcular las cesantías en Excel en Colombia (2026)",
  subtitle:
    "Prepara tu archivo de Excel con hoja Parametros (SMMLV $1.750.905 y auxilio $249.095), cálculo de días laborados con DIAS360, validación de tope de 2 SMMLV y control del plazo de consignación al fondo hasta el 14 de febrero.",
  keywordPrincipal: "cesantias 2026 colombia excel",
  keywords: [
    "cesantias 2026 colombia excel",
    "como calcular cesantias en excel",
    "fecha consignacion cesantias 2026",
    "formula cesantias excel colombia",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Un modelo en Excel con hoja Parametros y cálculo automático de cesantías anuales o proporcionales listo para consignar al fondo antes del 14 de febrero.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "20 minutos",
    bullets: [
      "Hoja Parametros con SMMLV 2026 ($1.750.905), auxilio de transporte ($249.095) y tope de 2 SMMLV ($3.501.810).",
      "Cálculo de días del año con DIAS360 limitado a 360 días.",
      "Fórmula de cesantías con auxilio condicional en español (;) e inglés (,).",
      "Plantilla descargable en .xlsx y enlace directo al cálculo de intereses de cesantías.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Norma y plazo 14 feb",
      resumen: "Revisa base salarial, auxilio de transporte y plazo de consignación al fondo.",
      anchorId: "reglas-cesantias-2026",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centraliza SMMLV 2026, auxilio de transporte y base de 360 días.",
      anchorId: "hoja-parametros-cesantias",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Días y fórmula",
      resumen: "Calcula días laborados con DIAS360 y aplica (Base * Días) / 360.",
      anchorId: "formula-cesantias-excel",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Validación y fondo",
      resumen: "Comprueba ejemplos 2026 y prepara la planilla de consignación.",
      anchorId: "validacion-cesantias-2026",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o Excel Web.",
      "Salario mensual, fecha de ingreso y fecha de corte (31 de diciembre o fecha de terminación).",
      "Cifras oficiales 2026: SMMLV $1.750.905 y auxilio de transporte $249.095.",
    ],
    compatibilidadMacWeb:
      "Todas las funciones empleadas (SI, DIAS360, MIN, MAX, REDONDEAR) operan de manera idéntica en Windows, macOS y Excel Web.",
    avisoEducativo:
      "Guía práctica educativa. Si el trabajador tuvo variación salarial en los últimos tres meses, recuerda promediar el salario del último año según el artículo 253 del Código Sustantivo del Trabajo.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Parámetros laborales MinTrabajo 2026",
  ],
  insumosHowTo: [
    "Salario base mensual y fecha de ingreso",
    "Fecha de corte del período",
  ],
  secciones: [
    {
      id: "reglas-cesantias-2026",
      titulo: "Base de cálculo y plazo de consignación (14 de febrero)",
      esPasoHowTo: true,
      resumenHowTo:
        "Identifica la base de cesantías (un mes de salario por año laborado más auxilio si aplica) y el plazo máximo de consignación al fondo: 14 de febrero.",
      parrafos: [
        "Las cesantías corresponden a un mes de salario por cada año de servicio y proporcionalmente por fracciones de año (artículo 249 del Código Sustantivo del Trabajo). Se liquidan con corte al 31 de diciembre y deben consignarse en el fondo de cesantías elegido por el trabajador a más tardar el 14 de febrero del año siguiente.",
        "Cuando el trabajador devenga hasta 2 SMMLV ($3.501.810 COP en 2026), el auxilio de transporte ($249.095 COP) forma parte integral de la base para liquidar cesantías. Si gana más de 2 SMMLV, se calcula únicamente sobre el salario.",
      ],
      tabla: {
        caption: "Calendario de cesantías e intereses en Colombia",
        encabezados: ["Obligación", "Fecha límite", "Destino"],
        filas: [
          ["Corte de liquidación anual", "31 de diciembre", "Cálculo contable de nómina"],
          ["Pago de intereses de cesantías (12 %)", "31 de enero", "Directo al trabajador"],
          ["Consignación de cesantías", "14 de febrero", "Fondo de cesantías (Porvenir, Protección, Colfondos, FNA, etc.)"],
        ],
      },
    },
    {
      id: "hoja-parametros-cesantias",
      titulo: "Crea la hoja Parametros 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Ubica el SMMLV 2026, el auxilio de transporte y el tope de 2 SMMLV en la hoja Parametros.",
      parrafos: [
        "Crea la hoja Parametros para separar las normas anuales de tus fórmulas. Verifica los valores oficiales en nuestra página de [salario mínimo Colombia 2026](/co/datos/salario-minimo).",
      ],
      tabla: {
        caption: "Estructura de la hoja Parametros",
        encabezados: ["Celda", "Parámetro", "Valor", "Fuente oficial"],
        filas: [
          ["B2", "SMMLV_2026", "1750905", "MinTrabajo (Decreto 1469/2025 y Decreto 0159/2026)"],
          ["B3", "Auxilio_Transporte_2026", "249095", "MinTrabajo (Decreto 1470/2025)"],
          ["B4", "Tope_2_SMMLV", "=2*B2", "Cálculo automático ($3.501.810)"],
          ["B5", "Dias_Anio_Comercial", "360", "Convención laboral colombiana"],
        ],
      },
    },
    {
      id: "formula-cesantias-excel",
      titulo: "Calcula días trabajados y cesantías en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Obtén los días laborados en el año con DIAS360 y aplica (SalarioBase * Dias) / 360.",
      parrafos: [
        "En la hoja Cesantias, coloca en B2 la fecha de ingreso, en C2 el salario mensual, en D2 el inicio del año (2026-01-01) y en E2 la fecha de corte (2026-12-30).",
        "En F2 calcula los días trabajados en el año comercial (máximo 360) y en G2 aplica la fórmula de cesantías con auxilio condicional.",
      ],
      codigos: [
        {
          titulo: "Días laborados en el año en F2",
          lenguaje: "excel",
          codigo: "=MIN(Parametros!$B$5; DIAS360(MAX(B2; D2); E2; FALSO) + 1)",
          codigoEn: "=MIN(Parametros!$B$5, DAYS360(MAX(B2, D2), E2, FALSE) + 1)",
        },
        {
          titulo: "Fórmula de cesantías en G2",
          lenguaje: "excel",
          codigo: "=REDONDEAR((C2 + SI(C2<=Parametros!$B$4; Parametros!$B$3; 0)) * F2 / Parametros!$B$5; 0)",
          codigoEn: "=ROUND((C2 + IF(C2<=Parametros!$B$4, Parametros!$B$3, 0)) * F2 / Parametros!$B$5, 0)",
          nota: "Una vez calculado G2, puedes enlazarlo con nuestra guía de [intereses de cesantías en Excel](/co/guias/intereses-de-cesantias-excel).",
        },
      ],
    },
    {
      id: "validacion-cesantias-2026",
      titulo: "Casos de prueba 2026",
      parrafos: [
        "Comprueba que tu archivo arroje los siguientes resultados antes de generar la planilla para el operador PILA o el fondo de cesantías:",
        "Si quieres dominar funciones condicionales, tablas dinámicas y automatización de planillas laborales desde cero, revisa nuestro [curso de excel](/co/cursos/excel) en vivo.",
      ],
      tabla: {
        caption: "Ejemplos verificados de cesantías 2026",
        encabezados: ["Caso", "Salario", "Auxilio", "Días", "Cesantías"],
        filas: [
          ["1 SMMLV año completo", "$1.750.905", "$249.095", "360", "$2.000.000"],
          ["1 SMMLV medio año", "$1.750.905", "$249.095", "180", "$1.000.000"],
          ["$4.500.000 (240 días)", "$4.500.000", "$0", "240", "$3.000.000"],
        ],
      },
      verificaResultado:
        "Para un trabajador con 1 SMMLV durante los 360 días de 2026, el valor a consignar al fondo antes del 14 de febrero es exactamente $2.000.000 COP.",
    },
  ],
  erroresComunes: [
    {
      error: "Omitir el auxilio de transporte en la base de cesantías",
      causa: "Tomar únicamente el salario básico para trabajadores que ganan hasta 2 SMMLV.",
      solucion:
        "Incluye + SI(C2<=Parametros!$B$4; Parametros!$B$3; 0) en la base salarial.",
    },
    {
      error: "Calcular 365 días en vez de 360",
      causa: "Restar fechas calendario en lugar de usar año comercial.",
      solucion:
        "Usa DIAS360(...; FALSO) + 1 para que cada mes cuente de 30 días y el año completo sume 360.",
    },
    {
      error: "Confundir el plazo del 31 de enero con el del 14 de febrero",
      causa: "Mezclar fechas de intereses y de cesantías.",
      solucion:
        "El 31 de enero vencen los intereses (al trabajador) y el 14 de febrero vence la consignación de cesantías (al fondo).",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel: Cesantías Colombia 2026 (.xlsx)",
    descripcion:
      "Descarga la plantilla con hoja Parametros 2026, cálculo automático de días con DIAS360, cesantías e intereses listos para control de consignación antes del 14 de febrero.",
  },
  plantillaArchivo: PLANTILLAS_COLOMBIA_2026.cesantias,
  faqs: [
    {
      q: "¿Hasta cuándo hay plazo para consignar las cesantías de 2026?",
      a: "El plazo legal para consignar las cesantías causadas al 31 de diciembre vence el 14 de febrero del año siguiente.",
    },
    {
      q: "¿Qué sanción existe por consignar las cesantías después del 14 de febrero?",
      a: "El artículo 99 de la Ley 50 de 1990 establece una sanción moratoria de un día de salario por cada día de retardo hasta que se realice la consignación.",
    },
    {
      q: "¿Las cesantías aplican en contratos de prestación de servicios?",
      a: "No. Las cesantías son una prestación social exclusiva de contratos laborales (término fijo, indefinido o por obra o labor).",
    },
    {
      q: "¿Se descuenta salud o pensión de las cesantías?",
      a: "No, las cesantías se consignan íntegras al fondo elegido por el trabajador sin deducciones de seguridad social.",
    },
  ],
  relacionadas: [
    "intereses-de-cesantias-excel",
    "prima-de-servicios-excel",
    "liquidacion-de-contrato-excel",
  ],
  enlacesExternos: [
    {
      label: "Ministerio del Trabajo de Colombia",
      url: "https://www.mintrabajo.gov.co",
      fuente: "MinTrabajo",
    },
    {
      label: "Ley 50 de 1990 — Régimen de cesantías",
      url: "https://www.suin-juriscol.gov.co",
      fuente: "SUIN-Juriscol",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo en Colombia",
      href: "/co/cursos/excel",
      descripcion: "Aprende Excel laboral y automatización de reportes en vivo.",
    },
    {
      label: "Salario mínimo Colombia 2026",
      href: "/co/datos/salario-minimo",
      descripcion: "Valores vigentes de SMMLV y auxilio de transporte 2026.",
    },
    {
      label: "Indicadores y datos de Colombia",
      href: "/co/datos",
      descripcion: "Datos macroeconómicos y laborales de referencia para Colombia.",
    },
  ],
};
