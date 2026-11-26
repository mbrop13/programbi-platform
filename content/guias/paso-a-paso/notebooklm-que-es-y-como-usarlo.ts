import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

const ANUNCIO =
  "https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/";

export const guia: GuiaPasoAPaso = {
  slug: "notebooklm-que-es-y-como-usarlo",
  title: "NotebookLM (Gemini Notebook): qué es y cómo usarlo",
  meta: "Qué es NotebookLM, ahora Gemini Notebook: si es gratis, cómo entrar y cómo usarlo con tus PDF y Docs, con citas, audio y límites al día. Guía 2026.",
  h1: "Qué es NotebookLM (Gemini Notebook), cómo entrar y cómo usarlo",
  subtitle: `NotebookLM, que Google renombró Gemini Notebook en julio de 2026 ([anuncio oficial](${ANUNCIO})), es una herramienta gratis con tu cuenta de Google para preguntarle solo a tus propios documentos. Entra a [notebook.google](https://notebook.google), crea un cuaderno, sube un PDF o un Google Docs y pregunta: cada respuesta trae citas que te llevan al párrafo original.`,
  keywordPrincipal: "notebooklm",
  keywords: [
    "notebooklm",
    "NotebookLM qué es",
    "NotebookLM para qué sirve",
    "NotebookLM gratis",
    "NotebookLM en español",
    "Gemini Notebook",
  ],
  curso: "gemini",
  cursoSecundario: "ia-productividad",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-26",
  published: "2026-11-21",
  fuentesConsultadas: "2026-11-26",
  totalTimeIso: "PT20M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Google indica que no usa los datos de organizaciones ni de instituciones educativas para entrenar Gemini Notebook, y que en cuentas personales tampoco lo hace salvo que envíes comentarios. Aun así, antes de subir contratos, bases de licitación, actas internas o informes financieros, revisa si estás en una cuenta personal o en el Google Workspace de tu empresa, y no cargues RUT, sueldos con nombre ni fichas médicas sin autorización.",
  esquema: {
    titulo: "Así se ordena un cuaderno",
    paneles: [
      {
        nombre: "Fuentes",
        texto:
          "Tus PDF, Docs, Slides, páginas web, videos de YouTube, audios y texto pegado. Cada fuente tiene una casilla para incluirla o dejarla fuera de la pregunta.",
      },
      {
        nombre: "Chat",
        texto:
          "Le preguntas a tus fuentes. Cada respuesta trae citas numeradas: al tocarlas, se abre el pasaje exacto que la respalda.",
      },
      {
        nombre: "Estudio",
        texto:
          "Genera resúmenes en audio, guías de estudio y otros formatos a partir de las mismas fuentes, y guarda lo útil como nota.",
      },
    ],
  },
  en30Segundos: {
    queLogras:
      "Crear un cuaderno con tus propios documentos, preguntarle con citas que puedes revisar y sacar resúmenes en audio o guías de estudio sin salir del mismo lugar.",
    herramienta: "Gemini Notebook (NotebookLM)",
    tiempo: "20 minutos",
    bullets: [
      "Cuándo conviene NotebookLM y cuándo el chat general de Gemini.",
      "Cargar PDF, Docs, páginas web, videos o texto en un cuaderno.",
      "Revisar cada respuesta con sus citas antes de usarla.",
      "Usarlo para estudiar o para documentar un proyecto de datos.",
      "Qué cambió con Gemini Notebook y qué límites tiene gratis.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Qué es NotebookLM",
      resumen: "En qué se diferencia del chat de Gemini.",
      anchorId: "que-es-notebooklm-vs-gemini",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Crear y cargar",
      resumen: "Un cuaderno por tema, con tus fuentes.",
      anchorId: "crear-cuaderno-cargar-fuentes",
      icono: "file",
    },
    {
      numero: 3,
      titulo: "Preguntas con citas",
      resumen: "Pregunta y revisa cada cita.",
      anchorId: "preguntas-citas-verificables",
      icono: "check",
    },
    {
      numero: 4,
      titulo: "Audio y estudio",
      resumen: "Resúmenes en audio y guías de estudio.",
      anchorId: "resumenes-audio-guias",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Estudiar y trabajar",
      resumen: "Apuntes, informes, actas y diccionarios de datos.",
      anchorId: "usos-practicos-analistas",
      icono: "database",
    },
    {
      numero: 6,
      titulo: "Gemini Notebook",
      resumen: "Qué cambió en julio de 2026.",
      anchorId: "novedades-gemini-notebook",
      icono: "refresh",
    },
    {
      numero: 7,
      titulo: "Límites y privacidad",
      resumen: "Cuotas gratis y por plan.",
      anchorId: "limites-y-privacidad",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Navegador actualizado o la app móvil, con una cuenta de Google personal o de Workspace",
    lista: [
      "Una cuenta de Google (personal, de tu trabajo o de tu institución educativa).",
      "Entrar a notebook.google desde el navegador, o usar la app móvil de Gemini Notebook.",
      "Documentos con texto seleccionable: PDF, Google Docs o Slides, páginas web públicas o texto plano.",
    ],
    compatibilidadMacWeb:
      "En el navegador (Windows, macOS y Linux) y en la app móvil, sin instalar nada en el computador. La app móvil trae muchas de las funciones principales, no todas.",
    avisoEducativo:
      "Las cuotas, los planes y las funciones cambian con frecuencia y algunas dependen del país. Antes de decidir un plan, revisa la página de planes de notebook.google y el centro de ayuda de Gemini Notebook.",
  },
  herramientasHowTo: ["Gemini Notebook (NotebookLM)", "Navegador web"],
  insumosHowTo: ["Documentos PDF, Google Docs o enlaces de referencia"],
  secciones: [
    {
      id: "que-es-notebooklm-vs-gemini",
      titulo: "1. Qué es NotebookLM y en qué se diferencia de Gemini",
      esPasoHowTo: true,
      resumenHowTo:
        "Entiende por qué NotebookLM responde desde las fuentes que cargas, mientras el chat de Gemini funciona como asistente general.",
      parrafos: [
        "NotebookLM es el asistente de investigación de Google que responde a partir de los documentos que tú le entregas. Desde julio de 2026 se llama Gemini Notebook: Google aclara en su página oficial que es el mismo producto y que conservas todos tus cuadernos. En esta guía usamos los dos nombres, porque la mayoría lo sigue buscando como NotebookLM.",
        "Su idea central es responder desde tus fuentes. En vez de contestar con lo que el modelo sabe de internet, cada respuesta se arma con lo que subiste al cuaderno y te muestra de dónde sacó cada afirmación.",
        "Por eso se confunde con Gemini: los dos son de Google y usan modelos Gemini por debajo, pero cumplen roles distintos. Para una lluvia de ideas, un correo desde cero o una duda de programación sin documentos, el chat de Gemini es lo natural. Cuando tienes quince PDF de normativa, tres manuales técnicos y seis actas, y necesitas saber en qué página está cada regla sin que la herramienta invente, NotebookLM baja mucho el riesgo de respuestas inventadas. Si quieres dominar Gemini junto a Google Workspace en tu trabajo diario, puedes verlo en nuestro [curso de Gemini en vivo](/cursos/gemini).",
      ],
      tabla: {
        caption:
          "Comparación según la documentación oficial de Google. «Gemini» se refiere al chat general de la app Gemini.",
        encabezados: ["Criterio", "NotebookLM (Gemini Notebook)", "Chat de Gemini"],
        filas: [
          [
            "De dónde responde",
            "De las fuentes que cargas en cada cuaderno.",
            "Del conocimiento del modelo, búsquedas web y archivos sueltos.",
          ],
          [
            "Cómo compruebas la respuesta",
            "Citas numeradas que abren el pasaje exacto de tu documento.",
            "Enlaces a la web cuando busca en línea.",
          ],
          [
            "Cómo se organiza",
            "Cuadernos que quedan guardados, con sus fuentes, chat y notas.",
            "Conversaciones por tarea.",
          ],
          [
            "Qué genera",
            "Resúmenes en audio, guías de estudio y otros formatos desde tus fuentes.",
            "Texto, código, borradores y acciones en apps de Workspace.",
          ],
          [
            "Ideal para",
            "Estudiar, cruzar informes largos y documentar proyectos.",
            "Ideas, redacción rápida y dudas generales.",
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
        "Entra a notebook.google, crea un cuaderno nuevo y agrega tus documentos, manteniendo un solo tema por cuaderno.",
      parrafos: [
        "Entra a notebook.google con tu cuenta de Google (la dirección antigua, notebooklm.google, te redirige ahí) y crea un cuaderno nuevo. La costumbre que más ayuda desde el primer minuto es usar un cuaderno por proyecto o materia: si mezclas apuntes de SQL, un contrato de arriendo y políticas de recursos humanos, las respuestas pierden foco.",
        "En un mismo cuaderno puedes juntar distintos tipos de fuente: archivos PDF, Google Docs, Slides y Sheets, documentos de Word, archivos de texto o Markdown, páginas web públicas, videos de YouTube, audios y texto pegado a mano.",
        "Cada fuente queda listada en el panel de Fuentes con una casilla. Ese detalle sirve mucho: puedes desmarcar fuentes para que una pregunta consulte solo dos documentos y no el cuaderno entero.",
      ],
      lista: [
        "Revisa que tus PDF tengan texto seleccionable. Si son escaneos sin OCR, la lectura puede fallar o quedar incompleta.",
        "Cambia el nombre de las fuentes si subiste archivos como «Documento_final_v3.pdf»: las citas se leen mejor.",
        "Desmarca las fuentes que sobran cuando quieras comparar dos documentos sin ruido del resto.",
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
        "Haz preguntas concretas, pide un formato estructurado y revisa cada número de cita antes de usar la respuesta.",
      parrafos: [
        "Con tus fuentes marcadas, el chat te deja preguntarle al cuaderno completo. La regla de oro es preguntar algo concreto que obligue a contrastar documentos o a listar condiciones exactas, y pedir explícitamente que diga cuando un dato no está en las fuentes.",
        "Cada afirmación importante de la respuesta lleva un número de cita. Al tocarlo, se abre el pasaje original que la respalda. Revisarlo toma tres segundos y es la diferencia entre confiar a ciegas en un resumen y trabajar con rigor. Google advierte en su ayuda que las citas no siempre aparecen, así que si una respuesta llega sin ellas, pide que las agregue o vuelve a preguntar más acotado.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Extraer requisitos o cláusulas con respaldo literal",
          lenguaje: "prompt",
          codigo: `Basándote solo en las fuentes seleccionadas, lista todos los requisitos de entrega, plazos y multas que se mencionan.
Formato: tabla con columnas [Tema | Detalle exacto | Documento y sección].
Si alguno de estos puntos no aparece en las fuentes, escribe "No especificado en las fuentes".`,
        },
        {
          titulo: "Prompt 2: Comparar dos versiones de un informe",
          lenguaje: "prompt",
          codigo: `Compara la fuente 1 y la fuente 2 en las definiciones de KPI y las metas trimestrales.
Enumera:
1. Definiciones que coinciden exactamente.
2. Diferencias de criterio o de cifras entre los dos documentos.
3. Puntos que quedaron ambiguos o sin definir en la versión más reciente.`,
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
        "Abre al menos dos o tres citas clave de la respuesta y confirma que el pasaje dice exactamente lo que afirma el resumen, sobre todo en cifras, fechas y negaciones («no aplica», «salvo que»).",
    },
    {
      id: "resumenes-audio-guias",
      titulo: "4. Resúmenes en audio y guías de estudio",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera resúmenes en audio en español y guías de estudio desde el panel de Estudio, indicando el enfoque que necesitas.",
      parrafos: [
        "La función más conocida de NotebookLM son los resúmenes en audio: a partir de las fuentes del cuaderno, arma una conversación entre dos voces que repasa los puntos principales. Sirve para repasar un informe largo mientras vas en micro o en metro. Google los describe hoy como interactivos: puedes intervenir con preguntas mientras escuchas.",
        "Desde el mismo panel de Estudio puedes crear guías de estudio, preguntas frecuentes y otros formatos (la página de planes menciona también diapositivas), y guardarlos como notas dentro del cuaderno.",
        "Ten presente que el audio está pensado para entender y repasar, no para reemplazar la lectura de una cláusula legal o de una cifra crítica. Antes de generarlo, escribe una instrucción corta con el tema a priorizar y para quién es.",
      ],
      codigos: [
        {
          titulo: "Prompt 3: Enfoque para un resumen en audio o una guía de estudio",
          lenguaje: "prompt",
          codigo: `Enfoca el resumen en los cambios operativos y los riesgos técnicos para un equipo de análisis de datos en Chile.
Evita introducciones largas, explica cada sigla la primera vez que aparezca y cierra con las 3 decisiones pendientes más urgentes.`,
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
        "Escucha los primeros minutos del audio o revisa la guía generada y confirma que el idioma, el tono y los temas que pediste son los que aparecen. Si no, desmarca las fuentes secundarias y vuelve a generarlo.",
    },
    {
      id: "usos-practicos-analistas",
      titulo: "5. Para estudiar y para trabajar con datos: apuntes, informes, actas y diccionarios",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa un cuaderno para estudiar con tus apuntes o para documentar un proyecto: consolidar actas, revisar diccionarios de datos y preparar certificaciones.",
      parrafos: [
        "Si estudias, crea un cuaderno por ramo y sube tus apuntes, las lecturas del curso y las guías de ejercicios. Pídele una guía de estudio, preguntas de práctica con sus respuestas citadas o una explicación más simple de un concepto que no te quedó claro. Como responde solo desde tus materiales, no se va a desviar a temas que tu profesor no pasó.",
        "En el trabajo encaja muy bien con analistas de datos, consultores BI y equipos de operaciones. Cuando un proyecto parte con diez documentos dispersos entre correos, minutas y manuales del ERP, un cuaderno dedicado funciona como memoria técnica a la que le puedes preguntar.",
        "Por ejemplo, puedes subir el diccionario de datos de un sistema comercial junto con las actas donde se definieron los KPI, y pedirle que detecte qué métricas pidió gerencia que no tienen un campo que las respalde. Y si quieres hacer el recorrido completo, desde levantar las métricas hasta modelarlas y mostrarlas en un tablero, te sirve nuestro [curso de análisis de datos](/cursos/analisis-de-datos).",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Guía de estudio con preguntas de práctica",
          lenguaje: "prompt",
          codigo: `Con los apuntes y lecturas de este cuaderno, arma una guía de estudio para la prueba.
Incluye:
1. Los 8 conceptos más importantes, cada uno explicado en 2 o 3 líneas.
2. 10 preguntas de práctica con su respuesta y la fuente donde aparece.
3. Los temas que se repiten en más de una fuente.`,
        },
        {
          titulo: "Prompt 5: Cruzar actas de negocio con el diccionario de datos",
          lenguaje: "prompt",
          codigo: `Cruza las actas de reunión con el diccionario de datos técnico.
Identifica:
1. Cada KPI que pidió el área comercial.
2. La tabla y la columna candidatas según el diccionario.
3. Los KPI que requieren un cálculo derivado o que no tienen un campo claro en las fuentes.`,
        },
        {
          titulo: "Prompt 6: Glosario de negocio para quien recién llega al equipo",
          lenguaje: "prompt",
          codigo: `Redacta un glosario con los 15 términos técnicos o siglas de negocio que más se repiten en las fuentes del cuaderno.
Para cada término: una definición de máximo 2 líneas y la fuente donde aparece definido por primera vez.`,
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
        "Guarda las mejores tablas como nota dentro del cuaderno y valida con tu contraparte técnica cualquier brecha que detecte antes de comprometer fechas.",
    },
    {
      id: "novedades-gemini-notebook",
      titulo: "6. Qué cambió con Gemini Notebook (julio de 2026)",
      esPasoHowTo: false,
      parrafos: [
        `El 16 de julio de 2026 Google anunció el cambio de nombre y tres novedades ([anuncio oficial](${ANUNCIO})). La primera es el nombre: NotebookLM pasa a llamarse Gemini Notebook, sigue siendo un producto independiente y tus cuadernos se mantienen.`,
        "La segunda es la más importante si trabajas con datos: cada cuaderno incorpora un computador seguro en la nube que puede escribir y ejecutar código para analizar datos a partir de tus fuentes. Según el anuncio, partió para quienes tienen Google AI Ultra y para clientes de Workspace con acceso a AI Ultra o AI Expanded, y se iba a extender a los usuarios Pro en la web durante las semanas siguientes. Si no lo ves en tu cuenta, depende de tu plan.",
        "La tercera es que los cuadernos se sincronizan con la app de Gemini, donde ya puedes abrirlos y crearlos, y Google anunció que también llegarán al Modo IA del buscador.",
      ],
      lista: [
        "Mismo producto y mismos cuadernos, con nombre nuevo.",
        "Análisis de datos con código dentro del cuaderno, según tu plan.",
        "Cuadernos sincronizados con la app de Gemini.",
      ],
      alerta: {
        tipo: "info",
        titulo: "¿Reemplaza a Excel o Power BI?",
        texto:
          "No. Ejecutar código sobre tus fuentes ayuda a explorar y responder preguntas rápidas, pero el modelo de datos, las actualizaciones automáticas y los tableros que se comparten con un equipo siguen viviendo en SQL, Power BI o una planilla bien armada.",
      },
    },
    {
      id: "limites-y-privacidad",
      titulo: "7. Límites y privacidad según la documentación oficial",
      esPasoHowTo: false,
      parrafos: [
        "Conocer los topes evita quedarse corto a mitad de un proyecto. Según el centro de ayuda de Gemini Notebook, con la versión gratis tienes 100 cuadernos, cada uno con hasta 50 fuentes y 500.000 palabras, y un límite diario de 50 consultas de chat y 3 resúmenes en audio. Cada fuente admite hasta 500.000 palabras o 200 MB si la subes desde tu equipo, sin límite de páginas.",
        "Los planes de pago suben esos topes: con Google AI Plus llegas a 100 fuentes por cuaderno, con AI Pro a 300 y con AI Ultra a 600, además de límites de uso más altos. Google aclara que estos planes solo están disponibles en algunos países, y las organizaciones lo contratan a través de Google Workspace, Gemini Enterprise o Workspace for Education.",
        "Sobre la privacidad, Google indica que no usa los datos de organizaciones ni de instituciones educativas para entrenar el modelo, y que en cuentas personales tampoco lo hace salvo que envíes comentarios. Aun así, revisa siempre qué cuenta estás usando antes de subir un documento confidencial.",
      ],
      tabla: {
        caption:
          "Fuentes por cuaderno según la página de planes de notebook.google. Los demás límites de uso escalan con cada plan.",
        encabezados: ["Plan", "Fuentes por cuaderno", "Uso respecto del plan gratis"],
        filas: [
          ["Gratis", "Hasta 50", "Límites estándar"],
          ["Google AI Plus", "Hasta 100", "El doble"],
          ["Google AI Pro", "Hasta 300", "Cuatro veces más"],
          ["Google AI Ultra", "Hasta 600", "De 5 a 20 veces más que Pro"],
        ],
      },
      lista: [
        "Gratis: 100 cuadernos, 50 fuentes por cuaderno, 50 consultas y 3 audios al día.",
        "Por fuente: hasta 500.000 palabras o 200 MB en archivos locales.",
        "No subas archivos confidenciales a una cuenta personal si tu empresa trabaja con Google Workspace.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "No puede leer el texto de un PDF que subiste",
      causa: "El PDF son solo imágenes escaneadas, sin una capa de texto (OCR).",
      solucion:
        "Pásalo por una herramienta de OCR antes de subirlo, o copia el texto limpio en un Google Docs y sube ese documento.",
    },
    {
      error: "Las respuestas mezclan información de dos proyectos",
      causa: "Subiste documentos de áreas o clientes distintos al mismo cuaderno.",
      solucion:
        "Crea un cuaderno por proyecto, o desmarca en el panel de Fuentes los documentos que no corresponden a tu pregunta.",
    },
    {
      error: "Le pides cálculos sobre una planilla larga y los números no cuadran",
      causa:
        "Sin la función de ejecutar código (que depende de tu plan), el modelo lee la planilla como texto y no calcula fila por fila.",
      solucion:
        "Haz las sumas, promedios y cruces en Excel, Sheets, SQL o Python y sube el resultado. Si tu plan ya incluye el análisis con código, pide que muestre el código que usó y revisa el resultado contra la planilla.",
    },
    {
      error: "El resumen en audio se va por un tema secundario",
      causa: "Se generó sin instrucciones y con todas las fuentes marcadas.",
      solucion:
        "Desmarca las fuentes secundarias y escribe una instrucción breve con el objetivo y el público antes de generarlo.",
    },
  ],
  plantilla: {
    titulo: "Estructura de cuaderno NotebookLM para proyectos de datos",
    descripcion:
      "Nomenclatura de fuentes, checklist de OCR y batería de prompts para documentación BI.",
  },
  faqs: [
    {
      q: "¿NotebookLM es gratis en 2026?",
      a: "Sí. Con una cuenta de Google tienes la versión gratis: 100 cuadernos con hasta 50 fuentes cada uno, 50 consultas de chat y 3 resúmenes en audio al día, según el centro de ayuda de Gemini Notebook. Los planes Google AI Plus, Pro y Ultra suben esos límites.",
    },
    {
      q: "¿NotebookLM ahora se llama Gemini Notebook?",
      a: "Sí. En julio de 2026 Google renombró NotebookLM como Gemini Notebook. Es el mismo producto y mantienes todos tus cuadernos. La dirección nueva es notebook.google y la antigua, notebooklm.google, redirige ahí.",
    },
    {
      q: "¿Cómo entro a NotebookLM?",
      a: "Entra a notebook.google con tu cuenta de Google (personal, de trabajo o de tu institución), crea un cuaderno y sube un PDF, un Google Docs u otra fuente. También puedes usar la app móvil de Gemini Notebook o abrir tus cuadernos desde la app de Gemini.",
    },
    {
      q: "¿Funciona en español?",
      a: "Sí. Puedes subir fuentes en español, conversar y recibir citas en español, y generar guías de estudio y resúmenes en audio en español.",
    },
    {
      q: "¿NotebookLM inventa datos o busca en internet sin avisar?",
      a: "Está pensado para responder desde las fuentes de tu cuaderno y mostrar citas que llevan al texto original, lo que reduce mucho las respuestas inventadas. Aun así, revisa las citas de cualquier dato crítico; Google advierte que las citas no siempre aparecen.",
    },
    {
      q: "¿Qué diferencia hay entre subir un PDF al chat de Gemini y subirlo a NotebookLM?",
      a: "El chat de Gemini es un asistente general para tareas puntuales. NotebookLM guarda tus fuentes en un cuaderno que puedes retomar, responde con citas que abren el pasaje exacto y suma notas, resúmenes en audio y guías de estudio sobre esos mismos documentos.",
    },
    {
      q: "¿Cuántas fuentes y qué tamaño acepta por cuaderno?",
      a: "Gratis, hasta 50 fuentes por cuaderno; con Google AI Plus 100, con AI Pro 300 y con AI Ultra 600. Cada fuente admite hasta 500.000 palabras o 200 MB si la subes desde tu equipo.",
    },
  ],
  relacionadas: [
    "ia-para-analizar-pdf",
    "gemini-para-analisis-de-datos",
    "chatgpt-vs-gemini-vs-copilot",
  ],
  enlacesExternos: [
    {
      label: "Gemini Notebook, página oficial",
      url: "https://notebook.google",
      fuente: "Google",
    },
    {
      label: "Planes y límites por plan",
      url: "https://notebook.google/plans",
      fuente: "Google",
    },
    {
      label: "Centro de ayuda de Gemini Notebook: preguntas frecuentes y límites",
      url: "https://support.google.com/gemininotebook/answer/16269187?hl=es",
      fuente: "Google Support",
    },
    {
      label: "NotebookLM is now Gemini Notebook (anuncio oficial)",
      url: ANUNCIO,
      fuente: "Google Blog",
    },
  ],
  enlacesInternosExtra: [],
};

export default guia;
