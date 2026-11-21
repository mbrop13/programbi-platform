import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "como-ser-analista-de-datos",
  title: "Cómo ser analista de datos desde cero: ruta paso a paso",
  meta: "Ruta para ser analista de datos desde cero: habilidades, qué estudiar, herramientas, portafolio y primeras postulaciones. Plan por etapas y recursos.",
  h1: "Cómo convertirte en analista de datos desde cero",
  subtitle:
    "Un mapa realista y sin humo para pasar de cero a tu primer trabajo como analista de datos en Chile o Latinoamérica: qué hace el rol día a día, qué stack aprender en orden, cómo armar tres proyectos de portafolio que sí miran los reclutadores y cómo preparar tus postulaciones.",
  keywordPrincipal: "cómo ser analista de datos",
  keywords: [
    "cómo ser analista de datos",
    "analista de datos desde cero",
    "qué estudiar para analista de datos",
    "portafolio analista de datos",
  ],
  curso: "analisis-de-datos",
  herramienta: "Carrera",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Trazar un plan concreto de 4 a 6 meses para adquirir las herramientas clave de un analista de datos junior, construir un portafolio demostrable y postular con criterio en el mercado chileno y latinoamericano.",
    herramienta: "Excel · SQL · Power BI · Python",
    tiempo: "25 minutos de lectura",
    bullets: [
      "Comprender las tareas reales del rol más allá de hacer gráficos bonitos.",
      "Comparar opciones de estudio: carrera formal, cursos prácticos en vivo y certificaciones como Microsoft PL-300.",
      "Seguir la secuencia recomendada de aprendizaje: Excel → SQL → Power BI → Python.",
      "Diseñar 3 proyectos de portafolio publicables y preparar CV más pruebas técnicas.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "El rol real",
      resumen: "Qué hace un analista en una semana típica.",
      anchorId: "que-hace-analista-datos",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Habilidades clave",
      resumen: "Competencias técnicas y blandas esenciales.",
      anchorId: "habilidades-tecnicas-blandas",
      icono: "check",
    },
    {
      numero: 3,
      titulo: "Qué estudiar",
      resumen: "Universidad vs cursos vs certificación PL-300.",
      anchorId: "que-estudiar-opciones",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Ruta por etapas",
      resumen: "Orden óptimo: Excel, SQL, Power BI y Python.",
      anchorId: "ruta-por-etapas",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Portafolio real",
      resumen: "3 proyectos concretos para demostrar criterio.",
      anchorId: "portafolio-tres-proyectos",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Postular y mercado",
      resumen: "Entrevistas, CV y panorama salarial en LATAM.",
      anchorId: "postular-y-mercado-latam",
      icono: "sparkles",
    },
  ],
  requisitos: {
    version: "Plan de carrera aplicable desde cualquier formación previa (ingeniería, administración, humanidades o reconversión laboral)",
    lista: [
      "Disponibilidad de 6 a 10 horas semanales constantes para practicar con datos reales.",
      "Computador con acceso a Excel o Google Sheets, SQL Server / PostgreSQL y Power BI Desktop (Windows).",
      "Disposición para entender problemas de negocio, no solo memorizar sintaxis de código.",
    ],
    compatibilidadMacWeb:
      "Excel, SQL y Python funcionan de manera nativa en Windows y macOS. Para Power BI Desktop en Mac se requiere máquina virtual (Parallels/UTM) o acceso a un entorno Windows.",
  },
  secciones: [
    {
      id: "que-hace-analista-datos",
      titulo: "Qué hace realmente un analista de datos",
      esPasoHowTo: true,
      resumenHowTo:
        "Entiende el ciclo completo del trabajo analítico: levantar requerimientos, extraer y limpiar datos, modelar KPIs y comunicar hallazgos accionables.",
      parrafos: [
        "Existe el mito de que un analista de datos pasa el día entero entrenando modelos complejos o diseñando tableros coloridos. En la práctica, el valor central del puesto consiste en traducir preguntas ambiguas de negocio —como '¿por qué cayó el margen en la zona sur?' o '¿qué clientes están en riesgo de fuga?'— en respuestas verificables respaldadas por evidencia.",
        "Una semana típica combina cuatro bloques de trabajo: conversar con áreas comerciales, financieras u operacionales para definir qué significa realmente cada indicador; extraer tablas desde ERP, CRM o bases SQL y depurar inconsistencias; construir modelos limpios en Power BI o Excel que se actualicen sin intervención manual; y presentar conclusiones breves enfocadas en decisiones.",
        "Por eso las empresas valoran tanto a personas que vienen de otros rubros (finanzas, logística, marketing, recursos humanos, ingeniería) y suman herramientas de datos: quien ya entiende cómo opera un negocio detecta anomalías en los números mucho más rápido que alguien que solo domina sintaxis.",
      ],
      lista: [
        "Levantamiento de requerimientos y definición de KPIs sin ambigüedades.",
        "Extracción, cruce y validación de calidad de datos entre distintas fuentes.",
        "Automatización de reportes recurrentes y construcción de tableros de seguimiento.",
        "Análisis exploratorio puntual (ad hoc) para explicar variaciones o evaluar campañas.",
      ],
      captura: {
        id: "como-ser-analista-de-datos-paso-1",
        alt: "Esquema del ciclo de trabajo diario de un analista de datos desde la pregunta de negocio hasta la recomendación accionable.",
        caption: "Ciclo real del analista: negocio, extracción, limpieza, modelado y comunicación.",
        ratio: "16/9",
      },
    },
    {
      id: "habilidades-tecnicas-blandas",
      titulo: "Habilidades técnicas y blandas que piden las ofertas reales",
      esPasoHowTo: true,
      resumenHowTo:
        "Equilibra el dominio de herramientas (SQL, BI, Excel, Python) con criterio de negocio, pensamiento crítico y comunicación ejecutiva.",
      parrafos: [
        "Al revisar ofertas laborales para analista de datos junior o semi-senior en Chile y Latinoamérica, se repite un núcleo muy claro de competencias técnicas. No necesitas dominar diez tecnologías a la vez: es mucho más efectivo manejar con soltura tres o cuatro herramientas complementarias que tener nociones superficiales de veinte.",
        "En el plano técnico, el piso indispensable incluye modelado tabular y funciones de búsqueda/agregación en Excel, consultas SQL sólidas (JOIN, GROUP BY, CTE y funciones de ventana) y creación de modelos estrella y medidas DAX básicas en Power BI (o Tableau). Python con pandas aparece cada vez más como diferenciador para automatizar limpiezas complejas o trabajar con APIs.",
        "Sin embargo, las contrataciones se deciden con frecuencia por las habilidades blandas: saber hacer preguntas incómodas cuando un dato no cuadra, documentar supuestos, resumir un análisis de tres horas en cinco diapositivas claras y explicar hallazgos técnicos en lenguaje cotidiano a jefaturas no técnicas.",
      ],
      lista: [
        "Técnicas base: Excel avanzado (tablas dinámicas, Power Query, BUSCARX), SQL relacional y Power BI.",
        "Técnicas diferenciadoras: Python (pandas), nociones de estadística descriptiva (promedios, medianas, percentiles, variación porcentual) y control de versiones con Git.",
        "Blandas críticas: pensamiento estructurado, validación obsesiva de cifras, comunicación escrita concisa y storytelling con datos.",
      ],
      captura: {
        id: "como-ser-analista-de-datos-paso-2",
        alt: "Matriz de competencias de un analista de datos dividiendo habilidades técnicas fundamentales, diferenciadoras y blandas.",
        caption: "Mapa equilibrado entre stack técnico indispensable y habilidades de comunicación de negocio.",
        ratio: "16/9",
      },
    },
    {
      id: "que-estudiar-opciones",
      titulo: "Qué estudiar: carrera universitaria vs cursos en vivo vs certificaciones (PL-300)",
      esPasoHowTo: true,
      resumenHowTo:
        "Compara tiempo, costo y retorno de cada vía formativa para elegir la que mejor calza con tu punto de partida.",
      parrafos: [
        "No existe un único camino válido para entrar al área. Si estás saliendo del colegio y buscas formación amplia de base, una carrera como Ingeniería Civil Industrial, Ingeniería Comercial, Estadística o Ciencia de Datos entrega fundamentos sólidos, aunque suele tardar cuatro o cinco años y muchas veces llega tarde a las herramientas actuales de la industria.",
        "Para quienes ya tienen título en otra disciplina o buscan reconversión laboral, los programas prácticos enfocados en herramientas reales (idealmente con mentoría, proyectos aplicados y retroalimentación en vivo) aceleran enormemente la curva. Complementarlos con certificaciones oficiales reconocidas por empresas —en especial la certificación Microsoft Power BI Data Analyst Associate (PL-300)— aporta un sello objetivo en procesos de selección donde tu título previo no dice 'datos'.",
      ],
      tabla: {
        caption: "Comparativa de rutas de formación para trabajar en análisis de datos",
        encabezados: ["Vía de formación", "Duración típica", "Fortaleza principal", "Limitación frecuente"],
        filas: [
          [
            "Carrera universitaria / Técnica",
            "2,5 a 5 años",
            "Base matemática, estadística y reconocimiento formal amplio",
            "Costo alto, lenta actualización de herramientas de BI/Python",
          ],
          [
            "Cursos prácticos / Bootcamps",
            "3 a 6 meses",
            "Foco directo en SQL, Power BI, Python y proyectos aplicados",
            "Calidad variable; requiere disciplina propia para profundizar",
          ],
          [
            "Autoaprendizaje + Certificación PL-300",
            "2 a 4 meses",
            "Costo muy bajo y credencial verificable de Microsoft",
            "Sin práctica en proyectos reales no basta por sí sola en entrevistas",
          ],
        ],
      },
      captura: {
        id: "como-ser-analista-de-datos-paso-3",
        alt: "Tabla comparativa de alternativas formativas destacando duración, costo relativo y peso en procesos de selección.",
        caption: "Criterios prácticos para combinar formación aplicada con certificaciones de industria como PL-300.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "El certificado no reemplaza al portafolio",
        texto:
          "Una insignia como PL-300 ayuda a pasar filtros iniciales de currículum, pero en la entrevista técnica te pedirán resolver consultas SQL en vivo o explicar cómo modelaste un tablero real.",
      },
    },
    {
      id: "ruta-por-etapas",
      titulo: "Ruta recomendada por etapas: Excel → SQL → Power BI → Python",
      esPasoHowTo: true,
      resumenHowTo:
        "Sigue esta secuencia progresiva de cuatro bloques para construir bases sólidas sin abrumarte.",
      parrafos: [
        "El error más común de quienes empiezan desde cero es intentar aprender Python, machine learning y visualización avanzada durante la primera semana. Sin comprender cómo se estructuran las tablas, qué es una llave primaria o cómo se agrega una métrica sin duplicar montos, el código se vuelve frustrante.",
        "La secuencia Excel → SQL → Power BI → Python funciona porque cada etapa prepara el terreno mental para la siguiente. En Excel entiendes filas, columnas, filtros y tablas dinámicas; en SQL formalizas ese conocimiento sobre múltiples tablas relacionadas; en Power BI conectas ese modelo relacional con medidas dinámicas y narrativa visual; y finalmente en Python automatizas lo que las herramientas visuales no alcanzan a cubrir.",
      ],
      listaOrdenada: [
        "Etapa 1 — Excel y modelado tabular (semanas 1 a 3): domina funciones lógicas (SI, SI.CONJUNTO), búsqueda (BUSCARX), tablas dinámicas y limpieza básica con Power Query.",
        "Etapa 2 — SQL para análisis (semanas 4 a 8): practica SELECT, WHERE, JOIN, GROUP BY, HAVING, CTE (WITH) y funciones de ventana (ROW_NUMBER, LAG, SUM OVER).",
        "Etapa 3 — Power BI y modelo estrella (semanas 9 a 13): aprende Power Query, relaciones 1 a muchos, tabla calendario, medidas DAX esenciales (CALCULATE, SAMEPERIODLASTYEAR) y diseño limpio de dashboards.",
        "Etapa 4 — Python con pandas (semanas 14 a 18): automatiza lectura de CSV/Excel sucios, limpieza vectorizada, agrupaciones y gráficos exploratorios.",
      ],
      captura: {
        id: "como-ser-analista-de-datos-paso-4",
        alt: "Hoja de ruta visual en 4 etapas secuenciales mostrando Excel, SQL, Power BI y Python con semanas estimadas.",
        caption: "Secuencia recomendada de aprendizaje para consolidar criterio analítico paso a paso.",
        ratio: "16/9",
      },
    },
    {
      id: "portafolio-tres-proyectos",
      titulo: "Portafolio: 3 proyectos concretos que sí destacan",
      esPasoHowTo: true,
      resumenHowTo:
        "Construye tres casos públicos documentados con pregunta de negocio, datos limpios, código o modelo y conclusiones.",
      parrafos: [
        "Cuando no tienes experiencia laboral previa con el título de 'Analista de Datos', tu portafolio es tu evidencia de trabajo. Pero cuidado: subir diez notebooks idénticos del Titanic o gráficos genéricos sin contexto no convence a ningún líder de área.",
        "Bastan tres proyectos bien elegidos, distintos entre sí y documentados en un repositorio limpio (por ejemplo en GitHub o en una página personal con capturas interactivas). Cada proyecto debe responder una pregunta clara, explicar qué problemas tenían los datos originales y cerrar con dos o tres recomendaciones accionables.",
      ],
      lista: [
        "Proyecto 1 (SQL + Negocio): Análisis de retención y cohortes de clientes sobre una base comercial (por ejemplo, identificar qué segmento cae en recompra al tercer mes y calcular ticket promedio con CTEs y funciones de ventana).",
        "Proyecto 2 (Power BI + Modelado Estrella): Dashboard ejecutivo comercial o financiero con tabla de hechos y dimensiones, medidas DAX de variación interanual y diseño pensado para gerencia (sin sobrecargar la vista).",
        "Proyecto 3 (Python + Datos públicos locales): Limpieza y análisis exploratorio de un dataset abierto de Chile o LATAM (transporte, empleo, licitaciones públicas o indicadores económicos del Banco Central) mostrando automatización y visualizaciones claras.",
      ],
      captura: {
        id: "como-ser-analista-de-datos-paso-5",
        alt: "Ejemplo de repositorio de portafolio bien documentado mostrando objetivo de negocio, arquitectura del modelo, código SQL/Python y capturas del dashboard.",
        caption: "Estructura ideal de un proyecto de portafolio orientado a negocio y no solo a código.",
        ratio: "16/9",
      },
    },
    {
      id: "postular-y-mercado-latam",
      titulo: "Cómo postular, preparar entrevistas y entender el mercado en Chile/LATAM",
      esPasoHowTo: true,
      resumenHowTo:
        "Adapta tu currículum al impacto en negocio, practica pruebas técnicas de SQL/BI y revisa referencias salariales reales.",
      parrafos: [
        "Muchos candidatos listos técnicamente pierden oportunidades por cómo redactan su currículum. En lugar de enumerar solo herramientas ('Sé Excel, SQL y Power BI'), describe logros medibles incluso si vienen de tu trabajo anterior en otra área: por ejemplo, 'Automaticé el reporte semanal de inventario en Excel reduciendo 4 horas de trabajo manual' o 'Construí tablero en Power BI para monitorear mora de 1.200 clientes'.",
        "En procesos de selección para analista junior en Chile y Latinoamérica suelen aparecer tres filtros: entrevista de ajuste cultural y experiencia, prueba técnica práctica (casi siempre SQL con JOIN/GROUP BY + algún caso en Excel o Power BI) y presentación breve de un caso de negocio. Practicar explicando tus decisiones en voz alta marca una gran diferencia.",
        "Para calibrar tus expectativas de renta según seniority, ciudad y modalidad (presencial, híbrido o remoto para el extranjero), revisa nuestra guía específica de sueldos en Latinoamérica y el observatorio de datos del mercado regional en la sección de datos.",
      ],
      captura: {
        id: "como-ser-analista-de-datos-paso-6",
        alt: "Checklist de postulación mostrando ajuste de CV con métricas de impacto, práctica de SQL en vivo y preparación de caso de negocio.",
        caption: "Preparación integral para postulaciones y entrevistas técnicas de analista de datos.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Acumular cursos y certificados sin construir ningún proyecto propio",
      causa:
        "Ver tutoriales genera sensación de avance, pero al enfrentar un archivo sucio sin guía no sabes por dónde empezar.",
      solucion:
        "Aplica la regla 30/70: dedica máximo 30% del tiempo a ver clases y 70% a resolver consultas, modelar tableros y limpiar datasets por tu cuenta.",
    },
    {
      error: "Saltarse SQL y Excel para ir directo a Python o Machine Learning",
      causa:
        "En la mayoría de las empresas medianas y grandes de Chile y LATAM, el 80% del trabajo diario de un analista junior ocurre en SQL, Excel y Power BI.",
      solucion:
        "Consolida primero SQL y Power BI; una vez que manejes consultas relacionales y modelos estrella, suma Python como acelerador.",
    },
    {
      error: "Mostrar dashboards recargados con 15 gráficos sin una conclusión clara",
      causa:
        "Enfoque centrado en lucir funcionalidades de la herramienta en lugar de responder las preguntas de quien toma decisiones.",
      solucion:
        "Limita cada vista a 3 o 4 KPIs clave y 3 o 4 visuales bien ordenados, agregando títulos que resuman el hallazgo.",
    },
  ],
  plantilla: {
    titulo: "Checklist de 16 semanas y plantilla de README para portafolio",
    descripcion:
      "Próximamente podrás descargar aquí el plan semanal editable en Notion/Excel y la estructura base para documentar tus tres proyectos en GitHub.",
  },
  faqs: [
    {
      q: "¿Cuánto tiempo toma conseguir el primer trabajo como analista de datos desde cero?",
      a: "Con dedicación constante de 8 a 10 horas semanales, la mayoría logra una base sólida y un portafolio competitivo entre 4 y 6 meses. El tiempo hasta firmar contrato depende también de tu experiencia laboral previa y de qué tan activo seas postulando.",
    },
    {
      q: "¿Se necesita ser experto en matemáticas avanzadas para ser analista de datos?",
      a: "No. Para análisis de datos necesitas aritmética sólida, porcentajes, tasas de crecimiento, promedios, medianas, desviación básica y mucho sentido común para detectar cifras absurdas. El cálculo multivariable o álgebra lineal avanzada corresponden más a ciencia de datos y machine learning.",
    },
    {
      q: "¿Puedo ser analista de datos si vengo de una carrera no tecnológica?",
      a: "Sí, es sumamente común. Profesionales de administración, contabilidad, psicología, periodismo, logística o ingeniería comercial tienen una ventaja enorme porque ya entienden procesos de negocio y saben comunicarse con usuarios finales.",
    },
    {
      q: "¿Qué pesa más en un CV junior: el inglés o las herramientas técnicas?",
      a: "Para trabajar en empresas locales en Chile o LATAM, las herramientas técnicas (SQL, Power BI, Excel) y la capacidad analítica son prioritarias. Sumar inglés intermedio-avanzado abre la puerta a empresas multinacionales y trabajos remotos mejor remunerados.",
    },
    {
      q: "¿Vale la pena sacar la certificación Microsoft PL-300?",
      a: "Sí, especialmente si estás cambiando de rubro o quieres validar tu dominio de Power BI ante reclutadores. Eso sí, prepárala después de haber practicado modelado real para que el conocimiento sea genuino.",
    },
  ],
  relacionadas: [
    "que-es-analisis-de-datos",
    "preguntas-entrevista-analista-de-datos",
    "ciencia-de-datos-vs-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Certificación oficial Microsoft Power BI Data Analyst (PL-300)",
      url: "https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Ruta oficial de aprendizaje de análisis de datos en Power BI",
      url: "https://learn.microsoft.com/es-es/training/powerplatform/power-bi",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Guía para aprobar la certificación PL-300 de Power BI",
      href: "/guias/certificacion-pl-300-power-bi",
      descripcion: "Temario, consejos de estudio y formato del examen oficial de Microsoft.",
    },
    {
      label: "Sueldos de analista de datos en Chile y Latinoamérica",
      href: "/guias/sueldo-analista-de-datos-latinoamerica",
      descripcion: "Rangos salariales por nivel de experiencia y país en la región.",
    },
    {
      label: "Observatorio de datos y mercado laboral",
      href: "/datos",
      descripcion: "Explora cifras actualizadas del mercado analítico en nuestra sección de datos.",
    },
  ],
};

export default guia;
