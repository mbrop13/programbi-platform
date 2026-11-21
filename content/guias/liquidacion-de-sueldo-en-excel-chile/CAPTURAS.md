# Inventario de capturas — `liquidacion-de-sueldo-en-excel-chile`

| ID | Ratio | Archivo sugerido | Qué debe mostrar la captura |
| --- | --- | --- | --- |
| `liquidacion-de-sueldo-en-excel-chile-paso-1` | 16/9 | `paso-1-hoja-parametros.png` | Hoja `Parametros` con fecha de vigencia, celdas parametrizadas de UF, UTM, topes imponibles, tabla `tblAFP` y tabla `tblTramosIUSC` (sin valores inventados, con celdas editables). |
| `liquidacion-de-sueldo-en-excel-chile-paso-2` | 16/9 | `paso-2-haberes.png` | Hoja `Liquidacion` mostrando cabecera del trabajador, bloque de Haberes Imponibles y bloque de Haberes No Imponibles. |
| `liquidacion-de-sueldo-en-excel-chile-paso-3` | 16/9 | `paso-3-tope-imponible-min.png` | Barra de fórmulas mostrando `REDONDEAR(MIN(...);0)` para `Base_Imponible_AFP_Salud` y `Base_Imponible_AFC`. |
| `liquidacion-de-sueldo-en-excel-chile-paso-4` | 16/9 | `paso-4-descuentos-previsionales.png` | Bloque de descuentos legales con fórmulas de AFP (`BUSCARX`), Salud (`7 %` o `MAX` Isapre) y Seguro de Cesantía (`SI` por tipo de contrato). |
| `liquidacion-de-sueldo-en-excel-chile-paso-5` | 16/9 | `paso-5-impuesto-unico-buscarx.png` | Cálculo de Base Tributable en UTM y fórmula `BUSCARX(...;0;-1)` obteniendo factor y rebaja desde `tblTramosIUSC`. |
| `liquidacion-de-sueldo-en-excel-chile-paso-6` | 16/9 | `paso-6-sueldo-liquido.png` | Resumen inferior de la liquidación con Total Haberes, Total Descuentos Legales, Otros Descuentos y Sueldo Líquido a pagar. |
