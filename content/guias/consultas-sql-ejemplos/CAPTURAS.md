# Capturas requeridas — `consultas-sql-ejemplos`

1. `consultas-sql-ejemplos-paso-1` (16/9)
   - **Qué mostrar:** SQL Server Management Studio (SSMS) o VS Code con el script `CREATE TABLE` + `INSERT` ejecutado mostrando el mensaje de filas afectadas sin errores y las tablas `Clientes`, `Productos` y `Pedidos` en el explorador de objetos.
   - **Alt:** SQL Server Management Studio mostrando la ejecución exitosa del script de creación de Clientes, Productos y Pedidos.

2. `consultas-sql-ejemplos-paso-2` (16/9)
   - **Qué mostrar:** Editor de consultas con los ejemplos 1–5 (`WHERE` con `AND`, `BETWEEN`, `IN`, `LIKE` e `IS NULL`) y el panel de resultados inferior mostrando las filas filtradas.
   - **Alt:** Resultado en SQL Server de las consultas WHERE mostrando los clientes sin correo electrónico y los pedidos filtrados de octubre.

3. `consultas-sql-ejemplos-paso-3` (16/9)
   - **Qué mostrar:** Panel de resultados en SSMS ejecutando `TOP (3)` ordenado por precio descendente y `SELECT DISTINCT Ciudad` ordenado alfabéticamente.
   - **Alt:** Grilla de resultados en SSMS mostrando el Top 3 de productos más caros y la lista única de ciudades con DISTINCT.

4. `consultas-sql-ejemplos-paso-4` (16/9)
   - **Qué mostrar:** Resultado del anti-join (`LEFT JOIN ... WHERE ... IS NULL`) mostrando a Valentina Pérez en clientes sin pedidos y Docking Station USB-C en productos sin ventas.
   - **Alt:** Resultado del anti-join en SQL Server mostrando al cliente Valentina Pérez sin pedidos y al Docking Station USB-C sin ventas.

5. `consultas-sql-ejemplos-paso-5` (16/9)
   - **Qué mostrar:** Grilla de resultados de `GROUP BY` por categoría y la consulta con `HAVING` filtrando clientes con >= 2 pedidos y monto superior a $500.000.
   - **Alt:** Tabla de resultados en SQL Server mostrando ventas totales por categoría y clientes filtrados con HAVING.

6. `consultas-sql-ejemplos-paso-6` (16/9)
   - **Qué mostrar:** Consulta con CTE encadenadas (`WITH VentasMensuales AS ..., TotalPeriodo AS ...`) y la tabla resultante con el porcentaje de participación mensual.
   - **Alt:** Consulta con CTE encadenadas en SSMS mostrando las ventas mensuales junto con su porcentaje de participación sobre el total.

7. `consultas-sql-ejemplos-paso-7` (16/9)
   - **Qué mostrar:** Panel de resultados mostrando `ROW_NUMBER()`, `RANK()`, `LAG()` con variación por cliente y `SUM() OVER` con el acumulado progresivo.
   - **Alt:** Resultado de funciones de ventana en SQL Server mostrando ROW_NUMBER por categoría, variación con LAG y acumulado diario con SUM() OVER.
