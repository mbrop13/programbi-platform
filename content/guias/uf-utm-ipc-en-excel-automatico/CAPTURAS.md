# Inventario de capturas — `uf-utm-ipc-en-excel-automatico`

| ID | Paso | Qué mostrar | Alt |
| :--- | :--- | :--- | :--- |
| `uf-utm-ipc-en-excel-automatico-paso-1` | Paso 1 | Editor de Power Query con la función personalizada `fnIndicador(codigo)` mostrando el ícono `fx` en el panel izquierdo y el código M en el Editor avanzado. | Editor de Power Query mostrando la función personalizada fnIndicador con el parámetro codigo y el ícono fx en el panel izquierdo |
| `uf-utm-ipc-en-excel-automatico-paso-2` | Paso 2 | Tabla `tblUF` cargada en Excel junto a celdas de conversión UF↔CLP usando `BUSCARX` y el formato numérico personalizado `"UF "#.##0,00`. | Tabla tblUF cargada en Excel junto a una tabla de contratos convirtiendo UF a CLP con BUSCARX y formato personalizado UF #.##0,00 |
| `uf-utm-ipc-en-excel-automatico-paso-3` | Paso 3 | Tabla `tblUTM` con fechas al primer día de cada mes y fórmula `=BUSCARX(FIN.MES(B2;-1)+1;tblUTM[Fecha];tblUTM[Valor])` calculando montos en pesos. | Hoja de cálculo mostrando tblUTM con fechas al día 1 de cada mes y fórmula BUSCARX con FIN.MES calculando el monto en pesos de una multa en UTM |
| `uf-utm-ipc-en-excel-automatico-paso-4` | Paso 4 | Tabla mensual de variaciones de IPC y celda aplicando `=PRODUCTO(1+C2:C13)-1` para calcular el reajuste compuesto acumulado. | Tabla de variaciones mensuales de IPC en Excel con la fórmula PRODUCTO(1+rango)-1 calculando el reajuste acumulado sobre un contrato |
