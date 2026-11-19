# Observatorio de Desempleo de Chile

Primera entrega de ProgramBI en la rama `mejora/datos-desempleo`, creada desde `main` actualizado en `1bc1254`.

## Entrega

- Hub `/datos`, observatorio nacional y dieciséis páginas regionales con cifras y tablas prerenderizadas.
- Mapa y ranking con el recorte de cartografía BCN, selector de vista, enlaces por territorio y marcas de calidad. El SVG resultante pesa 53.599 bytes.
- Histórico, análisis estacional, promedios anuales, mapa de calor y comparadores de regiones y períodos. El cliente descarga la matriz histórica y pide las diferencias de cada período base por separado.
- Datos CSV y Excel bajo CC BY-SA 4.0, consulta Power Query M, metodología, cita, preguntas frecuentes e imágenes sociales PNG de 1200 × 630.
- Sitemap, enlaces de navegación para Chile, datos estructurados y eventos de uso GA4 mediante el ayudante existente. Analytics y Speed Insights ya formaban parte del sitio.
- Acción mensual para descargar, validar y abrir un PR de datos, con acción manual y aviso por issue si falla la actualización. La revisión del PR sigue siendo manual.

Los paneles editoriales y controles accesibles combinan React, HTML nativo y CSS acotado a la sección. El histórico usa Recharts.

En el alcance posterior quedan las series por sexo y edad, sectores, informalidad, ajuste estacional, jóvenes, embeds, seguro de cesantía, alertas por correo y otros observatorios. Se adelantaron las imágenes sociales estáticas para cumplir la lista SEO. Se habilitará el enlace PBIX cuando exista el archivo real. La fecha de la próxima publicación se ha omitido porque no forma parte de la edición validada.

## Datos oficiales

| Control | Resultado |
|---|---|
| Edición INE | 29-10-2026, trimestre móvil jul–sep 2026, código `2026-08` |
| Nacional | 9,8026248 %. jul–sep 2025 8,528949 %. +1,2737 pp. |
| Mayor y menor regional | Ñuble, 11,8245 %. Aysén, 4,00 % |
| Prueba de humo regional | Ñuble 9,9722 → 11,8245 % y Metropolitana 8,7900 → 10,3506 % |
| Cobertura, secuencia, datos faltantes y duplicados | 199 trimestres móviles continuos desde `2010-02`. Chile y 16 regiones |
| Esquema, rangos y notas | Zod, tasas dentro de rango, niveles positivos y notas a/b asociadas al indicador |
| Identidad laboral | Fuerza de trabajo ≈ ocupados + desocupados y tasa ≈ desocupados / fuerza de trabajo |
| Coherencia territorial | Sumas regionales de fuerza de trabajo y personas desocupadas dentro de 0,1 % del total nacional |
| YoY e historia de jul–sep | Comparación contra el mismo trimestre móvil un año antes y valores de referencia aprobados |
| Descargas | 17 CSV con BOM UTF-8 y 199 observaciones. libro con 18 hojas incluida «Léeme». período y tasa final coinciden con JSON en los 17 territorios |
| Revisiones | 0 diferencias en la recarga de la misma edición |
| Contraste con el Banco Central | Saltado por falta de credenciales. El script prueba la hipótesis del mes final en BCCh frente al mes central en INE mediante los últimos 24 trimestres de cada territorio. Falta comprobar el mapeo empíricamente. |

Fuente de la edición [INE, Encuesta Nacional de Empleo, indicadores principales](https://www.ine.gob.cl/docs/default-source/ocupacion-y-desocupacion/cuadros-estadisticos/series-vigentes/indicadores_principales.xlsx).

SHA-256 del XLSX oficial `63bbe64b2174ae04ecb76eacd2d188db0d1e6e8429b5b770131d84ad844b302f`.

Cartografía referencial de las 16 regiones. El insumo incluye una entidad «Zona sin demarcar» y se excluyó del coloreado territorial. También se excluyeron Rapa Nui y Juan Fernández del recorte. [Mapas vectoriales de la BCN](https://www.bcn.cl/siit/mapas_vectoriales).

## Validaciones realizadas antes de la pausa

Lint dirigido con cero errores y una advertencia previa en `Footer.tsx`. TypeScript dirigido y TypeScript de producción aprobados. Una ejecución de `npm run build` exitosa con Next.js 16.2.10. El sitio completo prerenderizó 1.167 rutas:

| Ruta | Resultado |
|---|---|
| `/datos` | ○ Estática |
| `/datos/desempleo` | ○ Estática |
| `/datos/desempleo/[region]` | ● SSG, dieciséis regiones |
| `/datos/desempleo/og/[territorio]` | ● SSG, dieciocho imágenes |

La sección no agrega handlers dinámicos. `curl -I` devolvió `x-nextjs-cache: HIT` y `s-maxage=31536000` en local. La imagen nacional también devolvió `stale-while-revalidate=86400`. El proxy general de ProgramBI sigue aplicando a las rutas públicas de marketing conforme a su configuración existente. Falta medir la CDN en un Preview de Vercel.

### Auditoría HTTP y SEO de las 18 páginas

Medición sobre `next start` mediante `node scripts/datos/check-observatorio.mjs http://localhost:3093`. «Propio» indica el canonical absoluto formado por `https://www.programbi.com` y la ruta de la fila. El bloque «En resumen», la fecha visible, el `dateModified` y la fecha del sitemap coincidieron en las 18 URLs. Se verificaron el JSON-LD y sus propiedades principales, las 18 imágenes PNG, los canonicals de filtros y los slugs inválidos.

| Ruta | HTTP | Title (caracteres) | Description (caracteres) | H1 | Canonical | Robots | JSON-LD | Hero y YoY = JSON | Bytes HTML |
|---|---|---|---|---|---|---|---|---|---:|
| `/datos` | 200 | Datos de Chile: observatorio de desempleo del INE (49) | 153 | Datos de Chile, explicados en simple | Propio | index, follow | BreadcrumbList, Dataset | Sí | 54.095 |
| `/datos/desempleo` | 200 | Desempleo en Chile: tasa actual por región (INE) (48) | 153 | Desempleo en Chile | Propio | index, follow | BreadcrumbList, Dataset, FAQPage, ItemList | Sí | 236.029 |
| `/datos/desempleo/arica-y-parinacota` | 200 | Desempleo en Arica y Parinacota: tasa actual e histórico (56) | 150 | Desempleo en Arica y Parinacota | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 172.580 |
| `/datos/desempleo/tarapaca` | 200 | Desempleo en Tarapacá: tasa actual e histórico (46) | 154 | Desempleo en Tarapacá | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 174.729 |
| `/datos/desempleo/antofagasta` | 200 | Desempleo en Antofagasta: tasa actual e histórico (49) | 143 | Desempleo en Antofagasta | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 168.834 |
| `/datos/desempleo/atacama` | 200 | Desempleo en Atacama: tasa actual e histórico (45) | 153 | Desempleo en Atacama | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 171.944 |
| `/datos/desempleo/coquimbo` | 200 | Desempleo en Coquimbo: tasa actual e histórico (46) | 154 | Desempleo en Coquimbo | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 166.209 |
| `/datos/desempleo/valparaiso` | 200 | Desempleo en Valparaíso: tasa actual e histórico (48) | 142 | Desempleo en Valparaíso | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 166.385 |
| `/datos/desempleo/metropolitana` | 200 | Desempleo en Región Metropolitana: tasa actual e histórico (58) | 153 | Desempleo en Región Metropolitana | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 167.547 |
| `/datos/desempleo/ohiggins` | 200 | Desempleo en O’Higgins: tasa actual e histórico (47) | 142 | Desempleo en O’Higgins | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 167.734 |
| `/datos/desempleo/maule` | 200 | Desempleo en Maule: tasa actual e histórico (43) | 151 | Desempleo en Maule | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 165.677 |
| `/datos/desempleo/nuble` | 200 | Desempleo en Ñuble: tasa actual e histórico (43) | 152 | Desempleo en Ñuble | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 172.072 |
| `/datos/desempleo/biobio` | 200 | Desempleo en Biobío: tasa actual e histórico (44) | 153 | Desempleo en Biobío | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 165.816 |
| `/datos/desempleo/araucania` | 200 | Desempleo en La Araucanía: tasa actual e histórico (50) | 144 | Desempleo en La Araucanía | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 167.415 |
| `/datos/desempleo/los-rios` | 200 | Desempleo en Los Ríos: tasa actual e histórico (46) | 154 | Desempleo en Los Ríos | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 173.617 |
| `/datos/desempleo/los-lagos` | 200 | Desempleo en Los Lagos: tasa actual e histórico (47) | 155 | Desempleo en Los Lagos | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 174.567 |
| `/datos/desempleo/aysen` | 200 | Desempleo en Aysén: tasa actual e histórico (43) | 151 | Desempleo en Aysén | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 186.484 |
| `/datos/desempleo/magallanes` | 200 | Desempleo en Magallanes: tasa actual e histórico (48) | 142 | Desempleo en Magallanes | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 187.032 |

El texto regional tiene al menos 351 palabras y un máximo de 46,1 % de similitud Jaccard con secuencias de cinco palabras. El hub y todas las regiones recibieron enlaces internos. Las etiquetas de script iniciales añadieron hasta 23.371 bytes gzip frente a la lista de scripts de la portada, sin incluir los módulos diferidos. `/mx` se revisó por HTTP y no contiene el enlace `/datos`.

### Verificación en navegador y rendimiento

La pasada automatizada llegó a probar mapa y Tiles, histórico, tendencias, períodos, comparador prellenado y copia de Power Query. Al comprobar la consola registró dos errores de hidratación React `#418` en la página nacional. Queda pendiente aislar la causa y repetir la pasada. Lighthouse móvil, LCP, CLS, TBT y medición de toda la ruta con módulos diferidos quedaron aplazados a petición de Manu para coordinar el otro trabajo del sitio. También quedan pendientes los datos de campo de CrUX.

### Alcance Git y próximos pasos

El diff preparado antes de agregar este reporte incluye 289 archivos, 79.954 inserciones y 21 eliminaciones. La mayor parte son series y archivos de diferencias por período. El diff de configuración de países, redirects, robots, precios, blog, guías existentes, fichas y carpetas país está vacío. Las integraciones en archivos de la web existente se limitan al sitemap, el menú y el footer.

El observatorio queda guardado en un commit local en `mejora/datos-desempleo`. Existe un checkout independiente para `mejora/datos-carreras`. Si el otro trabajo agrega enlaces o entradas de sitemap, la integración debe conservar ambas incorporaciones. Quedan por cerrar la auditoría de navegador, Lighthouse y el Preview. El token opcional `BCCH_API_TOKEN`, el PBIX real y la revisión del primer PR automático quedan a cargo de Manu.

VEREDICTO: AMARILLO. Las rutas estáticas, los datos oficiales y el SEO local pasaron. Quedan por cerrar el error de hidratación, las métricas móviles y el Preview.
