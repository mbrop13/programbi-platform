import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "conectar-power-bi-a-sql-server",
  title: "Cómo conectar Power BI a SQL Server (Import y DirectQuery)",
  meta: "Conecta Power BI Desktop a SQL Server local o remoto, elige entre Import y DirectQuery, escribe consultas eficientes y programa la actualización.",
  h1: "Cómo conectar Power BI a SQL Server paso a paso",
  subtitle:
    "Conecta tus bases de datos SQL Server locales, corporativas o en la nube con Power BI Desktop, domina la diferencia entre Import y DirectQuery y evita romper el plegado de consultas.",
  keywordPrincipal: "conectar Power BI a SQL Server",
  keywords: [
    "conectar Power BI a SQL Server",
    "Power BI Desktop con SQL Server",
    "SQL Server remoto Power BI",
    "DirectQuery vs Import",
  ],
  curso: "sql-server",
  cursoSecundario: "power-bi",
  herramienta: "SQL",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Conectar Power BI Desktop a una instancia de SQL Server local o remota, elegir el modo de almacenamiento adecuado (Import o DirectQuery), crear vistas SQL eficientes y dejar lista la actualización programada.",
    herramienta: "Power BI Desktop + SQL Server",
    tiempo: "30 minutos",
    bullets: [
      "Validar permisos de lectura (SELECT) y datos del servidor antes de conectar.",
      "Elegir entre autenticación de Windows y autenticación de base de datos SQL.",
      "Decidir con criterio técnico entre Import y DirectQuery según latencia y volumen.",
      "Usar vistas SQL para no romper el plegado de consultas (query folding) en Power Query.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Requisitos y permisos",
      resumen: "Valida usuario de solo lectura, servidor y conectividad.",
      anchorId: "requisitos-permisos",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Conexión en Desktop",
      resumen: "Ingresa servidor, base y método de autenticación.",
      anchorId: "conexion-desktop",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Import vs DirectQuery",
      resumen: "Compara rendimiento, actualización y soporte DAX.",
      anchorId: "import-vs-directquery",
      icono: "layers",
    },
    {
      numero: 4,
      titulo: "Vistas y Query Folding",
      resumen: "Escribe SQL limpio sin perder plegado de consultas.",
      anchorId: "consultas-sql-recomendadas",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "SQL remoto y TLS",
      resumen: "Configura firewall, puerto 1433 y certificados seguros.",
      anchorId: "sql-remoto-nube",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Gateway y refresco",
      resumen: "Programa actualizaciones automáticas en Power BI Service.",
      anchorId: "actualizacion-gateway",
      icono: "refresh",
    },
  ],
  requisitos: {
    version: "Power BI Desktop actualizado y SQL Server 2016 o superior / Azure SQL",
    lista: [
      "Nombre del servidor o IP (por ejemplo, SRV-SQL01\\INSTANCIA o servidor.database.windows.net).",
      "Nombre exacto de la base de datos de destino.",
      "Usuario con permisos mínimos de lectura (rol db_datareader o SELECT sobre vistas específicas).",
    ],
    compatibilidadMacWeb:
      "La conexión inicial desde Power BI Desktop requiere Windows. Una vez publicado el modelo semántico en Power BI Service con una puerta de enlace configurada (si el servidor es local), cualquier usuario puede consultar el informe desde Mac o navegador web.",
    avisoEducativo:
      "Todos los nombres de servidores, bases de datos y vistas mostrados en esta guía son ejemplos ilustrativos. Nunca incrustes contraseñas reales en código compartido.",
  },
  herramientasHowTo: ["Power BI Desktop", "SQL Server", "Power BI Gateway"],
  insumosHowTo: ["Credenciales de solo lectura", "Nombre de servidor y base de datos"],
  secciones: [
    {
      id: "requisitos-permisos",
      titulo: "1. Requisitos previos y permisos mínimos en SQL Server",
      esPasoHowTo: true,
      resumenHowTo:
        "Solicita al equipo de TI un usuario de solo lectura y confirma el nombre del servidor, puerto e instancia.",
      parrafos: [
        "Antes de abrir Power BI Desktop, asegúrate de contar con los datos de acceso correctos. El error más frecuente en empresas ocurre al intentar conectarse con credenciales personales que no tienen permisos sobre el esquema de producción, o al desconocer si SQL Server escucha en una instancia con nombre (como SERVIDOR\\SQLEXPRESS) o en el puerto TCP estándar 1433.",
        "Por seguridad operacional, nunca conectes un dashboard gerencial usando la cuenta administrativa sa ni usuarios con permisos de escritura o eliminación. Solicita a tu administrador de base de datos una cuenta dedicada de solo lectura (por ejemplo, perteneciente al rol db_datareader o con permiso SELECT exclusivo sobre un esquema de reportería como rpt o bi).",
        "También conviene verificar desde tu equipo Windows si tienes alcance de red al servidor. En redes corporativas, muchas veces el acceso al puerto de base de datos exige estar conectado a la VPN de la empresa o tener la IP de tu estación autorizada en el firewall interno.",
      ],
      lista: [
        "Nombre completo del servidor (FQDN, IP o Host\\Instancia) y puerto si no es el 1433.",
        "Nombre de la base de datos comercial o ERP.",
        "Confirmación de si el acceso usa tu usuario de red (Windows / Active Directory) o usuario y clave de SQL.",
      ],
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-1",
        alt: "Permisos de usuario de solo lectura en SQL Server Management Studio sobre vistas de reportería",
        caption:
          "Buena práctica de seguridad: asigna al usuario de Power BI únicamente permisos SELECT sobre el esquema de vistas.",
        ratio: "16/9",
      },
    },
    {
      id: "conexion-desktop",
      titulo: "2. Conectar desde Power BI Desktop y elegir autenticación",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa el conector nativo de SQL Server, define servidor y modo de conectividad, y selecciona autenticación Windows o SQL.",
      parrafos: [
        "Abre Power BI Desktop y ve a Inicio > SQL Server (o Obtener datos > Base de datos > Base de datos SQL Server). En el cuadro emergente escribe el nombre del Servidor y, de forma opcional, la Base de datos. Si dejas la base en blanco, el navegador te mostrará todas las bases donde tu usuario tenga acceso, lo cual puede ser más lento en servidores con decenas de esquemas.",
        "En la misma ventana verás el selector de Modo de conectividad de datos: Importar o DirectQuery. Si es tu primer proyecto con menos de unos cuantos millones de filas y no necesitas ver transacciones ocurridas hace cinco segundos, elige Importar. Luego presiona Aceptar para pasar a la pantalla de credenciales.",
        "Power BI te ofrecerá dos formas principales de identificarte en el panel izquierdo: Windows (usa tus credenciales actuales de dominio de Windows o credenciales alternativas de red) y Base de datos (ingresa un usuario y contraseña creados dentro de SQL Server). Si te conectas a Azure SQL o a un servidor con Entra ID, también aparece la opción Cuenta de Microsoft. Elige el nivel de aplicación de credenciales lo más específico posible (servidor y base de datos) y presiona Conectar.",
      ],
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-2",
        alt: "Cuadro de diálogo Base de datos SQL Server en Power BI Desktop mostrando servidor, base, modo Importar y pantalla de autenticación",
        caption:
          "Asistente de conexión SQL Server en Power BI Desktop con selector entre modo Importar y DirectQuery.",
        ratio: "16/9",
      },
    },
    {
      id: "import-vs-directquery",
      titulo: "3. Import vs DirectQuery: cómo decidir sin afectar el rendimiento",
      esPasoHowTo: true,
      resumenHowTo:
        "Compara velocidad, frescura de datos, limitaciones DAX y carga sobre SQL Server entre Import y DirectQuery.",
      parrafos: [
        "Elegir mal el modo de almacenamiento es la causa número uno de tableros lentos en empresas. En modo Importar, Power BI copia los datos desde SQL Server, los comprime dentro del motor en memoria VertiPaq y responde cada clic en milisegundos sin molestar a la base de datos transaccional mientras los gerentes filtran el reporte.",
        "En modo DirectQuery, en cambio, Power BI no guarda los datos: cada vez que alguien cambia un filtro o abre una página, traduce el gráfico a una consulta SQL y la envía en vivo al servidor. Eso permite ver datos al instante, pero exige que SQL Server tenga índices optimizados (idealmente índices columnstore) para no saturar el ERP ni hacer esperar al usuario.",
      ],
      tabla: {
        caption: "Comparativa técnica entre modo Importar y DirectQuery en Power BI.",
        encabezados: ["Criterio", "Import (Importar)", "DirectQuery"],
        filas: [
          [
            "Velocidad al interactuar",
            "Muy rápida (motor en memoria VertiPaq)",
            "Depende de la carga e índices de SQL Server",
          ],
          [
            "Frescura de los datos",
            "Según actualización programada (hasta 8/48 veces al día según licencia)",
            "Tiempo real al abrir o interactuar con el informe",
          ],
          [
            "Carga sobre el servidor ERP",
            "Solo durante la ventana de actualización",
            "Constante cada vez que un usuario aplica filtros",
          ],
          [
            "Soporte completo de DAX y Power Query",
            "100 % disponible sin restricciones",
            "Limitaciones en ciertas funciones de tiempo y transformaciones M",
          ],
          [
            "Tamaño máximo del modelo",
            "Limitado por memoria / licencia (muy alta compresión)",
            "Prácticamente ilimitado en origen SQL",
          ],
        ],
      },
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-3",
        alt: "Vista de modelo en Power BI mostrando tablas en modo Importar frente a tablas conectadas en DirectQuery",
        caption:
          "Para la gran mayoría de tableros comerciales y financieros, Importar ofrece mejor experiencia de usuario y menor carga en el servidor.",
        ratio: "16/9",
      },
    },
    {
      id: "consultas-sql-recomendadas",
      titulo: "4. Consultas SQL recomendadas y cuidado con el Query Folding",
      esPasoHowTo: true,
      resumenHowTo:
        "Prefiere conectar vistas SQL limpias antes que tablas crudas o consultas nativas escritas dentro de Power Query.",
      parrafos: [
        "Aunque Power BI permite pegar una instrucción SELECT directamente en Opciones avanzadas > Instrucción SQL (lo que genera en lenguaje M la llamada Sql.Database(\"servidor\", \"base\", [Query=\"...\"])) debes usar esa opción con mucha cautela.",
        "¿Por qué? Porque cuando pasas una consulta SQL manual dentro del parámetro [Query=\"...\"], Power Query suele perder el plegado de consultas (Query Folding). Esto significa que cualquier filtro de fecha o eliminación de columnas que agregues después en Power Query ya no se enviará al servidor SQL para que él filtre rápido, sino que Power BI descargará toda la consulta y filtrará en tu PC. Además, es incompatible con la actualización incremental nativa a menos que configures envoltorios avanzados.",
        "La práctica recomendada es crear una vista en SQL Server (por ejemplo, rpt.vw_VentasConsolidadas) que ya haga los JOIN limpios y seleccione solo las columnas necesarias. Luego, en Power BI, te conectas a esa vista desde el Navegador sin usar [Query=\"...\"]. Así conservas el plegado de consultas íntegro.",
      ],
      codigos: [
        {
          titulo: "Vista SQL recomendada en el servidor (ejemplo ilustrativo)",
          lenguaje: "sql",
          codigo: `CREATE OR ALTER VIEW rpt.vw_VentasConsolidadas AS
SELECT
    v.IdVenta,
    CAST(v.FechaEmision AS DATE) AS Fecha,
    v.IdProducto,
    v.IdCliente,
    v.Cantidad,
    v.MontoNeto,
    v.CostoUnitario * v.Cantidad AS CostoTotal
FROM dbo.VentasDetalle AS v
WHERE v.EstadoDocumento = 'VIGENTE'
  AND v.FechaEmision >= '2024-01-01';`,
          nota: "Al conectarte a la vista desde el Navegador de Power BI, Power Query sigue haciendo Query Folding sobre ella.",
        },
        {
          titulo: "Cómo luce en M cuando usas consulta nativa (precaución con Query Folding)",
          lenguaje: "m",
          codigo: `let
    Origen = Sql.Database("SRV-SQL01", "ComercialDB", [
        Query = "SELECT IdVenta, Fecha, MontoNeto FROM rpt.vw_VentasConsolidadas"
    ])
in
    Origen`,
          nota: "Evita agregar pasos de filtrado posteriores sobre [Query=\"...\"] si necesitas actualización incremental o alto rendimiento.",
        },
      ],
      alerta: {
        tipo: "warning",
        titulo: "Advertencia sobre Query Folding",
        texto:
          "En Power Query puedes verificar si un paso mantiene el plegado haciendo clic derecho sobre el paso en Pasos aplicados: si la opción Ver consulta nativa está habilitada, SQL Server está ejecutando el filtro por ti.",
      },
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-4",
        alt: "Menú contextual de Pasos aplicados en Power Query mostrando la opción Ver consulta nativa habilitada",
        caption:
          "Ver consulta nativa activa: señal inequívoca de que Power Query está delegando el trabajo al motor de SQL Server.",
        ratio: "16/9",
      },
    },
    {
      id: "sql-remoto-nube",
      titulo: "5. Conectar a SQL Server remoto o en la nube (firewall, puerto 1433 y TLS)",
      esPasoHowTo: true,
      resumenHowTo:
        "Resuelve problemas de red, reglas de firewall en puerto 1433 y cifrado SSL/TLS al conectar servidores remotos.",
      parrafos: [
        "Cuando tu base de datos vive en Azure SQL Database, Amazon RDS o un servidor privado fuera de tu oficina, la conexión atraviesa internet o túneles VPN. El primer requisito es que el firewall del servidor permita el tráfico entrante por el puerto TCP 1433 (o el puerto personalizado definido por tu área de sistemas) desde la IP pública de tu oficina o desde la IP del servidor donde instales el Gateway.",
        "El segundo punto crítico son los certificados TLS/SSL. Power BI Desktop exige por defecto conexiones cifradas. Si el servidor SQL corporativo utiliza un certificado autofirmado que tu equipo no reconoce, aparecerá el error: 'Se estableció correctamente la conexión con el servidor, pero luego ocurrió un error durante el protocolo de enlace previo al inicio de sesión' o un aviso de proveedor SSL no confiable.",
        "La solución segura en producción es instalar un certificado TLS válido emitido por una autoridad confiable (o por la CA interna de tu empresa instalada en tu almacén de certificados de Windows). En entornos de prueba internos, Power BI permite desactivar el cifrado por origen en Archivo > Opciones y configuración > Configuración de origen de datos > Editar permisos, aunque no se recomienda en redes abiertas.",
      ],
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-5",
        alt: "Ventana Configuración de origen de datos en Power BI Desktop mostrando permisos globales y opción de cifrado",
        caption:
          "Administración de permisos y cifrado TLS en Configuración de origen de datos.",
        ratio: "16/9",
      },
    },
    {
      id: "actualizacion-gateway",
      titulo: "6. Programar la actualización automática con puerta de enlace (Gateway)",
      esPasoHowTo: true,
      resumenHowTo:
        "Publica el informe y vincula el modelo semántico a un On-premises data gateway para automatizar las cargas.",
      parrafos: [
        "Si tu servidor SQL está en la nube pública (como Azure SQL con acceso desde servicios de Azure habilitado), Power BI Service puede refrescar los datos directamente ingresando tus credenciales en la configuración del modelo semántico. Pero si tu SQL Server está dentro de la red privada de la empresa, la nube de Microsoft no puede entrar por sí sola a tu oficina.",
        "Para ese escenario debes instalar el On-premises data gateway (puerta de enlace de datos local) en un servidor Windows que permanezca encendido dentro de la red corporativa. Una vez registrado el origen SQL dentro del Gateway en Power BI Service, podrás programar refrescos automáticos diarios o por hora sin intervención manual. Revisa el paso a paso completo de instalación y programación en nuestra guía de automatizar reportes con Power BI (/guias/automatizar-reportes-con-power-bi).",
      ],
      captura: {
        id: "conectar-power-bi-a-sql-server-paso-6",
        alt: "Configuración del modelo semántico en Power BI Service mostrando la conexión a la puerta de enlace y la programación diaria",
        caption:
          "Conexión de puerta de enlace en Power BI Service lista para ejecutar actualizaciones programadas.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "No se pudo conectar porque el proveedor SSL encontró un certificado no confiable",
      causa:
        "El servidor SQL usa un certificado autofirmado y Power BI exige cifrado validado por defecto.",
      solucion:
        "Instala el certificado raíz de tu empresa en Windows o, solo en red interna segura, ajusta la opción de cifrado en Editar permisos del origen de datos.",
    },
    {
      error: "Error de red o específico de la instancia (error 26 o timeout al conectar)",
      causa:
        "El puerto 1433 está bloqueado por el firewall, la VPN está desconectada o el servicio SQL Server Browser está detenido para instancias nombradas.",
      solucion:
        "Verifica conectividad con Test-NetConnection en PowerShell al puerto 1433, activa la VPN o especifica el puerto exacto como servidor,puerto.",
    },
    {
      error: "Error de inicio de sesión para el usuario en autenticación SQL",
      causa:
        "El servidor SQL está configurado solo en modo 'Autenticación de Windows' y rechaza usuarios SQL locales.",
      solucion:
        "Pide al DBA habilitar el modo mixto (Windows y SQL Server) o conéctate usando autenticación de Windows.",
    },
    {
      error: "La actualización en Power BI Service falla pero en Desktop funciona",
      causa:
        "El servidor es local y no existe un On-premises data gateway encendido, o las credenciales en el Gateway expiraron.",
      solucion:
        "Asocia el modelo semántico a un Gateway activo en la configuración del conjunto de datos y vuelve a validar las credenciales.",
    },
  ],
  plantilla: {
    titulo: "Checklist de conexión SQL Server + Script de vista de ventas",
    descripcion:
      "Próximamente podrás descargar aquí el script SQL para crear un esquema de vistas optimizado para Power BI y una lista de verificación para tu equipo de TI.",
  },
  faqs: [
    {
      q: "¿Puedo combinar algunas tablas en Import y otras en DirectQuery en el mismo archivo?",
      a: "Sí, se llama modelo compuesto (modo Dual/Mixto). Por ejemplo, puedes dejar las dimensiones pequeñas en modo Dual o Import y una tabla gigante de movimientos en DirectQuery, aunque conviene probar primero si Import puro soporta tu volumen porque es mucho más rápido.",
    },
    {
      q: "¿Qué pasa si cambio el nombre del servidor de desarrollo a producción después de armar el dashboard?",
      a: "Crea dos parámetros en Power Query (pServidor y pBaseDatos) y úsalos dentro de Sql.Database(pServidor, pBaseDatos). Así podrás cambiar de ambiente desde un solo lugar sin editar cada consulta.",
    },
    {
      q: "¿Es mejor conectarse a tablas del ERP o pedir vistas?",
      a: "Siempre pide vistas en un esquema de reportería. Si el ERP cambia internamente o necesitas filtrar documentos nulos, el equipo de datos ajusta la vista sin romper tu tablero en Power BI.",
    },
    {
      q: "¿Puedo ejecutar procedimientos almacenados (Stored Procedures) desde Power BI?",
      a: "Sí, usando Sql.Database con una consulta EXEC dbo.MiProcedimiento, pero rompe el plegado de consultas y no es compatible con DirectQuery. Siempre que puedas, prefiere vistas o tablas.",
    },
  ],
  relacionadas: [
    "automatizar-reportes-con-power-bi",
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
    "tabla-calendario-power-bi-dax",
  ],
  enlacesExternos: [
    {
      label: "Conector de SQL Server en Power Query",
      url: "https://learn.microsoft.com/es-es/power-query/connectors/sql-server",
      fuente: "Microsoft Learn",
    },
    {
      label: "Uso de DirectQuery en Power BI Desktop",
      url: "https://learn.microsoft.com/es-es/power-bi/connect-data/desktop-directquery-about",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Power BI en vivo",
      href: "/cursos/power-bi",
      descripcion: "Aprende modelado estrella, DAX y conexión a bases corporativas con proyectos reales.",
    },
    {
      label: "Ejercicios de SQL Server para entrevistas",
      href: "/plantillas/ejercicios-sql-server-entrevistas",
      descripcion: "Practica consultas, JOINs y agregaciones que luego llevarás a Power BI.",
    },
  ],
};

export default guia;
