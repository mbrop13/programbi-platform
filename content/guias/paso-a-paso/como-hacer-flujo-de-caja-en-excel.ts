import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "como-hacer-flujo-de-caja-en-excel",
  title: "Cómo hacer un flujo de caja en Excel paso a paso (2026)",
  meta: "Arma un flujo de caja mensual y proyectado a 12 meses en Excel con fórmulas, saldo acumulado y alertas de caja negativa. Ejemplo completo en CLP.",
  h1: "Cómo hacer un flujo de caja en Excel (mensual y proyectado)",
  subtitle:
    "Diseña desde cero un flujo de caja real y proyectado a 12 meses en pesos chilenos, separando ingresos efectivos, egresos por categoría, saldo acumulado, alertas de liquidez y gráfico de cascada.",
  keywordPrincipal: "como hacer un flujo de caja en Excel",
  keywords: [
    "como hacer un flujo de caja en Excel",
    "flujo de caja proyectado",
    "flujo de caja mensual",
    "ejemplo de flujo de caja Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un modelo de flujo de caja en Excel con hoja de movimientos (tblMov), resumen mensual automático, proyección a 12 meses con supuestos editables, semáforo visual de caja negativa y gráfico de cascada.",
    herramienta: "Excel (Tablas, SUMAR.SI.CONJUNTO, LET, Formato condicional y Gráfico de cascada)",
    tiempo: "25 minutos",
    bullets: [
      "Distingues flujo de caja real (efectivo que entra y sale) de un estado de resultados contable.",
      "Consolidas cobros y pagos desde tblMov con SUMAR.SI.CONJUNTO y encadenas el saldo inicial con el saldo final acumulado.",
      "Proyectas 12 meses con la función LET y detectas meses con déficit de liquidez antes de que ocurran.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Concepto y estructura",
      resumen: "Flujo de caja vs estado de resultados y bloques del modelo.",
      anchorId: "flujo-vs-estado-resultados",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Tabla tblMov",
      resumen: "Registra cada ingreso y egreso con fecha efectiva de pago.",
      anchorId: "tabla-movimientos-tblmov",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Resumen y saldo",
      resumen: "Resume por mes con SUMAR.SI.CONJUNTO y calcula saldo acumulado.",
      anchorId: "resumen-mensual-y-saldo",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Proyección 12M",
      resumen: "Modela supuestos de crecimiento y estacionalidad con LET.",
      anchorId: "proyeccion-12-meses-let",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Semáforo y cascada",
      resumen: "Alerta saldos negativos y grafica la variación de caja.",
      anchorId: "semaforo-y-grafico-cascada",
      icono: "chart",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior (Microsoft 365 o Excel 2021 recomendado para usar la función LET y el gráfico de cascada nativo).",
    lista: [
      "Lista de movimientos bancarios o registro de cobros y pagos con fecha efectiva.",
      "Saldo inicial de caja disponible en banco al comienzo del primer mes del modelo.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas usadas (SUMAR.SI.CONJUNTO, LET y formato condicional) funcionan en Excel para Windows, Excel para Mac y Excel para la Web. El gráfico de cascada está disponible desde Excel 2016 en adelante en Windows y Mac.",
  },
  herramientasHowTo: [
    "Microsoft Excel (Windows, Mac o Web)",
    "Tablas estructuradas de Excel",
  ],
  insumosHowTo: [
    "Saldo inicial de caja en CLP",
    "Registro de ingresos y egresos por fecha de pago efectivo",
  ],
  secciones: [
    {
      id: "flujo-vs-estado-resultados",
      titulo: "Flujo de caja vs estado de resultados y estructura base del modelo",
      esPasoHowTo: false,
      parrafos: [
        "Muchas pymes rentables en el papel quiebran por falta de liquidez. El error clásico es confundir el Estado de Resultados (donde una factura emitida a 60 días ya cuenta como venta del mes) con el Flujo de Caja (donde ese dinero solo existe cuando efectivamente entra a la cuenta corriente). En el flujo de caja manda la fecha de pago o cobro real, con IVA incluido si corresponde al movimiento de dinero efectivo.",
        "Para que tu planilla sea fácil de auditar, organiza el reporte mensual en cuatro bloques verticales claros: Saldo inicial de caja (que en el mes 2 en adelante es exactamente igual al saldo final del mes anterior), Total de ingresos operacionales y no operacionales, Total de egresos (remuneraciones, proveedores, arriendo, impuestos, cuotas de crédito) y Saldo final acumulado.",
        "En una empresa chilena típica, este orden te permite responder preguntas críticas de tesorería con anticipación: saber si el pago del F29 el día 20 o el pago de remuneraciones a fin de mes dejarán la cuenta corriente bajo tu colchón mínimo, y decidir con semanas de ventaja si conviene acelerar cobranzas, postergar una compra de activo o usar una línea de crédito.",
      ],
      tabla: {
        caption: "Diferencias prácticas entre Flujo de Caja y Estado de Resultados",
        encabezados: [
          "Criterio",
          "Flujo de Caja (Tesorería)",
          "Estado de Resultados (Contable)",
        ],
        filas: [
          [
            "Principio de registro",
            "Base percibida / pagada (cuando entra o sale el dinero)",
            "Base devengada (cuando se emite la factura o nace el gasto)",
          ],
          [
            "IVA en las cifras",
            "Se incluye el monto bruto pagado o cobrado, más el pago mensual del F29",
            "Se registra en valores netos (sin IVA)",
          ],
          [
            "Depreciación y amortización",
            "No aparecen (no son salidas reales de dinero)",
            "Sí se descuentan como gasto contable",
          ],
          [
            "Pregunta que responde",
            "¿Me alcanzará la plata para pagar sueldos y proveedores este mes?",
            "¿El negocio está generando utilidades o pérdidas?",
          ],
        ],
      },
      alerta: {
        tipo: "info",
        titulo: "Sobre los montos de ejemplo de esta guía",
        texto:
          "Todos los valores en pesos chilenos (CLP) mostrados en esta guía —como ventas de $12.500.000 o arriendos de $1.800.000— son montos ficticios creados únicamente para ilustrar las fórmulas y la estructura del flujo.",
      },
    },
    {
      id: "tabla-movimientos-tblmov",
      titulo: "Paso 1: Crear la tabla de movimientos reales (tblMov)",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Movimientos con una tabla estructurada llamada tblMov que registre Fecha, Tipo (Ingreso/Egreso), Categoría, Descripción y Monto en CLP.",
      parrafos: [
        "Nunca escribas sumas manuales escondidas dentro de las celdas del resumen mensual (como =450000+1200000). Separa los datos crudos en una hoja llamada Movimientos. Crea las columnas: Fecha, Mes (calculada automáticamente), Tipo (\"Ingreso\" o \"Egreso\"), Categoría (por ejemplo Ventas, Arriendo, Remuneraciones, Proveedores, F29) y Monto (siempre positivo, en CLP).",
        "Convierte ese rango en una Tabla oficial de Excel presionando Ctrl + T y cámbiale el nombre a tblMov en la pestaña Diseño de tabla. Agrega una columna calculada Mes con la fórmula =FIN.MES([@Fecha];-1)+1 y dale formato mmm-aaaa (por ejemplo ene-2026). Así cada movimiento queda anclado exactamente al primer día de su mes, lo que hará facilísimo cruzarlo en el resumen.",
      ],
      codigos: [
        {
          titulo: "Columna calculada Mes en tblMov para agrupar por inicio de mes",
          lenguaje: "excel",
          codigo: `=FIN.MES([@Fecha];-1)+1`,
          codigoEn: `=EOMONTH([@Fecha],-1)+1`,
          nota: "Aplica formato personalizado mmm-aa a esta columna para ver ene-26, feb-26, etc., conservando la fecha real subyacente.",
        },
      ],
      captura: {
        id: "como-hacer-flujo-de-caja-en-excel-paso-1",
        alt: "Hoja Movimientos en Excel mostrando la tabla estructurada tblMov con columnas Fecha, Mes, Tipo, Categoría, Descripción y Monto en pesos chilenos ficticios",
        caption: "Tabla estructurada tblMov con columna Mes normalizada al día 1 de cada mes.",
        ratio: "16/9",
      },
    },
    {
      id: "resumen-mensual-y-saldo",
      titulo: "Paso 2: Armar el resumen mensual con SUMAR.SI.CONJUNTO y saldo acumulado",
      esPasoHowTo: true,
      resumenHowTo:
        "Construye la matriz mensual en una hoja Flujo_Caja usando fechas reales en los encabezados de columna, extrae los montos desde tblMov con SUMAR.SI.CONJUNTO y encadena el saldo acumulado mes a mes.",
      parrafos: [
        "En una segunda hoja llamada Flujo_Caja, coloca las categorías en la columna A (primero las de Ingresos, luego Subtotal Ingresos, después las de Egresos y Subtotal Egresos) y los 12 meses en la fila 4 desde B4 hasta M4 usando fechas reales del primer día de cada mes (2026-01-01 en B4, =FECHA.MES(B4;1) en C4, etc.).",
        "Para llenar cada categoría en cada mes usa SUMAR.SI.CONJUNTO apuntando a tblMov. Usa referencias mixtas con el signo $ ($A7 para fijar la columna de categoría y B$4 para fijar la fila del mes) de modo que puedas arrastrar la misma fórmula a toda la tabla sin editarla celda por celda.",
        "Debajo de los subtotales calcula Flujo Neto del Mes (=Ingresos - Egresos) y el Saldo Final Acumulado (=Saldo Inicial + Flujo Neto). En el mes 1 (columna B), el Saldo Inicial viene de una celda de parámetro fija (por ejemplo $4.200.000 ficticios en C2); a partir del mes 2 (columna C), la fórmula del Saldo Inicial apunta directamente al Saldo Final de la columna anterior (=B20).",
      ],
      codigos: [
        {
          titulo: "Resumir ingresos o egresos por categoría ($A7) y mes (B$4) desde tblMov",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(tblMov[Monto];tblMov[Categoría];$A7;tblMov[Mes];B$4)`,
          codigoEn: `=SUMIFS(tblMov[Monto],tblMov[Categoría],$A7,tblMov[Mes],B$4)`,
          nota: "Asegúrate de que los nombres de categoría en la columna A coincidan exactamente con los escritos en tblMov[Categoría].",
        },
        {
          titulo: "Fórmula de Saldo Final Acumulado en la fila 20 (mes en columna B)",
          lenguaje: "excel",
          codigo: `=B5+B18`,
          codigoEn: `=B5+B18`,
          nota: "Donde B5 es el Saldo Inicial del mes y B18 es el Flujo Neto del Mes (Ingresos menos Egresos).",
        },
      ],
      captura: {
        id: "como-hacer-flujo-de-caja-en-excel-paso-2",
        alt: "Hoja Flujo_Caja mostrando los encabezados mensuales, fórmulas SUMAR.SI.CONJUNTO por categoría, flujo neto y saldo final acumulado encadenado",
        caption: "Resumen mensual del flujo de caja alimentado desde tblMov con saldo acumulado mes a mes.",
        ratio: "16/9",
      },
    },
    {
      id: "proyeccion-12-meses-let",
      titulo: "Paso 3: Proyectar los próximos 12 meses con supuestos y función LET",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una tabla de supuestos (crecimiento mensual de ventas, variación de costos fijos y margen) y proyecta meses futuros de forma legible con la función LET.",
      parrafos: [
        "Un flujo de caja útil no solo mira hacia atrás: te permite anticipar si dentro de cuatro meses tendrás un bache de caja al pagar aguinaldos, bonos o impuestos anuales. Para proyectar los meses en que aún no hay movimientos reales en tblMov, define un bloque pequeño de Supuestos arriba de la matriz (por ejemplo: Crecimiento mensual de ventas = 3%, Inflación/ajuste de costos = 0,4%).",
        "Con la función LET puedes escribir fórmulas de proyección limpias y autoexplicativas sin repetir subcálculos. En el ejemplo siguiente, la fórmula verifica primero si el mes ya tiene movimientos reales cargados en tblMov; si no los tiene (es un mes futuro), toma el valor del mes anterior y le aplica el factor de crecimiento del supuesto, redondeado a pesos enteros.",
      ],
      codigos: [
        {
          titulo: "Proyección inteligente con LET (usa dato real si existe; si no, proyecta con supuesto $C$2)",
          lenguaje: "excel",
          codigo: `=LET(
    real; SUMAR.SI.CONJUNTO(tblMov[Monto];tblMov[Categoría];$A7;tblMov[Mes];C$4);
    proy; REDONDEAR(B7*(1+$C$2);0);
    SI(real>0; real; proy)
)`,
          codigoEn: `=LET(
    real, SUMIFS(tblMov[Monto],tblMov[Categoría],$A7,tblMov[Mes],C$4),
    proy, ROUND(B7*(1+$C$2),0),
    IF(real>0, real, proy)
)`,
          nota: "Si usas Excel 2016 o 2019 (sin función LET), reemplaza por =SI(SUMAR.SI.CONJUNTO(...)>0; SUMAR.SI.CONJUNTO(...); REDONDEAR(B7*(1+$C$2);0)).",
        },
      ],
      captura: {
        id: "como-hacer-flujo-de-caja-en-excel-paso-3",
        alt: "Barra de fórmulas de Excel mostrando la función LET combinando datos reales y proyección con tasa de crecimiento en un flujo de caja a 12 meses",
        caption: "Proyección automática a 12 meses usando LET y supuestos editables en la cabecera.",
        ratio: "16/9",
      },
    },
    {
      id: "semaforo-y-grafico-cascada",
      titulo: "Paso 4: Semáforo de caja negativa y gráfico de cascada",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica formato condicional rojo/amarillo/verde sobre la fila de Saldo Final Acumulado e inserta un gráfico de cascada sobre el Flujo Neto mensual.",
      parrafos: [
        "Para que cualquier alerta salte a la vista en segundos, selecciona la fila completa de Saldo Final Acumulado (B20:M20), ve a Inicio > Formato condicional > Nueva regla y define tres reglas sencillas: menor que 0 en rojo claro (alerta de sobregiro o necesidad de financiamiento), entre 0 y tu colchón mínimo de seguridad (por ejemplo $1.500.000 ficticios) en amarillo, y mayor al colchón en verde suave. Si aparece una celda roja en el tercer trimestre, sabrás de inmediato cuánto capital de trabajo te falta cubrir.",
        "Finalmente, acompaña la tabla con un Gráfico de cascada (Waterfall): selecciona los encabezados de los 12 meses y la fila de Flujo Neto del Mes, ve a Insertar > Gráficos > Insertar gráfico de cascada. Verás inmediatamente en verde los meses que aportan caja positiva y en rojo los meses que consumen caja, mostrando cómo evoluciona el acumulado a lo largo del año sin necesidad de leer veinte filas de números.",
      ],
      captura: {
        id: "como-hacer-flujo-de-caja-en-excel-paso-4",
        alt: "Flujo de caja en Excel con semáforo de formato condicional en la fila de saldo acumulado y gráfico de cascada mostrando meses positivos y negativos",
        caption: "Semáforo de liquidez sobre el saldo acumulado y gráfico de cascada de los flujos mensuales.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "El Saldo Final se duplica o suma los ingresos dos veces al arrastrar la fórmula",
      causa:
        "En la fórmula del Saldo Final se incluyó el rango de categorías individuales además de la fila de Subtotal Ingresos.",
      solucion:
        "Calcula el Flujo Neto restando exclusivamente Subtotal Ingresos menos Subtotal Egresos, y suma ese Flujo Neto al Saldo Inicial.",
    },
    {
      error: "SUMAR.SI.CONJUNTO devuelve 0 en todos los meses",
      causa:
        "Los encabezados de mes en la fila 4 están escritos como texto (\"Enero\") mientras que tblMov[Mes] contiene fechas reales (2026-01-01).",
      solucion:
        "Usa siempre fechas reales del primer día del mes en B4:M4 y aplica formato de celda mmm-aa para que se vean como texto amigable.",
    },
    {
      error: "Los egresos aparecen positivos y terminan sumando al saldo en vez de restar",
      causa:
        "Se guardaron los montos de egresos en positivo en tblMov y luego se sumó el rango completo sin restar el subtotal de egresos.",
      solucion:
        "Mantén todos los montos positivos en tblMov para simplificar la digitación, y asegúrate de que Flujo Neto sea =Subtotal_Ingresos - Subtotal_Egresos.",
    },
    {
      error: "Error #¿NOMBRE? al escribir la fórmula LET",
      causa:
        "El archivo se está abriendo en Excel 2016 o 2019, versiones que no incorporan la función LET.",
      solucion:
        "Reemplaza la expresión LET por un SI tradicional con las expresiones inline, tal como se indica en la nota del Paso 3.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Flujo de Caja Mensual y Proyectado 12M (CLP)",
    descripcion:
      "Libro .xlsx con tabla tblMov, resumen mensual automatizado con SUMAR.SI.CONJUNTO, bloque de supuestos con LET, semáforo de caja y gráfico de cascada. Próximamente disponible para descarga.",
  },
  faqs: [
    {
      q: "¿Los montos del flujo de caja deben ir con IVA o sin IVA?",
      a: "Con IVA incluido. El flujo de caja refleja el dinero efectivo que entra y sale de la cuenta bancaria; cuando pagas una factura de proveedor o cobras a un cliente, el movimiento bancario incluye el 19% de IVA, y luego el pago mensual del F29 se registra como otro egreso.",
    },
    {
      q: "¿Conviene llevar el flujo de caja semanal o mensual?",
      a: "Para planificación anual y evaluación de proyectos, el flujo mensual a 12 meses es el estándar. Si tu empresa tiene alta rotación de caja diaria o vencimientos muy concentrados los días 5 y 30, puedes duplicar la misma lógica cambiando FIN.MES por el lunes de cada semana.",
    },
    {
      q: "¿Cómo registro un crédito bancario o aporte de capital en el flujo?",
      a: "Inclúyelos en una sección separada llamada Flujo de Financiamiento (debajo del flujo operacional) o como categorías específicas dentro de tblMov (por ejemplo Ingreso por Crédito / Cuota Crédito) para no distorsionar la rentabilidad operativa real del negocio.",
    },
    {
      q: "¿Qué pasa si un cliente me paga una factura en dos cuotas?",
      a: "Registra dos filas en tblMov con la fecha real en que entra cada abono a tu cuenta bancaria. Así el flujo reflejará exactamente la disponibilidad de caja de cada mes.",
    },
    {
      q: "¿Cómo incorporo un colchón mínimo de caja para no operar al límite?",
      a: "Define una celda de parámetro con tu reserva mínima de seguridad (por ejemplo, equivalente a un mes de sueldos y arriendo ficticios) y úsala como umbral amarillo en el formato condicional del Saldo Final Acumulado para recibir alertas tempranas.",
    },
  ],
  relacionadas: [
    "como-hacer-presupuesto-en-excel",
    "control-de-gastos-en-excel",
    "como-hacer-dashboard-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de SUMAR.SI.CONJUNTO (SumIfs)",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.sumifs",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de gráficos en Excel (ChartObject)",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.chartobject",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
