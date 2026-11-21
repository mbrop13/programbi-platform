import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "ia-para-sql",
  title: "IA para SQL: crea y optimiza consultas con ChatGPT o Claude",
  meta: "Usa ChatGPT o Claude para escribir, explicar y optimizar consultas SQL Server: cómo dar contexto del esquema, validar resultados y evitar errores.",
  h1: "Cómo usar IA para escribir consultas SQL (y validarlas)",
  subtitle:
    "Aprende a entregar el esquema DDL sin exponer datos reales, generar consultas T-SQL limpias con JOIN y agregaciones, detectar predicados no SARGable y auditar resultados antes de llevarlos a producción.",
  keywordPrincipal: "ia para sql",
  keywords: [
    "ia para sql",
    "ChatGPT SQL",
    "Claude SQL Server",
    "IA para SQL Server gratis",
    "generar consultas SQL con IA",
  ],
  curso: "sql-server",
  herramienta: "IA",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Nunca pegues en chats públicos de IA volcados de tablas con RUT, correos, teléfonos, sueldos o montos reales de clientes. Entrega únicamente la estructura DDL (CREATE TABLE sin filas reales) o datos ficticios generados para pruebas, y verifica las políticas de retención de tu cuenta antes de trabajar con esquemas corporativos.",
  en30Segundos: {
    queLogras:
      "Escribir, explicar y optimizar consultas en SQL Server (T-SQL) usando ChatGPT o Claude con contexto estructural exacto y controles contra duplicados o nulos.",
    herramienta: "ChatGPT / Claude + SQL Server",
    tiempo: "30 minutos",
    bullets: [
      "Extraer únicamente el DDL (CREATE TABLE) de tus tablas para evitar que la IA invente columnas.",
      "Montar un dataset reproducible de clientes y pedidos para probar consultas T-SQL reales.",
      "Reescribir consultas lentas usando predicados SARGable y revisar planes de ejecución.",
      "Validar cardinalidad en JOIN, manejo de NULL y conocer el soporte oficial de IA en SSMS.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Contexto DDL",
      resumen: "Comparte estructura CREATE TABLE sin datos sensibles.",
      anchorId: "dar-contexto-ddl",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Dataset ejemplo",
      resumen: "Crea tablas de prueba con INSERT para validar todo.",
      anchorId: "dataset-script-ejemplo",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Generar T-SQL",
      resumen: "Pide SELECT, JOIN y agregaciones con prompts precisos.",
      anchorId: "generar-select-join-agregaciones",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Explicar heredado",
      resumen: "Desarma queries complejos con CTE y subconsultas.",
      anchorId: "explicar-consulta-heredada",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Optimizar SARGable",
      resumen: "Corrige filtros que impiden usar índices en SQL Server.",
      anchorId: "optimizar-indices-sargable",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Validar y SSMS",
      resumen: "Audita NULL, duplicados e integración oficial en SSMS.",
      anchorId: "validar-casos-borde",
      icono: "check",
    },
  ],
  requisitos: {
    version: "SQL Server 2019/2022 (o Azure SQL) y acceso a ChatGPT o Claude",
    lista: [
      "Cliente SQL (SQL Server Management Studio, Azure Data Studio o dbfiddle para pruebas).",
      "Cuenta en ChatGPT (help.openai.com) o Claude (support.claude.com).",
      "Permisos de lectura sobre el esquema de metadatos si vas a extraer DDL de tu base de desarrollo.",
    ],
    compatibilidadMacWeb:
      "Puedes ejecutar prompts en ChatGPT o Claude desde cualquier navegador en Windows o macOS. Para correr las consultas T-SQL en Mac puedes usar Azure SQL Edge en Docker, dbfiddle o Azure Data Studio conectado a una instancia remota.",
    avisoEducativo:
      "Todos los scripts de esta guía usan datos ficticios de ejemplo. Ejecuta cualquier consulta generada por IA primero en un entorno de desarrollo o prueba.",
  },
  herramientasHowTo: ["SQL Server", "ChatGPT o Claude", "SQL Server Management Studio"],
  insumosHowTo: ["Script DDL de tablas", "Dataset ficticio de prueba"],
  secciones: [
    {
      id: "dar-contexto-ddl",
      titulo: "1. Dar contexto correcto: DDL CREATE TABLE sin datos sensibles",
      esPasoHowTo: true,
      resumenHowTo:
        "Extrae únicamente las definiciones CREATE TABLE con llaves primarias y foráneas para que la IA no alucine nombres de columnas.",
      parrafos: [
        "El motivo número uno por el que ChatGPT o Claude entregan consultas SQL que fallan al primer intento es la falta de contexto estructural. Si solo escribes «hazme una consulta que sume las ventas por cliente del último trimestre», el modelo inventará nombres como Ventas, FechaVenta o IdCliente que no coinciden con tu base real.",
        "La solución más limpia y segura consiste en entregar el DDL (Data Definition Language) de las tablas involucradas: las sentencias CREATE TABLE con tipos de datos, restricciones PRIMARY KEY, FOREIGN KEY y nulabilidad. No necesitas adjuntar ni una sola fila real de tus clientes ni montos de facturación.",
        "Al ver el DDL completo, la IA distingue al instante si una fecha es DATE o DATETIME2, si el estado del pedido es un código numérico o texto, y qué columnas unen dos tablas sin duplicar registros.",
      ],
      codigos: [
        {
          titulo: "Prompt 1: Fijar reglas del motor T-SQL y entregar el esquema",
          lenguaje: "prompt",
          codigo: `Actúa como desarrollador senior de SQL Server (T-SQL).
Trabajarás únicamente con las tablas definidas en este DDL. No inventes columnas ni tablas que no aparezcan aquí.
Reglas:
- Usa sintaxis compatible con SQL Server 2019+.
- Usa alias de tabla claros y explícitos en cada columna.
- Si falta información para resolver una regla de negocio, pregúntame antes de asumir.

Esquema:
[Pega aquí tus sentencias CREATE TABLE]`,
        },
      ],
      captura: {
        id: "ia-para-sql-paso-1",
        alt: "Script DDL generado desde SQL Server Management Studio sin incluir filas de datos reales",
        caption:
          "Entrega solo la estructura CREATE TABLE para dar contexto exacto a la IA sin exponer registros de producción.",
        ratio: "16/9",
      },
      verificaResultado:
        "Confirma que el modelo responde acusando recibo de los nombres exactos de tus tablas y columnas sin proponer tablas externas. Si el chat intenta adivinar columnas de auditoría como created_at que no existen en tu DDL, corrígelo de inmediato.",
    },
    {
      id: "dataset-script-ejemplo",
      titulo: "2. Dataset y script de ejemplo reproducible en SQL Server",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea un entorno mínimo con clientes y pedidos ficticios para probar cada consulta y verificar sus resultados.",
      parrafos: [
        "Para validar cualquier flujo de IA en SQL conviene trabajar sobre un conjunto pequeño de datos donde puedas calcular el resultado esperado a mano en diez segundos. En este ejemplo simulamos dos tablas clásicas de operación comercial en Chile: Clientes y Pedidos.",
        "Fíjate en los casos intencionales del script: hay un cliente sin pedidos (Camila Rojas), un pedido en estado 'Anulado' que no debe sumarse como venta neta, y un registro con DescuentoPct en NULL para comprobar cómo se comportan las operaciones aritméticas cuando falta un valor.",
      ],
      codigos: [
        {
          titulo: "Script T-SQL completo de ejemplo (CREATE TABLE + INSERT)",
          lenguaje: "sql",
          codigo: `CREATE TABLE dbo.Clientes (
    ClienteId   INT PRIMARY KEY,
    Nombre      NVARCHAR(100) NOT NULL,
    Region      NVARCHAR(50)  NOT NULL,
    Segmento    NVARCHAR(30)  NOT NULL
);

CREATE TABLE dbo.Pedidos (
    PedidoId      INT PRIMARY KEY,
    ClienteId     INT NOT NULL REFERENCES dbo.Clientes(ClienteId),
    FechaPedido   DATE NOT NULL,
    Estado        NVARCHAR(20) NOT NULL,
    MontoBrutoCLP INT NOT NULL,
    DescuentoPct  DECIMAL(5,2) NULL
);

INSERT INTO dbo.Clientes (ClienteId, Nombre, Region, Segmento) VALUES
(1, N'Comercial Andina SpA', N'Metropolitana', N'Empresa'),
(2, N'Distribuidora Sur Ltda.', N'Biobío', N'Empresa'),
(3, N'Camila Rojas', N'Valparaíso', N'Pyme'),
(4, N'Taller Norte EIRL', N'Antofagasta', N'Pyme');

INSERT INTO dbo.Pedidos (PedidoId, ClienteId, FechaPedido, Estado, MontoBrutoCLP, DescuentoPct) VALUES
(101, 1, '2026-10-05', N'Pagado',   450000, 10.00),
(102, 1, '2026-10-18', N'Pagado',   300000, NULL),
(103, 2, '2026-10-22', N'Pagado',   800000, 5.00),
(104, 2, '2026-11-02', N'Anulado',  250000, 0.00),
(105, 4, '2026-11-10', N'Pagado',   180000, NULL);`,
          nota: "Ejecuta este script en una base de pruebas (por ejemplo, tempdb o una base de laboratorio) antes de probar los prompts siguientes.",
        },
      ],
      captura: {
        id: "ia-para-sql-paso-2",
        alt: "Ejecución exitosa del script CREATE TABLE e INSERT en el editor de consultas de SQL Server",
        caption:
          "Monta un dataset controlado con nulos y estados anulados para detectar errores lógicos de la IA.",
        ratio: "16/9",
      },
    },
    {
      id: "generar-select-join-agregaciones",
      titulo: "3. Generar SELECT, JOIN y agregaciones con control de negocio",
      esPasoHowTo: true,
      resumenHowTo:
        "Redacta prompts que especifiquen filtros de estado, manejo de NULL y tipo de JOIN requerido.",
      parrafos: [
        "Cuando pides una consulta analítica a ChatGPT o Claude, la diferencia entre un código frágil y uno listo para revisión está en las restricciones de negocio que incluyes en el prompt. Si no mencionas cómo tratar los valores NULL en DescuentoPct, muchas veces la IA escribirá MontoBrutoCLP * (1 - DescuentoPct / 100.0), lo que convertirá en NULL todo pedido sin descuento.",
        "De forma similar, si necesitas incluir clientes sin ventas en un reporte mensual, debes pedir explícitamente un LEFT JOIN y colocar el filtro de Estado = 'Pagado' dentro de la cláusula ON (o manejar el NULL posterior), porque ponerlo en el WHERE transforma silenciosamente el LEFT JOIN en un INNER JOIN.",
      ],
      codigos: [
        {
          titulo: "Prompt 2: Reporte de venta neta por cliente incluyendo clientes sin compras",
          lenguaje: "prompt",
          codigo: `Usando las tablas dbo.Clientes y dbo.Pedidos entregadas:
Escribe una consulta T-SQL que devuelva para cada cliente:
- ClienteId, Nombre, Region
- CantidadPedidosPagados
- VentaNetaCLP redondeada a entero, calculada como MontoBrutoCLP * (1 - COALESCE(DescuentoPct, 0) / 100.0).

Requisitos estrictos:
1. Incluye clientes sin pedidos pagados usando LEFT JOIN (deben mostrar 0, no NULL).
2. Excluye pedidos en estado 'Anulado' sin eliminar al cliente de la fila final.
3. Ordena de mayor a menor VentaNetaCLP.`,
        },
        {
          titulo: "Consulta T-SQL corregida y verificada",
          lenguaje: "sql",
          codigo: `SELECT
    c.ClienteId,
    c.Nombre,
    c.Region,
    COUNT(p.PedidoId) AS CantidadPedidosPagados,
    CAST(
        ROUND(
            COALESCE(
                SUM(p.MontoBrutoCLP * (1.0 - COALESCE(p.DescuentoPct, 0) / 100.0)),
                0
            ),
            0
        ) AS INT
    ) AS VentaNetaCLP
FROM dbo.Clientes AS c
LEFT JOIN dbo.Pedidos AS p
    ON p.ClienteId = c.ClienteId
   AND p.Estado = N'Pagado'
GROUP BY
    c.ClienteId,
    c.Nombre,
    c.Region
ORDER BY
    VentaNetaCLP DESC,
    c.ClienteId ASC;`,
          nota: "El filtro p.Estado = N'Pagado' va en el ON del LEFT JOIN para conservar a Camila Rojas con 0 pedidos pagados.",
        },
        {
          titulo: "Prompt 3: Ranking por región usando CTE y función de ventana",
          lenguaje: "prompt",
          codigo: `Sobre el mismo esquema, escribe una consulta T-SQL con una CTE llamada VentasCliente que calcule la VentaNetaCLP por cliente (solo pedidos en estado 'Pagado').
Luego, en la consulta externa, usa DENSE_RANK() OVER (PARTITION BY Region ORDER BY VentaNetaCLP DESC) para numerar los clientes dentro de cada región.`,
        },
      ],
      captura: {
        id: "ia-para-sql-paso-3",
        alt: "Resultado tabular en SQL Server mostrando los cuatro clientes, incluyendo Camila Rojas con venta neta cero",
        caption:
          "Verifica que la consulta T-SQL conserva clientes sin ventas y calcula correctamente los descuentos con NULL.",
        ratio: "16/9",
      },
      verificaResultado:
        "Comprueba en el resultado que Comercial Andina SpA suma 705.000 (405.000 del pedido 101 con 10% de descuento más 300.000 del pedido 102 sin descuento), Distribuidora Sur Ltda. suma 760.000 (excluyendo el pedido anulado 104), Taller Norte EIRL suma 180.000 y Camila Rojas aparece con 0.",
    },
    {
      id: "explicar-consulta-heredada",
      titulo: "4. Explicar una consulta SQL heredada paso a paso",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa la IA para documentar queries antiguos con múltiples subconsultas, identificar supuestos ocultos y proponer CTE legibles.",
      parrafos: [
        "En equipos de datos es habitual heredar vistas o procedimientos almacenados de trescientas líneas sin comentarios. Leerlos de arriba a abajo para entender qué filtra cada subconsulta anidadas consume horas.",
        "ChatGPT y Claude destacan especialmente en ingeniería inversa de texto SQL: si les entregas la consulta heredada (sin datos sensibles) y les pides un desglose por bloque lógico, pueden explicarte el grano de salida (qué representa cada fila), detectar filtros contradictorios y reescribir la consulta usando CTE (Common Table Expressions) con nombres descriptivos sin alterar la lógica.",
      ],
      codigos: [
        {
          titulo: "Prompt 4: Auditar y documentar una consulta SQL heredada",
          lenguaje: "prompt",
          codigo: `Analiza la siguiente consulta T-SQL heredada. No la resumas de forma genérica; necesito:
1. Grano de la salida (qué representa exactamente una fila).
2. Lista de filtros activos y posibles efectos secundarios (por ejemplo, LEFT JOIN convertido en INNER JOIN por un WHERE).
3. Riesgos de división por cero o valores NULL en cálculos.
4. Versión refactorizada con CTE legibles y comentarios breves en español.

Consulta:
[Pega aquí tu SELECT o VIEW sin credenciales ni datos reales]`,
        },
      ],
      captura: {
        id: "ia-para-sql-paso-4",
        alt: "Prompt de auditoría de consulta SQL heredada mostrando explicación por bloques y versión refactorizada con CTE",
        caption:
          "Pide siempre identificar el grano de salida y posibles efectos secundarios antes de refactorizar un query heredado.",
        ratio: "16/9",
      },
      verificaResultado:
        "Si refactorizas la consulta heredada con ayuda de la IA, compara la cantidad de filas y los totales clave entre la consulta original y la versión con CTE usando EXCEPT o un resumen de control antes de reemplazar la vista.",
    },
    {
      id: "optimizar-indices-sargable",
      titulo: "5. Optimizar consultas: predicados SARGable, índices y planes de ejecución",
      esPasoHowTo: true,
      resumenHowTo:
        "Detecta funciones sobre columnas en el WHERE que bloquean el uso de índices y solicita reescrituras SARGable.",
      parrafos: [
        "Una de las ayudas más valiosas de la IA en SQL Server es detectar predicados no SARGable (Search ARGument-able). Ocurre cuando envuelves una columna indexada dentro de una función como YEAR(FechaPedido) = 2026 o LEFT(Nombre, 3) = 'Com', obligando al motor a leer toda la tabla o índice completo (Scan) en lugar de ir directo al rango (Seek).",
        "También puedes pegar el XML o resumen textual de un plan de ejecución real (sin datos sensibles) para que la IA identifique operadores costosos como Key Lookup, Sort en memoria o conversiones implícitas de tipo (por ejemplo, comparar NVARCHAR con VARCHAR).",
      ],
      codigos: [
        {
          titulo: "Prompt 5: Convertir consulta lenta en predicado SARGable y sugerir índice",
          lenguaje: "prompt",
          codigo: `Revisa esta consulta T-SQL que tarda demasiado en una tabla de varios millones de filas:

SELECT ClienteId, SUM(MontoBrutoCLP) AS Total
FROM dbo.Pedidos
WHERE YEAR(FechaPedido) = 2026 AND MONTH(FechaPedido) = 10
  AND ISNULL(Estado, '') = N'Pagado'
GROUP BY ClienteId;

1. Explica por qué los filtros del WHERE impiden usar un índice sobre FechaPedido y Estado.
2. Reescribe la consulta usando rangos SARGable.
3. Propón un índice no agrupado cubriente (CREATE NONCLUSTERED INDEX ... INCLUDE ...) adecuado para esta consulta.`,
        },
      ],
      tabla: {
        caption: "Comparativa entre patrones lentos frecuentes y su equivalente optimizado en T-SQL",
        encabezados: [
          "Patrón problemático (No SARGable / Costoso)",
          "Reescritura optimizada en SQL Server",
          "Impacto esperado en el plan",
        ],
        filas: [
          [
            "WHERE YEAR(FechaPedido) = 2026 AND MONTH(FechaPedido) = 10",
            "WHERE FechaPedido >= '2026-10-01' AND FechaPedido < '2026-11-01'",
            "Habilita Index Seek por rango de fechas en lugar de recorrer toda la tabla.",
          ],
          [
            "WHERE ISNULL(Estado, '') = N'Pagado'",
            "WHERE Estado = N'Pagado'",
            "Evita evaluar la función fila por fila y permite usar estadísticas del índice.",
          ],
          [
            "SELECT * con múltiples JOIN innecesarios",
            "Seleccionar solo columnas requeridas + índice cubriente con INCLUDE",
            "Reduce lecturas lógicas y elimina Key Lookups costosos.",
          ],
          [
            "Subconsulta correlacionada en el SELECT por cada fila",
            "Preagregación en CTE o JOIN agrupado una sola vez",
            "Evita ejecuciones repetidas por cada registro de la tabla principal.",
          ],
        ],
      },
      captura: {
        id: "ia-para-sql-paso-5",
        alt: "Plan de ejecución en SQL Server mostrando cambio de Index Scan a Index Seek tras reescribir el filtro de fechas",
        caption:
          "Comprueba siempre en el plan de ejecución real (Ctrl+M en SSMS) que la reescritura redujo lecturas lógicas.",
        ratio: "16/9",
      },
      verificaResultado:
        "Activa SET STATISTICS IO ON antes de ejecutar ambas versiones en tu entorno de prueba y verifica que las lecturas lógicas (logical reads) disminuyeron y que el plan muestra Index Seek donde antes había Scan.",
    },
    {
      id: "validar-casos-borde",
      titulo: "6. Validar resultados, casos borde (NULL, duplicados) e IA oficial en SSMS",
      esPasoHowTo: false,
      parrafos: [
        "Ninguna consulta generada por IA debe pasar a un dashboard o proceso ETL sin validación contra casos borde. Los dos errores más silenciosos en SQL son la explosión de filas por un JOIN muchos-a-muchos (que infla las sumas sin arrojar error de sintaxis) y la exclusión accidental de filas donde una columna opcional vale NULL (recuerda que NULL <> 'Anulado' evalúa a UNKNOWN, no a verdadero).",
        "Antes de dar por buena una consulta, verifica el conteo de filas respecto a la tabla de hechos principal y prueba explícitamente qué ocurre cuando una columna nullable está vacía o cuando un cliente tiene dos filas relacionadas en una tabla secundaria.",
        "Por otro lado, si trabajas directamente dentro de las herramientas oficiales de Microsoft, ten presente el estado documentado al 21 de noviembre de 2026: según Microsoft Learn (GitHub Copilot in SQL Server Management Studio Overview, consultado el 21 de noviembre de 2026), Microsoft integra asistencia de IA de forma oficial mediante GitHub Copilot en SSMS (a partir de SSMS 22 y versiones posteriores), permitiendo conversar en lenguaje natural sobre tu base, generar T-SQL con contexto y usar comandos como /doc para documentar código.",
        "A diferencia de copiar y pegar en un chat web genérico, la integración en SSMS lee el contexto de la conexión activa según la configuración de tu organización y requiere una cuenta de GitHub con acceso a Copilot habilitado.",
      ],
      lista: [
        "Compara COUNT(*) antes y después de cada JOIN para confirmar que no multiplicaste filas.",
        "Usa COALESCE o IS NULL explícito al filtrar columnas opcionales (por ejemplo, Estado IS NULL OR Estado <> N'Anulado').",
        "En operaciones de cambio de datos (UPDATE o DELETE asistidos por IA), envuelve siempre la prueba en BEGIN TRAN ... ROLLBACK dentro de desarrollo.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "La IA usa LIMIT 10 o DATE_TRUNC en lugar de TOP 10 y DATETRUNC/EOMONTH",
      causa:
        "No indicaste en el prompt que el motor es SQL Server (T-SQL), por lo que el modelo mezcló sintaxis de PostgreSQL o MySQL.",
      solucion:
        "Especifica siempre «SQL Server 2019+ (T-SQL)» al inicio del prompt y pide que evite sintaxis de otros motores.",
    },
    {
      error: "El LEFT JOIN desaparece y omite clientes sin pedidos",
      causa:
        "La IA colocó una condición sobre la tabla derecha (como p.Estado = N'Pagado') dentro de la cláusula WHERE en lugar del ON.",
      solucion:
        "Mueve los filtros de la tabla opcional hacia la cláusula ON del LEFT JOIN o verifica explícitamente los registros sin coincidencia.",
    },
    {
      error: "Cálculos aritméticos devuelven NULL inesperado en ciertas filas",
      causa:
        "Cualquier operación con NULL en SQL devuelve NULL si no se protege con COALESCE o ISNULL.",
      solucion:
        "Envuelve columnas opcionales como descuentos o recargos en COALESCE(columna, 0) y protege denominadores con NULLIF(divisor, 0).",
    },
    {
      error: "La consulta funciona en 100 filas pero agota el tiempo en producción",
      causa:
        "Predicados no SARGable sobre fechas o textos en tablas grandes sin índices adecuados.",
      solucion:
        "Reemplaza funciones sobre columnas en el WHERE por rangos abiertos/cerrados y valida el plan de ejecución real con SET STATISTICS IO ON.",
    },
  ],
  plantilla: {
    titulo: "Kit de prompts T-SQL y script de auditoría rápida",
    descripcion:
      "Próximamente: plantilla descargable con prompts listos para DDL, optimización SARGable y validación de conteos en SQL Server.",
  },
  faqs: [
    {
      q: "¿Es mejor ChatGPT o Claude para escribir consultas SQL Server?",
      a: "Ambos modelos generan T-SQL sólido cuando entregas el DDL completo y las reglas de negocio claras. En la práctica, conviene probar el mismo esquema en ambos y comparar cómo manejan los casos borde (NULL y duplicados) antes de ejecutar.",
    },
    {
      q: "¿Puedo usar IA gratis para generar consultas SQL?",
      a: "Sí, tanto ChatGPT como Claude cuentan con niveles gratuitos que permiten pegar scripts DDL y generar o explicar consultas T-SQL, sujetos a los límites de mensajes y políticas vigentes de cada plataforma (help.openai.com y support.claude.com).",
    },
    {
      q: "¿Es seguro pegar la estructura de mis tablas en un chat de IA?",
      a: "Compartir únicamente nombres genéricos de tablas y tipos de datos conlleva mucho menos riesgo que pegar filas de clientes; aun así, en entornos corporativos debes validar las políticas de tu empresa y nunca incluir datos personales, contraseñas ni cadenas de conexión.",
    },
    {
      q: "¿Qué soporte oficial de IA tiene SQL Server Management Studio (SSMS)?",
      a: "Según Microsoft Learn (consultado el 21 de noviembre de 2026), SSMS 22 y versiones posteriores incorporan integración oficial con GitHub Copilot en SSMS, incluyendo chat contextual y comandos para explicar o documentar T-SQL.",
    },
    {
      q: "¿Cómo evito que la IA invente columnas que no existen?",
      a: "Pega siempre las sentencias CREATE TABLE reales al inicio de la conversación e instruye explícitamente que pregunte antes de asumir cualquier columna adicional.",
    },
  ],
  relacionadas: [
    "consultas-sql-ejemplos",
    "conectar-power-bi-a-sql-server",
    "preguntas-entrevista-analista-de-datos",
  ],
  enlacesExternos: [
    {
      label: "GitHub Copilot in SQL Server Management Studio Overview",
      url: "https://learn.microsoft.com/ssms/github-copilot/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Use the GitHub Copilot Chat Experience in SSMS",
      url: "https://learn.microsoft.com/ssms/github-copilot/chat",
      fuente: "Microsoft Learn",
    },
    {
      label: "Centro de ayuda de OpenAI (ChatGPT)",
      url: "https://help.openai.com",
      fuente: "OpenAI Help Center",
    },
    {
      label: "Centro de ayuda de Claude",
      url: "https://support.claude.com",
      fuente: "Anthropic Support",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Ejercicios de SQL Server para entrevistas",
      href: "/plantillas/ejercicios-sql-server-entrevistas",
      descripcion: "Practica consultas T-SQL reales con casos de negocio y validación paso a paso.",
    },
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Guía práctica para analizar esquemas, scripts y archivos con Claude de forma segura.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa de precisión en código, SQL y análisis tabular entre ambos asistentes.",
    },
  ],
};

export default guia;
