export type PlantillaCategory =
  | "Power BI"
  | "SQL Server"
  | "DAX"
  | "Python"
  | "Minería"
  | "Finanzas";

export interface PlantillaFile {
  path: string;
  label: string;
  format: "CSV" | "DAX" | "SQL" | "IPYNB";
  description: string;
}

export interface PlantillaColumn {
  name: string;
  type: string;
  description: string;
}

export interface PlantillaSnippet {
  title: string;
  language: "dax" | "sql" | "python";
  code: string;
  explanation: string;
}

export interface PlantillaFaq {
  question: string;
  answer: string;
}

export interface PlantillaItem {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  summary: string;
  category: PlantillaCategory;
  tool: string;
  level: "Básico" | "Intermedio" | "Básico – Intermedio";
  estimatedTime: string;
  rowCountLabel: string;
  files: PlantillaFile[];
  kpisIncluded: string[];
  datasetColumns: PlantillaColumn[];
  codeSnippets: PlantillaSnippet[];
  stepByStep: string[];
  faqs: PlantillaFaq[];
  relatedCourseSlug: string;
  relatedCourseName: string;
  relatedGuidePath: string;
  relatedGuideLabel: string;
}

export const PLANTILLA_CATEGORIES: readonly PlantillaCategory[] = [
  "Power BI",
  "Finanzas",
  "Minería",
  "SQL Server",
  "DAX",
  "Python",
] as const;

export const PLANTILLAS: PlantillaItem[] = [
  {
    slug: "dashboard-ventas-power-bi",
    title: "Dashboard de Ventas Comerciales en Power BI",
    seoTitle: "Plantilla Dashboard Ventas Power BI Gratis | ProgramBI",
    seoDescription:
      "Descarga el dataset comercial LATAM y el pack de medidas DAX (Ventas, Margen %, YoY, YTD, Ticket Promedio y Ranking) listo para Power BI.",
    h1: "Plantilla de Dashboard de Ventas en Power BI (Dataset + Medidas DAX)",
    summary:
      "Base comercial multi-país (Chile, Argentina, México, Perú, Colombia y Uruguay) junto a un pack completo de medidas DAX listas para conectar y armar tu tablero ejecutivo en minutos.",
    category: "Power BI",
    tool: "Power BI + DAX",
    level: "Básico",
    estimatedTime: "20 min",
    rowCountLabel: "Dataset multi-país + 16 medidas DAX",
    files: [
      {
        path: "/plantillas/plantilla-ventas-powerbi.csv",
        label: "Dataset Ventas LATAM (.csv)",
        format: "CSV",
        description:
          "Transacciones comerciales con fecha, país, moneda, región, vendedor, categoría, unidades, precio, venta neta, costo y margen.",
      },
      {
        path: "/plantillas/medidas-ventas-powerbi.dax",
        label: "Pack de Medidas DAX Comerciales (.dax)",
        format: "DAX",
        description:
          "16 medidas listas para copiar: Ventas Totales, Margen %, Ticket Promedio, YTD, YoY %, MoM % y Ranking de vendedores.",
      },
    ],
    kpisIncluded: [
      "Ventas Totales y Participación %",
      "Margen Bruto y Margen %",
      "Ticket Promedio por transacción",
      "Ventas YTD y Variación YoY %",
      "Ranking dinámico de vendedores y regiones",
      "Top 3 productos con KEEPFILTERS",
    ],
    datasetColumns: [
      { name: "Fecha", type: "Date", description: "Fecha de la transacción (YYYY-MM-DD)." },
      { name: "Pais / Region", type: "Text", description: "País LATAM y región comercial." },
      { name: "Moneda", type: "Text", description: "Código ISO de moneda local (CLP, ARS, MXN, PEN, COP, UYU)." },
      { name: "Vendedor", type: "Text", description: "Nombre del ejecutivo responsable de la venta." },
      { name: "Categoria / Producto", type: "Text", description: "Línea de producto (Software, Hardware, Servicios)." },
      { name: "Unidades / PrecioUnitario", type: "Number", description: "Cantidad vendida y precio unitario en moneda local." },
      { name: "VentaNeta / Costo / Margen", type: "Number", description: "Montos netos para cálculo directo de rentabilidad." },
    ],
    codeSnippets: [
      {
        title: "Margen % con división segura",
        language: "dax",
        code: `Margen % =\nDIVIDE ( SUM ( Ventas[Margen] ), SUM ( Ventas[VentaNeta] ), 0 )`,
        explanation:
          "Usa DIVIDE en lugar del operador / para evitar errores de división por cero cuando un filtro no tiene ventas.",
      },
      {
        title: "Variación interanual (YoY %)",
        language: "dax",
        code: `Variacion YoY % =\nVAR _ly = CALCULATE ( [Ventas Totales], SAMEPERIODLASTYEAR ( Calendario[Fecha] ) )\nRETURN\n    DIVIDE ( [Ventas Totales] - _ly, _ly, 0 )`,
        explanation:
          "Requiere una tabla Calendario continua marcada como tabla de fechas y relacionada con Ventas[Fecha].",
      },
      {
        title: "Ranking dinámico de vendedores",
        language: "dax",
        code: `Ranking Vendedores =\nIF (\n    HASONEVALUE ( Ventas[Vendedor] ),\n    RANKX ( ALLSELECTED ( Ventas[Vendedor] ), [Ventas Totales], , DESC, DENSE )\n)`,
        explanation:
          "Evalúa el puesto de cada ejecutivo respetando los segmentadores externos (país, mes o categoría).",
      },
    ],
    stepByStep: [
      "Descarga el archivo CSV y el pack de medidas DAX desde esta página.",
      "Abre Power BI Desktop → Obtener datos → Texto/CSV y carga plantilla-ventas-powerbi.csv.",
      "Verifica en Power Query que Fecha sea tipo Fecha y los montos sean Número decimal/entero.",
      "Crea una tabla Calendario con CALENDARAUTO() y relaciónala con Ventas[Fecha].",
      "Crea una tabla vacía llamada _Medidas y pega las fórmulas del archivo .dax.",
      "Arma tus tarjetas KPI arriba, gráfico de tendencia por fecha y tabla con Ranking Vendedores.",
    ],
    faqs: [
      {
        question: "¿Por qué el dataset incluye varias monedas?",
        answer:
          "En empresas regionales de LATAM es común recibir ventas en CLP, ARS, MXN o PEN. Así practicas filtrar por país o agregar una tabla de tipo de cambio antes de sumar.",
      },
      {
        question: "¿Necesito una versión paga de Power BI para usarla?",
        answer:
          "No. Power BI Desktop es gratuito en Windows y permite cargar el CSV y crear todas las medidas DAX sin licencia Pro.",
      },
      {
        question: "¿Qué hago si mis medidas de tiempo (YoY / YTD) salen en blanco?",
        answer:
          "Asegúrate de crear una tabla Calendario continua, marcarla como Tabla de Fechas y usar Calendario[Fecha] en los ejes y en las funciones TOTALYTD/SAMEPERIODLASTYEAR.",
      },
      {
        question: "¿Puedo reemplazar el CSV por los datos de mi empresa?",
        answer:
          "Sí. Mantén los mismos nombres de columnas o actualiza el nombre de la tabla en el archivo .dax para reutilizar el modelo completo.",
      },
    ],
    relatedCourseSlug: "power-bi",
    relatedCourseName: "Curso de Power BI en vivo",
    relatedGuidePath: "/guias/como-aprender-power-bi-en-chile",
    relatedGuideLabel: "Guía: Cómo aprender Power BI en Chile",
  },
  {
    slug: "flujo-caja-finanzas-power-bi",
    title: "Control de Gestión y Flujo de Caja en Power BI",
    seoTitle: "Plantilla Flujo de Caja y Presupuesto Power BI | ProgramBI",
    seoDescription:
      "Dataset financiero en CLP (Real vs Presupuesto, EBITDA, Flujo de Caja y Cuentas por Cobrar) más medidas DAX para control de gestión.",
    h1: "Plantilla de Flujo de Caja y Presupuesto vs Real en Power BI",
    summary:
      "Modelo financiero listo para áreas de Control de Gestión y Finanzas: compara presupuesto versus ejecución real en pesos chilenos (CLP), calcula EBITDA, flujo neto acumulado y morosidad de cuentas por cobrar.",
    category: "Finanzas",
    tool: "Power BI + DAX",
    level: "Básico – Intermedio",
    estimatedTime: "25 min",
    rowCountLabel: "72 registros financieros + 14 medidas DAX",
    files: [
      {
        path: "/plantillas/dataset-finanzas-flujo-caja.csv",
        label: "Dataset Financiero Real vs Presupuesto (.csv)",
        format: "CSV",
        description:
          "6 meses de movimientos por centro de costo, cuenta contable, categoría, tipo de flujo (Ingreso/Egreso), estado de pago, presupuesto y real CLP.",
      },
      {
        path: "/plantillas/medidas-finanzas-control-gestion.dax",
        label: "Medidas DAX Finanzas y EBITDA (.dax)",
        format: "DAX",
        description:
          "Desviación %, Cumplimiento Presupuesto %, EBITDA CLP, Margen EBITDA %, Flujo Neto Acumulado y Morosidad CxC %.",
      },
    ],
    kpisIncluded: [
      "Presupuesto vs Real y Desviación %",
      "EBITDA CLP y Margen EBITDA %",
      "Entradas, Salidas y Flujo Neto de Caja",
      "Flujo de Caja Acumulado en el tiempo",
      "Cuentas por Cobrar Pendientes vs Vencidas",
      "Semáforo automático de desviación presupuestaria",
    ],
    datasetColumns: [
      { name: "Fecha / Mes", type: "Date / Text", description: "Cierre mensual contable (enero a junio 2026)." },
      { name: "CentroCosto", type: "Text", description: "Área imputada: Comercial, Operaciones, Administración, Marketing, TI, Finanzas." },
      { name: "CuentaContable", type: "Text", description: "Partida contable (Ventas B2B, Remuneraciones, Licencias Cloud, CxC, etc.)." },
      { name: "Categoria", type: "Text", description: "Clasificación financiera: Operacional, Costo Venta, Gasto Operacional, No Operacional." },
      { name: "TipoFlujo / EstadoPago", type: "Text", description: "Ingreso o Egreso; Pagado, Pendiente o Vencido." },
      { name: "PresupuestoCLP / RealCLP", type: "Number", description: "Montos mensuales presupuestados y ejecutados en pesos chilenos." },
    ],
    codeSnippets: [
      {
        title: "EBITDA CLP calculado desde categorías contables",
        language: "dax",
        code: `EBITDA CLP =\n[Ingresos Operacionales] - ABS ( [Costos Directos] ) - ABS ( [Gastos Administracion y Ventas] )`,
        explanation:
          "Normaliza egresos con ABS() para evitar errores de signo cuando los sistemas ERP exportan costos en negativo.",
      },
      {
        title: "Flujo de caja acumulado",
        language: "dax",
        code: `Flujo Caja Acumulado =\nCALCULATE (\n    [Flujo Neto Caja CLP],\n    FILTER (\n        ALLSELECTED ( Calendario[Fecha] ),\n        Calendario[Fecha] <= MAX ( Calendario[Fecha] )\n    )\n)`,
        explanation:
          "Permite graficar la curva de liquidez acumulada mes a mes respetando los filtros de centro de costo.",
      },
      {
        title: "Morosidad de Cuentas por Cobrar %",
        language: "dax",
        code: `Morosidad CxC % =\nDIVIDE (\n    [Cuentas por Cobrar Vencidas],\n    [Cuentas por Cobrar Pendientes] + [Cuentas por Cobrar Vencidas],\n    0\n)`,
        explanation:
          "Mide qué proporción de la cartera abierta ya superó su fecha de vencimiento.",
      },
    ],
    stepByStep: [
      "Descarga dataset-finanzas-flujo-caja.csv y el archivo de medidas .dax.",
      "Importa el CSV en Power BI Desktop y revisa que PresupuestoCLP y RealCLP sean enteros.",
      "Crea una tabla Calendario relacionada con Finanzas[Fecha].",
      "Agrega las medidas del archivo .dax en una tabla de métricas dedicada.",
      "Usa un gráfico de cascada (Waterfall) para explicar la desviación por CentroCosto y un gráfico combinado para Flujo Neto vs Acumulado.",
    ],
    faqs: [
      {
        question: "¿Cómo maneja el dataset los egresos positivos vs negativos?",
        answer:
          "El CSV trae egresos en negativo (estándar ERP), y las medidas DAX usan ABS() donde corresponde para que el cálculo de EBITDA y Flujo Neto sea siempre consistente.",
      },
      {
        question: "¿Sirve para armar un Estado de Resultados (EERR) en matriz?",
        answer:
          "Sí. Agrupando por Categoria y CuentaContable en un objeto visual Matriz obtienes un EERR interactivo con Real, Presupuesto y Desviación %.",
      },
      {
        question: "¿Se puede conectar con ERP chilenos como Defontana, Softland o SAP?",
        answer:
          "Sí, el esquema de columnas replica los campos mínimos de un libro mayor o balance presupuestario exportado desde esos ERPs.",
      },
      {
        question: "¿Qué visual recomiendan para comparar Real vs Presupuesto?",
        answer:
          "Un gráfico de barras agrupadas o un gráfico de bala (Bullet Chart) con formato condicional basado en la medida Semaforo Presupuesto.",
      },
    ],
    relatedCourseSlug: "power-bi",
    relatedCourseName: "Curso de Power BI en vivo",
    relatedGuidePath: "/cursos/mercado-financiero",
    relatedGuideLabel: "Ver curso de Análisis Financiero",
  },
  {
    slug: "oee-mantenimiento-mineria-power-bi",
    title: "OEE y Mantenimiento de Flota Minera en Power BI",
    seoTitle: "Plantilla OEE Minería y Mantenimiento Power BI | ProgramBI",
    seoDescription:
      "Dataset operacional de camiones CAEX y palas en faenas mineras + medidas DAX de OEE, Disponibilidad Mecánica, Utilización, MTBF y MTTR.",
    h1: "Plantilla de OEE y Confiabilidad de Flota Minera en Power BI",
    summary:
      "Diseñada para ingenieros de confiabilidad, mantenimiento y operaciones mineras. Incluye registros por turno (Día/Noche) de camiones de extracción (CAEX), palas y cargadores con las fórmulas estándar de la industria.",
    category: "Minería",
    tool: "Power BI + DAX",
    level: "Intermedio",
    estimatedTime: "30 min",
    rowCountLabel: "72 turnos de flota + 14 medidas DAX",
    files: [
      {
        path: "/plantillas/dataset-mineria-oee-flota.csv",
        label: "Dataset Operacional Flota Minera (.csv)",
        format: "CSV",
        description:
          "Registros por fecha, turno, faena y equipo (CAEX, Pala, Cargador) con horas calendario, programadas, operativas, detenciones, fallas y tonelaje.",
      },
      {
        path: "/plantillas/medidas-mineria-oee.dax",
        label: "Medidas DAX Minería (OEE, MTBF, MTTR) (.dax)",
        format: "DAX",
        description:
          "Disponibilidad Mecánica %, Utilización Efectiva %, OEE %, MTBF, MTTR, Tonelaje por hora operativa y ranking de equipos.",
      },
    ],
    kpisIncluded: [
      "Disponibilidad Mecánica %",
      "Utilización Efectiva % y Nominal %",
      "OEE % (Overall Equipment Effectiveness)",
      "MTBF (Tiempo Medio Entre Fallas)",
      "MTTR (Tiempo Medio de Reparación)",
      "Tonelaje Movido vs Meta y Ton/Hora Operativa",
    ],
    datasetColumns: [
      { name: "Fecha / Turno", type: "Date / Text", description: "Fecha operacional y turno (Día / Noche de 12 horas)." },
      { name: "Faena / Equipo / TipoEquipo", type: "Text", description: "Faena minera, código de activo (ej. CAEX-101) y tipo de equipo." },
      { name: "HorasCalendario / HorasProgramadas", type: "Number", description: "Horas totales del turno vs horas disponibles tras mantención programada." },
      { name: "HorasOperativas", type: "Number", description: "Horas efectivas en producción moviendo material." },
      { name: "HorasDetencionNoPlanificada / NumFallas", type: "Number", description: "Horas fuera de servicio por falla y conteo de eventos." },
      { name: "TonelajeMovido / MetaTonelaje", type: "Number", description: "Toneladas reales movidas y meta asignada por turno." },
    ],
    codeSnippets: [
      {
        title: "Disponibilidad Mecánica %",
        language: "dax",
        code: `Disponibilidad Mecanica % =\nDIVIDE (\n    [Horas Programadas] - [Horas Detencion No Planificada],\n    [Horas Programadas],\n    0\n)`,
        explanation:
          "Mide el porcentaje del tiempo programado en que el equipo estuvo mecánicamente apto para operar.",
      },
      {
        title: "MTBF y MTTR (Confiabilidad)",
        language: "dax",
        code: `MTBF Horas =\nDIVIDE ( [Horas Operativas], [Numero de Fallas], BLANK () )\n\nMTTR Horas =\nDIVIDE ( [Horas Detencion No Planificada], [Numero de Fallas], BLANK () )`,
        explanation:
          "Si un equipo no tuvo fallas en el filtro seleccionado, devuelve BLANK() en lugar de 0 para no distorsionar promedios.",
      },
      {
        title: "OEE % compuesto",
        language: "dax",
        code: `OEE % =\n[Disponibilidad Mecanica %] * [Utilizacion Efectiva %] * MIN ( [Cumplimiento Tonelaje %], 1 )`,
        explanation:
          "Combina disponibilidad, utilización y rendimiento acotado al 100% para reflejar la eficiencia global real.",
      },
    ],
    stepByStep: [
      "Descarga el dataset de flota minera y el archivo medidas-mineria-oee.dax.",
      "Carga el CSV en Power BI Desktop asegurando tipos decimales para las columnas de horas.",
      "Importa las medidas DAX y formatea Disponibilidad, Utilización y OEE como Porcentaje (1 decimal).",
      "Crea un gráfico de dispersión (Scatter) con MTBF en el eje X y MTTR en el eje Y para identificar equipos críticos (Jack-Knife).",
      "Agrega segmentadores por Faena, TipoEquipo y Turno (Día vs Noche).",
    ],
    faqs: [
      {
        question: "¿Por qué usar SUM() dentro de las medidas en lugar de promedios simples?",
        answer:
          "En mantenimiento minero promediar porcentajes de turnos distintos da un resultado erróneo (falacia del promedio). Siempre se suman primero las horas totales y luego se dividen.",
      },
      {
        question: "¿Qué diferencia hay entre Disponibilidad Mecánica y Utilización Efectiva?",
        answer:
          "La disponibilidad depende de mantenimiento (fallas); la utilización mide cuánto tiempo de ese equipo disponible fue efectivamente aprovechado por operaciones.",
      },
      {
        question: "¿Puedo adaptar este modelo a plantas concentradoras o chancado?",
        answer:
          "Sí, solo reemplaza Equipo por TAG de equipo de planta y TonelajeMovido por TPH (toneladas por hora) procesadas.",
      },
      {
        question: "¿Incluyen gráficos Jack-Knife o Pareto de fallas?",
        answer:
          "Con MTBF y MTTR ya incluidos puedes armar el diagrama Jack-Knife nativo en un gráfico de dispersión de Power BI en 2 minutos.",
      },
    ],
    relatedCourseSlug: "analitica-mineria",
    relatedCourseName: "Curso de Analítica de Datos para Minería",
    relatedGuidePath: "/cursos/analitica-mineria",
    relatedGuideLabel: "Ver programa Analítica en Minería",
  },
  {
    slug: "control-inventario-stock-power-bi",
    title: "Control de Inventario, Quiebres y Clasificación ABC en Power BI",
    seoTitle: "Plantilla Control de Inventario y ABC Power BI | ProgramBI",
    seoDescription:
      "Dataset de 30 SKUs en 2 bodegas + medidas DAX para Días de Inventario, Quiebre de Stock %, Rotación anual y Clasificación ABC dinámica.",
    h1: "Plantilla de Control de Inventario y Clasificación ABC en Power BI",
    summary:
      "Optimiza capital de trabajo y evita quiebres de stock. Incluye un dataset de 60 registros multi-bodega y fórmulas DAX avanzadas para calcular cobertura en días, rotación y Pareto ABC dinámico.",
    category: "Power BI",
    tool: "Power BI + DAX",
    level: "Intermedio",
    estimatedTime: "25 min",
    rowCountLabel: "60 registros SKU-Bodega + 12 medidas DAX",
    files: [
      {
        path: "/plantillas/dataset-inventario-retail.csv",
        label: "Dataset Inventario Multi-Bodega (.csv)",
        format: "CSV",
        description:
          "30 SKUs en bodegas Santiago Centro y Antofagasta con stock inicial, entradas, salidas, stock final, mínimo, costo, precio y venta 30 días.",
      },
      {
        path: "/plantillas/medidas-inventario-abc.dax",
        label: "Medidas DAX Inventario y ABC (.dax)",
        format: "DAX",
        description:
          "Valorización de inventario, Días de cobertura, Rotación anual, Quiebre de Stock %, SKUs bajo mínimo y Clase ABC dinámica.",
      },
    ],
    kpisIncluded: [
      "Valorización de Stock a Costo y Precio Venta",
      "Días de Inventario (Cobertura)",
      "Quiebre de Stock % y SKUs Bajo Mínimo",
      "Rotación Anual de Inventario (veces)",
      "Clasificación ABC dinámica (80 / 15 / 5)",
      "Estado de reposición por SKU",
    ],
    datasetColumns: [
      { name: "FechaCorte / Bodega", type: "Date / Text", description: "Fecha de inventario y centro de distribución." },
      { name: "SKU / Producto / Categoria", type: "Text", description: "Identificador único de producto, nombre y familia." },
      { name: "StockInicial / Entradas / Salidas / StockFinal", type: "Integer", description: "Movimiento mensual de unidades." },
      { name: "StockMinimo / LeadTimeDias", type: "Integer", description: "Umbral de seguridad y días de reposición del proveedor." },
      { name: "CostoUnitarioCLP / PrecioVentaCLP", type: "Number", description: "Costeo y precio de lista en CLP." },
      { name: "VentaUltimos30Dias", type: "Integer", description: "Unidades desplazadas en los últimos 30 días para cálculo de cobertura." },
    ],
    codeSnippets: [
      {
        title: "Días de Inventario (Cobertura)",
        language: "dax",
        code: `Dias de Inventario =\nDIVIDE (\n    [Stock Actual Unidades],\n    DIVIDE ( SUM ( Inventario[VentaUltimos30Dias] ), 30, 0 ),\n    BLANK ()\n)`,
        explanation:
          "Estima cuántos días durará el stock actual al ritmo de venta promedio de los últimos 30 días.",
      },
      {
        title: "Quiebre de Stock %",
        language: "dax",
        code: `Quiebre de Stock % =\nDIVIDE (\n    CALCULATE ( DISTINCTCOUNT ( Inventario[SKU] ), Inventario[StockFinal] = 0 ),\n    DISTINCTCOUNT ( Inventario[SKU] ),\n    0\n)`,
        explanation:
          "Mide el porcentaje del catálogo que se encuentra sin unidades disponibles en la bodega seleccionada.",
      },
      {
        title: "Clasificación ABC dinámica en DAX",
        language: "dax",
        code: `Clase ABC =\nVAR _pct = [Participacion Acumulada ABC %]\nRETURN\n    SWITCH (\n        TRUE (),\n        ISBLANK ( _pct ), BLANK (),\n        _pct <= 0.80, "A (80%)",\n        _pct <= 0.95, "B (15%)",\n        "C (5%)"\n    )`,
        explanation:
          "Clasifica cada SKU dinámicamente según el filtro de bodega o categoría aplicado en el reporte.",
      },
    ],
    stepByStep: [
      "Descarga dataset-inventario-retail.csv y medidas-inventario-abc.dax.",
      "Carga el CSV en Power BI Desktop y verifica los tipos numéricos enteros.",
      "Crea las medidas DAX y formatea Valor Inventario CLP como moneda sin decimales.",
      "Construye una tabla de alertas filtrada por Estado Stock = 'Quiebre' o 'Reponer urgente'.",
      "Agrega un gráfico de barras apiladas por Clase ABC y Bodega para priorizar compras.",
    ],
    faqs: [
      {
        question: "¿Por qué calcular la Clase ABC como medida y no como columna calculada?",
        answer:
          "Una columna calculada es estática para toda la empresa. Como medida DAX, la clasificación ABC se recalcula al instante si filtras por una sola bodega o categoría.",
      },
      {
        question: "¿Cómo detecto exceso de inventario (sobrestock)?",
        answer:
          "Combina la medida Dias de Inventario > 90 con Clase ABC = 'C (5%)': ahí suele estar el capital inmovilizado.",
      },
      {
        question: "¿El dataset contempla quiebres reales?",
        answer:
          "Sí, incluye SKUs específicos con StockFinal = 0 y varios por debajo del StockMinimo para probar alertas y formatos condicionales.",
      },
      {
        question: "¿Puedo agregar punto de reorden usando LeadTimeDias?",
        answer:
          "Sí: multiplica Venta Diaria Promedio * LeadTimeDias + StockMinimo en una nueva medida para proyectar la fecha exacta de pedido.",
      },
    ],
    relatedCourseSlug: "power-bi",
    relatedCourseName: "Curso de Power BI en vivo",
    relatedGuidePath: "/guias/funciones-dax-mas-importantes",
    relatedGuideLabel: "Guía: Funciones DAX más importantes",
  },
  {
    slug: "rrhh-dotacion-rotacion-power-bi",
    title: "People Analytics: Dotación, Rotación y Ausentismo en Power BI",
    seoTitle: "Plantilla RRHH Dotación y Rotación Power BI | ProgramBI",
    seoDescription:
      "Dataset de recursos humanos con 65 colaboradores + medidas DAX de Headcount, Tasa de Rotación %, Ausentismo %, Antigüedad y Masa Salarial.",
    h1: "Plantilla de RRHH: Dotación, Rotación y Ausentismo en Power BI",
    summary:
      "Tablero listo para áreas de Personas / People Analytics. Analiza dotación activa por gerencia y sede, separa rotación voluntaria de involuntaria, mide ausentismo laboral y controla la masa salarial en CLP.",
    category: "Power BI",
    tool: "Power BI + DAX",
    level: "Básico – Intermedio",
    estimatedTime: "20 min",
    rowCountLabel: "65 colaboradores + 11 medidas DAX",
    files: [
      {
        path: "/plantillas/dataset-rrhh-dotacion.csv",
        label: "Dataset Dotación RRHH (.csv)",
        format: "CSV",
        description:
          "Nómina con ID empleado, gerencia, área, cargo, tipo contrato, sede, fechas de ingreso/egreso, motivo, sueldo bruto CLP y días de ausencia.",
      },
      {
        path: "/plantillas/medidas-rrhh-rotacion.dax",
        label: "Medidas DAX People Analytics (.dax)",
        format: "DAX",
        description:
          "Headcount Activo, Tasa de Rotación %, Rotación Voluntaria %, Ausentismo %, Antigüedad promedio en años y Masa Salarial CLP.",
      },
    ],
    kpisIncluded: [
      "Headcount Activo y Distribución por Gerencia",
      "Tasa de Rotación Total % y Voluntaria %",
      "Tasa de Ausentismo Laboral %",
      "Antigüedad Promedio (años)",
      "Masa Salarial Mensual y Sueldo Promedio CLP",
    ],
    datasetColumns: [
      { name: "ID_Empleado / Estado", type: "Text", description: "Identificador único y estado actual (Activo / Egresado)." },
      { name: "Gerencia / Area / Cargo", type: "Text", description: "Estructura organizacional completa." },
      { name: "TipoContrato / Sede", type: "Text", description: "Indefinido o Plazo Fijo; Santiago, Antofagasta, Viña del Mar, Concepción." },
      { name: "FechaIngreso / FechaEgreso", type: "Date", description: "Fechas contractuales para cálculo de antigüedad y rotación." },
      { name: "MotivoEgreso", type: "Text", description: "Renuncia voluntaria o Término contrato." },
      { name: "SueldoBrutoCLP", type: "Number", description: "Remuneración bruta mensual en pesos chilenos." },
      { name: "DiasAusenciaMes / DiasLaboralesMes", type: "Integer", description: "Días de licencia/ausencia frente a días hábiles del mes." },
    ],
    codeSnippets: [
      {
        title: "Tasa de Rotación %",
        language: "dax",
        code: `Tasa Rotacion % =\nDIVIDE ( [Egresos del Periodo], [Dotacion Promedio], 0 )`,
        explanation:
          "Usa la dotación promedio del período en el denominador para reflejar fielmente la rotación en equipos que crecen o se achican.",
      },
      {
        title: "Tasa de Ausentismo %",
        language: "dax",
        code: `Tasa Ausentismo % =\nDIVIDE ( SUM ( Dotacion[DiasAusenciaMes] ), SUM ( Dotacion[DiasLaboralesMes] ), 0 )`,
        explanation:
          "Mide el porcentaje de jornadas laborales perdidas por licencias o inasistencias sobre el total de días hábiles.",
      },
      {
        title: "Antigüedad promedio en años (AVERAGEX)",
        language: "dax",
        code: `Antiguedad Promedio Años =\nAVERAGEX (\n    FILTER ( Dotacion, Dotacion[Estado] = "Activo" ),\n    DIVIDE ( DATEDIFF ( Dotacion[FechaIngreso], TODAY (), DAY ), 365.25 )\n)`,
        explanation:
          "Calcula la antigüedad exacta solo sobre los colaboradores vigentes, evitando sesgar el promedio con personal egresado.",
      },
    ],
    stepByStep: [
      "Descarga dataset-rrhh-dotacion.csv y medidas-rrhh-rotacion.dax.",
      "Importa el CSV en Power BI Desktop y convierte FechaIngreso y FechaEgreso a tipo Fecha.",
      "Pega las medidas DAX en tu tabla de métricas.",
      "Visualiza Rotación % vs Ausentismo % por Gerencia y Sede para detectar focos de fuga de talento.",
      "Aplica seguridad a nivel de fila (RLS) si vas a compartir el tablero con jefaturas por gerencia.",
    ],
    faqs: [
      {
        question: "¿Por qué separar rotación voluntaria de total?",
        answer:
          "La rotación voluntaria (renuncias) mide clima, compensación y liderazgo; la involuntaria responde a término de proyectos o reestructuraciones.",
      },
      {
        question: "¿Cómo protejo los sueldos si comparto el dashboard?",
        answer:
          "En Power BI puedes configurar Row-Level Security (RLS) por Gerencia o mantener las medidas salariales en una vista restringida para RRHH y Gerencia General.",
      },
      {
        question: "¿Puedo conectar esto con Buk, Talana o Rex+?",
        answer:
          "Sí, estas plataformas exportan nóminas mensuales con exactamente estos campos (ID, centro de costo, fechas, ausencias y sueldo imponible/bruto).",
      },
      {
        question: "¿El dataset incluye datos personales reales?",
        answer:
          "No, todos los registros son sintéticos y anonimizados con IDs ficticios (EMP-1001 en adelante).",
      },
    ],
    relatedCourseSlug: "analisis-de-datos",
    relatedCourseName: "Programa Análisis de Datos Completo",
    relatedGuidePath: "/guias/como-aprender-power-bi-en-chile",
    relatedGuideLabel: "Guía: Análisis de datos y Power BI",
  },
  {
    slug: "ejercicios-sql-server-entrevistas",
    title: "40 Ejercicios de SQL Server Resueltos para Entrevistas",
    seoTitle: "40 Ejercicios SQL Server Resueltos Entrevistas | ProgramBI",
    seoDescription:
      "Script .sql completo con tablas, datos semilla y 40 ejercicios resueltos de SQL Server: JOINs, CTEs, CASE, agregaciones y Window Functions.",
    h1: "40 Ejercicios de SQL Server (T-SQL) Resueltos para Entrevistas Técnicas",
    summary:
      "Script autocontenido para ejecutar en SQL Server (SSMS o Azure Data Studio). Crea 5 tablas comerciales con datos reales de LATAM y resuelve 40 preguntas típicas de entrevistas de Analista de Datos, BI e Ingeniero de Datos.",
    category: "SQL Server",
    tool: "SQL Server (T-SQL)",
    level: "Básico – Intermedio",
    estimatedTime: "60 min",
    rowCountLabel: "5 tablas + 40 consultas resueltas",
    files: [
      {
        path: "/plantillas/50-ejercicios-sql-server-resueltos.sql",
        label: "Script SQL Server Completo + 40 Soluciones (.sql)",
        format: "SQL",
        description:
          "Incluye CREATE TABLE, INSERT con datos semilla y 40 consultas comentadas desde SELECT básico hasta DENSE_RANK, LAG y Pareto 80/20.",
      },
    ],
    kpisIncluded: [
      "Bloque 1: Filtros, ORDER BY, TOP y agregaciones (1–10)",
      "Bloque 2: INNER/LEFT JOIN, Anti-Join y HAVING (11–20)",
      "Bloque 3: CTEs, Pivoteo con CASE y Cohortes (21–30)",
      "Bloque 4: Window Functions (ROW_NUMBER, LAG, NTILE, Running Total) (31–40)",
    ],
    datasetColumns: [
      { name: "dbo.Clientes", type: "Tabla", description: "ClienteID, Nombre, Ciudad, Pais, Segmento, FechaRegistro." },
      { name: "dbo.Vendedores", type: "Tabla", description: "VendedorID, Nombre, Equipo, MetaMensualCLP." },
      { name: "dbo.Productos", type: "Tabla", description: "ProductoID, SKU, Nombre, Categoria, PrecioUnitarioCLP, CostoUnitarioCLP." },
      { name: "dbo.Pedidos", type: "Tabla", description: "PedidoID, ClienteID, VendedorID, FechaPedido, Estado." },
      { name: "dbo.DetallePedidos", type: "Tabla", description: "DetalleID, PedidoID, ProductoID, Cantidad, DescuentoPct." },
    ],
    codeSnippets: [
      {
        title: "Top 1 producto por categoría (ROW_NUMBER + CTE)",
        language: "sql",
        code: `WITH ProdCat AS (\n    SELECT\n        pr.Categoria,\n        pr.Nombre,\n        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP,\n        ROW_NUMBER() OVER (\n            PARTITION BY pr.Categoria\n            ORDER BY SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) DESC\n        ) AS rn\n    FROM dbo.DetallePedidos d\n    JOIN dbo.Pedidos p ON d.PedidoID = p.PedidoID AND p.Estado = 'Completado'\n    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID\n    GROUP BY pr.Categoria, pr.Nombre\n)\nSELECT Categoria, Nombre, VentaCLP FROM ProdCat WHERE rn = 1;`,
        explanation:
          "Una de las preguntas más repetidas en entrevistas técnicas: obtener el líder dentro de cada grupo sin perder columnas.",
      },
      {
        title: "Variación mes a mes (MoM %) con LAG()",
        language: "sql",
        code: `WITH Mensual AS (\n    SELECT FORMAT(p.FechaPedido, 'yyyy-MM') AS Mes,\n           SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaMes\n    FROM dbo.Pedidos p\n    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID\n    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID\n    WHERE p.Estado = 'Completado'\n    GROUP BY FORMAT(p.FechaPedido, 'yyyy-MM')\n)\nSELECT Mes, VentaMes,\n       LAG(VentaMes) OVER (ORDER BY Mes) AS VentaMesAnterior,\n       CAST(100.0 * (VentaMes - LAG(VentaMes) OVER (ORDER BY Mes)) / NULLIF(LAG(VentaMes) OVER (ORDER BY Mes), 0) AS DECIMAL(6,2)) AS VariacionMoMPct\nFROM Mensual;`,
        explanation:
          "Evita self-joins costosos usando LAG() y protege divisiones por cero con NULLIF().",
      },
      {
        title: "Anti-Join: clientes sin pedidos",
        language: "sql",
        code: `SELECT c.ClienteID, c.Nombre, c.Ciudad\nFROM dbo.Clientes c\nLEFT JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID\nWHERE p.PedidoID IS NULL;`,
        explanation:
          "Patrón clásico para detectar registros huérfanos o clientes sin actividad.",
      },
    ],
    stepByStep: [
      "Descarga el archivo 50-ejercicios-sql-server-resueltos.sql.",
      "Abre SQL Server Management Studio (SSMS) o Azure Data Studio y crea una base de datos de práctica (ej. CREATE DATABASE PracticaBI).",
      "Ejecuta primero las secciones 1 y 2 (CREATE TABLE e INSERT) para poblar las 5 tablas.",
      "Intenta resolver cada enunciado comentado por tu cuenta antes de ejecutar la solución debajo.",
      "Repite especialmente los bloques 3 y 4 (CTEs y Window Functions), que concentran el 70% de las pruebas técnicas.",
    ],
    faqs: [
      {
        question: "¿Funciona en SQL Server Express o Developer gratuito?",
        answer:
          "Sí, todas las consultas usan T-SQL estándar compatible con SQL Server 2016, 2019, 2022 y Azure SQL Database.",
      },
      {
        question: "¿Puedo correrlo en PostgreSQL o MySQL?",
        answer:
          "El 90% de los ejercicios (JOINs, CTEs, Window Functions) son SQL ANSI; solo tendrías que ajustar FORMAT() / DATEDIFF() / NVARCHAR al dialecto destino.",
      },
      {
        question: "¿Qué nivel necesito para aprovechar el script?",
        answer:
          "Está ordenado de menor a mayor dificultad: los primeros 10 son ideales si recién partes y los últimos 20 te preparan para cargos Semi-Senior.",
      },
      {
        question: "¿Por qué insisten tanto en Window Functions en entrevistas?",
        answer:
          "Porque permiten calcular rankings, acumulados móviles y variaciones temporales en una sola pasada sin subconsultas anidadas lentas.",
      },
    ],
    relatedCourseSlug: "sql-server",
    relatedCourseName: "Curso de SQL Server en vivo",
    relatedGuidePath: "/cursos/sql-server",
    relatedGuideLabel: "Ver temario del curso SQL Server",
  },
  {
    slug: "guia-practica-dax-ejercicios",
    title: "Pack de 35 Patrones DAX Listos para Producción en Power BI",
    seoTitle: "Pack 35 Medidas DAX Power BI Listas para Usar | ProgramBI",
    seoDescription:
      "Biblioteca descargable con 35 fórmulas DAX comentadas: CALCULATE, KEEPFILTERS, USERELATIONSHIP, Time Intelligence, SUMX, RANKX y Pareto.",
    h1: "Pack de 35 Patrones DAX Listos para Producción en Power BI",
    summary:
      "Deja de buscar fórmulas sueltas en foros. Reunimos los 35 patrones DAX más utilizados en proyectos reales de BI en Latinoamérica, organizados en 6 categorías con comentarios y buenas prácticas.",
    category: "DAX",
    tool: "DAX (Power BI)",
    level: "Intermedio",
    estimatedTime: "35 min",
    rowCountLabel: "35 medidas DAX en 6 categorías",
    files: [
      {
        path: "/plantillas/pack-35-medidas-dax-powerbi.dax",
        label: "Biblioteca 35 Patrones DAX (.dax)",
        format: "DAX",
        description:
          "Archivo estructurado con medidas de agregación, contexto CALCULATE, tiempo (YTD, MAT, Rolling 3M), iteradores X, rankings y patrones LATAM (IPC, USD).",
      },
    ],
    kpisIncluded: [
      "Agregaciones seguras (COALESCE, DIVIDE, DISTINCTCOUNT)",
      "Modificación de contexto (ALLSELECTED, REMOVEFILTERS, KEEPFILTERS, USERELATIONSHIP)",
      "Time Intelligence (YTD, Año Fiscal, YoY %, Rolling 3M, MAT 12M)",
      "Iteradores X-functions (SUMX, AVERAGEX, MAXX, CONCATENATEX)",
      "Rankings, Top N y Pareto ABC",
      "Patrones LATAM: Ajuste por IPC, Conversión USD y Clientes Nuevos",
    ],
    datasetColumns: [
      { name: "Bloque 1 (01–05)", type: "Agregaciones", description: "Ventas, Margen %, Ticket Promedio y Promedio Diario." },
      { name: "Bloque 2 (06–12)", type: "CALCULATE", description: "Filtros dimensionales, participación %, KEEPFILTERS y relaciones inactivas." },
      { name: "Bloque 3 (13–19)", type: "Tiempo", description: "YTD, año fiscal, YoY %, MoM %, promedio móvil 3M y MAT 12M." },
      { name: "Bloque 4 (20–25)", type: "Iteradores", description: "Cálculo fila a fila sin columnas calculadas e inflación constante." },
      { name: "Bloque 5 (26–30)", type: "Rankings", description: "RANKX denso, TOPN, Pareto acumulado y producto líder." },
      { name: "Bloque 6 (31–35)", type: "Negocio LATAM", description: "Clientes nuevos, USD diario, semáforo de metas y selector dinámico." },
    ],
    codeSnippets: [
      {
        title: "Promedio móvil 3 meses (Rolling 3M)",
        language: "dax",
        code: `18_Promedio_Movil_3M =\nAVERAGEX (\n    DATESINPERIOD ( Calendario[Fecha], LASTDATE ( Calendario[Fecha] ), -3, MONTH ),\n    [01_Ventas_Totales]\n)`,
        explanation:
          "Suaviza la estacionalidad mensual calculando la media de los últimos 3 meses cerrados.",
      },
      {
        title: "Ventas en moneda constante (ajuste por IPC)",
        language: "dax",
        code: `25_Ventas_Moneda_Constante =\nVAR _ipcActual = MAX ( IPC[IndiceUltimo] )\nRETURN\n    SUMX (\n        VALUES ( Calendario[AnioMes] ),\n        [01_Ventas_Totales] * DIVIDE ( _ipcActual, MAX ( IPC[IndiceMes] ) )\n    )`,
        explanation:
          "Imprescindible en economías con inflación para comparar ventas reales de distintos años.",
      },
      {
        title: "Selector dinámico de métrica con SWITCH",
        language: "dax",
        code: `35_Metrica_Seleccionada =\nSWITCH (\n    SELECTEDVALUE ( SelectorMetrica[Opcion], "Ventas" ),\n    "Ventas", [01_Ventas_Totales],\n    "Margen %", [02_Margen_Pct],\n    "Ticket", [04_Ticket_Promedio],\n    [01_Ventas_Totales]\n)`,
        explanation:
          "Permite al usuario cambiar el KPI mostrado en un mismo gráfico usando un segmentador.",
      },
    ],
    stepByStep: [
      "Descarga pack-35-medidas-dax-powerbi.dax y ábrelo en VS Code, DAX Studio o Bloc de notas.",
      "Identifica la categoría que necesitas (ej. Time Intelligence o Rankings).",
      "Adapta los nombres de tabla (Ventas, Calendario, Producto) a tu modelo estrella.",
      "Usa variables (VAR / RETURN) siempre que una medida se repita más de una vez en la fórmula.",
      "Guarda las medidas en una tabla organizadora de métricas para mantener limpio tu modelo.",
    ],
    faqs: [
      {
        question: "¿Por qué evitar columnas calculadas y preferir medidas DAX?",
        answer:
          "Las columnas calculadas consumen memoria RAM del modelo y no reaccionan a los filtros del usuario. Las medidas se calculan al vuelo según el contexto.",
      },
      {
        question: "¿Qué diferencia hay entre ALLSELECTED y REMOVEFILTERS?",
        answer:
          "ALLSELECTED respeta los filtros externos (slicers) aplicados al reporte, ideal para participaciones % dinámicas; REMOVEFILTERS ignora filtros por completo sobre la tabla/columna indicada.",
      },
      {
        question: "¿Cómo puedo probar estas medidas más rápido?",
        answer:
          "Te recomendamos instalar DAX Studio (gratuito) o usar la vista de consultas DAX integrada en Power BI Desktop.",
      },
      {
        question: "¿Las fórmulas sirven también para Excel Power Pivot?",
        answer:
          "La gran mayoría sí, aunque funciones modernas como REMOVEFILTERS se reemplazan por ALL() en versiones antiguas de Excel.",
      },
    ],
    relatedCourseSlug: "power-bi",
    relatedCourseName: "Curso de Power BI en vivo",
    relatedGuidePath: "/guias/funciones-dax-mas-importantes",
    relatedGuideLabel: "Guía: Funciones DAX más importantes",
  },
  {
    slug: "limpieza-excel-python-pandas",
    title: "Automatizar Limpieza de Excel y CSV en Python (Pandas)",
    seoTitle: "Plantilla Limpieza Excel con Python y Pandas | ProgramBI",
    seoDescription:
      "Notebook Jupyter (.ipynb) + CSV sucio de práctica para limpiar montos CLP, normalizar fechas mixtas, deduplicar y exportar a Excel.",
    h1: "Automatizar Limpieza de Excel y Reportes CLP con Python y Pandas",
    summary:
      "Deja de perder horas limpiando planillas a mano cada lunes. Descarga un Jupyter Notebook completo junto a un archivo CSV sucio realista (montos con '$', 'CLP', fechas mixtas, espacios y duplicados) para automatizar el proceso en segundos.",
    category: "Python",
    tool: "Python + Pandas",
    level: "Básico – Intermedio",
    estimatedTime: "25 min",
    rowCountLabel: "Notebook 6 pasos + 52 filas sucias",
    files: [
      {
        path: "/plantillas/automatizar-reportes-excel-pandas.ipynb",
        label: "Jupyter Notebook Automatización (.ipynb)",
        format: "IPYNB",
        description:
          "Código paso a paso con regex para limpiar pesos chilenos, parseo de fechas mixtas, deduplicación, agrupación de KPIs y exportación multi-hoja a Excel.",
      },
      {
        path: "/plantillas/ventas-sucias-ejemplo.csv",
        label: "CSV Sucio de Práctica (.csv)",
        format: "CSV",
        description:
          "52 filas con errores reales de exportación ERP: '$ 1.250.000', 'CLP 450.000', fechas DD/MM/YYYY mezcladas con YYYY-MM-DD, espacios y duplicados.",
      },
    ],
    kpisIncluded: [
      "Limpieza de strings y capitalización (.str.strip().str.title())",
      "Conversión de montos '$ 1.250.000' y 'CLP 450.000' a float",
      "Normalización de fechas mixtas con format='mixed'",
      "Eliminación de filas duplicadas y registros anulados",
      "Tablas resumen por sucursal y mes + exportación openpyxl",
    ],
    datasetColumns: [
      { name: "ID_Venta", type: "Text", description: "Identificador de venta (incluye 2 filas duplicadas intencionales)." },
      { name: "Fecha", type: "Text (Mixto)", description: "Mezcla formatos DD/MM/YYYY y YYYY-MM-DD." },
      { name: "Sucursal / Vendedor / Categoria", type: "Text (Sucio)", description: "Textos con espacios extra y mayúsculas/minúsculas inconsistentes." },
      { name: "Monto_Bruto / Costo", type: "Text (Moneda)", description: "Montos con símbolos '$', 'CLP' y separadores de miles." },
      { name: "Estado", type: "Text", description: "Incluye registros 'anulado' que deben excluirse del reporte final." },
    ],
    codeSnippets: [
      {
        title: "Limpiar montos en pesos chilenos (CLP) con Regex",
        language: "python",
        code: `def limpiar_clp(valor: str) -> float:\n    if pd.isna(valor):\n        return 0.0\n    limpio = re.sub(r'[^0-9,-]', '', str(valor)).replace(',', '.')\n    try:\n        return float(limpio)\n    except ValueError:\n        return 0.0`,
        explanation:
          "Elimina signos '$', letras 'CLP' y puntos de miles para transformar texto en números operables.",
      },
      {
        title: "Parsear fechas mixtas en una sola línea",
        language: "python",
        code: `df['Fecha_Limpia'] = pd.to_datetime(df['Fecha'], format='mixed', dayfirst=True, errors='coerce')\ndf = df.dropna(subset=['Fecha_Limpia']).copy()`,
        explanation:
          "Soporta archivos donde algunos registros vienen en DD/MM/YYYY y otros en formato ISO YYYY-MM-DD.",
      },
      {
        title: "Exportar múltiples hojas a Excel con openpyxl",
        language: "python",
        code: `with pd.ExcelWriter('reporte_ventas_consolidado.xlsx', engine='openpyxl') as writer:\n    resumen_sucursal.to_excel(writer, sheet_name='Resumen_Sucursal', index=False)\n    resumen_mensual.to_excel(writer, sheet_name='Evolucion_Mensual', index=False)\n    df.to_excel(writer, sheet_name='Base_Limpia', index=False)`,
        explanation:
          "Genera un libro Excel listo para enviar a gerencia o conectar directamente desde Power BI.",
      },
    ],
    stepByStep: [
      "Descarga automatizar-reportes-excel-pandas.ipynb y ventas-sucias-ejemplo.csv en la misma carpeta.",
      "Ábrelo en VS Code, JupyterLab o súbelo a Google Colab (sin instalar nada en tu PC).",
      "Si corres en local, asegúrate de tener instalados pandas y openpyxl (pip install pandas openpyxl).",
      "Ejecuta las 6 celdas en orden y revisa cómo la tabla sucia queda consolidada.",
      "Adapta la ruta de entrada para procesar carpetas completas con varios archivos Excel mensuales.",
    ],
    faqs: [
      {
        question: "¿Puedo ejecutar el notebook sin instalar Python en mi computador?",
        answer:
          "Sí. Sube el archivo .ipynb y el CSV a Google Colab (colab.research.google.com) y ejecútalo gratis en el navegador.",
      },
      {
        question: "¿Por qué usar Python si ya existe Power Query?",
        answer:
          "Power Query es excelente dentro de Excel/Power BI, pero Python con Pandas procesa millones de filas más rápido, permite automatizar envíos de correo y se integra con APIs y Machine Learning.",
      },
      {
        question: "¿Qué pasa si mi archivo usa coma decimal en lugar de punto?",
        answer:
          "La función limpiar_clp() ya contempla el reemplazo de coma a punto; si tus miles usan coma (formato US), solo ajusta la expresión regular.",
      },
      {
        question: "¿El notebook genera el archivo Excel automáticamente?",
        answer:
          "Sí, la última celda crea reporte_ventas_consolidado.xlsx con 3 pestañas ordenadas.",
      },
    ],
    relatedCourseSlug: "python",
    relatedCourseName: "Curso de Python para Análisis de Datos",
    relatedGuidePath: "/cursos/python",
    relatedGuideLabel: "Ver temario del curso de Python",
  },
];

export function getPlantillaBySlug(slug: string): PlantillaItem | undefined {
  return PLANTILLAS.find((p) => p.slug === slug);
}
