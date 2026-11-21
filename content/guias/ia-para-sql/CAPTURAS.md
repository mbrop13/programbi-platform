# Capturas requeridas — `ia-para-sql`

1. `ia-para-sql-paso-1` (16/9)
   - **Qué mostrar:** Generación de script `CREATE TABLE` desde el Explorador de objetos en SSMS (sin datos de filas).
   - **Alt:** Script DDL generado desde SQL Server Management Studio sin incluir filas de datos reales.

2. `ia-para-sql-paso-2` (16/9)
   - **Qué mostrar:** Ventana de consulta en SQL Server ejecutando el script `CREATE TABLE` e `INSERT` del dataset ficticio con mensaje de filas afectadas.
   - **Alt:** Ejecución exitosa del script CREATE TABLE e INSERT en el editor de consultas de SQL Server.

3. `ia-para-sql-paso-3` (16/9)
   - **Qué mostrar:** Cuadrícula de resultados en SQL Server mostrando los cuatro clientes ficticios, incluyendo Camila Rojas con `0` en `VentaNetaCLP`.
   - **Alt:** Resultado tabular en SQL Server mostrando los cuatro clientes, incluyendo Camila Rojas con venta neta cero.

4. `ia-para-sql-paso-4` (16/9)
   - **Qué mostrar:** Respuesta de IA desglosando el grano de salida, filtros y versión refactorizada con CTE de una consulta heredada.
   - **Alt:** Prompt de auditoría de consulta SQL heredada mostrando explicación por bloques y versión refactorizada con CTE.

5. `ia-para-sql-paso-5` (16/9)
   - **Qué mostrar:** Plan de ejecución real en SSMS mostrando operador `Index Seek` tras reemplazar `YEAR(FechaPedido)` por un rango `SARGable`.
   - **Alt:** Plan de ejecución en SQL Server mostrando cambio de Index Scan a Index Seek tras reescribir el filtro de fechas.
