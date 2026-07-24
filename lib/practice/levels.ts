// =============================================================================
// Catálogo de Units (secciones) y sus Levels (niveles) + Ejercicios.
//
// Incluye los primeros 50 Niveles pedagógicos completos de Power BI (Secciones 1 a 5).
// =============================================================================

import type { Unit } from "./types";

export const PRACTICE_UNITS: Unit[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // UNIDAD PRINCIPAL: POWER BI (Primeros 50 Niveles Completos)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "power-bi",
    slug: "power-bi",
    title: "Power BI",
    description: "Business Intelligence, Power Query, Modelado y Visualización de alto impacto.",
    icon: "BarChart3",
    accentColor: "#F2C811", // amarillo Power BI
    emoji: "📊",
    levels: [
      // ═════════════════════════════════════════════════════════════════════
      // SECCIÓN 1: Fundamentos de BI & Ecosistema (Niveles 1 – 10)
      // ═════════════════════════════════════════════════════════════════════
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
              options: ["Power BI Service", "Power BI Desktop", "Power BI Mobile", "Power BI Embedded"],
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
            explanation: "Power BI es extremadamente versátil y se conecta a casi cualquier fuente de datos.",
          },
        ],
      },
      {
        id: "pbi-2",
        title: "Nivel 2 · Instalación & Power BI Desktop",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-2-e1",
            type: "story",
            prompt: "Instalando tu estudio de trabajo 💻",
            hint: "Power BI Desktop es gratuito y se actualiza mensualmente.",
            data: {
              slides: [
                {
                  title: "Descargar Power BI Desktop",
                  text: "Power BI Desktop es 100% gratuito. Se recomienda instalarlo desde la Microsoft Store de Windows para recibir actualizaciones automáticas mensuales con nuevas funciones visuales y conectores.",
                  highlightText: "Tip de Pro: Mantén siempre Power BI actualizado a la versión del mes corriente.",
                },
              ],
            },
            explanation: "Instalar desde la Microsoft Store garantiza recibir parches y mejoras mensuales automáticamente.",
          },
          {
            id: "pbi-2-e2",
            type: "multiple-choice",
            prompt: "¿Cuál es la frecuencia recomendada con la que Microsoft lanza actualizaciones con nuevas funciones para Power BI Desktop?",
            hint: "Microsoft lanza una versión nueva de forma muy regular.",
            data: {
              options: ["Semanalmente", "Mensualmente", "Anualmente", "Cada 2 años"],
              correctIndex: 1,
            },
            explanation: "Microsoft publica actualizaciones de Power BI Desktop de forma mensual.",
          },
          {
            id: "pbi-2-e3",
            type: "fill-blank",
            prompt: "¿En qué sistema operativo de computadora se ejecuta de forma nativa Power BI Desktop?",
            hint: "Es el sistema operativo insignia de Microsoft.",
            data: {
              acceptedAnswers: ["windows", "Windows", "WINDOWS"],
              placeholder: "Escribe el nombre del SO...",
            },
            explanation: "Power BI Desktop es una aplicación nativa de Windows.",
          },
        ],
      },
      {
        id: "pbi-3",
        title: "Nivel 3 · Las 3 Vistas Principales",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-3-e1",
            type: "story",
            prompt: "Conociendo la interfaz de Power BI 🧭",
            hint: "En el lado izquierdo encontrarás las 3 vistas fundamentales.",
            data: {
              slides: [
                {
                  title: "Navegación por Vistas",
                  text: "Al abrir Power BI Desktop, en el margen izquierdo verás 3 íconos clave:\n\n1. Vista de Informe: Lienzo donde arrastras gráficos y diseñas el dashboard.\n2. Vista de Datos / Tabla: Permite inspeccionar las filas y columnas cargadas.\n3. Vista de Modelo: Diagrama donde conectas las relaciones entre tablas.",
                  highlightText: "Diseñar = Vista Informe | Inspeccionar = Vista Datos | Relacionar = Vista Modelo",
                },
              ],
            },
            explanation: "Las 3 vistas son el corazón de la navegación en Power BI Desktop.",
          },
          {
            id: "pbi-3-e2",
            type: "match-pairs",
            prompt: "Empareja la vista de Power BI Desktop con su objetivo.",
            hint: "Relaciona el ícono de la izquierda con lo que realizas en él.",
            data: {
              left: [
                { id: "L1", text: "Vista de Informe" },
                { id: "L2", text: "Vista de Datos / Tabla" },
                { id: "L3", text: "Vista de Modelo" },
              ],
              right: [
                { id: "R1", text: "Insertar gráficos y segmentadores" },
                { id: "R2", text: "Revisar registros y valores de columnas" },
                { id: "R3", text: "Crear relaciones entre tablas" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "La vista de informe es para diseño visual, vista de datos para inspección y vista de modelo para diagramar relaciones.",
          },
          {
            id: "pbi-3-e3",
            type: "multiple-choice",
            prompt: "¿En qué vista creas y editas las relaciones de cardinalidad (1:*) entre tablas?",
            hint: "Es la vista con ícono de diagrama de flujo.",
            data: {
              options: ["Vista de Informe", "Vista de Datos", "Vista de Modelo", "Power Query"],
              correctIndex: 2,
            },
            explanation: "La Vista de Modelo está diseñada para visualizar el diagrama entidad-relación.",
          },
        ],
      },
      {
        id: "pbi-4",
        title: "Nivel 4 · Primera Conexión a Datos (Excel/CSV)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-4-e1",
            type: "story",
            prompt: "Obteniendo tus primeros datos 📥",
            hint: "El botón 'Obtener datos' o 'Get Data' inicia todo el proceso.",
            data: {
              slides: [
                {
                  title: "El Navegador de Datos",
                  text: "Al seleccionar un libro de Excel en 'Obtener datos', se abre la ventana del Navegador (*Navigator*). Aquí puedes marcar la casilla de las hojas o tablas que deseas importar.",
                  highlightText: "Importante: En la parte inferior del Navegador verás dos opciones clave: 'Cargar' (load) y 'Transformar datos' (transform data).",
                },
              ],
            },
            explanation: "El Navegador te permite previsualizar y seleccionar las hojas o tablas antes de cargarlas.",
          },
          {
            id: "pbi-4-e2",
            type: "arrange",
            prompt: "Ordena los pasos para importar un archivo de Excel a Power BI:",
            hint: "Desde la cinta de opciones hasta la carga.",
            data: {
              tokens: [
                { id: "t1", text: "1. Clic en 'Obtener datos' → Excel" },
                { id: "t2", text: "2. Seleccionar el archivo en tu disco" },
                { id: "t3", text: "3. Marcar las casillas en el Navegador" },
                { id: "t4", text: "4. Clic en 'Transformar datos' o 'Cargar'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Ese es el flujo estándar para conectar cualquier archivo local de Excel.",
          },
          {
            id: "pbi-4-e3",
            type: "multiple-choice",
            prompt: "Si tus datos de Excel no están completamente limpios, ¿qué botón debes presionar en el Navegador?",
            hint: "Abre el editor de Power Query.",
            data: {
              options: ["Cargar", "Transformar datos", "Cancelar", "Refrescar"],
              correctIndex: 1,
            },
            explanation: "Siempre se recomienda elegir 'Transformar datos' para auditar y limpiar los campos en Power Query.",
          },
        ],
      },
      {
        id: "pbi-5",
        title: "Nivel 5 · Conexión a Web y APIs",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-5-e1",
            type: "multiple-choice",
            prompt: "¿Qué opción de 'Obtener datos' usas para extraer automáticamente tablas publicadas en una página web pública?",
            hint: "Conector nativo que analiza el HTML.",
            data: {
              options: ["Conector Web", "Conector Excel", "Conector Texto/CSV", "Conector SQL"],
              correctIndex: 0,
            },
            explanation: "El conector Web scraping de Power BI analiza el HTML de una URL y extrae las tablas detectadas automáticamente.",
          },
          {
            id: "pbi-5-e2",
            type: "select-all",
            prompt: "¿Cuáles de los siguientes son conectores nativos disponibles en Power BI Desktop?",
            hint: "Power BI cuenta con más de 100 conectores.",
            data: {
              options: [
                "Azure SQL Database",
                "Google BigQuery",
                "SharePoint Folder",
                "Salesforce Reports",
              ],
              correctIndices: [0, 1, 2, 3],
            },
            explanation: "Power BI dispone de conectores nativos para las principales nubes y servicios empresariales.",
          },
          {
            id: "pbi-5-e3",
            type: "fill-blank",
            prompt: "Completa: Para consumir una API REST que devuelve datos en formato JSON, utilizamos el conector _____ de Power BI.",
            hint: "Mismo conector de páginas de internet.",
            data: {
              acceptedAnswers: ["web", "Web", "WEB"],
              placeholder: "Escribe el nombre del conector...",
            },
            explanation: "El conector Web puede realizar solicitudes HTTP a APIs REST y parsear el resultado JSON.",
          },
        ],
      },
      {
        id: "pbi-6",
        title: "Nivel 6 · Carga vs Transformación",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-6-e1",
            type: "story",
            prompt: "La Regla de Oro de la Carga de Datos 🟡",
            hint: "Nunca cargues datos basura directamente a tu modelo.",
            data: {
              slides: [
                {
                  title: "¿Cargar o Transformar?",
                  text: "Presionar directamente 'Cargar' importa los datos tal como están. Si hay errores o columnas innecesarias, ralentizarán todo tu reporte.",
                  highlightText: "Regla de Oro: El 99% de las veces debes presionar 'Transformar datos' antes de Cargar.",
                },
              ],
            },
            explanation: "Transformar primero garantiza que el modelo solo contenga datos limpios y optimizados.",
          },
          {
            id: "pbi-6-e2",
            type: "match-pairs",
            prompt: "Empareja la acción con la consecuencia en el informe.",
            hint: "Relaciona la práctica con su impacto.",
            data: {
              left: [
                { id: "L1", text: "Transformar datos antes" },
                { id: "L2", text: "Cargar 50 columnas innecesarias" },
              ],
              right: [
                { id: "R1", text: "Modelo ágil, rápido y optimizado" },
                { id: "R2", text: "Consumo alto de RAM y lentitud" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
              ],
            },
            explanation: "Eliminar columnas sobrantes en Power Query reduce dramáticamente el tamaño en memoria del archivo .pbix.",
          },
          {
            id: "pbi-6-e3",
            type: "multiple-choice",
            prompt: "¿Qué sucede si eliminas columnas no utilizadas en Power Query antes de cargar?",
            hint: "El motor VertiPaq comprime por columnas.",
            data: {
              options: [
                "Se reduce el tamaño del archivo y mejora la velocidad",
                "El informe se rompe obligatoriamente",
                "Aumenta el tiempo de carga",
                "No tiene ningún impacto",
              ],
              correctIndex: 0,
            },
            explanation: "Power BI usa un motor columnar. Menos columnas significan mayor tasa de compresión y mayor velocidad.",
          },
        ],
      },
      {
        id: "pbi-7",
        title: "Nivel 7 · Guardar y Formatos (.pbix)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-7-e1",
            type: "multiple-choice",
            prompt: "¿Cuál es la extensión estándar del archivo que genera Power BI Desktop al guardar tu trabajo?",
            hint: "Termina en .pbix",
            data: {
              options: [".xlsx", ".pbix", ".pbit", ".twbx"],
              correctIndex: 1,
            },
            explanation: "El formato .pbix (Power BI Executive) empaqueta el modelo de datos, la estructura de Power Query y las páginas de reportes.",
          },
          {
            id: "pbi-7-e2",
            type: "fill-blank",
            prompt: "Completa: El formato de plantilla ligera sin datos cargados en Power BI tiene la extensión .pbi__",
            hint: "La última letra es 't' de Template.",
            data: {
              acceptedAnswers: ["pbit", "PBIT", ".pbit"],
              placeholder: "Escribe la extensión...",
            },
            explanation: ".pbit es la plantilla de Power BI que guarda solo la estructura sin los datos.",
          },
          {
            id: "pbi-7-e3",
            type: "select-all",
            prompt: "¿Qué elementos están contenidos internamente dentro de un archivo .pbix de Power BI?",
            hint: "Es un archivo comprimido integral.",
            data: {
              options: [
                "La consulta de Power Query (Pasos en Lenguaje M)",
                "El modelo de datos comprimido y sus relaciones",
                "Las medidas y fórmulas DAX creadas",
                "El diseño visual de las páginas del reporte",
              ],
              correctIndices: [0, 1, 2, 3],
            },
            explanation: "Un archivo .pbix empaqueta todo el proyecto de inteligencia de negocios.",
          },
        ],
      },
      {
        id: "pbi-8",
        title: "Nivel 8 · Caso Práctico: Cargar Ventas Minoristas",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-8-e1",
            type: "story",
            prompt: "Caso Real: Proyecto Retail 🛍️",
            hint: "Resolución de un caso práctico de carga.",
            data: {
              slides: [
                {
                  title: "Desafío de la Tienda Minorista",
                  text: "La gerencia de 'SuperMercado Express' te entrega un libro Excel con 3 hojas: 'Ventas2026', 'Clientes' y 'Productos'. Tu misión es conectar Power BI a las 3 tablas.",
                  highlightText: "Debes validar que cada tabla se cargue con sus encabezados correctos antes de construir gráficos.",
                },
              ],
            },
            explanation: "Conectar múltiples tablas es la base para construir modelos relacionales.",
          },
          {
            id: "pbi-8-e2",
            type: "arrange",
            prompt: "Ordena los pasos para cargar exitosamente las 3 tablas del caso minorista:",
            hint: "Navegador → Selección triple → Transformar.",
            data: {
              tokens: [
                { id: "t1", text: "1. Seleccionar 'Obtener datos' → Excel" },
                { id: "t2", text: "2. Marcar 'Ventas2026', 'Clientes' y 'Productos'" },
                { id: "t3", text: "3. Clic en 'Transformar datos'" },
                { id: "t4", text: "4. Verificar tipos de datos en Power Query" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Marcas múltiples casillas en el Navegador para traer todas las tablas en una sola operación.",
          },
          {
            id: "pbi-8-e3",
            type: "multiple-choice",
            prompt: "En la tabla 'Ventas2026', ¿qué tipo de dato debe asignarse a la columna 'MontoVenta'?",
            hint: "Representa dinero.",
            data: {
              options: ["Texto", "Número Decimal o Moneda", "Booleano", "Fecha"],
              correctIndex: 1,
            },
            explanation: "Los montos monetarios deben ser siempre números decimales para poder realizar sumas y promedios.",
          },
        ],
      },
      {
        id: "pbi-9",
        title: "Nivel 9 · Repaso de Arquitectura y Flujo",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-9-e1",
            type: "match-pairs",
            prompt: "Repaso: Empareja la etapa del flujo con su herramienta.",
            hint: "Consolida lo aprendido en la Sección 1.",
            data: {
              left: [
                { id: "L1", text: "Limpieza y ETL" },
                { id: "L2", text: "Modelado y Fórmulas" },
                { id: "L3", text: "Distribución en la Nube" },
              ],
              right: [
                { id: "R1", text: "Power Query (Lenguaje M)" },
                { id: "R2", text: "Power BI Desktop (DAX)" },
                { id: "R3", text: "Power BI Service" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Power Query limpia, Desktop modela con DAX y Service distribuye.",
          },
          {
            id: "pbi-9-e2",
            type: "arrange",
            prompt: "Ordena el ciclo completo desde la pregunta de negocio hasta la decisión:",
            hint: "Desde la fuente hasta el usuario final.",
            data: {
              tokens: [
                { id: "t1", text: "1. Datos Crudos en la Fuente" },
                { id: "t2", text: "2. Preparación en Power Query" },
                { id: "t3", text: "3. Creación de Métricas en Desktop" },
                { id: "t4", text: "4. Toma de Decisiones en el Dashboard" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "El objetivo final del BI es transformar datos en decisiones ejecutivas.",
          },
        ],
      },
      {
        id: "pbi-10",
        title: "Nivel 10 · Punto de Control 1 & Trofeo de Sección",
        kind: "checkpoint",
        xp: 30,
        exercises: [
          {
            id: "pbi-10-e1",
            type: "multiple-choice",
            prompt: "Evaluación Sección 1: ¿Cuál es el orden correcto de las 3 actividades principales en Power BI Desktop?",
            hint: "De izquierda a derecha en las vistas.",
            data: {
              options: [
                "Obtener/Transformar Datos → Modelar/Relacionar → Diseñar Reporte",
                "Diseñar Reporte → Obtener Datos → Modelar",
                "Modelar → Diseñar → Transformar",
                "Publicar → Transformar → Obtener",
              ],
              correctIndex: 0,
            },
            explanation: "¡Excelente! Has completado el Punto de Control 1 y desbloqueado la Sección 2 de Power Query.",
          },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // SECCIÓN 2: Power Query & Limpieza Básica (Niveles 11 – 20)
      // ═════════════════════════════════════════════════════════════════════
      {
        id: "pbi-11",
        title: "Nivel 11 · Editor de Power Query",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-11-e1",
            type: "story",
            prompt: "Entrando al Laboratorio de Datos 🧫",
            hint: "El panel 'Pasos Aplicados' es tu historial de cambios.",
            data: {
              slides: [
                {
                  title: "El Panel de Pasos Aplicados",
                  text: "A la derecha del editor de Power Query verás la lista de 'Pasos Aplicados'. Cada transformación que realizas se añade como un paso secuencial.",
                  highlightText: "Tip de Pro: Puedes eliminar o reordenar un paso haciendo clic en la 'X' roja a su lado.",
                },
              ],
            },
            explanation: "Pasos Aplicados registra la secuencia exacta de transformaciones ejecutadas.",
          },
          {
            id: "pbi-11-e2",
            type: "multiple-choice",
            prompt: "¿Cómo deshaces una transformación errónea en el editor de Power Query?",
            hint: "Busca la sección a la derecha del editor.",
            data: {
              options: [
                "Haciendo clic en la 'X' del paso en el panel 'Pasos Aplicados'",
                "Presionando Ctrl+Z obligatoriamente",
                "Reiniciando la computadora",
                "Borrando la tabla completa",
              ],
              correctIndex: 0,
            },
            explanation: "Eliminar el paso específico en el panel 'Pasos Aplicados' revierte la transformación sin perder el resto.",
          },
          {
            id: "pbi-11-e3",
            type: "fill-blank",
            prompt: "Completa: Al terminar de limpiar tus datos en Power Query, debes hacer clic en 'Cerrar y ______' arriba a la izquierda.",
            hint: "Aplica los cambios al modelo.",
            data: {
              acceptedAnswers: ["aplicar", "Aplicar", "APLICAR"],
              placeholder: "Escribe la palabra...",
            },
            explanation: "'Cerrar y aplicar' guarda los pasos en M e ingresa los datos limpios a Power BI Desktop.",
          },
        ],
      },
      {
        id: "pbi-12",
        title: "Nivel 12 · Tipos de Datos en Power Query",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-12-e1",
            type: "match-pairs",
            prompt: "Empareja el ícono de tipo de dato de Power Query con su significado.",
            hint: "Aparecen al lado del nombre de cada columna.",
            data: {
              left: [
                { id: "L1", text: "ABC" },
                { id: "L2", text: "123" },
                { id: "L3", text: "Calendario 📅" },
                { id: "L4", text: "1.2" },
              ],
              right: [
                { id: "R1", text: "Texto" },
                { id: "R2", text: "Número Entero" },
                { id: "R3", text: "Fecha" },
                { id: "R4", text: "Número Decimal" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
                { left: "L4", right: "R4" },
              ],
            },
            explanation: "Los íconos en el encabezado indican visualmente el tipo de dato asignado por Power Query.",
          },
          {
            id: "pbi-12-e2",
            type: "multiple-choice",
            prompt: "¿Qué ocurre si intentas sumar una columna que tiene tipo de dato 'Texto' (ABC)?",
            hint: "Power BI requiere tipo numérico para operar agregaciones.",
            data: {
              options: [
                "Power BI no te permitirá aplicar funciones de suma como SUM()",
                "Se suma automáticamente convirtiendo el texto",
                "Se borra la columna",
                "Se multiplica por 1",
              ],
              correctIndex: 0,
            },
            explanation: "Para realizar operaciones matemáticas en DAX o visuales, la columna debe estar configurada como tipo numérico.",
          },
          {
            id: "pbi-12-e3",
            type: "select-all",
            prompt: "¿Cuáles de los siguientes son tipos de datos válidos reconocidos en Power Query?",
            hint: "Selecciona todos los tipos reales.",
            data: {
              options: [
                "Número Decimal Fijo (Moneda)",
                "Porcentaje",
                "Fecha/Hora/Zona Horaria",
                "Verdadero/Falso (Booleano)",
              ],
              correctIndices: [0, 1, 2, 3],
            },
            explanation: "Todos ellos son tipos de datos oficiales nativos en el motor de Power Query.",
          },
        ],
      },
      {
        id: "pbi-13",
        title: "Nivel 13 · Eliminar Filas y Columnas",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-13-e1",
            type: "story",
            prompt: "Depurando la Basura del Reporte 🗑️",
            hint: "Menos columnas = Informe más veloz.",
            data: {
              slides: [
                {
                  title: "Quitar Columnas Sobrantes",
                  text: "Muchos archivos contienen decenas de columnas secundarias que nadie necesita. En Power Query puedes seleccionar las columnas importantes y usar 'Quitar otras columnas'.",
                  highlightText: "Tip Profesional: Usar 'Quitar otras columnas' es más seguro que 'Quitar columnas', porque si el origen añade nuevas columnas en el futuro, no ensuciarán tu modelo.",
                },
              ],
            },
            explanation: "'Quitar otras columnas' inmuniza tu modelo ante la aparición de campos basura futuros.",
          },
          {
            id: "pbi-13-e2",
            type: "arrange",
            prompt: "Ordena la secuencia recomendada para mantener solo 3 columnas clave:",
            hint: "Selección + Operación de retención.",
            data: {
              tokens: [
                { id: "t1", text: "1. Mantener presionada la tecla Ctrl" },
                { id: "t2", text: "2. Hacer clic en las 3 columnas deseadas" },
                { id: "t3", text: "3. Clic derecho en el encabezado" },
                { id: "t4", text: "4. Seleccionar 'Quitar otras columnas'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Esa es la técnica idónea para conservar exactamente las columnas requeridas.",
          },
          {
            id: "pbi-13-e3",
            type: "fill-blank",
            prompt: "Completa: Para eliminar las primeras 3 filas de títulos desalineados en Excel, usamos la opción 'Quitar filas _____'.",
            hint: "Dirección de arriba.",
            data: {
              acceptedAnswers: ["superiores", "Superiores", "SUPERIORES", "arriba"],
              placeholder: "Escribe la palabra...",
            },
            explanation: "'Quitar filas superiores' borra las primeras N filas vacías o de texto decorativo de un archivo Excel.",
          },
        ],
      },
      {
        id: "pbi-14",
        title: "Nivel 14 · Reemplazar Valores y Nulos",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-14-e1",
            type: "multiple-choice",
            prompt: "¿Qué palabra clave utiliza Power Query para representar una celda sin valor o vacía?",
            hint: "Escrito en minúsculas en inglés.",
            data: {
              options: ["N/A", "null", "EMPTY", "0"],
              correctIndex: 1,
            },
            explanation: "Power Query asigna el valor especial `null` a los campos ausentes o vacíos.",
          },
          {
            id: "pbi-14-e2",
            type: "fill-blank",
            prompt: "Completa: Si quieres cambiar todos los 'null' de la columna Ventas por '0', usas la función 'Reemplazar los ______'.",
            hint: "La palabra es valores.",
            data: {
              acceptedAnswers: ["valores", "Valores", "VALORES"],
              placeholder: "Escribe la palabra...",
            },
            explanation: "'Reemplazar los valores' busca una coincidencia exacta y la sustituye en toda la columna.",
          },
          {
            id: "pbi-14-e3",
            type: "match-pairs",
            prompt: "Empareja el problema de datos con la solución en Power Query.",
            hint: "Soluciones de depuración estándar.",
            data: {
              left: [
                { id: "L1", text: "Celdas vacías en ventas" },
                { id: "L2", text: "Texto con guiones 'CL-100'" },
                { id: "L3", text: "Valores duplicados" },
              ],
              right: [
                { id: "R1", text: "Reemplazar null por 0" },
                { id: "R2", text: "Reemplazar '-' por ''" },
                { id: "R3", text: "Quitar duplicados" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Saber qué herramienta usar ante cada fallo de datos acelera la preparación del informe.",
          },
        ],
      },
      {
        id: "pbi-15",
        title: "Nivel 15 · Quitar Duplicados",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-15-e1",
            type: "story",
            prompt: "Garantizando Llaves Únicas 🔑",
            hint: "Las tablas de dimensiones requieren valores sin repetir.",
            data: {
              slides: [
                {
                  title: "La Importancia de Quitar Duplicados",
                  text: "Para construir una Tabla de Dimensión de Clientes o Productos, cada ID debe aparecer exactamente UNA sola vez.",
                  highlightText: "Al hacer clic derecho en la columna ID -> 'Quitar duplicados', Power Query deja únicamente registros únicos.",
                },
              ],
            },
            explanation: "Quitar duplicados es vital para crear claves primarias en tablas de dimensión.",
          },
          {
            id: "pbi-15-e2",
            type: "multiple-choice",
            prompt: "¿Qué ocurre si aplicas 'Quitar duplicados' habiendo seleccionado 2 columnas a la vez?",
            hint: "Evalúa la combinación de ambas.",
            data: {
              options: [
                "Elimina filas solo cuando la combinación de ambas columnas se repite",
                "Elimina la primera columna",
                "Borra toda la tabla",
                "Genera un error de sintaxis",
              ],
              correctIndex: 0,
            },
            explanation: "Al seleccionar múltiples columnas, Power Query busca pares/combinaciones idénticas para eliminar.",
          },
          {
            id: "pbi-15-e3",
            type: "select-all",
            prompt: "¿En cuáles de las siguientes situaciones es obligatorio aplicar 'Quitar duplicados'?",
            hint: "Piensa en el lado '1' de las relaciones.",
            data: {
              options: [
                "Al crear la tabla de dimensión Dim_Clientes a partir de ventas históricas",
                "Al preparar la lista única de Productos para un filtro",
                "Al preparar la lista única de Sucursales de la empresa",
                "En la tabla de hechos Fact_Ventas con las transacciones diarias",
              ],
              correctIndices: [0, 1, 2],
            },
            explanation: "En las tablas de hechos SÍ se repiten los IDs de cliente; en las dimensiones NUNCA deben repetirse.",
          },
        ],
      },
      {
        id: "pbi-16",
        title: "Nivel 16 · Filtrado de Filas en Power Query",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-16-e1",
            type: "fill-blank",
            prompt: "Completa: Para ignorar datos de pruebas anteriores a 2020 en Power Query, filtramos la columna Fecha con 'Filtros de fecha → Es posterior a _____'.",
            hint: "Año límite de corte.",
            data: {
              acceptedAnswers: ["2020", "2019-12-31", "31/12/2019"],
              placeholder: "Escribe el año...",
            },
            explanation: "Filtrar filas innecesarias en Power Query reduce el volumen cargado a memoria.",
          },
          {
            id: "pbi-16-e2",
            type: "arrange",
            prompt: "Ordena los pasos para aplicar un filtro de texto que excluya ventas anuladas:",
            hint: "Usa la flecha del encabezado de la columna.",
            data: {
              tokens: [
                { id: "t1", text: "1. Clic en la flecha de la columna 'Estado'" },
                { id: "t2", text: "2. Ir a 'Filtros de texto'" },
                { id: "t3", text: "3. Seleccionar 'No es igual a'" },
                { id: "t4", text: "4. Escribir 'Anulada' y presionar Aceptar" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Los filtros de texto permiten reglas avanzadas como 'no contiene' o 'comienza por'.",
          },
        ],
      },
      {
        id: "pbi-17",
        title: "Nivel 17 · Mayúsculas, Minúsculas y Recortar Espacios",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-17-e1",
            type: "match-pairs",
            prompt: "Empareja la transformación de texto con su resultado sobre '  juan perez  '.",
            hint: "Menú Transformar → Formato.",
            data: {
              left: [
                { id: "L1", text: "Recortar (Trim)" },
                { id: "L2", text: "Poner en mayúsculas" },
                { id: "L3", text: "Poner Cada Palabra En Mayúscula" },
              ],
              right: [
                { id: "R1", text: "'juan perez' (sin espacios extremos)" },
                { id: "R2", text: "'  JUAN PEREZ  '" },
                { id: "R3", text: "'  Juan Perez  '" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Recortar elimina espacios invisibles al inicio y al final que rompen las búsquedas y relaciones.",
          },
          {
            id: "pbi-17-e2",
            type: "multiple-choice",
            prompt: "¿Por qué es crucial aplicar 'Recortar' (Trim) a las columnas de texto que servirán para relacionar dos tablas?",
            hint: "Los espacios invisibles hacen que 'Chile' y 'Chile ' no coincidan.",
            data: {
              options: [
                "Porque un espacio al final hace que dos textos parezcan distintos e impida la relación",
                "Porque cambia el tipo de dato a entero",
                "Porque elimina filas nulas",
                "Es solo un ajuste estético sin importancia",
              ],
              correctIndex: 0,
            },
            explanation: "'Chile' y 'Chile ' tienen códigos ASCII distintos. 'Recortar' asegura coincidencias perfectas.",
          },
        ],
      },
      {
        id: "pbi-18",
        title: "Nivel 18 · Caso Práctico: Depuración de Base de Clientes",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-18-e1",
            type: "story",
            prompt: "Caso Real: Saneamiento de CRM 👥",
            hint: "Aplica los conceptos de limpieza de la Sección 2.",
            data: {
              slides: [
                {
                  title: "El Problema del CRM",
                  text: "El sistema de clientes exportó datos con nombres en minúsculas, espacios adicionales al final, correos nulos y algunos clientes duplicados.",
                  highlightText: "Tu plan de acción: 1) Recortar espacios, 2) Poner Nombre en Mayúscula inicial, 3) Reemplazar nulls en Correo, 4) Quitar duplicados por ID_Cliente.",
                },
              ],
            },
            explanation: "Seguir un plan de depuración por pasos garantiza una tabla de dimensión pulida.",
          },
          {
            id: "pbi-18-e2",
            type: "arrange",
            prompt: "Ordena los 4 pasos para sanear la tabla de clientes:",
            hint: "De limpieza de texto a deduplicación final.",
            data: {
              tokens: [
                { id: "t1", text: "1. Formato → Recortar espacios en Nombre" },
                { id: "t2", text: "2. Formato → Poner Cada Palabra En Mayúscula" },
                { id: "t3", text: "3. Reemplazar valores: null por 'Sin Correo'" },
                { id: "t4", text: "4. Clic derecho en ID_Cliente → Quitar duplicados" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Esa es la secuencia lógica perfecta para obtener la dimensión Dim_Clientes lista para producción.",
          },
        ],
      },
      {
        id: "pbi-19",
        title: "Nivel 19 · Repaso de Limpieza en Power Query",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-19-e1",
            type: "match-pairs",
            prompt: "Repaso: Asocia la anomalía de datos con la herramienta adecuada.",
            hint: "Refuerza los conceptos de la Sección 2.",
            data: {
              left: [
                { id: "L1", text: "Espacios invisibles al final de palabras" },
                { id: "L2", text: "Registros de ventas de años pasados obsoletos" },
                { id: "L3", text: "Clientes repetidos con la misma cédula" },
              ],
              right: [
                { id: "R1", text: "Recortar (Trim)" },
                { id: "R2", text: "Filtrar por rango de fechas" },
                { id: "R3", text: "Quitar duplicados" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Reconocer al instante la técnica de Power Query ante un problema de datos es clave.",
          },
        ],
      },
      {
        id: "pbi-20",
        title: "Nivel 20 · Punto de Control 2 & Trofeo de Sección",
        kind: "checkpoint",
        xp: 30,
        exercises: [
          {
            id: "pbi-20-e1",
            type: "multiple-choice",
            prompt: "Evaluación Sección 2: ¿Cuál es la mejor práctica para eliminar 20 columnas innecesarias conservando solo 4 principales?",
            hint: "Inmuniza el informe ante cambios futuros.",
            data: {
              options: [
                "Seleccionar las 4 columnas deseadas y hacer clic en 'Quitar otras columnas'",
                "Borrar una por una manualmente",
                "Ocultarlas en la vista de informe",
                "Filtrar las filas en blanco",
              ],
              correctIndex: 0,
            },
            explanation: "¡Felicitaciones! Has completado la Sección 2 de Limpieza de Datos y ganado tu Trofeo.",
          },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // SECCIÓN 3: Transformaciones Avanzadas y Lenguaje M (Niveles 21 – 30)
      // ═════════════════════════════════════════════════════════════════════
      {
        id: "pbi-21",
        title: "Nivel 21 · Anular Dinamización (Unpivot)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-21-e1",
            type: "story",
            prompt: "De Tablas Horizontales a Tablas Verticales 🔄",
            hint: "Anular dinamización es la función estrella de Power Query.",
            data: {
              slides: [
                {
                  title: "El Problema de las Tablas Cruzadas",
                  text: "Muchos archivos de Excel traen los meses en columnas ('Enero', 'Febrero', 'Marzo'...). Esto es genial para humanos, ¡pero PÉSIMO para Power BI!",
                  highlightText: "Solución: Selecciona las columnas fijas (ej: Producto) -> Clic derecho -> 'Anular la dinamización de otras columnas'. Convierte 12 columnas de meses en 2 columnas: 'Atributo' (Mes) y 'Valor' (Monto).",
                },
              ],
            },
            explanation: "Anular dinamización normaliza datos horizontales para poder analizarlos con DAX.",
          },
          {
            id: "pbi-21-e2",
            type: "arrange",
            prompt: "Ordena los pasos para aplicar Unpivot a un presupuesto mensual:",
            hint: "Selecciona lo que NO debe cambiar y anula el resto.",
            data: {
              tokens: [
                { id: "t1", text: "1. Seleccionar la columna 'Categoría' y 'CentroCosto'" },
                { id: "t2", text: "2. Clic derecho en el encabezado" },
                { id: "t3", text: "3. Elegir 'Anular la dinamización de otras columnas'" },
                { id: "t4", text: "4. Renombrar 'Atributo' como 'Mes' y 'Valor' como 'Presupuesto'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Esa es la técnica oficial para des-dinamizar reportes financieros u operacionales.",
          },
          {
            id: "pbi-21-e3",
            type: "multiple-choice",
            prompt: "¿Cuáles son los nombres predeterminados de las 2 nuevas columnas que genera la operación Unpivot?",
            hint: "Términos genéricos de propiedad y valor.",
            data: {
              options: [
                "Atributo y Valor (Attribute & Value)",
                "Columna1 y Columna2",
                "Mes y Monto",
                "Origen y Destino",
              ],
              correctIndex: 0,
            },
            explanation: "Power Query nombra 'Atributo' a los antiguos encabezados y 'Valor' a los datos numéricos de la intersección.",
          },
        ],
      },
      {
        id: "pbi-22",
        title: "Nivel 22 · Dividir Columna por Delimitador",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-22-e1",
            type: "multiple-choice",
            prompt: "Tienes la columna 'Cod-Producto' con valores como 'PROD-105-CHILE'. ¿Qué delimitador usas para dividirla en 3 partes?",
            hint: "Es el carácter que separa los elementos.",
            data: {
              options: ["Guión (-)", "Coma (,)", "Espacio", "Punto (.)"],
              correctIndex: 0,
            },
            explanation: "Dividir por el delimitador guión '-' creará 3 columnas independientes: Código, ID y País.",
          },
          {
            id: "pbi-22-e2",
            type: "match-pairs",
            prompt: "Empareja la opción de delimitador con su aplicación típica.",
            hint: "Formatos de texto compuestos.",
            data: {
              left: [
                { id: "L1", text: "Dividir por '@'" },
                { id: "L2", text: "Dividir por ' '" },
                { id: "L3", text: "Dividir por '/'" },
              ],
              right: [
                { id: "R1", text: "Separar Usuario y Dominio de correo" },
                { id: "R2", text: "Separar Primer Nombre y Apellido" },
                { id: "R3", text: "Separar componentes de una ruta o fecha" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Saber elegir el delimitador adecuado facilita extraer sub-campos de cadenas complejas.",
          },
        ],
      },
      {
        id: "pbi-23",
        title: "Nivel 23 · Combinar Columnas y Crear Claves",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-23-e1",
            type: "arrange",
            prompt: "Ordena los pasos para crear una clave compuesta combinando 'ID_Tienda' e 'ID_Producto':",
            hint: "Selecciona ambas columnas en orden.",
            data: {
              tokens: [
                { id: "t1", text: "1. Seleccionar 'ID_Tienda' y luego 'ID_Producto' con Ctrl" },
                { id: "t2", text: "2. Ir a la pestaña 'Agregar columna'" },
                { id: "t3", text: "3. Clic en 'Combinar columnas'" },
                { id: "t4", text: "4. Elegir delimitador '-' y nombrar 'Clave_Tienda_Prod'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Las claves compuestas combinadas permiten crear relaciones de 1 a Varios cuando no existe un ID único sencillo.",
          },
        ],
      },
      {
        id: "pbi-24",
        title: "Nivel 24 · Combinar Consultas (Merge / Joins)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-24-e1",
            type: "story",
            prompt: "El VLOOKUP / BUSCARV de Power Query 🔍",
            hint: "Combinar consultas junta columnas de dos tablas mediante una llave.",
            data: {
              slides: [
                {
                  title: "Combinar Consultas (Merge)",
                  text: "Cuando quieres traer el 'Nombre del Producto' a tu tabla de ventas usando el 'ID_Producto', usas 'Combinar consultas'.",
                  highlightText: "Equivalente: 'Combinar consultas' es el sustituto moderno y automatizado del BUSCARV / XLOOKUP de Excel.",
                },
              ],
            },
            explanation: "Combinar consultas une dos tablas horizontalmente buscando coincidencias de clave.",
          },
          {
            id: "pbi-24-e2",
            type: "multiple-choice",
            prompt: "¿Cuál es el tipo de combinación (Join) predeterminado en Power Query que conserva TODAS las filas de la primera tabla y solo las coincidentes de la segunda?",
            hint: "Left Outer Join.",
            data: {
              options: [
                "Externa izquierda (Left Outer)",
                "Externa derecha (Right Outer)",
                "Interna (Inner Join)",
                "Externa completa (Full Outer)",
              ],
              correctIndex: 0,
            },
            explanation: "Externa izquierda (Left Outer) garantiza no perder ninguna venta de la tabla principal mientras busca los datos de la segunda.",
          },
        ],
      },
      {
        id: "pbi-25",
        title: "Nivel 25 · Anexar Consultas (Append / Unión)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-25-e1",
            type: "story",
            prompt: "Apilando Tablas Verticalmente 📚",
            hint: "Anexar junta filas de tablas con la misma estructura.",
            data: {
              slides: [
                {
                  title: "Anexar Consultas (Append)",
                  text: "Si tienes la tabla 'Ventas2024', 'Ventas2025' y 'Ventas2026' con las mismas columnas, usar 'Anexar consultas' las pega una debajo de la otra en una sola gran tabla histórica.",
                  highlightText: "Diferencia Clave: Combinar (Merge) agrega COLUMNAS a los lados. Anexar (Append) agrega FILAS hacia abajo.",
                },
              ],
            },
            explanation: "Anexar consultas consolida múltiples archivos o periodos en un único historial vertical.",
          },
          {
            id: "pbi-25-e2",
            type: "select-all",
            prompt: "¿Cuáles de los siguientes requisitos son necesarios para que 'Anexar consultas' funcione perfectamente?",
            hint: "Estructuras compatibles.",
            data: {
              options: [
                "Las columnas deben tener exactamente los mismos nombres de encabezado",
                "Los tipos de datos de las columnas coincidentes deben ser compatibles",
                "Las tablas deben tener el mismo número de filas",
                "Se deben haber borrado todas las fórmulas de Excel",
              ],
              correctIndices: [0, 1],
            },
            explanation: "Power Query coincide columnas por su NOMBRE exacto. Si los nombres coinciden, las filas se apilan ordenadamente.",
          },
        ],
      },
      {
        id: "pbi-26",
        title: "Nivel 26 · Columna Condicional en Power Query",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-26-e1",
            type: "fill-blank",
            prompt: "Completa: En el asistente de 'Columna condicional', creamos la regla: SI Monto > 1000 ENTONCES 'Cliente VIP' SINO 'Cliente ____'.",
            hint: "Opción estándar de categoría.",
            data: {
              acceptedAnswers: ["Normal", "normal", "Estándar", "estándar", "Regular"],
              placeholder: "Escribe la palabra...",
            },
            explanation: "La columna condicional en Power Query permite crear reglas IF-THEN-ELSE sin escribir código manual.",
          },
          {
            id: "pbi-26-e2",
            type: "arrange",
            prompt: "Ordena los pasos para crear una categoría de edad con Columna Condicional:",
            hint: "Agregar columna → Columna condicional.",
            data: {
              tokens: [
                { id: "t1", text: "1. Ir a la pestaña 'Agregar columna'" },
                { id: "t2", text: "2. Clic en 'Columna condicional'" },
                { id: "t3", text: "3. Definir: Si Edad >= 60 → 'Senior'" },
                { id: "t4", text: "4. Agregar cláusula: De lo contrario → 'Adulto'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Es el método visual para segmentar registros en categorías dentro de Power Query.",
          },
        ],
      },
      {
        id: "pbi-27",
        title: "Nivel 27 · Introducción al Lenguaje M",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-27-e1",
            type: "story",
            prompt: "Bajo el Capó: El Lenguaje M 🔧",
            hint: "El Editor Avanzado muestra el código fuente funcional completo.",
            data: {
              slides: [
                {
                  title: "El Editor Avanzado (Advanced Editor)",
                  text: "Al hacer clic en 'Editor avanzado' en la pestaña Inicio de Power Query, verás la estructura del script M de tu consulta:",
                  codeSnippet: "let\n    Origen = Excel.Workbook(File.Contents(\"C:\\Ventas.xlsx\")),\n    Ventas_Sheet = Origen{[Item=\"Ventas\",Kind=\"Sheet\"]}[Data],\n    #\"Encabezados Promovidos\" = Table.PromoteHeaders(Ventas_Sheet)\nin\n    #\"Encabezados Promovidos\"",
                  highlightText: "Estructura de M: Comienza con la palabra `let` (definición de pasos) y finaliza con `in` (el paso que se devuelve).",
                },
              ],
            },
            explanation: "Todo script en Lenguaje M encierra sus variables de paso entre las palabras clave `let` e `in`.",
          },
          {
            id: "pbi-27-e2",
            type: "multiple-choice",
            prompt: "¿Cuáles son las dos palabras clave fundamentales que estructuran cualquier bloque de código en Lenguaje M?",
            hint: "Definición y retorno.",
            data: {
              options: ["let e in", "if y else", "begin y end", "select y from"],
              correctIndex: 0,
            },
            explanation: "`let` declara la lista de variables/pasos y `in` indica el resultado final a entregar.",
          },
        ],
      },
      {
        id: "pbi-28",
        title: "Nivel 28 · Caso Práctico: Consolidar 12 Meses de Ventas",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-28-e1",
            type: "story",
            prompt: "Caso Real: Consolidación Multitabla 📁",
            hint: "Anexar + Unpivot combinados.",
            data: {
              slides: [
                {
                  title: "El Gran Reto Anual",
                  text: "Recibes una carpeta con 12 archivos CSV de ventas mensuales. Cada archivo tiene columnas por sucursal.",
                  highlightText: "Solución Maestra: 1) Conectar a Carpeta, 2) Combinar y Anexar todos los archivos, 3) Aplicar Unpivot a las columnas de sucursal.",
                },
              ],
            },
            explanation: "Conectar a carpeta y anexar archivos permite automatizar la consolidación de nuevos reportes futuros.",
          },
          {
            id: "pbi-28-e2",
            type: "arrange",
            prompt: "Ordena los pasos del caso de consolidación masiva:",
            hint: "De carpeta a modelo limpio.",
            data: {
              tokens: [
                { id: "t1", text: "1. Obtener datos → Carpeta" },
                { id: "t2", text: "2. Clic en 'Combinar y transformar datos'" },
                { id: "t3", text: "3. Anular dinamización de las columnas de sucursales" },
                { id: "t4", text: "4. Clic en 'Cerrar y aplicar'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Cuando agregues el archivo del mes 13 a la carpeta, Power BI lo procesará automáticamente al presionar Refrescar.",
          },
        ],
      },
      {
        id: "pbi-29",
        title: "Nivel 29 · Repaso de Transformaciones Complejas",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-29-e1",
            type: "match-pairs",
            prompt: "Repaso: Distingue claramente entre Merge y Append.",
            hint: "Horizontal vs Vertical.",
            data: {
              left: [
                { id: "L1", text: "Combinar consultas (Merge)" },
                { id: "L2", text: "Anexar consultas (Append)" },
              ],
              right: [
                { id: "R1", text: "Agrega COLUMNAS buscando coincidencia de llaves (BUSCARV)" },
                { id: "R2", text: "Agrega FILAS apilando tablas una debajo de otra (Unión)" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
              ],
            },
            explanation: "Merge expande horizontalmente; Append expande verticalmente.",
          },
        ],
      },
      {
        id: "pbi-30",
        title: "Nivel 30 · Punto de Control 3 & Trofeo de Sección",
        kind: "checkpoint",
        xp: 30,
        exercises: [
          {
            id: "pbi-30-e1",
            type: "multiple-choice",
            prompt: "Evaluación Sección 3: Tienes un informe con columnas '2024', '2025' y '2026'. ¿Qué operación debes realizar para poder filtrar por año fácilmente?",
            hint: "Convierte columnas en filas.",
            data: {
              options: [
                "Anular la dinamización de columnas (Unpivot)",
                "Combinar consultas (Merge)",
                "Crear una columna condicional",
                "Cambiar el tipo de dato a texto",
              ],
              correctIndex: 0,
            },
            explanation: "¡Excelente! Has completado el Punto de Control 3 y conquistado las transformaciones avanzadas de Power Query.",
          },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // SECCIÓN 4: Arquitectura & Modelado en Estrella (Niveles 31 – 40)
      // ═════════════════════════════════════════════════════════════════════
      {
        id: "pbi-31",
        title: "Nivel 31 · Por qué Modelar Datos",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-31-e1",
            type: "story",
            prompt: "El Peligro de las Tablas Planas 🚜",
            hint: "Modelar datos separa hechos de dimensiones para escalar.",
            data: {
              slides: [
                {
                  title: "¿Por qué NO usar una sola tabla gigante?",
                  text: "Si importas un Excel de 500,000 filas con el nombre, dirección y teléfono del cliente repetido en cada venta, el tamaño del archivo explota y las fórmulas DAX se vuelven lentas.",
                  highlightText: "Modelar consiste en dividir la información en tablas especializadas conectadas por relaciones clave.",
                },
              ],
            },
            explanation: "Un modelo relacional optimiza la memoria RAM y simplifica el cálculo analítico.",
          },
          {
            id: "pbi-31-e2",
            type: "select-all",
            prompt: "¿Cuáles de los siguientes son beneficios de modelar tus datos en lugar de usar una tabla plana única?",
            hint: "Selecciona las ventajas arquitectónicas.",
            data: {
              options: [
                "Reducción dramática del tamaño del archivo .pbix",
                "Fórmulas DAX más simples y rápidas de calcular",
                "Facilidad para agregar nuevos orígenes de datos en el futuro",
                "Elimina la necesidad de usar Power Query",
              ],
              correctIndices: [0, 1, 2],
            },
            explanation: "El modelado correcto optimiza el rendimiento y mantiene la escalabilidad del sistema.",
          },
        ],
      },
      {
        id: "pbi-32",
        title: "Nivel 32 · El Esquema en Estrella (Star Schema)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-32-e1",
            type: "story",
            prompt: "El Estándar de Oro Mundial ⭐",
            hint: "Una tabla central de hechos rodeada por tablas de dimensión.",
            data: {
              slides: [
                {
                  title: "Anatomía del Star Schema",
                  text: "Diseñado por Ralph Kimball, el Esquema en Estrella ubica la Tabla de Hechos (Fact) en el centro y las Tablas de Dimensiones (Dim) alrededor como las puntas de una estrella.",
                  codeSnippet: "      Dim_Clientes\n           │\nDim_Productos ── Fact_Ventas ── Dim_Fechas\n           │\n      Dim_Sucursales",
                  highlightText: "Las dimensiones filtran a la tabla de hechos. Los filtros fluyen desde el lado 1 hacia el lado *.",
                },
              ],
            },
            explanation: "El Esquema en Estrella es el diseño de modelo de datos más eficiente para el motor de Power BI.",
          },
          {
            id: "pbi-32-e2",
            type: "match-pairs",
            prompt: "Empareja cada tipo de tabla con su contenido característico.",
            hint: "Hechos = Números acumulados | Dimensiones = Atributos descriptivos.",
            data: {
              left: [
                { id: "L1", text: "Tabla de Hechos (Fact_Ventas)" },
                { id: "L2", text: "Tabla de Dimensión (Dim_Clientes)" },
              ],
              right: [
                { id: "R1", text: "IDs, Cantidad, Precio, Fecha, Monto Total" },
                { id: "R2", text: "ID_Cliente único, Nombre, Ciudad, Segmento" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
              ],
            },
            explanation: "Hechos almacena las transacciones numéricas; dimensiones almacena las entidades del negocio.",
          },
        ],
      },
      {
        id: "pbi-33",
        title: "Nivel 33 · Esquema en Copo de Nieve (Snowflake)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-33-e1",
            type: "multiple-choice",
            prompt: "¿En qué se diferencia un Esquema en Copo de Nieve (Snowflake Schema) de un Esquema en Estrella?",
            hint: "Las dimensiones se conectan con otras sub-dimensiones.",
            data: {
              options: [
                "En que las tablas de dimensiones están normalizadas y se conectan entre sí (ej: Dim_Producto -> Dim_Subcategoria -> Dim_Categoria)",
                "En que no tiene tabla de hechos",
                "En que solo usa archivos Excel",
                "En que las fórmulas DAX son automáticas",
              ],
              correctIndex: 0,
            },
            explanation: "Snowflake es un esquema donde las dimensiones se ramifican en sub-dimensiones secundarias.",
          },
        ],
      },
      {
        id: "pbi-34",
        title: "Nivel 34 · Tablas de Hechos (Fact Tables)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-34-e1",
            type: "select-all",
            prompt: "¿Cuáles de los siguientes campos corresponden típicamente a una Tabla de Hechos?",
            hint: "Selecciona datos numéricos y claves de conexión.",
            data: {
              options: [
                "MontoVenta",
                "CantidadVendida",
                "ID_Cliente (Clave Foránea)",
                "DirecciónResidenciaCliente",
              ],
              correctIndices: [0, 1, 2],
            },
            explanation: "Los campos cuantitativos y las claves foráneas van en la tabla de hechos. La dirección detallada pertenece a la dimensión.",
          },
        ],
      },
      {
        id: "pbi-35",
        title: "Nivel 35 · Tablas de Dimensiones (Dim Tables)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-35-e1",
            type: "fill-blank",
            prompt: "Completa: En una Tabla de Dimensión limpia, el ID principal o Clave Primaria debe ser absolutamente ____ (sin duplicados).",
            hint: "Que no se repita.",
            data: {
              acceptedAnswers: ["único", "unico", "UNICO", "ÚNICO"],
              placeholder: "Escribe la palabra...",
            },
            explanation: "Las claves primarias de las dimensiones deben ser 100% únicas para establecer relaciones de cardinalidad 1 a Varios.",
          },
        ],
      },
      {
        id: "pbi-36",
        title: "Nivel 36 · Cardinalidad de Relaciones (1:*, *:1)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-36-e1",
            type: "story",
            prompt: "El Lenguaje de las Relaciones 🔗",
            hint: "El lado '1' es la dimensión; el lado '*' es la tabla de hechos.",
            data: {
              slides: [
                {
                  title: "Entendiendo 1 a Varios (1:*)",
                  text: "Un cliente tiene UN solo registro en `Dim_Clientes` (lado 1), pero puede realizar MUCHAS compras en `Fact_Ventas` (lado *).",
                  highlightText: "En la Vista de Modelo verás un '1' junto a la tabla de dimensión y un asterisco '*' junto a la tabla de hechos.",
                },
              ],
            },
            explanation: "La relación 1 a Varios (1:*) representa la jerarquía estándar entre catálogos y registros de eventos.",
          },
          {
            id: "pbi-36-e2",
            type: "arrange",
            prompt: "Ordena los pasos para crear manualmente una relación entre Dim_Clientes y Fact_Ventas en la Vista de Modelo:",
            hint: "Arrastra el campo clave de una tabla a la otra.",
            data: {
              tokens: [
                { id: "t1", text: "1. Ir a la Vista de Modelo" },
                { id: "t2", text: "2. Localizar el campo 'ID_Cliente' en Dim_Clientes" },
                { id: "t3", text: "3. Hacer clic y arrastrar hacia 'ID_Cliente' en Fact_Ventas" },
                { id: "t4", text: "4. Verificar que aparezca el conector '1' a '*'" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Arrastrar la clave primaria sobre la clave foránea crea automáticamente la relación relacional en Power BI.",
          },
        ],
      },
      {
        id: "pbi-37",
        title: "Nivel 37 · Dirección del Filtro Cruzado (Ambas vs Única)",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-37-e1",
            type: "multiple-choice",
            prompt: "¿Cuál es la dirección de filtro cruzado (Cross filter direction) recomendada para la gran mayoría de las relaciones?",
            hint: "Dirección única (Single) desde la dimensión hacia los hechos.",
            data: {
              options: [
                "Única (Single / De la Dimensión a Hechos)",
                "Ambas (Both)",
                "Ninguna",
                "Inversa",
              ],
              correctIndex: 0,
            },
            explanation: "Filtro cruzado 'Único' garantiza que los filtros fluyan desde las dimensiones hacia los hechos sin provocar ambigüedades ni bucles.",
          },
          {
            id: "pbi-37-e2",
            type: "match-pairs",
            prompt: "Empareja la dirección de filtro con su comportamiento.",
            hint: "Analiza el sentido de la flecha en la vista de modelo.",
            data: {
              left: [
                { id: "L1", text: "Filtro Único (Single)" },
                { id: "L2", text: "Filtro Ambos (Both)" },
              ],
              right: [
                { id: "R1", text: "La dimensión filtra a la tabla de hechos (Recomendado)" },
                { id: "R2", text: "La tabla de hechos también filtra a la dimensión (Usar con precaución)" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
              ],
            },
            explanation: "El filtro 'Ambos' puede degradar el rendimiento y generar ambiguidades en modelos complejos.",
          },
        ],
      },
      {
        id: "pbi-38",
        title: "Nivel 38 · Caso Práctico: Modelo de E-Commerce",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-38-e1",
            type: "story",
            prompt: "Caso Real: Modelo E-Commerce 🛒",
            hint: "Diseño completo de un Esquema en Estrella.",
            data: {
              slides: [
                {
                  title: "Arquitectura E-Commerce",
                  text: "Tienes las tablas: `Fact_Pedidos`, `Dim_Clientes`, `Dim_Productos` y `Dim_Vendedores`.",
                  highlightText: "Relaciones a crear: Conectar cada `Dim` (lado 1) con su respectivo ID en `Fact_Pedidos` (lado *).",
                },
              ],
            },
            explanation: "Un modelo multidimensión permite filtrar las ventas por cualquier ángulo (cliente, producto o vendedor).",
          },
        ],
      },
      {
        id: "pbi-39",
        title: "Nivel 39 · Repaso de Relaciones y Modelado",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-39-e1",
            type: "match-pairs",
            prompt: "Repaso: Consolida los conceptos clave de modelado de la Sección 4.",
            hint: "Asocia cada concepto con su definición.",
            data: {
              left: [
                { id: "L1", text: "Star Schema" },
                { id: "L2", text: "Clave Primaria (PK)" },
                { id: "L3", text: "Clave Foránea (FK)" },
              ],
              right: [
                { id: "R1", text: "Hechos al centro, Dimensiones en las puntas" },
                { id: "R2", text: "Identificador único sin duplicados en la dimensión" },
                { id: "R3", text: "Campo numérico en hechos que apunta a la dimensión" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Identificar claves y esquemas garantiza un modelado libre de errores.",
          },
        ],
      },
      {
        id: "pbi-40",
        title: "Nivel 40 · Punto de Control 4 & Trofeo de Sección",
        kind: "checkpoint",
        xp: 30,
        exercises: [
          {
            id: "pbi-40-e1",
            type: "multiple-choice",
            prompt: "Evaluación Sección 4: Tienes una tabla `Dim_Clientes` y `Fact_Ventas`. Intentas crear una relación y Power BI marca error de cardinalidad (*:*). ¿Qué causó esto?",
            hint: "Revisa la unicidad de los registros.",
            data: {
              options: [
                "Existen IDs de clientes duplicados en la tabla Dim_Clientes",
                "El archivo Excel está abierto",
                "Falta crear una medida DAX",
                "La tabla de ventas no tiene filas",
              ],
              correctIndex: 0,
            },
            explanation: "¡Excelente! Si la dimensión tiene duplicados, Power BI no puede establecer el lado '1'. Has ganado el Trofeo de la Sección 4.",
          },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // SECCIÓN 5: Creación de la Tabla de Fechas (Calendario) (Niveles 41 – 50)
      // ═════════════════════════════════════════════════════════════════════
      {
        id: "pbi-41",
        title: "Nivel 41 · La Importancia de la Tabla Calendario",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-41-e1",
            type: "story",
            prompt: "El Corazón Temporal del BI 📅",
            hint: "Las funciones de inteligencia de tiempo requieren una tabla de fechas dedicada.",
            data: {
              slides: [
                {
                  title: "¿Por qué NUNCA usar la auto-fecha jerárquica?",
                  text: "Power BI genera fechas automáticas ocultas en segundo plano para cada campo de fecha. Esto multiplica el tamaño del archivo y rompe la inteligencia de tiempo avanzada.",
                  highlightText: "Regla de Oro Profesional: Desactiva 'Fecha y hora auto' en Opciones y crea tu propia Tabla Calendario explícita.",
                },
              ],
            },
            explanation: "Una tabla Calendario dedicada es requisito indispensable para usar funciones DAX como YTD y SAMEPERIODLASTYEAR.",
          },
          {
            id: "pbi-41-e2",
            type: "multiple-choice",
            prompt: "¿Cuál es la característica principal que debe cumplir una columna de fechas en la Tabla Calendario?",
            hint: "Sin saltos de días ni duplicados.",
            data: {
              options: [
                "Debe ser contigua (sin vacíos de días) y no tener duplicados",
                "Debe contener solo días laborables",
                "Debe ser de tipo texto",
                "Debe tener datos solo del año actual",
              ],
              correctIndex: 0,
            },
            explanation: "La tabla de fechas debe abarcar todos los días del año completo sin saltarse fines de semana ni festivos.",
          },
        ],
      },
      {
        id: "pbi-42",
        title: "Nivel 42 · Crear Calendario con CALENDAR en DAX",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-42-e1",
            type: "arrange",
            prompt: "Ordena los elementos para construir la fórmula DAX que genera un calendario del año 2024 al 2026:",
            hint: "Dim_Fechas = CALENDAR(DATE(2024,1,1), DATE(2026,12,31))",
            data: {
              tokens: [
                { id: "t1", text: "Dim_Fechas =" },
                { id: "t2", text: "CALENDAR(" },
                { id: "t3", text: "DATE(2024, 1, 1)," },
                { id: "t4", text: "DATE(2026, 12, 31) )" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "`CALENDAR(FechaInicio, FechaFin)` genera una tabla con una columna 'Date' contigua entre ambas fechas.",
          },
          {
            id: "pbi-42-e2",
            type: "fill-blank",
            prompt: "Completa la función DAX que crea una tabla de fechas entre dos límites: Dim_Fechas = ____________(DATE(2025,1,1), DATE(2025,12,31))",
            hint: "Nombre de la función en inglés.",
            data: {
              acceptedAnswers: ["CALENDAR", "calendar", "Calendar"],
              placeholder: "Escribe la función DAX...",
            },
            explanation: "CALENDAR es la función DAX primaria para generar listas continuas de fechas.",
          },
        ],
      },
      {
        id: "pbi-43",
        title: "Nivel 43 · Crear Calendario con CALENDARAUTO",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-43-e1",
            type: "story",
            prompt: "Autodetectando el Rango Temporal 🤖",
            hint: "`CALENDARAUTO()` examina todas las fechas de tu modelo.",
            data: {
              slides: [
                {
                  title: "La Magia de `CALENDARAUTO()`",
                  text: "Si no quieres fijar fechas manuales, `CALENDARAUTO()` escanea todas las fechas de tu modelo y genera automáticamente un calendario desde el 1 de Enero del año más antiguo hasta el 31 de Diciembre del año más reciente.",
                  codeSnippet: "Dim_Fechas = CALENDARAUTO()",
                },
              ],
            },
            explanation: "`CALENDARAUTO()` expande automáticamente el rango de años según los datos cargados.",
          },
          {
            id: "pbi-43-e2",
            type: "multiple-choice",
            prompt: "¿Qué fechas toma `CALENDARAUTO()` como límite inicial y final para construir el calendario?",
            hint: "Años completos.",
            data: {
              options: [
                "El 1 de Enero del año mínimo y el 31 de Diciembre del año máximo en el modelo",
                "El primer día del mes actual",
                "Solo los últimos 30 días",
                "Desde el año 1900 hasta el 2099 fijo",
              ],
              correctIndex: 0,
            },
            explanation: "`CALENDARAUTO()` garantiza abarcar años completos basados en las fechas detectadas.",
          },
        ],
      },
      {
        id: "pbi-44",
        title: "Nivel 44 · Extraer Año, Mes y Trimestre en DAX",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-44-e1",
            type: "arrange",
            prompt: "Ordena la fórmula DAX para agregar la columna calculada 'Año' a la tabla Calendario:",
            hint: "Año = YEAR(Dim_Fechas[Date])",
            data: {
              tokens: [
                { id: "t1", text: "Año =" },
                { id: "t2", text: "YEAR(" },
                { id: "t3", text: "Dim_Fechas[Date]" },
                { id: "t4", text: ")" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "`YEAR()` extrae el número de año a cuatro dígitos (ej: 2026).",
          },
          {
            id: "pbi-44-e2",
            type: "match-pairs",
            prompt: "Empareja la función DAX de fecha con el resultado que devuelve para '2026-07-24'.",
            hint: "Funciones de extracción temporal.",
            data: {
              left: [
                { id: "L1", text: "YEAR(Fecha)" },
                { id: "L2", text: "MONTH(Fecha)" },
                { id: "L3", text: "QUARTER(Fecha)" },
                { id: "L4", text: "DAY(Fecha)" },
              ],
              right: [
                { id: "R1", text: "2026" },
                { id: "R2", text: "7" },
                { id: "R3", text: "3 (Tercer Trimestre)" },
                { id: "R4", text: "24" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
                { left: "L4", right: "R4" },
              ],
            },
            explanation: "Estas funciones extraen las partes numéricas básicas de cualquier fecha.",
          },
        ],
      },
      {
        id: "pbi-45",
        title: "Nivel 45 · Nombre de Mes y Día con FORMAT",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-45-e1",
            type: "fill-blank",
            prompt: "Completa la función DAX para obtener el nombre del mes abreviado (ej: 'Jul'): NombreMes = ____________(Dim_Fechas[Date], \"mmm\")",
            hint: "Función de formato de texto.",
            data: {
              acceptedAnswers: ["FORMAT", "format", "Format"],
              placeholder: "Escribe la función DAX...",
            },
            explanation: "`FORMAT(Fecha, \"mmm\")` devuelve el nombre corto del mes en texto.",
          },
          {
            id: "pbi-45-e2",
            type: "match-pairs",
            prompt: "Empareja el código de formato con su resultado para el mes de Julio.",
            hint: "Variaciones de m en FORMAT.",
            data: {
              left: [
                { id: "L1", text: "FORMAT(Fecha, \"m\")" },
                { id: "L2", text: "FORMAT(Fecha, \"mm\")" },
                { id: "L3", text: "FORMAT(Fecha, \"mmm\")" },
                { id: "L4", text: "FORMAT(Fecha, \"mmmm\")" },
              ],
              right: [
                { id: "R1", text: "'7'" },
                { id: "R2", text: "'07'" },
                { id: "R3", text: "'Jul'" },
                { id: "R4", text: "'Julio'" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
                { left: "L4", right: "R4" },
              ],
            },
            explanation: "Más letras 'm' aumentan la longitud de la representación en texto del mes.",
          },
        ],
      },
      {
        id: "pbi-46",
        title: "Nivel 46 · Ordenar Mes por Número de Mes",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-46-e1",
            type: "story",
            prompt: "Evitando el Orden Alfabetico 🔤",
            hint: "Por defecto, 'Enero', 'Febrero' y 'Marzo' se ordenan alfabéticamente.",
            data: {
              slides: [
                {
                  title: "El Problema del Orden de los Meses",
                  text: "Si agregas el 'Nombre del Mes' a un gráfico de barras, Power BI lo ordenará como: 'Abril', 'Agosto', 'Diciembre', 'Enero'... ¡Alfabéticamente!",
                  highlightText: "Solución: Selecciona la columna 'NombreMes' -> Ve a la pestaña Herramientas de Columnas -> 'Ordenar por columna' -> Selecciona 'NumeroMes'.",
                },
              ],
            },
            explanation: "La función 'Ordenar por columna' obliga a Power BI a usar una columna numérica oculta para ordenar campos de texto.",
          },
          {
            id: "pbi-46-e2",
            type: "arrange",
            prompt: "Ordena los pasos para lograr que los meses se muestren en orden cronológico correcto en un gráfico:",
            hint: "Selección → Herramientas de columna → Ordenar por columna.",
            data: {
              tokens: [
                { id: "t1", text: "1. Seleccionar la columna 'NombreMes' en la vista de datos" },
                { id: "t2", text: "2. Ir a la pestaña 'Herramientas de columnas' arriba" },
                { id: "t3", text: "3. Clic en el botón 'Ordenar por columna'" },
                { id: "t4", text: "4. Hacer clic en 'NumeroMes' (columna numérica 1 a 12)" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation: "Ese procedimiento soluciona para siempre el orden alfabético incorrecto en gráficos y segmentadores.",
          },
        ],
      },
      {
        id: "pbi-47",
        title: "Nivel 47 · Marcar como Tabla de Fechas Oficial",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-47-e1",
            type: "multiple-choice",
            prompt: "¿Cómo le confirmas formalmente a Power BI que tu tabla `Dim_Fechas` creada es la tabla primaria de calendario?",
            hint: "Opción en el menú contextual de la tabla.",
            data: {
              options: [
                "Haciendo clic derecho en la tabla → 'Marcar como tabla de fechas'",
                "Cambiando el nombre a 'Calendar'",
                "Escribiendo la medida SUM()",
                "Exportando a Excel",
              ],
              correctIndex: 0,
            },
            explanation: "'Marcar como tabla de fechas' deshabilita las jerarquías automáticas ocultas e informa al motor DAX de su estatus oficial.",
          },
        ],
      },
      {
        id: "pbi-48",
        title: "Nivel 48 · Caso Práctico: Conectar Múltiples Fechas",
        kind: "lesson",
        xp: 20,
        exercises: [
          {
            id: "pbi-48-e1",
            type: "story",
            prompt: "Caso Real: Fecha de Pedido vs Fecha de Envío 🚚",
            hint: "Múltiples relaciones entre la misma tabla de hechos y el calendario.",
            data: {
              slides: [
                {
                  title: "El Desafío de las 2 Fechas",
                  text: "La tabla `Fact_Ventas` contiene `FechaPedido` y `FechaEnvio`.",
                  highlightText: "La relación activa debe ser con `FechaPedido`. La relación con `FechaEnvio` quedará punteada (inactiva) para activarse dinámicamente con la función DAX `USERRELATIONSHIP()`.",
                },
              ],
            },
            explanation: "Solo puede existir una relación activa principal entre dos tablas; las relaciones secundarias permanecen inactivas.",
          },
        ],
      },
      {
        id: "pbi-49",
        title: "Nivel 49 · Repaso de Tablas de Fechas",
        kind: "lesson",
        xp: 15,
        exercises: [
          {
            id: "pbi-49-e1",
            type: "match-pairs",
            prompt: "Repaso: Conecta cada regla de la tabla de fechas con su beneficio.",
            hint: "Buenas prácticas de calendario.",
            data: {
              left: [
                { id: "L1", text: "Fechas contiguas sin saltos" },
                { id: "L2", text: "Ordenar por columna 'NumeroMes'" },
                { id: "L3", text: "Marcar como tabla de fechas" },
              ],
              right: [
                { id: "R1", text: "Permite usar funciones de Time Intelligence (YTD)" },
                { id: "R2", text: "Evita que 'Enero' aparezca después de 'Diciembre'" },
                { id: "R3", text: "Elimina las auto-fechas ocultas reduciendo tamaño" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R2" },
                { left: "L3", right: "R3" },
              ],
            },
            explanation: "Cumplir las 3 reglas garantiza una dimensión temporal impecable para cualquier análisis de BI.",
          },
        ],
      },
      {
        id: "pbi-50",
        title: "Nivel 50 · Punto de Control 5 & Gran Trofeo de Mitad de Ruta",
        kind: "checkpoint",
        xp: 40,
        exercises: [
          {
            id: "pbi-50-e1",
            type: "multiple-choice",
            prompt: "Evaluación Sección 5: ¿Por qué es obligatorio desactivar la opción 'Fecha y hora auto' en las Opciones Globales de Power BI?",
            hint: "Rendimiento y control del modelo.",
            data: {
              options: [
                "Porque crea tablas ocultas por cada campo fecha, aumentando el tamaño del archivo y afectando el rendimiento",
                "Porque borra los datos de Excel",
                "Porque impide usar gráficos de barras",
                "Porque exige comprar licencias de pago",
              ],
              correctIndex: 0,
            },
            explanation: "¡FELICITACIONES MÁXIMAS! 🏆 Has completado los primeros 50 Niveles Oficiales de Power BI en ProgramBI. Dominas el ecosistema, Power Query, el Lenguaje M, el Esquema en Estrella y las Tablas de Fechas.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OTRAS UNIDADES (SQL, IA, Python, Excel)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "sql-server",
    slug: "sql-server",
    title: "SQL Server",
    description: "Consultas, joins y bases relacionales con T-SQL.",
    icon: "Database",
    accentColor: "#CC2935",
    emoji: "🛢️",
    levels: [
      {
        id: "sql-1",
        title: "Nivel 1 · Fundamentos",
        kind: "lesson",
        xp: 10,
        exercises: [
          {
            id: "sql-1-e1",
            type: "multiple-choice",
            prompt: "¿Qué palabra clave se usa para leer filas de una tabla?",
            hint: "Empezamos las consultas con esta palabra.",
            data: {
              options: ["INSERT", "SELECT", "UPDATE", "DROP"],
              correctIndex: 1,
            },
            explanation: "SELECT es la cláusula de lectura en T-SQL.",
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