# Inventario de capturas — `conectar-power-bi-api-banco-central`

| ID | Paso | Qué mostrar | Alt |
| :--- | :--- | :--- | :--- |
| `conectar-power-bi-api-banco-central-paso-1` | Paso 1 | Ventana Administrar parámetros en Power Query de Power BI Desktop mostrando `pUsuario` y `pClave` definidos como tipo Texto. | Ventana Administrar parámetros en Power Query de Power BI Desktop con pUsuario y pClave configurados como tipo Texto |
| `conectar-power-bi-api-banco-central-paso-2` | Paso 2 | Editor avanzado con `Web.Contents("https://si3.bcentral.cl", [RelativePath = ..., Query = [...]])` consultando `F073.TCO.PRE.Z.D` y vista previa limpia. | Editor avanzado de Power Query en Power BI mostrando Web.Contents con RelativePath y Query consultando F073.TCO.PRE.Z.D |
| `conectar-power-bi-api-banco-central-paso-3` | Paso 3 | Consulta `SearchSeries` en Power Query listando columnas `Codigo`, `Nombre`, `Inicio` y `Fin` de las series oficiales del Banco Central. | Resultado de SearchSeries en Power Query listando códigos oficiales seriesId y nombres en español de series diarias del Banco Central |
| `conectar-power-bi-api-banco-central-paso-4` | Paso 4 | Vista de modelo mostrando la relación 1:* entre `DimCalendario[Fecha]` y `DolarObservado[Fecha]` más tarjetas con las medidas DAX. | Vista de modelo en Power BI Desktop mostrando la relación uno a muchos entre DimCalendario y DolarObservado junto a tarjetas con las medidas DAX |
| `conectar-power-bi-api-banco-central-paso-5` | Paso 5 | Pantalla de configuración del modelo semántico en Power BI Service con credenciales Anónimo y programación diaria activada. | Configuración del modelo semántico en Power BI Service mostrando credenciales Anónimo y programación diaria de actualización habilitada |
