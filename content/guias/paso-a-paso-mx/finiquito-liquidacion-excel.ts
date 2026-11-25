import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_MX } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "finiquito-liquidacion-excel",
  pais: "mx",
  title: "Cómo calcular finiquito o liquidación en Excel (México 2026)",
  meta: "Calcula finiquito y liquidación en Excel (México 2026): 3 meses, 20 días/año, prima de antigüedad 12 días/año con tope 2 SM ($315.04 / $440.87 ZLFN).",
  h1: "Calcula tu finiquito y tu liquidación en Excel",
  subtitle:
    "Distingue en Excel cuándo aplica finiquito o liquidación conforme a la LFT (arts. 48, 50 y 162): días trabajados, vacaciones, prima vacacional, aguinaldo proporcional, 3 meses constitucionales, 20 días por año y prima de antigüedad de 12 días por año con tope de 2 salarios mínimos.",
  keywordPrincipal: "calcular finiquito liquidacion excel mexico",
  keywords: [
    "calcular finiquito en excel mexico",
    "liquidacion 3 meses 20 dias excel",
    "prima de antiguedad tope 2 salarios minimos 2026",
    "diferencia finiquito y liquidacion lft",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Un modelo de Excel con hoja Parametros (SMG y ZLFN 2026) que calcula finiquito por renuncia y liquidación por despido injustificado aplicando topes legales.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "30 minutos",
    bullets: [
      "Tabla comparativa clara entre finiquito (renuncia) y liquidación (despido injustificado).",
      "Indemnización de 3 meses (art. 48) y 20 días por año (art. 50) con Salario Diario Integrado.",
      "Prima de antigüedad de 12 días por año con tope de 2 salarios mínimos ($315.04 general / $440.87 ZLFN en 2026).",
      "Fórmulas en español (;) e inglés (,) + plantilla .xlsx descargable.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Finiquito vs Liquidación",
      resumen: "Compara qué prestaciones aplican en renuncia y en despido.",
      anchorId: "finiquito-vs-liquidacion",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros 2026",
      resumen: "Carga SMG, ZLFN, tope 2 SM y factor de integración.",
      anchorId: "parametros-lft-2026",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Partes proporcionales",
      resumen: "Calcula días laborados, aguinaldo y prima vacacional.",
      anchorId: "partes-proporcionales",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Indemnización y prima",
      resumen: "Modela 3 meses, 20 días/año y prima de antigüedad topada.",
      anchorId: "indemnizacion-prima-antiguedad",
      icono: "code",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Fecha de ingreso, fecha de baja, salario diario cuota diaria y Salario Diario Integrado (SDI).",
      "Salarios mínimos 2026 vigentes (CONASAMI) y Ley Federal del Trabajo (arts. 48, 50 y 162).",
    ],
    compatibilidadMacWeb:
      "Todas las funciones (SI, MIN, SIFECHA / DATEDIF, REDONDEAR) operan en Windows, macOS y Excel Web.",
    avisoEducativo:
      "Guía práctica de modelado en Excel; no sustituye asesoría jurídica laboral. Ante conflictos o dudas, acude a PROFEDET o revisa tu contrato individual/colectivo.",
  },
  herramientasHowTo: ["Microsoft Excel", "LFT arts. 48, 50 y 162", "CONASAMI 2026"],
  insumosHowTo: ["Fechas de ingreso y baja", "Salario diario y Salario Diario Integrado (SDI)"],
  secciones: [
    {
      id: "finiquito-vs-liquidacion",
      titulo: "Tabla comparativa: finiquito vs liquidación en México",
      esPasoHowTo: true,
      resumenHowTo:
        "Identifica qué conceptos corresponden en un finiquito (renuncia) frente a una liquidación (despido injustificado).",
      parrafos: [
        "En México se suele confundir finiquito con liquidación. El finiquito corresponde cuando la relación termina por renuncia voluntaria, mutuo acuerdo o fin de contrato temporal, e incluye las partes devengadas y proporcionales.",
        "La liquidación aplica ante un despido injustificado o rescisión imputable al patrón, sumando al finiquito las indemnizaciones constitucionales (3 meses, 20 días por año cuando procede y prima de antigüedad).",
      ],
      tabla: {
        caption: "Finiquito vs Liquidación conforme a la Ley Federal del Trabajo",
        encabezados: ["Concepto", "Finiquito (Renuncia)", "Liquidación (Despido injustificado)", "Base LFT"],
        filas: [
          ["Días trabajados no pagados", "Sí", "Sí", "LFT art. 82 y 88"],
          ["Aguinaldo proporcional (15 días/año)", "Sí", "Sí", "LFT art. 87"],
          ["Vacaciones y prima vacacional (25%)", "Sí", "Sí", "LFT arts. 76, 79 y 80"],
          ["Prima de antigüedad (12 días/año, tope 2 SM)", "Solo si tiene 15+ años de servicio", "Sí, sin importar antigüedad", "LFT art. 162"],
          ["Indemnización 3 meses de salario", "No", "Sí (90 días de SDI)", "LFT art. 48 / Const. 123"],
          ["20 días por año de servicio", "No", "Sí (cuando no hay reinstalación)", "LFT art. 50"],
        ],
      },
    },
    {
      id: "parametros-lft-2026",
      titulo: "Configura la hoja Parametros con salarios mínimos 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Registra el salario mínimo general, ZLFN y los topes de 2 salarios mínimos para prima de antigüedad.",
      parrafos: [
        "De acuerdo con la resolución de CONASAMI para 2026 y el artículo 162 de la LFT (en relación con el artículo 486), la prima de antigüedad de 12 días por año se topa al doble del salario mínimo vigente del área geográfica.",
      ],
      tabla: {
        caption: "Parámetros 2026 en hoja Parametros",
        encabezados: ["Celda", "Parámetro", "Valor 2026", "Referencia"],
        filas: [
          ["Parametros!B2", "Salario Mínimo General (SMG)", "$315.04 MXN", "CONASAMI 2026"],
          ["Parametros!B3", "Tope 2 SM General", "=2*B2 ($630.08 MXN)", "LFT arts. 162 y 486"],
          ["Parametros!B4", "Salario Mínimo ZLFN", "$440.87 MXN", "CONASAMI 2026"],
          ["Parametros!B5", "Tope 2 SM ZLFN", "=2*B4 ($881.74 MXN)", "LFT arts. 162 y 486"],
          ["Parametros!B6", "Prima vacacional mínima", "25%", "LFT art. 80"],
        ],
      },
    },
    {
      id: "partes-proporcionales",
      titulo: "Calcula antigüedad y partes proporcionales",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula años completos con SIFECHA, vacaciones proporcionales, prima vacacional y aguinaldo proporcional.",
      parrafos: [
        "Usa SIFECHA para obtener los años completos de servicio y calcula las prestaciones proporcionales desde el 1 de enero (para aguinaldo) o desde el último aniversario laboral (para vacaciones y prima vacacional del 25%).",
      ],
      codigos: [
        {
          titulo: "Fórmulas de antigüedad y prestaciones proporcionales",
          lenguaje: "excel",
          codigo: `// B7: Años completos de antigüedad (B3 = ingreso, B4 = baja)
=SIFECHA(B3; B4; "y")

// B8: Aguinaldo proporcional (B5 = salario diario)
=REDONDEAR((B5 * 15 / 365) * (B4 - MAX(FECHA(AÑO(B4);1;1); B3) + 1); 2)

// B9: Prima vacacional (25% sobre días de vacaciones pendientes en B10)
=REDONDEAR(B10 * B5 * Parametros!$B$6; 2)`,
          codigoEn: `// B7: Completed years of service
=DATEDIF(B3, B4, "y")

// B8: Proportional aguinaldo
=ROUND((B5 * 15 / 365) * (B4 - MAX(DATE(YEAR(B4),1,1), B3) + 1), 2)

// B9: Vacation premium (25%)
=ROUND(B10 * B5 * Parametros!$B$6, 2)`,
        },
      ],
    },
    {
      id: "indemnizacion-prima-antiguedad",
      titulo: "Modela 3 meses, 20 días por año y prima de antigüedad topada",
      esPasoHowTo: true,
      resumenHowTo:
        "Condiciona las indemnizaciones al tipo de baja y aplica MIN al tope de 2 salarios mínimos en la prima de antigüedad.",
      parrafos: [
        "En B1 indica el tipo de terminación ('Liquidacion' o 'Finiquito') y en B2 la zona ('General' o 'ZLFN'). Las indemnizaciones de 3 meses (90 días de SDI) y 20 días por año solo se activan cuando B1 = 'Liquidacion'.",
        "Para la prima de antigüedad (art. 162), la base diaria nunca excede 2 salarios mínimos de la zona correspondiente ($630.08 MXN en zona general o $881.74 MXN en ZLFN), y en renuncia voluntaria solo se paga si el trabajador cumplió 15 o más años.",
      ],
      codigos: [
        {
          titulo: "Fórmulas de indemnización constitucional, 20 días y prima de antigüedad",
          lenguaje: "excel",
          codigo: `// B11: Indemnización 3 meses (90 días de SDI en B6)
=SI(B1="Liquidacion"; REDONDEAR(90 * B6; 2); 0)

// B12: 20 días por año de servicio (LFT art. 50)
=SI(B1="Liquidacion"; REDONDEAR(20 * B7 * B6; 2); 0)

// B13: Tope diario de prima de antigüedad (2 SM según zona)
=SI(B2="ZLFN"; Parametros!$B$5; Parametros!$B$3)

// B14: Prima de antigüedad (12 días/año topada a 2 SM)
=SI(O(B1="Liquidacion"; B7>=15); REDONDEAR(12 * (B7 + (B4-FECHA(AÑO(B3)+B7;MES(B3);DIA(B3)))/365) * MIN(B5; B13); 2); 0)`,
          codigoEn: `// B11: 3-month severance (90 days of SDI in B6)
=IF(B1="Liquidacion", ROUND(90 * B6, 2), 0)

// B12: 20 days per year of service (LFT art. 50)
=IF(B1="Liquidacion", ROUND(20 * B7 * B6, 2), 0)

// B13: Daily cap for seniority premium (2 SM by zone)
=IF(B2="ZLFN", Parametros!$B$5, Parametros!$B$3)

// B14: Seniority premium (12 days/year capped at 2 SM)
=IF(OR(B1="Liquidacion", B7>=15), ROUND(12 * (B7 + (B4-DATE(YEAR(B3)+B7,MONTH(B3),DAY(B3)))/365) * MIN(B5, B13), 2), 0)`,
        },
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Aplicar el tope de 2 salarios mínimos también a los 3 meses de indemnización",
      causa: "Confundir el límite del artículo 162/486 (prima de antigüedad) con el artículo 48.",
      solucion:
        "Los 3 meses y los 20 días por año se calculan con el Salario Diario Integrado (SDI) completo sin tope de 2 SM.",
    },
    {
      error: "Pagar prima de antigüedad en renuncia con menos de 15 años",
      causa: "Omitir la condición de antigüedad del artículo 162 fracción III de la LFT.",
      solucion:
        "Condiciona con SI(O(Tipo=\"Liquidacion\"; Anios>=15); ...) para que en renuncia solo aplique a partir de 15 años.",
    },
    {
      error: "Usar el salario cuota diaria en lugar del SDI para la indemnización",
      causa: "Omitir aguinaldo y prima vacacional en la base diaria de indemnización.",
      solucion:
        "Para los 90 días y 20 días por año usa el Salario Diario Integrado (LFT arts. 84 y 89).",
    },
  ],
  plantilla: {
    titulo: "Descarga la plantilla de finiquito y liquidación 2026 (.xlsx)",
    descripcion:
      "Incluye selector Finiquito/Liquidación, zona General/ZLFN ($315.04 / $440.87), cálculo de prima de antigüedad con tope 2 SM y partes proporcionales.",
  },
  plantillaArchivo: PLANTILLAS_MX.finiquitoLiquidacion,
  faqs: [
    {
      q: "¿Cuál es el tope de la prima de antigüedad en México en 2026?",
      a: "El salario base para los 12 días por año se topa a 2 salarios mínimos: $630.08 MXN diarios en zona general (2 × $315.04) o $881.74 MXN en ZLFN (2 × $440.87).",
    },
    {
      q: "¿Qué salario se usa para los 3 meses y 20 días por año?",
      a: "Se utiliza el Salario Diario Integrado (SDI), que incluye cuota diaria más la proporción diaria de aguinaldo, prima vacacional y prestaciones ordinarias (LFT art. 84).",
    },
    {
      q: "¿Si renuncio me tocan 20 días por año o 3 meses?",
      a: "No. En renuncia voluntaria corresponde finiquito (días laborados, aguinaldo proporcional, vacaciones y prima vacacional, más prima de antigüedad solo si tienes 15 o más años).",
    },
    {
      q: "¿El finiquito o liquidación pagan ISR?",
      a: "Las partes proporcionales siguen sus reglas de exención (por ejemplo 30 UMA en aguinaldo) y las indemnizaciones por separación tienen una exención de hasta 90 UMA por cada año de servicio (LISR art. 93 fracc. XIII).",
    },
  ],
  relacionadas: [
    "plantilla-aguinaldo-excel",
    "tabla-isr-2026-excel",
    "calcular-ptu-excel",
  ],
  enlacesExternos: [
    {
      label: "Ley Federal del Trabajo — Arts. 48, 50 y 162",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      fuente: "LFT",
    },
    {
      label: "Salarios mínimos vigentes 2026 (CONASAMI)",
      url: "https://www.gob.mx/conasami",
      fuente: "CONASAMI",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo para México",
      href: "/mx/cursos/excel",
      descripcion: "Aprende a modelar nómina, finiquitos y reportes ejecutivos en Excel.",
    },
    {
      label: "Datos del mercado laboral en México",
      href: "/mx/datos",
      descripcion: "Explora salarios promedio y estadísticas oficiales por carrera en México.",
    },
  ],
};
