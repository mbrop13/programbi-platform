import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "chatgpt-vs-gemini-vs-copilot",
  title: "ChatGPT vs Gemini vs Copilot vs Claude: ¿cuál es mejor?",
  meta: "Comparamos ChatGPT, Gemini, Copilot y Claude para trabajar: redacción, Excel, análisis, integración con Microsoft o Google y planes. Veredicto por uso.",
  h1: "ChatGPT vs Gemini vs Copilot vs Claude: cuál conviene para tu trabajo",
  subtitle:
    "Comparativa práctica para equipos en Chile: capacidades reales de cada asistente, integración con Microsoft 365 y Google Workspace, privacidad empresarial y una batería de 5 prompts reproducibles para evaluarlos con tus propios archivos.",
  keywordPrincipal: "chatgpt vs gemini",
  keywords: [
    "chatgpt vs gemini",
    "ChatGPT vs Gemini vs Claude",
    "ChatGPT vs Copilot",
    "cuál es mejor IA trabajo",
    "ChatGPT vs Gemini vs Copilot vs Claude",
  ],
  curso: "chatgpt",
  cursosSecundarios: ["gemini", "claude", "copilot"],
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  omitirHowTo: true,
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de comparar modelos con datos reales de tu empresa, anonimiza cualquier RUT, nombre de trabajador, sueldo líquido, correo personal o ficha de cliente. En cuentas gratuitas o personales, los proveedores pueden usar tus conversaciones para mejorar sus modelos salvo que desactives la opción en privacidad o contrates un plan corporativo (Business/Team, Enterprise o Workspace).",
  en30Segundos: {
    queLogras:
      "Elegir con criterio técnico cuál de los cuatro grandes asistentes de IA (ChatGPT, Gemini, Microsoft Copilot o Claude) se adapta mejor a tu flujo diario de oficina, análisis de datos y ecosistema tecnológico.",
    herramienta: "ChatGPT (OpenAI), Gemini (Google), Microsoft Copilot y Claude (Anthropic)",
    tiempo: "20 minutos",
    bullets: [
      "Criterio rápido según tu suite ofimática actual (Microsoft 365, Google Workspace o uso mixto).",
      "Tabla comparativa de capacidades, integraciones y estructura de planes según documentación oficial.",
      "Batería de 5 prompts estandarizados para que evalúes cada herramienta en igualdad de condiciones.",
      "Revisión de garantías de privacidad empresarial y veredicto por perfil profesional.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Perfil de usuario",
      resumen: "Identifica qué asistente encaja mejor con tu rol y tu suite diaria.",
      anchorId: "resumen-rapido-perfil-usuario",
      icono: "sparkles",
    },
    {
      numero: 2,
      titulo: "Tabla comparativa",
      resumen: "Contrasta capacidades, ecosistemas y estructura oficial de planes.",
      anchorId: "tabla-comparativa-general",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Batería de 5 prompts",
      resumen: "Prueba los cuatro modelos en redacción, Excel, CSV, SQL y síntesis.",
      anchorId: "bateria-prompts-evaluacion",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Microsoft vs Google",
      resumen: "Evalúa el valor de tener la IA incrustada dentro de tus documentos.",
      anchorId: "integracion-microsoft-vs-google",
      icono: "layers",
    },
    {
      numero: 5,
      titulo: "Privacidad y veredicto",
      resumen: "Revisa resguardo de datos corporativos y decide con criterios claros.",
      anchorId: "privacidad-empresarial",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Cuentas web vigentes en noviembre de 2026 (planes gratuitos o corporativos según disponibilidad)",
    lista: [
      "Navegador actualizado (Chrome, Edge, Safari o Firefox) para abrir las interfaces web oficiales.",
      "Un conjunto de datos ficticio o anonimizado (CSV pequeño o tabla de ejemplo) si vas a correr la batería de pruebas.",
      "Acceso a Microsoft 365 o Google Workspace en caso de evaluar las integraciones nativas en la nube.",
    ],
    compatibilidadMacWeb:
      "Los cuatro asistentes operan vía navegador web en Windows y macOS. Copilot también se integra en aplicaciones de escritorio de Microsoft 365 (Windows y Mac) y Gemini lo hace directamente dentro de Google Docs, Sheets y Gmail en la web.",
  },
  secciones: [
    {
      id: "resumen-rapido-perfil-usuario",
      titulo: "Resumen rápido por perfil de usuario",
      parrafos: [
        "No existe un único ganador universal entre ChatGPT, Gemini, Microsoft Copilot y Claude. La elección correcta depende menos de los puntajes teóricos de laboratorio y más de tres factores cotidianos: dónde viven tus archivos, qué tipo de entregables produces cada semana y qué políticas de seguridad exige tu organización.",
        "En oficinas chilenas es habitual encontrar empresas que pagan Microsoft 365 por su correo y Excel, equipos que colaboran en Google Workspace y analistas que además abren una pestaña independiente para redactar o depurar código. Entender el punto fuerte de cada plataforma evita pagar licencias duplicadas.",
      ],
      lista: [
        "Si tu trabajo vive en Excel, Word, PowerPoint, Outlook y Teams: Microsoft Copilot ofrece la ventaja de actuar directamente sobre tus documentos y reuniones sin copiar y pegar entre ventanas.",
        "Si tu organización opera en Gmail, Google Docs, Google Sheets y Drive: Gemini integrado en Google Workspace aprovecha el contexto nativo de tus carpetas y correos con permisos heredados.",
        "Si buscas versatilidad general, análisis exploratorio de archivos CSV/Excel mediante ejecución de código y un ecosistema amplio de asistentes personalizados: ChatGPT suele ser la navaja suiza más equilibrada.",
        "Si priorizas redacción estructurada, lectura profunda de documentos extensos, revisión técnica y generación de código limpio o consultas SQL complejas: Claude destaca por su claridad y menor tendencia al relleno.",
      ],
      captura: {
        id: "chatgpt-vs-gemini-vs-copilot-paso-1",
        alt: "Esquema visual de perfiles profesionales y su asistente de IA recomendado según suite ofimática",
        caption: "Mapa de decisión rápida según el entorno de trabajo y tipo de tarea principal.",
        ratio: "16/9",
      },
    },
    {
      id: "tabla-comparativa-general",
      titulo: "Tabla comparativa general: capacidades, ecosistema y planes",
      parrafos: [
        "Al comparar ChatGPT, Gemini, Copilot y Claude conviene separar las capacidades del modelo de conversación de la forma en que cada proveedor empaqueta sus licencias. La siguiente tabla resume la estructura oficial de cada plataforma según la documentación oficial de OpenAI, Google, Microsoft y Anthropic, consultado el 21 de noviembre de 2026.",
        "Las tarifas, cuotas de mensajes y disponibilidad regional cambian con frecuencia; por eso, en lugar de citar montos fijos que caducan rápido, revisa siempre la página de precios de cada proveedor enlazada al final de esta guía antes de aprobar presupuestos.",
      ],
      tabla: {
        caption: "Comparativa estructural de ChatGPT, Gemini, Microsoft Copilot y Claude (fuentes oficiales, nov. 2026)",
        encabezados: [
          "Criterio",
          "ChatGPT (OpenAI)",
          "Gemini (Google)",
          "Microsoft Copilot",
          "Claude (Anthropic)",
        ],
        filas: [
          [
            "Ecosistema nativo",
            "Plataforma independiente con conectores a Drive, OneDrive y API propia",
            "Integrado en Google Workspace (Gmail, Docs, Sheets, Drive, Meet)",
            "Integrado en Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
            "Plataforma independiente con Proyectos, Artifacts y conectores empresariales",
          ],
          [
            "Análisis de planillas y código",
            "Ejecuta Python en entorno aislado para procesar CSV/XLSX y graficar",
            "Analiza archivos en web y asiste con fórmulas y tablas en Google Sheets",
            "Opera dentro de Excel (fórmulas, tablas dinámicas y Python en Excel)",
            "Analiza documentos, genera scripts y construye visualizaciones interactivas",
          ],
          [
            "Estructura de planes",
            "Free, Plus, Pro, Business (antes Team) y Enterprise (según openai.com)",
            "Versión gratuita personal, planes Google AI y ediciones Workspace Business/Enterprise",
            "Copilot gratuito web y licencia corporativa Microsoft 365 Copilot / Copilot Studio",
            "Free, Pro, Max, Team y Enterprise (según anthropic.com)",
          ],
          [
            "Entrenamiento con datos en planes empresa",
            "Excluido por defecto en ChatGPT Business y Enterprise",
            "Excluido en cuentas de Google Workspace corporativas y educativas",
            "Los datos de Microsoft 365 Copilot no se usan para entrenar modelos base",
            "Excluido por defecto en planes comerciales Team, Enterprise y API",
          ],
          [
            "Mejor ajuste típico",
            "Uso multipropósito, exploración de datos y GPTs personalizados",
            "Equipos 100 % Google Workspace y búsqueda conectada a Drive/Gmail",
            "Empresas estandarizadas en Microsoft 365 con gobierno en Entra ID",
            "Redacción exigente, síntesis de PDFs extensos, SQL y programación",
          ],
        ],
      },
      alerta: {
        tipo: "info",
        titulo: "Sobre versiones gratuitas vs licencias corporativas",
        texto: "Las versiones gratuitas sirven para probar la interfaz, pero suelen tener límites diarios de mensajes, menor acceso a análisis de archivos pesados y reglas de privacidad distintas a las de un entorno empresarial. Evalúa siempre en el nivel de licencia que realmente contratarás.",
      },
    },
    {
      id: "bateria-prompts-evaluacion",
      titulo: "Batería de 5 prompts reproducibles de evaluación",
      parrafos: [
        "En lugar de confiar en opiniones genéricas de redes sociales, la forma más honesta de decidir entre ChatGPT, Gemini, Copilot y Claude es ejecutar exactamente los mismos cinco desafíos con tus propios casos de trabajo. Así evitas sesgos y observas cómo responde cada herramienta frente al formato de datos que manejas en Chile.",
        "Copia estos cinco prompts en una sesión nueva de cada asistente (usando datos ficticios o anonimizados) y evalúa tres aspectos objetivos: si entendió la instrucción a la primera, si la respuesta se puede usar sin reescribirla por completo y si advirtió casos borde.",
      ],
      codigos: [
        {
          titulo: "Prompt 1 — Redacción corporativa en español de Chile",
          lenguaje: "prompt",
          codigo: `Actúa como coordinador de operaciones en una empresa de servicios en Chile.
Redacta un correo breve (máximo 140 palabras) para informar a clientes corporativos que la ventana de mantenimiento del portal de facturación será el sábado 28 de noviembre entre las 22:00 y las 01:00 horas.
Requisitos:
- Tono formal pero cercano, en español de Chile (sin modismos informales ni exceso de adjetivos).
- Incluir impacto concreto: no se podrán emitir ni descargar facturas durante esas 3 horas.
- Cerrar con un canal de contacto de guardia y disculpas claras sin promesas vagas.`,
          nota: "Evalúa naturalidad del tono, respeto al límite de palabras y ausencia de frases de relleno.",
        },
        {
          titulo: "Prompt 2 — Fórmula de Excel con separador punto y coma",
          lenguaje: "prompt",
          codigo: `Tengo una tabla en Excel en español (configuración regional Chile, separador de argumentos punto y coma ";").
Columnas: A = Fecha, B = Sucursal, C = Monto_Neto, D = Estado ("Pagada" o "Anulada").
Necesito una única fórmula que calcule el total de Monto_Neto para la sucursal escrita en F2 durante el mes actual (según la fecha de HOY()), excluyendo los registros "Anulada".
Entrega:
1) La fórmula exacta en español usando ; como separador.
2) Su equivalente en inglés usando , como separador.
3) Qué pasa si la columna Fecha contiene celdas vacías o texto.`,
          nota: "Comprueba si el asistente respeta el separador ; en español y los nombres correctos de función (SUMAR.SI.CONJUNTO / SUMIFS).",
        },
        {
          titulo: "Prompt 3 — Limpieza y diagnóstico de CSV sucio",
          lenguaje: "prompt",
          codigo: `Analiza el siguiente extracto CSV ficticio (o el archivo adjunto anonimizado):
id_cliente;fecha_alta;monto_clp;comuna
101;2026-03-15;150.000;Providencia
102;15/03/2026;$185000;providencia 
103;;-45000;Las Condes
101;2026-03-15;150000;Providencia

Tarea:
1) Lista todas las inconsistencias de calidad de datos que detectes.
2) Propón las reglas exactas de normalización para fecha, monto entero CLP, comuna y duplicados.
3) No inventes filas ni corrijas silenciosamente: explica qué debería confirmarse con el área de negocio (por ejemplo, el monto negativo).`,
          nota: "Permite ver si el modelo detecta duplicados, formatos mixtos de fecha/moneda, espacios al final y valores negativos.",
        },
        {
          titulo: "Prompt 4 — Consulta SQL Server (T-SQL) con CTE y ventana",
          lenguaje: "prompt",
          codigo: `En SQL Server (T-SQL), tengo la tabla dbo.Ventas(VentaID, ClienteID, FechaVenta, MontoNeto).
Escribe una consulta usando una CTE y una función de ventana (ROW_NUMBER o DENSE_RANK) para obtener los 3 clientes con mayor facturación acumulada por cada año calendario, mostrando: Anio, ClienteID, TotalAnual y Ranking.
Incluye un breve comentario explicando por qué elegiste ROW_NUMBER o DENSE_RANK ante posibles empates.`,
          nota: "Verifica que no mezcle sintaxis de PostgreSQL o MySQL (como LIMIT en lugar de TOP o filtro sobre CTE).",
        },
        {
          titulo: "Prompt 5 — Resumen ejecutivo con detección de vacíos",
          lenguaje: "prompt",
          codigo: `Lee el siguiente texto de minuta de reunión (pega aquí una minuta anonimizada de 1 a 2 páginas) y genera:
1) 3 decisiones tomadas, indicando responsable y fecha límite solo si aparecen explícitamente en el texto.
2) 3 riesgos o temas abiertos.
3) Una lista aparte llamada "Información faltante" donde señales qué responsables o plazos NO quedaron definidos en la minuta.
Regla estricta: si un dato no está en el texto, escribe "No especificado" en lugar de deducirlo.`,
          nota: "Mide la disciplina del modelo para no alucinar responsables ni fechas cuando faltan en el documento.",
        },
      ],
      verificaResultado:
        "Puntúa cada respuesta del 1 al 3 en exactitud técnica, respeto a restricciones (largo, idioma, separador ;) y honestidad ante datos faltantes. Si dos modelos empatan, quédate con el que requirió menos correcciones en tu segundo mensaje.",
    },
    {
      id: "integracion-microsoft-vs-google",
      titulo: "Integración con Microsoft 365 vs Google Workspace",
      parrafos: [
        "La gran diferencia práctica entre usar un chat web independiente (ChatGPT o Claude) y contratar una suite integrada (Microsoft 365 Copilot o Gemini en Workspace) está en la fricción operativa. Copiar datos desde una planilla hacia un navegador externo funciona bien para consultas puntuales, pero se vuelve lento cuando necesitas resumir hilos de 40 correos o redactar minutas de videollamadas todos los días.",
        "Según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026), Microsoft 365 Copilot opera dentro de Word, Excel, PowerPoint, Outlook y Teams apoyándose en Microsoft Graph: es decir, puede consultar correos, chats y archivos de SharePoint a los que el usuario ya tiene acceso. En análisis de datos, Copilot en Excel ayuda a generar columnas de fórmulas, tablas dinámicas y scripts de Python directamente en el libro abierto.",
        "Por su parte, según la documentación de soporte de Google Workspace (consultado el 21 de noviembre de 2026), Gemini integrado permite redactar y resumir en Gmail y Google Docs, organizar tablas en Google Sheets y generar resúmenes en Google Meet respetando las carpetas y permisos existentes en Google Drive.",
        "Si quieres profundizar específicamente en cómo rinden los modelos independientes frente a archivos de análisis de datos, revisa nuestras comparativas dedicadas: [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos) y [cómo usar Claude para análisis de datos](/guias/como-usar-claude-para-analisis-de-datos).",
      ],
      captura: {
        id: "chatgpt-vs-gemini-vs-copilot-paso-2",
        alt: "Comparación conceptual de integración nativa de Copilot en Microsoft 365 y Gemini en Google Workspace frente a chats independientes",
        caption: "Diferencia entre IA incrustada en la suite ofimática y asistentes en pestaña independiente.",
        ratio: "16/9",
      },
    },
    {
      id: "privacidad-empresarial",
      titulo: "Privacidad empresarial y resguardo de datos sensibles",
      parrafos: [
        "En Chile, el manejo de bases con RUT, remuneraciones, antecedentes médicos o contratos comerciales exige distinguir claramente entre una cuenta gratuita personal y una licencia empresarial administrada. Usar una cuenta gratuita con información confidencial de clientes o trabajadores expone a la empresa a incumplimientos internos de seguridad.",
        "De acuerdo con las páginas oficiales de privacidad empresarial de OpenAI, Google Workspace, Microsoft y Anthropic (consultadas el 21 de noviembre de 2026), los planes corporativos (ChatGPT Business/Enterprise, Google Workspace con Gemini, Microsoft 365 Copilot y Claude Team/Enterprise) comparten tres compromisos clave:",
      ],
      lista: [
        "No entrenamiento con tus datos: los prompts, archivos adjuntos y respuestas generadas en entornos empresariales no se utilizan para entrenar los modelos fundacionales públicos.",
        "Control de acceso y retención: las organizaciones pueden administrar usuarios mediante inicio de sesión único (SSO), controlar quién accede a qué conectores y definir políticas de retención.",
        "Aislamiento de permisos en suites: tanto Copilot en Microsoft 365 como Gemini en Workspace heredan los permisos vigentes en SharePoint/OneDrive o Google Drive, de modo que un usuario no puede consultar documentos restringidos a otra gerencia (aunque conviene auditar primero si existen carpetas compartidas por error con «toda la empresa»).",
      ],
      alerta: {
        tipo: "warning",
        titulo: "Audita tus permisos antes de activar Copilot o Gemini",
        texto: "La IA no rompe los permisos de tu servidor de archivos, pero sí acelera el descubrimiento de documentos que quedaron mal compartidos en SharePoint o Drive. Antes de habilitar licencias masivas, revisa los permisos de carpetas de Finanzas y Recursos Humanos.",
      },
    },
    {
      id: "veredicto-practico",
      titulo: "Veredicto práctico: cómo decidir sin gastar de más",
      parrafos: [
        "Si lideras un equipo pequeño o trabajas de forma independiente, una buena regla práctica es evitar pagar tres suscripciones simultáneas antes de medir uso real. Empieza definiendo cuál es tu cuello de botella semanal: ¿es redacción y síntesis de documentos, análisis de planillas o automatización dentro del correo?",
        "Para la mayoría de las empresas medianas en Chile que ya operan sobre Microsoft 365, combinar una licencia estándar de Copilot para quienes viven en Teams/Outlook/Excel con cuentas puntuales de ChatGPT o Claude para el equipo de análisis, TI o contenidos suele entregar mejor retorno que comprar el plan más caro para toda la nómina desde el día uno.",
        "Para equipos que viven 100 % en Google Workspace, activar Gemini dentro de la misma consola administrativa simplifica la gestión de seguridad y facturación. Y si tu foco principal es análisis de datos fuera de la suite, compara en detalle los flujos de trabajo en [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos).",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Comparar una versión gratuita de un asistente contra la versión pagada de otro",
      causa: "Los planes gratuitos suelen usar modelos más livianos o imponer topes estrictos al análisis de archivos, generando una falsa impresión de inferioridad.",
      solucion: "Ejecuta la batería de 5 prompts en el nivel equivalente (idealmente el plan que planeas contratar) y anota la fecha de la prueba.",
    },
    {
      error: "Subir planillas con RUT, sueldos o correos reales durante una evaluación piloto",
      causa: "Las pruebas rápidas suelen hacerse en cuentas personales sin contrato corporativo ni políticas DLP activadas.",
      solucion: "Reemplaza identificadores reales por códigos ficticios (EMP-001, Cliente A) antes de cargar cualquier CSV o XLSX.",
    },
    {
      error: "Confiar en cifras o citas legales generadas sin verificación",
      causa: "Incluso los mejores modelos pueden completar vacíos de contexto con datos plausibles pero inexactos si el prompt no prohíbe deducir.",
      solucion: "Exige siempre fuentes verificables, incluye la instrucción de responder «No especificado» cuando falte un dato y valida cálculos críticos en Excel o SQL.",
    },
    {
      error: "Comprar licencias de Copilot o Gemini sin ordenar los permisos de Drive o SharePoint",
      causa: "Los asistentes indexan todo lo que el usuario ya tiene permiso de leer, incluyendo carpetas heredadas demasiado abiertas.",
      solucion: "Realiza una revisión previa de permisos en carpetas sensibles (remuneraciones, contratos, directorio) antes del despliegue.",
    },
  ],
  plantilla: {
    titulo: "Próximamente: matriz de evaluación descargable en Excel",
    descripcion:
      "Incluirá una tabla de puntuación ponderada para comparar ChatGPT, Gemini, Copilot y Claude con los 5 prompts de prueba de tu equipo.",
  },
  faqs: [
    {
      q: "¿Cuál es mejor para trabajar en Excel: ChatGPT, Copilot, Gemini o Claude?",
      a: "Depende de cómo trabajes. Si quieres asistencia directamente dentro de la cinta de Excel sin cambiar de ventana, Microsoft Copilot es la opción nativa. Si prefieres subir un CSV o XLSX a un chat para explorar datos, depurar errores o generar fórmulas complejas paso a paso, ChatGPT y Claude ofrecen gran flexibilidad; recuerda siempre pedir las fórmulas con punto y coma si usas Excel en español de Chile.",
    },
    {
      q: "¿Las cuentas gratuitas protegen los datos de mi empresa?",
      a: "Por regla general, no debes asumir privacidad corporativa en planes gratuitos o personales. Consulta la configuración de privacidad de cada proveedor y utiliza planes empresariales (ChatGPT Business/Enterprise, Google Workspace, Microsoft 365 Copilot o Claude Team/Enterprise) donde los términos oficiales excluyen el entrenamiento con datos de la organización.",
    },
    {
      q: "¿Necesito pagar los cuatro asistentes al mismo tiempo?",
      a: "No. Lo más eficiente es elegir un asistente principal alineado con tu suite ofimática (Microsoft 365 o Google Workspace) y, solo si tu rol exige análisis intensivo de código, SQL o documentos extensos, evaluar una segunda herramienta especializada para ese equipo.",
    },
    {
      q: "¿Por qué la tabla comparativa no muestra precios fijos en pesos chilenos?",
      a: "Los proveedores actualizan sus tarifas en dólares, paquetes por volumen y límites de uso periódicamente. Para evitar cifras desactualizadas o inventadas, enlazamos directamente a las páginas oficiales de OpenAI, Google, Microsoft y Anthropic para que verifiques el valor vigente al momento de cotizar.",
    },
    {
      q: "¿Cómo puedo aprender a analizar datos con Claude y compararlo con ChatGPT?",
      a: "Puedes revisar nuestras guías especializadas de análisis de datos: cómo usar Claude para análisis de datos y la comparativa directa Claude vs ChatGPT para análisis de datos.",
    },
  ],
  relacionadas: [
    "chatgpt-para-analisis-de-datos",
    "gemini-para-analisis-de-datos",
    "ia-para-excel-chatgpt-claude-gemini",
  ],
  enlacesExternos: [
    {
      label: "Planes y privacidad empresarial de ChatGPT (OpenAI)",
      url: "https://openai.com/chatgpt/pricing/",
      fuente: "OpenAI",
    },
    {
      label: "Privacidad de IA generativa en Google Workspace",
      url: "https://support.google.com/a/answer/15706919",
      fuente: "Google Support",
    },
    {
      label: "Documentación de Microsoft 365 Copilot",
      url: "https://learn.microsoft.com/es-es/copilot/microsoft-365/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Planes y privacidad comercial de Claude (Anthropic)",
      url: "https://www.anthropic.com/pricing",
      fuente: "Anthropic",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa enfocada en limpieza de datos, SQL, Python y análisis de planillas.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Flujo práctico paso a paso para analizar archivos y tablas con Claude.",
    },
  ],
};

export default guia;
