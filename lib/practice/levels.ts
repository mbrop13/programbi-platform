// =============================================================================
// Catálogo de Units (secciones) y sus Levels (niveles) + Ejercicios.
//
// Para agregar tus propios niveles copia el patrón del Unit "sql-server" más
// abajo. El README.md de esta carpeta explica el paso a paso.
// =============================================================================

import type { Unit } from "./types";

export const PRACTICE_UNITS: Unit[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // UNIDAD DE MUESTRA: SQL Server · Fundamentos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "sql-server",
    slug: "sql-server",
    title: "SQL Server",
    description: "Consultas, joins y bases relacionales con T-SQL.",
    icon: "Database",
    accentColor: "#CC2935", // rojo SQL Server
    emoji: "🛢️",
    levels: [
      {
        id: "sql-1",
        title: "Nivel 1 · Fundamentos",
        kind: "lesson",
        xp: 10,
        exercises: [
          // 1 ── multiple-choice ── ¿Qué comando selecciona filas?
          {
            id: "sql-1-e1",
            type: "multiple-choice",
            prompt: "¿Qué palabra clave se usa para leer filas de una tabla?",
            hint: "Empezamos las consultas con esta palabra.",
            data: {
              options: ["INSERT", "SELECT", "UPDATE", "DROP"],
              correctIndex: 1,
            },
            explanation:
              "SELECT es la cláusula de lectura. INSERT agrega, UPDATE modifica y DROP elimina objetos.",
          },

          // 2 ── arrange ── ordena los tokens de una query SELECT
          {
            id: "sql-1-e2",
            type: "arrange",
            prompt: 'Ordena losTokens para formar: "SELECT nombre FROM clientes"',
            hint: "Primero la acción, luego la columna, luego la tabla.",
            data: {
              tokens: [
                { id: "t2", text: "nombre" },
                { id: "t3", text: "FROM" },
                { id: "t4", text: "clientes" },
                { id: "t1", text: "SELECT" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation:
              "La estructura mínima de un SELECT es: SELECT <columnas> FROM <tabla>.",
          },

          // 3 ── select-all ── cláusulas válidas en un SELECT
          {
            id: "sql-1-e3",
            type: "select-all",
            prompt: "¿Cuáles de estas son cláusulas válidas de un SELECT?",
            hint: "Hay 3 correctas.",
            data: {
              options: ["FROM", "WHERE", "ROBOT", "GROUP BY", "PIZZA"],
              correctIndices: [0, 1, 3],
            },
            explanation:
              "FROM (origen), WHERE (filtro) y GROUP BY (agrupación) son cláusulas válidas. ROBOT y PIZZA no existen.",
          },

          // 4 ── fill-blank ── WHERE filtra filas
          {
            id: "sql-1-e4",
            type: "fill-blank",
            prompt: "Completa: SELECT * FROM clientes _____ edad > 18;",
            hint: "Es la cláusula de filtro de filas.",
            data: {
              acceptedAnswers: ["where", "WHERE", "Where"],
              placeholder: "escribe la palabra...",
            },
            explanation:
              "WHERE filtra las filas devueltas por la consulta según una condición.",
          },

          // 5 ── match-pairs ── empareja comando con su acción
          {
            id: "sql-1-e5",
            type: "match-pairs",
            prompt: "Empareja cada comando con su acción.",
            hint: "Toca un item de la izquierda y luego su par en la derecha.",
            data: {
              left: [
                { id: "L1", text: "SELECT" },
                { id: "L2", text: "INSERT" },
                { id: "L3", text: "UPDATE" },
                { id: "L4", text: "DELETE" },
              ],
              right: [
                { id: "R1", text: "Leer filas" },
                { id: "R2", text: "Eliminar filas" },
                { id: "R3", text: "Agregar fila" },
                { id: "R4", text: "Modificar filas" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R3" },
                { left: "L3", right: "R4" },
                { left: "L4", right: "R2" },
              ],
            },
            explanation:
              "SELECT lee, INSERT agrega, UPDATE modifica y DELETE elimina filas.",
          },

          // 6 ── multiple-choice ── tipo de dato entero
          {
            id: "sql-1-e6",
            type: "multiple-choice",
            prompt: "¿Qué tipo de T-SQL almacena números enteros?",
            hint: "Empieza por I.",
            data: {
              options: ["VARCHAR", "INT", "DATETIME", "BIT"],
              correctIndex: 1,
            },
            explanation:
              "INT guarda enteros (~±2.1B). VARCHAR guarda texto, DATETIME fechas y BIT valores booleanos (0/1).",
          },

          // 7 ── arrange ── consulta con WHERE y ORDER BY
          {
            id: "sql-1-e7",
            type: "arrange",
            prompt:
              'Ordena para formar: "SELECT * FROM ventas WHERE total > 100 ORDER BY total DESC"',
            hint: "ORDER BY siempre va después de WHERE.",
            data: {
              tokens: [
                { id: "t1", text: "SELECT *" },
                { id: "t2", text: "FROM ventas" },
                { id: "t3", text: "WHERE total > 100" },
                { id: "t4", text: "ORDER BY total DESC" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation:
              "El orden lógico de procesamiento es FROM → WHERE → SELECT → ORDER BY, aunque en texto escribas SELECT primero.",
          },
        ],
      },

      // Niveles siguientes (placeholder, los creas tú):
      {
        id: "sql-2",
        title: "Nivel 2 · Filtrado y ORDER BY",
        kind: "lesson",
        xp: 10,
        exercises: [], // TODO: agrega tus ejercicios aquí
      },
      {
        id: "sql-3",
        title: "Nivel 3 · JOINs",
        kind: "lesson",
        xp: 15,
        exercises: [],
      },
      {
        id: "sql-checkpoint",
        title: "Punto de control",
        kind: "checkpoint",
        xp: 30,
        exercises: [],
      },
      {
        id: "sql-trophy",
        title: "Unidad completada",
        kind: "trophy",
        xp: 50,
        exercises: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // UNIDADES PLACEHOLDER (solo cabecera; crea los niveles tú).
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "power-bi",
    slug: "power-bi",
    title: "Power BI",
    description: "Business Intelligence, Power Query, DAX y Visualización de alto impacto.",
    icon: "BarChart3",
    accentColor: "#F2C811", // amarillo Power BI
    emoji: "📊",
    levels: [
      // ── NIVEL 1: Introducción a Power BI y BI (Desde cero) ───────────────
      {
        id: "pbi-1",
        title: "Nivel 1 · ¿Qué es Power BI?",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-1-e1",
            type: "story",
            prompt: "Bienvenido a Power BI con Bit 🦝",
            hint: "Lee la lección guiada para entender la herramienta.",
            data: {
              slides: [
                {
                  title: "La necesidad del Business Intelligence",
                  text: "Imagina que trabajas en una empresa con miles de ventas registradas en archivos Excel desordenados. El director te pide un informe claro para tomar decisiones estratégicas hoy mismo.",
                  highlightText: "El Business Intelligence (BI) transforma datos crudos en información visual estratégica para la toma de decisiones.",
                },
                {
                  title: "El Ecosistema Power BI",
                  text: "Power BI es la suite líder de Microsoft compuesta por 3 piezas fundamentales:\n\n1. Power BI Desktop: Aplicación de escritorio donde extraes datos, creas el modelo y diseñas los informes.\n2. Power BI Service: Plataforma en la nube para compartir dashboards con tu equipo.\n3. Power BI Mobile: App móvil para consultar tus métricas desde tu smartphone.",
                  codeSnippet: "// Flujo de Trabajo Estándar:\nObtener Datos → Transformar (Power Query) → Modelar (DAX) → Diseñar → Publicar",
                },
              ],
            },
            explanation: "Power BI integra preparación de datos, análisis analítico y visualización en una sola plataforma.",
          },
          {
            id: "pbi-1-e2",
            type: "multiple-choice",
            prompt: "¿En cuál de las herramientas de Power BI se construyen y diseñan los informes en la computadora?",
            hint: "Es la aplicación gratuita de escritorio.",
            data: {
              options: [
                "Power BI Service",
                "Power BI Desktop",
                "Power BI Mobile",
                "Power BI Embedded",
              ],
              correctIndex: 1,
            },
            explanation: "Power BI Desktop es la herramienta principal para importar datos, crear modelos y diseñar reportes.",
          },
          {
            id: "pbi-1-e3",
            type: "match-pairs",
            prompt: "Empareja cada componente de Power BI con su función principal.",
            hint: "Toca una opción de la izquierda y luego su par correspondiente.",
            data: {
              left: [
                { id: "L1", text: "Power BI Desktop" },
                { id: "L2", text: "Power BI Service" },
                { id: "L3", text: "Power BI Mobile" },
              ],
              right: [
                { id: "R1", text: "Crear informes y modelos de datos" },
                { id: "R2", text: "Publicar y compartir en la nube" },
                { id: "R3", text: "Visualizar reportes en el celular" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Desktop para crear, Service para publicar y compartir, y Mobile para consultar sobre la marcha.",
          },
          {
            id: "pbi-1-e4",
            type: "arrange",
            prompt: "Ordena los 4 pasos fundamentales del flujo de trabajo en Power BI:",
            hint: "Comienza desde el origen de datos hasta la publicación.",
            data: {
              tokens: [
                { id: "t1", text: "1. Obtener Datos (Conectar)" },
                { id: "t2", text: "2. Transformar en Power Query" },
                { id: "t3", text: "3. Crear Modelo y Fórmulas DAX" },
                { id: "t4", text: "4. Publicar en Power BI Service" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Primero te conectas a los datos, los limpias con Power Query, creas tu modelo analítico y finalmente publicas el reporte.",
          },
          {
            id: "pbi-1-e5",
            type: "select-all",
            prompt: "¿A cuáles de los siguientes orígenes de datos se puede conectar Power BI?",
            hint: "Power BI puede conectarse a más de 100 orígenes.",
            data: {
              options: [
                "Archivos Excel y CSV",
                "Bases de Datos SQL Server y PostgreSQL",
                "Servicios Web / APIs REST",
                "Google Analytics y Salesforce",
              ],
              correctIndices: [0, 1, 2, 3],
            },
            explanation: "Power BI es extremadamente versátil y se conecta a casi cualquier fuente de datos (archivos, bases de datos relacionales, servicios en la nube y APIs).",
          },
        ],
      },

      // ── NIVEL 2: Power Query y Limpieza de Datos (ETL) ───────────────────
      {
        id: "pbi-2",
        title: "Nivel 2 · Power Query & Limpieza ETL",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-2-e1",
            type: "story",
            prompt: "Transformación de Datos con Power Query 🧹",
            hint: "Aprende el arte de limpiar datos automáticos.",
            data: {
              slides: [
                {
                  title: "¿Por qué Power Query?",
                  text: "En el mundo real, el 80% del tiempo de un analista se va en limpiar datos feos, con filas vacías, fechas mal formateadas o valores duplicados. Power Query resuelve esto.",
                  highlightText: "Power Query es el editor ETL (Extract, Transform, Load) de Power BI.",
                },
                {
                  title: "El Lenguaje M",
                  text: "Cada clic que haces en la interfaz de Power Query (como 'Eliminar filas vacías' o 'Dividir columna') se graba automáticamente como un paso en el Lenguaje M.\n\nEsto significa que la próxima vez que actualices tus datos, ¡Power Query los limpiará solo en un segundo!",
                  codeSnippet: "// Ejemplo de paso grabado en Lenguaje M:\n= Table.SelectRows(#\"Filas Filtradas\", each ([MontoVenta] <> null))",
                },
              ],
            },
            explanation: "Power Query automatiza la limpieza de datos registrando cada paso de transformación.",
          },
          {
            id: "pbi-2-e2",
            type: "multiple-choice",
            prompt: "¿Qué significan las siglas ETL en el contexto de inteligencia de negocios?",
            hint: "Se refiere a las 3 etapas del procesamiento de datos.",
            data: {
              options: [
                "Execute, Test, Launch",
                "Extract, Transform, Load (Extraer, Transformar, Cargar)",
                "Excel, Table, Logic",
                "Export, Translate, Link",
              ],
              correctIndex: 1,
            },
            explanation: "ETL significa Extraer los datos del origen, Transformarlos/Limpiarlos y Cargarlos al modelo de datos.",
          },
          {
            id: "pbi-2-e3",
            type: "fill-blank",
            prompt: "¿Cuál es el nombre del lenguaje de programación que graba internamente todos los pasos de Power Query?",
            hint: "Es una sola letra del abecedario.",
            data: {
              acceptedAnswers: ["m", "M", "lenguaje m", "Lenguaje M"],
              placeholder: "Escribe la letra...",
            },
            explanation: "El lenguaje M es el código funcional detrás de todas las transformaciones registradas en Power Query.",
          },
          {
            id: "pbi-2-e4",
            type: "match-pairs",
            prompt: "Empareja cada transformación de Power Query con su utilidad.",
            hint: "Relaciona la operación con su resultado.",
            data: {
              left: [
                { id: "L1", text: "Anular dinamización (Unpivot)" },
                { id: "L2", text: "Dividir columna por delimitador" },
                { id: "L3", text: "Cambiar tipo de dato" },
              ],
              right: [
                { id: "R1", text: "Convertir columnas de meses a filas de datos" },
                { id: "R2", text: "Separar 'Nombre Apellido' en 2 campos" },
                { id: "R3", text: "Convertir texto '100' a formato Número Entero" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Anular dinamización convierte tablas horizontales en verticales ideales para BI, dividir columnas separa texto y cambiar tipo asegura que los números sean operables.",
          },
        ],
      },

      // ── NIVEL 3: Modelado de Datos y Relaciones ─────────────────────────
      {
        id: "pbi-3",
        title: "Nivel 3 · Modelado en Estrella",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-3-e1",
            type: "story",
            prompt: "El Esquema en Estrella (Star Schema) ⭐",
            hint: "El cimiento arquitectónico de un modelo analítico eficaz.",
            data: {
              slides: [
                {
                  title: "Tablas de Hechos vs. Tablas de Dimensiones",
                  text: "En Power BI nunca debemos trabajar con una sola tabla gigante y plana ('flat table'). La mejor práctica mundial es el Esquema en Estrella.",
                  highlightText: "1. Tablas de Hechos (Fact): Contienen eventos cuantitativos (Ventas, Transacciones) con números y claves numéricas.\n2. Tablas de Dimensiones (Dim): Contienen el contexto descriptivo (Clientes, Productos, Fechas, Sucursales).",
                },
                {
                  title: "Relaciones y Cardinalidad",
                  text: "Las tablas se conectan mediante relaciones de Cardinalidad. La relación ideal entre una Tabla de Dimensión (lado 1) y una Tabla de Hechos (lado *) es de 1 a Varios (1:*).",
                  codeSnippet: "Dim_Clientes [ID_Cliente] (1) ───> (*) Fact_Ventas [ID_Cliente]",
                },
              ],
            },
            explanation: "Un Esquema en Estrella separa hechos numéricos de dimensiones descriptivas para un rendimiento óptimo.",
          },
          {
            id: "pbi-3-e2",
            type: "select-all",
            prompt: "¿Cuáles de estas son características típicas de una Tabla de Hechos (Fact Table)?",
            hint: "Piensa en transacciones como facturas o ventas.",
            data: {
              options: [
                "Almacena métricas numéricas acumuladas (ej: Monto, Cantidad)",
                "Crece constantemente con miles o millones de registros",
                "Contiene claves foráneas (Foreign Keys) para conectar dimensiones",
                "Contiene la lista única de nombres y correos de clientes",
              ],
              correctIndices: [0, 1, 2],
            },
            explanation: "La tabla de hechos almacena números y transacciones. La lista única de clientes pertenece a una Tabla de Dimensión.",
          },
          {
            id: "pbi-3-e3",
            type: "multiple-choice",
            prompt: "En un modelo de Power BI bien diseñado, ¿cuál es la cardinalidad recomendada entre una Tabla de Dimensión y una de Hechos?",
            hint: "Una clave de dimensión se repite muchas veces en ventas.",
            data: {
              options: [
                "Muchos a Muchos (*:*)",
                "Uno a Uno (1:1)",
                "Uno a Varios (1:*)",
                "Varios a Uno (*:1)",
              ],
              correctIndex: 2,
            },
            explanation: "La cardinalidad 1 a Varios (1:*) es el estándar de oro en BI: el ID único de la dimensión filtra múltiples ventas en la tabla de hechos.",
          },
        ],
      },

      // ── NIVEL 4: Introducción a DAX ─────────────────────────────────────
      {
        id: "pbi-4",
        title: "Nivel 4 · Lenguaje DAX",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-4-e1",
            type: "story",
            prompt: "Fórmulas Analíticas con DAX 🧮",
            hint: "Aprende el lenguaje de cálculo dinámico de Power BI.",
            data: {
              slides: [
                {
                  title: "¿Qué es DAX?",
                  text: "DAX (Data Analysis Expressions) es el lenguaje de fórmulas de Power BI, SSAS y Power Pivot en Excel.",
                  highlightText: "Regla de Oro: Crea MEDIDAS en lugar de Columnas Calculadas. Las medidas no ocupan espacio en memoria RAM y se calculan dinámicamente según los filtros del reporte.",
                },
                {
                  title: "La Función Reina: CALCULATE",
                  text: "CALCULATE es la función más poderosa de DAX. Permite evaluar cualquier expresión cambiando o agregando filtros dinámicos.",
                  codeSnippet: "Ventas_Chile = \nCALCULATE(\n    SUM(Fact_Ventas[Monto]),\n    Dim_Clientes[Pais] = \"Chile\"\n)",
                },
              ],
            },
            explanation: "DAX permite crear análisis numéricos avanzados y CALCULATE modifica el contexto de filtro.",
          },
          {
            id: "pbi-4-e2",
            type: "multiple-choice",
            prompt: "¿Cuál es la función en DAX considerada la más importante porque permite modificar el contexto de filtro de un cálculo?",
            hint: "Es la función 'reina' de DAX.",
            data: {
              options: ["SUM", "CALCULATE", "AVERAGE", "FILTER"],
              correctIndex: 1,
            },
            explanation: "CALCULATE evalúa una expresión dentro de un contexto de filtro modificado.",
          },
          {
            id: "pbi-4-e3",
            type: "arrange",
            prompt: "Ordena los elementos para construir la fórmula DAX que suma el Monto de Ventas:",
            hint: "NombreMedida = SUM(Tabla[Columna])",
            data: {
              tokens: [
                { id: "t1", text: "Ventas Totales =" },
                { id: "t2", text: "SUM(" },
                { id: "t3", text: "Fact_Ventas[Monto]" },
                { id: "t4", text: ")" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "La sintaxis básica de una medida explícita en DAX es: NombreMedida = SUM(Tabla[Columna]).",
          },
          {
            id: "pbi-4-e4",
            type: "fill-blank",
            prompt: "Completa la función DAX para contar el número total de filas en la tabla Clientes: Total Clientes = ____________(Dim_Clientes)",
            hint: "Comienza por COUNT...",
            data: {
              acceptedAnswers: ["COUNTROWS", "countrows", "CountRows"],
              placeholder: "Escribe la función DAX...",
            },
            explanation: "COUNTROWS cuenta la cantidad exacta de filas que posee una tabla según los filtros activos.",
          },
        ],
      },

      // ── NIVEL 5: Visualización e Informes de Impacto ─────────────────────
      {
        id: "pbi-5",
        title: "Nivel 5 · Visualización & Dashboards",
        kind: "lesson",
        xp: 25,
        exercises: [
          {
            id: "pbi-5-e1",
            type: "story",
            prompt: "Diseño de Informes de Alto Impacto 📊",
            hint: "Principios de UX y Storytelling con datos.",
            data: {
              slides: [
                {
                  title: "La Regla de los 5 Segundos",
                  text: "Un gran dashboard no es un 'árbol de navidad' repleto de gráficos de colores sin sentido. Cualquier directivo debe comprender el estado del negocio en 5 segundos.",
                  highlightText: "Usa Tarjetas KPI arriba para las cifras clave, Gráficos de Líneas para evolución en el tiempo y Segmentadores (Slicers) para interactividad.",
                },
                {
                  title: "Interactividad Avanzada",
                  text: "Power BI ofrece herramientas avanzadas para sorprender al usuario:\n\n1. Marcadores (Bookmarks): Guardar estados y crear menús de navegación.\n2. Tooltips Personalizados: Mostrar reportes emergentes al pasar el mouse.\n3. Drillthrough: Navegar en detalle desde un resumen hasta el nivel de cliente.",
                  codeSnippet: "// Buenas prácticas de diseño:\n- Máximo 4 a 6 visuales por página\n- Paleta de colores sobria y consistente\n- Alineación exacta de elementos",
                },
              ],
            },
            explanation: "Un informe exitoso comunica métricas clave con claridad visual e interactividad intuitiva.",
          },
          {
            id: "pbi-5-e2",
            type: "multiple-choice",
            prompt: "¿Qué tipo de gráfico es el más adecuado para representar el crecimiento de las ventas mes a mes a lo largo de 3 años?",
            hint: "Es el gráfico estándar para tendencias temporales.",
            data: {
              options: [
                "Gráfico de Pie / Pastel",
                "Gráfico de Líneas",
                "Gráfico de Donas",
                "Treemap",
              ],
              correctIndex: 1,
            },
            explanation: "Los gráficos de líneas son los mejores visuales para mostrar tendencias continuas a lo largo del tiempo.",
          },
          {
            id: "pbi-5-e3",
            type: "select-all",
            prompt: "¿Cuáles de las siguientes son funcionalidades avanzadas de interactividad en Power BI?",
            hint: "Selecciona las opciones que mejoran la experiencia del usuario.",
            data: {
              options: [
                "Marcadores / Bookmarks para cambiar vistas con botones",
                "Obtención de detalles / Drillthrough hacia páginas específicas",
                "Información sobre herramientas (Tooltips) de página personalizada",
                "Generador automático de presentaciones de PowerPoint",
              ],
              correctIndices: [0, 1, 2],
            },
            explanation: "Los Marcadores, Drillthrough y Tooltips de página brindan una experiencia interactiva de nivel profesional.",
          },
        ],
      },

      // ── PUNTO DE CONTROL DE POWER BI ──────────────────────────────────────
      {
        id: "pbi-checkpoint",
        title: "Punto de Control · Evaluación Power BI",
        kind: "checkpoint",
        xp: 35,
        exercises: [
          {
            id: "pbi-chk-1",
            type: "multiple-choice",
            prompt: "¿En qué orden se procesan lógicamente los datos en el flujo de trabajo de Power BI?",
            hint: "Piensa en el camino de los datos desde la fuente hasta la nube.",
            data: {
              options: [
                "Power Query → DAX → Publicación en Power BI Service",
                "DAX → Power Query → Publicación en Power BI Service",
                "Publicación → Power Query → DAX",
                "DAX → Publicación → Power Query",
              ],
              correctIndex: 0,
            },
            explanation: "Primero se extraen y limpian los datos en Power Query, luego se modelan y calculan con DAX, y finalmente se publican a Power BI Service.",
          },
        ],
      },

      // ── TROFEO DE MAESTRÍA EN POWER BI ────────────────────────────────────
      {
        id: "pbi-trophy",
        title: "Trofeo de Maestría en Power BI",
        kind: "trophy",
        xp: 50,
        exercises: [
          {
            id: "pbi-tr-1",
            type: "multiple-choice",
            prompt: "¡Felicitaciones! Has dominado los fundamentos de Power BI. ¿Estás listo para aplicar tus conocimientos en proyectos reales?",
            hint: "¡Demuestra tu dominio técnico!",
            data: {
              options: [
                "¡Sí! Estoy listo para construir Dashboards de nivel empresarial.",
                "Necesito repasar los niveles anteriores.",
              ],
              correctIndex: 0,
            },
            explanation: "¡Felicidades! Has completado el módulo oficial de Power BI en ProgramBI.",
          },
        ],
      },
    ],
  },
  {
    id: "inteligencia-artificial",
    slug: "inteligencia-artificial",
    title: "Inteligencia Artificial",
    description: "Prompting, RAG y fundamentos de LLMs.",
    icon: "Brain",
    accentColor: "#7C3AED",
    emoji: "🧠",
    levels: [
      { id: "ia-1", title: "Nivel 1 · Fundamentos", kind: "lesson", xp: 10, exercises: [] },
      { id: "ia-2", title: "Nivel 2 · Prompting", kind: "lesson", xp: 15, exercises: [] },
    ],
  },
  {
    id: "python",
    slug: "python",
    title: "Python",
    description: "Sintaxis, tipos de datos y librerías.",
    icon: "Code2",
    accentColor: "#3B82F6",
    emoji: "🐍",
    levels: [
      { id: "py-1", title: "Nivel 1 · Sintaxis", kind: "lesson", xp: 10, exercises: [] },
    ],
  },
  {
    id: "excel",
    slug: "excel",
    title: "Excel Avanzado",
    description: "Fórmulas, tablas dinámicas y dashboards.",
    icon: "FileSpreadsheet",
    accentColor: "#10B981",
    emoji: "📈",
    levels: [
      { id: "x-1", title: "Nivel 1 · Fórmulas", kind: "lesson", xp: 10, exercises: [] },
    ],
  },
];

// Helper: obtener un Unit por slug.
export function getUnitBySlug(slug: string): Unit | undefined {
  return PRACTICE_UNITS.find((u) => u.slug === slug);
}