import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_COLOMBIA_2026 } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "intereses-de-cesantias-excel",
  pais: "co",
  title: "Intereses de cesantías 2026 en Excel: fórmula y guía",
  meta: "Calcula los intereses de cesantías 2026 en Excel para Colombia: fórmula (Cesantias * Dias * 0,12) / 360, hoja Parametros y plazo 31 de enero.",
  h1: "Cómo calcular los intereses de cesantías en Excel (Colombia 2026)",
  subtitle:
    "Construye en Excel la liquidación de intereses sobre cesantías al 12 % anual proporcional con hoja Parametros, cálculo exacto de días con DIAS360 y pago directo al trabajador antes del 31 de enero.",
  keywordPrincipal: "intereses de cesantias en excel",
  keywords: [
    "intereses de cesantias en excel",
    "formula intereses de cesantias 2026",
    "calcular intereses de cesantias colombia",
    "plantilla intereses cesantias 2026",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT15M",
  en30Segundos: {
    queLogras:
      "Una plantilla en Excel que calcula las cesantías acumuladas del año y aplica la fórmula legal (Cesantias * Dias * 0,12) / 360 para pagar los intereses antes del 31 de enero.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "15 minutos",
    bullets: [
      "Hoja Parametros con tasa del 12 % anual (0,12), SMMLV 2026 ($1.750.905) y auxilio de transporte ($249.095).",
      "Fórmula exacta (Cesantias * Dias * 0,12) / 360 en español (;) e inglés (,).",
      "Diferencia clara entre fecha de pago al trabajador (31 de enero) y consignación de cesantías al fondo (14 de febrero).",
      "Plantilla descargable en .xlsx lista para nómina.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Norma y plazo 31 ene",
      resumen: "Entiende el 12 % anual proporcional y su pago directo al trabajador.",
      anchorId: "norma-intereses-cesantias",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Define tasa 0,12, base 360 días y parámetros oficiales 2026.",
      anchorId: "hoja-parametros-intereses",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Fórmula en Excel",
      resumen: "Aplica (Cesantias * Dias * 0,12) / 360 con REDONDEAR.",
      anchorId: "formula-intereses-excel",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Casos de prueba",
      resumen: "Valida año completo (360 días = 12 %) y fracciones de año.",
      anchorId: "ejemplos-intereses-cesantias",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o Excel Web.",
      "Valor de cesantías acumuladas al 31 de diciembre o fecha de retiro (ver guía de [cesantías 2026 en Colombia](/co/guias/cesantias-2026)).",
      "Días laborados en el año calendario calculados en base comercial de 360 días.",
    ],
    compatibilidadMacWeb:
      "Las fórmulas usan operaciones aritméticas, DIAS360 y REDONDEAR, totalmente compatibles con Windows, macOS y Excel Web.",
    avisoEducativo:
      "Guía educativa de modelado en Excel. Verifica siempre retiros parciales de cesantías o suspensiones de contrato antes de emitir el pago definitivo.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Parámetros laborales MinTrabajo 2026",
  ],
  insumosHowTo: [
    "Saldo de cesantías del período",
    "Días trabajados en el año",
  ],
  secciones: [
    {
      id: "norma-intereses-cesantias",
      titulo: "Qué son los intereses de cesantías y cuándo vencen en Colombia",
      esPasoHowTo: true,
      resumenHowTo:
        "Confirma la tasa del 12 % anual proporcional sobre el saldo de cesantías y la fecha límite de pago directo al trabajador: 31 de enero.",
      parrafos: [
        "Todo empleador en Colombia debe pagar al trabajador intereses legales del 12 % anual (o proporcional por fracción de año) sobre el valor de las cesantías acumuladas al 31 de diciembre de cada año (Ley 52 de 1975).",
        "A diferencia de las cesantías —que se consignan en el fondo hasta el 14 de febrero, como explicamos en la guía de [cálculo de cesantías 2026](/co/guias/cesantias-2026)—, los intereses de cesantías se pagan directamente al trabajador en su nómina a más tardar el 31 de enero del año siguiente.",
      ],
      tabla: {
        caption: "Diferencias clave entre cesantías e intereses de cesantías",
        encabezados: ["Concepto", "Cesantías", "Intereses de cesantías"],
        filas: [
          ["Fórmula", "(Salario + Auxilio si aplica) * Días / 360", "(Cesantías * Días * 0,12) / 360"],
          ["Beneficiario del giro", "Fondo de cesantías elegido", "Directamente al trabajador"],
          ["Fecha límite anual", "14 de febrero", "31 de enero"],
        ],
      },
    },
    {
      id: "hoja-parametros-intereses",
      titulo: "Configura la hoja Parametros en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Centraliza la tasa del 12 %, los 360 días del año comercial y los valores de SMMLV y auxilio de transporte 2026.",
      parrafos: [
        "En la hoja Parametros, registra la tasa de interés legal (0,12) en la celda B4 y la base de 360 días en B5, junto con el SMMLV 2026 ($1.750.905) y el auxilio de transporte ($249.095) definidos por MinTrabajo.",
      ],
      tabla: {
        caption: "Celdas de la hoja Parametros para intereses de cesantías 2026",
        encabezados: ["Celda", "Parámetro", "Valor", "Fuente oficial"],
        filas: [
          ["B2", "SMMLV_2026", "1750905", "MinTrabajo (Decreto 1469/2025 y Decreto 0159/2026)"],
          ["B3", "Auxilio_Transporte_2026", "249095", "MinTrabajo (Decreto 1470/2025)"],
          ["B4", "Tasa_Intereses_Cesantias", "0,12", "Ley 52 de 1975 (12 % anual)"],
          ["B5", "Dias_Anio_Comercial", "360", "Convención laboral colombiana"],
        ],
      },
    },
    {
      id: "formula-intereses-excel",
      titulo: "Fórmula de intereses de cesantías en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Multiplica las cesantías por los días trabajados y por 0,12, y divide entre 360 días.",
      parrafos: [
        "En la hoja Liquidacion, supón que C2 contiene el valor de las cesantías del período y D2 contiene los días laborados en el año (calculados con DIAS360 + 1, máximo 360).",
        "Aplica la fórmula en la celda E2 multiplicando las cesantías por los días y por la tasa del 12 %, dividido entre 360. Si el trabajador laboró los 360 días del año, el factor Días / 360 se vuelve 1 y el interés equivale exactamente al 12 % de sus cesantías.",
      ],
      codigos: [
        {
          titulo: "Fórmula de intereses de cesantías en la celda E2",
          lenguaje: "excel",
          codigo: "=REDONDEAR((C2 * D2 * Parametros!$B$4) / Parametros!$B$5; 0)",
          codigoEn: "=ROUND((C2 * D2 * Parametros!$B$4) / Parametros!$B$5, 0)",
          nota: "Equivale exactamente a (Cesantias * Dias * 0,12) / 360 redondeado al peso colombiano.",
        },
      ],
    },
    {
      id: "ejemplos-intereses-cesantias",
      titulo: "Verificación con ejemplos de año completo y fracción",
      parrafos: [
        "Valida tu fórmula con un trabajador de 1 SMMLV ($1.750.905 + $249.095 = $2.000.000 de base) en dos escenarios: año completo (360 días) y medio año (180 días).",
      ],
      tabla: {
        caption: "Ejemplos verificados de intereses de cesantías 2026",
        encabezados: ["Escenario", "Base salarial", "Días", "Cesantías", "Intereses"],
        filas: [
          ["Año completo (360 días)", "$2.000.000", "360", "$2.000.000", "$240.000"],
          ["Medio año (180 días)", "$2.000.000", "180", "$1.000.000", "$60.000"],
          ["Trimestre (90 días)", "$2.000.000", "90", "$500.000", "$15.000"],
        ],
      },
      verificaResultado:
        "Para 180 días, las cesantías son $1.000.000 y los intereses deben dar $60.000 COP (no $120.000), porque el tiempo también es proporcional.",
    },
  ],
  erroresComunes: [
    {
      error: "Aplicar 12 % plano sin multiplicar por Días / 360",
      causa: "Omitir la proporcionalidad de días cuando el trabajador ingresó durante el año.",
      solucion:
        "Incluye siempre D2 / 360 dentro de la fórmula: (Cesantias * Dias * 0,12) / 360.",
    },
    {
      error: "Consignar los intereses al fondo junto con las cesantías",
      causa: "Confundir el destinatario de ambas prestaciones.",
      solucion:
        "Separa en tu planilla el pago de intereses (nómina del trabajador antes del 31 de enero) y la consignación de cesantías (fondo antes del 14 de febrero).",
    },
    {
      error: "Usar 12 en lugar de 0,12 en la celda de tasa",
      causa: "Ingresar el número entero 12 sin formato de porcentaje.",
      solucion:
        "Escribe 0,12 (o 12%) en Parametros!$B$4 para evitar multiplicar los intereses por 100.",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel: Intereses de cesantías Colombia 2026 (.xlsx)",
    descripcion:
      "Descarga el libro con la hoja Parametros 2026, cálculo automático de cesantías, días trabajados e intereses al 12 % proporcional.",
  },
  plantillaArchivo: PLANTILLAS_COLOMBIA_2026.interesesCesantias,
  faqs: [
    {
      q: "¿Cuál es la fecha límite para pagar los intereses de cesantías?",
      a: "El plazo legal vence el 31 de enero de cada año. Si el contrato termina antes, se pagan en la liquidación definitiva.",
    },
    {
      q: "¿Por qué la fórmula multiplica por Días y divide por 360 si las cesantías ya son proporcionales?",
      a: "Porque la tasa del 12 % es anual. Si el trabajador estuvo 180 días, sus cesantías corresponden a medio año y la tasa efectiva durante ese tiempo es la mitad del 12 % (6 %).",
    },
    {
      q: "¿Qué sanción aplica si no se pagan los intereses a tiempo?",
      a: "El artículo 1 de la Ley 52 de 1975 contempla una indemnización adicional equivalente al valor de los intereses causados si el empleador no los paga dentro del plazo legal sin justificación.",
    },
    {
      q: "¿Los intereses de cesantías tienen descuentos de salud o pensión?",
      a: "No. Los intereses de cesantías son una prestación social y no hacen parte del Ingreso Base de Cotización (IBC) de seguridad social.",
    },
  ],
  relacionadas: [
    "cesantias-2026",
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
      label: "Ley 52 de 1975 — Intereses sobre cesantías",
      url: "https://www.suin-juriscol.gov.co",
      fuente: "SUIN-Juriscol",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo en Colombia",
      href: "/co/cursos/excel",
      descripcion: "Domina fórmulas condicionales y plantillas laborales paso a paso.",
    },
    {
      label: "Salario mínimo Colombia 2026",
      href: "/co/datos/salario-minimo",
      descripcion: "Consulta SMMLV ($1.750.905) y auxilio de transporte ($249.095).",
    },
    {
      label: "Indicadores y datos de Colombia",
      href: "/co/datos",
      descripcion: "Cifras económicas y laborales oficiales de Colombia.",
    },
  ],
};
