# Inventario de capturas — `inventario-en-excel-entradas-y-salidas`

| ID | Ratio | Archivo sugerido | Qué debe mostrar la captura |
| --- | --- | --- | --- |
| `inventario-en-excel-entradas-y-salidas-paso-1` | 16/9 | `paso-1-maestro-productos.png` | Hoja `Productos` convertida en `tblProductos` con columnas `SKU`, `Producto`, `Stock_Inicial`, `Stock_Minimo`, `Entradas`, `Salidas`, `Stock_Actual` y `Estado`. |
| `inventario-en-excel-entradas-y-salidas-paso-2` | 16/9 | `paso-2-kardex-movimientos.png` | Hoja `Movimientos` con tabla `tblMovimientos`, desplegable de `Tipo` (`Entrada` / `Salida`) y columna `Producto` autocompletada con `BUSCARX`. |
| `inventario-en-excel-entradas-y-salidas-paso-3` | 16/9 | `paso-3-stock-sumar-si-conjunto.png` | Barra de fórmulas mostrando `SUMAR.SI.CONJUNTO` en la columna `Entradas` de `tblProductos` y el resultado en `Stock_Actual`. |
| `inventario-en-excel-entradas-y-salidas-paso-4` | 16/9 | `paso-4-valorizacion-costo-promedio.png` | Columnas `Costo_Promedio` y `Valor_Inventario` con la fila de totales activa mostrando el valor total de la bodega. |
| `inventario-en-excel-entradas-y-salidas-paso-5` | 16/9 | `paso-5-alerta-stock-minimo.png` | Columna `Estado` resaltada con formato condicional (`Sin stock` en rojo, `Reponer` en amarillo y `OK` en verde). |
| `inventario-en-excel-entradas-y-salidas-paso-6` | 16/9 | `paso-6-buscador-sku.png` | Hoja `Consulta` con celda de entrada de `SKU` y fórmula `BUSCARX` mostrando los datos del producto al instante. |
