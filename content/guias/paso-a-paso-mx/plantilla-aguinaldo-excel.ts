import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_MX } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "plantilla-aguinaldo-excel",
  pais: "mx",
  title: "Plantilla de aguinaldo en Excel 2026: cálculo proporcional",
  meta: "Calcula tu aguinaldo 2026 en Excel con plantilla gratis: 15 días de LFT art. 87, proporcional, 30 UMA exentas ($3,519.30) e ISR art. 96 antes del 20 dic.",
  h1: "Calcula tu aguinaldo 2026 en Excel (plantilla gratis)",
  subtitle:
    "Arma tu calculadora de aguinaldo en Excel paso a paso conforme al artículo 87 de la Ley Federal del Trabajo (LFT): días proporcionales, parte exenta de 30 UMA ($3,519.30 con UMA 2026 de $117.31), gravado para ISR artículo 96 y fecha límite antes del 20 de diciembre.",
  keywordPrincipal: "plantilla aguinaldo excel mexico",
  keywords: [
    "plantilla aguinaldo excel",
    "calcular aguinaldo proporcional excel",
    "aguinaldo exento 30 uma 2026",
    "aguinaldo lft articulo 87 excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Una plantilla de Excel con hoja Parametros y cálculo automático del aguinaldo bruto, aguinaldo proporcional por días trabajados, monto exento (30 UMA) y base gravable de ISR.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "20 minutos",
    bullets: [
      "Mínimo legal de 15 días de salario diario conforme al artículo 87 de la LFT.",
      "Cálculo proporcional exacto cuando no se laboró el año completo.",
      "Separación automática entre parte exenta (30 UMA = $3,519.30 MXN) y gravada.",
      "Fórmulas en español (;) e inglés (,) listas para copiar y descargar en .xlsx.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Regla legal LFT",
      resumen: "15 días mínimos y plazo límite antes del 20 de diciembre.",
      anchorId: "regla-legal-aguinaldo",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centraliza UMA 2026 ($117.31), 30 UMA y días de ley.",
      anchorId: "hoja-parametros-aguinaldo",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Días y proporcional",
      resumen: "Calcula días trabajados en el año y el aguinaldo proporcional.",
      anchorId: "calculo-proporcional",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Exento 30 UMA e ISR",
      resumen: "Separa los $3,519.30 exentos y el excedente gravado (Art. 96).",
      anchorId: "exento-uma-isr",
      icono: "settings",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Salario diario base (cuota diaria sin integrar prestaciones) y fecha de ingreso.",
      "Valor de la UMA diaria vigente en 2026 ($117.31 MXN según INEGI) y criterios de la LFT art. 87.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas usadas (SI, MIN, MAX, REDONDEAR, FECHA) funcionan igual en Windows, macOS y Excel para la Web.",
    avisoEducativo:
      "Guía educativa de modelado en Excel; no sustituye asesoría laboral o fiscal. Verifica convenios colectivos o contratos que otorguen más de 15 días de aguinaldo.",
  },
  herramientasHowTo: ["Microsoft Excel", "Ley Federal del Trabajo (Art. 87)", "INEGI (UMA 2026)"],
  insumosHowTo: ["Salario diario mensual / 30", "Fecha de ingreso y fecha de corte del ejercicio"],
  secciones: [
    {
      id: "regla-legal-aguinaldo",
      titulo: "Qué dice la LFT (art. 87) sobre el aguinaldo en México",
      esPasoHowTo: true,
      resumenHowTo:
        "Revisa el mínimo legal de 15 días de salario, el derecho proporcional y el plazo obligatorio antes del 20 de diciembre.",
      parrafos: [
        "El artículo 87 de la Ley Federal del Trabajo (LFT) establece que las personas trabajadoras tienen derecho a un aguinaldo anual equivalente a por lo menos 15 días de salario, el cual debe pagarse antes del 20 de diciembre de cada año.",
        "Quienes no hayan cumplido el año completo de servicios, sin importar si siguen laborando o terminaron su relación laboral antes de la fecha de pago, tienen derecho a recibir la parte proporcional conforme al tiempo trabajado en el año.",
      ],
      tabla: {
        caption: "Parámetros clave del aguinaldo 2026 en México",
        encabezados: ["Concepto", "Valor / Regla 2026", "Fuente legal"],
        filas: [
          ["Mínimo anual", "15 días de salario diario", "LFT art. 87"],
          ["Fecha límite de pago", "Antes del 20 de diciembre", "LFT art. 87"],
          ["Exención de ISR", "Hasta 30 UMA diarias ($3,519.30 MXN)", "LISR art. 93 fracc. XIV"],
          ["UMA diaria 2026", "$117.31 MXN (30 × $117.31 = $3,519.30)", "INEGI / DOF"],
          ["Impuesto sobre excedente", "Retención conforme a tarifa mensual o reglamento", "LISR art. 96 / RLISR art. 174"],
        ],
      },
    },
    {
      id: "hoja-parametros-aguinaldo",
      titulo: "Crea la hoja Parametros con fuentes oficiales",
      esPasoHowTo: true,
      resumenHowTo:
        "Centraliza la UMA diaria, las 30 UMA exentas y los días legales en una hoja Parametros.",
      parrafos: [
        "Para evitar números fijos dentro de las fórmulas, crea una hoja llamada Parametros donde centralices los valores vigentes de 2026 y su fuente oficial (INEGI, DOF y LFT).",
      ],
      tabla: {
        caption: "Estructura sugerida de la hoja Parametros",
        encabezados: ["Celda", "Parámetro", "Valor 2026", "Fuente"],
        filas: [
          ["Parametros!B2", "Días de aguinaldo de ley", "15", "LFT art. 87"],
          ["Parametros!B3", "Días del año calendario", "365", "Criterio anual estándar"],
          ["Parametros!B4", "UMA diaria 2026 (MXN)", "117.31", "INEGI / DOF"],
          ["Parametros!B5", "Tope exento (UMA)", "30", "LISR art. 93 fracc. XIV"],
          ["Parametros!B6", "Monto exento MXN (30 UMA)", "=B4*B5 ($3,519.30)", "Fórmula derivada"],
        ],
      },
    },
    {
      id: "calculo-proporcional",
      titulo: "Calcula días trabajados y aguinaldo proporcional en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Obtén el salario diario, los días laborados en el año y el aguinaldo bruto proporcional.",
      parrafos: [
        "En tu hoja principal (por ejemplo Aguinaldo), coloca el sueldo mensual en B2, la fecha de ingreso en B3 y el cierre del ejercicio (31/12/2026) en B4. El salario diario se obtiene dividiendo el sueldo mensual entre 30.",
        "Para los días trabajados del año (B6), toma el mayor entre el 1 de enero de 2026 y la fecha de ingreso, y réstalo a la fecha de cierre más 1 día. Luego multiplica el salario diario por los días de aguinaldo y por la proporción del año.",
      ],
      codigos: [
        {
          titulo: "Fórmulas de salario diario, días trabajados y aguinaldo bruto",
          lenguaje: "excel",
          codigo: `// B5: Salario diario
=REDONDEAR(B2/30; 2)

// B6: Días trabajados en 2026 (con tope máximo del año)
=MAX(0; B4 - MAX(FECHA(2026;1;1); B3) + 1)

// B7: Aguinaldo bruto proporcional
=REDONDEAR((B5 * Parametros!$B$2 / Parametros!$B$3) * B6; 2)`,
          codigoEn: `// B5: Daily salary
=ROUND(B2/30, 2)

// B6: Days worked in 2026
=MAX(0, B4 - MAX(DATE(2026,1,1), B3) + 1)

// B7: Gross proportional aguinaldo
=ROUND((B5 * Parametros!$B$2 / Parametros!$B$3) * B6, 2)`,
          nota: "Si el trabajador ingresó antes de 2026, MAX(FECHA(2026;1;1); B3) toma el 1 de enero y el resultado da exactamente 365 días (15 días completos).",
        },
      ],
    },
    {
      id: "exento-uma-isr",
      titulo: "Separa la parte exenta (30 UMA) y el gravado para ISR art. 96",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica MIN contra $3,519.30 para la parte exenta y calcula el excedente sujeto a ISR.",
      parrafos: [
        "De acuerdo con la Ley del ISR (art. 93 fracc. XIV), el aguinaldo está exento hasta por el equivalente a 30 veces la UMA diaria ($3,519.30 MXN en 2026). Si tu aguinaldo bruto es menor o igual a $3,519.30, queda 100% exento de ISR.",
        "Sobre el excedente gravado se aplica la retención de ISR conforme al artículo 96 de la LISR (o el procedimiento opcional del artículo 174 del Reglamento). Consulta la [Tabla ISR 2026 en Excel](/mx/guias/tabla-isr-2026-excel) para calcular la retención exacta sobre el ingreso gravable.",
      ],
      codigos: [
        {
          titulo: "Fórmulas de monto exento y monto gravado",
          lenguaje: "excel",
          codigo: `// B8: Aguinaldo exento (hasta 30 UMA = $3,519.30)
=MIN(B7; Parametros!$B$6)

// B9: Aguinaldo gravado (excedente para ISR art. 96)
=MAX(0; B7 - B8)`,
          codigoEn: `// B8: Tax-exempt aguinaldo (up to 30 UMA = $3,519.30)
=MIN(B7, Parametros!$B$6)

// B9: Taxable aguinaldo (excess for ISR art. 96)
=MAX(0, B7 - B8)`,
        },
      ],
      alerta: {
        tipo: "info",
        titulo: "Plazo obligatorio antes del 20 de diciembre",
        texto:
          "El pago debe realizarse a más tardar el 19 de diciembre. Si tienes dudas sobre cómo integrar tu aguinaldo gravado con tu sueldo mensual, revisa la guía de Tabla ISR 2026.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Calcular el aguinaldo con el Salario Diario Integrado (SDI) en vez de cuota diaria",
      causa: "Confundir la base de cotización del IMSS (SDI) con el salario ordinario diario.",
      solucion:
        "Para el aguinaldo de ley se usa el salario diario cuota diaria (sueldo mensual / 30), salvo que el contrato pacte una base superior.",
    },
    {
      error: "Usar salario mínimo en lugar de UMA para calcular la parte exenta",
      causa: "Aplicar criterios anteriores a la desindexación del salario mínimo.",
      solucion:
        "La exención de 30 días de la LISR se calcula con la UMA vigente ($117.31 × 30 = $3,519.30 MXN en 2026).",
    },
    {
      error: "Olvidar restar +1 en la diferencia de fechas de días trabajados",
      causa: "Restar fecha final menos fecha inicial excluye el primer día laborado.",
      solucion:
        "Usa (Fecha_Fin - Fecha_Inicio + 1) para contar de forma inclusiva los 365 días del año.",
    },
  ],
  plantilla: {
    titulo: "Descarga la plantilla de aguinaldo 2026 en Excel (.xlsx)",
    descripcion:
      "Incluye hoja Parametros (UMA 2026 = $117.31, 30 UMA = $3,519.30), calculadora proporcional individual y resumen con parte exenta y gravada.",
  },
  plantillaArchivo: PLANTILLAS_MX.aguinaldo,
  faqs: [
    {
      q: "¿Cuántos días de aguinaldo corresponden por ley en México?",
      a: "Por ley (artículo 87 de la LFT) corresponden al menos 15 días de salario por año trabajado, pagaderos antes del 20 de diciembre.",
    },
    {
      q: "¿Cómo se calcula el aguinaldo proporcional si trabajé menos de un año?",
      a: "Divide 15 días entre 365, multiplica por los días trabajados en el año y multiplica el resultado por tu salario diario.",
    },
    {
      q: "¿Cuánto del aguinaldo está exento de ISR en 2026?",
      a: "Están exentas 30 UMA diarias, equivalentes a $3,519.30 MXN con la UMA 2026 de $117.31 MXN. Solo el excedente paga ISR conforme al artículo 96.",
    },
    {
      q: "¿Qué pasa si renuncié o me despidieron antes de diciembre?",
      a: "Aun si la relación laboral terminó antes de diciembre, tienes derecho a la parte proporcional de aguinaldo dentro de tu finiquito o liquidación.",
    },
  ],
  relacionadas: [
    "finiquito-liquidacion-excel",
    "tabla-isr-2026-excel",
    "calcular-ptu-excel",
  ],
  enlacesExternos: [
    {
      label: "Ley Federal del Trabajo — Artículo 87 (Cámara de Diputados)",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      fuente: "LFT",
    },
    {
      label: "Valor de la UMA 2026 (INEGI)",
      url: "https://www.inegi.org.mx/temas/uma/",
      fuente: "INEGI",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo para México",
      href: "/mx/cursos/excel",
      descripcion: "Domina fórmulas laborales, tablas dinámicas y automatización en vivo.",
    },
    {
      label: "Datos salariales y empleo en México",
      href: "/mx/datos",
      descripcion: "Consulta indicadores oficiales de salarios y mercado laboral en México.",
    },
  ],
};
