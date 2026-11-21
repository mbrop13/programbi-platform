# Capturas requeridas — `tabla-calendario-power-bi-dax`

1. `tabla-calendario-power-bi-dax-paso-1` (16/9)
   - **Qué mostrar:** Ventana `Opciones > Carga de datos` en Power BI Desktop con la casilla `Fecha y hora automáticas` desmarcada.
   - **Alt:** Configuración en Power BI Desktop desactivando la opción Fecha y hora automáticas para nuevos archivos.

2. `tabla-calendario-power-bi-dax-paso-2` (16/9)
   - **Qué mostrar:** Vista de datos mostrando la tabla `Calendario` creada con DAX (`Date`, `Anio`, `MesNum`, `Mes`, `Trimestre`, `DiaSemana`).
   - **Alt:** Vista de datos de Power BI Desktop mostrando la tabla Calendario generada por DAX con columnas en español.

3. `tabla-calendario-power-bi-dax-paso-3` (16/9)
   - **Qué mostrar:** Editor avanzado de Power Query mostrando el script en lenguaje M con `List.Dates` y `Date.MonthName(..., "es-CL")`.
   - **Alt:** Editor avanzado de Power Query mostrando el código M para generar la lista de fechas entre 2024 y 2026.

4. `tabla-calendario-power-bi-dax-paso-4` (16/9)
   - **Qué mostrar:** Cinta `Herramientas de columnas > Ordenar por columna` seleccionando `MesNum` para ordenar la columna `Mes`.
   - **Alt:** Menú Ordenar por columna en Power BI Desktop seleccionando MesNum para ordenar la columna Mes.

5. `tabla-calendario-power-bi-dax-paso-5` (16/9)
   - **Qué mostrar:** Modal `Marcar como tabla de fechas` con la columna `Date` seleccionada y el mensaje de validación exitosa.
   - **Alt:** Cuadro de diálogo Marcar como tabla de fechas en Power BI validando correctamente la columna Date.

6. `tabla-calendario-power-bi-dax-paso-6` (16/9)
   - **Qué mostrar:** Vista de datos con las columnas `EsFeriado` y `EsDiaHabil` evaluadas junto a la tabla auxiliar `FeriadosChile`.
   - **Alt:** Tabla Calendario con las columnas EsFeriado y EsDiaHabil marcando días hábiles en Chile.

7. `tabla-calendario-power-bi-dax-modelo-estrella` (16/9)
   - **Qué mostrar:** Vista de modelo con `Calendario` conectada por relaciones `1:*` hacia `Ventas` y `Presupuesto`.
   - **Alt:** Diagrama de modelo estrella en Power BI con la tabla Calendario conectada 1 a muchos hacia Ventas y Presupuesto.
