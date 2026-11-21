import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "automatizar-tareas-con-ia",
  title: "Cómo automatizar tareas con IA en tu trabajo (guía 2026)",
  meta: "Automatiza tareas repetitivas con IA: correos, reportes, Excel y documentos con ChatGPT, Copilot y Power Automate. Casos paso a paso y por dónde empezar.",
  h1: "Cómo automatizar tareas de tu trabajo con IA",
  subtitle:
    "De lo simple a lo escalable: aprende a priorizar procesos según frecuencia y tiempo, estandarizar prompts reutilizables, aprovechar Copilot en Microsoft 365, conectar flujos con Power Automate + IA y dar el salto a agentes en Copilot Studio.",
  keywordPrincipal: "automatizar tareas con ia",
  keywords: [
    "automatizar tareas con ia",
    "automatizar procesos con IA",
    "automatizar con IA gratis",
    "automatizar el trabajo con IA",
  ],
  curso: "ia-productividad",
  cursoSecundario: "power-automate",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de automatizar cualquier flujo con IA, verifica si el proceso manipula RUT, sueldos, datos bancarios o información confidencial de clientes. Nunca envíes datos personales a cuentas gratuitas ni automatices envíos externos de correo o aprobaciones contables sin una etapa de revisión humana.",
  en30Segundos: {
    queLogras:
      "Un método en cuatro niveles para identificar qué tareas de oficina vale la pena automatizar con IA y llevarlas a la práctica desde prompts reutilizables hasta flujos en Power Automate.",
    herramienta: "ChatGPT / Claude + Microsoft 365 Copilot + Power Automate + Copilot Studio",
    tiempo: "30 minutos",
    bullets: [
      "Matriz práctica de frecuencia × tiempo para elegir tu primer proceso candidato sin perder semanas.",
      "Nivel 1 y 2: plantillas de prompts reutilizables, Proyectos y uso de Copilot dentro de Microsoft 365.",
      "Nivel 3: flujo paso a paso en Power Automate que clasifica correos y genera borradores con expresiones.",
      "Nivel 4: cuándo pasar a un agente completo en Copilot Studio y cómo mantener supervisión humana.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Qué automatizar",
      resumen: "Evalúa frecuencia, tiempo invertido y tolerancia a errores con matriz 2×2.",
      anchorId: "detectar-que-tareas-automatizar",
      icono: "chart",
    },
    {
      numero: 2,
      titulo: "Nivel 1: Prompts",
      resumen: "Crea instrucciones reutilizables en Proyectos o GPTs para tareas recurrentes.",
      anchorId: "nivel-1-prompts-reutilizables",
      icono: "sparkles",
    },
    {
      numero: 3,
      titulo: "Nivel 2: Copilot M365",
      resumen: "Resume reuniones, redacta en Outlook y limpia tablas en Excel.",
      anchorId: "nivel-2-copilot-microsoft-365",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Nivel 3: Power Automate",
      resumen: "Conecta disparadores de correo, IA y aprobaciones con expresiones.",
      anchorId: "nivel-3-flujos-power-automate-ia",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Nivel 4: Agentes",
      resumen: "Escala hacia asistentes interactivos en Copilot Studio con tus archivos.",
      anchorId: "nivel-4-agentes-copilot-studio",
      icono: "layers",
    },
    {
      numero: 6,
      titulo: "Riesgos y control",
      resumen: "Implementa revisión humana obligatoria y resguardo de datos sensibles.",
      anchorId: "riesgos-privacidad-revision-humana",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Vigente en 2026: navegador web para Nivel 1 y entorno Microsoft 365 / Power Automate para Niveles 2 a 4",
    lista: [
      "Lista de 3 a 5 tareas repetitivas de tu semana laboral con estimación de tiempo.",
      "Cuenta en ChatGPT, Claude o Gemini para Nivel 1 (prompts y proyectos reutilizables).",
      "Licencia Microsoft 365 con Power Automate (y opcionalmente Copilot / AI Builder) para flujos en segundo plano.",
    ],
    compatibilidadMacWeb:
      "Los niveles 1, 3 y 4 se configuran completamente en navegador web (Windows y macOS). El nivel 2 funciona en Microsoft 365 Web y en las aplicaciones de escritorio para Windows y macOS.",
  },
  herramientasHowTo: [
    "ChatGPT o Claude",
    "Microsoft 365 Copilot",
    "Power Automate",
    "Copilot Studio",
  ],
  insumosHowTo: [
    "Ejemplos anonimizados de correos, minutas o planillas repetitivas",
    "Criterios de validación y revisión humana definidos por el equipo",
  ],
  secciones: [
    {
      id: "detectar-que-tareas-automatizar",
      titulo: "Detectar qué tareas automatizar: matriz frecuencia × tiempo y retorno",
      parrafos: [
        "El error más habitual al querer automatizar el trabajo con IA es intentar construir un flujo complejo para una tarea que solo ocurre una vez al trimestre. Antes de abrir cualquier herramienta, haz un inventario honesto de tu semana y clasifica cada actividad según dos ejes: cuántas veces se repite y cuántos minutos consume cada ejecución.",
        "Además del ahorro de horas, evalúa la tolerancia al error. La IA brilla resumiendo textos, clasificando solicitudes, generando primeros borradores de correos o preparando fórmulas; en cambio, cualquier cálculo financiero vinculante o respuesta legal a un cliente requiere reglas determinísticas (Excel, SQL) y validación humana antes de enviarse.",
      ],
      tabla: {
        caption: "Matriz de decisión frecuencia × tiempo para priorizar automatizaciones con IA",
        encabezados: [
          "Frecuencia / Tiempo por vez",
          "Corto (5–15 min)",
          "Medio (15–45 min)",
          "Largo (> 45 min)",
        ],
        filas: [
          [
            "Diaria",
            "Nivel 1–2: Prompt guardado o Copilot en Outlook/Teams (alto retorno inmediato)",
            "Nivel 3: Flujo en Power Automate + IA para clasificar y preparar borradores",
            "Nivel 3–4: Pipeline estructurado (Power Query/Automate + agente supervisado)",
          ],
          [
            "Semanal",
            "Nivel 1: Plantilla de prompt reutilizable en Proyecto o chat fijado",
            "Nivel 2–3: Resumen semanal automático de planillas o correos hacia Teams",
            "Nivel 3: Reporte programado lunes a primera hora con revisión antes de enviar",
          ],
          [
            "Mensual o esporádica",
            "No automatizar: hazlo manual o con un prompt puntual",
            "Nivel 1: Documenta un buen prompt y guárdalo en tu biblioteca del equipo",
            "Evalúa si el cuello de botella es de datos (Power Query) más que de IA",
          ],
        ],
      },
      alerta: {
        tipo: "tip",
        titulo: "Regla práctica de retorno",
        texto: "Si una tarea te toma 15 minutos al día (aproximadamente 5 horas al mes) y un prompt o flujo la reduce a 3 minutos de revisión, recuperas cerca de 4 horas mensuales por persona sin escribir código complejo.",
      },
    },
    {
      id: "nivel-1-prompts-reutilizables",
      titulo: "Nivel 1: Prompts reutilizables y proyectos con instrucciones fijas",
      esPasoHowTo: true,
      resumenHowTo:
        "Convierte tus tareas frecuentes de redacción o limpieza de textos en plantillas de prompts guardadas dentro de un Proyecto o instrucción personalizada.",
      parrafos: [
        "No necesitas licencias corporativas caras para empezar. El Nivel 1 consiste en dejar de improvisar prompts desde cero cada lunes y transformar tus tareas repetitivas en plantillas parametrizadas dentro de Proyectos (en ChatGPT o Claude) o instrucciones guardadas en un documento compartido del equipo.",
        "Un buen prompt reutilizable separa siempre tres bloques: el rol y contexto del negocio, las reglas de formato (por ejemplo, tabla con columnas exactas o correo máximo de 120 palabras) y los datos variables que pegarás en cada uso. Si quieres profundizar en cómo estructurar análisis de archivos con este enfoque, revisa [cómo usar Claude para análisis de datos](/guias/como-usar-claude-para-analisis-de-datos).",
      ],
      codigos: [
        {
          titulo: "Prompt 1 — Clasificador y borrador de respuesta para correos de clientes",
          lenguaje: "prompt",
          codigo: `Actúa como analista de atención a clientes B2B en Chile.
Con el texto del correo anonimizado que pegaré al final, entrega exactamente:
1) Categoría: [Facturación | Soporte Técnico | Renovación | Reclamo | Otro]
2) Urgencia sugerida: [Alta | Media | Baja] y justificación en 1 línea.
3) Datos faltantes que debemos pedirle al cliente antes de resolver.
4) Borrador de respuesta cordial y directa (máximo 110 palabras), sin prometer fechas de solución no confirmadas.

Correo del cliente:
[PEGAR AQUÍ TEXTO ANONIMIZADO]`,
          nota: "Guárdalo en un Proyecto de Claude o ChatGPT para reutilizarlo en segundos cada mañana.",
        },
        {
          titulo: "Prompt 2 — Extractor de acuerdos y tareas desde minutas de reunión",
          lenguaje: "prompt",
          codigo: `Transforma la siguiente transcripción o notas desordenadas de reunión en una tabla Markdown con 4 columnas:
| Área / Tema | Acuerdo o acción concreta | Responsable (según texto) | Plazo |

Reglas:
- Si el responsable o el plazo no aparecen explícitos en las notas, escribe "Por definir".
- Máximo 12 palabras por acción.
- Al final, lista en viñetas hasta 3 dudas abiertas que quedaron sin cierre.

Notas:
[PEGAR AQUÍ NOTAS SIN DATOS PERSONALES SENSIBLES]`,
          nota: "Ideal para cerrar reuniones operativas en menos de dos minutos.",
        },
      ],
      captura: {
        id: "automatizar-tareas-con-ia-paso-1",
        alt: "Ejemplo de Proyecto con instrucciones permanentes y prompt parametrizado para extraer acuerdos de minutas",
        caption: "Nivel 1: plantilla reutilizable con instrucciones fijas para estandarizar entregas.",
        ratio: "16/9",
      },
      verificaResultado:
        "Compara el borrador generado con tu criterio real: verifica que ningún campo «Por definir» haya sido inventado por el modelo y que la categoría asignada coincida con las reglas de tu área.",
    },
    {
      id: "nivel-2-copilot-microsoft-365",
      titulo: "Nivel 2: Copilot integrado en Microsoft 365 (Outlook, Teams y Excel)",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa Copilot directamente dentro de Teams, Outlook y Excel para resumir hilos extensos, redactar seguimientos y crear columnas calculadas sin salir de la aplicación.",
      parrafos: [
        "Cuando tu empresa ya opera sobre Microsoft 365 y cuenta con licencias de Microsoft 365 Copilot, el segundo nivel elimina el copiar y pegar. La IA vive en el panel lateral de Outlook, Teams, Word y Excel, leyendo el contexto del archivo o hilo abierto según tus permisos.",
        "En reuniones de Teams con transcripción activa, puedes pedir al cierre un resumen de decisiones y tareas pendientes. En Outlook, sirve para sintetizar cadenas de 25 correos antes de responder. Y en Excel, te ayuda a proponer fórmulas sobre una Tabla oficial (`Ctrl+T`) o identificar valores atípicos, siempre que trabajes sobre datos estructurados.",
      ],
      codigos: [
        {
          titulo: "Prompt 3 — Limpieza y fórmula condicional en Copilot para Excel",
          lenguaje: "prompt",
          codigo: `Sobre la tabla seleccionada en esta hoja, agrega una columna calculada llamada "Estado_SLA" que muestre "Atrasado" si la columna Dias_Respuesta es mayor a 3 y Estado_Caso es distinto de "Cerrado"; en cualquier otro caso debe mostrar "En plazo".
Usa fórmulas nativas de Excel compatibles con versión en español.`,
          nota: "Úsalo en el panel de Copilot en Excel teniendo tus datos formateados como Tabla oficial.",
        },
      ],
      captura: {
        id: "automatizar-tareas-con-ia-paso-2",
        alt: "Panel lateral de Copilot en Excel generando una columna calculada condicional sobre una tabla de seguimiento",
        caption: "Nivel 2: Copilot operando directamente sobre una tabla estructurada en Microsoft Excel.",
        ratio: "16/9",
      },
      verificaResultado:
        "Haz clic en la celda generada por Copilot y revisa la barra de fórmulas: confirma que los nombres de columna, operadores y el resultado en filas borde (por ejemplo, exactamente 3 días o estado Cerrado) sean correctos.",
    },
    {
      id: "nivel-3-flujos-power-automate-ia",
      titulo: "Nivel 3: Flujos automáticos con Power Automate + IA",
      esPasoHowTo: true,
      resumenHowTo:
        "Construye un flujo en Power Automate que se dispara al recibir un correo, resume o clasifica su contenido con IA y solicita aprobación humana en Teams antes de registrar o responder.",
      parrafos: [
        "El verdadero salto hacia la automatización en segundo plano ocurre en el Nivel 3: ya no eres tú quien abre un chat, sino un evento (un correo entrante, una fila nueva en SharePoint o un horario fijo cada lunes) el que activa el proceso en Power Automate.",
        "Este patrón funciona especialmente bien en áreas de soporte interno, mesa de ayuda TI, cobranza y recepción de requerimientos comerciales, donde el volumen de mensajes hace inviable clasificar todo a mano pero tampoco conviene responder automáticamente sin supervisión.",
        "Sigue esta secuencia recomendada para un flujo seguro de clasificación de solicitudes entrantes:",
      ],
      listaOrdenada: [
        "Disparador (Trigger): «Cuando llega un correo nuevo (V3)» en Outlook, filtrado por asunto o buzón compartido (por ejemplo, soporte@tuempresa.cl).",
        "Limpieza con expresión: usa `trim()` y `take()` en Power Automate para recortar espacios y limitar el largo del texto enviado al modelo, evitando sobrecostos o errores por hilos gigantes.",
        "Paso de IA (AI Builder / conector aprobado por TI): envía el asunto y cuerpo recortado con un prompt estricto que devuelva JSON simple (categoría, urgencia y borrador de respuesta).",
        "Registro y revisión humana: guarda el resultado en una lista de SharePoint o tabla de Excel y envía una tarjeta adaptativa o solicitud de «Iniciar y esperar una aprobación» en Microsoft Teams para que una persona valide el borrador antes de enviarlo al cliente.",
      ],
      codigos: [
        {
          titulo: "Expresión Power Automate para recortar y limpiar el cuerpo del correo",
          lenguaje: "power-automate",
          codigo: `take(trim(outputs('Html_a_texto')?['body']), 2500)`,
          nota: "Convierte primero el correo HTML con la acción 'Html a texto' y limita a 2.500 caracteres antes de pasarlo al paso de IA.",
        },
        {
          titulo: "Prompt 4 — Instrucción para salida JSON estructurada dentro del flujo",
          lenguaje: "prompt",
          codigo: `Analiza la siguiente solicitud de cliente y responde EXCLUSIVAMENTE con un objeto JSON válido sin texto adicional ni bloques markdown:
{
  "categoria": "Facturacion | Soporte | Comercial | Otro",
  "urgencia": "Alta | Media | Baja",
  "resumen_corto": "máximo 20 palabras en español de Chile",
  "requiere_escalamiento": true
}
Si falta información para clasificar, usa "Otro" y urgencia "Media".`,
          nota: "Permite conectar la salida directamente a 'Analizar JSON' (Parse JSON) en Power Automate.",
        },
      ],
      captura: {
        id: "automatizar-tareas-con-ia-paso-3",
        alt: "Diseñador de Power Automate mostrando disparador de correo, acción de limpieza, paso de IA y aprobación en Teams",
        caption: "Nivel 3: flujo en Power Automate con paso de clasificación IA y aprobación humana en Teams.",
        ratio: "16/9",
      },
      verificaResultado:
        "Ejecuta una prueba enviando un correo ficticio al buzón de prueba. Confirma en el historial de Power Automate que el JSON se parseó sin errores y que la tarjeta de aprobación llegó a Teams con el resumen correcto.",
    },
    {
      id: "nivel-4-agentes-copilot-studio",
      titulo: "Nivel 4: Agentes conversacionales en Copilot Studio",
      parrafos: [
        "Cuando el proceso ya no es lineal (es decir, el usuario necesita hacer preguntas de seguimiento, consultar manuales internos en SharePoint y luego disparar acciones según lo conversado), un flujo tradicional de Power Automate se queda corto. Ese es el territorio del Nivel 4: construir un agente dedicado en Microsoft Copilot Studio.",
        "En nuestra guía especializada sobre [cómo crear un agente con Copilot Studio paso a paso](/guias/copilot-studio-crear-agente) explicamos cómo conectar documentos de SharePoint o PDFs, vincular flujos de Power Automate como herramientas del agente y publicarlo en Microsoft Teams con políticas DLP.",
        "Antes de dar este paso, asegúrate de tener claros tres requisitos: quién mantendrá actualizados los documentos fuente, qué grupos de Microsoft Entra ID tendrán acceso al agente y cómo se medirá el consumo de capacidad para evitar sorpresas operativas.",
        "Si además quieres comparar cómo se comportan distintos modelos al analizar archivos antes de elegir la tecnología de tu automatización, revisa [Claude vs ChatGPT para análisis de datos](/guias/claude-vs-chatgpt-analisis-de-datos).",
      ],
      codigos: [
        {
          titulo: "Prompt 5 — Plantilla de auditoría antes de escalar a un agente",
          lenguaje: "prompt",
          codigo: `Evalúa si este proceso debe resolverse con un flujo de Power Automate o con un agente de Copilot Studio.
Proceso actual: [DESCRIBE EL PROCESO EN 4 LÍNEAS]
Responde con:
1) Si hay interacción conversacional con el usuario o solo transferencia automática entre sistemas.
2) Qué fuente de verdad (SharePoint, SQL, Excel) necesita consultar.
3) Qué paso debe mantener aprobación humana obligatoria.`,
          nota: "Úsalo en fase de diseño para no sobredimensionar una automatización simple.",
        },
      ],
      verificaResultado:
        "Confirma si tu caso realmente requiere diálogo abierto (Copilot Studio) o si un flujo programado de Power Automate lo resuelve con menor complejidad y costo.",
    },
    {
      id: "riesgos-privacidad-revision-humana",
      titulo: "Riesgos, privacidad y revisión humana obligatoria",
      parrafos: [
        "Automatizar con IA no significa «desentenderse del proceso». Un error común es conectar un modelo generativo directamente al correo saliente hacia clientes o a modificaciones en bases productivas sin control intermedio. Si el modelo malinterpreta un monto o un tono en una queja delicada, el impacto recae sobre la empresa.",
        "Para implementar automatizaciones confiables en equipos de trabajo en Chile, aplica cuatro salvaguardas operativas:",
      ],
      lista: [
        "Humano en el circuito (Human-in-the-loop): deja que la IA clasifique, resuma y redacte el borrador, pero exige clic de aprobación humana antes de enviar correos externos, emitir cobros o modificar registros críticos.",
        "Minimización de datos: no envíes RUT, sueldos, cuentas bancarias ni antecedentes médicos si el flujo solo necesita el código de solicitud, el motivo y el área.",
        "Logs y monitoreo: guarda en una lista de SharePoint o tabla de auditoría la fecha, la entrada resumida, la salida de la IA y quién aprobó la acción.",
        "Respaldo determinístico: para cálculos contables, tributarios o laborales, usa fórmulas verificadas en Excel o consultas SQL; nunca delegues aritmética legal a un modelo de lenguaje.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Automatizar el envío directo de correos a clientes sin revisión previa",
      causa: "Se conecta el paso de IA directamente a 'Enviar correo (V2)' buscando ahorrar un clic adicional.",
      solucion: "Inserta siempre una acción de 'Crear borrador' o 'Iniciar y esperar una aprobación' en Teams para que una persona valide el texto final.",
    },
    {
      error: "El paso 'Analizar JSON' en Power Automate falla de forma intermitente",
      causa: "El modelo a veces envuelve el JSON en comillas invertidas (```json ... ```) o agrega una frase introductoria.",
      solucion: "Indica explícitamente en el prompt no usar bloques markdown y limpia la respuesta con replace() antes de pasarla al parser JSON.",
    },
    {
      error: "Intentar automatizar un proceso desordenado que nadie entiende todavía",
      causa: "Se busca que la IA «arregle» planillas inconsistentes o reglas de negocio ambiguas.",
      solucion: "Estandariza primero el origen de datos (por ejemplo, una Tabla oficial de Excel o formulario estructurado) y recién después automatiza.",
    },
    {
      error: "Exponer datos sensibles en cuentas gratuitas durante las pruebas",
      causa: "Los usuarios copian planillas reales de clientes o remuneraciones en su cuenta personal para probar un prompt.",
      solucion: "Crea un set de 5 casos ficticios anonimizados para todo el equipo y usa únicamente cuentas corporativas aprobadas por TI.",
    },
  ],
  plantilla: {
    titulo: "Próximamente: matriz de priorización y bitácora de automatizaciones",
    descripcion:
      "Incluirá la hoja de cálculo frecuencia × tiempo, estimador de horas ahorradas y checklist de revisión humana para flujos con IA.",
  },
  faqs: [
    {
      q: "¿Se puede automatizar tareas con IA gratis?",
      a: "Sí, en el Nivel 1 puedes crear plantillas de prompts reutilizables y organizar tu flujo de trabajo con los planes gratuitos de ChatGPT, Claude o Gemini (respetando sus límites diarios y sin subir datos confidenciales). Para automatizaciones desatendidas en segundo plano dentro de Microsoft 365 se requieren licencias corporativas de Power Automate y/o Copilot.",
    },
    {
      q: "¿Qué tareas conviene automatizar primero con IA?",
      a: "Empieza por tareas diarias o semanales de texto y clasificación: resumir minutas de reunión, clasificar correos entrantes, redactar primeros borradores de respuesta y generar fórmulas o explicaciones de datos en Excel.",
    },
    {
      q: "¿Cuándo usar Power Automate y cuándo usar Copilot Studio?",
      a: "Usa Power Automate cuando el proceso es automático de sistema a sistema (por ejemplo, llega un correo -> se clasifica -> se guarda en SharePoint). Usa Copilot Studio cuando necesitas un agente conversacional con el que las personas chateen en Teams o la web consultando documentos internos.",
    },
    {
      q: "¿La IA puede reemplazar las fórmulas de Excel o consultas SQL en reportes?",
      a: "No debe reemplazarlas en cálculos críticos. La IA es excelente para ayudarte a escribir o depurar la fórmula o consulta SQL, pero la ejecución del cálculo financiero, contable o de remuneraciones debe quedar en Excel, Power Query o SQL para garantizar resultados exactos y auditables.",
    },
  ],
  relacionadas: [
    "automatizar-reportes-con-power-bi",
    "enviar-reportes-automaticos-con-power-automate",
    "copilot-studio-crear-agente",
  ],
  enlacesExternos: [
    {
      label: "Información general sobre Power Automate y automatización en la nube",
      url: "https://learn.microsoft.com/es-es/power-automate/getting-started",
      fuente: "Microsoft Learn",
    },
    {
      label: "Introducción a AI Builder en Power Automate",
      url: "https://learn.microsoft.com/es-es/ai-builder/overview",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Aprende a estructurar prompts y archivos para análisis confiables con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Compara ambos asistentes en limpieza de datos, SQL y planillas.",
    },
  ],
};

export default guia;
