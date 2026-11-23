import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "notebooklm-que-es-y-como-usarlo",
  title: "NotebookLM: qué es y cómo usarlo paso a paso (guía 2026)",
  meta: "Qué es NotebookLM de Google, si es gratis y cómo usarlo: carga tus fuentes, haz preguntas con citas y crea resúmenes de audio. Guía paso a paso.",
  h1: "Qué es NotebookLM y cómo usarlo paso a paso",
  subtitle:
    "Aprende a trabajar con tus propios documentos en NotebookLM: sube PDFs, Google Docs y enlaces web, obtén respuestas con citas clicables y genera resúmenes de audio o guías de estudio sin mezclar fuentes externas.",
  keywordPrincipal: "notebooklm",
  keywords: [
    "notebooklm",
    "NotebookLM qué es",
    "NotebookLM para qué sirve",
    "NotebookLM gratis",
    "NotebookLM en español",
  ],
  curso: "ia-productividad",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de subir contratos, bases de licitación, actas internas o informes financieros a NotebookLM, revisa si tu cuenta pertenece a Google Workspace corporativo o a una cuenta personal gratuita. No cargues archivos con datos personales sensibles como RUT, sueldos individuales o fichas médicas sin autorización de tu organización.",
  en30Segundos: {
    queLogras:
      "Crear un cuaderno de investigación en NotebookLM con tus propios documentos, hacer preguntas ancladas en citas exactas y producir resúmenes de audio o notas estructuradas.",
    herramienta: "Google NotebookLM",
    tiempo: "20 minutos",
    bullets: [
      "Distinguir cuándo conviene usar NotebookLM en lugar de un chat general como Gemini.",
      "Cargar fuentes variadas (PDF, Google Docs/Slides, URLs web, audio o texto pegado).",
      "Verificar cada respuesta haciendo clic en los números de cita que apuntan al pasaje original.",
      "Aplicar flujos prácticos para analistas: revisión de informes, actas y diccionarios de datos.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Qué es NotebookLM",
      resumen: "Entiende su enfoque basado en fuentes frente a Gemini.",
      anchorId: "que-es-notebooklm-vs-gemini",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Crear y cargar",
      resumen: "Abre un cuaderno y sube PDF, Docs, enlaces o texto.",
      anchorId: "crear-cuaderno-cargar-fuentes",
      icono: "file",
    },
    {
      numero: 3,
      titulo: "Preguntas con citas",
      resumen: "Consulta tus documentos y valida cada cita en la fuente.",
      anchorId: "preguntas-citas-verificables",
      icono: "check",
    },
    {
      numero: 4,
      titulo: "Audio y estudio",
      resumen: "Genera resúmenes de audio y guías de estudio en español.",
      anchorId: "resumenes-audio-guias",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Usos para analistas",
      resumen: "Cruza actas, diccionarios de datos y documentación BI.",
      anchorId: "usos-practicos-analistas",
      icono: "database",
    },
    {
      numero: 6,
      titulo: "Límites y privacidad",
      resumen: "Revisa cuotas reales de fuentes, tamaño y protección de datos.",
      anchorId: "limites-y-privacidad",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Navegador web actualizado y cuenta de Google (personal o Workspace)",
    lista: [
      "Acceso a notebooklm.google desde tu navegador de escritorio o móvil.",
      "Documentos de referencia limpios (PDF con texto seleccionable, Google Docs, Slides, URLs públicas o texto plano).",
      "Opcional: cuenta de Google Workspace o plan pago si requieres mayores cuotas de fuentes o audio.",
    ],
    compatibilidadMacWeb:
      "NotebookLM funciona íntegramente en la web (Windows, macOS, Linux y navegadores móviles compatibles) sin instalar software local.",
    avisoEducativo:
      "Las cuotas exactas y disponibilidad de funciones por país o plan pueden cambiar; consulta siempre la documentación oficial en support.google.com y notebooklm.google.",
  },
  herramientasHowTo: ["Google NotebookLM", "Navegador web"],
  insumosHowTo: ["Documentos PDF, Google Docs o enlaces de referencia"],
  secciones: [
    {
      id: "que-es-notebooklm-vs-gemini",
      titulo: "1. Qué es NotebookLM y en qué se diferencia de Gemini",
      esPasoHowTo: true,
      resumenHowTo:
        "Comprende por qué NotebookLM responde acotado a tus fuentes cargadas mientras Gemini funciona como asistente general.",
      parrafos: [
        "NotebookLM es un asistente de investigación y notas desarrollado por Google cuyo principio central es el anclaje en fuentes (source-grounding). Según la documentación oficial de Google (notebooklm.google y support.google.com, consultado el 21 de noviembre de 2026), en lugar de responder desde conocimiento general abierto en internet, NotebookLM convierte los documentos que tú subes en la base principal de cada conversación.",
        "Muchas personas confunden NotebookLM con Gemini porque ambos pertenecen al ecosistema de Google y utilizan modelos de la familia Gemini por debajo. Sin embargo, cumplen roles distintos en el flujo de trabajo diario.",
        "Cuando necesitas lluvia de ideas abierta, redactar un correo desde cero o resolver una duda de programación sin documentos previos, Gemini es la herramienta natural. En cambio, cuando tienes quince PDFs de normativa tributaria, tres manuales técnicos y seis actas de reunión, y necesitas respuestas que citen exactamente en qué página está cada regla sin inventar definiciones externas, NotebookLM reduce drásticamente las alucinaciones.",
      ],
      tabla: {
        caption:
          "Comparativa entre NotebookLM y Gemini según documentación oficial de Google (consultado el 21 de noviembre de 2026)",
        encabezados: [
          "Criterio",
          "NotebookLM",
          "Gemini (chat general)",
        ],
        filas: [
          [
            "Base de conocimiento principal",
            "Acotada a las fuentes que cargas en cada cuaderno.",
            "Conocimiento general del modelo, búsqueda web y archivos puntuales.",
          ],
          [
            "Trazabilidad de respuestas",
            "Incluye citas numeradas clicables que abren el fragmento exacto.",
            "Entrega respuestas directas o enlaces web cuando busca en línea.",
          ],
          [
            "Organización del trabajo",
            "Cuadernos persistentes con panel de fuentes, chat y estudio.",
            "Hilos de conversación orientados a tareas o asistencia general.",
          ],
          [
            "Formatos de salida propios",
            "Resúmenes de audio, guías de estudio, cronologías y notas.",
            "Texto, código, borradores y acciones en apps de Workspace.",
          ],
          [
            "Ideal para",
            "Estudiar normativa, cruzar informes largos y documentar proyectos.",
            "Ideación, redacción rápida, dudas generales y tareas cotidianas.",
          ],
        ],
      },
      captura: {
        id: "notebooklm-que-es-y-como-usarlo-paso-1",
        alt: "Interfaz principal de NotebookLM dividida en panel de fuentes, chat central y panel de estudio",
        caption:
          "La pantalla de NotebookLM separa las fuentes cargadas, el chat con citas y las herramientas de estudio.",
        ratio: "16/9",
      },
    },
    {
      id: "crear-cuaderno-cargar-fuentes",
      titulo: "2. Crear un cuaderno y cargar fuentes (PDF, Docs, web, texto)",
      esPasoHowTo: true,
      resumenHowTo:
        "Inicia un nuevo cuaderno en notebooklm.google y agrega documentos heterogéneos manteniendo un tema único por cuaderno.",
      parrafos: [
        "Para empezar, entra a notebooklm.google con tu cuenta de Google y haz clic en Crear nuevo cuaderno. La buena práctica más importante desde el primer minuto es mantener un cuaderno por proyecto o materia: si mezclas apuntes de SQL, contratos de arriendo y políticas de recursos humanos en el mismo cuaderno, las respuestas perderán foco.",
        "Según el centro de ayuda oficial de Google para NotebookLM (support.google.com, consultado el 21 de noviembre de 2026), puedes incorporar múltiples tipos de fuentes dentro de un mismo cuaderno: archivos PDF, Google Docs, Google Slides, Google Sheets, documentos de Word, archivos de texto o Markdown, URLs de páginas web públicas, enlaces de YouTube, archivos de audio (MP3, WAV) y texto pegado manualmente.",
        "Una vez cargadas, verás cada fuente listada en el panel izquierdo con una casilla de verificación. Ese detalle es muy útil: puedes activar o desactivar fuentes específicas en cualquier momento para que una pregunta consulte solo un subconjunto de documentos.",
      ],
      lista: [
        "Verifica que tus PDFs contengan texto seleccionable; si son escaneos antiguos sin OCR, el reconocimiento puede fallar o quedar incompleto.",
        "Renombra las fuentes dentro del cuaderno si subiste archivos con nombres genéricos como «Documento_final_v3.pdf».",
        "Usa las casillas de selección izquierda para aislar dos documentos cuando quieras compararlos sin ruido del resto.",
      ],
      captura: {
        id: "notebooklm-que-es-y-como-usarlo-paso-2",
        alt: "Ventana de carga de fuentes en NotebookLM mostrando opciones de PDF, Google Drive, enlaces web y texto copiado",
        caption:
          "Carga distintas fuentes en un mismo cuaderno y usa las casillas del panel izquierdo para filtrar qué documentos consulta el chat.",
        ratio: "16/9",
      },
    },
    {
      id: "preguntas-citas-verificables",
      titulo: "3. Hacer preguntas con citas verificables en tus documentos",
      esPasoHowTo: true,
      resumenHowTo:
        "Redacta preguntas concretas, exige formato estructurado y audita cada número de cita haciendo clic sobre él.",
      parrafos: [
        "Con tus fuentes activas, el chat central te permite interrogar el contenido completo del cuaderno. La regla de oro es formular preguntas específicas que obliguen al modelo a contrastar documentos o listar condiciones exactas, indicando explícitamente que si un dato no figura en las fuentes debe declararlo.",
        "Cada afirmación relevante en la respuesta aparece acompañada de un número de cita clicable. Al hacer clic en ese número, el panel izquierdo salta directamente al pasaje exacto de la fuente original que respalda la respuesta. Ese hábito de verificación toma tres segundos y marca la diferencia entre confiar ciegamente en un resumen y trabajar con rigor profesional.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Extraer requisitos o cláusulas con respaldo literal",
          lenguaje: "prompt",
          codigo: `Basándote únicamente en las fuentes seleccionadas, lista todos los requisitos de entrega, plazos y penalidades mencionados.
Formato: tabla con columnas [Tema | Detalle exacto | Documento y sección].
Si alguno de estos puntos no aparece en las fuentes, indícalo explícitamente como "No especificado en las fuentes".`,
        },
        {
          titulo: "Prompt 2: Comparar discrepancias entre dos versiones de un informe",
          lenguaje: "prompt",
          codigo: `Compara la fuente 1 y la fuente 2 en relación con las definiciones de KPI y metas trimestrales.
Enumera:
1. Definiciones que coinciden exactamente.
2. Diferencias de criterio o cifras entre ambos documentos.
3. Qué puntos quedaron ambiguos o sin definir en la versión más reciente.`,
        },
      ],
      captura: {
        id: "notebooklm-que-es-y-como-usarlo-paso-3",
        alt: "Respuesta de NotebookLM con números de cita clicables y el fragmento original resaltado en el panel izquierdo",
        caption:
          "Haz clic en cada número de cita para comprobar en el texto original que la interpretación es fiel a la fuente.",
        ratio: "16/9",
      },
      verificaResultado:
        "Pincha al menos dos o tres citas clave de la respuesta generada por NotebookLM y confirma que el pasaje resaltado a la izquierda dice exactamente lo que el resumen afirma, especialmente en cifras, fechas y negaciones.",
    },
    {
      id: "resumenes-audio-guias",
      titulo: "4. Resúmenes de audio y guías de estudio",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera resúmenes de audio tipo pódcast en español y documentos de estudio desde el panel derecho.",
      parrafos: [
        "Una de las funciones más conocidas de NotebookLM son los Resúmenes de audio (Audio Overviews). A partir de las fuentes del cuaderno, la plataforma genera una conversación entre dos voces que sintetizan los puntos principales, ideal para repasar un informe extenso mientras vas en trayecto.",
        "Además del audio, el panel de estudio permite crear con un clic guías de estudio, preguntas frecuentes, cronologías y documentos de resumen que luego puedes guardar como notas dentro del mismo cuaderno.",
        "Ten presente que los Resúmenes de audio están pensados para comprensión y repaso rápido, no para reemplazar la lectura de cláusulas legales o números críticos. Si necesitas personalizar el enfoque del audio, utiliza la opción de instrucciones previas para indicar qué tema priorizar y a qué audiencia va dirigido.",
      ],
      codigos: [
        {
          titulo: "Prompt 3: Instrucción de enfoque para Resumen de audio o guía de estudio",
          lenguaje: "prompt",
          codigo: `Enfoca el resumen en los cambios operacionales y riesgos técnicos para un equipo de análisis de datos en Chile.
Evita introducciones largas, explica las siglas técnicas la primera vez que aparezcan y cierra con las 3 decisiones pendientes más urgentes.`,
        },
      ],
      captura: {
        id: "notebooklm-que-es-y-como-usarlo-paso-4",
        alt: "Panel de estudio de NotebookLM mostrando reproductor de Resumen de audio y opciones de guía de estudio",
        caption:
          "El panel de estudio genera Resúmenes de audio, preguntas frecuentes y guías estructuradas a partir de tus fuentes.",
        ratio: "16/9",
      },
      verificaResultado:
        "Escucha los primeros minutos del Resumen de audio o revisa la guía de estudio generada para confirmar que el tono, el idioma y los conceptos prioritarios coinciden con lo que pediste.",
    },
    {
      id: "usos-practicos-analistas",
      titulo: "5. Usos prácticos para analistas: informes, actas y diccionarios de datos",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica NotebookLM en tareas reales de análisis: consolidar actas de levantamiento, auditar diccionarios de tablas y estudiar documentación técnica.",
      parrafos: [
        "Más allá del estudio académico, NotebookLM encaja muy bien en el día a día de analistas de datos, consultores BI y equipos de operaciones. Cada vez que un proyecto arranca con diez documentos dispersos entre correos exportados, minutas de reunión y manuales del ERP, un cuaderno dedicado actúa como memoria técnica consultable.",
        "Por ejemplo, puedes subir el diccionario de datos de un sistema comercial junto con las actas de definición de KPIs y pedirle a NotebookLM que detecte qué métricas solicitadas por gerencia no tienen campo de respaldo en las tablas documentadas. También resulta muy práctico para preparar entrevistas o certificaciones técnicas cargando la documentación oficial en un cuaderno de estudio.",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Cruzar actas de negocio contra diccionario de datos",
          lenguaje: "prompt",
          codigo: `Cruza las actas de reunión cargadas contra el diccionario de datos técnico.
Identifica:
1. Cada KPI pedido por el área comercial.
2. La tabla y columna candidata según el diccionario.
3. KPIs que requieren un cálculo derivado o que no cuentan con un campo claro en las fuentes actuales.`,
        },
        {
          titulo: "Prompt 5: Generar glosario de negocio para equipo nuevo",
          lenguaje: "prompt",
          codigo: `Redacta un glosario con los 15 términos técnicos o siglas de negocio más repetidos en las fuentes del cuaderno.
Para cada término entrega: definición en máximo 2 líneas y en qué fuente aparece definido por primera vez.`,
        },
      ],
      captura: {
        id: "notebooklm-que-es-y-como-usarlo-paso-5",
        alt: "Cuaderno de NotebookLM cruzando un diccionario de datos con actas de levantamiento de KPIs",
        caption:
          "Cruza documentación técnica con actas de negocio para detectar brechas antes de empezar a modelar en SQL o Power BI.",
        ratio: "16/9",
      },
      verificaResultado:
        "Guarda las mejores tablas o síntesis como nota fijada dentro del cuaderno y valida con tu contraparte técnica cualquier brecha detectada antes de comprometer fechas de entrega.",
    },
    {
      id: "limites-y-privacidad",
      titulo: "6. Límites reales y privacidad según documentación oficial",
      esPasoHowTo: false,
      parrafos: [
        "Conocer los límites técnicos de NotebookLM evita chocar contra topes a mitad de un proyecto. Según la documentación oficial de soporte de Google (support.google.com, consultado el 21 de noviembre de 2026), en el nivel estándar gratuito cada cuaderno admite hasta 50 fuentes, mientras que planes superiores (como Pro o Enterprise) amplían esa capacidad.",
        "Asimismo, según el centro de ayuda oficial de Google (consultado el 21 de noviembre de 2026), cada fuente individual tiene un tope de hasta 500.000 palabras y un límite de tamaño de hasta 200 MB para archivos locales cargados (como PDF o audio). En cuanto a los Resúmenes de audio, las cuentas estándar gratuitas cuentan con un límite diario de hasta 3 generaciones por día, con cuotas mayores en planes de pago.",
        "Respecto a la privacidad, ten presente que NotebookLM no es una base de datos transaccional ni un reemplazo de Excel para procesar tablas de cientos de miles de filas numéricas. Úsalo para texto, documentación y síntesis cualitativa; para cálculos numéricos exactos sobre grandes volúmenes, trabaja en SQL, Python, Power BI o planillas.",
      ],
      lista: [
        "Límite estándar gratuito documentado: hasta 50 fuentes por cuaderno (planes pagos amplían el tope).",
        "Por fuente individual: hasta 500.000 palabras y hasta 200 MB en archivos locales.",
        "Resúmenes de audio: hasta 3 generaciones diarias en cuentas gratuitas estándar.",
        "No cargues archivos confidenciales en cuentas personales si tu empresa exige gobierno de datos bajo Google Workspace corporativo.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "NotebookLM no puede leer el texto de un PDF subido",
      causa:
        "El PDF está compuesto únicamente por imágenes escaneadas sin capa de texto (OCR).",
      solucion:
        "Pasa el documento por una herramienta de reconocimiento óptico (OCR) antes de cargarlo o copia el texto limpio en un Google Doc.",
    },
    {
      error: "Las respuestas mezclan información de dos proyectos distintos",
      causa:
        "Subiste documentos de áreas o clientes diferentes dentro del mismo cuaderno.",
      solucion:
        "Crea un cuaderno separado por proyecto o desmarca temporalmente en el panel izquierdo las fuentes que no correspondan a tu pregunta.",
    },
    {
      error: "Pedir cálculos matemáticos complejos sobre una planilla larga",
      causa:
        "Los modelos de lenguaje leen texto, no ejecutan motores tabulares SQL o Excel sobre miles de filas dentro de NotebookLM.",
      solucion:
        "Realiza las sumas, promedios y cruces en Excel, Sheets, SQL o Python, y sube a NotebookLM el informe resumen o la documentación.",
    },
    {
      error: "El Resumen de audio se genera en un tema secundario",
      causa:
        "Se inició la generación sin personalizar el enfoque ni desactivar fuentes accesorias.",
      solucion:
        "Desmarca fuentes secundarias antes de generar y escribe una instrucción breve indicando el objetivo y público del audio.",
    },
  ],
  plantilla: {
    titulo: "Estructura de cuaderno NotebookLM para proyectos de datos",
    descripcion:
      "Próximamente: guía descargable con nomenclatura de fuentes, checklist de OCR y batería de prompts para documentación BI.",
  },
  faqs: [
    {
      q: "¿NotebookLM es gratis en 2026?",
      a: "Sí, Google ofrece acceso gratuito a NotebookLM con cuenta de Google personal (sujeto a límites estándar como hasta 50 fuentes por cuaderno y hasta 3 resúmenes de audio diarios, según support.google.com consultado el 21 de noviembre de 2026), además de capacidades ampliadas en planes pagos y Google Workspace.",
    },
    {
      q: "¿Funciona NotebookLM en español?",
      a: "Sí. Puedes cargar fuentes en español, chatear y obtener citas en español, y generar guías de estudio o resúmenes de audio en español.",
    },
    {
      q: "¿NotebookLM inventa datos o busca en internet sin avisar?",
      a: "Su diseño prioriza responder anclado en las fuentes que cargaste en el cuaderno, mostrando citas numeradas clicables hacia el texto original. Aun así, siempre debes verificar las citas críticas.",
    },
    {
      q: "¿Qué diferencia hay entre subir un PDF a Gemini y subirlo a NotebookLM?",
      a: "Gemini está pensado como asistente general para tareas puntuales; NotebookLM organiza múltiples fuentes persistentes en un cuaderno con citas clicables exactas, notas fijadas y herramientas dedicadas como Resúmenes de audio y guías de estudio.",
    },
    {
      q: "¿Cuántas fuentes y qué tamaño máximo acepta por cuaderno?",
      a: "Según el centro de ayuda oficial de Google (consultado el 21 de noviembre de 2026), el nivel estándar admite hasta 50 fuentes por cuaderno, con hasta 500.000 palabras por fuente y hasta 200 MB por archivo local.",
    },
  ],
  relacionadas: [
    "ia-para-analizar-pdf",
    "gemini-para-analisis-de-datos",
    "automatizar-tareas-con-ia",
  ],
  enlacesExternos: [
    {
      label: "NotebookLM — Página oficial de Google",
      url: "https://notebooklm.google",
      fuente: "Google",
    },
    {
      label: "Centro de ayuda de NotebookLM",
      url: "https://support.google.com/notebooklm",
      fuente: "Google Support",
    },
    {
      label: "Centro de ayuda de Claude",
      url: "https://support.claude.com",
      fuente: "Anthropic Support",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende a trabajar con documentos y tablas en Claude con Projects y artefactos.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Compara las fortalezas de Claude y ChatGPT cuando necesitas analizar datos numéricos.",
    },
  ],
};

export default guia;
