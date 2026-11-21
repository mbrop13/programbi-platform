# Capturas requeridas — `funcion-si-excel-varias-condiciones`

1. `funcion-si-excel-varias-condiciones-paso-1` (16/9)
   - **Qué mostrar:** Tabla en Microsoft Excel con columna de Ventas en `B2:B8`, celda parámetro de Meta en `$E$1` (`500000`) y barra de fórmulas mostrando `=SI(B2>=$E$1; "Meta cumplida"; "Bajo meta")`.
   - **Alt:** Hoja de Excel mostrando una tabla de vendedores con la fórmula SI básica evaluando si la venta supera la meta.

2. `funcion-si-excel-varias-condiciones-paso-2` (16/9)
   - **Qué mostrar:** Hoja de Excel con columnas Venta, Devoluciones y Sucursal evaluadas mediante `=SI(Y(B2>=800000; C2<2; D2="Santiago"); "Bono aprobado"; "No aplica")` y un segundo ejemplo con `O(...)`.
   - **Alt:** Tabla en Excel con columnas de Venta, Devoluciones y Sucursal evaluadas mediante SI combinada con Y y O.

3. `funcion-si-excel-varias-condiciones-paso-3` (16/9)
   - **Qué mostrar:** Barra de fórmulas ampliada en Excel mostrando una `SI` anidada de cuatro niveles con colores de paréntesis diferenciados evaluando porcentajes de cumplimiento.
   - **Alt:** Barra de fórmulas de Excel mostrando una función SI anidada con colores de paréntesis diferenciados para cuatro niveles.

4. `funcion-si-excel-varias-condiciones-paso-4` (16/9)
   - **Qué mostrar:** Fórmula `=SI.CONJUNTO(B2>=1; "Sobresaliente"; B2>=0,85; "Cumplido"; B2>=0,6; "En desarrollo"; VERDADERO; "Crítico")` abierta en la barra de fórmulas con el tooltip de argumentos visible.
   - **Alt:** Fórmula SI.CONJUNTO en Excel comparando pares de condición y resultado sin paréntesis múltiples al final.

5. `funcion-si-excel-varias-condiciones-paso-5` (16/9)
   - **Qué mostrar:** Hoja de Excel con una tabla auxiliar de tramos en `G2:H6` (piso de venta y tasa de comisión) y la columna de resultados calculada con `=BUSCARX(B2; $G$2:$G$6; $H$2:$H$6; 0; -1)`.
   - **Alt:** Comparación en Excel entre una tabla auxiliar de tramos de comisión y la fórmula BUSCARX con modo -1.
