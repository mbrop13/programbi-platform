# Inventario de capturas — `control-de-gastos-en-excel`

| ID | Paso | Qué mostrar | Alt |
| :--- | :--- | :--- | :--- |
| `control-de-gastos-en-excel-paso-1` | Paso 1 | Hoja `Config` con la tabla `tblCategorias` mostrando las columnas `Tipo`, `Categoría` y `PresupuestoMensual` en pesos chilenos. | Hoja Config en Excel mostrando la tabla tblCategorias con columnas Tipo, Categoría y PresupuestoMensual |
| `control-de-gastos-en-excel-paso-2` | Paso 2 | Cuadro Validación de datos configurado como Lista con origen `=Config!$F$2#` conectado al rango derramado por `=UNICOS(tblCategorias[Categoría])`. | Ventana de Validación de datos en Excel configurada como Lista con origen =Config!$F$2# conectado a la fórmula UNICOS |
| `control-de-gastos-en-excel-paso-3` | Paso 3 | Tabla Dinámica resumiendo gastos de `tblGastos` por `Categoría` en filas y `Mes` en columnas. | Tabla Dinámica en Excel agrupando gastos por Categoría en filas y Mes en columnas desde tblGastos |
| `control-de-gastos-en-excel-paso-4` | Paso 4 | Hoja `Resumen` comparando Presupuesto, Gasto Real (`SUMAR.SI.CONJUNTO`), Diferencia y `% Ejecutado` con formato condicional. | Tabla comparativa Presupuesto vs Real por categoría en Excel con columnas Presupuesto, Gasto Real, Diferencia y % Ejecutado con formato condicional |
| `control-de-gastos-en-excel-paso-5` | Paso 5 | Gráfico dinámico de barras horizontales por categoría junto a segmentadores de datos para `Mes` y `Medio de Pago`. | Dashboard personal en Excel con gráfico de barras de gastos por categoría y segmentadores interactivos de Mes y Medio de Pago |
