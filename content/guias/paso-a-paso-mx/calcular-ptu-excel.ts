import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_MX } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "calcular-ptu-excel",
  pais: "mx",
  title: "Cómo calcular la PTU 2026 en Excel (reparto de utilidades)",
  meta: "Calcula la PTU 2026 en Excel: 10% renta gravable (50% días y 50% salario), tope 3 meses o promedio 3 años, exento 15 UMA ($1,759.65) y plazos STPS.",
  h1: "Calcula tu PTU en Excel paso a paso",
  subtitle:
    "Modela el reparto de utilidades (PTU) en Excel conforme a la Ley Federal del Trabajo y criterios de la STPS: 10% de la renta gravable dividido 50% por días trabajados y 50% por salarios devengados, tope de 3 meses o promedio de los últimos 3 años y exención de 15 UMA ($1,759.65).",
  keywordPrincipal: "calcular ptu excel mexico",
  keywords: [
    "calcular ptu 2026 en excel",
    "reparto de utilidades excel 50 dias 50 salario",
    "tope ptu 3 meses promedio 3 anos",
    "ptu exenta 15 uma 2026",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Una plantilla de Excel que reparte el 10% de la renta gravable en dos bolsas (50% días / 50% salario), aplica el tope de 3 meses o promedio de 3 años y separa los $1,759.65 exentos de ISR.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "30 minutos",
    bullets: [
      "División exacta de la utilidad repartible: 50% por días laborados y 50% por salarios.",
      "Tope individual automático: MAX(3 meses de salario; promedio PTU últimos 3 años).",
      "Exención de ISR de 15 UMA ($1,759.65 MXN con UMA 2026 de $117.31).",
      "Plazos legales STPS: 30 de mayo (personas morales) y 29 de junio (personas físicas).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Reglas y plazos STPS",
      resumen: "10% de utilidad, mitades 50/50 y fechas límite de mayo y junio.",
      anchorId: "reglas-plazos-ptu",
      icono: "calendar",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros PTU",
      resumen: "Centraliza renta gravable, UMA 2026 ($117.31) y 15 UMA ($1,759.65).",
      anchorId: "parametros-ptu",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Factores 50% / 50%",
      resumen: "Calcula factor por día trabajado y factor por peso de salario.",
      anchorId: "factores-reparto",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Tope 3 meses y 15 UMA",
      resumen: "Aplica el límite legal (art. 127 fracc. VIII) y separa el monto exento.",
      anchorId: "tope-y-exento-ptu",
      icono: "settings",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Renta gravable de la declaración anual (10% a repartir), lista de días trabajados y salarios anuales devengados.",
      "Valor de UMA 2026 ($117.31 MXN) y lineamientos de la STPS / LFT arts. 117–131.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas (SUMA, MIN, MAX, REDONDEAR) funcionan igual en Windows, macOS y Excel Web.",
    avisoEducativo:
      "Guía educativa de modelado en Excel. Verifica excepciones de la LFT art. 127 (trabajadores de confianza topados al 120% del sindicalizado más alto, eventuales con menos de 60 días, etc.) antes de dispersar.",
  },
  herramientasHowTo: ["Microsoft Excel", "LFT arts. 117–131", "Guía PTU STPS"],
  insumosHowTo: ["Utilidad repartible (10% renta gravable)", "Días laborados y salarios devengados por colaborador"],
  secciones: [
    {
      id: "reglas-plazos-ptu",
      titulo: "Reglas y plazos legales de la PTU 2026 (STPS)",
      esPasoHowTo: true,
      resumenHowTo:
        "Revisa el porcentaje de reparto (10%), las dos mitades (50% días / 50% salario) y las fechas límite de pago.",
      parrafos: [
        "Conforme a la Ley Federal del Trabajo y la Secretaría del Trabajo y Previsión Social (STPS), las empresas deben repartir el 10% de su renta gravable determinada en la declaración anual.",
        "Ese 10% se divide en dos partes iguales: 50% se distribuye entre todos los trabajadores según el número de días trabajados en el año y 50% en proporción al monto de los salarios devengados.",
      ],
      tabla: {
        caption: "Resumen de reglas y plazos de la PTU 2026",
        encabezados: ["Concepto", "Regla 2026", "Fuente"],
        filas: [
          ["Porcentaje a repartir", "10% de la renta gravable", "Comisión Nacional PTU / LFT art. 117"],
          ["Criterio de reparto", "50% días trabajados + 50% salarios devengados", "LFT art. 123"],
          ["Tope individual", "Máximo entre 3 meses de salario o promedio de PTU de los últimos 3 años", "LFT art. 127 fracc. VIII"],
          ["Exención de ISR", "Hasta 15 UMA diarias ($1,759.65 MXN)", "LISR art. 93 fracc. XIV"],
          ["Plazo personas morales", "Hasta el 30 de mayo", "LFT art. 122 / STPS"],
          ["Plazo personas físicas", "Hasta el 29 de junio", "LFT art. 122 / STPS"],
        ],
      },
    },
    {
      id: "parametros-ptu",
      titulo: "Arma la hoja Parametros con la bolsa repartible y UMA 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Centraliza la renta gravable, el 10% a repartir, las bolsas de 50% y las 15 UMA exentas.",
      parrafos: [
        "En Parametros coloca la renta gravable anual en B2, calcula el 10% en B3 y divide entre 2 para obtener las bolsas de días (B4) y salarios (B5). Registra también la UMA 2026 ($117.31) y su múltiplo exento de 15 UMA ($1,759.65).",
      ],
      codigos: [
        {
          titulo: "Fórmulas base en la hoja Parametros",
          lenguaje: "excel",
          codigo: `// B3: 10% de la renta gravable (B2)
=REDONDEAR(B2 * 0,10; 2)

// B4 y B5: Mitad para días y mitad para salarios
=B3 / 2

// B7: Exento PTU (15 UMA × $117.31 en B6)
=REDONDEAR(15 * B6; 2)`,
          codigoEn: `// B3: 10% of taxable income (B2)
=ROUND(B2 * 0.10, 2)

// B4 and B5: Half for days, half for salaries
=B3 / 2

// B7: Tax-exempt PTU (15 UMA × $117.31 in B6)
=ROUND(15 * B6, 2)`,
        },
      ],
    },
    {
      id: "factores-reparto",
      titulo: "Calcula los factores por día y por peso de salario",
      esPasoHowTo: true,
      resumenHowTo:
        "Divide cada bolsa entre la suma total de días trabajados y la suma total de salarios devengados.",
      parrafos: [
        "En la hoja Nomina_PTU, coloca en la columna B los días trabajados de cada persona, en C el salario anual devengado, en D el salario mensual (para el tope de 3 meses) y en E el promedio de PTU recibida en los últimos 3 años.",
        "Calcula los factores en celdas fijas (por ejemplo G2 y G3) dividiendo las bolsas de Parametros entre SUMA(B2:B50) y SUMA(C2:C50).",
      ],
      codigos: [
        {
          titulo: "Factores y PTU calculada por trabajador",
          lenguaje: "excel",
          codigo: `// G2: Factor por día trabajado
=Parametros!$B$4 / SUMA(B2:B50)

// G3: Factor por salario devengado
=Parametros!$B$5 / SUMA(C2:C50)

// F2: PTU teórica antes de tope (fila 2)
=REDONDEAR((B2 * $G$2) + (C2 * $G$3); 2)`,
          codigoEn: `// G2: Factor per worked day
=Parametros!$B$4 / SUM(B2:B50)

// G3: Factor per earned salary
=Parametros!$B$5 / SUM(C2:C50)

// F2: Theoretical PTU before cap (row 2)
=ROUND((B2 * $G$2) + (C2 * $G$3), 2)`,
        },
      ],
    },
    {
      id: "tope-y-exento-ptu",
      titulo: "Aplica el tope de 3 meses / promedio 3 años y separa 15 UMA exentas",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa MIN contra MAX(3*SalarioMensual; Promedio3Anos) y separa los $1,759.65 exentos de ISR.",
      parrafos: [
        "Desde la reforma de 2021 (LFT art. 127 fracc. VIII), la PTU tiene un monto máximo equivalente a 3 meses del salario del trabajador o al promedio de la PTU recibida en los últimos 3 años, lo que resulte más favorable al trabajador.",
        "Finalmente, separa la parte exenta de ISR (15 UMA = $1,759.65 MXN) de la parte gravada para integrarla en tu cálculo de [Tabla ISR 2026 en Excel](/mx/guias/tabla-isr-2026-excel).",
      ],
      codigos: [
        {
          titulo: "Tope legal de PTU y separación exento / gravado",
          lenguaje: "excel",
          codigo: `// H2: Tope individual (mayor entre 3 meses de salario y promedio 3 años)
=MAX(3 * D2; E2)

// I2: PTU a pagar topada
=MIN(F2; H2)

// J2: PTU exenta (hasta 15 UMA = $1,759.65)
=MIN(I2; Parametros!$B$7)

// K2: PTU gravada para ISR
=MAX(0; I2 - J2)`,
          codigoEn: `// H2: Individual cap (higher of 3 months salary or 3-year average)
=MAX(3 * D2, E2)

// I2: Payable PTU after cap
=MIN(F2, H2)

// J2: Tax-exempt PTU (up to 15 UMA = $1,759.65)
=MIN(I2, Parametros!$B$7)

// K2: Taxable PTU for ISR
=MAX(0, I2 - J2)`,
        },
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Elegir el menor en vez del mayor entre 3 meses y promedio de 3 años",
      causa: "Usar MIN en lugar de MAX para definir el tope del artículo 127 fracción VIII.",
      solucion:
        "La ley ordena aplicar el monto que resulte más favorable al trabajador: usa MAX(3*SalarioMensual; Promedio3Anos) para el tope y luego MIN(PTU_Teorica; Tope).",
    },
    {
      error: "Aplicar 30 UMA de exención en lugar de 15 UMA",
      causa: "Confundir la exención del aguinaldo (30 UMA) con la de la PTU (15 UMA).",
      solucion:
        "La LISR artículo 93 fracción XIV fija la exención de PTU en 15 UMA ($1,759.65 MXN en 2026).",
    },
    {
      error: "Incluir trabajadores eventuales con menos de 60 días laborados",
      causa: "No filtrar la base de cálculo antes de sumar días y salarios.",
      solucion:
        "Verifica la condición de al menos 60 días para eventuales conforme al artículo 127 fracción VII de la LFT.",
    },
  ],
  plantilla: {
    titulo: "Descarga la plantilla de PTU 2026 en Excel (.xlsx)",
    descripcion:
      "Incluye hoja Parametros (UMA $117.31, 15 UMA = $1,759.65), reparto 50% días / 50% salario, tope de 3 meses o promedio 3 años y desglose de ISR.",
  },
  plantillaArchivo: PLANTILLAS_MX.ptu,
  faqs: [
    {
      q: "¿Cuándo se debe pagar la PTU en México en 2026?",
      a: "Las personas morales (empresas) tienen como fecha límite el 30 de mayo y las personas físicas con actividad empresarial hasta el 29 de junio.",
    },
    {
      q: "¿Cómo funciona el tope de la PTU?",
      a: "El monto individual tiene un límite máximo de 3 meses de salario o el promedio de la PTU recibida en los últimos 3 años, aplicando el que sea mayor para el trabajador.",
    },
    {
      q: "¿Cuánto de la PTU está exento de ISR en 2026?",
      a: "Hasta 15 UMA diarias, equivalentes a $1,759.65 MXN con la UMA 2026 de $117.31 MXN. El excedente paga ISR.",
    },
    {
      q: "¿Quiénes tienen derecho al reparto de utilidades?",
      a: "Todas las personas trabajadoras que hayan laborado al menos 60 días durante el año fiscal correspondiente, excepto directores, administradores, gerentes generales y socios.",
    },
  ],
  relacionadas: [
    "plantilla-aguinaldo-excel",
    "finiquito-liquidacion-excel",
    "tabla-isr-2026-excel",
  ],
  enlacesExternos: [
    {
      label: "Secretaría del Trabajo y Previsión Social (STPS) — PTU",
      url: "https://www.gob.mx/stps",
      fuente: "STPS",
    },
    {
      label: "Ley Federal del Trabajo — Arts. 117 a 131",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      fuente: "LFT",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo para México",
      href: "/mx/cursos/excel",
      descripcion: "Aprende a automatizar cálculos de nómina, tablas y reportes en Excel.",
    },
    {
      label: "Datos salariales y carreras en México",
      href: "/mx/datos",
      descripcion: "Explora estadísticas salariales y demanda laboral oficial en México.",
    },
  ],
};
