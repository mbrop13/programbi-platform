import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import {
  ARCHIVO_PLANTILLA_AGUINALDO_AR,
  NOMBRE_PLANTILLA_AGUINALDO_AR,
  RECURSO_PLANTILLA_AGUINALDO_AR,
} from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "calcular-aguinaldo-excel",
  pais: "ar",
  title: "Cómo calcular el aguinaldo (SAC) en Excel: diciembre 2026",
  meta: "Calculá tu aguinaldo (SAC) de diciembre 2026 en Excel paso a paso: mejor remuneración, proporcional por días, bruto vs. neto, Ley 23.041 y plantilla.",
  h1: "Calculá tu aguinaldo de diciembre 2026 en Excel",
  subtitle:
    "Armá una planilla en Excel con hoja Parametros para calcular el Sueldo Anual Complementario (SAC) en Argentina: mejor remuneración del semestre, proporcional por días trabajados, liquidación final por renuncia o despido y estimación de bruto a neto según Ley 23.041 y LCT.",
  keywordPrincipal: "calcular aguinaldo excel argentina",
  keywords: [
    "calcular aguinaldo excel",
    "calcular SAC en Excel Argentina",
    "aguinaldo diciembre 2026 argentina",
    "aguinaldo proporcional excel",
    "fórmula aguinaldo excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Una planilla de Excel con hoja Parametros y hoja Calculo_SAC que detecta automáticamente la mejor remuneración del semestre con MAX, calcula el SAC completo o proporcional por días trabajados y estima el neto tras aportes.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "25 minutos",
    bullets: [
      "Cálculo del 50 % de la mejor remuneración mensual devengada del semestre (Ley 23.041 y LCT arts. 121–123).",
      "Fórmula de SAC proporcional por días trabajados para ingresos recientes, renuncia o despido.",
      "Hoja Parametros con días del semestre y porcentajes de aportes editables sin fijar números en fórmulas.",
      "Bloques de fórmulas listos en español (;) e inglés (,) más plantilla descargable en .xlsx.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Reglas del SAC y fechas",
      resumen: "Entendé qué conceptos entran en la base y cuándo se paga en junio y diciembre.",
      anchorId: "reglas-sac-argentina",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centralizá días del semestre y porcentajes de aportes en una sola tabla.",
      anchorId: "hoja-parametros-sac",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Mejor remuneración",
      resumen: "Obtené el pico mensual del semestre con MAX y validá conceptos remunerativos.",
      anchorId: "mejor-remuneracion-max",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "SAC completo y proporcional",
      resumen: "Calculá el 50 % o el proporcional por días en ingresos, renuncia o despido.",
      anchorId: "sac-proporcional-dias",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "De bruto a neto",
      resumen: "Restá jubilación, obra social y Ley 19.032 para estimar lo que cobrás en mano.",
      anchorId: "sac-bruto-vs-neto",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web (o Google Sheets con el mismo esquema).",
      "Tus recibos de sueldo brutos mensuales del semestre (julio a diciembre para la segunda cuota, o enero a junio para la primera).",
      "Fecha de ingreso (y fecha de egreso si se trata de una liquidación final por renuncia o despido).",
    ],
    compatibilidadMacWeb:
      "Las funciones MAX, MIN, SI (IF), REDONDEAR (ROUND) y SIFECHA/resta de fechas funcionan igual en Windows, macOS y Excel para la Web.",
    avisoEducativo:
      "Guía educativa de modelado en Excel; no constituye asesoría legal ni contable. Verificá siempre tu convenio colectivo, conceptos no remunerativos y normativa vigente en argentina.gob.ar e InfoLEG.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Portal argentina.gob.ar",
    "InfoLEG (Ley 23.041 y Ley de Contrato de Trabajo)",
  ],
  insumosHowTo: [
    "Remuneraciones brutas mensuales del semestre",
    "Fecha de ingreso y fecha de cierre del semestre o egreso",
  ],
  secciones: [
    {
      id: "reglas-sac-argentina",
      titulo: "Reglas del aguinaldo (SAC) en Argentina y fechas de pago",
      esPasoHowTo: true,
      resumenHowTo:
        "Identificá la base remunerativa del semestre (50 % de la mejor remuneración mensual según Ley 23.041 y LCT arts. 121–123) y las fechas de vencimiento de junio y diciembre.",
      parrafos: [
        "En Argentina, el Sueldo Anual Complementario (SAC) equivale al 50 % de la mayor remuneración mensual devengada por todo concepto dentro de cada semestre calendario, conforme a la Ley 23.041 y los artículos 121 a 123 de la Ley de Contrato de Trabajo (LCT).",
        "Se paga en dos cuotas anuales: la primera con vencimiento el 30 de junio (semestre enero–junio) y la segunda con vencimiento el 18 de diciembre (semestre julio–diciembre). Si en diciembre la remuneración de ese mes todavía no cerró al momento de liquidar, se calcula sobre la mejor remuneración devengada hasta entonces y luego se reajusta si diciembre resulta mayor, según la LCT.",
        "Para comparar tu aguinaldo en términos reales frente a la suba de precios, podés cruzar tu serie salarial con el [monitor de inflación de Argentina](/ar/datos/inflacion) y otros indicadores en [datos de Argentina](/ar/datos).",
      ],
      tabla: {
        caption: "Resumen normativo del SAC en Argentina (Ley 23.041 y LCT arts. 121–123)",
        encabezados: [
          "Cuota / Situación",
          "Período evaluado",
          "Fecha límite de pago",
          "Criterio de cálculo",
        ],
        filas: [
          [
            "1.ª cuota del SAC",
            "1 de enero al 30 de junio",
            "30 de junio",
            "50 % de la mejor remuneración mensual devengada del 1.º semestre",
          ],
          [
            "2.ª cuota del SAC",
            "1 de julio al 31 de diciembre",
            "18 de diciembre",
            "50 % de la mejor remuneración mensual devengada del 2.º semestre (con ajuste posterior si diciembre la supera)",
          ],
          [
            "Ingreso posterior al inicio del semestre",
            "Desde fecha de ingreso hasta fin del semestre",
            "30 de junio o 18 de diciembre",
            "Proporcional a los días trabajados sobre el total de días del semestre",
          ],
          [
            "Renuncia o despido (liquidación final)",
            "Desde inicio del semestre hasta fecha de egreso",
            "En la liquidación final (según la LCT)",
            "Proporcional a los días trabajados en el semestre en curso",
          ],
        ],
      },
      alerta: {
        tipo: "info",
        titulo: "Qué entra y qué no entra en la base",
        texto:
          "En la mejor remuneración mensual se incluyen sueldo básico, antigüedad, presentismo, horas extras, comisiones y adicionales remunerativos devengados. No se incluyen conceptos no remunerativos (como viáticos con comprobante o asignaciones familiares), salvo que un acuerdo paritario disponga expresamente lo contrario.",
      },
    },
    {
      id: "hoja-parametros-sac",
      titulo: "Armá la hoja Parametros en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Creá una hoja Parametros con las fechas del semestre, la cantidad de días del período y las alícuotas de aportes personales.",
      parrafos: [
        "Antes de escribir fórmulas de cálculo, creá una pestaña llamada Parametros. Así evitás escribir números fijos dentro de cada celda y podés reutilizar el archivo tanto para junio como para diciembre o actualizar porcentajes de aportes en segundos.",
        "Cargá estos valores de referencia en Parametros (columna A = concepto, columna B = valor):",
      ],
      tabla: {
        caption: "Estructura recomendada de la hoja Parametros",
        encabezados: ["Celda", "Parámetro", "Valor ejemplo (2.º sem. 2026)", "Uso en el modelo"],
        filas: [
          ["B2", "Inicio del semestre", "2026-07-01", "Límite inferior para contar días trabajados"],
          ["B3", "Fin del semestre", "2026-12-31", "Límite superior del semestre calendario"],
          ["B4", "Días del semestre", "=B3-B2+1 (184 días)", "Denominador del SAC proporcional"],
          ["B5", "Aporte Jubilación (SIPA)", "11,00%", "Descuento previsional sobre SAC bruto"],
          ["B6", "Aporte Obra Social", "3,00%", "Descuento de obra social sobre SAC bruto"],
          ["B7", "Aporte Ley 19.032 (PAMI)", "3,00%", "Descuento INSSJP sobre SAC bruto"],
          ["B8", "Otros aportes (ej. sindicato)", "0,00%", "Editable según convenio colectivo"],
        ],
      },
    },
    {
      id: "mejor-remuneracion-max",
      titulo: "Calculá la mejor remuneración mensual del semestre con MAX",
      esPasoHowTo: true,
      resumenHowTo:
        "Registrá las remuneraciones brutas mensuales de julio a diciembre y obtené el valor máximo con la función MAX.",
      parrafos: [
        "En una segunda hoja llamada Calculo_SAC, armá una tabla con los seis meses del semestre en B2:B7 (Julio a Diciembre) y la remuneración bruta remunerativa devengada de cada mes en C2:C7.",
        "Si un mes todavía no cerró o no trabajaste el mes completo, dejá la celda en 0 o con el devengado real de ese mes. En la celda C9 obtenés la mejor remuneración mensual del semestre con una fórmula simple:",
      ],
      codigos: [
        {
          titulo: "Mejor remuneración del semestre (celda C9)",
          lenguaje: "excel",
          codigo: "=MAX(C2:C7)",
          codigoEn: "=MAX(C2:C7)",
          nota: "Si trabajaste menos de 6 meses, MAX ignora los ceros y toma el mes remunerativo más alto.",
        },
      ],
    },
    {
      id: "sac-proporcional-dias",
      titulo: "Calculá el SAC completo o proporcional por días (incluye renuncia y despido)",
      esPasoHowTo: true,
      resumenHowTo:
        "Determiná los días trabajados dentro del semestre y aplicá la fórmula del 50 % proporcional en Excel.",
      parrafos: [
        "Si trabajaste todo el semestre, te corresponde el 50 % completo de la mejor remuneración. Si ingresaste después del 1 de julio, o si estás calculando una liquidación final por renuncia o despido antes del 31 de diciembre, corresponde el SAC proporcional al tiempo trabajado en el semestre.",
        "En Calculo_SAC, ingresá tu fecha de ingreso en C11 y la fecha de cierre (31/12/2026 si seguís activo, o tu fecha de egreso en caso de renuncia/despido) en C12. Con MIN y MAX calculamos exactamente los días trabajados dentro del semestre en C13, y en C14 el SAC bruto:",
      ],
      codigos: [
        {
          titulo: "Días trabajados en el semestre (celda C13)",
          lenguaje: "excel",
          codigo: "=MAX(0; MIN(C12; Parametros!$B$3) - MAX(C11; Parametros!$B$2) + 1)",
          codigoEn: "=MAX(0, MIN(C12, Parametros!$B$3) - MAX(C11, Parametros!$B$2) + 1)",
          nota: "Recorta automáticamente las fechas al rango del semestre y devuelve 184 si trabajaste todo el segundo semestre.",
        },
        {
          titulo: "SAC bruto completo o proporcional (celda C14)",
          lenguaje: "excel",
          codigo: "=REDONDEAR((C9 / 2) * (C13 / Parametros!$B$4); 2)",
          codigoEn: "=ROUND((C9 / 2) * (C13 / Parametros!$B$4), 2)",
          nota: "Cuando C13 = 184 y Parametros!$B$4 = 184, el factor es 1 y obtenés exactamente el 50 % de la mejor remuneración.",
        },
      ],
      alerta: {
        tipo: "tip",
        titulo: "Liquidación final por renuncia o despido",
        texto:
          "En caso de renuncia o despido, el cálculo del SAC proporcional es el mismo: poné la fecha de egreso en C12 y tomá la mejor remuneración devengada desde el inicio del semestre hasta la baja.Recordá sumar aparte vacaciones no gozadas y otros rubros indemnizatorios si corresponden.",
      },
    },
    {
      id: "sac-bruto-vs-neto",
      titulo: "Pasá de aguinaldo bruto a neto (aportes y descuentos)",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplicá los descuentos de ley desde la hoja Parametros para estimar el aguinaldo neto a cobrar en mano.",
      parrafos: [
        "El aguinaldo tiene los mismos aportes personales obligatorios que tu sueldo mensual: 11 % de Jubilación (SIPA), 3 % de Obra Social y 3 % de Ley 19.032 (PAMI), lo que suma un 17 % base (más cuota sindical o Impuesto a las Ganancias si tu remuneración supera el mínimo vigente).",
        "En las celdas C16 a C19 calculás cada descuento referenciando Parametros, y en C20 obtenés el aguinaldo neto estimado:",
      ],
      codigos: [
        {
          titulo: "Total de aportes sobre el SAC (celda C19) y SAC neto (celda C20)",
          lenguaje: "excel",
          codigo:
            "// C19: Total aportes\n=REDONDEAR(C14 * SUMA(Parametros!$B$5:$B$8); 2)\n\n// C20: Aguinaldo neto estimado en mano\n=C14 - C19",
          codigoEn:
            "// C19: Total aportes\n=ROUND(C14 * SUM(Parametros!$B$5:$B$8), 2)\n\n// C20: Aguinaldo neto estimado en mano\n=C14 - C19",
          nota: "Si tu sueldo está alcanzado por Ganancias, agregá una fila manual en C21 para restar la retención del recibo.",
        },
      ],
      subsecciones: [
        {
          id: "ejemplo-numerico-diciembre-2026",
          titulo: "Ejemplo rápido de verificación para diciembre 2026",
          parrafos: [
            "Supongamos un salario bruto mensual de julio a noviembre de $ 1.200.000 y un aumento en diciembre a $ 1.350.000, con ingreso previo al 1 de julio de 2026:",
          ],
          lista: [
            "Mejor remuneración del semestre (MAX): $ 1.350.000.",
            "Días trabajados en el 2.º semestre: 184 de 184 días.",
            "SAC bruto: ($ 1.350.000 / 2) × (184 / 184) = $ 675.000.",
            "Aportes base (17 %): $ 675.000 × 0,17 = $ 114.750.",
            "SAC neto estimado en mano: $ 675.000 − $ 114.750 = $ 560.250.",
          ],
        },
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Promediar los sueldos del semestre en lugar de tomar el máximo",
      causa:
        "Usar PROMEDIO(C2:C7) en vez de MAX(C2:C7) reduce el aguinaldo si tuviste aumentos por paritarias o un mes con horas extras.",
      solucion:
        "La Ley 23.041 establece el 50 % de la mayor remuneración mensual devengada del semestre. Usá siempre MAX.",
    },
    {
      error: "Incluir conceptos no remunerativos en la base",
      causa:
        "Sumar montos no remunerativos (viáticos con comprobante, asignaciones familiares) infla la mejor remuneración por encima de lo que figura en el recibo sujeto a aportes.",
      solucion:
        "Cargá en C2:C7 únicamente el total de haberes remunerativos del recibo de sueldo (salvo que tu convenio indique incorporar una suma específica).",
    },
    {
      error: "Olvidar el +1 al restar fechas en Excel",
      causa:
        "La resta FechaFin - FechaInicio excluye el día de inicio y devuelve 183 en lugar de 184 días para el segundo semestre.",
      solucion:
        "Sumá +1 en la fórmula de días trabajados y en la celda de días totales del semestre en Parametros.",
    },
    {
      error: "Error #¡NOMBRE? al copiar fórmulas entre idiomas",
      causa:
        "Usar MAX/MIN/SUM/ROUND en un Excel configurado en español (que espera SUMA y REDONDEAR) o usar punto y coma en Excel en inglés.",
      solucion:
        "Usá el botón ES / EN en los bloques de código de esta guía o descargá la plantilla .xlsx que Excel traduce automáticamente.",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel de Aguinaldo (SAC) Argentina 2026",
    descripcion:
      "Descargá gratis el archivo .xlsx listo con la hoja Parametros, el cálculo de mejor remuneración, SAC proporcional por días y estimado bruto a neto.",
  },
  plantillaArchivo: {
    recurso: RECURSO_PLANTILLA_AGUINALDO_AR,
    archivoUrl: ARCHIVO_PLANTILLA_AGUINALDO_AR,
    nombreArchivo: NOMBRE_PLANTILLA_AGUINALDO_AR,
  },
  faqs: [
    {
      q: "¿Hasta qué fecha se paga el aguinaldo de diciembre 2026 en Argentina?",
      a: "La segunda cuota del SAC vence el 18 de diciembre de cada año según la Ley 23.041 y los artículos 121 a 123 de la LCT. Si el sueldo de diciembre todavía no cerró al momento de liquidar, se estima sobre la mejor remuneración devengada hasta ese momento y la diferencia, si la hubiera, se ajusta al cierre del mes según la LCT.",
    },
    {
      q: "¿Cómo se calcula el aguinaldo proporcional si empecé a trabajar hace menos de 6 meses?",
      a: "Se toma el 50 % de la mejor remuneración mensual devengada desde tu ingreso y se multiplica por la cantidad de días corridos trabajados en el semestre dividida por el total de días del semestre (181 o 182 en el primer semestre; 184 en el segundo).",
    },
    {
      q: "¿Me corresponde aguinaldo si renuncio o me despiden?",
      a: "Sí. En cualquier extinción del contrato de trabajo (renuncia o despido), tenés derecho al SAC proporcional por el tiempo trabajado durante el semestre en curso, que se abona dentro de la liquidación final.",
    },
    {
      q: "¿Qué descuentos tiene el aguinaldo en el recibo de sueldo?",
      a: "Sobre el SAC bruto se aplican los aportes personales obligatorios: 11 % de Jubilación, 3 % de Obra Social y 3 % de Ley 19.032 (17 % base), más cuota sindical si corresponde y retención de Ganancias en caso de corresponder.",
    },
  ],
  relacionadas: [
    "buscarv-y-buscarx-en-excel",
    "automatizar-excel-con-power-query",
    "ia-para-excel-chatgpt-claude-gemini",
  ],
  enlacesExternos: [
    {
      label: "Ley 23.041 — Sueldo Anual Complementario",
      url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/27239/norma.htm",
      fuente: "InfoLEG",
    },
    {
      label: "Ley de Contrato de Trabajo N° 20.744 (arts. 121–123)",
      url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25552/texact.htm",
      fuente: "InfoLEG",
    },
    {
      label: "Información oficial sobre aguinaldo (SAC)",
      url: "https://www.argentina.gob.ar/trabajo",
      fuente: "argentina.gob.ar",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo para Argentina",
      href: "/ar/cursos/excel",
      descripcion: "Aprendé fórmulas, tablas dinámicas y automatización en vivo con docentes.",
    },
    {
      label: "Monitor de inflación en Argentina",
      href: "/ar/datos/inflacion",
      descripcion: "Compará tu aguinaldo y salario contra la variación mensual del IPC.",
    },
    {
      label: "Datos económicos y laborales de Argentina",
      href: "/ar/datos",
      descripcion: "Series oficiales y herramientas prácticas para analizar tu ingreso.",
    },
  ],
};
