import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "gemini-en-google-sheets",
  title: "Gemini en Google Sheets: cómo activarlo y usarlo paso a paso",
  meta: "Activa y usa Gemini en Google Sheets: generar tablas, fórmulas, resúmenes y la función de IA en celdas. Requisitos, límites y ejemplos prácticos.",
  h1: "Cómo usar Gemini en Google Sheets",
  subtitle:
    "Aprende qué requisitos exige Google para activar el panel lateral de Gemini en Sheets, cómo generar tablas y fórmulas con prompts, usar la función =AI() en celdas y combinarla con QUERY, FILTER y ARRAYFORMULA.",
  keywordPrincipal: "gemini en google sheets",
  keywords: [
    "gemini en google sheets",
    "activar Gemini en Sheets",
    "usar Gemini en Sheets",
    "Gemini en Google Sheets gratis",
  ],
  curso: "gemini",
  cursoSecundario: "excel",
  herramienta: "Google Sheets",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Al usar Gemini dentro de Google Sheets (panel lateral o función de IA en celdas), el contenido del rango seleccionado o referenciado se procesa mediante los servicios de IA de Google según los términos de tu cuenta (Google Workspace empresarial o cuenta personal). Evita incluir columnas con RUT, datos bancarios, teléfonos privados o sueldos nominativos cuando no cuentes con autorización corporativa.",
  en30Segundos: {
    queLogras:
      "Activar el panel lateral de Gemini en Google Sheets, crear tablas y gráficos con lenguaje natural, aplicar la función =AI() en celdas y combinar resultados con fórmulas nativas como QUERY y FILTER.",
    herramienta: "Google Sheets + Gemini",
    tiempo: "25 minutos",
    bullets: [
      "Verificar si tu cuenta de Google Workspace o Google One AI incluye Gemini integrado en Sheets.",
      "Abrir el panel lateral desde el ícono Ask Gemini para estructurar tablas y crear fórmulas.",
      "Entender cómo funciona la función =AI() en celdas y su disponibilidad gradual según idioma y plan.",
      "Combinar automatización con fórmulas reales de Sheets (QUERY, FILTER, ARRAYFORMULA).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Requisitos reales",
      resumen: "Valida licencia Workspace o Google One AI y permisos.",
      anchorId: "requisitos-gemini-sheets",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Activar panel lateral",
      resumen: "Abre Ask Gemini en la esquina superior derecha de Sheets.",
      anchorId: "activar-panel-lateral",
      icono: "sparkles",
    },
    {
      numero: 3,
      titulo: "Tablas y fórmulas",
      resumen: "Genera estructuras, formatos y fórmulas desde prompts.",
      anchorId: "crear-tablas-formulas-prompts",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Función =AI()",
      resumen: "Clasifica y resume texto directo dentro de las celdas.",
      anchorId: "funcion-ia-en-celdas",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "QUERY y gráficos",
      resumen: "Combina análisis de Gemini con fórmulas nativas de Sheets.",
      anchorId: "analizar-datos-query-filter",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Sheets vs Excel IA",
      resumen: "Compara flujos de trabajo y límites entre ambas suites.",
      anchorId: "sheets-gemini-vs-excel-ia",
      icono: "layers",
    },
  ],
  requisitos: {
    version: "Google Sheets web actualizado y plan elegible con Gemini",
    lista: [
      "Cuenta de Google Workspace con acceso a Gemini (por ejemplo, planes Business o Enterprise habilitados por el administrador) o suscripción elegible de Google One AI.",
      "Navegador web actualizado en escritorio (Chrome, Edge, Safari o Firefox).",
      "Planilla de prueba con datos limpios en formato tabular.",
    ],
    compatibilidadMacWeb:
      "Google Sheets con Gemini opera 100% en navegador web, por lo que funciona igual en Windows, macOS, Linux y Chromebook sin diferencias de instalación.",
    avisoEducativo:
      "La disponibilidad de botones, idiomas soportados y funciones como =AI() se despliega de forma gradual según región, idioma de la cuenta y configuración de administrador.",
  },
  herramientasHowTo: ["Google Sheets", "Gemini en Google Workspace"],
  insumosHowTo: ["Cuenta elegible de Google", "Hoja de cálculo de prueba"],
  secciones: [
    {
      id: "requisitos-gemini-sheets",
      titulo: "1. Requisitos para tener Gemini en Google Sheets",
      esPasoHowTo: true,
      resumenHowTo:
        "Confirma que tu cuenta pertenece a un plan elegible de Google Workspace o Google One AI y que las funciones inteligentes estén habilitadas.",
      parrafos: [
        "Una duda muy frecuente entre usuarios en Chile es por qué no aparece el ícono de Gemini al abrir Google Sheets con una cuenta @gmail.com gratuita común. Según la documentación oficial de Google (support.google.com, consultado el 21 de noviembre de 2026), el panel lateral integrado de Gemini y la función de IA dentro de las celdas requieren un plan elegible de Google Workspace (como Business Standard/Plus o Enterprise) o una suscripción compatible de Google One AI (o estar inscrito en Workspace Labs/Experiments según disponibilidad).",
        "Si trabajas con una cuenta corporativa de Google Workspace y aun así no ves el ícono de estrella en la esquina superior derecha, es probable que el administrador de TI de tu empresa tenga desactivadas las funciones de Gemini para Workspace en la consola de administración, o que la hoja esté abierta en modo solo lectura.",
        "Si utilizas una cuenta gratuita sin ese complemento nativo, igual puedes aprovechar Gemini abriendo la versión web de Gemini en otra pestaña para pedir fórmulas de Sheets (QUERY, FILTER, REGEXEXTRACT) y pegarlas en tu planilla, aunque sin la edición directa desde el panel lateral.",
      ],
      lista: [
        "Verifica arriba a la derecha en Google Sheets si aparece el ícono de estrella (Ask Gemini).",
        "En cuentas corporativas, confirma con tu administrador de Google Workspace que Gemini para Sheets está activo para tu unidad organizativa.",
        "Asegúrate de tener permisos de editor sobre el archivo; en hojas compartidas solo como lector el panel de edición no puede insertar tablas.",
      ],
      captura: {
        id: "gemini-en-google-sheets-paso-1",
        alt: "Barra superior de Google Sheets mostrando el ícono de estrella de Gemini junto a los controles de compartir",
        caption:
          "El ícono de estrella en la esquina superior derecha confirma que tu cuenta tiene Gemini integrado en Google Sheets.",
        ratio: "16/9",
      },
    },
    {
      id: "activar-panel-lateral",
      titulo: "2. Activar y usar el panel lateral de Gemini en Sheets",
      esPasoHowTo: true,
      resumenHowTo:
        "Abre el panel Ask Gemini desde la barra superior y dale contexto seleccionando el rango de trabajo.",
      parrafos: [
        "Para activar el asistente dentro de tu hoja de cálculo, haz clic en el botón Ask Gemini (ícono de destello/estrella) ubicado en la esquina superior derecha de Google Sheets, al costado del botón Compartir. Se desplegará un panel lateral derecho persistente que convive con tus celdas sin tapar la tabla principal.",
        "Según la guía oficial de Google para colaborar con Gemini en Sheets (support.google.com, consultado el 21 de noviembre de 2026), el panel lateral puede leer el contexto de la hoja abierta e incluso resumir o referenciar información de archivos vinculados en tu Google Drive o correos de Gmail cuando lo mencionas explícitamente.",
        "Un hábito clave antes de escribir cualquier instrucción es seleccionar el rango exacto de celdas que te interesa analizar (por ejemplo A1:E45) o asegurarte de que la pestaña activa sea la correcta. Así evitas que Gemini trabaje sobre otra hoja del mismo libro.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Diagnosticar estructura de la hoja abierta",
          lenguaje: "prompt",
          codigo: `Revisa la tabla en la hoja actual (rango A1:E45).
Indícame en un resumen breve:
1. Qué columnas detectas y qué tipo de dato contiene cada una.
2. Si existen valores faltantes o formatos inconsistentes en fechas o montos.
3. Qué 3 análisis o tablas resumen serían más útiles para gerencia.`,
        },
      ],
      captura: {
        id: "gemini-en-google-sheets-paso-2",
        alt: "Panel lateral Ask Gemini abierto a la derecha de una planilla de ventas en Google Sheets",
        caption:
          "El panel lateral analiza la hoja activa y te propone acciones directas o resúmenes sobre el rango seleccionado.",
        ratio: "16/9",
      },
      verificaResultado:
        "Comprueba que Gemini enumera exactamente los encabezados de tu fila 1 y no confunde columnas vacías a la derecha como parte de la tabla.",
    },
    {
      id: "crear-tablas-formulas-prompts",
      titulo: "3. Crear tablas y fórmulas con prompts claros",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa el panel lateral para armar estructuras de seguimiento nuevas, aplicar formato condicional o solicitar fórmulas complejas.",
      parrafos: [
        "El panel de Gemini resulta especialmente útil en dos escenarios cotidianos: cuando partes desde una hoja en blanco y necesitas estructurar rápidamente una tabla de control (por ejemplo, seguimiento de proyectos, inventario o calendario editorial), y cuando necesitas redactar una fórmula compleja sin recordar la sintaxis exacta.",
        "Cuando le pidas crear una tabla desde el panel lateral, Gemini te mostrará una vista previa del resultado con el botón Insertar. Revisa siempre esa vista previa antes de insertarla para no sobrescribir celdas que ya contenían datos.",
        "Cuando le pidas una fórmula, especifica si tu hoja utiliza punto y coma (;) o coma (,) según la configuración regional de tu archivo (en Chile suele usarse punto y coma bajo configuración regional español/Chile) y menciona exactamente las letras de las columnas.",
      ],
      codigos: [
        {
          titulo: "Prompt 2: Generar plantilla de control de proyectos",
          lenguaje: "prompt",
          codigo: `Crea una tabla de seguimiento de proyectos de análisis de datos con las columnas:
ID, Proyecto, Área solicitante, Responsable, Fecha inicio, Fecha entrega, Estado (Por iniciar, En curso, En revisión, Cerrado) y Horas estimadas.
Incluye 4 filas de ejemplo ficticias y listas desplegables para la columna Estado.`,
        },
        {
          titulo: "Prompt 3: Solicitar fórmula sin errores de configuración regional",
          lenguaje: "prompt",
          codigo: `En esta hoja tengo Fecha en columna A, Sucursal en columna B y VentaCLP en columna D (filas 2 a 500).
Necesito una fórmula para Google Sheets que sume VentaCLP únicamente para la sucursal escrita en G2 y durante el mes y año indicados en H2 (fecha del primer día del mes).
Entrégame la fórmula lista para copiar y explícame qué hace cada argumento.`,
        },
      ],
      captura: {
        id: "gemini-en-google-sheets-paso-3",
        alt: "Vista previa de tabla generada por Gemini en el panel lateral lista para insertar en Google Sheets",
        caption:
          "Revisa siempre la vista previa propuesta por Gemini antes de pulsar Insertar sobre tus celdas.",
        ratio: "16/9",
      },
      verificaResultado:
        "Después de insertar la tabla o fórmula, verifica que los rangos no tengan errores #ERROR! ni #REF! y prueba cambiar un valor de filtro (como G2) para confirmar que el cálculo reacciona al instante.",
    },
    {
      id: "funcion-ia-en-celdas",
      titulo: "4. La función =AI() en celdas de Google Sheets",
      esPasoHowTo: true,
      resumenHowTo:
        "Entiende cómo funciona la fórmula =AI() para clasificar, resumir o redactar texto por fila, y su disponibilidad documentada.",
      parrafos: [
        "Además del panel conversacional, Google documenta en su centro de ayuda oficial (Use the AI function in Google Sheets, support.google.com, consultado el 21 de noviembre de 2026) la función nativa =AI(), pensada para ejecutar instrucciones de lenguaje natural directamente dentro de una celda como cualquier otra fórmula.",
        "Su propósito no es reemplazar a SUMA o BUSCARX en cálculos matemáticos exactos, sino resolver tareas de texto fila por fila: categorizar comentarios de clientes, detectar sentimiento (positivo, neutro, negativo), resumir notas largas de reuniones o estandarizar descripciones heterogéneas.",
        "Ten muy presente la disponibilidad gradual documentada por Google: su despliegue depende de contar con un plan elegible de Google Workspace o Google AI, y ciertas capacidades o ejemplos oficiales se han habilitado inicialmente en inglés o de forma progresiva por región e idioma. Además, tras arrastrar una fórmula =AI(), debes tener en cuenta cómo se actualizan o regeneran las celdas para no consumir cuota innecesaria ni alterar respuestas ya revisadas.",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Clasificar comentarios de clientes usando contexto de celda",
          lenguaje: "prompt",
          codigo: `Quiero clasificar 40 comentarios de encuesta ubicados en A2:A41 en una de estas 4 categorías exactas: "Precio", "Despacho", "Calidad" o "Atención".
Si tengo habilitada la función =AI() en mi hoja, indícame la sintaxis exacta para la celda B2 referenciando A2, y si no está disponible en mi cuenta aún, dime cómo hacerlo desde el panel lateral.`,
        },
      ],
      captura: {
        id: "gemini-en-google-sheets-paso-4",
        alt: "Hoja de Google Sheets mostrando clasificación de comentarios de clientes mediante inteligencia artificial en columna adyacente",
        caption:
          "Usa =AI() o el panel lateral para tareas de clasificación y síntesis de texto, nunca para aritmética financiera.",
        ratio: "16/9",
      },
      verificaResultado:
        "Revisa manualmente una muestra aleatoria de al menos 10 filas clasificadas y confirma que todas las etiquetas coinciden estrictamente con las categorías permitidas antes de construir gráficos sobre ellas.",
    },
    {
      id: "analizar-datos-query-filter",
      titulo: "5. Analizar datos y generar gráficos con QUERY, FILTER y ARRAYFORMULA",
      esPasoHowTo: true,
      resumenHowTo:
        "Combina la velocidad de Gemini para redactar prompts con la precisión determinística de las funciones nativas de Google Sheets.",
      parrafos: [
        "Cuando pasas de prototipar a mantener un reporte mensual que gerencia revisa todos los lunes, la mejor arquitectura en Google Sheets combina el apoyo de Gemini para diseñar la lógica con fórmulas nativas determinísticas que no dependen de cuotas de IA ni cambian de redacción al recalcular.",
        "Las tres funciones estrella de Google Sheets que conviene pedirle a Gemini (y verificar luego en tu hoja) son QUERY (para agrupar y resumir con sintaxis tipo SQL), FILTER (para extraer dinámicamente filas que cumplen múltiples criterios) y ARRAYFORMULA (para propagar cálculos por toda una columna sin arrastrar manualmente).",
        "También puedes pedirle al panel lateral de Gemini que genere un gráfico nativo de barras o líneas a partir de la tabla resumida por QUERY, manteniendo el gráfico conectado en vivo a tus celdas.",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Pedir una fórmula QUERY para resumir ventas por región",
          lenguaje: "prompt",
          codigo: `En la hoja "Base" tengo columnas A (Fecha), B (Region), C (Categoria) y D (MontoCLP) desde A1:D500.
Escribe una fórmula QUERY de Google Sheets que agrupe por Region, sume MontoCLP y ordene de mayor a menor venta, excluyendo filas donde Region esté vacío.`,
        },
        {
          titulo: "Fórmulas verificadas de Google Sheets (QUERY, FILTER y ARRAYFORMULA)",
          lenguaje: "sheets",
          codigo: `=QUERY(Base!A1:D500; "SELECT B, SUM(D) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(D) DESC LABEL SUM(D) 'Venta Total CLP'"; 1)

=FILTER(Base!A2:D500; (Base!B2:B500="Metropolitana") * (Base!D2:D500>100000))

=ARRAYFORMULA(SI(A2:A=""; ""; D2:D * 1,19))`,
          codigoEn: `=QUERY(Base!A1:D500, "SELECT B, SUM(D) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(D) DESC LABEL SUM(D) 'Venta Total CLP'", 1)

=FILTER(Base!A2:D500, (Base!B2:B500="Metropolitana") * (Base!D2:D500>100000))

=ARRAYFORMULA(IF(A2:A="", "", D2:D * 1.19))`,
          nota: "Usa ; en configuración regional de Chile/España y , si tu hoja de Google Sheets está configurada en inglés (Estados Unidos).",
        },
      ],
      captura: {
        id: "gemini-en-google-sheets-paso-5",
        alt: "Tabla resumen generada con fórmula QUERY en Google Sheets junto a un gráfico de barras creado desde el panel de Gemini",
        caption:
          "Respalda tus reportes recurrentes con QUERY y FILTER para garantizar resultados 100% reproducibles.",
        ratio: "16/9",
      },
      verificaResultado:
        "Comprueba que el total de la columna sumada en QUERY coincide exactamente con =SUMA(Base!D2:D500) (o =SUM en inglés) para asegurar que no se excluyeron filas válidas.",
    },
    {
      id: "sheets-gemini-vs-excel-ia",
      titulo: "6. Google Sheets con Gemini vs Excel con IA",
      esPasoHowTo: false,
      parrafos: [
        "Si tu organización todavía está evaluando si estandarizar sus reportes livianos en Google Sheets con Gemini o en Microsoft Excel con Copilot y Python, conviene comparar dónde brilla cada plataforma según el volumen de datos y el flujo de colaboración.",
        "Google Sheets destaca por la colaboración simultánea en navegador, la integración nativa con Gmail/Drive desde el panel lateral y funciones exclusivas como QUERY y =AI(). Excel, por su parte, sigue siendo superior cuando trabajas con cientos de miles de filas, modelos relacionales complejos en Power Query / Power Pivot o libros financieros pesados en escritorio.",
      ],
      tabla: {
        caption: "Comparativa práctica entre Google Sheets con Gemini y Microsoft Excel con IA",
        encabezados: [
          "Aspecto",
          "Google Sheets + Gemini",
          "Microsoft Excel + Copilot / IA",
        ],
        filas: [
          [
            "Entorno de ejecución",
            "100% web en navegador (Windows, Mac, Chromebook).",
            "Escritorio Windows/Mac y versión web de Microsoft 365.",
          ],
          [
            "Asistente integrado",
            "Panel lateral Ask Gemini y función =AI() según plan elegible.",
            "Panel de Copilot en Excel (sobre Tablas Ctrl+T) y Python en Excel según licencia.",
          ],
          [
            "Fórmulas de resumen dinámico",
            "QUERY, FILTER, ARRAYFORMULA con sintaxis SQL liviana.",
            "FILTRAR, UNICOS, LET, LAMBDA y Tablas Dinámicas.",
          ],
          [
            "Manejo de grandes volúmenes",
            "Ideal para tablas livianas a medianas y colaboración en equipo.",
            "Mejor rendimiento en archivos grandes y ETL con Power Query.",
          ],
          [
            "Integración documental",
            "Referencia directa a archivos en Google Drive y Gmail.",
            "Integración con OneDrive, SharePoint y ecosistema Microsoft 365.",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "No aparece el ícono de Gemini en la barra superior de Google Sheets",
      causa:
        "Estás usando una cuenta @gmail.com gratuita sin plan elegible de Google One AI, o tu administrador de Google Workspace no ha habilitado Gemini.",
      solucion:
        "Verifica el tipo de cuenta en la esquina superior derecha; si es corporativa, solicita al administrador de Workspace revisar los permisos de Gemini.",
    },
    {
      error: "La fórmula sugerida arroja error #ERROR! de análisis al pegarla",
      causa:
        "Diferencia entre separador de argumentos (punto y coma ; en configuración Chile/España frente a coma , en inglés).",
      solucion:
        "Revisa Archivo > Configuración > Configuración regional y ajusta la fórmula usando ; o , según corresponda.",
    },
    {
      error: "La función =AI() devuelve #NAME? o no existe en la hoja",
      causa:
        "La función aún no está desplegada en tu cuenta, plan o configuración de idioma actual.",
      solucion:
        "Consulta la disponibilidad en support.google.com y, mientras tanto, ejecuta la clasificación o resumen desde el panel lateral Ask Gemini.",
    },
    {
      error: "Gemini sobrescribe celdas existentes al insertar una tabla",
      causa:
        "Tenías el cursor ubicado sobre un rango con datos previos al pulsar Insertar.",
      solucion:
        "Crea una pestaña nueva o selecciona una celda vacía con suficiente espacio antes de insertar la tabla generada.",
    },
  ],
  plantilla: {
    titulo: "Pack de fórmulas QUERY, FILTER y prompts para Google Sheets",
    descripcion:
      "Próximamente: hoja de cálculo modelo en Google Sheets con ejemplos de QUERY, ARRAYFORMULA y prompts listos para probar con Gemini.",
  },
  faqs: [
    {
      q: "¿Puedo usar Gemini en Google Sheets gratis?",
      a: "El panel lateral integrado de Gemini y la función =AI() dentro de Sheets requieren un plan elegible de Google Workspace o Google One AI según la documentación oficial de Google (support.google.com, consultado el 21 de noviembre de 2026). Con una cuenta gratuita puedes usar Gemini en su web por separado para pedir fórmulas y pegarlas manualmente.",
    },
    {
      q: "¿Qué hace la función =AI() en Google Sheets?",
      a: "Permite escribir un prompt dentro de una celda referenciando otras celdas (por ejemplo, comentarios o descripciones) para clasificar, resumir o generar texto fila por fila, sujeto a disponibilidad de plan e idioma.",
    },
    {
      q: "¿Gemini en Google Sheets funciona en español?",
      a: "El panel lateral de Gemini permite interactuar y pedir tablas o fórmulas en español; respecto a funciones específicas como =AI(), Google despliega el soporte de idiomas y regiones de forma gradual según su centro de ayuda oficial.",
    },
    {
      q: "¿Conviene usar Gemini para sumar o calcular impuestos en Sheets?",
      a: "No. Para cálculos matemáticos y financieros usa siempre fórmulas determinísticas como SUMA, SUMAR.SI.CONJUNTO, QUERY o ARRAYFORMULA, y reserva la IA para estructurar tablas, redactar fórmulas o procesar texto.",
    },
  ],
  relacionadas: [
    "google-sheets-vs-excel",
    "gemini-para-analisis-de-datos",
    "ia-para-excel-chatgpt-claude-gemini",
  ],
  enlacesExternos: [
    {
      label: "Collaborate with Gemini in Google Sheets",
      url: "https://support.google.com/docs/answer/14218565",
      fuente: "Google Support",
    },
    {
      label: "Use the AI function in Google Sheets",
      url: "https://support.google.com/docs/answer/15820999",
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
      descripcion: "Complementa tus hojas de cálculo con análisis profundos y scripts en Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Compara qué asistente externo conviene más cuando necesitas fórmulas o Python.",
    },
  ],
};

export default guia;
