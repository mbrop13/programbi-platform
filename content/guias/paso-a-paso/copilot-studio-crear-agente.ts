import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "copilot-studio-crear-agente",
  title: "Copilot Studio: qué es y cómo crear tu primer agente",
  meta: "Qué es Microsoft Copilot Studio, cuánto cuesta según Microsoft y cómo crear paso a paso un agente que responde con tus documentos y automatiza tareas.",
  h1: "Cómo crear un agente con Copilot Studio paso a paso",
  subtitle:
    "Aprende a diferenciar Copilot Studio de Microsoft 365 Copilot, revisar el modelo de licencias por Copilot Credits, conectar un agente a documentos de SharePoint o PDF, sumar flujos de Power Automate y publicarlo en Microsoft Teams con reglas de gobierno.",
  keywordPrincipal: "copilot studio",
  keywords: [
    "copilot studio",
    "qué es Copilot Studio",
    "precio Copilot Studio",
    "crear agente Copilot Studio",
  ],
  curso: "copilot",
  herramienta: "IA",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Nunca conectes bibliotecas de SharePoint o archivos PDF que contengan RUT de trabajadores, liquidaciones de sueldo, fichas médicas o contratos confidenciales sin validar primero quién podrá consultar al agente y qué políticas DLP (Prevención de Pérdida de Datos) rigen en tu entorno de Power Platform.",
  en30Segundos: {
    queLogras:
      "Un agente funcional en Microsoft Copilot Studio que responde preguntas citando manuales o políticas internas alojadas en SharePoint/PDF, ejecuta una acción automatizada mediante Power Automate y queda publicado en Microsoft Teams o en un sitio web.",
    herramienta: "Microsoft Copilot Studio + SharePoint + Power Automate + Microsoft Teams",
    tiempo: "35 minutos",
    bullets: [
      "Distinguir cuándo usar Microsoft 365 Copilot, Power Automate o Copilot Studio.",
      "Entender cómo operan las licencias de inquilino, de creador y los Copilot Credits.",
      "Configurar instrucciones de sistema y fuentes de conocimiento en SharePoint o PDF.",
      "Conectar una acción de Power Automate y publicar el agente con control de acceso.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Qué es y diferencias",
      resumen: "Compara Copilot Studio frente a Microsoft 365 Copilot y Power Automate.",
      anchorId: "que-es-copilot-studio",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Licencias y requisitos",
      resumen: "Revisa licencias de creador, tenant y consumo de Copilot Credits.",
      anchorId: "licencias-y-requisitos",
      icono: "shield",
    },
    {
      numero: 3,
      titulo: "Agente y documentos",
      resumen: "Crea el agente, define instrucciones y conecta SharePoint o PDFs.",
      anchorId: "crear-agente-documentos",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Acciones Power Automate",
      resumen: "Agrega un flujo que registre tickets o envíe avisos automáticos.",
      anchorId: "agregar-acciones-power-automate",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Publicar en Teams/Web",
      resumen: "Elige canal, configura autenticación y despliega para tus usuarios.",
      anchorId: "publicar-en-teams-o-web",
      icono: "mail",
    },
    {
      numero: 6,
      titulo: "Seguridad y gobierno",
      resumen: "Aplica políticas DLP, entornos dedicados y revisión de permisos.",
      anchorId: "seguridad-permisos-gobierno",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Acceso web a copilotstudio.microsoft.com dentro de un tenant de Microsoft 365 / Power Platform",
    lista: [
      "Cuenta corporativa o educativa en Microsoft Entra ID con permiso para crear agentes en un entorno de Power Platform.",
      "Licencia de usuario creador de Copilot Studio y capacidad habilitada en el tenant (o entorno de prueba autorizado por el administrador).",
      "Una carpeta de SharePoint o uno o dos archivos PDF de políticas internas (sin datos personales sensibles) para usar como base de conocimiento.",
    ],
    compatibilidadMacWeb:
      "Microsoft Copilot Studio se administra íntegramente desde el navegador web (Edge, Chrome o Safari), por lo que funciona igual en Windows y macOS. El canal de publicación en Microsoft Teams opera tanto en la app de escritorio como en la versión web.",
  },
  herramientasHowTo: [
    "Microsoft Copilot Studio",
    "SharePoint Online",
    "Power Automate",
    "Microsoft Teams",
  ],
  insumosHowTo: [
    "Documentos de políticas internas en PDF o biblioteca de SharePoint",
    "Entorno de Power Platform con políticas DLP configuradas",
  ],
  secciones: [
    {
      id: "que-es-copilot-studio",
      titulo: "Qué es Copilot Studio y en qué se diferencia de Microsoft 365 Copilot y Power Automate",
      parrafos: [
        "Microsoft Copilot Studio es una plataforma gráfica de bajo código (low-code) dentro del ecosistema Power Platform diseñada para construir, personalizar y publicar agentes conversacionales y flujos con IA. A diferencia de un chat genérico, permite definir exactamente qué fuentes de conocimiento puede consultar el agente, qué tono debe usar y qué acciones puede ejecutar sobre sistemas de la empresa.",
        "En muchas empresas chilenas surge la confusión entre tres productos de Microsoft que conviven en el mismo tenant: Microsoft 365 Copilot, Power Automate y Copilot Studio. Cada uno resuelve un problema distinto y suelen complementarse.",
      ],
      tabla: {
        caption: "Diferencias prácticas entre Microsoft 365 Copilot, Copilot Studio y Power Automate",
        encabezados: [
          "Característica",
          "Microsoft 365 Copilot",
          "Copilot Studio",
          "Power Automate",
        ],
        filas: [
          [
            "Propósito principal",
            "Asistente personal dentro de Word, Excel, Outlook, PowerPoint y Teams",
            "Crear agentes propios para atención interna, soporte o clientes en canales definidos",
            "Automatizar procesos repetitivos basados en disparadores y conectores",
          ],
          [
            "Quién lo usa",
            "Cada colaborador en su trabajo diario individual",
            "Creadores de soluciones que diseñan un asistente compartido para un área o portal",
            "Analistas y áreas de TI/operaciones que conectan aplicaciones sin interfaz de chat",
          ],
          [
            "Fuentes y acciones",
            "Archivos y correos del propio usuario en Microsoft Graph",
            "SharePoint, PDFs, sitios web, conectores y flujos de Power Automate como herramientas",
            "Más de mil conectores (Excel, SharePoint, SQL, Outlook, HTTP, etc.)",
          ],
          [
            "Canales de salida",
            "Aplicaciones de Microsoft 365",
            "Microsoft Teams, sitio web público o intranet, canales personalizados",
            "Segundo plano (correos, registros en tablas, aprobaciones, archivos)",
          ],
        ],
      },
    },
    {
      id: "licencias-y-requisitos",
      titulo: "Licencias y requisitos según la documentación oficial de Microsoft",
      parrafos: [
        "Antes de diseñar un piloto, conviene revisar cómo licencia Microsoft esta herramienta para evitar bloqueos al momento de publicar. Según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026), el licenciamiento de Copilot Studio combina tres piezas: una licencia a nivel de organización (tenant), licencias individuales para quienes construyen agentes y capacidad de consumo medida en Copilot Credits.",
        "Las tarifas exactas en dólares, los paquetes prepagados y los medidores de pago por uso en Azure varían según contrato y región; por eso debes consultar siempre la página oficial de licencias y precios de Copilot Studio en Microsoft Learn o con tu partner de licenciamiento antes de estimar presupuesto.",
      ],
      lista: [
        "Licencia de inquilino (Tenant License): la adquiere el administrador en el centro de administración de Microsoft 365 para habilitar el servicio y la capacidad base del entorno.",
        "Licencia de usuario creador (Copilot Studio User License): se asigna sin costo adicional por creador sobre el paquete del tenant a quienes necesitan entrar al estudio para diseñar, probar y mantener agentes.",
        "Copilot Credits: es la unidad de consumo que mide las respuestas generativas, el uso de orquestación autónoma y las acciones de IA ejecutadas por los agentes publicados. Puede adquirirse por paquetes mensuales prepagados o mediante pago por uso ligado a una suscripción de Azure.",
        "Escenario exclusivo de Microsoft Teams: según Microsoft Learn, existen condiciones específicas para agentes de orquestación clásica publicados únicamente en Microsoft Teams dentro de organizaciones con licencias elegibles de Microsoft 365.",
      ],
      alerta: {
        tipo: "info",
        titulo: "Prueba en entorno aislado antes de pasar a producción",
        texto: "Solicita a tu administrador de Power Platform un entorno dedicado (por ejemplo, tipo Sandbox o Developer) para construir y medir el consumo de Copilot Credits antes de habilitar el agente para toda la empresa.",
      },
    },
    {
      id: "crear-agente-documentos",
      titulo: "Crear un agente conectado a tus documentos (SharePoint o PDF)",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea un nuevo agente en Copilot Studio, redacta sus instrucciones de sistema y conecta una biblioteca de SharePoint o archivos PDF como fuente de conocimiento.",
      parrafos: [
        "Ingresa a copilotstudio.microsoft.com, selecciona en la esquina superior derecha el entorno correcto y haz clic en Crear (Create) -> Nuevo agente. Dale un nombre descriptivo para los usuarios internos, por ejemplo «Asistente de Políticas Internas» o «Mesa de Ayuda TI».",
        "En el panel de Descripción e Instrucciones es donde defines el comportamiento base del agente. Un error frecuente es dejar instrucciones vagas como «Ayuda a los empleados»; en su lugar, redacta reglas explícitas sobre idioma, alcance, formato de respuesta y qué hacer cuando la información no aparezca en los documentos cargados.",
        "Luego ve a la sección Conocimiento (Knowledge) y selecciona Agregar conocimiento. Puedes cargar archivos PDF directamente (útiles para reglamentos estáticos) o enlazar una biblioteca/sitio de SharePoint (ideal cuando los documentos se actualizan con frecuencia). Activa la orquestación generativa en la configuración del agente para que combine la búsqueda en tus documentos con las acciones que definiremos en el siguiente paso.",
      ],
      codigos: [
        {
          titulo: "Instrucción de sistema base para un agente de consultas internas",
          lenguaje: "prompt",
          codigo: `Eres el Asistente de Políticas Operativas de la empresa en Chile.
Responde siempre en español de Chile, de forma clara, directa y profesional.
Reglas obligatorias:
1) Basa tus respuestas exclusivamente en las fuentes de conocimiento conectadas (SharePoint y manuales PDF cargados).
2) Si la respuesta no aparece de forma explícita en esos documentos, responde: "No encuentro esa información en los documentos vigentes. Por favor consulta directamente con el área responsable." Nunca inventes plazos, montos ni excepciones.
3) Incluye al final el nombre del documento o sección consultada cuando esté disponible.
4) Usa viñetas cortas cuando expliques requisitos paso a paso.`,
          nota: "Pega este bloque en el campo Instrucciones del agente dentro de la pestaña Información general.",
        },
        {
          titulo: "Prompt de prueba en el panel Test para validar citas y límites",
          lenguaje: "prompt",
          codigo: `¿Cuál es el plazo máximo para rendir gastos de viaje nacional según el manual vigente y qué comprobantes exige? Si existe un límite de monto que no esté especificado en el PDF, indícalo explícitamente.`,
          nota: "Úsalo en el panel lateral Probar agente (Test your agent) para comprobar que responde citando tu documento.",
        },
      ],
      captura: {
        id: "copilot-studio-crear-agente-paso-1",
        alt: "Pantalla de configuración general de Copilot Studio con instrucciones de sistema y sección de conocimiento conectada a SharePoint y PDF",
        caption: "Configuración de instrucciones y fuentes de conocimiento dentro del estudio de Copilot Studio.",
        ratio: "16/9",
      },
      verificaResultado:
        "En el panel Probar agente, haz al menos tres preguntas: una cuya respuesta esté en tu PDF/SharePoint, una que mezcle dos secciones y otra sobre un tema inexistente. El agente debe citar la fuente en las dos primeras y reconocer que no tiene el dato en la tercera.",
    },
    {
      id: "agregar-acciones-power-automate",
      titulo: "Agregar acciones con Power Automate",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea un flujo de Power Automate con disparador de Copilot Studio y agrégalo como acción para que el agente registre solicitudes o envíe avisos.",
      parrafos: [
        "Un agente que solo responde preguntas ahorra búsquedas, pero el salto real en productividad ocurre cuando además ejecuta tareas. En Copilot Studio puedes conectar acciones (Actions) respaldadas por flujos de Power Automate, conectores predefinidos o APIs.",
        "Para crear tu primera acción, ve a la pestaña Acciones (Actions) -> Agregar una acción -> Nuevo flujo de agente (o selecciona un flujo de Power Automate ya creado en la misma solución). El flujo debe iniciar con el disparador «Cuando Copilot Studio llama a un flujo» (Run a flow from Copilot) y cerrar con la acción «Responder a Copilot Studio».",
        "Por ejemplo, si el usuario escribe que necesita solicitar acceso a una carpeta o reportar un incidente, el agente puede pedir tres datos (nombre del sistema, urgencia y breve descripción), invocar el flujo para registrar una fila en una lista de SharePoint o enviar una tarjeta por correo/Teams al equipo de soporte, y devolver el número de ticket al usuario.",
      ],
      codigos: [
        {
          titulo: "Instrucción de descripción para la acción de Power Automate",
          lenguaje: "prompt",
          codigo: `Usa esta acción únicamente cuando el usuario solicite explícitamente registrar un ticket de soporte o pedir acceso a una herramienta interna.
Antes de ejecutar la acción, confirma que cuentas con estos tres parámetros:
- sistema_afectado (texto corto, ej. "Power BI" o "SharePoint")
- urgencia (solo "Baja", "Media" o "Alta")
- resumen_problema (máximo 200 caracteres)
No ejecutes el flujo si falta alguno de estos tres datos; pídelos en una sola pregunta breve.`,
          nota: "Esta descripción ayuda al orquestador generativo a saber cuándo disparar el flujo y qué variables recolectar antes.",
        },
        {
          titulo: "Prompt de validación para disparar la acción desde el chat",
          lenguaje: "prompt",
          codigo: `Necesito abrir un ticket porque no puedo actualizar el tablero de ventas en Power BI desde esta mañana. La urgencia es Alta.`,
          nota: "Verifica en el mapa de actividad del panel de prueba que el agente recopila los parámetros y ejecuta el flujo.",
        },
      ],
      captura: {
        id: "copilot-studio-crear-agente-paso-2",
        alt: "Pestaña de Acciones en Copilot Studio mostrando un flujo de Power Automate conectado con entradas y salidas tipadas",
        caption: "Vinculación de un flujo de Power Automate como acción invocable por el agente.",
        ratio: "16/9",
      },
      verificaResultado:
        "Revisa el historial de ejecuciones del flujo en Power Automate y confirma que la fila o correo de prueba se creó con los valores exactos capturados en la conversación.",
    },
    {
      id: "publicar-en-teams-o-web",
      titulo: "Publicar en Microsoft Teams o en la web",
      esPasoHowTo: true,
      resumenHowTo:
        "Publica la versión validada del agente, habilita el canal de Microsoft Teams o sitio web y prueba el acceso desde una cuenta de usuario final.",
      parrafos: [
        "Mientras editas en Copilot Studio, los cambios solo viven en el borrador del estudio. Para que otros usuarios interactúen con el agente, primero debes ir a Publicar (Publish) en la barra superior y confirmar la publicación.",
        "Después ve a Canales (Channels). Para uso interno en empresas con Microsoft 365, el canal recomendado es Microsoft Teams: desde ahí puedes abrir el agente en tu propio Teams para pruebas o enviarlo para aprobación del administrador en el catálogo de aplicaciones de la organización. Si el agente es informativo y está pensado para clientes o proveedores en un sitio web, puedes usar el canal Sitio web personalizado (Custom website) copiando el fragmento HTML de inserción.",
        "Importante: si el agente consulta bibliotecas de SharePoint privadas, debes mantener activada la autenticación con Microsoft Entra ID (Autenticar con Microsoft) para que el agente respete la identidad de quien pregunta y no exponga documentos restringidos.",
      ],
      codigos: [
        {
          titulo: "Mensaje de bienvenida y sugerencias iniciales para Teams",
          lenguaje: "prompt",
          codigo: `Hola, soy el Asistente de Políticas y Soporte Interno. Puedo responder dudas sobre procedimientos vigentes o ayudarte a registrar un ticket de acceso.
Ejemplos de lo que puedes preguntarme:
1) "¿Cómo solicito licencia o acceso a Power BI?"
2) "¿Cuál es el flujo para rendir gastos?"
3) "Quiero registrar un ticket de soporte TI"`,
          nota: "Configúralo en el tema de Conversación inicial (Greeting / Conversation Start) para orientar a los usuarios desde el primer clic.",
        },
      ],
      captura: {
        id: "copilot-studio-crear-agente-paso-3",
        alt: "Vista de Canales en Copilot Studio con Microsoft Teams habilitado y botón de publicación",
        caption: "Selección de canales y publicación del agente hacia Microsoft Teams.",
        ratio: "16/9",
      },
      verificaResultado:
        "Abre el agente publicado desde Microsoft Teams con un usuario de prueba que NO sea administrador del estudio y confirma que responde correctamente y no tiene acceso a carpetas ajenas a sus permisos.",
    },
    {
      id: "seguridad-permisos-gobierno",
      titulo: "Seguridad, permisos y gobierno (DLP y datos sensibles)",
      parrafos: [
        "Llevar un agente a producción sin gobierno técnico es la causa más común de incidentes en proyectos de IA corporativa. En Power Platform, el control central se gestiona desde admin.powerplatform.microsoft.com mediante entornos separados y políticas de Prevención de Pérdida de Datos (DLP).",
        "Una política DLP define qué conectores pueden convivir en un mismo agente o flujo. Por ejemplo, puedes permitir que el conector de SharePoint y Teams operen en el grupo «Negocio» (Business), mientras bloqueas conectores públicos de redes sociales o servicios de almacenamiento personal para evitar filtraciones de información.",
        "Además, aplica estas prácticas antes de masificar el uso de agentes en tu empresa:",
      ],
      lista: [
        "Separa entornos: mantén un entorno de desarrollo/pruebas y otro de producción con acceso restringido a creadores autorizados.",
        "Revisa permisos de SharePoint: recuerda que si un sitio está compartido con «Todos excepto usuarios externos», cualquier usuario autenticado podría ver respuestas basadas en esos archivos.",
        "Monitorea consumo y calidad: revisa periódicamente las analíticas de Copilot Studio para detectar preguntas sin respuesta, temas mal resueltos y consumo de Copilot Credits.",
        "Complementa tu criterio de arquitectura revisando nuestras guías sobre análisis de datos con IA: [cómo usar Claude para análisis de datos](/guias/como-usar-claude-para-analisis-de-datos) y [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos).",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "El agente responde «No sé» aunque el PDF sí contiene la información",
      causa: "El PDF es una imagen escaneada sin OCR (texto seleccionable), supera los límites de tamaño o la orquestación generativa no está activada.",
      solucion: "Asegúrate de que el PDF tenga texto seleccionable (o pásalo a Word/SharePoint), divide manuales enormes por tema y verifica en Configuración -> IA generativa que las fuentes de conocimiento estén habilitadas.",
    },
    {
      error: "Cambios guardados en el estudio no aparecen en Microsoft Teams",
      causa: "Se guardaron los temas o instrucciones en el editor, pero se omitió el paso obligatorio de volver a hacer clic en Publicar.",
      solucion: "Ejecuta Publicar después de cada modificación relevante y espera unos minutos a que Teams actualice la versión del manifiesto.",
    },
    {
      error: "Error de autenticación o permisos al consultar SharePoint desde el canal web",
      causa: "Se eligió un canal sin autenticación de usuarios (acceso anónimo) intentando consultar documentos internos de SharePoint que exigen identidad de Entra ID.",
      solucion: "Usa autenticación con Microsoft Entra ID para agentes internos con SharePoint, o carga archivos públicos no confidenciales si el agente será anónimo en un sitio web.",
    },
    {
      error: "El flujo de Power Automate queda bloqueado por política DLP",
      causa: "El agente intenta usar en un mismo flujo conectores clasificados en grupos incompatibles (por ejemplo, Business y Non-Business) dentro del entorno.",
      solucion: "Coordina con el administrador de Power Platform para ubicar los conectores aprobados en el mismo grupo de la política DLP o mover el proyecto a un entorno con la política adecuada.",
    },
  ],
  plantilla: {
    titulo: "Próximamente: checklist de gobierno y arquitectura para Copilot Studio",
    descripcion:
      "Incluirá una lista de verificación imprimible de permisos SharePoint, políticas DLP, cálculo de Copilot Credits y pruebas previas a producción.",
  },
  faqs: [
    {
      q: "¿Qué es exactamente Microsoft Copilot Studio?",
      a: "Es la plataforma low-code de Microsoft para diseñar, conectar y publicar agentes de IA personalizados que responden con documentos propios y ejecutan acciones mediante conectores y Power Automate en canales como Microsoft Teams o la web.",
    },
    {
      q: "¿Cuál es la diferencia entre Microsoft 365 Copilot y Copilot Studio?",
      a: "Microsoft 365 Copilot es el asistente personal integrado en Word, Excel, Outlook y Teams para la productividad individual. Copilot Studio sirve para crear agentes propios de un área o empresa (por ejemplo, mesa de ayuda TI o consultas de políticas) con instrucciones, documentos y flujos definidos por un creador.",
    },
    {
      q: "¿Cómo funciona el precio o licenciamiento de Copilot Studio?",
      a: "Según la documentación oficial de Microsoft Learn, combina una licencia a nivel de organización (tenant), licencias de creador asignadas a quienes diseñan agentes y capacidad de consumo medida en Copilot Credits (por paquetes prepagados o pago por uso en Azure). Revisa las tarifas vigentes en la página oficial de Microsoft antes de presupuestar.",
    },
    {
      q: "¿Puedo conectar Copilot Studio con Power Automate sin saber programar?",
      a: "Sí. Desde la pestaña Acciones puedes crear o vincular flujos visuales de Power Automate usando el disparador de Copilot Studio y devolviendo variables de texto, listas o confirmaciones al chat.",
    },
    {
      q: "¿Es seguro conectar documentos internos de la empresa?",
      a: "Sí, siempre que mantengas autenticación de Microsoft Entra ID, revises los permisos heredados de tus sitios de SharePoint y apliques políticas DLP en Power Platform. Nunca cargues planillas con RUT o sueldos si no existe un control estricto de acceso.",
    },
  ],
  relacionadas: [
    "enviar-reportes-automaticos-con-power-automate",
    "automatizar-tareas-con-ia",
    "como-usar-copilot-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Información general de Microsoft Copilot Studio",
      url: "https://learn.microsoft.com/es-es/microsoft-copilot-studio/fundamentals-what-is-copilot-studio",
      fuente: "Microsoft Learn",
    },
    {
      label: "Licencias y Copilot Credits en Copilot Studio",
      url: "https://learn.microsoft.com/es-es/microsoft-copilot-studio/billing-licensing",
      fuente: "Microsoft Learn",
    },
    {
      label: "Políticas de prevención de pérdida de datos (DLP) en Power Platform",
      url: "https://learn.microsoft.com/es-es/power-platform/admin/wp-data-loss-prevention",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Microsoft Copilot",
      href: "/cursos/copilot",
      descripcion: "Aprende a usar Copilot en Excel, Word, Outlook y construcción de agentes.",
    },
    {
      label: "Curso de Power Automate",
      href: "/cursos/power-automate",
      descripcion: "Domina flujos automatizados, conectores y aprobaciones en la nube.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Flujo complementario para analizar planillas y archivos con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa técnica para elegir asistente en tareas de datos.",
    },
  ],
};

export default guia;
