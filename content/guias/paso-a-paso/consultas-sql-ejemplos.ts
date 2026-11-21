import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "consultas-sql-ejemplos",
  title: "Consultas SQL con ejemplos: de básicas a análisis de datos",
  meta: "Aprende SQL con consultas de ejemplo en SQL Server: SELECT, WHERE, JOIN, GROUP BY, subconsultas, CTE y funciones de ventana para análisis de datos.",
  h1: "Consultas SQL con ejemplos (SQL Server)",
  subtitle:
    "Domina T-SQL con una base de datos comercial lista para ejecutar y 25 consultas numeradas paso a paso: desde filtros básicos con SELECT y WHERE hasta cruces con JOIN, agregaciones con HAVING, expresiones CTE y funciones de ventana usadas en entrevistas técnicas.",
  keywordPrincipal: "consultas sql ejemplos",
  keywords: [
    "consultas sql ejemplos",
    "consultas SQL básicas",
    "ejercicios resueltos SQL Server",
    "SQL para análisis de datos",
  ],
  curso: "sql-server",
  herramienta: "SQL",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT50M",
  esInsignia: true,
  en30Segundos: {
    queLogras:
      "Levantar un esquema comercial de tres tablas en SQL Server y resolver 25 consultas reales de análisis de datos cubriendo filtros, ordenamiento, JOINs, agrupaciones, CTE y funciones de ventana.",
    herramienta: "SQL Server (T-SQL) · SSMS o Azure Data Studio",
    tiempo: "50 minutos",
    bullets: [
      "Crear y poblar las tablas Clientes, Productos y Pedidos con un script T-SQL autocontenido.",
      "Filtrar, ordenar y deduplicar registros con SELECT, WHERE, ORDER BY, TOP y DISTINCT.",
      "Cruzar tablas con INNER JOIN, LEFT JOIN, RIGHT JOIN y detectar registros huérfanos mediante anti-join.",
      "Resolver métricas de negocio con GROUP BY, HAVING, CTE (WITH), ROW_NUMBER, RANK, LAG y SUM() OVER.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Base de ejemplo",
      resumen: "Crea Clientes, Productos y Pedidos en T-SQL.",
      anchorId: "script-base-datos-ejemplo",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "SELECT y WHERE",
      resumen: "Consultas 1 a 5: filtros de texto, rango y nulos.",
      anchorId: "select-y-where",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "ORDER, TOP y DISTINCT",
      resumen: "Consultas 6 a 9: rankings y valores únicos.",
      anchorId: "order-by-top-distinct",
      icono: "layers",
    },
    {
      numero: 4,
      titulo: "Tipos de JOIN",
      resumen: "Consultas 10 a 14: cruces y anti-join.",
      anchorId: "joins-sql-server",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "GROUP BY y HAVING",
      resumen: "Consultas 15 a 18: métricas agregadas.",
      anchorId: "group-by-y-having",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Subconsultas y CTE",
      resumen: "Consultas 19 a 22: lógica modular con WITH.",
      anchorId: "subconsultas-y-cte",
      icono: "settings",
    },
    {
      numero: 7,
      titulo: "Funciones de ventana",
      resumen: "Consultas 23 a 25 + ejercicios resueltos.",
      anchorId: "funciones-de-ventana",
      icono: "sparkles",
    },
  ],
  requisitos: {
    version: "SQL Server 2019 o 2022 (Express, Developer o Azure SQL Database)",
    lista: [
      "SQL Server Management Studio (SSMS), extensión MSSQL en Visual Studio Code o Azure Data Studio.",
      "Una base de datos de pruebas vacía (puedes crearla con CREATE DATABASE PracticaAnalisis;).",
      "No necesitas conocimientos previos de SQL: cada consulta explica qué hace y por qué se escribe en ese orden.",
    ],
    compatibilidadMacWeb:
      "El script y las 25 consultas usan sintaxis T-SQL estándar de SQL Server. En macOS o Linux puedes ejecutarlas usando la extensión MSSQL de VS Code conectada a SQL Server en Docker o Azure SQL.",
  },
  secciones: [
    {
      id: "script-base-datos-ejemplo",
      titulo: "Script de base de datos de ejemplo (Clientes, Productos y Pedidos)",
      esPasoHowTo: true,
      resumenHowTo:
        "Ejecuta el script CREATE TABLE e INSERT en SQL Server para crear las tres tablas comerciales con datos ficticios listos para consultar.",
      parrafos: [
        "Para aprender SQL de verdad necesitas ejecutar consultas contra un modelo relacional realista donde existan llaves primarias, llaves foráneas, clientes sin pedidos y estados variados. Leer consultas aisladas sin conocer la estructura de las tablas dificulta entender por qué un JOIN multiplica filas o por qué un filtro devuelve vacío.",
        "El siguiente script en T-SQL crea tres tablas limpias dentro de tu base de datos de práctica: Clientes (con ciudad, segmento y fecha de registro), Productos (con categoría y precio unitario en pesos chilenos) y Pedidos (relacionando cliente, producto, cantidad, fecha y estado). Además incluye un cliente sin compras y un producto sin ventas para que puedas comprobar el efecto real de LEFT JOIN y anti-join.",
        "Copia el bloque completo en una nueva ventana de consulta en SSMS o VS Code y ejecútalo una sola vez. Si necesitas reiniciar los datos más adelante, las primeras líneas eliminan las tablas en el orden inverso a sus dependencias antes de volver a crearlas.",
      ],
      codigos: [
        {
          titulo: "Script T-SQL completo para crear y poblar Clientes, Productos y Pedidos",
          lenguaje: "sql",
          codigo: `DROP TABLE IF EXISTS dbo.Pedidos;
DROP TABLE IF EXISTS dbo.Productos;
DROP TABLE IF EXISTS dbo.Clientes;
GO

CREATE TABLE dbo.Clientes (
    ClienteID INT PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Ciudad NVARCHAR(60) NOT NULL,
    Segmento NVARCHAR(30) NOT NULL,
    FechaRegistro DATE NOT NULL,
    Email NVARCHAR(120) NULL
);

CREATE TABLE dbo.Productos (
    ProductoID INT PRIMARY KEY,
    NombreProducto NVARCHAR(100) NOT NULL,
    Categoria NVARCHAR(50) NOT NULL,
    PrecioUnitario DECIMAL(12, 2) NOT NULL
);

CREATE TABLE dbo.Pedidos (
    PedidoID INT PRIMARY KEY,
    ClienteID INT NOT NULL REFERENCES dbo.Clientes(ClienteID),
    ProductoID INT NOT NULL REFERENCES dbo.Productos(ProductoID),
    Cantidad INT NOT NULL,
    FechaPedido DATE NOT NULL,
    Estado NVARCHAR(20) NOT NULL
);

INSERT INTO dbo.Clientes (ClienteID, Nombre, Ciudad, Segmento, FechaRegistro, Email) VALUES
(1, N'Comercial Andes SpA', N'Santiago', N'Empresa', '2025-03-10', N'compras@andes.cl'),
(2, N'Camila Rojas', N'Valparaíso', N'Persona', '2025-06-15', N'camila.rojas@correo.cl'),
(3, N'Inversiones Sur Ltda', N'Concepción', N'Empresa', '2025-08-22', NULL),
(4, N'Matías Fuentes', N'Santiago', N'Persona', '2026-01-12', N'matias.f@correo.cl'),
(5, N'Distribuidora Norte', N'Antofagasta', N'Empresa', '2026-02-05', N'contacto@norte.cl'),
(6, N'Valentina Pérez', N'Valparaíso', N'Persona', '2026-09-01', NULL); -- Sin pedidos aún

INSERT INTO dbo.Productos (ProductoID, NombreProducto, Categoria, PrecioUnitario) VALUES
(101, N'Monitor 24 pulgadas', N'Hardware', 139990),
(102, N'Teclado Mecánico', N'Accesorios', 54990),
(103, N'Mouse Inalámbrico', N'Accesorios', 18990),
(104, N'Silla Ergonómica', N'Mobiliario', 169990),
(105, N'Docking Station USB-C', N'Hardware', 89990); -- Sin pedidos aún

INSERT INTO dbo.Pedidos (PedidoID, ClienteID, ProductoID, Cantidad, FechaPedido, Estado) VALUES
(1001, 1, 101, 4, '2026-09-05', N'Completado'),
(1002, 1, 102, 4, '2026-09-05', N'Completado'),
(1003, 2, 103, 2, '2026-09-12', N'Completado'),
(1004, 3, 104, 3, '2026-10-01', N'Completado'),
(1005, 4, 101, 1, '2026-10-08', N'Anulado'),
(1006, 5, 101, 6, '2026-10-15', N'Completado'),
(1007, 1, 104, 2, '2026-10-20', N'Completado'),
(1008, 2, 102, 1, '2026-11-02', N'Pendiente'),
(1009, 3, 103, 10, '2026-11-10', N'Completado'),
(1010, 5, 102, 5, '2026-11-14', N'Completado');`,
          nota: "El prefijo N'...' en textos asegura compatibilidad completa con tildes y eñes en columnas NVARCHAR de SQL Server.",
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-1",
        alt: "SQL Server Management Studio mostrando la ejecución exitosa del script de creación de Clientes, Productos y Pedidos.",
        caption: "Esquema base con 6 clientes, 5 productos y 10 pedidos listo para consultar en SQL Server.",
        ratio: "16/9",
      },
    },
    {
      id: "select-y-where",
      titulo: "SELECT y WHERE: filtrar filas con precisión (consultas 1–5)",
      esPasoHowTo: true,
      resumenHowTo:
        "Selecciona solo las columnas necesarias y filtra por igualdad, rangos de fecha, listas IN, patrones LIKE y valores NULL.",
      parrafos: [
        "Toda consulta de lectura comienza con SELECT (qué columnas quiero ver) y FROM (de qué tabla provienen). Aunque en pruebas rápidas es tentador escribir SELECT *, en análisis de datos conviene nombrar explícitamente las columnas para reducir transferencia de datos y evitar que cambios futuros en la tabla rompan reportes.",
        "La cláusula WHERE evalúa cada fila de la tabla antes de agrupar y conserva únicamente las que cumplen la condición lógica. En SQL Server es fundamental recordar dos reglas: los textos se comparan con comillas simples ('Santiago') y los valores ausentes (NULL) nunca se comparan con = o <>, sino exclusivamente con IS NULL o IS NOT NULL.",
        "En las primeras cinco consultas practicamos los cinco patrones de filtrado que cubren casi el 90% del trabajo diario de extracción: igualdad combinada con AND/OR, rangos numéricos o de fechas con BETWEEN, pertenencia a listas con IN, búsqueda parcial con LIKE y detección de campos vacíos.",
      ],
      codigos: [
        {
          titulo: "Consultas 1 a 5: SELECT y filtros esenciales con WHERE",
          lenguaje: "sql",
          codigo: `-- 1. Listar nombre, ciudad y segmento de clientes de Santiago que son Empresa
SELECT ClienteID, Nombre, Ciudad, Segmento
FROM dbo.Clientes
WHERE Ciudad = N'Santiago'
  AND Segmento = N'Empresa';

-- 2. Productos con precio entre $50.000 y $150.000 (extremos incluidos)
SELECT ProductoID, NombreProducto, Categoria, PrecioUnitario
FROM dbo.Productos
WHERE PrecioUnitario BETWEEN 50000 AND 150000;

-- 3. Pedidos realizados en octubre de 2026 que NO estén anulados
SELECT PedidoID, ClienteID, FechaPedido, Cantidad, Estado
FROM dbo.Pedidos
WHERE FechaPedido >= '2026-10-01'
  AND FechaPedido < '2026-11-01'
  AND Estado <> N'Anulado';

-- 4. Productos cuyo nombre contenga 'USB' o pertenezcan a Hardware/Accesorios
SELECT ProductoID, NombreProducto, Categoria
FROM dbo.Productos
WHERE NombreProducto LIKE N'%USB%'
   OR Categoria IN (N'Hardware', N'Accesorios');

-- 5. Clientes que no tienen correo electrónico registrado (uso obligatorio de IS NULL)
SELECT ClienteID, Nombre, Ciudad
FROM dbo.Clientes
WHERE Email IS NULL;`,
          nota: "Para filtrar un mes completo en fechas, usar >= '2026-10-01' y < '2026-11-01' es más seguro que BETWEEN si la columna llegara a incluir horas (DATETIME).",
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-2",
        alt: "Resultado en SQL Server de las consultas WHERE mostrando los clientes sin correo electrónico y los pedidos filtrados de octubre.",
        caption: "Filtros combinados con AND, BETWEEN, IN, LIKE e IS NULL en T-SQL.",
        ratio: "16/9",
      },
    },
    {
      id: "order-by-top-distinct",
      titulo: "ORDER BY, TOP y DISTINCT: ordenar y obtener valores únicos (6–9)",
      esPasoHowTo: true,
      resumenHowTo:
        "Ordena resultados con ORDER BY, limita las primeras filas con TOP (N) en T-SQL y elimina duplicados con DISTINCT.",
      parrafos: [
        "Una tabla relacional no tiene un orden garantizado por defecto: si no incluyes ORDER BY, el motor puede devolver las filas en cualquier secuencia según el plan de ejecución. Al ordenar puedes combinar múltiples criterios (por ejemplo, primero por categoría ascendente y luego por precio descendente) y usar alias calculados directamente en la cláusula ORDER BY.",
        "Mientras otros motores como PostgreSQL o MySQL usan LIMIT al final de la consulta, SQL Server utiliza TOP (N) justo después de SELECT (o OFFSET ... FETCH NEXT para paginación). Combinar TOP con ORDER BY te permite responder al instante preguntas ejecutivas como los 3 productos más caros o los 5 pedidos más recientes.",
        "Por su parte, DISTINCT elimina filas duplicadas en el resultado proyectado. Resulta muy útil para auditar catálogos (¿en qué ciudades tenemos clientes?) o contar entidades únicas antes de cruzar tablas.",
      ],
      codigos: [
        {
          titulo: "Consultas 6 a 9: Ordenamiento, límites TOP y deduplicación con DISTINCT",
          lenguaje: "sql",
          codigo: `-- 6. Catálogo ordenado por categoría (A-Z) y precio de mayor a menor
SELECT NombreProducto, Categoria, PrecioUnitario
FROM dbo.Productos
ORDER BY Categoria ASC, PrecioUnitario DESC;

-- 7. Los 3 productos más caros del catálogo (sintaxis T-SQL)
SELECT TOP (3) ProductoID, NombreProducto, PrecioUnitario
FROM dbo.Productos
ORDER BY PrecioUnitario DESC;

-- 8. Los 2 pedidos más recientes excluyendo anulados
SELECT TOP (2) PedidoID, ClienteID, FechaPedido, Estado
FROM dbo.Pedidos
WHERE Estado <> N'Anulado'
ORDER BY FechaPedido DESC, PedidoID DESC;

-- 9. Lista única de ciudades donde existen clientes registrados
SELECT DISTINCT Ciudad
FROM dbo.Clientes
ORDER BY Ciudad ASC;`,
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-3",
        alt: "Grilla de resultados en SSMS mostrando el Top 3 de productos más caros y la lista única de ciudades con DISTINCT.",
        caption: "Uso de ORDER BY multicriterio, TOP (3) y DISTINCT en SQL Server.",
        ratio: "16/9",
      },
    },
    {
      id: "joins-sql-server",
      titulo: "JOIN: INNER, LEFT, RIGHT y anti-join (consultas 10–14)",
      esPasoHowTo: true,
      resumenHowTo:
        "Combina Pedidos, Clientes y Productos por sus llaves y detecta clientes o productos sin movimiento usando LEFT JOIN + IS NULL.",
      parrafos: [
        "El verdadero poder del análisis en SQL aparece al cruzar tablas normalizadas. En nuestro modelo, la tabla Pedidos solo guarda ClienteID y ProductoID; para ver el nombre del cliente, su ciudad y calcular el monto vendido (Cantidad * PrecioUnitario) necesitamos unir las tres tablas mediante JOIN.",
        "INNER JOIN conserva únicamente las filas que tienen coincidencia en ambos lados: es la opción estándar para calcular ventas reales. LEFT JOIN, en cambio, preserva todas las filas de la tabla izquierda aunque no tengan correspondencia en la derecha (rellenando con NULL los campos faltantes).",
        "Un patrón clásico de análisis y auditoría de calidad es el anti-join: haces un LEFT JOIN y luego filtras WHERE TablaDerecha.Llave IS NULL. Eso responde exactamente qué clientes nunca han comprado o qué productos llevan meses sin rotación.",
      ],
      tabla: {
        caption: "Guía rápida para elegir el tipo de JOIN correcto en SQL Server",
        encabezados: ["Tipo de JOIN", "Qué filas conserva", "Cuándo usarlo en análisis"],
        filas: [
          [
            "INNER JOIN",
            "Solo coincidencias en ambas tablas",
            "Reportes de ventas confirmadas donde todo pedido tiene cliente y producto válido",
          ],
          [
            "LEFT JOIN",
            "Todas las de la izquierda + coincidencias de la derecha",
            "Listar todos los clientes mostrando 0 o NULL si no compraron",
          ],
          [
            "RIGHT JOIN",
            "Todas las de la derecha + coincidencias de la izquierda",
            "Poco usado por legibilidad; suele reescribirse invirtiendo el orden con LEFT JOIN",
          ],
          [
            "LEFT JOIN + IS NULL (anti-join)",
            "Solo filas de la izquierda sin pareja en la derecha",
            "Detectar productos sin ventas, clientes inactivos o errores de integridad",
          ],
        ],
      },
      codigos: [
        {
          titulo: "Consultas 10 a 14: INNER, LEFT, RIGHT y anti-join",
          lenguaje: "sql",
          codigo: `-- 10. INNER JOIN múltiple: detalle completo de pedidos con monto calculado
SELECT
    pe.PedidoID,
    pe.FechaPedido,
    c.Nombre AS Cliente,
    c.Ciudad,
    pr.NombreProducto,
    pe.Cantidad,
    pr.PrecioUnitario,
    (pe.Cantidad * pr.PrecioUnitario) AS MontoTotal
FROM dbo.Pedidos AS pe
INNER JOIN dbo.Clientes AS c ON pe.ClienteID = c.ClienteID
INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
WHERE pe.Estado = N'Completado';

-- 11. LEFT JOIN: todos los clientes y sus pedidos (incluye a Valentina sin compras)
SELECT
    c.ClienteID,
    c.Nombre,
    pe.PedidoID,
    pe.FechaPedido
FROM dbo.Clientes AS c
LEFT JOIN dbo.Pedidos AS pe ON c.ClienteID = pe.ClienteID
ORDER BY c.ClienteID;

-- 12. Anti-join: clientes registrados que aún NO tienen ningún pedido
SELECT c.ClienteID, c.Nombre, c.Ciudad, c.FechaRegistro
FROM dbo.Clientes AS c
LEFT JOIN dbo.Pedidos AS pe ON c.ClienteID = pe.ClienteID
WHERE pe.PedidoID IS NULL;

-- 13. RIGHT JOIN: todos los productos aunque nunca se hayan vendido
SELECT
    pr.ProductoID,
    pr.NombreProducto,
    pe.PedidoID,
    pe.Cantidad
FROM dbo.Pedidos AS pe
RIGHT JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID;

-- 14. Anti-join sobre productos: artículos del catálogo sin ventas completadas
SELECT pr.ProductoID, pr.NombreProducto, pr.Categoria
FROM dbo.Productos AS pr
LEFT JOIN dbo.Pedidos AS pe
    ON pr.ProductoID = pe.ProductoID
   AND pe.Estado = N'Completado'
WHERE pe.PedidoID IS NULL;`,
          nota: "En la consulta 14, filtrar pe.Estado = N'Completado' dentro del ON (y no en el WHERE) es clave para no anular el efecto del LEFT JOIN.",
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-4",
        alt: "Resultado del anti-join en SQL Server mostrando al cliente Valentina Pérez sin pedidos y al Docking Station USB-C sin ventas.",
        caption: "Cruce de tablas y detección de registros sin movimiento mediante LEFT JOIN e IS NULL.",
        ratio: "16/9",
      },
    },
    {
      id: "group-by-y-having",
      titulo: "GROUP BY y HAVING: resumir métricas y filtrar grupos (15–18)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula totales, conteos y promedios por categoría o ciudad y filtra resultados ya agregados con HAVING.",
      parrafos: [
        "Cuando pasas de listar transacciones individuales a construir indicadores ejecutivos, usas funciones de agregación: COUNT(), SUM(), AVG(), MIN() y MAX(). La regla de oro de GROUP BY es sencilla: toda columna que aparezca en el SELECT fuera de una función de agregación debe estar incluida exactamente igual en el GROUP BY.",
        "Una duda muy común al empezar es la diferencia entre WHERE y HAVING. WHERE filtra filas individuales antes de agrupar (por ejemplo, descartar pedidos anulados); HAVING filtra grupos completos después de calcular la agregación (por ejemplo, mostrar solo clientes que acumulen más de $500.000 en compras).",
        "Combinar ambos en la misma consulta te permite responder preguntas comerciales complejas con total claridad y sin duplicar código.",
      ],
      codigos: [
        {
          titulo: "Consultas 15 a 18: Agregaciones con GROUP BY y HAVING",
          lenguaje: "sql",
          codigo: `-- 15. Ventas totales, cantidad de pedidos y unidades por categoría
SELECT
    pr.Categoria,
    COUNT(DISTINCT pe.PedidoID) AS TotalPedidos,
    SUM(pe.Cantidad) AS UnidadesVendidas,
    SUM(pe.Cantidad * pr.PrecioUnitario) AS IngresoTotal
FROM dbo.Pedidos AS pe
INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
WHERE pe.Estado = N'Completado'
GROUP BY pr.Categoria
ORDER BY IngresoTotal DESC;

-- 16. Gasto acumulado y ticket promedio por ciudad
SELECT
    c.Ciudad,
    COUNT(pe.PedidoID) AS LineasPedido,
    SUM(pe.Cantidad * pr.PrecioUnitario) AS VentaTotal,
    AVG(CAST(pe.Cantidad * pr.PrecioUnitario AS DECIMAL(12,2))) AS TicketPromedio
FROM dbo.Pedidos AS pe
INNER JOIN dbo.Clientes AS c ON pe.ClienteID = c.ClienteID
INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
WHERE pe.Estado = N'Completado'
GROUP BY c.Ciudad;

-- 17. Clientes con al menos 2 pedidos completados y monto superior a $500.000 (HAVING)
SELECT
    c.ClienteID,
    c.Nombre,
    COUNT(pe.PedidoID) AS PedidosCompletados,
    SUM(pe.Cantidad * pr.PrecioUnitario) AS MontoAcumulado
FROM dbo.Pedidos AS pe
INNER JOIN dbo.Clientes AS c ON pe.ClienteID = c.ClienteID
INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
WHERE pe.Estado = N'Completado'
GROUP BY c.ClienteID, c.Nombre
HAVING COUNT(pe.PedidoID) >= 2
   AND SUM(pe.Cantidad * pr.PrecioUnitario) > 500000;

-- 18. Conteo de todos los clientes incluyendo los que tienen 0 pedidos
SELECT
    c.Nombre,
    COUNT(pe.PedidoID) AS PedidosCompletados,
    COALESCE(SUM(pe.Cantidad * pr.PrecioUnitario), 0) AS VentaTotal
FROM dbo.Clientes AS c
LEFT JOIN dbo.Pedidos AS pe
    ON c.ClienteID = pe.ClienteID AND pe.Estado = N'Completado'
LEFT JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
GROUP BY c.Nombre
ORDER BY VentaTotal DESC;`,
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-5",
        alt: "Tabla de resultados en SQL Server mostrando ventas totales por categoría y clientes filtrados con HAVING.",
        caption: "Resúmenes comerciales con GROUP BY, COALESCE para ceros y HAVING sobre métricas agregadas.",
        ratio: "16/9",
      },
    },
    {
      id: "subconsultas-y-cte",
      titulo: "Subconsultas y CTE (WITH): consultas legibles por etapas (19–22)",
      esPasoHowTo: true,
      resumenHowTo:
        "Divide problemas de varios pasos usando subconsultas escalares o Common Table Expressions (WITH).",
      parrafos: [
        "Muchas preguntas de negocio no se resuelven en una sola pasada: primero necesitas calcular un total por cliente y luego compararlo contra el promedio general, o filtrar los productos cuyo precio supera el promedio de su propia categoría. Ahí entran las subconsultas y las CTE (Common Table Expressions).",
        "Una subconsulta es una consulta SELECT encerrada entre paréntesis dentro de otra consulta. Funciona bien para comparaciones puntuales, pero cuando anidas dos o tres niveles el código se vuelve difícil de leer de adentro hacia afuera.",
        "La alternativa profesional en SQL Server son las CTE introducidas con la palabra clave WITH. Una CTE define una tabla temporal con nombre al inicio de la consulta, permitiéndote encadenar pasos lógicos de arriba hacia abajo exactamente como piensas el problema. Además, una CTE puede referenciarse múltiples veces en la consulta principal.",
      ],
      codigos: [
        {
          titulo: "Consultas 19 a 22: Subconsultas y CTE (WITH)",
          lenguaje: "sql",
          codigo: `-- 19. Subconsulta escalar: productos con precio superior al promedio del catálogo
SELECT ProductoID, NombreProducto, PrecioUnitario
FROM dbo.Productos
WHERE PrecioUnitario > (SELECT AVG(PrecioUnitario) FROM dbo.Productos);

-- 20. Subconsulta con IN: clientes que han comprado al menos un producto de Hardware
SELECT ClienteID, Nombre, Ciudad
FROM dbo.Clientes
WHERE ClienteID IN (
    SELECT DISTINCT pe.ClienteID
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pr.Categoria = N'Hardware'
      AND pe.Estado = N'Completado'
);

-- 21. CTE simple: calcular ventas por cliente y filtrar quienes superan el promedio
WITH VentasPorCliente AS (
    SELECT
        c.ClienteID,
        c.Nombre,
        SUM(pe.Cantidad * pr.PrecioUnitario) AS TotalCliente
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Clientes AS c ON pe.ClienteID = c.ClienteID
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pe.Estado = N'Completado'
    GROUP BY c.ClienteID, c.Nombre
)
SELECT
    ClienteID,
    Nombre,
    TotalCliente,
    (SELECT AVG(TotalCliente) FROM VentasPorCliente) AS PromedioClientes
FROM VentasPorCliente
WHERE TotalCliente > (SELECT AVG(TotalCliente) FROM VentasPorCliente);

-- 22. CTE encadenadas: resumen mensual y porcentaje de participación sobre el total
WITH VentasMensuales AS (
    SELECT
        FORMAT(pe.FechaPedido, 'yyyy-MM') AS Mes,
        SUM(pe.Cantidad * pr.PrecioUnitario) AS VentaMes
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pe.Estado = N'Completado'
    GROUP BY FORMAT(pe.FechaPedido, 'yyyy-MM')
),
TotalPeriodo AS (
    SELECT SUM(VentaMes) AS GranTotal FROM VentasMensuales
)
SELECT
    vm.Mes,
    vm.VentaMes,
    CAST(vm.VentaMes * 100.0 / tp.GranTotal AS DECIMAL(5, 2)) AS PorcentajeParticipacion
FROM VentasMensuales AS vm
CROSS JOIN TotalPeriodo AS tp
ORDER BY vm.Mes;`,
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-6",
        alt: "Consulta con CTE encadenadas en SSMS mostrando las ventas mensuales junto con su porcentaje de participación sobre el total.",
        caption: "Uso de CTE con WITH para estructurar cálculos por etapas de forma legible.",
        ratio: "16/9",
      },
    },
    {
      id: "funciones-de-ventana",
      titulo: "Funciones de ventana: ROW_NUMBER, RANK, LAG y SUM() OVER (23–25)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula rankings por grupo, comparaciones contra el pedido anterior y acumulados progresivos sin colapsar las filas.",
      parrafos: [
        "Las funciones de ventana (Window Functions) son la herramienta que separa a un usuario básico de SQL de un analista de datos preparado para entrevistas técnicas. A diferencia de GROUP BY, que colapsa muchas filas en una sola fila resumen, una función con OVER() calcula un valor agregado o de posición manteniendo intacto el detalle de cada fila.",
        "Dentro de OVER(...) usas PARTITION BY para definir el grupo independiente (por ejemplo, reiniciar el ranking o el acumulado para cada cliente o categoría) y ORDER BY para indicar la secuencia cronológica o de magnitud. ROW_NUMBER() asigna un correlativo único (1, 2, 3...), mientras que RANK() empata posiciones cuando hay igualdad.",
        "Por su parte, LAG() permite mirar la fila inmediatamente anterior dentro de la misma partición —ideal para comparar la venta actual contra el pedido previo del mismo cliente—, y SUM() OVER(ORDER BY ...) construye totales acumulados (running totals) en una sola línea.",
      ],
      codigos: [
        {
          titulo: "Consultas 23 a 25: Rankings, LAG y acumulado con OVER()",
          lenguaje: "sql",
          codigo: `-- 23. ROW_NUMBER y RANK: ranking de productos más vendidos dentro de cada categoría
WITH VentasProducto AS (
    SELECT
        pr.Categoria,
        pr.NombreProducto,
        SUM(pe.Cantidad * pr.PrecioUnitario) AS Ingreso
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pe.Estado = N'Completado'
    GROUP BY pr.Categoria, pr.NombreProducto
)
SELECT
    Categoria,
    NombreProducto,
    Ingreso,
    ROW_NUMBER() OVER (PARTITION BY Categoria ORDER BY Ingreso DESC) AS FilaEnCategoria,
    RANK() OVER (ORDER BY Ingreso DESC) AS RankingGeneral
FROM VentasProducto;

-- 24. LAG(): comparar el monto de cada pedido contra el pedido anterior del mismo cliente
WITH DetallePedidos AS (
    SELECT
        pe.ClienteID,
        c.Nombre,
        pe.PedidoID,
        pe.FechaPedido,
        SUM(pe.Cantidad * pr.PrecioUnitario) AS MontoPedido
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Clientes AS c ON pe.ClienteID = c.ClienteID
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pe.Estado = N'Completado'
    GROUP BY pe.ClienteID, c.Nombre, pe.PedidoID, pe.FechaPedido
)
SELECT
    Nombre,
    PedidoID,
    FechaPedido,
    MontoPedido,
    LAG(MontoPedido) OVER (PARTITION BY ClienteID ORDER BY FechaPedido, PedidoID) AS PedidoAnterior,
    MontoPedido - LAG(MontoPedido) OVER (PARTITION BY ClienteID ORDER BY FechaPedido, PedidoID) AS Variacion
FROM DetallePedidos
ORDER BY Nombre, FechaPedido;

-- 25. SUM() OVER: acumulado histórico de ventas día a día (running total)
WITH VentasDiarias AS (
    SELECT
        pe.FechaPedido,
        SUM(pe.Cantidad * pr.PrecioUnitario) AS VentaDia
    FROM dbo.Pedidos AS pe
    INNER JOIN dbo.Productos AS pr ON pe.ProductoID = pr.ProductoID
    WHERE pe.Estado = N'Completado'
    GROUP BY pe.FechaPedido
)
SELECT
    FechaPedido,
    VentaDia,
    SUM(VentaDia) OVER (
        ORDER BY FechaPedido
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS VentaAcumulada
FROM VentasDiarias
ORDER BY FechaPedido;`,
          nota: "Especificar ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW asegura un acumulado estricto fila a fila incluso si hubiera empates.",
        },
      ],
      captura: {
        id: "consultas-sql-ejemplos-paso-7",
        alt: "Resultado de funciones de ventana en SQL Server mostrando ROW_NUMBER por categoría, variación con LAG y acumulado diario con SUM() OVER.",
        caption: "Funciones de ventana en acción: ranking por categoría, comparación con LAG y acumulado progresivo.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Ejercicio resuelto extra de entrevista: Top 1 por grupo",
        texto:
          "Si te piden el producto más vendido de cada categoría, envuelve la consulta 23 en una CTE adicional y filtra WHERE FilaEnCategoria = 1. Ese patrón (CTE + ROW_NUMBER + filtro = 1) aparece en casi todas las pruebas técnicas de SQL.",
      },
      lista: [
        "Antes de entregar una consulta analítica en producción, contrasta el total general de tu consulta agregada contra la suma base de dbo.Pedidos filtrada por Estado = N'Completado' para confirmar que ningún JOIN multiplicó filas.",
        "Cuando trabajes con ventanas temporales en reportes financieros o comerciales, aclara siempre si el empate en un periodo o monto debe romper arbitrariamente (ROW_NUMBER), compartir puesto dejando huecos (RANK) o compartir puesto de manera continua (DENSE_RANK).",
        "Prefiere CAST o CONVERT explícitos hacia DECIMAL cuando calcules márgenes, variaciones porcentuales o participaciones sobre el total, evitando sorpresas por truncamiento entero.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Column 'Clientes.Nombre' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause",
      causa:
        "Incluiste una columna en el SELECT junto con SUM() o COUNT(), pero olvidaste agregarla en la cláusula GROUP BY.",
      solucion:
        "Agrega todas las columnas no agregadas del SELECT dentro del GROUP BY en el mismo nivel de la consulta.",
    },
    {
      error: "Comparar valores faltantes usando WHERE Email = NULL o Email <> NULL no devuelve filas",
      causa:
        "En SQL, cualquier comparación aritmética con NULL devuelve UNKNOWN (ni verdadero ni falso).",
      solucion:
        "Usa siempre WHERE Email IS NULL o WHERE Email IS NOT NULL.",
    },
    {
      error: "El LEFT JOIN se comporta como un INNER JOIN y desaparecen los clientes sin compras",
      causa:
        "Pusiste una condición sobre la tabla derecha (por ejemplo, WHERE pe.Estado = N'Completado') dentro del WHERE en vez del ON.",
      solucion:
        "Mueve el filtro de la tabla derecha a la cláusula ON del LEFT JOIN para conservar los registros sin pareja.",
    },
    {
      error: "División entera inesperada al calcular porcentajes (por ejemplo, 3 / 10 devuelve 0)",
      causa:
        "En SQL Server, dividir un entero (INT) entre otro entero trunca los decimales y devuelve un entero.",
      solucion:
        "Multiplica primero por 100.0 (con decimal) o convierte explícitamente uno de los operandos con CAST(campo AS DECIMAL(12,2)).",
    },
  ],
  plantilla: {
    titulo: "Pack de ejercicios SQL Server para entrevistas técnicas",
    descripcion:
      "Próximamente podrás descargar aquí el script .sql completo con enunciados adicionales, soluciones comentadas y datos de prueba ampliados.",
  },
  faqs: [
    {
      q: "¿En qué orden lógico ejecuta SQL Server una consulta SELECT?",
      a: "Aunque escribes SELECT primero, el motor procesa en este orden: 1) FROM y JOIN, 2) WHERE, 3) GROUP BY, 4) HAVING, 5) SELECT (y funciones de ventana), 6) DISTINCT, 7) ORDER BY y TOP. Por eso no puedes usar un alias creado en SELECT dentro del WHERE.",
    },
    {
      q: "¿Cuál es la diferencia entre COUNT(*) y COUNT(columna)?",
      a: "COUNT(*) cuenta todas las filas del grupo incluyendo aquellas que tienen valores NULL; COUNT(columna) cuenta únicamente las filas donde esa columna específica no es NULL.",
    },
    {
      q: "¿Cuándo conviene usar una CTE en lugar de una subconsulta?",
      a: "Usa una CTE (WITH) siempre que tengas más de un paso de transformación, necesites reutilizar el mismo resultado intermedio o quieras que otro analista entienda tu consulta de arriba hacia abajo sin leer paréntesis anidados.",
    },
    {
      q: "¿Estas consultas sirven en PostgreSQL o MySQL?",
      a: "Casi toda la lógica (SELECT, WHERE, JOIN, GROUP BY, HAVING, CTE y funciones de ventana) es SQL estándar. Solo debes adaptar TOP (N) por LIMIT N al final, y FORMAT(..., 'yyyy-MM') por TO_CHAR o DATE_FORMAT según el motor.",
    },
    {
      q: "¿Cuál es la diferencia entre ROW_NUMBER(), RANK() y DENSE_RANK()?",
      a: "ROW_NUMBER() siempre asigna números consecutivos únicos (1, 2, 3, 4) incluso si hay empate. RANK() asigna el mismo puesto al empate y salta el siguiente número (1, 2, 2, 4). DENSE_RANK() empata sin saltar números (1, 2, 2, 3).",
    },
  ],
  relacionadas: [
    "ia-para-sql",
    "conectar-power-bi-a-sql-server",
    "preguntas-entrevista-analista-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de SELECT en T-SQL (SQL Server)",
      url: "https://learn.microsoft.com/es-es/sql/t-sql/queries/select-transact-sql",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia de funciones de ventana (OVER) en SQL Server",
      url: "https://learn.microsoft.com/es-es/sql/t-sql/queries/select-over-clause-transact-sql",
      fuente: "Microsoft Learn",
    },
    {
      label: "Expresiones de tabla comunes (WITH / CTE) en T-SQL",
      url: "https://learn.microsoft.com/es-es/sql/t-sql/queries/with-common-table-expression-transact-sql",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Plantilla de ejercicios SQL Server para entrevistas",
      href: "/plantillas/ejercicios-sql-server-entrevistas",
      descripcion: "Descarga retos prácticos de T-SQL con soluciones paso a paso para preparar entrevistas.",
    },
  ],
};

export default guia;
