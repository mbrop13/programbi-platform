import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "mcp-power-bi-claude",
  title: "MCP de Power BI con Claude: qué es y cómo configurarlo",
  meta: "Conecta Claude a Power BI con el servidor MCP oficial: instalación, permisos, casos de uso (DAX, documentación del modelo) y riesgos. Guía paso a paso.",
  h1: "Cómo usar el MCP de Power BI con Claude paso a paso",
  subtitle:
    "Integra Claude Desktop con tus modelos semánticos de Power BI mediante Model Context Protocol (MCP) para auditar medidas DAX, documentar tablas y refactorizar relaciones sin copiar y pegar metadatos manualmente.",
  keywordPrincipal: "mcp power bi",
  keywords: [
    "mcp power bi",
    "MCP Power BI Claude",
    "MCP Power BI Desktop",
    "modeling MCP",
    "Claude Power BI MCP",
  ],
  curso: "power-bi",
  cursoSecundario: "claude",
  herramienta: "Power BI",
  nivel: "Avanzado",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Al conectar un cliente de IA como Claude Desktop a un servidor MCP de Power BI, los metadatos del modelo semántico (nombres de tablas, columnas, medidas DAX, relaciones y eventualmente resultados de consultas de prueba) viajan al proveedor del modelo de lenguaje según la configuración de tu cuenta. Antes de habilitar herramientas de consulta o escritura, evita exponer modelos con datos personales sensibles como RUT, sueldos o nóminas de clientes reales sin autorización de tu área de seguridad de la información.",
  en30Segundos: {
    queLogras:
      "Conectar Claude Desktop con el servidor MCP oficial de Power BI para inspeccionar el modelo semántico, documentar medidas DAX y aplicar refactorizaciones controladas.",
    herramienta: "Claude Desktop + Power BI Desktop + MCP",
    tiempo: "35 minutos",
    bullets: [
      "Comprender la arquitectura cliente-servidor de MCP y qué servidores oficiales ofrece Microsoft para Power BI.",
      "Comparar los modos de operación en solo lectura frente a edición y modelado directo.",
      "Configurar el archivo claude_desktop_config.json con la estructura mcpServers y validar la conexión.",
      "Ejecutar cinco prompts prácticos para documentar modelos, revisar DAX y detectar riesgos de permisos.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Arquitectura MCP",
      resumen: "Entiende cliente, servidor y opciones oficiales de Power BI.",
      anchorId: "que-es-mcp-power-bi",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Requisitos y modos",
      resumen: "Compara solo lectura frente a modelado y edición.",
      anchorId: "requisitos-modos-operacion",
      icono: "settings",
    },
    {
      numero: 3,
      titulo: "Configurar Claude",
      resumen: "Edita claude_desktop_config.json y verifica herramientas.",
      anchorId: "instalacion-configuracion-claude",
      icono: "terminal",
    },
    {
      numero: 4,
      titulo: "Casos de uso DAX",
      resumen: "Documenta el modelo, crea medidas y audita rendimiento.",
      anchorId: "casos-de-uso-modelado",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Seguridad y riesgos",
      resumen: "Controla metadatos expuestos y escrituras en el modelo.",
      anchorId: "seguridad-permisos-riesgos",
      icono: "shield",
    },
    {
      numero: 6,
      titulo: "Limitaciones reales",
      resumen: "Conoce qué no resuelve MCP y cómo mitigar fallos.",
      anchorId: "limitaciones-actuales",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Power BI Desktop actualizado en Windows y Claude Desktop vigente",
    lista: [
      "Power BI Desktop abierto con un archivo .pbix o proyecto PBIP/TMDL local de prueba.",
      "Claude Desktop instalado con sesión activa en una cuenta autorizada para herramientas locales.",
      "Binarios oficiales del servidor MCP de Power BI descargados siguiendo la documentación de Microsoft Learn.",
      "Copia de respaldo del archivo .pbix o repositorio Git antes de habilitar operaciones de escritura.",
    ],
    compatibilidadMacWeb:
      "Power BI Desktop y el servidor local de modelado requieren Windows para conectarse a instancias locales en ejecución. La configuración de claude_desktop_config.json en Claude Desktop sigue el estándar de Anthropic en Windows (%APPDATA%\\Claude\\claude_desktop_config.json), mientras que los endpoints remotos alojados por Microsoft apuntan a modelos publicados en Fabric/Power BI Service.",
    avisoEducativo:
      "Las rutas de ejecutables y comandos exactos pueden cambiar entre versiones del servidor MCP. Verifica siempre el binario vigente en la guía oficial de Microsoft Learn antes de editar tu configuración.",
  },
  herramientasHowTo: ["Power BI Desktop", "Claude Desktop", "Power BI Authoring MCP"],
  insumosHowTo: [
    "Modelo semántico .pbix o PBIP de respaldo",
    "Archivo claude_desktop_config.json",
  ],
  secciones: [
    {
      id: "que-es-mcp-power-bi",
      titulo: "1. Qué es MCP y qué opciones existen para Power BI",
      esPasoHowTo: true,
      resumenHowTo:
        "Comprende cómo el protocolo Model Context Protocol conecta a Claude Desktop como cliente con el servidor MCP oficial de Power BI.",
      parrafos: [
        "Hasta hace poco, pedirle ayuda a un modelo de lenguaje para depurar un informe de Power BI implicaba copiar manualmente fórmulas DAX, tomar pantallazos de la vista de relaciones o exportar el esquema con herramientas externas. Ese flujo manual rompe el contexto cada vez que agregas una columna calculada o cambias la cardinalidad de una relación.",
        "El Model Context Protocol (MCP), publicado por Anthropic como estándar abierto según modelcontextprotocol.io (consultado el 21 de noviembre de 2026), resuelve exactamente esa fricción. Define una interfaz común entre un cliente de IA (como Claude Desktop) y un servidor local o remoto que expone herramientas, recursos y esquemas estructurados.",
        "En esta arquitectura, Claude no adivina tus tablas ni accede mágicamente a tu disco duro sin control: el cliente envía solicitudes tipadas al servidor MCP, y el servidor ejecuta acciones acotadas contra tu instancia local o tu espacio de trabajo, devolviendo metadatos o confirmaciones al chat.",
        "Para Power BI, según la documentación oficial de Microsoft Learn (Power BI MCP server documentation, consultado el 21 de noviembre de 2026), existen dos grandes familias de servidores según el objetivo del usuario: el servidor orientado a modelado y autoría (Power BI Authoring MCP server, conocido también en flujos de desarrollo como Power BI Modeling MCP) y servidores orientados a consumo y preguntas de negocio sobre datos gobernados (como Fabric IQ).",
        "El servidor de autoría y modelado permite a un agente inspeccionar y modificar tablas, columnas, medidas, relaciones, grupos de cálculo, perspectivas y roles de seguridad, además de validar consultas DAX y trabajar sobre archivos Power BI Project (PBIP) y TMDL. Por su parte, la modalidad local sobre stdio (disponible de forma general según Microsoft Learn, consultado el 21 de noviembre de 2026) se conecta directo a tu Power BI Desktop abierto, mientras que la modalidad alojada en la nube (en vista previa) apunta a modelos en workspaces de Fabric.",
        "Como los nombres de binarios, banderas de arranque y canales de distribución evolucionan rápido, conviene revisar siempre la guía oficial de Power BI Authoring MCP server en Microsoft Learn para obtener el comando exacto vigente al 21 de noviembre de 2026 antes de automatizar instalaciones en equipos corporativos.",
      ],
      lista: [
        "Cliente MCP (Claude Desktop): gestiona la conversación, decide qué herramienta invocar y te pide aprobación antes de ejecutar acciones sensibles.",
        "Transporte stdio local: canal estándar de entrada y salida donde Claude Desktop levanta el proceso del servidor en tu mismo equipo Windows.",
        "Servidor Power BI Authoring / Modeling MCP: traduce las llamadas del protocolo a operaciones sobre el modelo tabular local o archivos PBIP/TMDL.",
      ],
      captura: {
        id: "mcp-power-bi-claude-paso-1",
        alt: "Diagrama de arquitectura entre Claude Desktop como cliente MCP, transporte stdio y Power BI Desktop",
        caption:
          "Flujo de comunicación MCP: Claude Desktop consulta y opera sobre el modelo tabular a través del servidor oficial de Microsoft.",
        ratio: "16/9",
      },
    },
    {
      id: "requisitos-modos-operacion",
      titulo: "2. Requisitos previos y modos: solo lectura vs edición y modelado",
      esPasoHowTo: true,
      resumenHowTo:
        "Define si necesitas auditar un modelo en solo lectura o habilitar operaciones de edición y modelado directo.",
      parrafos: [
        "Antes de escribir una sola línea de JSON, decide qué nivel de autonomía vas a darle a Claude sobre tu archivo de Power BI. No es lo mismo usar un asistente para documentar un modelo productivo complejo que permitirle crear medidas, renombrar columnas en masa o alterar relaciones en un archivo que todavía no respaldas.",
        "Según la documentación oficial de Microsoft Learn sobre integración agéntica en Power BI (consultado el 21 de noviembre de 2026), el servidor de modelado abarca desde lectura del esquema y ejecución de consultas DAX de validación hasta refactorización completa de objetos del modelo semántico. En la práctica diaria, conviene separar mentalmente dos modos de trabajo: auditoría en solo lectura (o con aprobaciones estrictas) y modelado activo sobre una copia de desarrollo.",
        "Si recién estás probando la integración en tu empresa, parte siempre con un archivo PBIX de laboratorio o una rama Git dedicada usando formato PBIP. Así evitas que un prompt ambiguo renombre treinta medidas con un prefijo no deseado o cambie la dirección de filtro cruzado sin revisión previa.",
      ],
      tabla: {
        caption: "Comparativa de modos de trabajo al conectar Claude con Power BI vía MCP",
        encabezados: [
          "Criterio",
          "Modo auditoría y solo lectura",
          "Modo edición y modelado directo",
        ],
        filas: [
          [
            "Objetivo principal",
            "Documentar tablas, revisar DAX lento y entender relaciones heredadas.",
            "Crear medidas, refactorizar nombres, ajustar formatos y grupos de cálculo.",
          ],
          [
            "Riesgo sobre el .pbix",
            "Muy bajo: no modifica definiciones del modelo tabular.",
            "Alto si no hay respaldo: altera medidas, relaciones y metadatos en vivo.",
          ],
          [
            "Aprobación en Claude",
            "Aprobar únicamente herramientas de lectura de esquema y metadatos.",
            "Revisar cada llamada de escritura antes de pulsar Permitir en el chat.",
          ],
          [
            "Entorno recomendado",
            "Copia local del modelo o entorno de QA.",
            "Archivo de prueba o proyecto PBIP versionado con Git.",
          ],
          [
            "Control de cambios",
            "No requiere rollback porque el modelo permanece intacto.",
            "Obligatorio respaldo previo del .pbix o commit limpio antes de iniciar.",
          ],
        ],
      },
      captura: {
        id: "mcp-power-bi-claude-paso-2",
        alt: "Modelo semántico abierto en Power BI Desktop junto a una copia de respaldo PBIP versionada",
        caption:
          "Trabaja sobre una copia o proyecto PBIP versionado en Git antes de habilitar herramientas de modelado.",
        ratio: "16/9",
      },
    },
    {
      id: "instalacion-configuracion-claude",
      titulo: "3. Instalación y configuración en Claude Desktop",
      esPasoHowTo: true,
      resumenHowTo:
        "Descarga el binario oficial del servidor MCP, registra el bloque mcpServers en claude_desktop_config.json y verifica su arranque.",
      parrafos: [
        "Según la guía oficial de Model Context Protocol para Claude Desktop en modelcontextprotocol.io (consultado el 21 de noviembre de 2026), los servidores locales se declaran en un archivo JSON llamado claude_desktop_config.json. En Windows, este archivo vive en la ruta %APPDATA%\\Claude\\claude_desktop_config.json, y puedes abrirlo directamente desde el menú de Claude Desktop entrando a Settings > Developer > Edit Config.",
        "En ese archivo debes definir el objeto raíz mcpServers, asignando un identificador claro (por ejemplo, powerbi-modeling) junto a las claves command y args. Es fundamental que la ruta del ejecutable oficial coincida exactamente con la ubicación donde instalaste el servidor MCP de Power BI desde la guía oficial de Microsoft Learn, escapando correctamente las barras invertidas en formato JSON.",
        "Un error clásico en Windows es usar barras simples sin escapar o dejar comas sobrantes al final del último atributo del objeto JSON. Si el archivo tiene un error de sintaxis, Claude Desktop ignorará el servidor o mostrará una alerta de configuración al iniciar.",
        "Después de guardar el archivo, cierra completamente Claude Desktop desde la bandeja del sistema (no basta con cerrar la ventana con la X) y vuelve a abrirlo. Al reiniciar, deberías ver el ícono de herramientas disponibles en la barra del chat indicando que el servidor MCP quedó registrado.",
      ],
      codigos: [
        {
          titulo: "Estructura JSON en claude_desktop_config.json (Windows)",
          lenguaje: "json",
          codigo: `{
  "mcpServers": {
    "powerbi-modeling": {
      "command": "C:\\\\RUTA\\\\AL\\\\SERVIDOR\\\\PowerBIModelingMCP.exe",
      "args": []
    }
  }
}`,
          nota: "Reemplaza C:\\\\RUTA\\\\AL\\\\SERVIDOR\\\\PowerBIModelingMCP.exe por la ruta exacta del ejecutable oficial instalado según Microsoft Learn (consultado el 21-nov-2026). Usa doble barra invertida en JSON.",
        },
        {
          titulo: "Prompt 1: Verificar conexión y listar objetos del modelo abierto",
          lenguaje: "prompt",
          codigo: `Conéctate al modelo de Power BI abierto actualmente mediante el servidor MCP.
No modifiques ningún objeto todavía.
Devuelve únicamente:
1. Nombre de las tablas de hechos y dimensiones detectadas.
2. Cantidad total de medidas y relaciones activas/inactivas.
3. Si existe alguna tabla sin relaciones.`,
          nota: "Usa este primer prompt de solo lectura para confirmar que Claude lee el esquema real de tu Power BI Desktop.",
        },
      ],
      alerta: {
        tipo: "warning",
        titulo: "Verifica siempre el ejecutable oficial",
        texto:
          "No descargues binarios compilados por terceros desconocidos ni paquetes npm no verificados. Obtén el servidor MCP de Power BI exclusivamente desde los canales oficiales enlazados en learn.microsoft.com.",
      },
      captura: {
        id: "mcp-power-bi-claude-paso-3",
        alt: "Archivo claude_desktop_config.json abierto en editor junto al panel Developer de Claude Desktop",
        caption:
          "Configura mcpServers en claude_desktop_config.json y reinicia Claude Desktop completamente para cargar las herramientas.",
        ratio: "16/9",
      },
      verificaResultado:
        "Confirma que Claude responde con los nombres exactos de tus tablas y medidas del archivo abierto en Power BI Desktop, sin inventar tablas genéricas. Si devuelve un error de conexión o no aparecen herramientas MCP, revisa los registros de Developer en Claude Desktop y valida la ruta del ejecutable.",
    },
    {
      id: "casos-de-uso-modelado",
      titulo: "4. Casos de uso prácticos: documentar el modelo, crear medidas y revisar DAX",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica prompts estructurados para generar el diccionario de datos del modelo, auditar fórmulas DAX y crear nuevas medidas con validación.",
      parrafos: [
        "Una vez establecida la conexión, el verdadero salto de productividad no está en pedirle gráficos a Claude, sino en delegarle tareas tediosas de ingeniería del modelo semántico. En proyectos corporativos chilenos es común heredar archivos .pbix con decenas de medidas sin descripción, nombres inconsistentes y cálculos con FILTER sobre tablas completas que degradan el rendimiento.",
        "El primer caso de uso de alto retorno es la documentación automática del modelo. Claude puede leer las expresiones DAX de todas tus medidas, entender sus dependencias y redactar descripciones funcionales claras en español para que luego las incorpores en la propiedad Description de cada medida o en un diccionario Markdown para el equipo de negocio.",
        "El segundo caso de uso es la auditoría y refactorización de medidas DAX. Al tener acceso al esquema completo (incluyendo cardinalidades y tipos de datos), Claude detecta errores frecuentes como divisiones sin DIVIDE, uso innecesario de CALCULATE sin cambio de contexto de filtro, o filtros de tabla entera dentro de iteradores.",
        "El tercer caso de uso es la creación controlada de nuevas medidas (por ejemplo, variaciones interanuales o acumulados YTD) indicando explícitamente en qué tabla de medidas deben quedar alojadas, qué formato numérico usar y qué pruebas DAX ejecutar para validar que el resultado no devuelva valores en blanco inesperados.",
      ],
      codigos: [
        {
          titulo: "Prompt 2: Generar diccionario técnico del modelo en solo lectura",
          lenguaje: "prompt",
          codigo: `Inspecciona el modelo semántico conectado sin realizar cambios.
Genera una tabla en Markdown con todas las medidas de la tabla "_Medidas" que incluya:
- Nombre de la medida
- Carpeta de visualización (si tiene)
- Fórmula DAX resumida
- Descripción funcional en lenguaje de negocio (máximo 20 palabras)
- Dependencias principales (tablas o medidas base que utiliza)`,
        },
        {
          titulo: "Prompt 3: Auditar rendimiento y antipatrones DAX",
          lenguaje: "prompt",
          codigo: `Revisa todas las medidas del modelo conectado y busca antipatrones DAX:
1. Uso de operador "/" en lugar de DIVIDE().
2. Uso de FILTER(Tabla, ...) en lugar de filtros booleanos simples dentro de CALCULATE().
3. Columnas calculadas que podrían reemplazarse por medidas.
No apliques cambios todavía. Lista cada hallazgo con: nombre de medida, problema detectado, impacto y propuesta de código corregido.`,
        },
        {
          titulo: "Prompt 4: Crear medidas nuevas con formato y validación",
          lenguaje: "prompt",
          codigo: `En la tabla "_Medidas" del modelo conectado, crea dos medidas nuevas:
1. "Venta Neta YTD": acumulado anual de [Venta Neta] usando la columna 'Dim_Calendario'[Fecha]. Formato moneda sin decimales ($#,##0).
2. "Variación YoY %": variación porcentual de [Venta Neta] respecto al mismo período del año anterior usando SAMEPERIODLASTYEAR('Dim_Calendario'[Fecha]), protegida con DIVIDE(). Formato 0,0%.
Después de crearlas, ejecuta una consulta DAX de validación por año para comprobar que ambas devuelven valores coherentes.`,
        },
      ],
      captura: {
        id: "mcp-power-bi-claude-paso-4",
        alt: "Conversación en Claude Desktop ejecutando herramientas MCP para auditar y crear medidas DAX en Power BI",
        caption:
          "Claude invoca las herramientas del servidor MCP para inspeccionar el modelo, proponer mejoras y validar medidas DAX.",
        ratio: "16/9",
      },
      verificaResultado:
        "Abre la vista de Modelo o Vista de Datos en Power BI Desktop y comprueba que las medidas creadas aparecen en la carpeta/tabla indicada, con el formato correcto y sin íconos de advertencia amarilla. Contrasta los totales de la consulta DAX de prueba contra una matriz visual rápida en el lienzo.",
    },
    {
      id: "seguridad-permisos-riesgos",
      titulo: "5. Seguridad, permisos y riesgos de escritura directa",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa qué metadatos salen hacia el modelo de IA y establece reglas para prevenir modificaciones accidentales en modelos críticos.",
      parrafos: [
        "Conectar un asistente agéntico a Power BI introduce riesgos operacionales distintos a los de un chat tradicional. Cuando trabajas con MCP, el servidor envía al cliente los nombres de tablas, columnas, medidas DAX, expresiones de seguridad a nivel de fila (RLS) y, si ejecutas consultas de validación, muestras agregadas o filas de resultados.",
        "Por eso es obligatorio revisar las políticas de privacidad y retención de datos de tu plan de Claude (según support.claude.com, consultado el 21 de noviembre de 2026, los planes comerciales y empresariales tienen tratamientos distintos respecto al entrenamiento frente a cuentas personales gratuitas). Nunca conectes modelos que contengan datos confidenciales de remuneraciones, RUT de clientes o información financiera reservada desde una cuenta personal no autorizada.",
        "El segundo frente de riesgo es la escritura directa sobre el modelo tabular. En Claude Desktop, cada vez que una herramienta MCP intenta modificar el modelo, el cliente solicita confirmación manual. El error humano más común es aprobar en automático sin leer qué parámetros está pasando el agente.",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Auditoría previa antes de autorizar cambios masivos",
          lenguaje: "prompt",
          codigo: `Antes de ejecutar cualquier herramienta de escritura en el modelo:
1. Enumera exactamente qué objetos (tablas, columnas, medidas o relaciones) vas a crear, modificar o eliminar.
2. Indica si alguna visual existente del informe podría romperse por cambios de nombre.
3. Espera mi confirmación explícita en el siguiente mensaje antes de invocar la herramienta de modificación.`,
        },
      ],
      lista: [
        "No apruebes llamadas de escritura en masa sin haber guardado una copia del archivo .pbix o un commit limpio en Git.",
        "Evita exponer tablas con datos personales en consultas DAX de prueba: pide agregaciones por categoría o año en lugar de TOPN de registros individuales.",
        "Desactiva o comenta el servidor MCP en claude_desktop_config.json cuando trabajes con archivos confidenciales que no deben interactuar con IA.",
      ],
      captura: {
        id: "mcp-power-bi-claude-paso-5",
        alt: "Diálogo de confirmación de herramienta MCP en Claude Desktop pidiendo permiso antes de modificar el modelo",
        caption:
          "Revisa siempre el nombre de la herramienta y sus argumentos JSON antes de autorizar una escritura en Power BI.",
        ratio: "16/9",
      },
      verificaResultado:
        "Comprueba que en tu flujo de trabajo Claude detiene el plan y lista los cambios propuestos antes de modificar el archivo. Si necesitas una capa adicional de seguridad, utiliza proyectos PBIP en Git y revisa el diff de los archivos .tmdl antes de aceptar los cambios.",
    },
    {
      id: "limitaciones-actuales",
      titulo: "6. Limitaciones actuales que debes tener en cuenta",
      esPasoHowTo: false,
      parrafos: [
        "Aunque la integración vía MCP acelera enormemente la documentación y el modelado tabular, no reemplaza el criterio de arquitectura ni cubre todo el ciclo de vida de Power BI. Conocer sus límites evita frustraciones en entregas con plazos ajustados.",
        "En primer lugar, el servidor de autoría y modelado trabaja sobre el modelo semántico (tablas, relaciones, DAX, TMDL), no sobre el diseño visual completo de las páginas del informe como posicionamiento milimétrico de tarjetas, paletas de tema o interacciones visuales complejas.",
        "En segundo lugar, las ventanas de contexto de los modelos de lenguaje tienen un límite práctico. En modelos corporativos gigantes con cientos de tablas y miles de medidas, pedirle a Claude que analice todo de una sola vez puede saturar la conversación o generar respuestas incompletas; conviene trabajar por carpetas de medidas o áreas funcionales.",
        "Finalmente, la conectividad local depende de Windows y de que Power BI Desktop esté ejecutándose con el modelo cargado en memoria (o apuntando a archivos PBIP locales). Si trabajas en macOS, no podrás levantar Power BI Desktop de forma nativa para usar el flujo local.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Claude Desktop no muestra el servidor MCP después de editar el JSON",
      causa:
        "Error de sintaxis en claude_desktop_config.json (comas finales, barras invertidas sin duplicar) o no haber cerrado completamente Claude desde la bandeja del sistema.",
      solucion:
        "Valida el JSON en un editor como VS Code, asegúrate de usar \\\\ en rutas de Windows y cierra Claude Desktop completamente desde el Administrador de tareas o la bandeja antes de reabrirlo.",
    },
    {
      error: "El servidor arranca pero no detecta el archivo .pbix abierto",
      causa:
        "Power BI Desktop no estaba abierto al momento de consultar, o existen múltiples ventanas de Power BI Desktop abiertas y el agente no sabe a cuál conectarse.",
      solucion:
        "Deja abierta una sola instancia de Power BI Desktop con el modelo objetivo cargado antes de pedirle a Claude que inspeccione el esquema.",
    },
    {
      error: "Medidas creadas por Claude devuelven error de sintaxis o valores en blanco",
      causa:
        "El modelo de IA asumió nombres de columnas o relaciones que no existen, o usó una función de inteligencia de tiempo sin una tabla de fechas marcada correctamente.",
      solucion:
        "Pídele primero a Claude que liste las tablas y relaciones reales del modelo y ejecuta siempre una consulta DAX de validación tras crear cada medida.",
    },
    {
      error: "El chat se vuelve lento o pierde foco en modelos muy grandes",
      causa:
        "Intentar volcar cientos de tablas y medidas completas en un único turno de conversación.",
      solucion:
        "Acota tus prompts por tabla de hechos o carpeta de medidas, y abre conversaciones nuevas para cada módulo funcional del modelo.",
    },
  ],
  plantilla: {
    titulo: "Checklist de auditoría y configuración MCP para Power BI",
    descripcion:
      "Próximamente: plantilla descargable con el archivo base claude_desktop_config.json comentado y lista de verificación de seguridad para equipos de BI.",
  },
  faqs: [
    {
      q: "¿Necesito pagar una suscripción para usar MCP con Claude Desktop y Power BI?",
      a: "Claude Desktop permite configurar servidores MCP locales en su aplicación de escritorio; sin embargo, los límites de uso, acceso a modelos avanzados y políticas de privacidad empresarial dependen del plan vigente de Claude que utilices (según support.claude.com, consultado el 21 de noviembre de 2026).",
    },
    {
      q: "¿El servidor MCP de Power BI es oficial de Microsoft?",
      a: "Sí. Microsoft documenta oficialmente en Microsoft Learn el Power BI Authoring MCP server (también referido como Power BI Modeling MCP) para tareas de modelado y autoría, además de opciones orientadas a consumo de datos gobernados.",
    },
    {
      q: "¿Puede Claude ver las filas de mis tablas de clientes o sueldos?",
      a: "Por defecto las herramientas de modelado inspeccionan metadatos (tablas, columnas, medidas y relaciones). Sin embargo, si el servidor dispone de herramientas para ejecutar consultas DAX y tú o el agente las invocan, los resultados devueltos por la consulta sí entran en el contexto de la conversación. Evita consultar datos sensibles.",
    },
    {
      q: "¿Funciona en Mac usando Power BI en la nube?",
      a: "Power BI Desktop y el flujo local conectado a instancias de Desktop requieren Windows. Para trabajar desde modelos publicados en Fabric/Power BI Service, Microsoft ofrece una modalidad de endpoint alojado en vista previa documentada en Microsoft Learn.",
    },
    {
      q: "¿Qué pasa si Claude modifica una medida o relación y rompe mi informe?",
      a: "Si no guardaste el archivo .pbix aún, puedes cerrar sin guardar o deshacer según corresponda; pero la práctica segura es mantener siempre una copia de respaldo previa o trabajar sobre un proyecto PBIP controlado con Git.",
    },
  ],
  relacionadas: [
    "ia-para-power-bi-dax",
    "copilot-en-power-bi",
    "tabla-calendario-power-bi-dax",
  ],
  enlacesExternos: [
    {
      label: "Power BI MCP server documentation",
      url: "https://learn.microsoft.com/power-bi/developer/mcp/mcp-servers-overview/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Power BI Authoring MCP server guide",
      url: "https://learn.microsoft.com/power-bi/developer/mcp/authoring-server",
      fuente: "Microsoft Learn",
    },
    {
      label: "Model Context Protocol — Connect to local MCP servers",
      url: "https://modelcontextprotocol.io/docs/develop/connect-local-servers",
      fuente: "Model Context Protocol",
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
      descripcion: "Aprende a estructurar prompts analíticos y proteger datos sensibles en Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa práctica para elegir la mejor IA en tareas de BI, código y SQL.",
    },
    {
      label: "Curso de Claude aplicado a datos y productividad",
      href: "/cursos/claude",
      descripcion: "Domina flujos avanzados con Claude, Projects, artefactos y MCP.",
    },
  ],
};

export default guia;
