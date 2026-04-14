// Course data that matches the current ProgramBI website exactly
export interface CourseLevel {
  name: string;             // e.g. "Básico", "Intermedio", "Avanzado"
  price?: number;           // price in CLP
  whatYouLearn: string[];   // per-level learning outcomes
  durationHours?: number;   // optional per-level duration
}

export interface Course {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  categoryLabel: string;
  badgeLabel?: string;
  badgeColor?: string;
  techStack: string[];
  durationHours: number;
  modality: string;
  level: string;
  imageUrl: string;
  icon: string;
  accentColor: string;
  isFeatured: boolean;
  sortOrder: number;
  youtubeVideoId?: string;
  whatYouLearn: string[];
  syllabus: { module: string; topics: string[]; hours: number }[];
  levels?: CourseLevel[];
}

export const courses: Course[] = [
  {
    slug: "analisis-de-datos",
    title: "Curso de Análisis de Datos",
    shortDescription:
      "El programa integral de 144 horas. Domina el ciclo completo del dato desde la extracción hasta la visualización.",
    description:
      "Programa integral de 144 horas donde dominarás SQL Server, Power BI y Python. Aprende a extraer, transformar y visualizar datos para tomar decisiones estratégicas en cualquier industria.",
    category: "programacion",
    categoryLabel: "MÁS POPULAR",
    badgeLabel: "MÁS POPULAR",
    badgeColor: "#1890FF",
    techStack: ["SQL", "Power BI", "Python"],
    durationHours: 144,
    modality: "online",
    level: "principiante",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    icon: "BarChart3",
    accentColor: "#1890FF",
    isFeatured: true,
    sortOrder: 1,
    youtubeVideoId: "LiupEKDc3Ms",
    whatYouLearn: [
      "Consultas SQL desde cero hasta avanzado",
      "Modelado de datos y DAX en Power BI",
      "Análisis exploratorio con Python y Pandas",
      "Dashboards interactivos y reportes automáticos",
      "ETL con Power Query y conexiones a BDs",
      "Capstone Project con datos reales",
    ],
    syllabus: [
      {
        module: "Nivel 1: SQL Server",
        topics: [
          "Fundamentos de bases de datos relacionales",
          "Consultas SELECT, JOINs y subqueries",
          "Funciones de agregación y agrupamiento",
          "Procedimientos almacenados",
          "Diseño de esquemas y normalización",
        ],
        hours: 48,
      },
      {
        module: "Nivel 2: Power BI",
        topics: [
          "Conexión a fuentes de datos múltiples",
          "Power Query y transformación ETL",
          "Modelado dimensional (estrella/copo de nieve)",
          "Fórmulas DAX intermedias y avanzadas",
          "Dashboards interactivos y publicación",
        ],
        hours: 48,
      },
      {
        module: "Nivel 3: Python para Datos",
        topics: [
          "Fundamentos de Python y entorno Colab",
          "Pandas: manipulación y limpieza de datos",
          "Visualización con Matplotlib y Seaborn",
          "Automatización de reportes",
          "Capstone Project integrador",
        ],
        hours: 48,
      },
    ],
    levels: [
      {
        name: "Programa Completo",
        price: 489000,
        durationHours: 144,
        whatYouLearn: [
          "Fundamentos y bases de datos con SQL Server",
          "Conexión a fuentes, ETL y modelado con Power Query",
          "Dashboards avanzados y DAX en Power BI",
          "Programación en Python y manipulación con Pandas",
          "Visualización en Python y reportes automatizados",
        ],
      },
    ],
  },
  {
    slug: "power-automate",
    title: "Power Automate & RPA",
    shortDescription:
      "Automatiza procesos repetitivos sin código. Crea flujos en la nube, controla el escritorio y despliega agentes inteligentes.",
    description:
      "Domina Power Automate, RPA y Copilot para automatizar procesos empresariales sin código. Aprende a crear flujos en la nube, automatizar el escritorio y desplegar agentes IA.",
    category: "automatizacion",
    categoryLabel: "NUEVO 2026",
    badgeLabel: "NUEVO 2026",
    badgeColor: "#0078D4",
    techStack: ["RPA", "Cloud Flows", "Copilot IA"],
    durationHours: 48,
    modality: "online",
    level: "intermedio",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    icon: "Zap",
    accentColor: "#0078D4",
    isFeatured: false,
    sortOrder: 4,
    whatYouLearn: [
      "Crear Cloud Flows automatizados",
      "Desktop Flows y RPA sin código",
      "Conectores y API integrations",
      "Copilot IA para generación de flujos",
      "Automatización de aprobaciones y notificaciones",
    ],
    syllabus: [
      {
        module: "Cloud Flows",
        topics: [
          "Triggers y acciones",
          "Conectores estándar y premium",
          "Expresiones y condiciones",
          "Flujos de aprobación",
        ],
        hours: 16,
      },
      {
        module: "Desktop Flows (RPA)",
        topics: [
          "Grabación de acciones",
          "Automatización de Excel y web",
          "Variables y control de flujo",
          "Manejo de errores",
        ],
        hours: 16,
      },
      {
        module: "IA y Copilot",
        topics: [
          "AI Builder",
          "Copilot para flujos",
          "Procesamiento de documentos",
          "Agentes inteligentes",
        ],
        hours: 16,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Crear Cloud Flows automatizados", "Triggers, acciones y conectores", "Expresiones y condiciones avanzadas", "Flujos de aprobación empresarial"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["Desktop Flows y RPA sin código", "Automatización de Excel y web", "Variables y control de flujo avanzado", "Manejo de errores y reintentos"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["AI Builder y procesamiento de documentos", "Copilot para generación de flujos", "Agentes inteligentes con IA", "Integración con APIs externas"] },
    ],
  },
  {
    slug: "analitica-mineria",
    title: "Analítica para Minería",
    shortDescription:
      "Optimización de procesos mineros reales. Transforma datos operativos de faena en activos estratégicos.",
    description:
      "Programa especializado para profesionales del sector minero. Aprende a analizar datos de operaciones, mantenimiento y seguridad con Excel, Power BI, SQL y Python.",
    category: "especializacion",
    categoryLabel: "ESPECIALIZACIÓN",
    badgeLabel: "ESPECIALIZACIÓN",
    badgeColor: "#B45309",
    techStack: ["Operaciones", "Excel", "Power BI"],
    durationHours: 96,
    modality: "online",
    level: "intermedio",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    icon: "HardHat",
    accentColor: "#B45309",
    isFeatured: false,
    sortOrder: 5,
    youtubeVideoId: "LiupEKDc3Ms",
    whatYouLearn: [
      "KPIs mineros: tonelaje, disponibilidad, LTIF",
      "Dashboards operativos en Power BI",
      "Predicción de fallas con Python",
      "Automatización de reportes de turno",
      "Optimización de flotas y equipos",
    ],
    syllabus: [
      {
        module: "Excel Avanzado para Minería",
        topics: [
          "Modelos de costos operativos",
          "Tablas dinámicas y Power Query",
          "VBA para automatización de reportes",
        ],
        hours: 24,
      },
      {
        module: "SQL para Datos Operativos",
        topics: [
          "Consultas de producción por turno",
          "Joins entre tablas de equipos y operaciones",
          "Vistas y procedimientos almacenados",
        ],
        hours: 24,
      },
      {
        module: "Power BI: Control Operacional",
        topics: [
          "Dashboard de producción en tiempo real",
          "KPIs de disponibilidad y utilización",
          "DAX para métricas mineras",
        ],
        hours: 24,
      },
      {
        module: "Python: Predicción y ML",
        topics: [
          "Análisis de sensores y presiones",
          "Modelos predictivos de mantenimiento",
          "Alertas automáticas con Python",
        ],
        hours: 24,
      },
    ],
    levels: [
      { name: "Programa Completo", price: 489000, durationHours: 144, whatYouLearn: ["KPIs mineros: tonelaje, disponibilidad, LTIF", "Modelos de costos operativos en Excel", "Consultas SQL de producción por turno", "Tablas dinámicas y Power Query para faena", "Dashboard de producción en tiempo real", "KPIs de disponibilidad y utilización", "DAX para métricas mineras especializadas", "Predicción de fallas con Machine Learning", "Alertas automáticas con Python"] }
    ],
  },
  {
    slug: "ia-productividad",
    title: "IA en Productividad",
    shortDescription:
      "Domina Prompt Engineering, Vibe Coding y Agentes Autónomos para automatizar flujos de datos.",
    description:
      "Curso práctico de Inteligencia Artificial aplicada a la productividad laboral. Aprende Prompt Engineering, herramientas de IA y automatización inteligente de procesos.",
    category: "ia",
    categoryLabel: "IA & Automatización",
    techStack: ["ChatGPT", "Copilot", "Agentes IA"],
    durationHours: 24,
    modality: "online",
    level: "intermedio",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
    icon: "Sparkles",
    accentColor: "#7C3AED",
    isFeatured: false,
    sortOrder: 4,
    whatYouLearn: [
      "Prompt Engineering avanzado",
      "Vibe Coding con IA",
      "Agentes autónomos para datos",
      "Integración de IA en flujos de trabajo",
    ],
    syllabus: [
      {
        module: "Prompt Engineering",
        topics: ["Técnicas avanzadas de prompting", "Chain-of-thought", "Few-shot learning"],
        hours: 8,
      },
      {
        module: "Herramientas IA",
        topics: ["ChatGPT, Claude, Gemini", "Copilot en Office y código", "Automatización con IA"],
        hours: 8,
      },
      {
        module: "Agentes Autónomos",
        topics: ["Creación de agentes", "Pipelines de datos con IA", "Casos prácticos"],
        hours: 8,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Prompt Engineering avanzado", "Técnicas chain-of-thought y few-shot", "ChatGPT, Claude y Gemini para trabajo", "Automatización básica con IA"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["Vibe Coding con IA", "Copilot en Office y código", "Integración de IA en flujos de trabajo", "Creación de prompts para datos"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Agentes autónomos para datos", "Pipelines de datos con IA", "Deploy de soluciones IA", "Casos prácticos empresariales"] },
    ],
  },
  {
    slug: "power-bi",
    title: "Power BI",
    shortDescription:
      "Dashboards interactivos para decisiones estratégicas. Domina DAX y Modelado.",
    description:
      "Curso completo de Power BI desde conexión de datos hasta DAX avanzado. Crea dashboards profesionales que automatizan la toma de decisiones en tu empresa.",
    category: "visualizacion",
    categoryLabel: "Visualización",
    techStack: ["Power Query", "DAX", "Dashboards"],
    durationHours: 48,
    modality: "online",
    level: "principiante",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Tamano_personalizado_1_9d2f2efd-3f0e-40d7-a62b-fb7a0ba08d83.png?v=1720500191",
    icon: "PieChart",
    accentColor: "#F2C811",
    isFeatured: true,
    sortOrder: 2,
    youtubeVideoId: "7197F-yNw04",
    whatYouLearn: [
      "ETL con Power Query",
      "Modelado dimensional estrella",
      "DAX desde cero a avanzado",
      "Dashboards interactivos profesionales",
      "Publicación en Power BI Service",
      "Row Level Security",
    ],
    syllabus: [
      {
        module: "Conexión y Power Query",
        topics: [
          "Conexión a múltiples fuentes",
          "Transformación de datos",
          "Parámetros y funciones M",
          "Limpieza automatizada",
        ],
        hours: 16,
      },
      {
        module: "Modelado y DAX",
        topics: [
          "Modelo estrella y relaciones",
          "Medidas CALCULATE, FILTER",
          "Time Intelligence",
          "DAX avanzado: RANKX, iteradores",
        ],
        hours: 16,
      },
      {
        module: "Dashboards y Publicación",
        topics: [
          "Diseño UX de reportes",
          "Visuales nativos y custom",
          "Gateway y actualización programada",
          "Seguridad a nivel de fila (RLS)",
        ],
        hours: 16,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Conexión a múltiples fuentes de datos", "Transformación de datos con Power Query", "Parámetros y funciones M", "Limpieza automatizada de datos"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["Modelo estrella y relaciones", "Medidas CALCULATE y FILTER", "Time Intelligence en DAX", "DAX avanzado: RANKX e iteradores"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Diseño UX de reportes profesionales", "Visuales nativos y custom visuals", "Gateway y actualización programada", "Seguridad a nivel de fila (RLS)"] },
    ],
  },
  {
    slug: "python",
    title: "Python para Datos",
    shortDescription:
      "Análisis avanzado con Pandas. Ciencia de datos aplicada a negocios reales.",
    description:
      "Curso de Python enfocado 100% en análisis de datos. Desde los fundamentos de programación hasta análisis avanzado con Pandas, visualización y automatización.",
    category: "programacion",
    categoryLabel: "Programación",
    techStack: ["Python", "Pandas", "Matplotlib"],
    durationHours: 48,
    modality: "online",
    level: "principiante",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-95e6ef6f-0d9e-4e69-a5a7-1a3f7a4c0c45_7bda5e0b-a12a-4293-81c0-8c8fb3c345aa.png?v=1736654931",
    icon: "Code",
    accentColor: "#3776AB",
    isFeatured: false,
    sortOrder: 6,
    youtubeVideoId: "csPtN5bI_cw",
    whatYouLearn: [
      "Fundamentos de Python desde cero",
      "Estructuras de datos y funciones",
      "Pandas para manipulación de datos",
      "Visualización con Matplotlib y Seaborn",
      "Automatización de procesos de datos",
    ],
    syllabus: [
      {
        module: "Fundamentos Python",
        topics: [
          "Variables, tipos de datos, operadores",
          "Control de flujo y funciones",
          "Listas, diccionarios, tuplas",
          "Módulos y librerías",
        ],
        hours: 16,
      },
      {
        module: "Pandas y Análisis",
        topics: [
          "DataFrames y Series",
          "Limpieza y transformación",
          "GroupBy y agregaciones",
          "Merge y concatenación",
        ],
        hours: 16,
      },
      {
        module: "Visualización y Automatización",
        topics: [
          "Gráficos con Matplotlib",
          "Seaborn para estadística",
          "Reportes automatizados",
          "Conexión a APIs y bases de datos",
        ],
        hours: 16,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Variables, tipos de datos y operadores", "Control de flujo y funciones", "Listas, diccionarios y tuplas", "Módulos y librerías esenciales"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["DataFrames y Series con Pandas", "Limpieza y transformación de datos", "GroupBy, agregaciones y Merge", "Conexión a bases de datos y APIs"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Gráficos con Matplotlib y Seaborn", "Estadística aplicada con Python", "Reportes automatizados", "Pipelines de datos end-to-end"] },
    ],
  },
  {
    slug: "sql-server",
    title: "SQL Server",
    shortDescription:
      "Domina las consultas (Queries), procedimientos almacenados y arquitectura de datos.",
    description:
      "Curso completo de SQL Server para gestión de bases de datos. Desde consultas básicas hasta procedimientos almacenados y diseño de esquemas profesionales.",
    category: "gestion",
    categoryLabel: "Gestión",
    techStack: ["T-SQL", "SSMS", "Stored Procedures"],
    durationHours: 48,
    modality: "online",
    level: "principiante",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Tamano_personalizado_1.png?v=1720132741",
    icon: "Database",
    accentColor: "#64748B",
    isFeatured: true,
    sortOrder: 3,
    youtubeVideoId: "HOObY8gOVQg",
    whatYouLearn: [
      "Consultas SELECT complejas",
      "JOINs, subqueries y CTEs",
      "Funciones de agregación",
      "Procedimientos almacenados",
      "Diseño de base de datos normalizada",
    ],
    syllabus: [
      {
        module: "SQL Fundamentals",
        topics: [
          "SELECT, WHERE, ORDER BY",
          "Funciones y operadores",
          "GROUP BY y HAVING",
          "Subqueries",
        ],
        hours: 16,
      },
      {
        module: "SQL Intermedio",
        topics: [
          "JOINs (INNER, LEFT, RIGHT, FULL)",
          "CTEs y tablas temporales",
          "Funciones de ventana",
          "PIVOT y UNPIVOT",
        ],
        hours: 16,
      },
      {
        module: "SQL Avanzado",
        topics: [
          "Stored Procedures",
          "Triggers y funciones",
          "Índices y optimización",
          "Diseño de esquemas",
        ],
        hours: 16,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["SELECT, WHERE, ORDER BY", "Funciones y operadores SQL", "GROUP BY y HAVING", "Subqueries y filtrado avanzado"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["JOINs (INNER, LEFT, RIGHT, FULL)", "CTEs y tablas temporales", "Funciones de ventana", "PIVOT, UNPIVOT y análisis"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Stored Procedures y Triggers", "Funciones definidas por usuario", "Índices y optimización de queries", "Diseño de esquemas profesional"] },
    ],
  },
  {
    slug: "excel",
    title: "Excel",
    shortDescription:
      "Tablas dinámicas, fórmulas avanzadas y Power Query para reportes empresariales.",
    description:
      "Domina Excel al máximo nivel. Desde tablas dinámicas y fórmulas avanzadas hasta Power Query, macros VBA y dashboards profesionales.",
    category: "fundamental",
    categoryLabel: "Fundamental",
    techStack: ["Excel", "Power Query", "VBA"],
    durationHours: 36,
    modality: "online",
    level: "principiante",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Image_202511180217.png?v=1763443093",
    icon: "FileSpreadsheet",
    accentColor: "#217346",
    isFeatured: false,
    sortOrder: 8,
    whatYouLearn: [
      "Fórmulas avanzadas (BUSCARX, INDEX, MATCH)",
      "Tablas dinámicas profesionales",
      "Power Query para ETL",
      "Macros y VBA básico",
      "Dashboards y reportes automáticos",
    ],
    syllabus: [
      {
        module: "Excel Avanzado",
        topics: [
          "Fórmulas anidadas complejas",
          "BUSCARX, INDEX-MATCH",
          "Validación y formato condicional",
          "Tablas dinámicas avanzadas",
        ],
        hours: 12,
      },
      {
        module: "Power Query",
        topics: [
          "Importar y transformar datos",
          "Combinar consultas",
          "Parámetros y funciones",
          "Automatización de ETL",
        ],
        hours: 12,
      },
      {
        module: "VBA y Dashboards",
        topics: [
          "Macros grabadas y editadas",
          "VBA básico: variables y ciclos",
          "Formularios UserForm",
          "Dashboard final interactivo",
        ],
        hours: 12,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Fórmulas anidadas complejas", "BUSCARX, INDEX-MATCH", "Validación y formato condicional", "Tablas dinámicas avanzadas"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["Importar y transformar datos", "Combinar consultas en Power Query", "Parámetros y funciones M", "Automatización de ETL"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Macros grabadas y editadas", "VBA: variables, ciclos y formularios", "UserForms profesionales", "Dashboard final interactivo"] },
    ],
  },
  {
    slug: "analitica-financiera",
    title: "Analítica Financiera",
    shortDescription:
      "Automatización de reportes contables, análisis de riesgo y dashboards de inversión. Ideal para banca.",
    description:
      "Programa especializado para el sector financiero. Automatiza reportes contables, analiza riesgo con Python y crea dashboards de inversión con Power BI.",
    category: "especializacion",
    categoryLabel: "Finanzas",
    badgeLabel: "Especialización",
    badgeColor: "#10B981",
    techStack: ["Excel", "SQL", "Power BI", "Python"],
    durationHours: 96,
    modality: "online",
    level: "intermedio",
    imageUrl:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop",
    icon: "TrendingUp",
    accentColor: "#10B981",
    isFeatured: false,
    sortOrder: 9,
    whatYouLearn: [
      "Modelos financieros en Excel (VAN, TIR, WACC)",
      "Consultas SQL para datos bursátiles",
      "VaR y análisis de riesgo con Python",
      "Dashboards ejecutivos en Power BI",
      "Automatización de reportes contables",
    ],
    syllabus: [
      {
        module: "Excel Financiero",
        topics: [
          "Modelamiento VAN / TIR / WACC",
          "Flujos de caja proyectados",
          "Sensibilidad y escenarios",
          "Macros para reportes contables",
        ],
        hours: 24,
      },
      {
        module: "SQL para Finanzas",
        topics: [
          "Consultas de portafolio",
          "Análisis AUM por clase de activo",
          "Series de tiempo en SQL",
        ],
        hours: 24,
      },
      {
        module: "Python Financiero",
        topics: [
          "APIs de datos bursátiles",
          "VaR histórico y paramétrico",
          "Modelos de riesgo",
          "Automatización de análisis",
        ],
        hours: 24,
      },
      {
        module: "Power BI Ejecutivo",
        topics: [
          "Dashboard CFO",
          "KPIs financieros en DAX",
          "Reportes AUM y rendimiento",
          "Alertas y suscripciones",
        ],
        hours: 24,
      },
    ],
    levels: [
      { name: "Programa Completo", price: 489000, durationHours: 144, whatYouLearn: ["Modelamiento VAN, TIR y WACC", "Flujos de caja proyectados", "Consultas SQL de portafolio", "APIs de datos bursátiles", "VaR histórico y paramétrico", "Modelos de riesgo con Python", "Dashboard CFO profesional", "KPIs financieros con DAX"] }
    ],
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    shortDescription:
      "Crea modelos predictivos, redes neuronales y automatiza decisiones complejas.",
    description:
      "Curso avanzado de Machine Learning con Python. Desde regresión y clasificación hasta redes neuronales y deep learning aplicado a negocios.",
    category: "ia",
    categoryLabel: "IA Avanzada",
    techStack: ["Python", "Scikit-learn", "TensorFlow"],
    durationHours: 48,
    modality: "online",
    level: "avanzado",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-f5cacc2d-9ca1-4d23-8361-fb8a615a8943.png?v=1739059469",
    icon: "Brain",
    accentColor: "#9333EA",
    isFeatured: false,
    sortOrder: 10,
    whatYouLearn: [
      "Regresión lineal y logística",
      "Árboles de decisión y Random Forest",
      "Clustering y reducción de dimensionalidad",
      "Redes neuronales con TensorFlow",
      "Deploy de modelos en producción",
    ],
    syllabus: [
      {
        module: "ML Supervisado",
        topics: [
          "Regresión lineal y polinómica",
          "Clasificación: Logística, SVM",
          "Árboles y ensemble methods",
          "Validación cruzada y métricas",
        ],
        hours: 16,
      },
      {
        module: "ML No Supervisado",
        topics: ["K-Means clustering", "PCA y t-SNE", "Detección de anomalías", "Reglas de asociación"],
        hours: 16,
      },
      {
        module: "Deep Learning",
        topics: [
          "Redes neuronales desde cero",
          "TensorFlow y Keras",
          "CNNs y RNNs",
          "Deploy con Flask/FastAPI",
        ],
        hours: 16,
      },
    ],
    levels: [
      { name: "Básico", price: 249000, durationHours: 16, whatYouLearn: ["Regresión lineal y polinómica", "Clasificación: Logística y SVM", "Árboles de decisión y ensemble", "Validación cruzada y métricas"] },
      { name: "Intermedio", price: 249000, durationHours: 16, whatYouLearn: ["K-Means clustering", "PCA y t-SNE para visualización", "Detección de anomalías", "Reglas de asociación"] },
      { name: "Avanzado", price: 249000, durationHours: 16, whatYouLearn: ["Redes neuronales desde cero", "TensorFlow y Keras", "CNNs y RNNs aplicados", "Deploy con Flask/FastAPI"] },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getFeaturedCourses(): Course[] {
  return courses.filter((c) => c.isFeatured).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getStandardCourses(): Course[] {
  return courses.filter((c) => !c.isFeatured).sort((a, b) => a.sortOrder - b.sortOrder);
}
