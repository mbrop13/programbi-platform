import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "automatizar-reportes-con-power-bi",
  title: "Cómo automatizar reportes con Power BI (guía completa 2026)",
  meta: "Deja de armar reportes a mano: conecta tus fuentes, programa la actualización, usa gateway y envía suscripciones automáticas en Power BI. Paso a paso.",
  h1: "Cómo automatizar tus reportes con Power BI de principio a fin",
  subtitle:
    "Diseña un flujo completo de reportería sin intervención manual: desde fuentes en la nube o bases locales hasta la actualización programada con gateway, alertas y envío automático por correo.",
  keywordPrincipal: "automatizar reportes con Power BI",
  keywords: [
    "automatizar reportes con Power BI",
    "actualizacion programada Power BI",
    "gateway Power BI",
    "enviar reportes Power BI automaticamente",
  ],
  curso: "power-bi",
  herramienta: "Power BI",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT45M",
  esInsignia: true,
  en30Segundos: {
    queLogras:
      "Un reporte en Power BI que lee archivos o bases de datos actualizadas, aplica limpieza automática en Power Query, se refresca solo en la nube y avisa o llega por correo sin que abras Desktop cada semana.",
    herramienta: "Power BI Desktop + Power BI Service (nube) + Gateway opcional",
    tiempo: "45 minutos de configuración inicial",
    bullets: [
      "Evaluar qué reportes conviene automatizar según frecuencia y estabilidad de origen.",
      "Conectar orígenes en SharePoint, carpetas o SQL sin rutas locales frágiles.",
      "Estandarizar la limpieza en Power Query con parámetros y código M reutilizable.",
      "Configurar actualización programada, puerta de enlace (gateway) y suscripciones.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Diagnóstico",
      resumen: "Prioriza reportes repetitivos con fuentes estables.",
      anchorId: "diagnostico-que-automatizar",
      icono: "check",
    },
    {
      numero: 2,
      titulo: "Arquitectura",
      resumen: "Separa fuentes, Power Query, modelo y servicio web.",
      anchorId: "arquitectura-flujo-power-bi",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Fuentes vivas",
      resumen: "Conecta OneDrive, SharePoint, SQL o APIs sin archivos sueltos.",
      anchorId: "conectar-fuentes-actualizables",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Power Query M",
      resumen: "Parametriza rutas y consolida carpetas automáticamente.",
      anchorId: "transformaciones-repetibles-power-query",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Modelo y DAX",
      resumen: "Crea medidas limpias y timestamp de última actualización.",
      anchorId: "modelo-medidas-reutilizables",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Servicio y Gateway",
      resumen: "Publica, vincula credenciales y programa refrescos diarios.",
      anchorId: "actualizacion-programada-gateway",
      icono: "refresh",
    },
    {
      numero: 7,
      titulo: "Distribución",
      resumen: "Activa suscripciones, alertas de datos y Power Automate.",
      anchorId: "suscripciones-alertas-correo",
      icono: "mail",
    },
  ],
  requisitos: {
    version: "Power BI Desktop (Windows) + Cuenta en Power BI Service (Microsoft 365 / Fabric)",
    lista: [
      "Power BI Desktop actualizado en Windows para construir el modelo y las consultas.",
      "Cuenta organizacional en Power BI Service (licencia Pro, Premium por usuario o capacidad Fabric para programar y compartir en equipo).",
      "Acceso a tus orígenes de datos (OneDrive/SharePoint, carpeta compartida de red, SQL Server o API).",
      "On-premises data gateway instalado en un equipo o servidor encendido si tus fuentes están en red local y no en la nube.",
    ],
    compatibilidadMacWeb:
      "Power BI Desktop es nativo de Windows (en Mac requiere máquina virtual o escritorio remoto). Una vez publicado, el servicio web, la programación de refrescos y las suscripciones se administran desde cualquier navegador.",
  },
  herramientasHowTo: [
    "Power BI Desktop",
    "Power BI Service",
    "On-premises data gateway (cuando hay orígenes locales)",
  ],
  insumosHowTo: [
    "Orígenes de datos estructurados en nube o servidor local",
    "Espacio de trabajo (Workspace) en Power BI Service",
  ],
  secciones: [
    {
      id: "diagnostico-que-automatizar",
      titulo: "1. Diagnóstico: qué reporte conviene automatizar primero",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa frecuencia de entrega, cantidad de fuentes manuales y estabilidad del formato para elegir el reporte candidato con mayor retorno de tiempo.",
      parrafos: [
        "No todos los reportes merecen el mismo nivel de ingeniería desde el día uno. Un análisis puntual que se pide una sola vez al año para una presentación específica se resuelve más rápido en Excel. En cambio, cualquier informe semanal o mensual donde repites exactamente los mismos clics —descargar CSV del ERP, borrar filas de encabezado, cruzar con BUSCARV, copiar a una tabla dinámica y pegar pantallazos en un correo— es un candidato ideal para automatizar reportes con Power BI.",
        "Antes de abrir Power BI Desktop, audita el proceso actual durante una corrida completa. Anota de dónde sale cada archivo, quién lo deposita, si cambia el nombre de las columnas cada mes y cuánto tiempo dedicas a validarlo. Si el origen cambia de estructura todas las semanas porque alguien edita el formato a mano, el primer paso no es Power BI sino estandarizar la plantilla de entrada.",
        "La siguiente tabla muestra una comparación de referencia —como ejemplo ilustrativo de un flujo semanal típico de cierre comercial— entre un proceso manual en hojas sueltas y el mismo flujo automatizado en Power BI.",
      ],
      tabla: {
        caption: "Ejemplo ilustrativo: comparación de esfuerzo semanal antes y después de automatizar un reporte comercial",
        encabezados: [
          "Etapa del reporte semanal",
          "Proceso manual tradicional (ejemplo ilustrativo)",
          "Flujo automatizado en Power BI",
        ],
        filas: [
          [
            "Recolección y descarga de archivos",
            "0,5 horas (descargar CSVs y guardarlos por fecha)",
            "0 horas (lectura directa desde SharePoint o SQL)",
          ],
          [
            "Limpieza, cruces y validación",
            "1,5 horas (quitar duplicados, cruzar códigos, revisar fórmulas)",
            "0 horas (pasos guardados en Power Query)",
          ],
          [
            "Actualización de gráficos y envío",
            "0,5 horas (ajustar rangos, exportar PDF y redactar correo)",
            "0 horas (refresco programado + suscripción por correo)",
          ],
          [
            "Revisión de excepciones o calidad",
            "Incluida de forma reactiva al encontrar errores",
            "0,2 horas (monitoreo puntual si falla un origen)",
          ],
        ],
      },
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-1",
        alt: "Matriz de evaluación en tabla mostrando criterios de frecuencia, estabilidad de fuentes y esfuerzo para priorizar reportes a automatizar",
        caption:
          "Prioriza reportes recurrentes con reglas de negocio claras y orígenes estables.",
        ratio: "16/9",
      },
    },
    {
      id: "arquitectura-flujo-power-bi",
      titulo: "2. Arquitectura completa: fuentes, Power Query, modelo y servicio",
      esPasoHowTo: true,
      resumenHowTo:
        "Estructura tu solución en cuatro capas desacopladas: almacenamiento de origen, extracción y limpieza en Power Query, modelo relacional en estrella con DAX, y publicación en Power BI Service.",
      parrafos: [
        "El secreto para que una automatización no se rompa al segundo mes es separar responsabilidades por capas. Cuando alguien conecta un archivo de su escritorio, mezcla tablas sin relación y escribe cálculos complejos dentro de columnas visuales, cualquier cambio mínimo obliga a rehacer el informe entero.",
        "En una arquitectura sana distinguimos cuatro eslabones. El primero es la capa de almacenamiento: un lugar estable donde caen los datos (SharePoint, OneDrive para la Empresa, una carpeta de red respaldada o una base de datos SQL). El segundo es Power Query, encargado exclusivamente de leer esos orígenes, tipar columnas, anular dinamizaciones y dejar tablas limpias.",
        "El tercer eslabón es el modelo semántico: tablas de hechos (ventas, movimientos, horas) relacionadas con tablas de dimensiones (calendario, clientes, productos) y medidas DAX reutilizables. El cuarto es Power BI Service en la nube, donde viven las credenciales, la programación de actualizaciones, las alertas y las suscripciones de los usuarios finales.",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-arquitectura",
        alt: "Diagrama de arquitectura de automatización en Power BI: Orígenes de datos hacia Power Query, Modelo Semántico DAX y Power BI Service con Gateway y Suscripciones",
        caption:
          "Arquitectura de cuatro capas que desacopla el origen de datos de la visualización y distribución.",
        ratio: "16/9",
      },
    },
    {
      id: "conectar-fuentes-actualizables",
      titulo: "3. Conectar fuentes que sí se actualizan solas (y evitar rutas locales)",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta tus archivos mediante URLs de SharePoint u OneDrive, carpetas compartidas o motores SQL en vez de rutas personales como C:\\Users\\tu-nombre.",
      parrafos: [
        "El tropiezo número uno al publicar un reporte es usar conectores que apuntan al disco duro local de un computador personal. Si conectas un Excel usando Archivo > Libro de Excel desde C:\\Users\\Manuel\\Downloads\\ventas.xlsx, cuando publiques el informe en la nube Power BI Service no podrá leer tu carpeta de Descargas a menos que instales un gateway y mantengas tu notebook encendido justo a la hora del refresco.",
        "Siempre que trabajes con archivos de Excel o CSV en Microsoft 365, guárdalos en una biblioteca de SharePoint o en OneDrive para la Empresa y conéctalos usando la ruta web HTTPS (desde Power BI Desktop con el conector Web o SharePoint Folder). Así la actualización ocurre directo de nube a nube, sin depender de ningún computador encendido.",
        "Si tus datos provienen de un ERP o sistema interno en SQL Server, PostgreSQL o una API REST, conéctate directamente al motor o endpoint en lugar de exportar Excel intermedios. Puedes profundizar en la limpieza avanzada de archivos en nuestra guía /guias/automatizar-excel-con-power-query, en la conexión directa de bases en /guias/conectar-power-bi-a-sql-server y en el armado visual base en /guias/dashboard-de-ventas-en-power-bi-paso-a-paso.",
      ],
      lista: [
        "Archivos en la nube (OneDrive / SharePoint): conector ideal porque permite refresco 100% cloud sin gateway.",
        "Carpetas de archivos mensuales en red local: usa el conector Carpeta apuntando a ruta UNC (\\\\servidor\\carpeta) y requerirá gateway.",
        "Bases de datos SQL internas: conexión directa al servidor/instancia con cuenta de servicio de solo lectura y gateway estándar.",
        "APIs web públicas o privadas: conector Web con encabezados HTTP y manejo de paginación en Power Query.",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-3",
        alt: "Ventana Obtener datos de Power BI Desktop mostrando conectores de Carpeta de SharePoint, SQL Server y Web",
        caption:
          "Elige conectores nativos de nube o servidor para que Power BI Service pueda refrescar los datos de forma autónoma.",
        ratio: "16/9",
      },
    },
    {
      id: "transformaciones-repetibles-power-query",
      titulo: "4. Configurar transformaciones repetibles y parámetros en Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea un parámetro para la ruta o URL de origen y usa Folder.Files con filtros en Power Query para consolidar archivos nuevos automáticamente.",
      parrafos: [
        "Una vez conectado al origen, todo lo que hagas dentro del Editor de Power Query queda grabado como pasos secuenciales en lenguaje M. Cada vez que se ejecute una actualización automática, Power BI repetirá exactamente esa secuencia de limpieza sobre los datos nuevos.",
        "Para evitar que los cambios de ambiente (por ejemplo, pasar de una carpeta de pruebas a la carpeta productiva) te obliguen a editar diez consultas una por una, crea un Parámetro en Power Query (Administrar parámetros > Nuevo parámetro) llamado pRutaCarpeta o pUrlSharePoint. Luego referencia ese parámetro dentro de tus consultas.",
        "Si consolidas reportes mensuales depositados en una carpeta, el patrón más sólido es usar Folder.Files(pRutaCarpeta), filtrar por extensión (.xlsx o .csv) excluyendo archivos temporales que empiezan con ~$, expandir el contenido binario con Excel.Workbook y promover encabezados. De esa forma basta con soltar el archivo del nuevo mes en la carpeta para que entre al reporte en el siguiente refresco.",
      ],
      codigos: [
        {
          titulo: "Parámetro de ruta y consolidación automática de carpeta en M",
          lenguaje: "m",
          codigo: `let
    // Parámetro pRutaCarpeta definido en Power Query (ej. "C:\\Datos\\Ventas" o ruta UNC)
    Origen = Folder.Files(pRutaCarpeta),
    SoloExcel = Table.SelectRows(
        Origen,
        each Text.Lower([Extension]) = ".xlsx" and not Text.StartsWith([Name], "~$")
    ),
    LeerLibros = Table.AddColumn(
        SoloExcel,
        "ContenidoLibro",
        each Excel.Workbook([Content], true)
    ),
    ExpandirHojas = Table.ExpandTableColumn(
        LeerLibros,
        "ContenidoLibro",
        {"Name", "Data", "Kind"},
        {"Hoja", "Datos", "Tipo"}
    ),
    SoloTablas = Table.SelectRows(ExpandirHojas, each [Tipo] = "Table"),
    Combinado = Table.Combine(SoloTablas[Datos]),
    TiposFinales = Table.TransformColumnTypes(
        Combinado,
        {{"Fecha", type date}, {"Vendedor", type text}, {"TotalNeto", Int64.Type}}
    )
in
    TiposFinales`,
          nota: "Filtrar por Kind = 'Table' o 'Sheet' con nombre fijo evita que falle si alguien agrega una hoja auxiliar en uno de los archivos.",
        },
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-4",
        alt: "Editor de Power Query mostrando el parámetro pRutaCarpeta en el panel izquierdo y los pasos aplicados de consolidación",
        caption:
          "Usar parámetros y pasos defensivos en M garantiza que la carga automática no falle al llegar archivos nuevos.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Cuidado con nombres de columnas rígidos",
        texto:
          "Cuando Power Query genera automáticamente el paso 'Tipo cambiado' escribiendo todas las columnas por nombre, si el origen renombra una columna el refresco fallará. Aplica cambios de tipo solo sobre las columnas que realmente usas después de seleccionarlas.",
      },
    },
    {
      id: "modelo-medidas-reutilizables",
      titulo: "5. Ordenar el modelo semántico y agregar fecha de última actualización",
      esPasoHowTo: true,
      resumenHowTo:
        "Relaciona tablas en esquema estrella, oculta claves técnicas y crea una consulta + medida DAX para mostrar la fecha y hora exacta de la última actualización.",
      parrafos: [
        "Antes de publicar, asegúrate de que tu modelo de datos esté limpio en la Vista de modelo: una tabla de calendario conectada por fecha a tus tablas de hechos, relaciones de uno a varios (1:*) en una sola dirección y medidas explícitas en DAX en lugar de arrastrar columnas numéricas sueltas a los gráficos. Si quieres reforzar tus cálculos base, revisa nuestra guía de medidas esenciales DAX en /guias/dax-medidas-esenciales-power-bi.",
        "Un detalle indispensable en cualquier reporte automatizado es mostrar en el encabezado del dashboard cuándo fue la última actualización exitosa. Así quien lee el reporte sabe con certeza si está viendo los datos de hoy a las 08:00 o de ayer. Para lograrlo sin depender de la hora local del navegador del usuario, crea una pequeña tabla en Power Query llamada UltimaActualizacion usando DateTimeZone.SwitchZone(DateTimeZone.UtcNow(), -3) (ajusta a -3 o -4 según horario de verano/invierno en Chile, o usa un cálculo dinámico).",
        "Luego crea una medida DAX sencilla que lea ese valor único y colócala en una tarjeta discreta en la esquina superior derecha del lienzo.",
      ],
      codigos: [
        {
          titulo: "Consulta M para capturar la hora exacta de refresco (Chile UTC-3)",
          lenguaje: "m",
          codigo: `let
    AhoraUTC = DateTimeZone.UtcNow(),
    HoraChile = DateTimeZone.SwitchZone(AhoraUTC, -3),
    Tabla = #table(
        type table [UltimaActualizacion = datetime],
        {{DateTimeZone.RemoveZone(HoraChile)}}
    )
in
    Tabla`,
          nota: "Como la consulta se evalúa en el servidor de Power BI durante el refresco programado, reflejará el momento real en que se actualizaron los datos.",
        },
        {
          titulo: "Medida DAX para mostrar el texto de última actualización",
          lenguaje: "dax",
          codigo: `Texto Ultima Actualizacion =
"Actualizado: " & FORMAT(MAX(UltimaActualizacion[UltimaActualizacion]), "dd-mm-yyyy HH:mm")`,
          nota: "Coloca esta medida en un objeto visual Tarjeta en el encabezado de cada página.",
        },
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-5",
        alt: "Vista de modelo en Power BI Desktop con esquema estrella y tarjeta mostrando Texto Ultima Actualizacion en el lienzo",
        caption:
          "Modelo en estrella limpio acompañado de un indicador visible de fecha y hora de actualización.",
        ratio: "16/9",
      },
    },
    {
      id: "publicar-en-servicio",
      titulo: "6. Publicar el informe en un Área de trabajo (Workspace) de Power BI Service",
      esPasoHowTo: true,
      resumenHowTo:
        "Publica el archivo .pbix desde Power BI Desktop hacia un Workspace colaborativo (evitando Mi área de trabajo para reportes de equipo).",
      parrafos: [
        "Con el modelo probado y guardado, haz clic en Inicio > Publicar dentro de Power BI Desktop. El sistema te pedirá elegir un destino. Para automatizaciones productivas de un equipo o empresa, evita publicar en 'Mi área de trabajo', ya que queda amarrado a tu usuario individual y complica la administración si cambias de rol.",
        "Crea o selecciona un Área de trabajo dedicada (por ejemplo, 'Reportes Comerciales') donde al menos dos personas tengan rol de Administrador o Miembro. Al finalizar la publicación, Power BI sube dos elementos separados al servicio web: el Informe (las visualizaciones) y el Modelo semántico (los datos y consultas Power Query).",
        "Haz clic en el enlace para abrir el informe en el navegador y verifica que todas las páginas se vean bien antes de pasar a la configuración de credenciales y programación.",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-6",
        alt: "Diálogo Publicar en Power BI mostrando la selección de un Área de trabajo compartida en Power BI Service",
        caption:
          "Publica en un Workspace compartido para separar los permisos de administración del usuario individual.",
        ratio: "16/9",
      },
    },
    {
      id: "actualizacion-programada-gateway",
      titulo: "7. Configurar actualización programada y Gateway (puerta de enlace)",
      esPasoHowTo: true,
      resumenHowTo:
        "Ingresa a la configuración del modelo semántico en Power BI Service, autentica tus credenciales de origen, vincula un gateway si hay fuentes locales y define los horarios de refresco.",
      parrafos: [
        "En Power BI Service, ve al Área de trabajo, ubica el Modelo semántico (ícono naranja/rojo) y haz clic en los tres puntos > Configuración. Aquí es donde ocurre la verdadera automatización de datos.",
        "Primero, revisa la sección Credenciales del origen de datos. Si tus archivos están en SharePoint u OneDrive, haz clic en Editar credenciales, selecciona el método de autenticación OAuth2, define el nivel de privacidad (habitualmente Organizacional) e inicia sesión. Si todas tus fuentes son nube (SharePoint, Azure SQL, APIs públicas), no necesitarás gateway y podrás activar la actualización programada de inmediato.",
      ],
      subsecciones: [
        {
          id: "cuando-necesitas-gateway",
          titulo: "Cuándo necesitas un Gateway: modo personal vs modo estándar",
          parrafos: [
            "Necesitas instalar el On-premises data gateway (puerta de enlace de datos local) cada vez que tu modelo lea al menos un origen que vive dentro de tu red privada o computador (por ejemplo, un servidor SQL Server local, una carpeta compartida \\\\servidor\\finanzas o un Excel en disco duro). El gateway actúa como un puente cifrado saliente entre tu red local y la nube de Microsoft.",
            "Existen dos modos oficiales documentados por Microsoft Learn: el Modo personal y el Modo estándar (empresarial). El Modo personal se instala bajo tu sesión de Windows, sirve solo para un usuario, no permite compartir orígenes ni usar DirectQuery en equipo, y deja de funcionar si cierras sesión o apagas tu PC. El Modo estándar se instala como servicio de Windows en un servidor dedicado encendido 24/7, permite administrar múltiples orígenes, delegar permisos a varios autores de reportes y soportar tanto Importación como DirectQuery.",
          ],
        },
        {
          id: "limites-refrescos-licencias",
          titulo: "Límites de actualizaciones programadas según licencia (Microsoft Learn)",
          parrafos: [
            "De acuerdo con la documentación oficial de Microsoft Learn sobre actualización programada, la cantidad máxima de refrescos automáticos diarios depende de la capacidad donde esté alojado el Área de trabajo:",
            "En áreas de trabajo con licencia Power BI Pro (capacidad compartida), puedes programar hasta 8 actualizaciones al día, con intervalos mínimos de 30 minutos. En áreas de trabajo alojadas en capacidad Power BI Premium, Premium por usuario (PPU) o Microsoft Fabric, el límite sube hasta 48 actualizaciones programadas al día (cada 30 minutos). Ten en cuenta que si una actualización programada falla cuatro veces consecutivas, Power BI deshabilita automáticamente la programación y envía un aviso al propietario del modelo.",
          ],
          tabla: {
            caption: "Resumen de límites de actualización programada según documentación de Microsoft Learn",
            encabezados: [
              "Tipo de licencia / capacidad",
              "Refrescos programados máximos por día",
              "Requiere Gateway para orígenes locales",
            ],
            filas: [
              [
                "Power BI Pro (capacidad compartida)",
                "Hasta 8 por día",
                "Sí (Estándar recomendado para equipos)",
              ],
              [
                "Power BI Premium / PPU / Fabric",
                "Hasta 48 por día",
                "Sí (Estándar recomendado para equipos)",
              ],
            ],
          },
        },
      ],
      listaOrdenada: [
        "En Configuración del modelo semántico, abre Conexiones de puerta de enlace y nube.",
        "Si ves orígenes locales, selecciona tu Gateway instalado y mapea cada origen con su conexión.",
        "En Credenciales del origen de datos, valida OAuth2 o usuario/contraseña de lectura.",
        "Despliega Actualizar (Actualización programada), activa el interruptor, elige Zona horaria (UTC-03:00 Santiago) y agrega las horas de ejecución (ej. 07:30 y 13:30).",
        "Activa la casilla para enviar notificaciones de error de actualización al propietario del modelo y guarda con Aplicar.",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-7",
        alt: "Pantalla de Configuración del modelo semántico en Power BI Service mostrando Conexiones de puerta de enlace y horarios en Actualización programada",
        caption:
          "Programación de horarios en zona horaria de Santiago y vinculación de puerta de enlace.",
        ratio: "16/9",
      },
    },
    {
      id: "suscripciones-alertas-correo",
      titulo: "8. Activar suscripciones por correo y alertas de datos",
      esPasoHowTo: true,
      resumenHowTo:
        "Configura suscripciones nativas en el informe para enviar una captura y enlace directo por correo después de cada actualización, y define alertas sobre KPIs críticos.",
      parrafos: [
        "Una vez que los datos se actualizan solos, el siguiente paso es que el reporte llegue a las personas indicadas sin que tengan que acordarse de entrar al portal. Desde la vista del informe en Power BI Service, haz clic en Suscribirse al informe en la barra superior.",
        "Puedes crear una o más suscripciones indicando destinatarios de tu organización, asunto del correo, la página exacta que quieres adjuntar como vista previa, y la frecuencia. Un truco muy útil es marcar la opción 'Después de la actualización de datos (una vez al día)' en lugar de una hora fija: así te aseguras de que el correo salga recién cuando el refresco terminó con éxito y no con números del día anterior.",
        "Adicionalmente, si anclas un KPI o tarjeta numérica a un Panel (Dashboard) dentro del Workspace, puedes configurar Alertas de datos (Administrar alertas) para que Power BI envíe un aviso inmediato solo cuando una métrica cruce un umbral específico (por ejemplo, margen bajo el 15% o stock crítico).",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-8",
        alt: "Panel lateral Suscripciones en Power BI Service con frecuencia configurada Después de la actualización de datos y destinatarios",
        caption:
          "Las suscripciones nativas envían la vista del reporte apenas finaliza la actualización del modelo.",
        ratio: "16/9",
      },
    },
    {
      id: "enviar-reportes-power-automate",
      titulo: "9. Llevar el envío al siguiente nivel con Power Automate",
      esPasoHowTo: true,
      resumenHowTo:
        "Integra Power Automate cuando necesites exportar el informe a PDF/PPTX, aplicar filtros por destinatario o adjuntar archivos fuera de Power BI.",
      parrafos: [
        "Las suscripciones estándar de Power BI Service cubren muy bien el envío de un resumen visual estándar, pero tienen dos límites importantes: con licencia Pro adjuntan una imagen de una sola página y no permiten adjuntar un PDF multipágina personalizado por cada gerente o sucursal a menos que tengas capacidad Premium/Fabric.",
        "Cuando necesitas flujos condicionales —por ejemplo, esperar a que termine la carga de un archivo en SharePoint, disparar el refresco del modelo semántico, exportar el informe filtrado a PDF y enviarlo por correo o Microsoft Teams— la herramienta adecuada es Power Automate.",
        "Puedes revisar el armado paso a paso de estos flujos, incluyendo licencias requeridas, manejo de errores y alternativas sin licencia premium en nuestra guía dedicada: /guias/enviar-reportes-automaticos-con-power-automate.",
      ],
      captura: {
        id: "automatizar-reportes-con-power-bi-paso-9",
        alt: "Flujo de Power Automate combinando disparador programado, actualización de dataset de Power BI y envío de correo",
        caption:
          "Power Automate extiende la automatización cuando necesitas reglas condicionales, Teams o exportación a PDF.",
        ratio: "16/9",
      },
    },
    {
      id: "checklist-final-automatizacion",
      titulo: "10. Checklist final antes de entregar el reporte automatizado",
      esPasoHowTo: false,
      parrafos: [
        "Antes de dar por cerrado el proyecto y anunciar al equipo que el reporte es automático, valida estos puntos clave para evitar fallas silenciosas en las primeras semanas de operación:",
      ],
      listaOrdenada: [
        "Ninguna consulta en Power Query apunta a C:\\Users\\... ni a archivos locales en un notebook personal.",
        "Todas las credenciales en Power BI Service están autenticadas y marcadas con nivel de privacidad consistente.",
        "Si hay orígenes locales, el Gateway en modo estándar corre como servicio en un servidor encendido 24/7.",
        "El reporte muestra de forma visible la tarjeta con la fecha y hora de última actualización.",
        "La actualización programada tiene al menos dos personas configuradas para recibir alertas ante un eventual fallo.",
        "Probaste manualmente el botón 'Actualizar ahora' en Power BI Service y verificaste en el Historial de actualizaciones que completó sin advertencias.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "La actualización programada aparece en gris o deshabilitada en Power BI Service",
      causa:
        "Faltan credenciales válidas de al menos un origen de datos o existe una fuente local sin puerta de enlace (gateway) mapeada.",
      solucion:
        "Abre Configuración del modelo semántico, revisa 'Conexiones de puerta de enlace y nube' y 'Credenciales del origen de datos' hasta que todas las fuentes muestren estado verde sin advertencias.",
    },
    {
      error: "Error 'No se encontró la columna X de la tabla' durante el refresco en la nube",
      causa:
        "Alguien renombró, borró o movió una columna en el Excel o CSV de origen y Power Query la referenciaba de forma explícita.",
      solucion:
        "Estandariza la plantilla de entrada con encabezados fijos o usa pasos en M que seleccionen solo las columnas necesarias con manejo tolerante de esquema.",
    },
    {
      error: "Error de origen de datos dinámico (Dynamic data source) al usar Web.Contents",
      causa:
        "Se construyó una URL concatenada dinámicamente dentro de Web.Contents, lo que impide a Power BI Service validar la ruta antes de actualizar.",
      solucion:
        "Usa la opción RelativePath y Query dentro de Web.Contents dejando la URL base fija como texto estático.",
    },
    {
      error: "La fecha de última actualización en el reporte muestra 3 o 4 horas de diferencia",
      causa:
        "Los servidores de Power BI Service ejecutan las consultas en zona horaria UTC (00:00) y DateTime.LocalNow() devuelve UTC.",
      solucion:
        "Reemplaza DateTime.LocalNow() por DateTimeZone.SwitchZone(DateTimeZone.UtcNow(), -3) (o -4 según horario oficial de Chile).",
    },
    {
      error: "Las suscripciones por correo dejan de llegar después de unos días",
      causa:
        "La actualización programada falló cuatro veces seguidas y Power BI pausó el refresco automático, o la licencia del propietario expiró.",
      solucion:
        "Revisa el Historial de actualizaciones del modelo semántico, corrige el error de origen y reactiva la programación.",
    },
  ],
  plantilla: {
    titulo: "Checklist y plantilla de arquitectura para automatizar Power BI",
    descripcion:
      "Archivo .pbix base con parámetro de ruta configurado, consulta de última actualización en hora de Chile, tabla calendario y medidas iniciales listas para publicar.",
  },
  faqs: [
    {
      q: "¿Necesito licencia de pago para programar actualizaciones en Power BI?",
      a: "Con una cuenta gratuita puedes publicar y programar hasta 8 actualizaciones diarias en 'Mi área de trabajo', pero no puedes compartir reportes de forma segura con tu equipo ni usar áreas de trabajo colaborativas. Para trabajo en equipo se requiere licencia Power BI Pro, PPU o capacidad Fabric.",
    },
    {
      q: "¿Mi computador tiene que quedar encendido para que Power BI se actualice solo?",
      a: "No, siempre que tus archivos estén en la nube (OneDrive para la Empresa, SharePoint, Azure, Google BigQuery, etc.). Solo necesitas un equipo o servidor encendido con Gateway si tus datos están en una carpeta de red interna o en un SQL Server local.",
    },
    {
      q: "¿Cada cuánto tiempo puedo actualizar un reporte automáticamente?",
      a: "Según Microsoft Learn, con licencia Power BI Pro en capacidad compartida puedes programar hasta 8 actualizaciones al día (con intervalos mínimos de 30 minutos). Con capacidad Premium, PPU o Fabric puedes programar hasta 48 actualizaciones al día.",
    },
    {
      q: "¿Puedo actualizar Power BI apenas llegue un archivo nuevo sin esperar al horario programado?",
      a: "Sí. Puedes usar Power Automate con el disparador 'Cuando se crea o modifica un archivo' en SharePoint y la acción 'Actualizar un conjunto de datos' en Power BI para disparar el refresco por evento.",
    },
    {
      q: "¿Cuál es la diferencia entre suscripción nativa de Power BI y Power Automate?",
      a: "La suscripción nativa envía un correo programado con una vista previa y enlace al informe con configuración en dos clics. Power Automate sirve cuando necesitas exportar a PDF con filtros dinámicos, guardar archivos en SharePoint o enviar mensajes condicionales a Teams.",
    },
  ],
  relacionadas: [
    "automatizar-excel-con-power-query",
    "enviar-reportes-automaticos-con-power-automate",
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
  ],
  enlacesExternos: [
    {
      label: "Configuración de actualización programada en Power BI — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-bi/connect-data/refresh-scheduled-refresh",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación de puerta de enlace de datos local (Gateway) — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/data-integration/gateway/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Suscripciones de correo electrónico para informes y paneles — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-bi/collaborate-share/end-user-subscribe",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Power BI vs Excel: diferencias y cuándo usar cada uno",
      href: "/guias/power-bi-vs-excel",
      descripcion:
        "Evalúa cuándo conviene mantener un reporte en Excel y cuándo migrarlo a Power BI.",
    },
    {
      label: "Conectar Power BI a SQL Server paso a paso",
      href: "/guias/conectar-power-bi-a-sql-server",
      descripcion:
        "Guía práctica para conectar bases SQL locales o en la nube y configurar credenciales.",
    },
    {
      label: "Automatizar Excel con Power Query",
      href: "/guias/automatizar-excel-con-power-query",
      descripcion:
        "Domina el mismo motor de transformación y lenguaje M aplicado a libros de Excel.",
    },
    {
      label: "Enviar reportes automáticos con Power Automate",
      href: "/guias/enviar-reportes-automaticos-con-power-automate",
      descripcion:
        "Automatiza envíos de correo con adjuntos y filtros usando Power Automate.",
    },
  ],
};

export default guia;
