# Observatorio de Desempleo de Chile

Implementación de ProgramBI en la rama `mejora/datos-desempleo`, creada desde `main` actualizado en `1bc1254`.

## Entrega

- Hub `/datos`, observatorio nacional y dieciséis páginas regionales con cifras y tablas prerenderizadas.
- Mapa y ranking con el recorte de cartografía BCN, selector de vista, enlaces por territorio y marcas de calidad. El SVG resultante pesa 53.599 bytes.
- Histórico, análisis estacional, promedios anuales, mapa de calor y comparadores de regiones y períodos. El cliente descarga la matriz histórica y pide las diferencias de cada período base por separado.
- Datos CSV y Excel bajo CC BY-SA 4.0, consulta Power Query M, metodología, cita, preguntas frecuentes e imágenes sociales PNG de 1200 × 630.
- Sitemap, enlaces de navegación para Chile, datos estructurados y eventos de uso GA4 mediante el ayudante existente. Analytics y Speed Insights ya formaban parte del sitio.
- Acción mensual para descargar, validar y abrir un PR de datos, con acción manual y aviso por issue si falla la actualización. La revisión del PR sigue siendo manual.

Los paneles editoriales y controles accesibles combinan React, HTML nativo y CSS acotado a la sección. El histórico usa Recharts.

El historial inicial de Fase 1 se conserva en este reporte. La continuación incorpora las fuentes complementarias, las tarjetas para insertar y los módulos de Fase 3 descritos más abajo.

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

## Corrección de hidratación

La prueba inicial detectó errores React #418 en la ruta nacional. React emitía títulos SVG vacíos cuando el nodo <title> recibía varios hijos JSX. Se corrigió para generar una única cadena y el mapa pasó a ser un componente de servidor con controles de cliente.

## Fases 2 y 3

### Empleo juvenil y desgloses de la ENE

Las siete fuentes complementarias del INE se validaron por separado, con cobertura, fecha, enlace, licencia y SHA-256 en cada JSON. Todas llegaron a jul–sep 2026 con la edición del 29-10-2026. Sexo, edad, duración y desestacionalización empiezan en 2010-02. Las ramas comienzan en 2013-02, la informalidad en 2017-08 y la población joven que no estudia ni está ocupada en 2020-02.

- La página `/datos/desempleo/jovenes` muestra 24,4 % de desocupación entre los 15 y 24 años, 308.851 jóvenes que no estudiaban ni estaban ocupados y 5,1 meses de búsqueda en promedio. Cada indicador mantiene su denominador y su período. El CSV juvenil distribuye la serie de población que no estudia ni está ocupada. Los JSON cubren también tasas por edad y duración.
- La vista nacional y las 16 regiones incorporan sexo, informalidad y ramas de actividad. La comparación de ramas usa estimaciones de ocupación del mismo trimestre un año antes. El cálculo queda versionado en archivos JSON. El ranking de variaciones excluye estimaciones marcadas como no fiables y la categoría sin rama declarada.
- El histórico nacional permite elegir la serie desestacionalizada del INE, cuya tasa de cierre fue 9,6 %. La vista original sigue mostrando 9,8 %. Las dos series tienen tablas equivalentes.
- Hay 17 tarjetas insertables con cifra, tendencia y enlace a su página en ProgramBI. La excepción de CSP y `X-Frame-Options` se limita a los slugs admitidos. Las tarjetas quedan fuera del sitemap. Se sumaron una imagen social juvenil y 16 comparativas descargables de cada región con Chile.
- Si cambia una fuente complementaria y el indicador principal del INE conserva su edición, la actualización igualmente propone un PR con los nuevos datos.

### Seguro de cesantía y capacitación

La ficha mensual N.º 106 de la Superintendencia de Pensiones reporta 261.946 beneficiarios del seguro en mayo de 2026. La publicación es de junio. El proceso validó 122.341 prestaciones de la cuenta individual y 139.605 del fondo solidario, además de los cortes por sexo y contrato. El cuadro descargable C25 devolvió HTTP 404 y la ficha usada no desglosa beneficiarios por edad. La visualización señala el quiebre de comparabilidad por la Ley 21.628.

El anuario SENCE 2025 registra 1.055.691 participaciones y 1.021.222 aprobaciones en cursos con franquicia tributaria. Los 16 registros regionales cuadran con ambos totales. Cada participación corresponde a un curso, por lo que una persona puede aparecer varias veces. El panel enlaza al XLSX oficial de SENCE y muestra el año observado. Un workflow de revisión actualiza ambas fuentes sin publicación directa.

Fuentes oficiales [Ficha estadística del seguro](https://www.spensiones.cl/portal/institucional/594/articles-17107_recurso_1.pdf) y [Anuarios estadísticos SENCE](https://sence.gob.cl/sence/anuarios-2004-2026).

### Alertas por correo

El formulario pide consentimiento, envía confirmación con enlace de 48 horas y permite darse de baja. La confirmación y la baja son acciones explícitas que hacen cambios solo al enviar su formulario. La base guarda los suscriptores y el estado de los envíos con acceso exclusivo al backend. El workflow de entrega comprueba primero la edición que está disponible públicamente en ProgramBI. La primera ejecución registra la edición de partida y los envíos se reservan por edición y suscripción para controlar duplicados.

Para activar el envío se requiere aplicar `supabase/migrations/20261119000100_datos_alertas_desempleo.sql`, habilitar las variables de Supabase y Amazon SES que declara el workflow y ejecutar la inicialización después del despliegue de la sección. Esta entrega conserva la migración, las acciones y el workflow en Git. La verificación local evita usar destinatarios reales.

### Integración con carreras

El commit de carreras `83bee6b` se integró en el checkout de esta rama. El hub enlaza ahora a los rankings del SIES, la calculadora y el comparador, las páginas de empleo, el observatorio de capacitación y el IPC. Las ramas de origen y `main` se conservaron.

## Auditoría del build optimizado

Lint dirigido y TypeScript de producción aprobados. Se hizo un build después de integrar las tres fases y una recompilación correctiva después de detectar 181.757 bytes gzip incrementales al cargar el explorador. La recompilación terminó con 1.204 páginas estáticas en el sitio completo y conservó las advertencias existentes del módulo Pyodide. El observatorio prepara toda su lectura en build. Las acciones de suscripción solo ejecutan código al enviar el formulario.

| Ruta | Resultado |
|---|---|
| `/datos`, `/datos/desempleo`, `/datos/desempleo/jovenes`, `/datos/capacitacion` | ○ Estáticas |
| `/datos/desempleo/[region]` | ● SSG, 16 regiones |
| `/datos/desempleo/embed/[territorio]` | ● SSG, 17 tarjetas |
| `/datos/desempleo/og/[territorio]` | ● SSG, 35 PNG |
| `/datos/desempleo/alertas/gestionar` | ○ Estática, noindex |

`curl -I` devolvió `x-nextjs-cache: HIT` en la tarjeta comparativa. Las imágenes tienen `s-maxage=31536000, stale-while-revalidate=86400`. El proxy general de ProgramBI mantiene su comportamiento previo. Queda la medición de CDN sobre un Preview de Vercel.

### Auditoría HTTP y SEO de 20 páginas

Medición sobre `next start` mediante `node scripts/datos/check-observatorio.mjs http://localhost:3098`. «Propio» indica el canonical absoluto de `https://www.programbi.com` y su ruta. Pasaron las 20 URLs indexables, los canonicals con filtros, los slugs inválidos, los datos estructurados y los enlaces entrantes. Los diecisiete embeds quedan fuera del índice y del sitemap. La restricción del iframe se probó también cargando un embed desde otro origen HTTP.

| Ruta | HTTP | Title (caracteres) | Description (caracteres) | H1 | Canonical | Robots | JSON-LD | Hero y YoY = JSON | Bytes HTML |
|---|---|---|---|---|---|---|---|---|---:|
| `/datos` | 200 | Datos de Chile: observatorio de desempleo del INE (49) | 153 | Datos de Chile, explicados en simple | Propio | index, follow | BreadcrumbList, Dataset | Sí | 57.644 |
| `/datos/desempleo` | 200 | Desempleo en Chile: tasa actual por región (INE) (48) | 153 | Desempleo en Chile | Propio | index, follow | BreadcrumbList, Dataset, FAQPage, ItemList | Sí | 361.114 |
| `/datos/desempleo/arica-y-parinacota` | 200 | Desempleo en Arica y Parinacota: tasa actual e histórico (56) | 150 | Desempleo en Arica y Parinacota | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 206.948 |
| `/datos/desempleo/tarapaca` | 200 | Desempleo en Tarapacá: tasa actual e histórico (46) | 154 | Desempleo en Tarapacá | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 209.368 |
| `/datos/desempleo/antofagasta` | 200 | Desempleo en Antofagasta: tasa actual e histórico (49) | 143 | Desempleo en Antofagasta | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 202.831 |
| `/datos/desempleo/atacama` | 200 | Desempleo en Atacama: tasa actual e histórico (45) | 153 | Desempleo en Atacama | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 205.623 |
| `/datos/desempleo/coquimbo` | 200 | Desempleo en Coquimbo: tasa actual e histórico (46) | 154 | Desempleo en Coquimbo | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 199.839 |
| `/datos/desempleo/valparaiso` | 200 | Desempleo en Valparaíso: tasa actual e histórico (48) | 142 | Desempleo en Valparaíso | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 197.884 |
| `/datos/desempleo/metropolitana` | 200 | Desempleo en Región Metropolitana: tasa actual e histórico (58) | 153 | Desempleo en Región Metropolitana | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 199.156 |
| `/datos/desempleo/ohiggins` | 200 | Desempleo en O’Higgins: tasa actual e histórico (47) | 142 | Desempleo en O’Higgins | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 200.963 |
| `/datos/desempleo/maule` | 200 | Desempleo en Maule: tasa actual e histórico (43) | 151 | Desempleo en Maule | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 198.678 |
| `/datos/desempleo/nuble` | 200 | Desempleo en Ñuble: tasa actual e histórico (43) | 152 | Desempleo en Ñuble | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 205.362 |
| `/datos/desempleo/biobio` | 200 | Desempleo en Biobío: tasa actual e histórico (44) | 153 | Desempleo en Biobío | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 198.082 |
| `/datos/desempleo/araucania` | 200 | Desempleo en La Araucanía: tasa actual e histórico (50) | 144 | Desempleo en La Araucanía | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 200.843 |
| `/datos/desempleo/los-rios` | 200 | Desempleo en Los Ríos: tasa actual e histórico (46) | 154 | Desempleo en Los Ríos | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 206.622 |
| `/datos/desempleo/los-lagos` | 200 | Desempleo en Los Lagos: tasa actual e histórico (47) | 155 | Desempleo en Los Lagos | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 208.116 |
| `/datos/desempleo/aysen` | 200 | Desempleo en Aysén: tasa actual e histórico (43) | 151 | Desempleo en Aysén | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 220.826 |
| `/datos/desempleo/magallanes` | 200 | Desempleo en Magallanes: tasa actual e histórico (48) | 142 | Desempleo en Magallanes | Propio | index, follow | BreadcrumbList, Dataset, FAQPage | Sí | 221.061 |
| `/datos/desempleo/jovenes` | 200 | Desempleo juvenil en Chile: datos del INE (41) | 146 | Desempleo juvenil en Chile | Propio | index, follow | Dataset, BreadcrumbList | Cifra de fuente propia | 171.193 |
| `/datos/capacitacion` | 200 | Capacitación en Chile: cifras SENCE por región (46) | 152 | Capacitación en Chile: franquicia tributaria | Propio | index, follow | Dataset, BreadcrumbList | Cifra de fuente propia | 56.739 |

Las regiones tienen por lo menos 351 palabras propias. La similitud máxima entre dos textos regionales es 46,1 % con Jaccard de secuencias de cinco palabras. El mapa SVG base mide 53.599 bytes. El máximo de scripts iniciales añadidos en las páginas de desempleo quedó en 8.103 bytes gzip. El nacional y Metropolitana cargan 127.150 bytes gzip adicionales sobre la portada incluyendo los tres módulos diferidos del explorador.

La prueba de Chromium pasó sin errores de hidratación. Verificó HTML sin JavaScript, tabla estática, mapa/tiles, navegación por teclado, ajuste estacional, comparadores y selección de períodos, código Power Query, copia del iframe, gestión visual de alertas, juventud y SENCE. Cinco pantallas se inspeccionaron a 390 px sin desborde de página. La prueba de alertas no ejecutó envíos ni inserciones de suscriptores.

### Alcance

La rama se creó desde `1bc1254`. El diff de `config/paises.ts`, `vercel.json`, `app/robots.ts`, blog, precios, guías, fichas y carpetas de países permanece vacío. En la web previa se agregaron enlaces en menú, footer y sitemap. La configuración de Next solo extendió los encabezados de las tarjetas y el correo reutiliza el transporte existente. El aviso real, la CDN de Vercel, CrUX, el PBIX elaborado por Manu, el contraste opcional BCCh permanecen pendientes.


## Candidato integrado

El build produjo 1.561 páginas estáticas del sitio completo. La única función nueva bajo `/datos` es la tarjeta de carreras `/datos/carreras/compartir/[a]/[b]`, con lista de parámetros y slugs admitidos y caché de un año. Se comprobó el 200 PNG y el 404 cacheable desde `next start`. Las 198 páginas indexables del área (20 de empleo y capacitación más 178 de carreras e IPC) respondieron 200 con canonical propio y un H1. También pasaron las 10 pruebas específicas de datos y SEO de carreras, las 17 tarjetas insertables y las pruebas Playwright de la navegación móvil y los comparadores.

El layout propio de `/datos` conserva la identidad de ProgramBI con una navegación ligera a cada tema. Analytics de la sección arranca tras la primera interacción o después de nueve segundos. El sitio compartido conserva su layout y sus dependencias originales. En local el peso inicial adicional de JavaScript de las páginas de desempleo quedó por debajo de 12 KB gzip respecto de la lista de scripts de la portada.

### Lighthouse móvil del candidato integrado (Chrome local, modo simulado)

| Ruta | Performance | Accesibilidad | SEO | LCP (ms) | CLS | TBT (ms) | JS transferido (bytes) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 62 | 97 | 100 | 3720 | 0,000 | 1689 | 723250 |
| `/datos/desempleo` | 72 | 100 | 100 | 2859 | 0,000 | 933 | 262025 |
| `/datos/desempleo/metropolitana` | 96 | 100 | 100 | 2522 | 0,000 | 70 | 264144 |
| `/datos/desempleo/nuble` | 93 | 97 | 100 | 3019 | 0,000 | 82 | 264144 |
| `/datos/desempleo/jovenes` | 95 | 100 | 100 | 2810 | 0,000 | 83 | 264926 |
| `/datos` | 97 | 100 | 100 | 2213 | 0,000 | 146 | 262025 |
| `/datos/carreras` | 63 | 97 | 100 | 4083 | 0,000 | 1091 | 538267 |
| `/datos/carreras/medicina` | 73 | 97 | 100 | 2813 | 0,000 | 979 | 597473 |
| `/datos/carreras/comparar` | 59 | 97 | 100 | 3800 | 0,000 | 2317 | 442059 |

El presupuesto incremental de desempleo, los canonicals y la accesibilidad pasaron. El LCP y parte del bloqueo móvil siguen por encima de los objetivos de laboratorio. Se conserva la prueba base de la portada para distinguir el costo existente. Falta activar alertas y medir CDN/CrUX en Vercel con un despliegue autorizado.

VEREDICTO: AMARILLO. Funciones y SEO integrados y comprobados en local. Queda el ajuste de rendimiento móvil y el cierre de publicación.
