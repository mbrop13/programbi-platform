# Capturas requeridas — `buscarv-y-buscarx-en-excel`

1. `buscarv-y-buscarx-en-excel-paso-1` (16/9)
   - **Qué mostrar:** Hoja de Excel con `Catalogo` en `A1:D6` (`Categoria` a la izquierda del `SKU`) y tabla `Pedidos` lista en `F1:H6`.
   - **Alt:** Hoja de Excel con la tabla Catalogo en A1:D6 y la tabla Pedidos lista para cruzar por SKU.

2. `buscarv-y-buscarx-en-excel-paso-2` (16/9)
   - **Qué mostrar:** Barra de fórmulas mostrando `=BUSCARV(F2;$B$2:$D$6;3;FALSO)` y el resultado `39990` en la celda.
   - **Alt:** Fórmula BUSCARV en Excel devolviendo 39990 para el código SKU-201 con referencia absoluta $B$2:$D$6.

3. `buscarv-y-buscarx-en-excel-paso-3` (16/9)
   - **Qué mostrar:** Barra de fórmulas mostrando `=BUSCARX(F2;$B$2:$B$6;$A$2:$A$6;"SKU no encontrado")` trayendo la categoría hacia la izquierda.
   - **Alt:** Fórmula BUSCARX en Excel trayendo la Categoría desde la columna A ubicada a la izquierda del SKU.

4. `buscarv-y-buscarx-en-excel-paso-4` (16/9)
   - **Qué mostrar:** Celda con `=SI.ND(INDICE($A$2:$A$6;COINCIDIR(F2;$B$2:$B$6;0));"SKU no encontrado")` evaluándose correctamente.
   - **Alt:** Fórmula INDICE y COINCIDIR envuelta en SI.ND devolviendo la categoría del SKU en Excel.
