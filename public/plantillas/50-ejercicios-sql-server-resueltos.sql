-- ============================================================================
-- 40 Ejercicios de SQL Server (T-SQL) para Entrevistas Técnicas — ProgramBI
-- Incluye: Esquema + Datos Semilla (LATAM Retail) + 40 Ejercicios Resueltos
-- Niveles: Básico (1-10) | JOINs y Agregaciones (11-20) | Subconsultas y CTEs (21-30) | Window Functions (31-40)
-- ============================================================================

-- 1. CREACIÓN DE TABLAS
IF OBJECT_ID('dbo.DetallePedidos', 'U') IS NOT NULL DROP TABLE dbo.DetallePedidos;
IF OBJECT_ID('dbo.Pedidos', 'U') IS NOT NULL DROP TABLE dbo.Pedidos;
IF OBJECT_ID('dbo.Productos', 'U') IS NOT NULL DROP TABLE dbo.Productos;
IF OBJECT_ID('dbo.Clientes', 'U') IS NOT NULL DROP TABLE dbo.Clientes;
IF OBJECT_ID('dbo.Vendedores', 'U') IS NOT NULL DROP TABLE dbo.Vendedores;
GO

CREATE TABLE dbo.Clientes (
    ClienteID INT PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Ciudad NVARCHAR(60) NOT NULL,
    Pais NVARCHAR(40) NOT NULL,
    Segmento NVARCHAR(30) NOT NULL,
    FechaRegistro DATE NOT NULL
);

CREATE TABLE dbo.Vendedores (
    VendedorID INT PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Equipo NVARCHAR(40) NOT NULL,
    MetaMensualCLP BIGINT NOT NULL
);

CREATE TABLE dbo.Productos (
    ProductoID INT PRIMARY KEY,
    SKU NVARCHAR(20) NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Categoria NVARCHAR(40) NOT NULL,
    PrecioUnitarioCLP INT NOT NULL,
    CostoUnitarioCLP INT NOT NULL
);

CREATE TABLE dbo.Pedidos (
    PedidoID INT PRIMARY KEY,
    ClienteID INT NOT NULL REFERENCES dbo.Clientes(ClienteID),
    VendedorID INT NOT NULL REFERENCES dbo.Vendedores(VendedorID),
    FechaPedido DATE NOT NULL,
    Estado NVARCHAR(20) NOT NULL
);

CREATE TABLE dbo.DetallePedidos (
    DetalleID INT PRIMARY KEY,
    PedidoID INT NOT NULL REFERENCES dbo.Pedidos(PedidoID),
    ProductoID INT NOT NULL REFERENCES dbo.Productos(ProductoID),
    Cantidad INT NOT NULL,
    DescuentoPct DECIMAL(5,2) NOT NULL DEFAULT 0
);
GO

-- 2. DATOS SEMILLA
INSERT INTO dbo.Clientes VALUES
(1, 'Constructora Andina SpA', 'Santiago', 'Chile', 'Empresa', '2024-03-15'),
(2, 'Minera Atacama Norte', 'Antofagasta', 'Chile', 'Corporativo', '2024-06-01'),
(3, 'Retail Sur Ltda', 'Concepcion', 'Chile', 'Empresa', '2025-01-10'),
(4, 'Logistica Pacifico', 'Valparaiso', 'Chile', 'Pyme', '2025-04-22'),
(5, 'Servicios Australes', 'Puerto Montt', 'Chile', 'Pyme', '2025-08-05'),
(6, 'Grupo Cordillera', 'Mendoza', 'Argentina', 'Empresa', '2025-09-12'),
(7, 'Tech Lima SAC', 'Lima', 'Peru', 'Corporativo', '2025-11-03'),
(8, 'Comercial BioBio', 'Concepcion', 'Chile', 'Pyme', '2026-01-08');

INSERT INTO dbo.Vendedores VALUES
(10, 'Valentina Rojas', 'Corporativo', 15000000),
(11, 'Diego Fuentes', 'Pymes', 8000000),
(12, 'Camila Soto', 'Corporativo', 15000000),
(13, 'Matias Herrera', 'Regional', 10000000);

INSERT INTO dbo.Productos VALUES
(101, 'SW-PBI-01', 'Licencia Power BI Pro Anual', 'Software', 120000, 50000),
(102, 'HW-MON-24', 'Monitor Corporativo 24"', 'Hardware', 180000, 125000),
(103, 'SV-CAP-BI', 'Capacitacion Power BI Equipo', 'Servicios', 1500000, 550000),
(104, 'SV-CAP-SQL', 'Capacitacion SQL Server', 'Servicios', 1200000, 450000),
(105, 'HW-NBK-15', 'Notebook Analista 16GB', 'Hardware', 950000, 710000),
(106, 'SW-SQL-02', 'Conector ETL Empresarial', 'Software', 350000, 110000);

INSERT INTO dbo.Pedidos VALUES
(1001, 1, 10, '2026-01-05', 'Completado'),
(1002, 2, 10, '2026-01-12', 'Completado'),
(1003, 3, 11, '2026-01-18', 'Completado'),
(1004, 1, 12, '2026-02-02', 'Completado'),
(1005, 4, 11, '2026-02-10', 'Cancelado'),
(1006, 2, 10, '2026-02-14', 'Completado'),
(1007, 5, 13, '2026-02-20', 'Completado'),
(1008, 6, 12, '2026-03-01', 'Completado'),
(1009, 7, 10, '2026-03-08', 'Completado'),
(1010, 3, 11, '2026-03-15', 'Pendiente'),
(1011, 2, 12, '2026-03-22', 'Completado'),
(1012, 1, 10, '2026-03-28', 'Completado');

INSERT INTO dbo.DetallePedidos VALUES
(1, 1001, 103, 1, 0.00), (2, 1001, 101, 10, 0.10),
(3, 1002, 105, 4, 0.05),  (4, 1002, 106, 2, 0.00),
(5, 1003, 102, 6, 0.00),  (6, 1003, 101, 5, 0.00),
(7, 1004, 104, 1, 0.00),  (8, 1005, 102, 2, 0.00),
(9, 1006, 103, 2, 0.10),  (10, 1007, 101, 8, 0.00),
(11, 1008, 105, 3, 0.00), (12, 1009, 103, 1, 0.05),
(13, 1010, 106, 1, 0.00), (14, 1011, 104, 2, 0.10),
(15, 1012, 101, 15, 0.15),(16, 1012, 102, 4, 0.00);
GO

-- ============================================================================
-- BLOQUE 1: FUNDAMENTOS (Ejercicios 1 al 10)
-- ============================================================================

-- 01. Listar todos los clientes de Chile ordenados alfabéticamente.
SELECT ClienteID, Nombre, Ciudad, Segmento
FROM dbo.Clientes
WHERE Pais = 'Chile'
ORDER BY Nombre ASC;

-- 02. Obtener los 3 productos más caros.
SELECT TOP 3 ProductoID, Nombre, Categoria, PrecioUnitarioCLP
FROM dbo.Productos
ORDER BY PrecioUnitarioCLP DESC;

-- 03. Calcular el margen unitario en pesos y porcentaje de cada producto.
SELECT
    SKU,
    Nombre,
    PrecioUnitarioCLP - CostoUnitarioCLP AS MargenCLP,
    CAST(100.0 * (PrecioUnitarioCLP - CostoUnitarioCLP) / PrecioUnitarioCLP AS DECIMAL(5,2)) AS MargenPct
FROM dbo.Productos;

-- 04. Listar pedidos realizados en febrero de 2026 que NO estén cancelados.
SELECT PedidoID, ClienteID, FechaPedido, Estado
FROM dbo.Pedidos
WHERE FechaPedido >= '2026-02-01' AND FechaPedido < '2026-03-01'
  AND Estado <> 'Cancelado';

-- 05. Contar cuántos clientes existen por país y segmento.
SELECT Pais, Segmento, COUNT(*) AS TotalClientes
FROM dbo.Clientes
GROUP BY Pais, Segmento
ORDER BY Pais, TotalClientes DESC;

-- 06. Buscar productos cuyo nombre contenga la palabra 'Power BI' o 'SQL'.
SELECT ProductoID, SKU, Nombre
FROM dbo.Productos
WHERE Nombre LIKE '%Power BI%' OR Nombre LIKE '%SQL%';

-- 07. Obtener las categorías de productos distintas disponibles.
SELECT DISTINCT Categoria FROM dbo.Productos;

-- 08. Contar pedidos por estado.
SELECT Estado, COUNT(*) AS CantidadPedidos
FROM dbo.Pedidos
GROUP BY Estado;

-- 09. Listar clientes registrados durante el año 2025.
SELECT ClienteID, Nombre, FechaRegistro
FROM dbo.Clientes
WHERE YEAR(FechaRegistro) = 2025;

-- 10. Calcular el precio promedio por categoría de producto.
SELECT Categoria, AVG(CAST(PrecioUnitarioCLP AS BIGINT)) AS PrecioPromedioCLP
FROM dbo.Productos
GROUP BY Categoria;

-- ============================================================================
-- BLOQUE 2: JOINS Y AGREGACIONES DE NEGOCIO (Ejercicios 11 al 20)
-- ============================================================================

-- 11. Calcular la venta neta total de cada pedido completado (considerando descuento).
SELECT
    p.PedidoID,
    p.FechaPedido,
    SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaNetaCLP
FROM dbo.Pedidos p
INNER JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
INNER JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY p.PedidoID, p.FechaPedido
ORDER BY VentaNetaCLP DESC;

-- 12. Ventas totales y margen bruto por categoría de producto (solo pedidos completados).
SELECT
    pr.Categoria,
    SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaNetaCLP,
    SUM(d.Cantidad * (pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) - pr.CostoUnitarioCLP)) AS MargenBrutoCLP
FROM dbo.Pedidos p
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY pr.Categoria
ORDER BY VentaNetaCLP DESC;

-- 13. Encontrar clientes que NUNCA han realizado un pedido (LEFT JOIN anti-join).
SELECT c.ClienteID, c.Nombre, c.Ciudad
FROM dbo.Clientes c
LEFT JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID
WHERE p.PedidoID IS NULL;

-- 14. Ranking de vendedores por venta acumulada vs su meta mensual.
SELECT
    v.Nombre AS Vendedor,
    v.Equipo,
    ISNULL(SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)), 0) AS VentaTotalCLP,
    v.MetaMensualCLP
FROM dbo.Vendedores v
LEFT JOIN dbo.Pedidos p ON v.VendedorID = p.VendedorID AND p.Estado = 'Completado'
LEFT JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
LEFT JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
GROUP BY v.VendedorID, v.Nombre, v.Equipo, v.MetaMensualCLP
ORDER BY VentaTotalCLP DESC;

-- 15. Clientes con más de 1 pedido completado (HAVING).
SELECT c.Nombre, COUNT(p.PedidoID) AS PedidosCompletados
FROM dbo.Clientes c
JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID
WHERE p.Estado = 'Completado'
GROUP BY c.ClienteID, c.Nombre
HAVING COUNT(p.PedidoID) > 1;

-- 16. Ventas mensuales (Año-Mes) en pedidos completados.
SELECT
    FORMAT(p.FechaPedido, 'yyyy-MM') AS AnioMes,
    COUNT(DISTINCT p.PedidoID) AS Pedidos,
    SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaNetaCLP
FROM dbo.Pedidos p
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY FORMAT(p.FechaPedido, 'yyyy-MM')
ORDER BY AnioMes;

-- 17. Ticket promedio por segmento de cliente.
SELECT
    c.Segmento,
    AVG(t.VentaPedido) AS TicketPromedioCLP
FROM (
    SELECT p.PedidoID, p.ClienteID, SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaPedido
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY p.PedidoID, p.ClienteID
) t
JOIN dbo.Clientes c ON t.ClienteID = c.ClienteID
GROUP BY c.Segmento;

-- 18. Productos que no se vendieron en marzo de 2026.
SELECT pr.ProductoID, pr.Nombre
FROM dbo.Productos pr
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.DetallePedidos d
    JOIN dbo.Pedidos p ON d.PedidoID = p.PedidoID
    WHERE d.ProductoID = pr.ProductoID
      AND p.Estado = 'Completado'
      AND p.FechaPedido >= '2026-03-01' AND p.FechaPedido < '2026-04-01'
);

-- 19. Total de unidades vendidas por país del cliente.
SELECT c.Pais, SUM(d.Cantidad) AS UnidadesTotales
FROM dbo.Clientes c
JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
WHERE p.Estado = 'Completado'
GROUP BY c.Pais;

-- 20. Pedidos que incluyen al menos un producto de categoría 'Servicios' y uno de 'Software'.
SELECT p.PedidoID
FROM dbo.Pedidos p
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE pr.Categoria IN ('Servicios', 'Software')
GROUP BY p.PedidoID
HAVING COUNT(DISTINCT pr.Categoria) = 2;

-- ============================================================================
-- BLOQUE 3: SUBCONSULTAS Y CTEs (Ejercicios 21 al 30)
-- ============================================================================

-- 21. CTE: Clientes cuya venta total supera el promedio de venta por cliente.
WITH VentasCliente AS (
    SELECT
        p.ClienteID,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS TotalCLP
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY p.ClienteID
)
SELECT c.Nombre, vc.TotalCLP
FROM VentasCliente vc
JOIN dbo.Clientes c ON vc.ClienteID = c.ClienteID
WHERE vc.TotalCLP > (SELECT AVG(TotalCLP) FROM VentasCliente);

-- 22. CTE: Participación porcentual de cada categoría sobre la venta total.
WITH VentasCat AS (
    SELECT
        pr.Categoria,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY pr.Categoria
)
SELECT
    Categoria,
    VentaCLP,
    CAST(100.0 * VentaCLP / SUM(VentaCLP) OVER () AS DECIMAL(5,2)) AS ParticipacionPct
FROM VentasCat
ORDER BY VentaCLP DESC;

-- 23. Días promedio entre la fecha de registro del cliente y su primer pedido.
WITH PrimerPedido AS (
    SELECT ClienteID, MIN(FechaPedido) AS PrimeraFecha
    FROM dbo.Pedidos
    GROUP BY ClienteID
)
SELECT AVG(DATEDIFF(DAY, c.FechaRegistro, pp.PrimeraFecha)) AS DiasPromedioActivacion
FROM dbo.Clientes c
JOIN PrimerPedido pp ON c.ClienteID = pp.ClienteID;

-- 24. Matriz pivoteada (SUM CASE): Ventas por categoría en columnas por mes.
SELECT
    FORMAT(p.FechaPedido, 'yyyy-MM') AS Mes,
    SUM(CASE WHEN pr.Categoria = 'Software' THEN d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) ELSE 0 END) AS SoftwareCLP,
    SUM(CASE WHEN pr.Categoria = 'Hardware' THEN d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) ELSE 0 END) AS HardwareCLP,
    SUM(CASE WHEN pr.Categoria = 'Servicios' THEN d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) ELSE 0 END) AS ServiciosCLP
FROM dbo.Pedidos p
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY FORMAT(p.FechaPedido, 'yyyy-MM')
ORDER BY Mes;

-- 25. Detectar clientes recurrentes (>= 2 meses distintos con compra).
WITH MesesCliente AS (
    SELECT ClienteID, COUNT(DISTINCT FORMAT(FechaPedido, 'yyyy-MM')) AS MesesActivos
    FROM dbo.Pedidos
    WHERE Estado = 'Completado'
    GROUP BY ClienteID
)
SELECT c.Nombre, mc.MesesActivos
FROM MesesCliente mc
JOIN dbo.Clientes c ON mc.ClienteID = c.ClienteID
WHERE mc.MesesActivos >= 2;

-- 26. Calcular el descuento promedio ponderado otorgado por cada vendedor.
SELECT
    v.Nombre,
    CAST(100.0 * SUM(d.Cantidad * pr.PrecioUnitarioCLP * d.DescuentoPct)
        / NULLIF(SUM(d.Cantidad * pr.PrecioUnitarioCLP), 0) AS DECIMAL(5,2)) AS DescuentoPonderadoPct
FROM dbo.Vendedores v
JOIN dbo.Pedidos p ON v.VendedorID = p.VendedorID
JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY v.Nombre;

-- 27. Productos con margen bruto total superior a $1.000.000 CLP.
SELECT
    pr.Nombre,
    SUM(d.Cantidad * (pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) - pr.CostoUnitarioCLP)) AS MargenTotalCLP
FROM dbo.DetallePedidos d
JOIN dbo.Pedidos p ON d.PedidoID = p.PedidoID
JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
WHERE p.Estado = 'Completado'
GROUP BY pr.ProductoID, pr.Nombre
HAVING SUM(d.Cantidad * (pr.PrecioUnitarioCLP * (1 - d.DescuentoPct) - pr.CostoUnitarioCLP)) > 1000000;

-- 28. Porcentaje de pedidos cancelados sobre el total de pedidos.
SELECT
    CAST(100.0 * SUM(CASE WHEN Estado = 'Cancelado' THEN 1 ELSE 0 END) / COUNT(*) AS DECIMAL(5,2)) AS TasaCancelacionPct
FROM dbo.Pedidos;

-- 29. Último pedido de cada cliente usando CTE + MAX(FechaPedido).
WITH Ultimo AS (
    SELECT ClienteID, MAX(FechaPedido) AS UltimaFecha
    FROM dbo.Pedidos
    GROUP BY ClienteID
)
SELECT c.Nombre, p.PedidoID, p.FechaPedido, p.Estado
FROM Ultimo u
JOIN dbo.Pedidos p ON u.ClienteID = p.ClienteID AND u.UltimaFecha = p.FechaPedido
JOIN dbo.Clientes c ON c.ClienteID = u.ClienteID;

-- 30. Clasificar clientes por tamaño de compra (Alto, Medio, Bajo).
WITH Totales AS (
    SELECT c.Nombre, ISNULL(SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)), 0) AS VentaCLP
    FROM dbo.Clientes c
    LEFT JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID AND p.Estado = 'Completado'
    LEFT JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    LEFT JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    GROUP BY c.ClienteID, c.Nombre
)
SELECT
    Nombre,
    VentaCLP,
    CASE
        WHEN VentaCLP >= 3000000 THEN 'Tier A - Alto'
        WHEN VentaCLP >= 1000000 THEN 'Tier B - Medio'
        ELSE 'Tier C - Bajo'
    END AS Tier
FROM Totales
ORDER BY VentaCLP DESC;

-- ============================================================================
-- BLOQUE 4: WINDOW FUNCTIONS (Ejercicios 31 al 40)
-- ============================================================================

-- 31. Ranking de clientes por venta total usando DENSE_RANK().
WITH VentasCliente AS (
    SELECT c.Nombre, SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.Clientes c
    JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID AND p.Estado = 'Completado'
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    GROUP BY c.ClienteID, c.Nombre
)
SELECT
    Nombre,
    VentaCLP,
    DENSE_RANK() OVER (ORDER BY VentaCLP DESC) AS Ranking
FROM VentasCliente;

-- 32. Venta acumulada mensual (Running Total) en 2026.
WITH Mensual AS (
    SELECT
        FORMAT(p.FechaPedido, 'yyyy-MM') AS Mes,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaMes
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY FORMAT(p.FechaPedido, 'yyyy-MM')
)
SELECT
    Mes,
    VentaMes,
    SUM(VentaMes) OVER (ORDER BY Mes ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS VentaAcumulada
FROM Mensual;

-- 33. Variación porcentual mes a mes (MoM %) usando LAG().
WITH Mensual AS (
    SELECT
        FORMAT(p.FechaPedido, 'yyyy-MM') AS Mes,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaMes
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY FORMAT(p.FechaPedido, 'yyyy-MM')
)
SELECT
    Mes,
    VentaMes,
    LAG(VentaMes) OVER (ORDER BY Mes) AS VentaMesAnterior,
    CAST(100.0 * (VentaMes - LAG(VentaMes) OVER (ORDER BY Mes)) / NULLIF(LAG(VentaMes) OVER (ORDER BY Mes), 0) AS DECIMAL(6,2)) AS VariacionMoMPct
FROM Mensual;

-- 34. Top 1 producto más vendido dentro de cada categoría (ROW_NUMBER + PARTITION BY).
WITH ProdCat AS (
    SELECT
        pr.Categoria,
        pr.Nombre,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP,
        ROW_NUMBER() OVER (PARTITION BY pr.Categoria ORDER BY SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) DESC) AS rn
    FROM dbo.DetallePedidos d
    JOIN dbo.Pedidos p ON d.PedidoID = p.PedidoID AND p.Estado = 'Completado'
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    GROUP BY pr.Categoria, pr.Nombre
)
SELECT Categoria, Nombre, VentaCLP
FROM ProdCat
WHERE rn = 1;

-- 35. Días transcurridos entre pedidos consecutivos de cada cliente (LAG).
SELECT
    ClienteID,
    PedidoID,
    FechaPedido,
    LAG(FechaPedido) OVER (PARTITION BY ClienteID ORDER BY FechaPedido) AS PedidoAnterior,
    DATEDIFF(DAY, LAG(FechaPedido) OVER (PARTITION BY ClienteID ORDER BY FechaPedido), FechaPedido) AS DiasEntrePedidos
FROM dbo.Pedidos
WHERE Estado = 'Completado';

-- 36. Promedio móvil de las últimas 3 ventas (ordenado por fecha de pedido).
WITH PedidosVal AS (
    SELECT
        p.PedidoID,
        p.FechaPedido,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY p.PedidoID, p.FechaPedido
)
SELECT
    PedidoID,
    FechaPedido,
    VentaCLP,
    AVG(VentaCLP) OVER (ORDER BY FechaPedido, PedidoID ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS PromedioMovil3
FROM PedidosVal;

-- 37. Participación de cada pedido sobre el total del cliente.
WITH PedidosVal AS (
    SELECT
        p.ClienteID,
        p.PedidoID,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.Pedidos p
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    WHERE p.Estado = 'Completado'
    GROUP BY p.ClienteID, p.PedidoID
)
SELECT
    ClienteID,
    PedidoID,
    VentaCLP,
    CAST(100.0 * VentaCLP / SUM(VentaCLP) OVER (PARTITION BY ClienteID) AS DECIMAL(5,2)) AS PctDelCliente
FROM PedidosVal;

-- 38. Detectar el primer y último pedido de cada vendedor (FIRST_VALUE / LAST_VALUE).
SELECT DISTINCT
    VendedorID,
    FIRST_VALUE(PedidoID) OVER (PARTITION BY VendedorID ORDER BY FechaPedido ASC) AS PrimerPedidoID,
    LAST_VALUE(PedidoID) OVER (PARTITION BY VendedorID ORDER BY FechaPedido ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS UltimoPedidoID
FROM dbo.Pedidos
WHERE Estado = 'Completado';

-- 39. Dividir los clientes en cuartiles de facturación (NTILE(4)).
WITH VentasCliente AS (
    SELECT c.Nombre, SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.Clientes c
    JOIN dbo.Pedidos p ON c.ClienteID = p.ClienteID AND p.Estado = 'Completado'
    JOIN dbo.DetallePedidos d ON p.PedidoID = d.PedidoID
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    GROUP BY c.ClienteID, c.Nombre
)
SELECT Nombre, VentaCLP, NTILE(4) OVER (ORDER BY VentaCLP DESC) AS Cuartil
FROM VentasCliente;

-- 40. Pareto 80/20: Porcentaje acumulado de ventas por producto.
WITH VentasProd AS (
    SELECT
        pr.Nombre,
        SUM(d.Cantidad * pr.PrecioUnitarioCLP * (1 - d.DescuentoPct)) AS VentaCLP
    FROM dbo.DetallePedidos d
    JOIN dbo.Pedidos p ON d.PedidoID = p.PedidoID AND p.Estado = 'Completado'
    JOIN dbo.Productos pr ON d.ProductoID = pr.ProductoID
    GROUP BY pr.ProductoID, pr.Nombre
)
SELECT
    Nombre,
    VentaCLP,
    CAST(100.0 * SUM(VentaCLP) OVER (ORDER BY VentaCLP DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
        / SUM(VentaCLP) OVER () AS DECIMAL(5,2)) AS ParetoAcumuladoPct
FROM VentasProd
ORDER BY VentaCLP DESC;
