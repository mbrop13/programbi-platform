import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "preguntas-entrevista-analista-de-datos",
  title: "Entrevista de analista de datos: preguntas y respuestas",
  meta: "Preguntas frecuentes en entrevistas de analista de datos: SQL, Excel, Power BI, estadística y casos, con respuestas modelo y cómo preparar la prueba.",
  h1: "Preguntas de entrevista para analista de datos y cómo responderlas",
  subtitle:
    "Guía de preparación técnica para procesos de selección en Chile: preguntas reales de negocio, consultas modelo en SQL Server (T-SQL), fórmulas de Excel en español e inglés, modelamiento en Power BI y DAX, estadística aplicada y un caso práctico guiado.",
  keywordPrincipal: "preguntas entrevista analista de datos",
  keywords: [
    "preguntas entrevista analista de datos",
    "preguntas entrevista SQL Power BI Excel",
    "prueba técnica analista de datos",
  ],
  curso: "analisis-de-datos",
  cursoSecundario: "sql-server",
  herramienta: "Carrera",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Dominar la estructura de las entrevistas técnicas para Analista de Datos (SQL, Excel, Power BI/DAX, estadística y negocio) con respuestas concretas, código limpio y criterios para aprobar la prueba práctica.",
    herramienta: "SQL Server (T-SQL) + Microsoft Excel + Power BI (DAX)",
    tiempo: "35 minutos",
    bullets: [
      "Respuestas estructuradas para preguntas de negocio y calidad de datos sin caer en definiciones de libro.",
      "Consultas modelo en T-SQL con JOIN, GROUP BY, CTE y ROW_NUMBER listas para explicar en voz alta.",
      "Fórmulas clave de Excel (BUSCARX en español e inglés) y conceptos de Power BI (CALCULATE vs columna calculada).",
      "Caso práctico guiado de caída de ventas y método en 5 pasos para preparar tu prueba técnica.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Negocio y perfil",
      resumen: "Responde sobre KPIs, limpieza de datos e impacto comercial con método.",
      anchorId: "preguntas-generales-negocio",
      icono: "sparkles",
    },
    {
      numero: 2,
      titulo: "SQL (T-SQL)",
      resumen: "Domina LEFT vs INNER JOIN, agregaciones y funciones de ventana con CTE.",
      anchorId: "preguntas-sql-consultas-modelo",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Excel aplicado",
      resumen: "Explica BUSCARX, tablas dinámicas y manejo de errores en ES/EN.",
      anchorId: "preguntas-excel",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Power BI y DAX",
      resumen: "Distingue medidas de columnas calculadas y defiende el modelo estrella.",
      anchorId: "preguntas-power-bi-dax",
      icono: "chart",
    },
    {
      numero: 5,
      titulo: "Estadística y caso",
      resumen: "Usa media vs mediana, causalidad y resuelve un caso de caída de ventas.",
      anchorId: "estadistica-basica",
      icono: "layers",
    },
    {
      numero: 6,
      titulo: "Prueba técnica",
      resumen: "Prepara tu entorno, comunica supuestos y valida bordes antes de entregar.",
      anchorId: "como-preparar-prueba-tecnica",
      icono: "check",
    },
  ],
  requisitos: {
    version: "SQL Server 2019/2022 (T-SQL), Excel 365/2021 y Power BI Desktop actualizados",
    lista: [
      "Conocimientos básicos de bases de datos relacionales (tablas de hechos y dimensiones).",
      "Manejo intermedio de Excel (tablas oficiales, fórmulas de búsqueda y tablas dinámicas).",
      "Familiaridad con Power BI Desktop (Power Query, relaciones y medidas DAX básicas).",
    ],
    compatibilidadMacWeb:
      "Las consultas T-SQL y fórmulas de Excel operan igual en Windows, macOS (con Azure Data Studio/Docker para SQL y Excel para Mac) o Excel Web. Power BI Desktop requiere Windows nativo o máquina virtual.",
  },
  herramientasHowTo: [
    "SQL Server Management Studio o Azure Data Studio",
    "Microsoft Excel",
    "Power BI Desktop",
  ],
  insumosHowTo: [
    "Esquema de tablas de ventas de práctica (Clientes, Productos, Ventas)",
    "Lista de preguntas frecuentes por área técnica",
  ],
  secciones: [
    {
      id: "preguntas-generales-negocio",
      titulo: "Preguntas generales y de negocio: cómo demostrar criterio analítico",
      parrafos: [
        "Las entrevistas de analista de datos en empresas chilenas (banca, retail, telecomunicaciones, SaaS o logística) suelen abrir con una conversación de 15 a 20 minutos para medir si entiendes el propósito del negocio antes de pasar al teclado. Quien solo recita herramientas suele quedar atrás frente a quien conecta datos con decisiones.",
        "Tres preguntas clásicas y cómo estructurar tu respuesta:",
      ],
      lista: [
        "«Cuéntame sobre un análisis o tablero que haya generado impacto real»: responde en formato Contexto → Problema → Acción técnica → Resultado medible. Por ejemplo, explicar cómo detectaste quiebres de stock en sucursales cruzando ventas con inventario y redujiste reposiciones tardías.",
        "«¿Qué haces cuando recibes una base con datos sucios o incompletos?»: explica un protocolo ordenado: perfilar nulos, duplicados y tipos de datos; validar con el dueño del dato si un cero es ausencia de venta o dato faltante; documentar reglas de limpieza en Power Query o SQL sin alterar el archivo original.",
        "«¿Cómo explicas un hallazgo técnico a una gerencia no técnica?»: enfatiza que primero presentas la conclusión y el impacto en pesos, clientes o tiempo, luego muestras el gráfico principal y dejas la metodología SQL/DAX como respaldo si preguntan el detalle.",
      ],
    },
    {
      id: "preguntas-sql-consultas-modelo",
      titulo: "Preguntas de SQL con consultas modelo en T-SQL",
      esPasoHowTo: true,
      resumenHowTo:
        "Practica y explica en voz alta las diferencias entre INNER y LEFT JOIN, el uso de HAVING frente a WHERE y el ranking con CTE y ROW_NUMBER en SQL Server.",
      parrafos: [
        "SQL es el filtro técnico número uno en entrevistas de analista de datos. No basta con que la consulta corra: el entrevistador suele preguntar qué pasa con los valores `NULL`, por qué elegiste un `LEFT JOIN` o cómo evitar duplicados al cruzar tablas de distinta granularidad.",
        "Prepara estas tres consultas modelo en SQL Server (T-SQL) y practica explicarlas línea por línea:",
      ],
      codigos: [
        {
          titulo: "Pregunta SQL 1 — Clientes sin compras (LEFT JOIN + IS NULL)",
          lenguaje: "sql",
          codigo: `-- Obtener clientes registrados que NO han realizado compras en 2026
SELECT
    c.ClienteID,
    c.NombreCliente,
    c.Region
FROM dbo.Clientes AS c
LEFT JOIN dbo.Ventas AS v
    ON c.ClienteID = v.ClienteID
    AND v.FechaVenta >= '2026-01-01'
    AND v.FechaVenta < '2027-01-01'
WHERE v.VentaID IS NULL;`,
          nota: "Punto clave en entrevista: poner el filtro de fecha en el ON del LEFT JOIN, no en el WHERE, porque ponerlo en el WHERE convertiría el LEFT JOIN en un INNER JOIN.",
        },
        {
          titulo: "Pregunta SQL 2 — Filtrar grupos agregados (WHERE vs HAVING)",
          lenguaje: "sql",
          codigo: `-- Sucursales con más de 50 ventas pagadas y ticket promedio sobre $45.000
SELECT
    SucursalID,
    COUNT(*) AS CantidadVentas,
    AVG(CAST(MontoNeto AS DECIMAL(12,2))) AS TicketPromedio
FROM dbo.Ventas
WHERE Estado = 'Pagada'
GROUP BY SucursalID
HAVING COUNT(*) > 50
   AND AVG(CAST(MontoNeto AS DECIMAL(12,2))) > 45000
ORDER BY TicketPromedio DESC;`,
          nota: "Recuerda: WHERE filtra filas antes de agrupar; HAVING filtra grupos después del GROUP BY.",
        },
        {
          titulo: "Pregunta SQL 3 — Top 3 productos por categoría usando CTE y ROW_NUMBER",
          lenguaje: "sql",
          codigo: `WITH VentasPorProducto AS (
    SELECT
        p.Categoria,
        p.ProductoID,
        p.NombreProducto,
        SUM(v.MontoNeto) AS TotalVendido
    FROM dbo.Ventas AS v
    INNER JOIN dbo.Productos AS p
        ON v.ProductoID = p.ProductoID
    GROUP BY p.Categoria, p.ProductoID, p.NombreProducto
),
Ranking AS (
    SELECT
        Categoria,
        ProductoID,
        NombreProducto,
        TotalVendido,
        ROW_NUMBER() OVER (
            PARTITION BY Categoria
            ORDER BY TotalVendido DESC
        ) AS Posicion
    FROM VentasPorProducto
)
SELECT Categoria, ProductoID, NombreProducto, TotalVendido, Posicion
FROM Ranking
WHERE Posicion <= 3;`,
          nota: "Si te preguntan la diferencia con DENSE_RANK(): ROW_NUMBER() asigna números únicos 1, 2, 3 incluso si hay empate; DENSE_RANK() repite posición en empates sin saltar el siguiente número.",
        },
      ],
      captura: {
        id: "preguntas-entrevista-analista-de-datos-paso-1",
        alt: "Editor de consultas SQL Server mostrando una CTE con ROW_NUMBER PARTITION BY y su tabla de resultados",
        caption: "Consulta modelo en T-SQL con CTE y función de ventana para obtener rankings por categoría.",
        ratio: "16/9",
      },
    },
    {
      id: "preguntas-excel",
      titulo: "Preguntas de Excel: BUSCARX, tablas dinámicas y fórmulas ES/EN",
      esPasoHowTo: true,
      resumenHowTo:
        "Domina el uso de BUSCARX con valor alternativo ante errores, la diferencia entre referencias absolutas/relativas y buenas prácticas en tablas dinámicas.",
      parrafos: [
        "Aunque el cargo pida SQL o Power BI, casi todas las pruebas técnicas en Chile incluyen una hoja de Excel para cruzar catálogos, resumir métricas con tablas dinámicas o corregir errores `#N/A` y `#¡DIV/0!`. Los entrevistadores valoran que trabajes con Tablas oficiales (`Ctrl+T`) en lugar de rangos sueltos y que sepas por qué `BUSCARX` (`XLOOKUP`) supera a `BUSCARV` (`VLOOKUP`).",
        "Ventajas concretas que debes mencionar sobre `BUSCARX` frente a `BUSCARV`: busca hacia la izquierda o derecha sin contar columnas a mano, incorpora el cuarto argumento para manejar no encontrados sin envolver todo en `SI.ERROR`, y permite coincidencia exacta por defecto (`0`).",
      ],
      codigos: [
        {
          titulo: "Fórmula Excel modelo — BUSCARX con manejo de no encontrado y suma condicional",
          lenguaje: "excel",
          codigo: `=BUSCARX(A2; tblProductos[SKU]; tblProductos[Precio_Lista]; "SKU no registrado"; 0)

=SUMAR.SI.CONJUNTO(tblVentas[Monto_Neto]; tblVentas[Sucursal]; "Santiago"; tblVentas[Estado]; "Pagada")`,
          codigoEn: `=XLOOKUP(A2, tblProductos[SKU], tblProductos[Precio_Lista], "SKU no registrado", 0)

=SUMIFS(tblVentas[Monto_Neto], tblVentas[Sucursal], "Santiago", tblVentas[Estado], "Pagada")`,
          nota: "Usa ; en Excel configurado en español (Chile) y , en inglés.",
        },
      ],
      lista: [
        "Tablas dinámicas vs fórmulas: usa tablas dinámicas para explorar rápido y resumir grandes volúmenes por dimensiones; usa fórmulas (`SUMAR.SI.CONJUNTO`, `BUSCARX`) cuando necesitas un formato fijo de reporte financiero o cálculos celda a celda.",
        "Campos calculados vs medidas: en tablas dinámicas estándar, el campo calculado suma primero y divide después en totales, pero si necesitas cálculos de porcentaje complejos o múltiples tablas relacionadas, conviene pasar al modelo de datos (Power Pivot / Power BI).",
      ],
      captura: {
        id: "preguntas-entrevista-analista-de-datos-paso-2",
        alt: "Hoja de Excel con tabla oficial tblVentas, fórmula BUSCARX en barra de fórmulas y tabla dinámica resumen",
        caption: "Uso combinado de tablas estructuradas, BUSCARX y tabla dinámica en una prueba de Excel.",
        ratio: "16/9",
      },
    },
    {
      id: "preguntas-power-bi-dax",
      titulo: "Preguntas de Power BI y DAX: medidas, CALCULATE y modelo estrella",
      esPasoHowTo: true,
      resumenHowTo:
        "Explica la diferencia entre medida y columna calculada, cómo modifica CALCULATE el contexto de filtro y por qué el modelo estrella evita relaciones ambiguas.",
      parrafos: [
        "En Power BI, la pregunta estrella de cualquier entrevista técnica es: «¿Cuál es la diferencia entre una medida y una columna calculada, y cuándo usas cada una?».",
        "Respuesta modelo clara: una columna calculada se evalúa fila por fila al momento de actualizar el modelo, ocupa memoria RAM en la tabla y sirve principalmente para categorizar atributos en segmentadores o ejes (por ejemplo, agrupar rangos de edad). Una medida se calcula dinámicamente al momento de interactuar con el informe según el contexto de filtro (segmentadores, filas de una matriz, filtros de página), no infla el tamaño del archivo y es la regla estándar para agregaciones como ventas, márgenes o porcentajes.",
        "También te preguntarán por qué evitar tablas planas gigantes o relaciones muchos-a-muchos: el modelo estrella separa una tabla de hechos central (transacciones numéricas) rodeada de tablas de dimensiones únicas (Calendario, Clientes, Productos) unidas por relaciones uno-a-muchos (`1:*`) en una sola dirección.",
      ],
      codigos: [
        {
          titulo: "Medida DAX modelo — Margen % y variación interanual con CALCULATE",
          lenguaje: "dax",
          codigo: `Ventas Netas = SUM(FactVentas[MontoNeto])

Margen % =
DIVIDE(
    [Ventas Netas] - SUM(FactVentas[CostoTotal]),
    [Ventas Netas],
    0
)

Ventas Año Anterior =
CALCULATE(
    [Ventas Netas],
    SAMEPERIODLASTYEAR(DimCalendario[Fecha])
)`,
          nota: "Menciona siempre DIVIDE() para evitar errores por división por cero y el uso de una tabla DimCalendario marcada como tabla de fechas.",
        },
      ],
      captura: {
        id: "preguntas-entrevista-analista-de-datos-paso-3",
        alt: "Vista de modelo en Power BI Desktop mostrando esquema estrella con DimCalendario, DimClientes, DimProductos y FactVentas",
        caption: "Modelo estrella limpio con relaciones uno-a-muchos hacia la tabla de hechos.",
        ratio: "16/9",
      },
    },
    {
      id: "estadistica-basica",
      titulo: "Estadística básica y mapa de áreas evaluadas en la entrevista",
      parrafos: [
        "No necesitas un doctorado en estadística para un rol de analista de datos comercial o de operaciones, pero sí debes manejar con soltura tres conceptos que aparecen en casi todas las entrevistas: media vs mediana, desviación estándar y correlación vs causalidad.",
        "Cuando te pregunten cuándo usar la mediana en lugar de la media (promedio), da un ejemplo chileno concreto: sueldos o montos de compra. Si nueve clientes gastan $20.000 y uno gasta $2.000.000, el promedio sube artificialmente y no representa al cliente típico; la mediana ($20.000) resiste esos valores extremos (outliers).",
        "Respecto a correlación vs causalidad: que dos métricas suban juntas (por ejemplo, ventas de helados y visitas a urgencias por insolación en enero) no significa que una cause la otra; ambas responden a una tercera variable (temperatura de verano). En negocios, confundir correlación con causalidad lleva a invertir presupuesto en palancas equivocadas.",
      ],
      tabla: {
        caption: "Resumen de qué evalúa cada bloque de la entrevista y qué error debes evitar",
        encabezados: [
          "Área evaluada",
          "Qué busca el entrevistador",
          "Conceptos clave a dominar",
          "Error frecuente que debes evitar",
        ],
        filas: [
          [
            "Negocio y KPIs",
            "Que traduzcas preguntas comerciales en métricas accionables",
            "Embudo, retención, ticket promedio, margen, definición de KPI",
            "Responder solo con nombres de gráficos sin explicar qué decisión habilita",
          ],
          [
            "SQL (T-SQL)",
            "Extracción exacta sin duplicar ni perder filas",
            "INNER vs LEFT JOIN, GROUP BY/HAVING, CTE, ROW_NUMBER, manejo de NULL",
            "Filtrar la tabla derecha de un LEFT JOIN en el WHERE anulando los nulos",
          ],
          [
            "Excel",
            "Agilidad operativa y control de errores en planillas",
            "Tablas (Ctrl+T), BUSCARX, SUMAR.SI.CONJUNTO, tablas dinámicas",
            "Escribir rangos fijos sin tabla o dejar #N/A visibles en entregables",
          ],
          [
            "Power BI / DAX",
            "Modelamiento limpio y métricas dinámicas eficientes",
            "Modelo estrella, medida vs columna, CALCULATE, DimCalendario",
            "Cargar una sola sábana gigante o abusar de relaciones bidireccionales",
          ],
          [
            "Estadística básica",
            "Lectura crítica de distribuciones y sesgos",
            "Media vs mediana, percentiles, outliers, correlación vs causalidad",
            "Promediar porcentajes directamente o asumir causalidad sin experimento",
          ],
        ],
      },
    },
    {
      id: "caso-practico-guiado",
      titulo: "Caso práctico guiado: «Las ventas cayeron un 18 % este mes, ¿qué investigas?»",
      parrafos: [
        "Esta es la pregunta abierta favorita de gerentes de analítica y líderes de BI. No buscan que adivines una única causa mágica, sino observar cómo descompones un problema ambiguo de forma estructurada.",
        "Aplica este árbol de diagnóstico en cuatro pasos:",
      ],
      listaOrdenada: [
        "Validar la integridad del dato primero: antes de alarmar a la gerencia, descarta fallas técnicas. ¿Cargaron todos los días del mes? ¿Se cambió la definición de venta neta (por ejemplo, con o sin IVA)? ¿Falta una sucursal o canal en el ETL?",
        "Descomponer la métrica en sus factores: Ventas = Número de clientes compradores × Frecuencia × Ticket promedio (o Tráfico × Conversión × Ticket). Identifica cuál componente cayó.",
        "Segmentar por dimensiones clave: abre la caída por canal (web vs tienda), región/sucursal, categoría de producto y cohorte (clientes nuevos vs recurrentes). Si el 90 % de la caída viene de una sola categoría sin stock, ya encontraste el foco.",
        "Cruzar contexto externo y operativo: revisa quiebres de inventario, cambios de precio, fin de una campaña o estacionalidad frente al mismo mes del año anterior (no solo contra el mes previo).",
      ],
    },
    {
      id: "como-preparar-prueba-tecnica",
      titulo: "Cómo preparar la prueba técnica paso a paso",
      parrafos: [
        "Muchas empresas envían una prueba técnica asíncrona (24 a 72 horas) con un archivo CSV/Excel o un script de base de datos, o bien realizan una sesión en vivo de 45 minutos. Seguir una rutina ordenada marca la diferencia entre entregar un archivo confuso y destacar como candidato.",
        "Practica con ejercicios reales antes de tu entrevista usando nuestra [colección de ejercicios SQL Server para entrevistas](/plantillas/ejercicios-sql-server-entrevistas) y refuerza tus fundamentos en el [curso completo de Análisis de Datos](/cursos/analisis-de-datos).",
      ],
      lista: [
        "Lee el enunciado completo y anota la granularidad: identifica qué representa cada fila (¿una boleta, un ítem de boleta, un cliente?) antes de escribir la primera suma.",
        "Documenta tus supuestos: si detectas 12 filas con fecha nula o montos negativos (notas de crédito), explica explícitamente si las excluiste o las neteaste y por qué.",
        "Cuida la presentación del entregable: en Excel, entrega una pestaña Resumen limpia y otra con datos crudos; en SQL, indenta tus CTEs y usa alias legibles (`v`, `c`, `p`); en Power BI, oculta llaves técnicas (`ID`) en la vista de informe.",
        "Verifica totales cruzados: si tu resumen dice que la venta total es $120 millones, comprueba que la suma coincida en SQL, Excel y Power BI antes de enviar.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Promediar porcentajes en lugar de recalcular el total ponderado",
      causa: "Se promedian márgenes o tasas de conversión de distintas sucursales como si todas tuvieran el mismo volumen de ventas.",
      solucion: "Calcula siempre `SUM(numerador) / SUM(denominador)` tanto en SQL como en medidas DAX (`DIVIDE`) y campos calculados.",
    },
    {
      error: "Multiplicar montos al hacer JOIN entre tablas de distinta granularidad",
      causa: "Se une una tabla de cabecera de pedidos con una de detalle de pagos o despachos sin agregar primero.",
      solucion: "Agrupa en una CTE al mismo nivel de detalle antes de hacer el `JOIN`, o valida con `COUNT(*)` que el número de filas no crezca inesperadamente.",
    },
    {
      error: "Escribir código sin explicar qué estás pensando en una prueba en vivo",
      causa: "Los nervios llevan a quedarse en silencio por varios minutos mientras se depura un error de sintaxis.",
      solucion: "Verbaliza tu plan en voz alta («Primero voy a revisar los nulos y la clave primaria de esta tabla») para que el entrevistador evalúe tu criterio incluso si tienes un tropiezo de sintaxis.",
    },
    {
      error: "Usar gráficos recargados sin título con conclusión en la prueba de Power BI",
      causa: "Se prioriza meter 10 visuales en una página en vez de responder las preguntas de negocio del caso.",
      solucion: "Limita el lienzo a 3 o 4 KPIs arriba y 2 o 3 gráficos claros debajo con títulos orientados a la pregunta del enunciado.",
    },
  ],
  plantilla: {
    titulo: "Próximamente: kit de práctica de entrevistas (dataset + pauta SQL/Excel/Power BI)",
    descripcion:
      "Incluirá un set de tablas de ventas y clientes con anomalías reales intencionales y la pauta comentada de resolución paso a paso.",
  },
  faqs: [
    {
      q: "¿Qué nivel de SQL piden normalmente para un cargo de Analista de Datos junior o semi-senior?",
      a: "Para perfiles junior se esperan `SELECT`, `WHERE`, `GROUP BY`, `HAVING`, `INNER/LEFT JOIN` y funciones de fecha/texto. Para perfiles intermedios o semi-senior se suman subconsultas, CTEs (`WITH`), funciones de ventana (`ROW_NUMBER`, `RANK`, acumulados con `OVER`) y optimización básica de consultas.",
    },
    {
      q: "¿Es obligatorio saber Python para pasar una entrevista de analista de datos en Chile?",
      a: "No en todos los cargos. En muchas empresas chilenas la tríada central sigue siendo Excel avanzado + SQL + Power BI. Python suele exigirse cuando el rol incluye automatización pesada, scraping, estadística avanzada o trabajo cercano a ciencia de datos.",
    },
    {
      q: "¿Qué pesa más en la prueba técnica: que el código sea perfecto o el criterio de negocio?",
      a: "Ambos importan, pero un código que corre perfecto sobre una métrica mal definida (por ejemplo, duplicando ventas por un mal JOIN o ignorando devoluciones) suele reprobar. Validar la calidad del dato y explicar tus supuestos suma muchos puntos.",
    },
    {
      q: "¿Cómo puedo practicar consultas SQL reales antes de la entrevista?",
      a: "Puedes resolver los desafíos progresivos de nuestra plantilla de ejercicios de SQL Server para entrevistas y complementar con el curso de Análisis de Datos para conectar SQL con Excel y Power BI.",
    },
  ],
  relacionadas: [
    "como-ser-analista-de-datos",
    "consultas-sql-ejemplos",
    "que-es-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Funciones de ventana (OVER, ROW_NUMBER) en T-SQL",
      url: "https://learn.microsoft.com/es-es/sql/t-sql/queries/select-over-clause-transact-sql",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia oficial de BUSCARX (XLOOKUP) en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.xlookup",
      fuente: "Microsoft Learn",
    },
    {
      label: "Comprender el esquema de estrella en Power BI",
      url: "https://learn.microsoft.com/es-es/power-bi/guidance/star-schema",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Ejercicios de SQL Server para entrevistas",
      href: "/plantillas/ejercicios-sql-server-entrevistas",
      descripcion: "Practica consultas con JOIN, agregaciones, CTE y funciones de ventana.",
    },
    {
      label: "Curso de Análisis de Datos",
      href: "/cursos/analisis-de-datos",
      descripcion: "Ruta completa con Excel, SQL Server, Power BI y casos de negocio.",
    },
  ],
};

export default guia;
