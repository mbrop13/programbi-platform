import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ciencia-de-datos-vs-analisis-de-datos",
  title: "Ciencia de datos vs análisis de datos: diferencias reales",
  meta: "Diferencias entre ciencia de datos y análisis de datos: tareas, herramientas, formación y salida laboral. Tabla comparativa y cómo elegir qué estudiar.",
  h1: "Ciencia de datos vs análisis de datos: en qué se diferencian",
  subtitle:
    "Aclara de una vez por todas qué separa al Data Analyst del Data Scientist en empresas reales de Chile y Latinoamérica: preguntas que responde cada uno, herramientas diarias, base matemática, salida laboral y cómo dar el salto de un rol al otro.",
  keywordPrincipal: "ciencia de datos vs análisis de datos",
  keywords: [
    "ciencia de datos vs análisis de datos",
    "data scientist vs data analyst",
    "qué es la ciencia de datos",
    "cuál estudiar análisis o ciencia de datos",
  ],
  curso: "machine-learning",
  cursoSecundario: "analisis-de-datos",
  herramienta: "Carrera",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  omitirHowTo: true,
  en30Segundos: {
    queLogras:
      "Distinguir con precisión el alcance, las herramientas y las oportunidades laborales de un analista de datos frente a un científico de datos para elegir qué ruta estudiar según tu perfil actual.",
    herramienta: "Orientación profesional · SQL · BI · Python · ML",
    tiempo: "20 minutos de lectura",
    bullets: [
      "El análisis de datos explica qué pasó y por qué pasó mediante métricas, SQL y BI.",
      "La ciencia de datos predice qué pasará o automatiza decisiones usando estadística avanzada y machine learning.",
      "Comparativa directa de tareas, matemáticas, entregables, perfil de entrada y demanda laboral.",
      "Plan práctico para comenzar como analista de datos y evolucionar hacia ciencia de datos si te atrae el modelado.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Definiciones claras",
      resumen: "Qué resuelve cada disciplina en el negocio.",
      anchorId: "definiciones-claras",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Tabla comparativa",
      resumen: "Tareas, herramientas, matemáticas y perfil.",
      anchorId: "tabla-comparativa-roles",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Un día de trabajo",
      resumen: "Rutina real de un analista vs un científico.",
      anchorId: "dia-de-trabajo-cada-rol",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Qué estudiar",
      resumen: "Rutas formativas según tu punto de partida.",
      anchorId: "que-estudiar-cada-camino",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Dar el salto",
      resumen: "Cómo pasar de analista a Data Scientist.",
      anchorId: "salto-analista-a-cientifico",
      icono: "sparkles",
    },
  ],
  requisitos: {
    version: "Guía conceptual y de orientación de carrera (no requiere software instalado)",
    lista: [
      "Interés en entender el ecosistema laboral de datos antes de invertir tiempo o dinero en un programa de estudios.",
      "Opcional: haber revisado ofertas laborales reales de Data Analyst y Data Scientist para contrastar requisitos.",
    ],
    compatibilidadMacWeb:
      "Artículo de lectura y comparación profesional accesible desde cualquier navegador o dispositivo.",
  },
  secciones: [
    {
      id: "definiciones-claras",
      titulo: "Definiciones claras: qué resuelve el análisis de datos y qué resuelve la ciencia de datos",
      parrafos: [
        "Aunque en redes sociales y avisos de empleo ambos términos suelen mezclarse, en equipos maduros cumplen propósitos distintos y complementarios. La diferencia fundamental está en el tipo de pregunta que responde cada rol y en el horizonte temporal de sus entregables.",
        "El análisis de datos (Data Analytics) se enfoca en comprender el presente y el pasado reciente de una operación para apoyar decisiones humanas. Responde preguntas descriptivas y diagnósticas: cuánto vendimos este trimestre frente al anterior, qué canal tuvo menor costo de adquisición, dónde se produjeron cuellos de botella en logística o qué sucursales cayeron bajo meta. Su salida habitual son tableros ejecutivos, reportes automatizados y análisis puntuales con recomendaciones.",
        "La ciencia de datos (Data Science), en cambio, utiliza programación avanzada, estadística inferencial y algoritmos de machine learning para predecir escenarios futuros, detectar patrones ocultos a gran escala o automatizar decisiones repetitivas en producción. Responde preguntas predictivas y prescriptivas: qué clientes tienen mayor probabilidad de cancelar su suscripción el próximo mes, cuál será la demanda diaria de un producto por tienda o qué transacción bancaria parece fraudulenta en milisegundos.",
        "En pocas palabras: el analista de datos ilumina el negocio para que las personas decidan mejor; el científico de datos construye modelos matemáticos y sistemas de software que estiman probabilidades o deciden a escala.",
      ],
      captura: {
        id: "ciencia-de-datos-vs-analisis-de-datos-paso-1",
        alt: "Infografía comparando el enfoque descriptivo y diagnóstico del análisis de datos frente al enfoque predictivo y algorítmico de la ciencia de datos.",
        caption: "Diferencia central: explicar el desempeño actual (análisis) vs modelar predicciones (ciencia).",
        ratio: "16/9",
      },
    },
    {
      id: "tabla-comparativa-roles",
      titulo: "Tabla comparativa completa: tareas, herramientas, matemática y perfil",
      parrafos: [
        "Para tomar una buena decisión vocacional o de contratación conviene bajar estas definiciones a aspectos concretos del trabajo diario. No todas las empresas necesitan un científico de datos desde el primer día: muchas organizaciones en Chile y Latinoamérica aún están ordenando sus bases de datos y reportes básicos, por lo que la demanda de analistas de datos sólidos suele ser mucho más amplia en volumen de vacantes de entrada.",
        "La siguiente tabla resume las diferencias reales entre ambos roles en el mercado actual, considerando tanto empresas locales tradicionales como compañías tecnológicas y startups.",
      ],
      tabla: {
        caption: "Comparativa integral: Analista de Datos vs Científico de Datos",
        encabezados: ["Dimensión", "Analista de Datos (Data Analyst)", "Científico de Datos (Data Scientist)"],
        filas: [
          [
            "Pregunta principal",
            "¿Qué ocurrió, dónde y por qué varió este KPI?",
            "¿Qué va a ocurrir y qué acción optimiza el resultado?",
          ],
          [
            "Tareas frecuentes",
            "Extracción SQL, limpieza, definición de KPIs, tableros BI y reportes ad hoc",
            "Ingeniería de variables, entrenamiento, validación de modelos, experimentos A/B y despliegue",
          ],
          [
            "Herramientas clave",
            "SQL, Excel / Power Query, Power BI o Tableau, Python básico (pandas)",
            "Python avanzado (scikit-learn, PyTorch/XGBoost), SQL, Git, Docker, cloud (AWS/Azure/GCP)",
          ],
          [
            "Matemática y estadística",
            "Estadística descriptiva, porcentajes, promedios, medianas, percentiles y variación",
            "Probabilidad, inferencia estadística, álgebra lineal, optimización y métricas de error",
          ],
          [
            "Entregable típico",
            "Dashboard interactivo, informe ejecutivo o consulta SQL automatizada",
            "Modelo predictivo en API/batch, sistema de recomendación o estudio causal",
          ],
          [
            "Perfil de entrada habitual",
            "Administración, finanzas, ingeniería, marketing, logística o reconversión desde negocio",
            "Estadística, matemáticas, informática, física o analistas senior con base cuantitativa",
          ],
          [
            "Barrera de primer empleo",
            "Media-baja (muchas vacantes junior valoran criterio de negocio + SQL/BI)",
            "Alta (suelen pedir experiencia previa en datos, posgrado o proyectos productivos)",
          ],
        ],
      },
      captura: {
        id: "ciencia-de-datos-vs-analisis-de-datos-paso-2",
        alt: "Cuadro comparativo visual entre Data Analyst y Data Scientist destacando herramientas, nivel matemático y entregables.",
        caption: "Contraste de stack técnico, exigencia cuantitativa y entregables en empresas reales.",
        ratio: "16/9",
      },
    },
    {
      id: "dia-de-trabajo-cada-rol",
      titulo: "Un día de trabajo en cada rol: cómo se ven las horas reales",
      parrafos: [
        "Comparar descripciones teóricas puede resultar abstracto, así que imaginemos un martes cualquiera dentro de una empresa de comercio electrónico o banca mediana que cuenta con ambos perfiles.",
        "La analista de datos comienza revisando que las cargas nocturnas del tablero comercial en Power BI hayan terminado sin errores. A media mañana se reúne con el gerente de ventas para investigar por qué la tasa de conversión cayó 3 puntos en la última campaña: escribe varias consultas SQL cruzando tráfico, descuentos y quiebres de stock, descubre que dos categorías clave estuvieron sin inventario el fin de semana y envía un resumen claro con tres gráficos antes de almuerzo. Por la tarde automatiza una vista SQL para el equipo de finanzas.",
        "Mientras tanto, el científico de datos trabaja en un horizonte de semanas. Por la mañana revisa la deriva de datos (data drift) de un modelo de riesgo crediticio o fuga de clientes que ya corre en producción. Luego pasa dos horas en Python preparando nuevas variables históricas con SQL y pandas para probar si un modelo de gradient boosting mejora la precisión respecto al modelo actual, evalúa resultados mediante validación cruzada y discute con ingeniería de datos cómo exponer las predicciones en el CRM.",
        "Ambos roles pasan mucho tiempo limpiando y entendiendo datos imperfectos, pero el analista interactúa con áreas de negocio casi a diario para explicar cifras, mientras el científico dedica bloques más largos a experimentar matemáticamente y escribir código estructurado.",
      ],
      captura: {
        id: "ciencia-de-datos-vs-analisis-de-datos-paso-3",
        alt: "Línea de tiempo comparando la jornada laboral de un analista de datos y un científico de datos en una misma empresa.",
        caption: "Contraste de ritmo diario: entregas ágiles de negocio (analista) frente a ciclos de experimentación (científico).",
        ratio: "16/9",
      },
    },
    {
      id: "que-estudiar-cada-camino",
      titulo: "Qué estudiar para cada camino según tu punto de partida",
      parrafos: [
        "Elegir mal qué estudiar al comienzo suele provocar abandono: mucha gente sin experiencia previa en programación se inscribe directo en cursos de redes neuronales, mientras otros con fuerte perfil matemático subestiman el valor de saber presentar resultados a un directorio.",
        "Si buscas insertarte relativamente rápido en el mercado laboral (en 4 a 6 meses de estudio disciplinado) o vienes de carreras como administración, contabilidad, ingeniería comercial, periodismo o logística, el camino de Análisis de Datos ofrece el mejor retorno. Tu prioridad debe ser dominar SQL relacional, Excel/Power Query, Power BI (incluyendo modelado estrella y DAX) y nociones prácticas de Python con pandas.",
        "Si en cambio disfrutas profundamente las matemáticas, la programación orientada a software y la estadística formal —o ya trabajas en ingeniería, estadística o desarrollo—, puedes apuntar a Ciencia de Datos. Además de SQL y Python avanzado, necesitarás estudiar probabilidad, inferencia, diseño de experimentos (test A/B), algoritmos supervisados y no supervisados (regresión, árboles, clustering) y buenas prácticas de ingeniería como Git y entornos reproducibles.",
      ],
      lista: [
        "Ruta Análisis de Datos: Excel avanzado → SQL (JOIN, CTE, funciones de ventana) → Power BI / Tableau → Python básico con pandas.",
        "Ruta Ciencia de Datos: Python sólido + SQL → Estadística y probabilidad aplicada → Machine Learning clásico (scikit-learn) → Evaluación de modelos y despliegue (MLOps básico).",
      ],
      captura: {
        id: "ciencia-de-datos-vs-analisis-de-datos-paso-4",
        alt: "Árbol de decisión simple para elegir entre estudiar análisis de datos o ciencia de datos según intereses y formación previa.",
        caption: "Criterio práctico para elegir qué estudiar primero sin perder meses en temas desalineados.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "info",
        titulo: "Cuidado con el título inflado de 'Data Scientist junior'",
        texto:
          "En muchas ofertas de empleo en Latinoamérica publican vacantes de 'Científico de Datos' cuando en realidad buscan un analista de datos que haga SQL, Power BI y algo de Python. Lee siempre las responsabilidades del aviso antes de descartarte.",
      },
    },
    {
      id: "salto-analista-a-cientifico",
      titulo: "Cómo dar el salto de analista de datos a científico de datos",
      parrafos: [
        "Una de las rutas más inteligentes —y menos arriesgadas— hacia la ciencia de datos no consiste en intentar entrar directo sin experiencia, sino en trabajar primero uno o dos años como analista de datos. De hecho, una gran proporción de científicos de datos exitosos comenzó exactamente así.",
        "Estando dentro de una empresa como analista, aprendes cómo nacen realmente los datos sucios, qué métricas le importan a gerencia y qué restricciones operacionales existen. Desde esa base firme, puedes empezar a incorporar Python para automatizar tus propios análisis, luego proponer pequeños proyectos internos de predicción (por ejemplo, estimar ventas mensuales o segmentar clientes con clustering) y finalmente formalizar tus conocimientos de estadística y machine learning.",
        "Al llegar a ese punto, tendrás algo que casi ningún egresado teórico posee: criterio de negocio probado y experiencia real explicando resultados a quienes toman decisiones.",
      ],
      captura: {
        id: "ciencia-de-datos-vs-analisis-de-datos-paso-5",
        alt: "Escalera de progresión profesional desde Analista de Datos Junior hasta Analista Senior, Analytics Engineer o Científico de Datos.",
        caption: "Trayectoria natural de crecimiento desde el análisis de datos hacia roles de ciencia o ingeniería.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Creer que un analista de datos es 'menos' que un científico de datos",
      causa:
        "Jerarquización artificial creada por marketing de bootcamps que presenta la ciencia de datos como el único objetivo aspiracional.",
      solucion:
        "Entiende que son especializaciones distintas: un buen analista senior o Analytics Manager tiene enorme impacto estratégico y remuneraciones altamente competitivas.",
    },
    {
      error: "Estudiar Deep Learning sin saber hacer un JOIN en SQL ni limpiar un CSV",
      causa:
        "Atractivo de las palabras de moda de inteligencia artificial frente a los fundamentos de manipulación de datos.",
      solucion:
        "Asegura primero SQL y manipulación tabular en pandas; el 80% del éxito de un modelo depende de la calidad y entendimiento de los datos de entrada.",
    },
    {
      error: "Ignorar el contexto de negocio al evaluar un modelo predictivo",
      causa:
        "Optimizar solo métricas académicas como accuracy sin considerar costos de falsos positivos o falsos negativos.",
      solucion:
        "Traduce siempre el desempeño técnico del modelo a impacto económico o operacional comprensible para el cliente interno.",
    },
  ],
  plantilla: {
    titulo: "Test de autoevaluación: ¿Análisis de Datos o Ciencia de Datos?",
    descripcion:
      "Próximamente podrás descargar aquí una matriz interactiva en Excel/Notion para evaluar tu afinidad técnica, matemática y de negocio y elegir tu plan de estudio.",
  },
  faqs: [
    {
      q: "¿Cuál tiene más salida laboral hoy en Chile y Latinoamérica?",
      a: "En cantidad de vacantes abiertas, el análisis de datos (Data Analyst / BI Analyst) concentra un volumen considerablemente mayor, especialmente para perfiles junior o en reconversión. La ciencia de datos tiene buena demanda, pero exige mayor seniority y experiencia previa.",
    },
    {
      q: "¿Un científico de datos gana siempre más que un analista de datos?",
      a: "En promedio, los roles de Data Scientist senior suelen tener bandas salariales algo más altas que las de un analista junior o semi-senior debido a la escasez de perfiles con dominio matemático y de ingeniería. Sin embargo, un analista senior, Analytics Engineer o líder de BI suele superar fácilmente a un Data Scientist principiante.",
    },
    {
      q: "¿Dónde encaja el Ingeniero de Datos (Data Engineer) en esta comparación?",
      a: "El Data Engineer construye y mantiene las tuberías (pipelines), bodegas de datos (data warehouses) e infraestructura para que los datos lleguen limpios, seguros y a tiempo. Sin el trabajo del ingeniero de datos, tanto analistas como científicos pierden horas buscando archivos dispersos.",
    },
    {
      q: "¿La inteligencia artificial generativa va a reemplazar a los analistas o científicos de datos?",
      a: "No los reemplaza, sino que elimina tareas mecánicas como escribir sintaxis repetitiva de SQL o gráficos básicos. El criterio para formular la pregunta correcta, validar si un número tiene sentido en el negocio y diseñar soluciones confiables sigue siendo humano y se vuelve aún más valioso.",
    },
  ],
  relacionadas: [
    "que-es-analisis-de-datos",
    "como-ser-analista-de-datos",
    "python-para-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Rutas oficiales de aprendizaje de datos e IA en Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/training/browse/?roles=data-analyst%2Cdata-scientist",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de pandas para análisis y ciencia de datos",
      url: "https://pandas.pydata.org/docs/",
      fuente: "pandas",
    },
  ],
};

export default guia;
