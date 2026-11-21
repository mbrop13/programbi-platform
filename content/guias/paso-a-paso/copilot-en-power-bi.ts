import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "copilot-en-power-bi",
  title: "Copilot en Power BI: requisitos, licencia y cómo usarlo",
  meta: "Qué necesitas para usar Copilot en Power BI (licencia y capacidad), cómo activarlo y cómo crear páginas, resúmenes y medidas DAX con IA. Guía 2026.",
  h1: "Cómo usar Copilot en Power BI: requisitos y casos prácticos",
  subtitle:
    "Guía técnica actualizada para habilitar Copilot en Microsoft Fabric y Power BI, preparar tu modelo semántico para lenguaje natural y aprovechar prompts reales en páginas de informe, resúmenes narrativos y vista de consulta DAX.",
  keywordPrincipal: "copilot power bi",
  keywords: [
    "copilot power bi",
    "cómo usar Copilot en Power BI",
    "licencia Copilot Power BI",
    "Copilot para DAX",
  ],
  curso: "power-bi",
  cursoSecundario: "copilot",
  herramienta: "Power BI",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Copilot en Power BI procesa metadatos del modelo semántico y resultados de consultas dentro del entorno de Microsoft Fabric bajo los límites de cumplimiento de tu inquilino. Antes de activarlo, confirma con el administrador de Microsoft 365 / Fabric las políticas de procesamiento geográfico y asegúrate de que los permisos de seguridad a nivel de fila (RLS) estén correctamente configurados en el modelo.",
  en30Segundos: {
    queLogras:
      "Verificar si tu empresa cumple los requisitos de capacidad Fabric y licencia para Copilot en Power BI, activarlo en el portal de administración y usar prompts efectivos para crear páginas, narrativas y medidas DAX.",
    herramienta: "Power BI Desktop y Power BI Service (Microsoft Fabric)",
    tiempo: "25 minutos",
    bullets: [
      "Distinguir qué capacidad Fabric (F2+ vs F64+ / Premium P1+) y licencia de usuario exige Microsoft.",
      "Habilitar Copilot en el portal de administración de Fabric y asignar el área de trabajo.",
      "Preparar nombres, descripciones y sinónimos del modelo semántico para que Copilot no alucine columnas.",
      "Generar páginas de informe, resúmenes narrativos y consultas DAX verificables con prompts concretos.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Requisitos y licencias",
      resumen: "Valida capacidad Fabric paga y permisos por usuario.",
      anchorId: "requisitos-y-licencias",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Activar Copilot",
      resumen: "Habilita el inquilino en Fabric Admin Portal y asigna workspace.",
      anchorId: "activar-copilot",
      icono: "settings",
    },
    {
      numero: 3,
      titulo: "Preparar modelo",
      resumen: "Limpia nombres, oculta claves y agrega descripciones.",
      anchorId: "preparar-modelo-semantico",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Páginas con prompt",
      resumen: "Crea borradores de páginas desde el panel lateral.",
      anchorId: "crear-pagina-informe",
      icono: "chart",
    },
    {
      numero: 5,
      titulo: "Narrativas y DAX",
      resumen: "Redacta resúmenes automáticos y genera medidas en DAX Query View.",
      anchorId: "resumenes-y-dax",
      icono: "code",
    },
    {
      numero: 6,
      titulo: "Límites y errores",
      resumen: "Conoce qué no puede hacer Copilot y cómo resolver bloqueos.",
      anchorId: "limites-actuales",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Power BI Service en capacidad Microsoft Fabric + Power BI Desktop actualizado",
    lista: [
      "Capacidad paga de Microsoft Fabric (SKU F2 o superior) o Power BI Premium (P1 o superior) asignada al área de trabajo, según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026).",
      "Licencia Power BI Pro o Premium Per User (PPU) con permisos de creación o compilación para editar informes y modelos.",
      "Configuración de inquilino habilitada por un administrador de Fabric en el portal de administración.",
    ],
    compatibilidadMacWeb:
      "Copilot para consumo de informes, resúmenes narrativos y creación web funciona directamente en el navegador dentro de Power BI Service (compatible con Windows y Mac). La edición de modelos semánticos avanzados y el uso de Copilot en la vista de consulta DAX en local requieren Power BI Desktop sobre Windows.",
  },
  herramientasHowTo: ["Portal de administración de Fabric", "Power BI Service", "Power BI Desktop"],
  insumosHowTo: ["Área de trabajo en capacidad Fabric", "Modelo semántico publicado y documentado"],
  secciones: [
    {
      id: "requisitos-y-licencias",
      titulo: "1. Requisitos y licencias de Copilot en Power BI",
      parrafos: [
        "La duda más frecuente antes de probar Copilot en Power BI es por qué no aparece el botón en el escritorio aunque la empresa ya pague licencias Power BI Pro o Copilot para Microsoft 365. La razón es arquitectónica: Copilot en Power BI no se licencia por separado como complemento individual de Office, sino que se respalda en la capacidad de cómputo asignada al área de trabajo dentro de Microsoft Fabric.",
        "Según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026), necesitas cumplir simultáneamente tres condiciones: contar con una capacidad paga de Microsoft Fabric (SKU F2 o superior) o una capacidad Power BI Premium (P1 o superior) —las capacidades de prueba gratuita no están soportadas—; asignar el área de trabajo donde vive tu informe o modelo a esa capacidad; y habilitar los interruptores correspondientes en la configuración del inquilino.",
        "Adicionalmente, existe una diferencia clave entre capacidades pequeñas (F2 a F32) y capacidades grandes (F64 o superior / P1 o superior): mientras Copilot funciona desde F2 para quienes tienen licencia Pro o PPU, los usuarios con licencia gratuita (Free) solo pueden ver e interactuar con contenido hospedado en capacidades F64+ o P1+. Para revisar qué licencia de usuario te conviene según tu equipo, consulta también nuestra guía sobre licencias de Power BI en Chile.",
      ],
      tabla: {
        caption: "Disponibilidad de Copilot en Power BI según capacidad y rol (fuente: Microsoft Learn, consultado el 21 de noviembre de 2026)",
        encabezados: [
          "Escenario de licenciamiento",
          "¿Habilita Copilot?",
          "Quién puede crear con Copilot",
          "Quién puede consumir resúmenes",
        ],
        filas: [
          [
            "Workspace compartido sin capacidad (solo Power BI Pro)",
            "No",
            "Ninguno",
            "Ninguno",
          ],
          [
            "Capacidad de prueba (Fabric Trial)",
            "No",
            "Ninguno",
            "Ninguno",
          ],
          [
            "Capacidad Fabric F2 a F32",
            "Sí",
            "Usuarios con Pro o PPU y permiso de edición",
            "Solo usuarios con licencia Pro o PPU",
          ],
          [
            "Capacidad Fabric F64+ o Premium P1+",
            "Sí",
            "Usuarios con Pro o PPU y permiso de edición",
            "Usuarios Pro, PPU y lectores con licencia Free",
          ],
        ],
      },
    },
    {
      id: "activar-copilot",
      titulo: "2. Activar Copilot en el inquilino y el área de trabajo",
      esPasoHowTo: true,
      resumenHowTo:
        "Habilita la configuración de Copilot y Azure OpenAI en el portal de administración de Fabric y vincula tu área de trabajo a la capacidad paga.",
      parrafos: [
        "Si tienes rol de administrador de Fabric (o coordinas con el equipo de TI), el primer paso es ingresar a Power BI Service, abrir el engranaje de Configuración en la esquina superior derecha y entrar al Portal de administración > Configuración de inquilinos.",
        "Dentro de la sección «Copilot y Azure OpenAI», activa la opción «Los usuarios pueden usar Copilot y otras características con tecnología de Azure OpenAI». Microsoft permite habilitarla para toda la organización o restringirla a grupos de seguridad específicos para hacer un piloto controlado con el equipo de BI.",
        "Si tu inquilino está alojado en una región donde el procesamiento de Azure OpenAI ocurre fuera de tu límite geográfico (algo común en empresas de Chile cuyo tenant está en Sudamérica), el administrador también deberá revisar las opciones de procesamiento y almacenamiento entre regiones geográficas según la política de seguridad de la empresa.",
      ],
      lista: [
        "Abre Portal de administración > Configuración de inquilinos > Copilot y Azure OpenAI.",
        "Habilita el interruptor principal y define si aplica a toda la empresa o a un grupo piloto.",
        "En el área de trabajo de destino, ve a Configuración del área de trabajo > Información de licencia y selecciona Fabric capacity o Premium.",
        "En Power BI Desktop, abre Archivo > Opciones > Características de versión preliminar o configuración de Copilot y selecciona el área de trabajo con capacidad activa cuando se te solicite.",
      ],
      captura: {
        id: "copilot-en-power-bi-paso-1",
        alt: "Portal de administración de Microsoft Fabric mostrando la configuración de Copilot y Azure OpenAI habilitada",
        caption:
          "El botón de Copilot solo aparece cuando el interruptor del inquilino está activo y el workspace apunta a una capacidad paga.",
        ratio: "16/9",
      },
      verificaResultado:
        "Abre un informe en modo Edición dentro del área de trabajo asignada y confirma que el ícono de Copilot aparece visible en la cinta superior.",
    },
    {
      id: "preparar-modelo-semantico",
      titulo: "3. Preparar el modelo semántico para Copilot",
      esPasoHowTo: true,
      resumenHowTo:
        "Estandariza nombres de tablas y columnas en español claro, oculta claves técnicas y documenta descripciones de medidas antes de abrir Copilot.",
      parrafos: [
        "Copilot no adivina el negocio por telepatía: lee los nombres de tus tablas, columnas, medidas, jerarquías y las descripciones que hayas cargado en el modelo semántico. Si tu modelo tiene columnas llamadas col_01, fch_doc, id_cli_fk y tres medidas duplicadas llamadas Venta, Ventas 2 y Venta_Test, el panel de Copilot producirá gráficos confusos o elegirá la columna incorrecta.",
        "Invertir diez minutos en ordenar el modelo semántico multiplica la precisión de Copilot tanto como de cualquier analista nuevo que abra tu archivo .pbix.",
      ],
      lista: [
        "Renombra columnas crípticas a lenguaje de negocio (por ejemplo, MontoNetoCLP en vez de mnt_nt_01).",
        "Oculta en la vista de modelo todas las columnas técnicas de clave foránea (ClienteID, ProductoID) y fechas de la tabla de hechos para que Copilot use exclusivamente la dimensión Calendario.",
        "Agrega una descripción breve en el panel Propiedades de cada medida clave (por ejemplo: «Margen bruto porcentual calculado como (Venta Neta - Costo) / Venta Neta»).",
        "Verifica los resúmenes predeterminados: marca las columnas de código postal o año numérico como «No resumir» para evitar que Copilot las sume por error.",
      ],
      captura: {
        id: "copilot-en-power-bi-paso-2",
        alt: "Vista de modelo en Power BI Desktop mostrando descripciones de medidas y claves técnicas ocultas",
        caption:
          "Ocultar claves foráneas y documentar descripciones en el panel Propiedades mejora drásticamente los prompts en lenguaje natural.",
        ratio: "16/9",
      },
      verificaResultado:
        "Cambia a la Vista de informe y revisa el panel Campos a la derecha: un usuario de negocio debería entender cada carpeta, tabla y medida sin ver abreviaturas internas de base de datos.",
    },
    {
      id: "crear-pagina-informe",
      titulo: "4. Crear una página de informe con un prompt",
      esPasoHowTo: true,
      resumenHowTo:
        "Abre el panel de Copilot en modo Edición, solicita un esquema de página específico con KPIs y visuales concretos, y ajusta el borrador generado.",
      parrafos: [
        "Una vez preparado el modelo, abre el panel lateral de Copilot desde la cinta de opciones. Puedes pedirle sugerencias de contenido si estás en blanco, pero obtendrás resultados mucho más útiles si especificas exactamente qué pregunta de negocio responde la página, qué métricas van en tarjetas y qué dimensiones van en los gráficos.",
        "Trata la página generada por Copilot como un primer borrador estructurado: te ahorra armar diez contenedores desde cero, pero siempre debes revisar el ordenamiento de ejes, el formato de moneda (CLP sin decimales) y la interacción entre filtros.",
      ],
      codigos: [
        {
          titulo: "Prompt 1 — Crear página ejecutiva de desempeño comercial",
          lenguaje: "prompt",
          codigo: `Crea una página de informe llamada "Resumen Comercial" orientada a gerencia.
Incluye en la parte superior tarjetas con Venta Neta, Costo Total, Margen % y Variacion YoY %.
Agrega un gráfico de líneas con la evolución mensual de Venta Neta por MesNombre, un gráfico de barras horizontales con Venta Neta por Categoria y una matriz con desglose por Sucursal.
Incluye segmentadores de Anio y Region.`,
        },
        {
          titulo: "Prompt 2 — Crear página enfocada en detección de caídas",
          lenguaje: "prompt",
          codigo: `Diseña una página llamada "Alertas de Margen" enfocada en identificar categorías y sucursales con caída de rentabilidad.
Muestra una tabla ordenada de menor a mayor por Variacion YoY % con Venta Neta y Margen %, y un gráfico de dispersión comparando Venta Neta frente a Margen % por Subcategoria.`,
        },
      ],
      captura: {
        id: "copilot-en-power-bi-paso-3",
        alt: "Panel lateral de Copilot en Power BI generando una página de informe con tarjetas KPI y gráficos",
        caption:
          "Especificar los nombres exactos de medidas y dimensiones en el prompt reduce la necesidad de reconfigurar ejes después.",
        ratio: "16/9",
      },
      verificaResultado:
        "Revisa cada visual creado por Copilot: confirma que el eje temporal esté ordenado cronológicamente por MesNum y que las tarjetas muestren el formato numérico correcto.",
    },
    {
      id: "resumenes-y-dax",
      titulo: "5. Resúmenes narrativos y generar/explicar DAX",
      esPasoHowTo: true,
      resumenHowTo:
        "Configura el objeto visual de narrativa inteligente con Copilot y utiliza la vista de consulta DAX para generar, comentar y auditar medidas.",
      parrafos: [
        "El segundo gran uso dentro del informe es el objeto visual Narrativa con Copilot. A diferencia de una caja de texto estática, este visual resume automáticamente los puntos clave de la página completa o de visuales seleccionados, y puede actualizar el relato cuando el lector cambia un segmentador.",
        "El tercer uso —y probablemente el favorito de quienes desarrollan modelos— vive en la Vista de consulta DAX (DAX Query View) de Power BI Desktop. Allí puedes pedirle a Copilot que escriba una medida nueva usando el contexto real de tu modelo o seleccionar una medida heredada de otro analista para que la explique en español claro.",
      ],
      codigos: [
        {
          titulo: "Prompt 3 — Narrativa ejecutiva acotada a cifras reales",
          lenguaje: "prompt",
          codigo: `Resume en máximo 4 viñetas los hallazgos principales de esta página para una reunión semanal de directorio.
Destaca la sucursal con mayor crecimiento interanual, la categoría con menor margen porcentual y la tendencia del último trimestre.
Usa un tono directo y cita únicamente cifras visibles en los gráficos.`,
        },
        {
          titulo: "Prompt 4 — Generar medida DAX en DAX Query View",
          lenguaje: "prompt",
          codigo: `Crea una medida DAX llamada [Ticket Promedio Neta] que divida [Venta Neta] por el conteo distinto de Ventas[FolioDocumento], usando DIVIDE para evitar errores por cero.
Además, crea una medida [Venta Acumulada Anual] usando TOTALYTD sobre Calendario[Date].`,
        },
        {
          titulo: "Prompt 5 — Explicar y auditar una medida DAX heredada",
          lenguaje: "prompt",
          codigo: `Explica paso a paso qué hace la medida [Margen Ponderado Canal], qué filtros de tabla modifica CALCULATE y si existe algún riesgo cuando una sucursal no tiene ventas en el período seleccionado.`,
        },
        {
          titulo: "Medidas DAX resultantes revisadas para el modelo",
          lenguaje: "dax",
          codigo: `Ticket Promedio Neta =
VAR _Folios = DISTINCTCOUNT(Ventas[FolioDocumento])
RETURN
DIVIDE([Venta Neta], _Folios)

Venta Acumulada Anual =
TOTALYTD(
    [Venta Neta],
    Calendario[Date]
)`,
          nota: "Ejecuta EVALUATE en la vista de consulta DAX para inspeccionar los valores antes de confirmar la actualización del modelo.",
        },
      ],
      captura: {
        id: "copilot-en-power-bi-paso-4",
        alt: "Vista de consulta DAX en Power BI Desktop con Copilot generando y probando medidas con EVALUATE",
        caption:
          "En la vista de consulta DAX puedes probar la medida generada por Copilot con EVALUATE antes de guardarla en el modelo.",
        ratio: "16/9",
      },
      verificaResultado:
        "Presiona Ejecutar en la vista de consulta DAX y compara el resultado de [Ticket Promedio Neta] contra una división manual de Venta Neta / Folios en una tarjeta temporal. Si quieres dominar la lógica detrás de estas funciones, repasa nuestra guía de funciones DAX más importantes.",
    },
    {
      id: "limites-actuales",
      titulo: "6. Límites actuales de Copilot en Power BI",
      parrafos: [
        "Conocer los límites documentados evita frustraciones y te ayuda a decidir cuándo usar Copilot nativo y cuándo conviene apoyarte en Claude o ChatGPT fuera de Power BI (puedes comparar ambos en nuestra guía de Claude vs ChatGPT para análisis de datos o aprender un flujo completo en cómo usar Claude para análisis de datos).",
      ],
      lista: [
        "No edita visuales existentes a la carta en todos los detalles finos: si ya tienes un gráfico armado y quieres cambiar solo un color condicional complejo o una etiqueta personalizada, es más rápido hacerlo en el panel Formato.",
        "No reemplaza el modelado de datos en Power Query: aunque ayuda con DAX y páginas de informe, no diseña por sí solo una arquitectura de bodega de datos ni repara relaciones muchos-a-muchos mal modeladas.",
        "Depende estrictamente de la calidad del modelo semántico: modelos sin tabla calendario, con nombres ambiguos o con decenas de medidas repetidas generan respuestas imprecisas.",
        "Consume unidades de capacidad (CU) de tu capacidad Fabric: en capacidades pequeñas como F2, un uso intensivo simultáneo puede competir con la actualización programada de modelos si no se monitorea el consumo.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "El ícono de Copilot no aparece en Power BI Service ni en Power BI Desktop",
      causa:
        "El área de trabajo está en modo Pro compartido o capacidad Trial, o el administrador de Fabric no ha activado el interruptor de Copilot en el portal de administración.",
      solucion:
        "Verifica que el workspace esté asignado a una capacidad paga Fabric (F2+) o Premium (P1+) y que tu usuario pertenezca al grupo habilitado en la configuración de inquilino.",
    },
    {
      error: "Copilot responde que no encuentra los campos mencionados en el prompt",
      causa:
        "Los nombres de columnas tienen tildes omitidas, guiones bajos o están ocultos en el modelo, o hay varias columnas con nombres similares en tablas distintas.",
      solucion:
        "Usa exactamente el nombre visible de la tabla y medida (por ejemplo, Ventas[MontoNeto]) o limpia y renombra el modelo semántico antes de pedir la página.",
    },
    {
      error: "La narrativa generada muestra variaciones en meses futuros sin datos",
      causa:
        "La tabla calendario llega hasta fin de año y alguna medida base devuelve 0 en vez de BLANK() para los meses sin transacciones.",
      solucion:
        "Ajusta la medida DAX para devolver BLANK() cuando no existan ventas en el período actual y vuelve a regenerar el resumen.",
    },
    {
      error: "Error de permisos al intentar resumir un informe publicado",
      causa:
        "El usuario lector solo tiene acceso en un workspace F2-F32 con licencia Free, o la política de procesamiento geográfico entre regiones está bloqueada.",
      solucion:
        "Confirma que los lectores en capacidades F2-F32 tengan licencia Pro/PPU (o migra a F64+ para lectores Free) y valida la configuración regional con el administrador de Fabric.",
    },
  ],
  plantilla: {
    titulo: "Checklist de preparación de modelo semántico para Copilot",
    descripcion:
      "Próximamente podrás descargar aquí una lista de verificación en PDF/Excel para auditar nombres, descripciones, relaciones y medidas antes de activar Copilot.",
  },
  faqs: [
    {
      q: "¿Si tengo licencia Copilot para Microsoft 365 ya tengo Copilot en Power BI?",
      a: "No automáticamente. Copilot para Microsoft 365 cubre aplicaciones como Excel, Word, Teams y Outlook, mientras que Copilot en Power BI se habilita a través de una capacidad paga de Microsoft Fabric (F2+) o Power BI Premium (P1+) asignada al área de trabajo, según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026).",
    },
    {
      q: "¿Puedo usar Copilot en Power BI Desktop sin tener capacidad Fabric?",
      a: "Necesitas iniciar sesión con una cuenta que tenga acceso al menos a un área de trabajo respaldada por una capacidad Fabric paga (F2+) o Premium (P1+) habilitada para Copilot.",
    },
    {
      q: "¿Copilot respeta la seguridad a nivel de fila (RLS)?",
      a: "Sí. Cuando un usuario consulta datos o genera resúmenes narrativos sobre un modelo con Row-Level Security (RLS) configurado, Copilot opera únicamente sobre los datos que ese usuario tiene permiso de ver.",
    },
    {
      q: "¿Conviene más usar Copilot en Power BI o Claude / ChatGPT?",
      a: "Se complementan: Copilot destaca dentro de Power BI para armar borradores de páginas, narrativas dinámicas y consultas rápidas en DAX Query View sin salir de la herramienta; Claude o ChatGPT destacan cuando necesitas pensar arquitectura desde cero, refactorizar Power Query M complejo o depurar problemas profundos de contexto de filtro.",
    },
  ],
  relacionadas: [
    "ia-para-power-bi-dax",
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
    "licencias-power-bi-precio-chile",
  ],
  enlacesExternos: [
    {
      label: "Información general de Copilot para Power BI",
      url: "https://learn.microsoft.com/es-es/power-bi/create-reports/copilot-introduction",
      fuente: "Microsoft Learn",
    },
    {
      label: "Requisitos de Copilot en Microsoft Fabric",
      url: "https://learn.microsoft.com/es-es/fabric/get-started/copilot-fabric-overview",
      fuente: "Microsoft Learn",
    },
    {
      label: "Habilitar Copilot en el portal de administración de Fabric",
      url: "https://learn.microsoft.com/es-es/fabric/admin/service-admin-portal-copilot",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Funciones DAX más importantes",
      href: "/guias/funciones-dax-mas-importantes",
      descripcion: "Aprende a auditar y entender las medidas DAX que genera Copilot.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Flujo alternativo y complementario con Claude para modelos y datos.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa técnica para elegir asistente fuera del ecosistema Fabric.",
    },
  ],
};

export default guia;
