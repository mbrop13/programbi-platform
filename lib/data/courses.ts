// Course data that matches the current ProgramBI website exactly
export interface CourseLevel {
  name: string;             // e.g. "Básico", "Intermedio", "Avanzado"
  price?: number;           // price in CLP
  originalPrice?: number;   // original price before discount
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
  originalPrice?: number; // Total original price if applicable
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
        name: "Básico", 
        price: 249000, 
        originalPrice: 380000,
        durationHours: 48, 
        whatYouLearn: [
          "Fundamentos y bases de datos con SQL Server", 
          "Consultas SELECT, JOINs y subqueries", 
          "Funciones de agregación y agrupamiento", 
          "Procedimientos almacenados y diseño"
        ] 
      },
      { 
        name: "Intermedio", 
        price: 249000, 
        durationHours: 48, 
        whatYouLearn: [
          "Conexión a fuentes, ETL y modelado con Power Query", 
          "Modelado dimensional y relaciones", 
          "Fórmulas DAX intermedias y avanzadas", 
          "Dashboards interactivos y publicación"
        ] 
      },
      { 
        name: "Avanzado", 
        price: 249000, 
        durationHours: 48, 
        whatYouLearn: [
          "Fundamentos de Python y entorno Colab", 
          "Manipulación y limpieza de datos con Pandas", 
          "Visualización con Matplotlib y Seaborn", 
          "Automatización de reportes"
        ] 
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
    title: "Programa Industrial & Minero 2026: Análisis de Datos para la Minería",
    shortDescription:
      "Optimización de Procesos y Toma de Decisiones en Entornos Mineros. Un trayecto integral de 144 horas para optimizar procesos y predecir fallas.",
    description:
      "Especialización técnica de 144h para profesionales mineros e industriales. Domina el ciclo completo del dato, desde la automatización de flotas hasta el mantenimiento predictivo, respaldado por nuestra experiencia en CAP y AngloAmerican.",
    category: "especializacion",
    categoryLabel: "ESPECIALIZACIÓN",
    badgeLabel: "ESPECIALIZACIÓN",
    badgeColor: "#B45309",
    techStack: ["Excel", "Power BI", "SQL", "Python"],
    durationHours: 144,
    modality: "online",
    level: "básico a avanzado",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    icon: "HardHat",
    accentColor: "#B45309",
    isFeatured: false,
    sortOrder: 5,
    youtubeVideoId: "LiupEKDc3Ms",
    whatYouLearn: [
      "Visibilidad Operativa: Dashboards en tiempo real para producción, seguridad y mantenimiento de flotas",
      "Control de Datos Nativos: Conexión mediante SQL a servidores de la mina (PI System, SCADA)",
      "Mantenimiento Predictivo: Uso de Python (Pandas, Plotly) para modelar vida útil de activos",
      "Optimización de Tiempos: Reduce consolidación de reportes de faena de horas a minutos",
      "Integración de IA: Inteligencia Artificial en cada nivel para generar scripts y resolver cruces complejos",
    ],
    syllabus: [
      {
        module: "Nivel I: Fundamentos Operativos",
        topics: [
          "Power BI: Reportes de turnos y limpieza de datos (Minería)",
          "SQL Server: Consultas esenciales a bases de la mina",
          "Python: Automatización de logs de sensores con Pandas",
          "Integración IA: Consultas en lenguaje natural de faena"
        ],
        hours: 48,
      },
      {
        module: "Nivel II: Análisis de Faena",
        topics: [
          "Power BI: DAX avanzado para eficiencia de equipos (OEE)",
          "SQL Server: Cruce de flota, combustible y personal",
          "Python: Análisis de tendencias y visualizaciones industriales",
          "Integración IA: Medidas DAX complejas asistidas"
        ],
        hours: 48,
      },
      {
        module: "Nivel III: Predictividad y Servidores",
        topics: [
          "Power BI: Inteligencia de tiempo y RLS dinámico por área",
          "SQL Server: Procedimientos almacenados para Data Warehouse",
          "Python: Modelos predictivos de fallos y dashboards interactivos",
          "Integración IA: Procesos ETL predictivos"
        ],
        hours: 48,
      },
    ],
    levels: [
      { name: "Nivel I: Básico", price: 289000, durationHours: 48, whatYouLearn: ["Fundamentos de Power BI, SQL y Python", "Automatización de reportes de turnos", "Consultas a bases de la mina", "IA generativa para scripts básicos"] },
      { name: "Nivel II: Intermedio", price: 289000, durationHours: 48, whatYouLearn: ["Consolidado MINA - PLANTA - RRHH", "DAX avanzado y relaciones de área", "Joins avanzados y vistas de reporte", "Matplotlib y Seaborn industrial"] },
      { name: "Nivel III: Avanzado", price: 289000, durationHours: 48, whatYouLearn: ["Mantenimiento predictivo con Python", "Seguridad RLS por jefe de área", "Stored Procedures para Data Warehouse", "Dashboards interactivos con Plotly"] },
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
    durationHours: 144,
    modality: "online",
    level: "básico a avanzado",
    imageUrl:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop",
    icon: "TrendingUp",
    accentColor: "#1E3A8A",
    isFeatured: false,
    sortOrder: 9,
    whatYouLearn: [
      "Automatización Contable: Reduce errores en balances usando SQL",
      "Monitoreo de KPIs: Dashboards interactivos en Power BI para ROI y flujos",
      "Modelado de Riesgos: Python para correlación de activos y modelos predictivos",
      "Autonomía Tecnológica: Extrae y cruza información de múltiples fuentes financieras",
      "Integración de IA: Inteligencia Artificial en cada nivel para generar código",
    ],
    syllabus: [
      {
        module: "Nivel I: Básico (Fundamentos Contables)",
        topics: [
          "Power BI: Conexión de fuentes financieras y limpiezas en Power Query",
          "SQL Server: Extracción de transacciones y filtros temporales",
          "Python: Fundamentos de análisis de portafolios y Pandas inicial",
          "Integración IA: Consultas de balances en lenguaje natural"
        ],
        hours: 48,
      },
      {
        module: "Nivel II: Intermedio (Modelado e Inversiones)",
        topics: [
          "Power BI: Visualizaciones DAX de rentabilidad y ROI",
          "SQL Server: Joins avanzados y resúmenes de auditoría contable",
          "Python: Visualización de tendencias e índices financieros",
          "Integración IA: Conciliación automática de múltiples fuentes bancarias"
        ],
        hours: 48,
      },
      {
        module: "Nivel III: Avanzado (Predictividad de Riesgos)",
        topics: [
          "Power BI: Inteligencia de tiempo (YTD/QTD) y RLS seguro por área",
          "SQL Server: Procedimientos almacenados para automatización de reportes",
          "Python: Análisis predictivo de portafolios y dashboards Plotly",
          "Integración IA: Flujos ETL predictivos para proyecciones"
        ],
        hours: 48,
      },
    ],
    levels: [
      { name: "Nivel I: Básico", price: 289000, originalPrice: 420000, durationHours: 48, whatYouLearn: ["Power Query contable y Dashboards iniciales", "Filtros temporales y cruces JOIN en SQL", "Carga de datos y manipulación con Pandas", "IA para consultas de balances"] },
      { name: "Nivel II: Intermedio", price: 289000, originalPrice: 420000, durationHours: 48, whatYouLearn: ["DAX intermedio para rentabilidad y ROI", "Resúmenes agregados y auditorías con SQL", "Gráficos de rendimientos con Matplotlib/Seaborn", "IA para conciliación bancaria"] },
      { name: "Nivel III: Avanzado", price: 289000, originalPrice: 420000, durationHours: 48, whatYouLearn: ["Inteligencia de tiempo y seguridad RLS", "Stored Procedures para reporteo diario", "Modelos predictivos y dashboards interactivos", "IA para proyecciones presupuestarias"] },
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
