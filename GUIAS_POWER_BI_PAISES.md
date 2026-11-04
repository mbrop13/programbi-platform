# Guías Power BI por país — brief + textos listos para publicar (programbi.com)

> Archivo autocontenido para el LLM que implementará estas páginas en el repo Next.js `programbi-platform`.
> Preparado por Radar (SEO/analítica) para Manu — 4 nov 2026. Datos del curso tomados de las fichas en vivo de programbi.com (descargadas el 3 nov 2026). Salarios investigados el 4 nov 2026 con la fuente enlazada al lado.

---

## 0. Datos reales del curso (fuente: fichas en vivo). NO cambiar sin revisar la ficha.

| País | Ruta ficha | Horario (lun y mié) | Precio lista → precio actual | Nota |
|---|---|---|---|---|
| Chile | `/cursos/power-bi` | 19:30–21:30 (hora de Chile) | Visible al registrarse. JSON-LD de la ficha dice 249.000 CLP | ⚠️ ver nota de precio abajo |
| México | `/mx/cursos/power-bi` | 16:30–18:30 hora de México | $3,220 MXN → **$2,190 MXN** (32 % off) | |
| Colombia | `/co/cursos/power-bi` | 17:30–19:30 hora de Colombia | $440.000 COP → **$299.900 COP** | |
| Argentina | `/ar/cursos/power-bi` | 19:30–21:30 hora de Argentina | $236.000 ARS → **$159.900 ARS** | |
| Perú | `/pe/cursos/power-bi` | 17:30–19:30 hora de Perú | S/514.00 → **S/349.00 PEN** | |
| Uruguay | `/uy/cursos/power-bi` | 19:30–21:30 hora de Uruguay | $8.790 UYU → **$5.990 UYU** | |
| Paraguay | no existe | 19:30–21:30 (Paraguay usa UTC-3 todo el año, igual que Chile en verano; verificar en abril cuando Chile vuelve a UTC-4) | — | ver §2.9 |

Datos comunes (todas las fichas): **próximo inicio lunes 23 de noviembre de 2026**, lunes y miércoles, **20 horas**, **8 módulos**, nivel básico-intermedio, en vivo por Zoom, grabaciones de por vida en el campus, certificado al completar, proyectos con datos reales. Existe un nivel **Avanzado** (20 h) con Power BI Service y seguridad a nivel de fila (RLS). Temario: conexión a múltiples fuentes, Power Query, parámetros y funciones M, limpieza automatizada, modelo estrella y relaciones, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH/VALUES, introducción a IA en Power BI (Q&A en lenguaje natural, insights automáticos). Instructor: **Manuel Oliva**, Magíster en Data Science (UAI); capacitaciones en Anglo American, CAP, Deloitte y SQM; más de 5.000 profesionales formados en SQL, Power BI, Python e IA.

Curso Claude (`/cursos/claude`, `/mx/cursos/claude`): 20 h, 5 módulos de 4 h, mismo calendario (inicio 23 nov 2026, lun y mié, 19:30–21:30 Chile / 16:30–18:30 México), JSON-LD 249.000 CLP y 2.190 MXN. Módulos: 1) Introducción y primeros pasos; 2) Prompting práctico; 3) Projects, Artifacts, Docs y Slides; 4) Claude para Excel y tareas administrativas (incl. Cowork y conectores); 5) Automatización ligera (Claude Code y Cowork en lenguaje sencillo) y proyecto final.

> ⚠️ **Nota de precio a resolver por Manu antes de publicar:** las fichas extranjeras dicen «Se cobra en pesos chilenos (CLP $169.000)», pero el JSON-LD de Chile marca 249.000 CLP. Ver **§8 Corrección de precios**. Las guías **no deben escribir el precio en duro**: deben leerlo del mismo origen de datos que la ficha (componente/prop de precio por país), para que nunca se desalineen.

---

## 1. Intención y estrategia (léelo antes de escribir una línea de código)

**Qué queremos.** Que una persona en Bogotá, Lima o Monterrey que escribe en Google —o le pregunta a ChatGPT, Perplexity o Gemini— «cómo aprender Power BI en Colombia» encuentre **la mejor respuesta de internet**, escrita para su país, y que al terminar de leer piense: «esta gente sabe; me inscribo» o, como mínimo, «les escribo por WhatsApp» o «me bajo la plantilla».

**Embudo que debe servir cada guía (en este orden de valor):**
1. Inscripción/registro al curso Power BI en vivo (`click_registro`).
2. Conversación por WhatsApp con mensaje precargado que diga el país y la guía (`click_whatsapp`).
3. Descarga de la plantilla Power BI gratis a cambio del email (`generate_lead`, `lead_type=plantilla`).

**Por qué guías y no más blog genérico.** Las búsquedas «cómo aprender X en {país}», «cuánto gana un analista de datos en {país}» y «curso Power BI {país}» tienen intención de formación y tienen pocos resultados realmente locales. Los asistentes de IA citan páginas con datos concretos, fechados y con fuente. Eso es exactamente lo que ofrecen estas guías.

**Regla anti-duplicado (innegociable).** Google trata como duplicado una página que solo cambia el nombre del país. Cada guía de este archivo ya trae: salario con fuente local, portales de empleo locales, industrias locales, ejemplos con moneda y ciudades locales, FAQ propia y horario local. **Prohibido** generar variantes nuevas copiando una guía y cambiando el país. Si se agrega un país, se escribe desde cero con la misma rigurosidad. Objetivo: menos de 30 % de texto compartido entre dos guías de país (medir con un diff de shingles de 5 palabras).

**Tono.** Experto cercano: como un analista senior que le explica a un colega en un café. Frases cortas, verbos concretos, nada de humo («revolucionario», «el mejor del mercado»). Modismos locales con moderación (uno o dos por guía, ya incluidos en los textos): voseo solo en Argentina y Uruguay; «pega» en Chile, «laburo» en Argentina, «chamba» en Perú. No agregues más.

**Datos.** Toda cifra lleva fuente y link. Si una cifra no se puede verificar, se omite. No inventes testimonios, porcentajes de empleabilidad, número de alumnos por país ni rankings. Los salarios son de referencia: siempre mencionar fecha y que cambian.

**Cómo debe sentirse la página.** Útil aunque no compres. El curso aparece como el siguiente paso natural, no como interrupción: un CTA arriba (suave), uno al medio (después de la ruta de aprendizaje) y uno al final (fuerte).

---

## 2. Especificación técnica

### 2.1 Rutas
| Guía | Ruta | hreflang |
|---|---|---|
| Chile | `/guias/como-aprender-power-bi-en-chile` | `es-CL` |
| México | `/mx/guias/como-aprender-power-bi-en-mexico` | `es-MX` |
| Colombia | `/co/guias/como-aprender-power-bi-en-colombia` | `es-CO` |
| Argentina | `/ar/guias/como-aprender-power-bi-en-argentina` | `es-AR` |
| Perú | `/pe/guias/como-aprender-power-bi-en-peru` | `es-PE` |
| Uruguay | `/uy/guias/como-aprender-power-bi-en-uruguay` | `es-UY` |
| Paraguay | `/py/guias/como-aprender-power-bi-en-paraguay` | `es-PY` |
| Transversal DAX | `/guias/funciones-dax-mas-importantes` | `es` (una sola versión, sin variantes por país) |
| Transversal Excel | `/guias/power-bi-vs-excel` | `es` |
| Piloto Claude CL | `/guias/como-usar-claude-para-analisis-de-datos` | `es-CL` |
| Piloto Claude MX | `/mx/guias/como-usar-claude-para-analisis-de-datos` | `es-MX` |
| Índice | `/guias` (+ `/{pais}/guias`) | lista las guías de ese país + transversales |

- Las 7 guías de país forman **un clúster hreflang** entre sí (`es-CL`, `es-MX`, `es-CO`, `es-AR`, `es-PE`, `es-UY`, `es-PY`) con `x-default` → la de Chile. Son contenidos distintos sobre el mismo tema, por eso es válido enlazarlos como alternates; cada una con `canonical` a sí misma.
- Las transversales: canonical a sí mismas, sin alternates por país. No crear `/mx/guias/funciones-dax...`.
- Claude CL y MX: alternates entre sí (`es-CL`, `es-MX`, `x-default` → CL).
- Implementar como páginas estáticas (SSG) a partir de archivos MDX o un objeto de contenido en `content/guias/*.mdx`, con frontmatter: `title`, `description`, `h1`, `country`, `updated`, `faq[]`, `sources[]`.

### 2.2 Metadatos
- `title` ≤ 60 caracteres (ya entregados abajo, contados). `meta description` 140–160 caracteres. Un solo H1.
- `<html lang>` = `es-CL`, `es-MX`… según país (ya existe el mecanismo por país).
- OG image: generar una por guía con el título y la bandera textual del país (sin emojis de bandera; usar el código «CO», «MX»).
- Mostrar «Actualizado: {fecha}» visible y en `dateModified`.

### 2.3 Schema (JSON-LD, un `@graph`)
- `Article` (headline = H1, author = Person «Manuel Oliva» con `jobTitle` «Magíster en Data Science (UAI)», publisher = Organization ProgramBI, `datePublished`, `dateModified`, `inLanguage`, `about` = «Power BI»).
- `FAQPage` con las 6 preguntas de la guía (texto idéntico al visible).
- `BreadcrumbList`: Inicio → Guías → {Guía}. En países: Inicio ({país}) → Guías → {Guía}.
- No marcar `Course` ni `Offer` en la guía (eso vive en la ficha).

### 2.4 Enlaces internos (obligatorios)
- Cada guía de país enlaza: landing `/{pais}/curso-power-bi` (Chile: `/curso-power-bi` si existe; si no, `/cursos/power-bi`), ficha `/{pais}/cursos/power-bi`, guía DAX, guía Power BI vs Excel, e índice `/{pais}/guias`.
- La landing y la ficha de cada país enlazan de vuelta a su guía («Guía: cómo aprender Power BI en {país}»).
- Las transversales enlazan a `/cursos/power-bi` y a un bloque «Elige tu país» con las 7 guías.
- Footer de cada país: link a su guía.

### 2.5 CTAs (componente `<GuiaCTA variant="top|mid|end">`)
- **Top** (tras la intro): caja discreta: «Próxima clase en vivo: {fecha} · {horario local}» + botón «Ver el curso».
- **Mid** (tras «Ruta de aprendizaje»): plantilla gratis: «Descarga la plantilla de dashboard de ventas en {moneda}» → formulario solo email → `generate_lead`.
- **End**: bloque fuerte con precio local (leído del origen de datos), horario local, botón «Inscribirme» (`click_registro`) y botón WhatsApp (`click_whatsapp`).
- Mobile: barra fija inferior con «Inscribirme» + WhatsApp (reutilizar la de fichas).

### 2.6 WhatsApp
`https://wa.me/56935409699?text=` + `encodeURIComponent("Hola, vengo de la guía de Power BI para {País} en programbi.com y quiero info del curso en vivo")`. El `href` completo debe salir en el HTML del servidor.

### 2.7 Eventos GA4 (G-CSV91QJMMJ)
| Evento | Cuándo | Parámetros |
|---|---|---|
| `click_whatsapp` | clic en cualquier link wa.me | `country`, `page_type=guia`, `guide_slug`, `cta_position` (top/mid/end/sticky) |
| `click_registro` | clic en Inscribirme/Registrarme | igual que arriba + `course=power-bi` |
| `generate_lead` | envío exitoso de plantilla (respuesta 200 de `/api/leads-magnet`) | `country`, `page_type=guia`, `guide_slug`, `lead_type=plantilla` |
| `scroll` (nativo) | — | usar para ver lectura al 90 % |
Sin `_dbg`. `country` en minúsculas ISO (`cl`, `mx`, `co`, `ar`, `pe`, `uy`, `py`).

### 2.8 Sitemap y robots
Agregar todas las rutas al sitemap correspondiente (raíz y por país), con `lastmod` = `updated`. Indexables. Agregarlas a `/llms.txt` en una sección «Guías».

### 2.9 Paraguay
Hoy no hay versión `/py/`. Recomendación: **crear `/py/` mínima** (home de país, ficha Power BI y la guía) con precio en **USD** (en Paraguay es habitual cotizar cursos y servicios en USD y evita mostrar cifras de 6–7 dígitos en guaraníes), aclarando «Pagas con tarjeta internacional; el cargo final lo define tu banco», hreflang `es-PY`, horario 19:30–21:30 hora de Paraguay. Monto en USD: **lo define Manu** (sugerencia: equivalente al precio CLP de las demás fichas, redondeado a terminación 9). Mientras no exista `/py/`, **alternativa**: publicar la guía en `/guias/como-aprender-power-bi-en-paraguay` (sin prefijo, `es-PY`), con el CTA final apuntando a `/cursos/power-bi` y a WhatsApp, sin precio. No indexar `/py/` vacío.


---

## 3. Guías por país (texto completo, listo para publicar)

> Bloques `[CTA-TOP]`, `[CTA-MID]`, `[CTA-END]` = componente de §2.5. `{precio_local}` = leído del origen de datos de la ficha. Las FAQ van visibles y en `FAQPage`.

---

### 3.1 CHILE — `/guias/como-aprender-power-bi-en-chile`

- **Keywords objetivo:** cómo aprender Power BI en Chile; curso Power BI Chile; sueldo analista BI Chile; Power BI para control de gestión; aprender Power BI desde cero; curso Power BI en vivo Santiago.
- **Title (54):** Cómo aprender Power BI en Chile: guía 2026 | ProgramBI
- **Meta (157):** Ruta en 8 semanas, sueldos reales de analista BI en Chile, funciones DAX con ejemplos en pesos y dónde buscar pega. Guía práctica de ProgramBI, actualizada.
- **H1:** Cómo aprender Power BI en Chile (y llegar a usarlo en tu pega)

#### Texto

En Chile, buena parte del trabajo de control de gestión todavía vive en un Excel que alguien actualiza a mano cada lunes: se bajan reportes del ERP, se pegan en una hoja, se arreglan fórmulas que se rompieron y, con suerte, el informe llega a gerencia el miércoles. Power BI existe para que eso no pase. Esta guía te muestra cómo aprenderlo en serio, qué pide hoy el mercado chileno y cómo pasar de «sé hacer gráficos» a «mantengo el dashboard que usa mi empresa».

**[CTA-TOP]**

##### Por qué Power BI tiene tanto sentido en Chile

Hay tres razones muy chilenas. La primera: muchas empresas ya pagan Microsoft 365, así que Power BI entra «por la puerta de Excel» sin una compra nueva gigante. La segunda: los sectores que más pesan en la economía —minería, retail, banca, salud y servicios— generan datos operativos todos los días, y en ellos el reporte mensual hecho a mano ya no alcanza. La tercera: los cargos de control de gestión, finanzas y operaciones piden cada vez más «manejo de Power BI» como requisito, no como un plus.

En la práctica, lo que se valora no es saber dónde está el botón de un gráfico de barras, sino entender un modelo de datos, escribir medidas DAX correctas y dejar una actualización automática que no dependa de ti.

##### Cuánto gana un analista BI en Chile (referencia)

Las cifras varían mucho según experiencia, empresa y región, así que tómalas como referencia, no como promesa:

- **Chiletrabajos**: el sueldo **pretendido** promedio para «analista BI» es de **$1.147.226 al mes** (rango $990.898–$1.425.339), calculado con 16.005 postulaciones de los últimos 12 meses (consultado en noviembre 2026). [chiletrabajos.cl/sueldos/analista/bi](https://www.chiletrabajos.cl/sueldos/analista/bi)
- **Indeed Chile**: sueldo promedio de **$1.035.380 al mes** para analista BI en Chile (consultado el 4 nov 2026; la cifra cambia según los avisos publicados). [cl.indeed.com/career/analista-bi/salaries](https://cl.indeed.com/career/analista-bi/salaries)
- **Ejemplo real de aviso** (ya expirado): un cargo de «Analista Power BI» en San Bernardo publicado en febrero de 2026 ofrecía **$1.500.000** y pedía 3 años de experiencia con Power BI, SQL y deseable SAP. [Chiletrabajos, aviso 3787550](https://www.chiletrabajos.cl/trabajo/analista-power-bi-san-bernardo-3787550)

Fíjate en el último punto: el aviso no pedía «Power BI básico», pedía modelamiento, SQL e integración con un ERP. Esa es la brecha que conviene cerrar.

##### Dónde buscar pega con Power BI en Chile

- **LinkedIn Empleos**: busca «Power BI» + «control de gestión» o «analista BI» y filtra por Región Metropolitana o remoto.
- **Chiletrabajos** y **Laborum**: muchos avisos de pymes y medianas empresas con sueldo visible.
- **GetOnBoard**: avisos tech con rangos salariales publicados.
- **Empleos Públicos** (empleospublicos.cl): servicios y municipios contratan analistas de datos y de gestión.
- **Bolsa de ProgramBI** (`/empleos`): avisos que publicamos en el sitio.

Truco: guarda la búsqueda con la palabra «DAX». Los avisos que la mencionan suelen ser más técnicos y mejor pagados que los que solo dicen «Power BI».

##### Industrias donde más se usa

- **Minería y energía**: tableros de producción, disponibilidad de equipos y costos por faena.
- **Retail**: ventas por tienda, quiebres de stock y margen por categoría.
- **Banca, seguros y AFP**: cartera, mora y metas comerciales por sucursal.
- **Salud**: listas de espera, ocupación de camas y productividad de pabellones.
- **Sector público**: indicadores de gestión, presupuesto y ejecución.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Fundamentos y Power Query.** Conecta un Excel de ventas, limpia columnas, quita filas basura y aprende a «despivotar» una tabla. Meta: un informe que se actualice con un clic.
2. **Semana 3 · Modelo estrella.** Separa hechos (ventas) de dimensiones (producto, sucursal, calendario). Crea tu tabla calendario. Esta semana define si tus números van a cuadrar.
3. **Semanas 4–5 · DAX esencial.** SUM, DIVIDE, CALCULATE, FILTER y ALL. Medidas de margen y participación.
4. **Semana 6 · Inteligencia de tiempo.** Acumulado del año, mismo período del año anterior y variación.
5. **Semana 7 · Diseño.** Una página por pregunta de negocio, KPIs arriba, detalle abajo, segmentadores a la izquierda.
6. **Semana 8 · Proyecto.** Un tablero con tus propios datos (anonimizados) que puedas mostrar en una entrevista.

**[CTA-MID]** — Descarga la plantilla de dashboard de ventas en pesos chilenos.

##### Funciones clave, con ejemplos chilenos

Imagina una cadena con sucursales en Santiago, Concepción y Antofagasta, que vende en CLP.

- **Ventas totales**: `Ventas = SUM(Ventas[Monto_CLP])`
- **Ventas solo de Antofagasta**: `Ventas Antofagasta = CALCULATE([Ventas], Sucursal[Ciudad] = "Antofagasta")`
- **Margen %**: `Margen % = DIVIDE([Ventas] - [Costo], [Ventas])`. Usa DIVIDE y no «/»: si una sucursal no vendió, evitas el error de división por cero.
- **Acumulado del año**: `Ventas YTD = TOTALYTD([Ventas], Calendario[Fecha])`
- **Comparación con el año anterior**: `Ventas AA = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- **Ranking de sucursales**: `Ranking = RANKX(ALL(Sucursal[Ciudad]), [Ventas])`

Un consejo de control de gestión: si tu empresa cierra el año fiscal en diciembre, todo bien; si reportas por otro período, `TOTALYTD` acepta una fecha de cierre como tercer argumento.

##### Errores comunes al aprender

- **Usar Power BI como un Excel con colores.** Si importas una sola tabla gigante, el modelo crece y las medidas se vuelven lentas y confusas.
- **Columnas calculadas para todo.** Casi siempre lo correcto es una medida.
- **No tener tabla calendario.** Sin ella, la inteligencia de tiempo falla o da resultados raros.
- **Montos como texto.** Los reportes bajados de algunos sistemas traen «$1.234.567» como texto; corrígelo en Power Query, no en DAX.
- **Publicar sin pensar en quién ve qué.** Si el tablero tiene datos de remuneraciones o de clientes, necesitas seguridad a nivel de fila (RLS).

##### ¿Aprender solo o en un curso en vivo?

Solo se puede: la documentación de Microsoft es buena y hay mucho video. El problema es el orden y el feedback. La mayoría se queda en los gráficos y abandona en DAX, justo donde está el valor. Un curso en vivo te obliga a avanzar con un calendario, te deja preguntar «¿por qué mi medida da otro número?» en el momento y te empuja a terminar un proyecto. Si ya tienes disciplina y tiempo, empieza solo con esta ruta; si llevas meses «queriendo aprender», el curso en vivo es lo que suele destrabarlo.

##### El curso Power BI en vivo de ProgramBI

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Chile, después de la pega.
- **20 horas, 8 módulos**, nivel básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Temario: Power Query, parámetros y funciones M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH y funciones de IA de Power BI (preguntas en lenguaje natural e insights automáticos).
- **Grabaciones de por vida** en el campus y **certificado** al completar.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.
- ¿Ya dominas lo básico? Existe el nivel **Avanzado** (20 h) con Power BI Service y RLS.
- Para equipos, hay una versión para empresas en `/empresas`.

**[CTA-END]** — «Inscribirme» · «Hablar por WhatsApp».

##### Preguntas frecuentes

**¿Cuánto tiempo toma aprender Power BI?**
Para usarlo con soltura en un trabajo de análisis, unas 8 semanas con 4 a 5 horas semanales. Lo básico se aprende en días; el modelo de datos y DAX toman más.

**¿Necesito saber Excel avanzado?**
Ayuda, pero no es requisito. Si manejas tablas dinámicas y BUSCARV o BUSCARX, ya tienes la base mental. Power Query reemplaza buena parte del Excel «manual».

**¿Power BI es gratis?**
Power BI Desktop es gratuito para Windows. Para compartir informes en la nube dentro de una empresa normalmente se necesita una licencia Pro o que la empresa tenga capacidad Premium/Fabric; revisa con tu área de TI.

**¿Sirve Power BI en Mac?**
Power BI Desktop no tiene versión para Mac. Se usa con una máquina virtual con Windows o desde un PC. Avísanos antes de inscribirte y te orientamos.

**¿El curso de ProgramBI entrega certificado?**
Sí, un certificado digital de ProgramBI al completar el curso, además del acceso de por vida a las grabaciones.

**¿Qué pide un aviso de analista BI en Chile además de Power BI?**
Con frecuencia SQL, Excel avanzado y, en empresas grandes, experiencia con un ERP como SAP. Por eso el curso trabaja conexión a bases de datos y modelamiento, no solo visualización.

---

### 3.2 MÉXICO — `/mx/guias/como-aprender-power-bi-en-mexico`

- **Keywords objetivo:** cómo aprender Power BI en México; curso Power BI México en línea; sueldo analista de datos CDMX; Power BI para manufactura; analista BI Monterrey; curso Power BI en vivo.
- **Title (55):** Cómo aprender Power BI en México: guía 2026 | ProgramBI
- **Meta (156):** Qué pide el mercado mexicano, sueldos de analista BI en CDMX con fuente, ruta de 8 semanas y DAX con ejemplos en pesos de Monterrey, Guadalajara y CDMX.
- **H1:** Cómo aprender Power BI en México: de reportes en Excel a analista BI

#### Texto

Si trabajas en una planta en Querétaro, en un corporativo en Santa Fe o en una distribuidora en Guadalajara, seguramente conoces la escena: cada cierre de mes alguien junta cinco archivos, los cruza con BUSCARV y entrega un reporte que ya está viejo cuando llega. En México, Power BI se volvió la herramienta con la que las áreas de finanzas, operaciones y comercial dejan de «armar reportes» y empiezan a analizar. Aquí tienes una ruta concreta para aprenderlo, lo que pagan hoy los avisos y cómo diferenciarte.

**[CTA-TOP]**

##### Por qué Power BI está tan presente en México

México tiene una base industrial enorme —automotriz, manufactura de exportación, logística, consumo masivo— y un sector financiero y de servicios que concentra corporativos en CDMX y Monterrey. Ese tipo de empresa mide todo: producción por turno, scrap, OTIF, cartera vencida, venta por canal. Además, muchas operan con ecosistema Microsoft, así que Power BI es la opción natural para conectar Excel, SQL Server y el ERP. Con el crecimiento de operaciones que atienden a Estados Unidos, también aparecen equipos que reportan a casas matrices y necesitan tableros estándar, en tiempo casi real.

##### Cuánto gana un analista de datos o BI en México (referencia)

- **OCC Mundial**: los avisos vigentes de «data analyst» con sueldo visible mostraban, el 4 de noviembre de 2026, rangos mensuales como **$13,000–$15,000**, **$18,000–$22,000**, **$22,000–$25,000** y **$25,000–$30,000 MXN**. [occ.com.mx/empleos/de-data-analyst](https://www.occ.com.mx/empleos/de-data-analyst/)

Lectura práctica: el rango es amplio porque el título «data analyst» cubre desde reportería operativa hasta análisis comercial avanzado. Los avisos de la parte alta piden modelado, SQL y DAX, no solo gráficos. Es una foto de un día: revisa el portal antes de negociar.

##### Dónde buscar empleo con Power BI en México

- **OCC Mundial**: el portal con más volumen local; filtra por «Power BI» y por estado.
- **Computrabajo México** e **Indeed México**: muchos avisos de manufactura, logística y retail.
- **LinkedIn Empleos**: corporativos y empresas que contratan remoto para EE. UU.
- **Bolsa de ProgramBI** (`/mx/empleos`).

Tip: en manufactura busca también «analista de mejora continua» y «analista de planeación»; muchas vacantes piden Power BI sin ponerlo en el título.

##### Industrias que más lo usan

- **Automotriz y manufactura** (Bajío, Nuevo León, Coahuila): OEE, scrap, producción por línea.
- **Logística y comercio exterior**: tiempos de cruce, OTIF, costos de flete.
- **Retail y consumo masivo**: sell-out, inventario por CEDIS, promociones.
- **Banca y fintech** (CDMX, Monterrey): cartera, originación y cobranza.
- **Gobierno**: transparencia y tableros de indicadores públicos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Conecta los reportes del ERP (CSV o Excel), une archivos de una carpeta y limpia fechas en formato día/mes/año.
2. **Semana 3 · Modelo estrella.** Hechos de ventas o producción; dimensiones de planta, producto, cliente y calendario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, ALL. Medidas de margen, cumplimiento de meta y participación.
4. **Semana 6 · Inteligencia de tiempo.** Mes contra mes, año contra año, acumulado anual.
5. **Semana 7 · Storytelling.** Un tablero por audiencia: director, gerente de planta, supervisor.
6. **Semana 8 · Proyecto de portafolio.** Un caso de producción o ventas con datos públicos (por ejemplo, de datos abiertos de gobierno) que puedas presentar en entrevistas.

**[CTA-MID]** — Descarga la plantilla de dashboard de ventas en pesos mexicanos.

##### Funciones clave, con ejemplos mexicanos

Una distribuidora con CEDIS en Monterrey, Guadalajara y CDMX, que factura en MXN:

- `Ventas = SUM(Ventas[Importe_MXN])`
- `Ventas Monterrey = CALCULATE([Ventas], CEDIS[Ciudad] = "Monterrey")`
- `% Cumplimiento = DIVIDE([Ventas], [Meta])`
- `Ventas MoM % = DIVIDE([Ventas] - CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH)), CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH)))`
- `Top clientes = RANKX(ALL(Cliente[Razón social]), [Ventas])`
- Para manufactura: `Scrap % = DIVIDE(SUM(Produccion[Piezas_scrap]), SUM(Produccion[Piezas_totales]))`

Si reportas a una matriz en Estados Unidos y necesitas ver montos en dólares, crea una tabla de tipo de cambio diario y una medida `Ventas USD = SUMX(Ventas, Ventas[Importe_MXN] / RELATED(TipoCambio[MXN_por_USD]))`. Así no conviertes a mano cada mes.

##### Errores comunes

- **Mezclar formatos de fecha** (mes/día del sistema en inglés con día/mes del archivo local). Fija la configuración regional en Power Query.
- **Montos con coma de miles importados como texto.** Corrige el tipo de dato antes de cargar.
- **Un tablero para todos.** El director quiere 5 KPIs; el supervisor quiere el detalle por turno. Son páginas distintas.
- **Calcular el tipo de cambio con un promedio mensual cuando el negocio usa el diario.** Pregunta a finanzas cuál es el oficial.
- **Saltarse el modelo estrella** y depender de una tabla gigante exportada.

##### Tres casos reales de uso en empresas mexicanas

**1. Planta automotriz en el Bajío: OEE por turno.** Un supervisor necesita saber cada mañana qué línea perdió eficiencia en el turno de noche. Con Power BI, los registros de paros del MES (o la planilla que llenan los operadores) se cargan solos y el tablero muestra disponibilidad, rendimiento y calidad por línea y turno.

`Disponibilidad = DIVIDE(SUM(Turnos[Min_operando]), SUM(Turnos[Min_planeados]))`
`Rendimiento = DIVIDE(SUM(Produccion[Piezas]), SUMX(Turnos, Turnos[Min_operando] * RELATED(Linea[Piezas_por_min])))`
`Calidad = DIVIDE(SUM(Produccion[Piezas]) - SUM(Produccion[Piezas_scrap]), SUM(Produccion[Piezas]))`
`OEE = [Disponibilidad] * [Rendimiento] * [Calidad]`

Con un segmentador por turno (matutino, vespertino, nocturno), la junta diaria de producción pasa de discutir cifras a decidir acciones.

**2. Distribuidora en Guadalajara: cartera y días de cobro.** Finanzas quiere ver qué clientes están por encima de 60 días. La medida clave:
`Cartera vencida >60 = CALCULATE(SUM(CxC[Saldo_MXN]), CxC[Dias_vencido] > 60)`
y una matriz por vendedor y cliente. Con seguridad a nivel de fila, cada vendedor ve solo su cartera.

**3. Retail en CDMX: venta por tienda contra meta, con fines de semana.** Muchas cadenas comparan la venta del día contra el mismo día de la semana del año anterior, no contra la misma fecha. Se resuelve con una columna «Semana del año» y «Día de la semana» en la tabla calendario y una medida con `DATEADD(Calendario[Fecha], -364, DAY)`, que cae siempre en el mismo día de la semana.

##### Certificación PL-300 en México

La certificación oficial de Microsoft para analistas de Power BI es **Microsoft Certified: Power BI Data Analyst Associate**, que se obtiene aprobando el examen **PL-300**. Microsoft fija el precio según el país donde rindes el examen; el monto exacto para México aparece al registrarte en la página oficial: [learn.microsoft.com — Power BI Data Analyst Associate](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Si eres estudiante, revisa los precios académicos. Consejo práctico: primero domina modelado y DAX con proyectos; la certificación pesa más cuando la acompaña un portafolio.

##### Comunidad para seguir aprendiendo

El foro oficial de la comunidad de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español y grupos de usuarios por ciudad. Busca «Power BI» en Meetup o LinkedIn con el nombre de tu ciudad (CDMX, Monterrey, Guadalajara) para encontrar los grupos que estén activos hoy.

##### ¿Aprender solo o en un curso en vivo?

Con disciplina, se puede aprender solo con la documentación de Microsoft y práctica. Lo que suele fallar es DAX: los errores no son obvios y sin alguien que revise tu modelo puedes pasar semanas con números que «casi» cuadran. En un curso en vivo preguntas en el momento, avanzas con fechas fijas y terminas un proyecto. Si ya tienes base, puedes saltar directo a DAX y modelado.

##### El curso Power BI en vivo de ProgramBI (versión México)

- **En vivo por Zoom**, lunes y miércoles de **16:30 a 18:30, hora de México**.
- **20 horas, 8 módulos**, nivel básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para México: **{precio_local}** (hoy $2,190 MXN, antes $3,220 MXN).
- Temario: Power Query y funciones M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado** al completar.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Nivel **Avanzado** disponible (Power BI Service y seguridad por filas).

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en México?**
De 16:30 a 18:30, hora del centro de México, lunes y miércoles. Si estás en otra zona (por ejemplo, Tijuana o Cancún), ajusta según tu huso; si no puedes conectarte, quedan las grabaciones.

**¿Puedo pagar desde México?**
Sí, con tarjeta internacional. El precio se muestra en pesos mexicanos; el cargo final lo define tu banco.

**¿El certificado sirve en México?**
Es un certificado digital de ProgramBI que acredita las horas y el temario. No es un título oficial de la SEP; sirve como evidencia en tu CV y LinkedIn, sobre todo junto a un proyecto.

**¿Qué piden las vacantes de Power BI en México además de la herramienta?**
Excel avanzado, SQL y, cada vez más, inglés para reportar a matrices. En manufactura también valoran conocer indicadores como OEE y scrap.

**¿Power BI o Tableau para trabajar en México?**
Ambos se usan; Power BI suele aparecer más en empresas con Microsoft 365 y SQL Server. Lo que aprendas de modelado y DAX te sirve como base para cualquier herramienta.

**¿Necesito una licencia para empezar?**
No. Power BI Desktop es gratuito en Windows. Para publicar y compartir dentro de una empresa se usa una licencia Pro u otra que defina tu área de TI.

---

### 3.3 COLOMBIA — `/co/guias/como-aprender-power-bi-en-colombia`

- **Keywords objetivo:** cómo aprender Power BI en Colombia; curso Power BI Colombia virtual; salario analista de datos Colombia; Power BI Bogotá Medellín; curso Power BI en vivo; empleo Power BI Colombia.
- **Title (57):** Cómo aprender Power BI en Colombia: guía 2026 | ProgramBI
- **Meta (158):** Salario real de analista de datos en Colombia según Computrabajo, dónde buscar empleo, ruta de 8 semanas y DAX con ejemplos en COP de Bogotá, Medellín y Cali.
- **H1:** Cómo aprender Power BI en Colombia y conseguir trabajo como analista

#### Texto

En Colombia hay un dato que dice mucho: si buscas hoy «analista de datos» en Computrabajo aparecen más de mil ofertas abiertas, y una buena parte menciona Power BI en los requisitos. Bancos en Bogotá, empresas de servicios en Medellín, operadores logísticos en Barranquilla y BPO en Cali necesitan gente que convierta datos en decisiones. Esta guía te explica cómo aprender Power BI con un orden lógico, cuánto se paga como referencia y qué te hace destacar frente a otros candidatos.

**[CTA-TOP]**

##### Por qué aprender Power BI en Colombia

El mercado colombiano combina sectores muy intensivos en datos: banca y seguros, salud (EPS e IPS), telecomunicaciones, retail, logística y una industria grande de servicios para el exterior (BPO y centros de servicios compartidos). En todos se repite el mismo problema: el reporte depende de alguien que pega datos en Excel. Las vacantes que piden Power BI suelen pedir también Excel avanzado y SQL, y valoran la capacidad de explicar el resultado al negocio. Quien domina modelo de datos y DAX tiene una ventaja clara.

##### Cuánto gana un analista de datos en Colombia (referencia)

- **Computrabajo Colombia**: sueldo medio de **$2.416.855 COP al mes** para «analista de datos», con 7.156 salarios de los últimos 12 meses (consultado el 4 nov 2026). [co.computrabajo.com/salarios/analista-de-datos](https://co.computrabajo.com/salarios/analista-de-datos)
- **Avisos vigentes**: en [co.computrabajo.com/trabajo-de-analista-de-datos](https://co.computrabajo.com/trabajo-de-analista-de-datos) puedes filtrar por ciudad y ver los que publican sueldo.

La media incluye cargos muy distintos (desde reportería operativa hasta análisis avanzado). Los avisos con Power BI + SQL tienden a la parte alta del rango.

##### Dónde buscar empleo con Power BI en Colombia

- **Computrabajo** y **elempleo.com**: los portales con más volumen local.
- **Magneto Empleos**: muy usado por empresas grandes y cajas de compensación.
- **LinkedIn Empleos**: corporativos y trabajos remotos para empresas extranjeras.
- **Servicio Público de Empleo** (serviciodeempleo.gov.co): vacantes registradas oficialmente.
- **Bolsa de ProgramBI** (`/co/empleos`).

Consejo: en el perfil escribe «Power BI (Power Query, modelado, DAX)» en lugar de solo «Power BI». Los reclutadores filtran por esas palabras.

##### Industrias donde más se usa

- **Banca y seguros**: colocación, cartera, mora y metas por oficina.
- **Salud**: autorizaciones, glosas, tiempos de atención.
- **BPO y servicios compartidos**: niveles de servicio (SLA), productividad por agente.
- **Logística y puertos**: tiempos de despacho, ocupación de bodegas.
- **Retail y consumo masivo**: rotación de inventario, ventas por canal.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Primeros tableros y Power Query.** Importa un Excel de ventas, une varios meses desde una carpeta y limpia datos.
2. **Semana 3 · Modelo estrella.** Ventas, clientes, productos, ciudades y calendario. Relaciones de uno a varios.
3. **Semanas 4–5 · DAX.** Medidas básicas, CALCULATE, FILTER, DIVIDE.
4. **Semana 6 · Tiempo.** Acumulado del año, comparación con el año anterior, promedio móvil.
5. **Semana 7 · Diseño para el negocio.** KPIs, alertas visuales, navegación con botones.
6. **Semana 8 · Proyecto.** Un tablero de un caso colombiano (por ejemplo, con datos abiertos de datos.gov.co) para tu portafolio.

**[CTA-MID]** — Descarga la plantilla de dashboard de ventas en pesos colombianos.

##### Funciones clave, con ejemplos colombianos

Una comercializadora con sedes en Bogotá, Medellín, Cali y Barranquilla, que vende en COP:

- `Ventas = SUM(Ventas[Valor_COP])`
- `Ventas Medellín = CALCULATE([Ventas], Sede[Ciudad] = "Medellín")`
- `Ticket promedio = DIVIDE([Ventas], DISTINCTCOUNT(Ventas[Factura]))`
- `Ventas año anterior = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- `Crecimiento % = DIVIDE([Ventas] - [Ventas año anterior], [Ventas año anterior])`
- Para un BPO: `% SLA cumplido = DIVIDE(CALCULATE(COUNTROWS(Llamadas), Llamadas[Segundos_espera] <= 20), COUNTROWS(Llamadas))`

Un detalle muy colombiano: las cifras en COP son grandes. Usa formato «$#,0» o muestra en millones («2,3 M») en las tarjetas para que el tablero se lea de un vistazo.

##### Errores comunes

- **Tildes y mayúsculas inconsistentes** («Bogota», «BOGOTÁ», «Bogotá D.C.»): normaliza en Power Query o las ciudades se duplican en los gráficos.
- **Usar columnas calculadas para totales** en lugar de medidas.
- **Ignorar la tabla calendario**, lo que rompe las comparaciones por mes.
- **Tableros con 20 gráficos.** Menos es más: una pregunta por página.
- **Compartir el archivo .pbix por correo** en lugar de publicarlo en el servicio con permisos.

##### Tres casos reales de uso en empresas colombianas

**1. BPO en Medellín o Cali: nivel de servicio por campaña.** El cliente extranjero paga según el SLA. El tablero cruza llamadas, tiempos de espera y abandono por hora, y alerta cuando una campaña baja del objetivo.

`Tasa de abandono = DIVIDE(CALCULATE(COUNTROWS(Llamadas), Llamadas[Abandonada] = TRUE()), COUNTROWS(Llamadas))`
`AHT (seg) = AVERAGEX(Llamadas, Llamadas[Seg_conversacion] + Llamadas[Seg_postllamada])`

Con un mapa de calor por hora y día, el coordinador ve en qué franja falta personal.

**2. IPS en Bogotá: glosas y facturación a EPS.** En salud, una parte del ingreso se pierde en glosas (objeciones de las EPS a la factura). Un tablero por EPS, tipo de glosa y servicio permite atacar las causas.
`% Glosado = DIVIDE(SUM(Facturas[Valor_glosado_COP]), SUM(Facturas[Valor_facturado_COP]))`
`Días promedio de radicación = AVERAGEX(Facturas, DATEDIFF(Facturas[Fecha_servicio], Facturas[Fecha_radicacion], DAY))`

**3. Comercializadora en Barranquilla: rotación de inventario.** Comercio exterior y bodega necesitan saber qué referencias se quedan quietas.
`Días de inventario = DIVIDE(SUM(Inventario[Valor_COP]), DIVIDE([Costo de ventas], 365))`
Ordenado de mayor a menor, muestra dónde está la plata inmovilizada.

##### Certificación PL-300 en Colombia

La certificación oficial es **Microsoft Certified: Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país, y el valor para Colombia se ve al registrarte en la [página oficial de la certificación](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Muchas vacantes la mencionan como deseable, rara vez como obligatoria: un proyecto bien presentado suele pesar igual o más.

##### Comunidad para seguir aprendiendo

En el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) hay grupos de usuarios por ciudad y sección en español. Busca en Meetup y LinkedIn «Power BI Bogotá» o «Power BI Medellín» y únete al que tenga eventos recientes. Ir a un par de encuentros te da contactos y te muestra qué problemas resuelven otros analistas.

##### Cómo armar un portafolio que convenza en Colombia

Elige un tema que el reclutador entienda en 10 segundos: por ejemplo, un tablero de **siniestralidad vial por departamento** o de **contratación pública** con datos de datos.gov.co. Publica capturas y una explicación breve en LinkedIn: qué pregunta respondes, qué fuentes usaste y qué medidas DAX creaste. Eso vale más que una lista de cursos.

Un último detalle para Colombia: si postulas a cargos en Bogotá con clientes internacionales, prepara tu tablero también en inglés; es un filtro frecuente.

##### ¿Aprender solo o en un curso en vivo?

Hay mucho material gratis, y si eres constante puedes avanzar solo. Pero la mayoría se estanca en DAX y en el modelo, justo lo que más piden las vacantes. Un curso en vivo te da un calendario, alguien que responde tus dudas en el momento y un proyecto terminado. Con el horario adecuado, se puede hacer después del trabajo.

##### El curso Power BI en vivo de ProgramBI (versión Colombia)

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30, hora de Colombia**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para Colombia: **{precio_local}** (hoy $299.900 COP, antes $440.000 COP).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), más de 5.000 profesionales formados.

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en Colombia?**
Lunes y miércoles de 17:30 a 19:30, hora de Colombia. Si un día no puedes, la clase queda grabada.

**¿Cómo pago desde Colombia?**
Con tarjeta internacional de crédito o débito. Ves el precio en pesos colombianos y el cargo final lo define tu banco.

**¿Necesito ser ingeniero para aprender Power BI?**
No. Muchas personas que lo usan vienen de administración, contaduría, economía o áreas comerciales. Lo importante es entender el negocio y practicar.

**¿Qué piden las ofertas de analista de datos en Colombia?**
Con frecuencia Excel avanzado, Power BI, SQL y, en algunos casos, Python. Las de mayor salario suelen pedir además experiencia en un sector (banca, salud o retail).

**¿Sirve el certificado de ProgramBI?**
Es un certificado digital que acredita las 20 horas y el temario. Úsalo junto con un proyecto en tu portafolio; eso es lo que más convence en una entrevista.

**¿Puedo aprender Power BI con un computador sencillo?**
Para practicar con datos medianos basta un equipo con Windows y 8 GB de RAM. Con 16 GB trabajas más cómodo con modelos grandes.

---

### 3.4 ARGENTINA — `/ar/guias/como-aprender-power-bi-en-argentina`

- **Keywords objetivo:** cómo aprender Power BI en Argentina; curso Power BI Argentina online; sueldo analista de datos Argentina; Power BI inflación; analista BI Buenos Aires Córdoba; curso Power BI en vivo.
- **Title (58):** Cómo aprender Power BI en Argentina: guía 2026 | ProgramBI
- **Meta (156):** Sueldos de analista de datos y BI según Sysarmy, ruta de 8 semanas, DAX para ajustar por inflación y dónde buscar laburo en Argentina. Guía práctica y al día.
- **H1:** Cómo aprender Power BI en Argentina (y analizar datos con inflación)

#### Texto

En Argentina, analizar datos tiene una dificultad que en otros países casi no existe: si comparás las ventas en pesos de este año con las del año pasado sin ajustar, cualquier negocio parece crecer muchísimo. Por eso un buen analista argentino no solo arma tableros: sabe expresar las cifras en moneda constante, comparar contra el dólar cuando corresponde y explicar qué pasó «en serio». Power BI es la herramienta ideal para eso. Esta guía te muestra cómo aprenderlo paso a paso, qué se paga en el mercado y cómo diferenciarte.

**[CTA-TOP]**

##### Por qué Power BI en Argentina

Argentina tiene un ecosistema tecnológico fuerte —empresas de software, fintech, servicios exportados— y una economía donde los precios cambian rápido. Las áreas de finanzas, comercial y operaciones necesitan ver números actualizados y comparables, y no pueden esperar al cierre de mes en Excel. A eso se suma la demanda de servicios para el exterior: muchos analistas trabajan para empresas de otros países, donde Power BI aparece como requisito habitual.

##### Cuánto gana un analista de datos o BI en Argentina (referencia)

La fuente más sólida para tecnología en Argentina es la **Encuesta de Sueldos de Sysarmy** (comunidad de sistemas), que publica sus datos abiertos cada semestre. En la edición **2026.1** (marzo 2026), la mediana del sueldo **bruto mensual** de quienes trabajan como analistas de datos o de BI fue:

- **Junior: $1.785.000**
- **Semi-senior: $2.557.772**
- **Senior: $3.382.000**

Cálculo del Instituto IEA sobre los datos abiertos de Sysarmy: [institutoiea.edu.ar — qué hace un analista de datos y cuánto gana](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana). Datos originales: [sysarmy.com](https://sysarmy.com/).

Ojo con dos cosas: son sueldos de quienes respondieron la encuesta (mayoría del sector tecnológico) y, con la inflación, una cifra de marzo pierde vigencia rápido. Usala como orden de magnitud, no como número exacto.

##### Dónde buscar laburo con Power BI en Argentina

- **Bumeran** y **ZonaJobs**: los portales con más avisos locales.
- **LinkedIn Empleos**: empresas grandes y posiciones remotas para el exterior.
- **Computrabajo Argentina**: avisos de pymes y del interior.
- **GetOnBoard**: avisos tech con rango salarial visible.
- **Bolsa de ProgramBI** (`/ar/empleos`).

Tip: en los avisos remotos para el exterior, además de Power BI te van a pedir inglés y SQL. Si apuntás ahí, el proyecto de portafolio conviene hacerlo con nombres de columnas y textos en inglés.

##### Industrias donde más se usa

- **Fintech y banca**: originación, mora, uso de billeteras.
- **Retail y consumo masivo**: precios, márgenes y rotación en un contexto inflacionario.
- **Agro y agroindustria**: rindes por lote y campaña, logística de cosecha, precios de granos.
- **Software y servicios**: horas facturadas, rentabilidad por cliente.
- **Energía**: producción y costos (por ejemplo, Vaca Muerta y su cadena de proveedores).

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Importá extractos y reportes, combiná archivos de varios meses y limpiá montos con separadores de miles.
2. **Semana 3 · Modelo estrella** con una **tabla de índices**: calendario mensual con IPC y, si lo necesitás, tipo de cambio.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX y RELATED.
4. **Semana 6 · Tiempo y moneda constante.** Interanual nominal versus real.
5. **Semana 7 · Diseño.** Un tablero que muestre nominal y real lado a lado, sin confundir.
6. **Semana 8 · Proyecto.** Un caso con datos públicos (por ejemplo, IPC del INDEC y datos abiertos de datos.gob.ar).

**[CTA-MID]** — Descargá la plantilla de dashboard de ventas en pesos argentinos.

##### Funciones clave, con ejemplos argentinos

Una cadena con locales en CABA, Córdoba, Rosario y Mendoza, que vende en ARS:

- `Ventas = SUM(Ventas[Importe_ARS])`
- `Ventas Córdoba = CALCULATE([Ventas], Local[Ciudad] = "Córdoba")`
- **Ventas en moneda constante** (a precios del último mes), con una tabla `IPC` relacionada al calendario mensual:
  `Ventas reales = SUMX(VALUES(Calendario[Mes]), [Ventas] * DIVIDE(MAX(IPC[Indice_ultimo]), MAX(IPC[Indice])))`
- `Var. interanual nominal % = DIVIDE([Ventas] - CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha])), CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha])))`
- Lo mismo con `[Ventas reales]` te da la **variación real**: es la que importa para decidir.
- `Ranking locales = RANKX(ALL(Local[Ciudad]), [Ventas reales])`

Cargá el IPC desde la serie oficial del INDEC (indec.gob.ar) en Power Query, para que se actualice solo cada mes.

##### Errores comunes

- **Comparar pesos de distintos meses sin ajustar.** Es el error número uno en Argentina.
- **Mezclar tipos de cambio** (oficial, MEP, etc.) sin aclarar cuál usás. Definilo con finanzas y escribilo en el tablero.
- **Montos como texto** por el punto de miles y la coma decimal.
- **Columnas calculadas en vez de medidas**, que agrandan el modelo.
- **No documentar las medidas.** Con tantas versiones (nominal, real, en USD), poné descripciones claras.

##### Tres casos reales de uso en empresas argentinas

**1. Retail en CABA: precios y margen con inflación.** Cuando los precios de lista cambian varias veces en el año, el margen se erosiona sin que nadie lo note. El tablero compara el costo de reposición con el precio vigente por producto.

`Margen reposición % = DIVIDE(SUMX(Ventas, Ventas[Cantidad] * (Ventas[Precio_unit] - RELATED(Producto[Costo_reposicion]))), SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio_unit]))`

Un filtro de «últimos 30 días» y otro de «producto con aumento de costo» muestran dónde hay que actualizar el precio.

**2. Agro en Córdoba o Santa Fe: rindes por lote y campaña.** El productor o el acopio quiere ver quintales por hectárea por lote, comparados con la campaña anterior.
`Rinde qq/ha = DIVIDE(SUM(Cosecha[Kg]) / 100, SUM(Lote[Hectareas]))`
`Rinde campaña anterior = CALCULATE([Rinde qq/ha], Campaña[Nombre] = "2024/25")` (o, mejor, con una columna de índice de campaña y `Campaña[Indice] = MAX(Campaña[Indice]) - 1`).

**3. Fintech en Buenos Aires: cohortes de clientes.** ¿Qué porcentaje de los clientes que abrieron cuenta en marzo sigue activo tres meses después?
`Activos en mes N = CALCULATE(DISTINCTCOUNT(Movimientos[ID_Cliente]), FILTER(Movimientos, Movimientos[Meses_desde_alta] = SELECTEDVALUE(MesN[N])))`
dividido por el tamaño de la cohorte. Es un análisis que en Excel lleva horas y en Power BI se actualiza solo.

##### Certificación PL-300 desde Argentina

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft cobra en dólares con precio según país; el valor exacto aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Tené en cuenta que, al ser un pago en el exterior, tu banco puede sumar percepciones e impuestos. Si apuntás a posiciones remotas para el exterior, la certificación ayuda a pasar los primeros filtros.

##### Comunidad para seguir aprendiendo

Argentina tiene una comunidad de datos muy activa. Buscá en Meetup y LinkedIn grupos de «Power BI Argentina» o de datos en Buenos Aires, Córdoba y Rosario, y revisá el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com), que tiene sección en español.

##### ¿Aprender solo o en un curso en vivo?

Solo se puede, y en Argentina hay una comunidad tech muy activa. El tema es que la parte que más vale —modelo y DAX— es la que más cuesta sin alguien que te corrija. En un curso en vivo preguntás en el momento, avanzás con fechas fijas y terminás un proyecto que podés mostrar.

##### El curso Power BI en vivo de ProgramBI (versión Argentina)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Argentina**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para Argentina: **{precio_local}** (hoy $159.900 ARS, antes $236.000 ARS).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores (como SUMX), tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en Argentina?**
Lunes y miércoles de 19:30 a 21:30, hora de Argentina. Si no llegás, la clase queda grabada en el campus.

**¿Cómo pago desde Argentina?**
Con tarjeta internacional. Ves el precio en pesos argentinos y el cargo final lo define tu banco, incluidos los impuestos que aplique a compras en el exterior.

**¿Cómo ajusto por inflación en Power BI?**
Cargá el IPC mensual del INDEC como tabla, relacionalo con el calendario y multiplicá cada mes por el cociente entre el índice actual y el del mes. En el curso trabajamos los iteradores (SUMX) que lo hacen posible.

**¿Sirve Power BI para trabajar remoto para el exterior?**
Sí, es de las herramientas más pedidas en avisos de análisis de datos. Combinado con SQL e inglés, abre esas posiciones.

**¿Necesito saber programar?**
No. Power Query y DAX se aprenden sin experiencia previa en programación. SQL suma, pero no es requisito para empezar.

**¿Qué es mejor, aprender Power BI o Python?**
Para trabajar en reportería y BI, Power BI primero: el impacto es más rápido. Python es un buen segundo paso si querés ir hacia ciencia de datos.

---

### 3.5 PERÚ — `/pe/guias/como-aprender-power-bi-en-peru`

- **Keywords objetivo:** cómo aprender Power BI en Perú; curso Power BI Perú online; sueldo analista de datos Perú; Power BI Lima; curso Power BI en vivo; certificación PL-300 Perú.
- **Title (53):** Cómo aprender Power BI en Perú: guía 2026 | ProgramBI
- **Meta (154):** Sueldo de analista de datos en Perú según Computrabajo, dónde buscar chamba, ruta de 8 semanas y DAX con ejemplos en soles de Lima, Arequipa y Trujillo.
- **H1:** Cómo aprender Power BI en Perú: guía práctica para analistas

#### Texto

En Perú, la palabra que más se repite en los avisos de análisis es «reportes»: reportes comerciales, reportes de cobranza, reportes de campaña. Detrás de casi todos hay una persona que pasa horas en Excel. Las empresas que ya dieron el salto a Power BI —bancos, mineras, agroexportadoras, retail— buscan gente que sepa automatizar ese trabajo. Esta guía te da una ruta clara para aprender, lo que se paga hoy como referencia y los errores que conviene evitar desde el primer día.

**[CTA-TOP]**

##### Por qué Power BI en Perú

La economía peruana tiene sectores muy medidos: minería, agroexportación, banca y microfinanzas, consumo masivo y retail. En todos se necesitan tableros diarios: producción, envíos por campaña, colocaciones, cobranza, venta por canal. Además, gran parte del empleo calificado se concentra en Lima, pero cada vez más empresas trabajan en modalidad híbrida o remota, lo que abre oportunidades desde Arequipa, Trujillo o Piura. Power BI, integrado con Excel y con el ecosistema Microsoft que muchas empresas ya usan, se volvió el estándar para estos tableros.

##### Cuánto gana un analista de datos en Perú (referencia)

- **Computrabajo Perú**: sueldo medio de **S/ 2.224 al mes** para «analista de datos», con 467 salarios de los últimos 12 meses (consultado el 4 nov 2026). [pe.computrabajo.com/salarios/analista-de-datos](https://pe.computrabajo.com/salarios/analista-de-datos)
- El mismo portal muestra que el rango declarado va de S/ 500 a S/ 5.000: la media mezcla cargos muy distintos.

Lectura práctica: la media incluye puestos de reportería básica. Los avisos que piden DAX, SQL y modelado son los que se ubican en la parte alta del rango.

##### Dónde buscar chamba con Power BI en Perú

- **Computrabajo Perú** y **Bumeran Perú**: más volumen de avisos locales.
- **LinkedIn Empleos**: banca, consultoras y multinacionales.
- **Talento Perú** (talentoperu.servir.gob.pe): convocatorias del Estado, que publican cada vez más puestos de analista de datos y de gestión.
- **Bolsa de ProgramBI** (`/pe/empleos`).

Tip: muchas convocatorias públicas detallan el temario que evalúan; úsalas como checklist de estudio.

##### Industrias donde más se usa

- **Banca y microfinanzas**: colocaciones, mora por agencia, metas de asesores.
- **Minería**: producción, leyes de mineral, costos por tonelada.
- **Agroexportación** (arándano, palta, uva): kilos exportados por campaña, destino y calibre.
- **Retail y consumo masivo**: sell-out, cobertura y trade marketing.
- **Sector público**: ejecución presupuestal e indicadores de gestión.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Une reportes diarios en una carpeta, limpia fechas y montos en soles.
2. **Semana 3 · Modelo estrella.** Hechos de ventas o despachos; dimensiones de agencia, producto, cliente y calendario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, ALL.
4. **Semana 6 · Tiempo y campañas.** Acumulado del año y, para agro, acumulado por campaña (que no coincide con el año calendario).
5. **Semana 7 · Diseño.** Tablero ejecutivo y tablero operativo por separado.
6. **Semana 8 · Proyecto.** Un caso con datos públicos (por ejemplo, de la Plataforma Nacional de Datos Abiertos, datosabiertos.gob.pe).

**[CTA-MID]** — Descarga la plantilla de dashboard de ventas en soles.

##### Funciones clave, con ejemplos peruanos

Una distribuidora con almacenes en Lima, Arequipa y Trujillo, que vende en soles:

- `Ventas = SUM(Ventas[Importe_PEN])`
- `Ventas Arequipa = CALCULATE([Ventas], Almacen[Ciudad] = "Arequipa")`
- `% Mora = DIVIDE(CALCULATE(SUM(Cartera[Saldo]), Cartera[Dias_atraso] > 30), SUM(Cartera[Saldo]))`
- **Acumulado por campaña agrícola** (por ejemplo, de julio a junio): `Kilos campaña = TOTALYTD(SUM(Despachos[Kilos]), Calendario[Fecha], "30/6")`
- `Kilos campaña anterior = CALCULATE([Kilos campaña], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- `Top destinos = RANKX(ALL(Destino[Pais]), SUM(Despachos[Kilos]))`

El tercer argumento de `TOTALYTD` es el día de cierre: con «30/6» el acumulado se reinicia el 1 de julio. Ajusta el formato a la configuración regional de tu modelo.

##### Errores comunes

- **Mezclar soles y dólares en la misma columna.** En Perú muchas empresas facturan en ambas monedas: separa por moneda o convierte con un tipo de cambio diario definido por finanzas.
- **Medir la campaña agrícola con año calendario.** Te parte la temporada en dos.
- **Tableros que dependen de un archivo en el escritorio de alguien.** Usa una carpeta compartida o una base de datos como origen.
- **Columnas calculadas para todo.**
- **No validar contra el sistema contable.** Antes de publicar, cuadra un mes con finanzas.

##### Tres casos reales de uso en empresas peruanas

**1. Microfinanciera en provincias: mora por agencia y asesor.** La gerencia quiere ver cada mañana qué agencias empeoraron su mora y qué asesores concentran los créditos en riesgo.

`Cartera en riesgo % = DIVIDE(CALCULATE(SUM(Creditos[Saldo_PEN]), Creditos[Dias_atraso] > 30), SUM(Creditos[Saldo_PEN]))`
`Variación vs. mes anterior = [Cartera en riesgo %] - CALCULATE([Cartera en riesgo %], DATEADD(Calendario[Fecha], -1, MONTH))`

Con un mapa por región (Arequipa, Cusco, Piura, Junín…), se ve de un vistazo dónde actuar.

**2. Agroexportadora en Ica o La Libertad: kilos por destino y calibre.** Durante la campaña de arándano o uva, el área comercial sigue cuántos kilos salieron por destino y si se cumple el programa de embarques.
`Cumplimiento programa = DIVIDE(SUM(Despachos[Kilos]), SUM(Programa[Kilos_programados]))`
`Kilos por contenedor = DIVIDE(SUM(Despachos[Kilos]), DISTINCTCOUNT(Despachos[Contenedor]))`

**3. Minera en el sur: costo por tonelada.** Operaciones y finanzas comparan el costo real contra el presupuesto, por proceso.
`Costo por t (USD) = DIVIDE(SUM(Costos[Monto_USD]), SUM(Produccion[Toneladas]))`
Aquí casi todo se reporta en dólares: deja la moneda explícita en el nombre de cada medida.

##### Certificación PL-300 en Perú

La certificación oficial de Microsoft es **Power BI Data Analyst Associate** (examen **PL-300**). El precio lo fija Microsoft según el país; el valor para Perú aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). En banca y consultoras de Lima se menciona con frecuencia como deseable. Prepárala después de dominar las bases, no antes.

##### Comunidad para seguir aprendiendo

El foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español. Busca en Meetup y LinkedIn grupos de «Power BI Perú» o «Power BI Lima» y revisa cuáles tienen eventos recientes; también las universidades de Lima organizan charlas abiertas sobre analítica.

##### Un portafolio con datos peruanos

La Plataforma Nacional de Datos Abiertos (datosabiertos.gob.pe) publica conjuntos de datos de salud, educación y ejecución presupuestal. Un tablero de **ejecución del presupuesto por región** o de **matrícula escolar** muestra que sabes limpiar, modelar y comunicar. Acompáñalo de una explicación corta en LinkedIn.

Un detalle local que suma puntos en entrevistas: en Perú muchas empresas reportan en soles y dólares a la vez. Muestra en tu proyecto un selector de moneda hecho con SWITCH y explica qué tipo de cambio usaste y de dónde lo sacaste (por ejemplo, la serie publicada por el BCRP).

##### ¿Aprender solo o en un curso en vivo?

Solo es posible con constancia. Pero, como muestran los avisos, el diferencial está en DAX y en el modelo, que es donde más gente se traba. En vivo resuelves dudas en el momento, avanzas con un calendario y terminas un proyecto. Si solo puedes de noche o te cruza una reunión, las grabaciones cubren la clase.

##### El curso Power BI en vivo de ProgramBI (versión Perú)

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30, hora de Perú**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para Perú: **{precio_local}** (hoy S/ 349.00, antes S/ 514.00).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en Perú?**
Lunes y miércoles de 17:30 a 19:30, hora de Perú. Quedan grabadas por si no puedes conectarte.

**¿Cómo pago desde Perú?**
Con tarjeta internacional. El precio se muestra en soles y el cargo final lo define tu banco.

**¿Conviene la certificación PL-300 de Microsoft?**
Es la certificación oficial de analista de datos con Power BI. Este curso cubre buena parte de las bases (Power Query, modelado, DAX), pero no es un curso de preparación de examen. Si apuntas a la PL-300, primero domina estas bases y luego practica con la guía oficial de Microsoft.

**¿Sirve para postular al Estado?**
Muchas convocatorias públicas piden manejo de herramientas de análisis o Power BI. El certificado de ProgramBI acredita horas y temario; revisa en cada convocatoria qué tipo de constancia aceptan.

**¿Necesito saber SQL antes?**
No para empezar. Pero los avisos mejor pagados lo piden, así que es un buen segundo paso. ProgramBI también tiene curso de SQL.

**¿Funciona Power BI en Mac?**
Power BI Desktop solo existe para Windows. En Mac se usa con una máquina virtual o un PC.

---

### 3.6 URUGUAY — `/uy/guias/como-aprender-power-bi-en-uruguay`

- **Keywords objetivo:** cómo aprender Power BI en Uruguay; curso Power BI Uruguay; curso Power BI Montevideo; analista de datos Uruguay sueldo; Power BI unidades indexadas; curso Power BI en vivo.
- **Title (56):** Cómo aprender Power BI en Uruguay: guía 2026 | ProgramBI
- **Meta (155):** Qué pide el mercado uruguayo, un sueldo público de analista de datos con fuente, ruta de 8 semanas y DAX con ejemplos en pesos y UI. Para Montevideo y el interior.
- **H1:** Cómo aprender Power BI en Uruguay: ruta práctica para analistas

#### Texto

Uruguay es un país chico con una industria de software y servicios que exporta al mundo, y eso se nota en el mercado de trabajo: las empresas valoran a quien sabe ordenar datos y presentarlos con claridad, sea para un cliente en Estados Unidos o para la gerencia de una empresa en Montevideo. Si hoy armás reportes en Excel y querés dar el siguiente paso, Power BI es la herramienta más directa. Esta guía te muestra cómo aprenderla con orden, con ejemplos pensados para la realidad uruguaya.

**[CTA-TOP]**

##### Por qué Power BI en Uruguay

Tres rasgos del mercado uruguayo lo explican. Primero, el peso de la industria de software y servicios globales, con zonas francas y empresas que trabajan para el exterior, donde los tableros son parte del día a día. Segundo, sectores tradicionales muy medidos: agro y frigoríficos, forestal y celulosa, logística portuaria, banca y seguros. Tercero, un Estado que publica muchos datos abiertos y contrata analistas. En todos, Power BI conecta lo que ya existe (Excel, bases de datos, sistemas de gestión) y lo convierte en un tablero que se actualiza solo.

##### Cuánto se paga (referencia pública)

En Uruguay hay pocas fuentes de sueldos privadas con muestra suficiente, así que preferimos un dato público y verificable: en 2026, el **Ministerio de Economía y Finanzas (MEF)** abrió un llamado (postulaciones hasta el 8 de setiembre) para **Analista de datos e información** en la Dirección General de Secretaría, con una remuneración nominal de **$64.986 por 40 horas semanales** (valores a enero de 2026), sede en Montevideo. Pedía título en estadística o posgrado en ciencia de datos y un año de experiencia. [El País Uruguay — llamado MEF analista de datos](https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026)

Es un punto de referencia del sector público; en el privado, y sobre todo en empresas que trabajan para el exterior, los rangos varían mucho según experiencia e inglés.

##### Dónde buscar laburo con Power BI en Uruguay

- **BuscoJobs** y **Gallito Trabajo**: los portales locales con más avisos.
- **LinkedIn Empleos**: empresas de software, consultoras y posiciones remotas.
- **Uruguay Concursa** (uruguayconcursa.gub.uy): llamados del Estado, incluidos los de analista de datos.
- **Bolsa de ProgramBI** (`/uy/empleos`).

Tip: en los llamados públicos se publican las bases con el temario evaluado. Son una muy buena guía de qué estudiar.

##### Industrias donde más se usa

- **Software y servicios globales**: horas, proyectos y rentabilidad por cliente.
- **Agro, frigoríficos y forestal**: faena, exportaciones por destino, rendimiento.
- **Logística y puerto**: movimientos, tiempos de operación, ocupación.
- **Banca y seguros**: cartera, siniestralidad, metas comerciales.
- **Sector público**: indicadores de gestión y datos abiertos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Combiná archivos mensuales, limpiá montos con punto de miles y coma decimal.
2. **Semana 3 · Modelo estrella** con calendario y una tabla de **cotización de la UI** (unidad indexada) y del dólar.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX, RELATED.
4. **Semana 6 · Tiempo.** Interanual en pesos, en UI y en dólares.
5. **Semana 7 · Diseño.** Selector de moneda para que el usuario elija cómo ver las cifras.
6. **Semana 8 · Proyecto.** Un tablero con datos abiertos uruguayos (catalogodatos.gub.uy).

**[CTA-MID]** — Descargá la plantilla de dashboard de ventas en pesos uruguayos.

##### Funciones clave, con ejemplos uruguayos

Una empresa con locales en Montevideo, Maldonado y Salto, que vende en UYU:

- `Ventas = SUM(Ventas[Importe_UYU])`
- `Ventas Maldonado = CALCULATE([Ventas], Local[Departamento] = "Maldonado")`
- **Ventas en UI** (para comparar sin el efecto de la inflación), con una tabla diaria de cotización de la UI relacionada al calendario:
  `Ventas UI = SUMX(Ventas, Ventas[Importe_UYU] / RELATED(Cotizacion[UI]))`
- **Ventas en USD**: `Ventas USD = SUMX(Ventas, Ventas[Importe_UYU] / RELATED(Cotizacion[USD]))`
- **Selector de moneda** (tabla desconectada `Moneda` con valores UYU, UI, USD):
  `Ventas mostradas = SWITCH(SELECTEDVALUE(Moneda[Moneda], "UYU"), "UYU", [Ventas], "UI", [Ventas UI], "USD", [Ventas USD])`
- `Temporada alta Maldonado % = DIVIDE(CALCULATE([Ventas Maldonado], Calendario[Mes] IN {1, 2}), [Ventas Maldonado])`

La cotización de la UI la publica el INE y el dólar, el Banco Central del Uruguay; cargalas en Power Query para que se actualicen solas.

##### Errores comunes

- **Comparar pesos de años distintos sin ajustar.** Usá UI o dólares según lo que defina finanzas.
- **Usar la cotización mensual cuando el negocio factura con la diaria.**
- **Olvidar la estacionalidad** (verano en la costa, zafra en el agro) al comparar meses.
- **Columnas calculadas en vez de medidas.**
- **Publicar sin seguridad por filas** cuando cada sucursal solo debería ver lo suyo.

##### Tres casos reales de uso en empresas uruguayas

**1. Empresa de software en Montevideo: rentabilidad por cliente.** Las horas se cargan en una herramienta de seguimiento y la facturación sale en dólares. El tablero cruza ambas cosas.

`Horas facturables % = DIVIDE(CALCULATE(SUM(Horas[Horas]), Horas[Facturable] = TRUE()), SUM(Horas[Horas]))`
`Tarifa efectiva USD = DIVIDE(SUM(Facturacion[Monto_USD]), CALCULATE(SUM(Horas[Horas]), Horas[Facturable] = TRUE()))`

Ordenado por cliente, muestra qué cuentas se llevan horas que nadie cobra.

**2. Frigorífico o agro en el interior: faena y exportación por destino.** Se sigue el volumen por mercado (China, Estados Unidos, Unión Europea…) y el precio promedio por tonelada.
`Precio prom. USD/t = DIVIDE(SUM(Exportaciones[Monto_USD]), SUM(Exportaciones[Toneladas]))`
`Participación destino = DIVIDE(SUM(Exportaciones[Toneladas]), CALCULATE(SUM(Exportaciones[Toneladas]), ALL(Destino)))`

**3. Comercio en la costa: temporada.** En Maldonado y Rocha la venta de enero y febrero define el año. El tablero compara cada temporada con la anterior, en UI para quitar el efecto de los precios, con la medida `Ventas UI` de arriba y `SAMEPERIODLASTYEAR`.

##### Certificación PL-300 desde Uruguay

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país; lo ves al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). En empresas que trabajan para el exterior suele sumar, sobre todo combinada con inglés.

##### Comunidad para seguir aprendiendo

Revisá el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com), con sección en español, y buscá en Meetup y LinkedIn grupos de datos o de Power BI en Montevideo con actividad reciente.

##### Un portafolio con datos uruguayos

El Catálogo de Datos Abiertos (catalogodatos.gub.uy) publica datos de movilidad, salud, educación y turismo. Un tablero de **turismo receptivo por temporada** o de **movilidad en Montevideo** es fácil de explicar en una entrevista y muestra todo el ciclo: datos, modelo, medidas y presentación.

Un detalle que suma en entrevistas en Uruguay: explicá por qué elegiste UI, pesos o dólares para cada indicador. Demuestra criterio de negocio, que es justo lo que separa a un analista de alguien que solo arma gráficos.

##### ¿Aprender solo o en un curso en vivo?

Si tenés tiempo y disciplina, podés avanzar solo con la documentación de Microsoft. Donde casi todos se traban es en DAX: con un instructor en vivo resolvés dudas al momento, avanzás con un calendario y terminás un proyecto. Y como el horario coincide con el de Montevideo, se hace sin trasnochar.

##### El curso Power BI en vivo de ProgramBI (versión Uruguay)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Uruguay**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para Uruguay: **{precio_local}** (hoy $5.990 UYU, antes $8.790 UYU).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH (justo lo del selector de moneda) e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en Uruguay?**
Lunes y miércoles de 19:30 a 21:30, hora de Uruguay. Quedan grabadas en el campus.

**¿Cómo pago desde Uruguay?**
Con tarjeta internacional. El precio se muestra en pesos uruguayos y el cargo final lo define tu banco.

**¿Cómo muestro cifras en UI en Power BI?**
Cargá la serie diaria de la UI del INE, relacionala con el calendario y dividí cada importe por la cotización del día con SUMX. Con un selector (SWITCH) el usuario elige pesos, UI o dólares.

**¿Sirve Power BI para trabajar en empresas que exportan servicios?**
Sí. Es una de las herramientas más pedidas en análisis de datos. Sumado a SQL e inglés, te abre esas posiciones.

**¿Sirve el certificado para un llamado público?**
El certificado de ProgramBI acredita horas y temario. Cada llamado define qué méritos valora; revisá las bases en Uruguay Concursa.

**¿Necesito Excel avanzado para empezar?**
No. Con un manejo intermedio (tablas, filtros, tablas dinámicas) alcanza. Power Query reemplaza buena parte del trabajo manual.

---

### 3.7 PARAGUAY — `/py/guias/como-aprender-power-bi-en-paraguay` (o alternativa sin `/py/`, ver §2.9)

- **Keywords objetivo:** cómo aprender Power BI en Paraguay; curso Power BI Paraguay; curso Power BI Asunción; analista de datos Paraguay; Power BI en guaraníes; curso Power BI en vivo.
- **Title (57):** Cómo aprender Power BI en Paraguay: guía 2026 | ProgramBI
- **Meta (153):** Ruta de 8 semanas para aprender Power BI desde Paraguay, dónde buscar empleo, DAX con ejemplos en guaraníes y dólares, y clases en vivo en tu mismo horario.
- **H1:** Cómo aprender Power BI en Paraguay, desde cero hasta tu primer tablero

#### Texto

En Paraguay pasa algo particular con los números: los montos en guaraníes son tan grandes que un reporte en Excel se vuelve ilegible enseguida, y muchas empresas manejan a la vez guaraníes y dólares. Si trabajás en una empresa de Asunción, en el comercio de Ciudad del Este o en el agro del Alto Paraná, Power BI te permite ordenar todo eso en un tablero claro. Esta guía te da la ruta para aprenderlo, dónde buscar empleo y los errores que conviene evitar.

**[CTA-TOP]**

##### Por qué Power BI en Paraguay

La economía paraguaya combina agroindustria (soja, carne, granos), comercio, energía, logística fluvial y una industria de maquila que crece. Son sectores con mucho movimiento y poca reportería automatizada: la información existe, pero vive en planillas. A eso se suma un sector financiero —bancos, cooperativas y financieras— que necesita seguir cartera y cobranza a diario. Power BI resuelve justo eso: conecta las planillas y sistemas que ya existen y entrega tableros que se actualizan solos.

##### Cuánto se paga (referencia)

No encontramos una fuente pública con muestra suficiente y metodología clara para el sueldo de analista de datos o BI en Paraguay, así que preferimos no publicar una cifra. Para tener una referencia real, revisá los avisos con sueldo visible en los portales de abajo y las bases de los concursos públicos, que publican la remuneración.

##### Dónde buscar empleo con Power BI en Paraguay

- **Computrabajo Paraguay**: el portal con más avisos locales.
- **LinkedIn Empleos**: bancos, multinacionales y posiciones remotas.
- **Paraguay Concursa** (paraguayconcursa.gov.py): concursos del sector público con remuneración publicada.
- **Bolsa de ProgramBI** (`/empleos`).

Tip: en Paraguay muchos puestos de «analista de crédito», «analista comercial» o «analista de costos» piden Power BI sin decirlo en el título. Buscá por la herramienta, no solo por el cargo.

##### Industrias donde más se usa

- **Agroindustria y ganadería**: acopio, exportaciones, faena.
- **Bancos, financieras y cooperativas**: cartera, mora, colocaciones por sucursal.
- **Comercio y distribución**: ventas por zona, stock, márgenes.
- **Maquila y manufactura**: producción, eficiencia, costos.
- **Energía y logística fluvial**: operación, despachos, tiempos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Uní planillas de varias sucursales y separá columnas de guaraníes y dólares.
2. **Semana 3 · Modelo estrella** con calendario y tabla de **tipo de cambio** diario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX.
4. **Semana 6 · Tiempo.** Mes contra mes, año contra año y acumulado.
5. **Semana 7 · Diseño para cifras grandes.** Formatos en millones y miles de millones, tarjetas legibles.
6. **Semana 8 · Proyecto.** Un tablero con datos abiertos paraguayos (datos.gov.py) para tu portafolio.

**[CTA-MID]** — Descargá la plantilla de dashboard de ventas en guaraníes.

##### Funciones clave, con ejemplos paraguayos

Una distribuidora con sucursales en Asunción, Ciudad del Este y Encarnación, que vende en guaraníes y en dólares:

- `Ventas PYG = SUM(Ventas[Importe_PYG])`
- `Ventas USD = SUM(Ventas[Importe_USD])`
- **Todo en guaraníes**, usando el tipo de cambio del día:
  `Ventas total PYG = SUMX(Ventas, Ventas[Importe_PYG] + Ventas[Importe_USD] * RELATED(TipoCambio[PYG_por_USD]))`
- `Ventas CDE = CALCULATE([Ventas total PYG], Sucursal[Ciudad] = "Ciudad del Este")`
- **Para leer cifras grandes**, mostrá en millones: `Ventas (M ₲) = DIVIDE([Ventas total PYG], 1000000)`
- `% Mora cooperativa = DIVIDE(CALCULATE(SUM(Cartera[Saldo]), Cartera[Dias_atraso] > 60), SUM(Cartera[Saldo]))`

El tipo de cambio de referencia lo publica el Banco Central del Paraguay; cargalo en Power Query y relacionalo con el calendario.

##### Errores comunes

- **Sumar guaraníes y dólares en la misma columna.** Siempre separados o convertidos.
- **Tarjetas con 12 dígitos.** Nadie lee «₲ 1.234.567.890»; usá millones.
- **Tipo de cambio fijo «a ojo».** Definí con finanzas cuál se usa (del día, promedio o de cierre).
- **Planillas distintas por sucursal**, cada una con su formato. Normalizalas en Power Query antes de modelar.
- **Columnas calculadas en lugar de medidas.**

##### Tres casos reales de uso en empresas paraguayas

**1. Cooperativa en Asunción o Central: cartera y morosidad por sucursal.** Las cooperativas manejan miles de socios y créditos pequeños. Un tablero diario de mora evita sorpresas al cierre.

`Socios con atraso = CALCULATE(DISTINCTCOUNT(Creditos[ID_Socio]), Creditos[Dias_atraso] > 30)`
`Mora % = DIVIDE(CALCULATE(SUM(Creditos[Saldo_PYG]), Creditos[Dias_atraso] > 60), SUM(Creditos[Saldo_PYG]))`

Con seguridad por filas, cada jefe de sucursal ve solo la suya.

**2. Acopio de granos en Alto Paraná o Itapúa: recepción por zafra.** En plena cosecha de soja, el acopio necesita saber cuántas toneladas entraron por silo, productor y día, y cuánto descuento por humedad se aplicó.
`Toneladas netas = DIVIDE(SUMX(Recepcion, Recepcion[Kg_bruto] * (1 - Recepcion[Desc_humedad])), 1000)`
`Avance zafra % = DIVIDE([Toneladas netas], SUM(Plan[Toneladas_plan]))`

**3. Comercio en Ciudad del Este: ventas en dos monedas.** Con la medida `Ventas total PYG` de arriba, más una tabla de vendedores, el tablero muestra ventas por turno y vendedor en guaraníes o en dólares, según elija el usuario con un selector (`SWITCH`).

##### Certificación PL-300 desde Paraguay

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país; el valor para Paraguay aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Es un diferencial claro en un mercado donde pocos perfiles la tienen, pero rinde más con proyectos que la respalden.

##### Comunidad para seguir aprendiendo

El foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español. Buscá en LinkedIn y Meetup grupos de datos o de Power BI en Asunción con actividad reciente; también las universidades suelen organizar charlas abiertas de analítica.

##### Un portafolio con datos paraguayos

El portal de datos abiertos (datos.gov.py) y los datos de contrataciones públicas permiten armar un tablero de **compras públicas por entidad** o de **indicadores por departamento**. Mostrá qué pregunta respondés y qué medidas usaste: eso es lo que un reclutador quiere ver.

##### Qué estudiar después de Power BI

Cuando ya domines el tablero, el siguiente paso con más retorno en Paraguay es **SQL**: muchos bancos, financieras y cooperativas guardan su información en bases de datos, y poder consultar directamente sin pedir exportaciones a sistemas te hace independiente. Después, según tu rol, **Excel avanzado con Power Pivot** (para quienes siguen trabajando mucho con planillas) o **Python** (si te interesa ir hacia modelos de riesgo o proyecciones). Un orden razonable: Power BI → SQL → automatización. Así cada paso construye sobre el anterior y lo podés aplicar en tu trabajo actual desde la primera semana.

Un detalle que suma en entrevistas: mostrá que sabés explicar cifras grandes. Presentá tus resultados en millones de guaraníes y, cuando corresponda, en dólares, y aclará qué tipo de cambio usaste. Ese cuidado transmite criterio.

##### ¿Aprender solo o en un curso en vivo?

Podés empezar solo con la documentación de Microsoft. Pero la parte que da trabajo —modelo y DAX— se aprende mucho más rápido con alguien que corrige en el momento y con un calendario que te obliga a avanzar. Además, el horario del curso es el mismo de Paraguay, así que no tenés que hacer cuentas.

##### El curso Power BI en vivo de ProgramBI (para Paraguay)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Paraguay** (misma hora que Chile en esta temporada; verificar cuando Chile cambie de horario).
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para Paraguay: **{precio_local}** — se mostrará en USD cuando exista `/py/` (monto a definir por Manu). Mientras tanto, CTA a WhatsApp para consultar.
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]**

##### Preguntas frecuentes

**¿A qué hora son las clases en Paraguay?**
Lunes y miércoles de 19:30 a 21:30, hora de Paraguay. Si no podés, quedan grabadas.

**¿Puedo pagar desde Paraguay?**
Sí, con tarjeta internacional. El cargo final lo define tu banco. Escribinos por WhatsApp y te confirmamos el valor.

**¿Cómo manejo guaraníes y dólares en el mismo tablero?**
Con una tabla de tipo de cambio diario y una medida con SUMX que convierta cada venta. Así podés ver todo en guaraníes o todo en dólares.

**¿Power BI sirve en cooperativas?**
Sí: cartera, mora, socios activos y colocaciones por sucursal son casos típicos.

**¿Necesito saber programar?**
No. Power Query y DAX se aprenden sin experiencia previa.

**¿El certificado sirve para concursos públicos?**
Acredita horas y temario. Cada concurso de Paraguay Concursa define qué méritos valora; revisá las bases.

---

## 4. Guías transversales (una sola versión, sin variantes por país)

### 4.1 `/guias/funciones-dax-mas-importantes`

- **Keywords:** funciones DAX más importantes; DAX para principiantes; CALCULATE ejemplos; funciones DAX Power BI; diferencia SUM y SUMX.
- **Title (51):** Las 15 funciones DAX más importantes (con ejemplos)
- **Meta (152):** CALCULATE, FILTER, SUMX, DIVIDE, RANKX y la inteligencia de tiempo explicadas con ejemplos reales. La guía de DAX que necesitas para usar Power BI en serio.
- **H1:** Las funciones DAX más importantes de Power BI, explicadas con ejemplos

#### Texto

DAX es el lenguaje de fórmulas de Power BI. Se parece a Excel, y esa es justamente la trampa: las fórmulas se ven familiares, pero funcionan con otra lógica. En Excel calculas celda por celda; en DAX calculas sobre un **contexto**, es decir, sobre el conjunto de filas que quedan después de aplicar los filtros del informe. Si entiendes eso, el resto son herramientas. Aquí están las 15 funciones que resuelven la gran mayoría de los casos reales, agrupadas por lo que hacen.

**[CTA-TOP]**

##### Antes de empezar: medidas, no columnas

Una **columna calculada** se calcula una vez por fila y ocupa memoria. Una **medida** se calcula en el momento, según los filtros que el usuario tenga activos. Para totales, porcentajes y comparaciones, usa medidas. Regla práctica: si el resultado depende de qué filtró el usuario, es una medida.

##### 1. Agregaciones básicas

**SUM, AVERAGE, MIN, MAX.** Suman o promedian una columna.
`Ventas = SUM(Ventas[Monto])`

**COUNTROWS.** Cuenta filas de una tabla. Más claro que contar una columna.
`N° de pedidos = COUNTROWS(Ventas)`

**DISTINCTCOUNT.** Cuenta valores únicos.
`Clientes activos = DISTINCTCOUNT(Ventas[ID_Cliente])`

##### 2. DIVIDE: la división segura

`Margen % = DIVIDE([Ventas] - [Costo], [Ventas])`
Si el denominador es cero o está vacío, devuelve vacío en lugar de error. Úsala siempre en vez de «/».

##### 3. CALCULATE: la función más importante de DAX

CALCULATE evalúa una expresión **cambiando el contexto de filtro**. Es la que te permite responder «¿y si solo miro…?».

`Ventas online = CALCULATE([Ventas], Canal[Nombre] = "Online")`

Lo que hace: toma todos los filtros que ya hay en el informe, reemplaza el filtro sobre `Canal[Nombre]` por «Online» y calcula. Si el usuario filtra un mes, la medida respeta ese mes.

##### 4. FILTER: filtros con condiciones complejas

Cuando la condición no es una simple igualdad, combinas CALCULATE con FILTER:

`Ventas de pedidos grandes = CALCULATE([Ventas], FILTER(Ventas, Ventas[Monto] > 1000))`

Consejo de rendimiento: filtra columnas, no tablas completas, cuando puedas. `FILTER(ALL(Producto[Categoría]), …)` es más liviano que `FILTER(Ventas, …)` sobre millones de filas.

##### 5. ALL y ALLEXCEPT: quitar filtros

Para porcentajes sobre el total necesitas el total «sin filtrar»:

`% del total = DIVIDE([Ventas], CALCULATE([Ventas], ALL(Producto)))`

`ALLEXCEPT(Producto, Producto[Categoría])` quita todos los filtros de la tabla menos el de categoría: útil para «% dentro de la categoría».

##### 6. Iteradores: SUMX y AVERAGEX

SUM suma una columna que ya existe. **SUMX** recorre una tabla fila por fila, calcula una expresión y suma el resultado.

`Ventas = SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio_unitario])`

Es la clave para convertir moneda por tipo de cambio diario, ponderar promedios o calcular márgenes por línea. `AVERAGEX(VALUES(Cliente[ID]), [Ventas])` da el promedio de ventas **por cliente**, no por fila.

##### 7. RELATED: traer un dato de otra tabla

Dentro de un iterador, RELATED trae el valor de la tabla relacionada (lado «uno»):

`Costo total = SUMX(Ventas, Ventas[Cantidad] * RELATED(Producto[Costo_unitario]))`

##### 8. Inteligencia de tiempo

Requiere una **tabla calendario** marcada como tabla de fechas, sin huecos.

- `Ventas YTD = TOTALYTD([Ventas], Calendario[Fecha])` — acumulado del año (acepta fecha de cierre fiscal como tercer argumento).
- `Ventas AA = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))` — mismo período del año anterior.
- `Ventas mes anterior = CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH))`
- `Var. % interanual = DIVIDE([Ventas] - [Ventas AA], [Ventas AA])`

##### 9. RANKX: rankings dinámicos

`Ranking producto = RANKX(ALL(Producto[Nombre]), [Ventas])`
El ALL es clave: sin él, cada producto se compara solo consigo mismo y todos quedan en el puesto 1.

##### 10. SWITCH y SELECTEDVALUE: medidas que cambian según lo que elige el usuario

Con una tabla desconectada `Métrica` (Ventas, Margen, Unidades):

`Valor elegido = SWITCH(SELECTEDVALUE(Métrica[Nombre]), "Ventas", [Ventas], "Margen", [Margen %], "Unidades", [Unidades])`

Así un solo gráfico muestra la métrica que el usuario elige en un segmentador.

##### 11. VAR: fórmulas legibles y más rápidas

`Crecimiento % =
VAR Actual = [Ventas]
VAR Anterior = [Ventas AA]
RETURN DIVIDE(Actual - Anterior, Anterior)`

Las variables se calculan una vez, hacen la fórmula legible y evitan repetir cálculos.

**[CTA-MID]** — Descarga la plantilla con estas 15 medidas ya creadas.

##### Los errores de DAX más comunes

- **Usar columnas calculadas para totales.**
- **Olvidar ALL en RANKX o en porcentajes del total.**
- **Inteligencia de tiempo sin tabla calendario** o con fechas que tienen hora.
- **Relaciones bidireccionales «por si acaso»**, que generan resultados ambiguos.
- **Copiar fórmulas de Excel** esperando que funcionen igual.

##### Por dónde seguir

Domina primero CALCULATE, DIVIDE, SUMX y la inteligencia de tiempo: con eso resuelves el 80 % de los informes de negocio. Después vienen el contexto de transición, las tablas virtuales y la optimización.

Si quieres aprenderlo con ejemplos de tu país, elige tu guía: [Chile](/guias/como-aprender-power-bi-en-chile) · [México](/mx/guias/como-aprender-power-bi-en-mexico) · [Colombia](/co/guias/como-aprender-power-bi-en-colombia) · [Argentina](/ar/guias/como-aprender-power-bi-en-argentina) · [Perú](/pe/guias/como-aprender-power-bi-en-peru) · [Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay) · [Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

**[CTA-END]** — El curso Power BI en vivo de ProgramBI dedica módulos completos a DAX: CALCULATE y FILTER, Time Intelligence, RANKX e iteradores y tabla de métricas con SWITCH. 20 horas en vivo por Zoom, grabaciones de por vida y certificado.

##### Preguntas frecuentes

**¿Qué es DAX?** Data Analysis Expressions, el lenguaje de fórmulas de Power BI, Power Pivot y Analysis Services.
**¿Cuál es la función DAX más importante?** CALCULATE, porque permite modificar el contexto de filtro y está detrás de casi todas las medidas de negocio.
**¿Cuál es la diferencia entre SUM y SUMX?** SUM suma una columna; SUMX calcula una expresión fila por fila y luego suma.
**¿Se puede aprender DAX sin saber programar?** Sí. Requiere práctica con el concepto de contexto, no experiencia en programación.
**¿Cuánto tiempo toma aprender DAX?** Lo esencial, unas 3 a 4 semanas de práctica regular. Dominarlo es un proceso más largo.
**¿DAX sirve en Excel?** Sí, en Power Pivot dentro de Excel se usa el mismo lenguaje.

---

### 4.2 `/guias/power-bi-vs-excel`

- **Keywords:** Power BI vs Excel; diferencia entre Power BI y Excel; cuándo usar Power BI; Excel o Power BI; pasar de Excel a Power BI.
- **Title (53):** Power BI vs Excel: diferencias y cuándo usar cada uno
- **Meta (151):** Comparación honesta entre Power BI y Excel: volumen de datos, automatización, colaboración y costo. Con una tabla de decisión y cómo dar el paso sin traumas.
- **H1:** Power BI vs Excel: qué los diferencia y cuándo conviene cada uno

#### Texto

La pregunta «¿Power BI o Excel?» tiene una respuesta corta que casi nadie da: **los dos**. Excel no va a desaparecer de tu trabajo, y Power BI no es «un Excel más bonito». Son herramientas para momentos distintos del mismo proceso. Esta guía te ayuda a decidir cuál usar en cada caso y cómo pasar de uno a otro sin perder lo que ya sabes.

**[CTA-TOP]**

##### La diferencia de fondo

**Excel** es una hoja de cálculo: una cuadrícula flexible donde puedes escribir, calcular, simular y anotar en cualquier celda. Es ideal para análisis puntuales, presupuestos, escenarios y trabajo «a mano».

**Power BI** es una herramienta de inteligencia de negocios: conecta fuentes de datos, las transforma con reglas que se repiten solas, las organiza en un modelo y las presenta en informes interactivos que se comparten en la web. Es ideal para reportes recurrentes que muchas personas consultan.

Dicho simple: Excel es para **pensar con datos**; Power BI es para **que muchos vean los mismos datos, actualizados, sin que tú los rehagas**.

##### Comparación punto por punto

| Criterio | Excel | Power BI |
|---|---|---|
| Volumen de datos | Hasta 1.048.576 filas por hoja; se pone lento mucho antes | Modelos comprimidos con millones de filas |
| Actualización | Manual o con macros | Programada en el servicio (según licencia) |
| Limpieza de datos | Power Query (sí, también está en Excel) | Power Query, el mismo motor |
| Cálculos | Fórmulas por celda | Medidas DAX sobre un modelo |
| Visualización | Gráficos estáticos | Informes interactivos con filtros cruzados |
| Compartir | Enviar el archivo (y sus versiones) | Un enlace con permisos por persona o grupo |
| Seguridad por usuario | Limitada | Seguridad a nivel de fila (RLS) |
| Escenarios «qué pasa si» | Excelente | Posible, pero menos natural |
| Curva de aprendizaje | Ya la conoces | Nueva, sobre todo en DAX y modelado |
| Costo para empezar | Incluido en Microsoft 365 | Power BI Desktop gratis en Windows; compartir requiere licencia |

##### Cuándo usar Excel

- Un análisis puntual que harás una vez.
- Presupuestos, proyecciones y simulaciones con supuestos que cambias a mano.
- Cuadros que necesitan anotaciones, comentarios o formato libre.
- Cuando el destinatario necesita editar los datos.

##### Cuándo usar Power BI

- Un reporte que se repite cada semana o mes.
- Datos de varias fuentes (ERP, CRM, planillas, bases de datos) que hay que cruzar.
- Más de unas pocas personas que necesitan ver los mismos números.
- Cuando el archivo de Excel ya tarda minutos en abrir.
- Cuando cada persona debería ver solo su parte (por región, sucursal o vendedor).

##### La señal más clara de que necesitas Power BI

Si cada mes haces **exactamente los mismos pasos** para armar un reporte —descargar, pegar, arreglar, actualizar tablas dinámicas, mandar por correo—, ese trabajo se puede automatizar. Lo que haces en horas, Power BI lo hace al actualizar.

**[CTA-MID]** — Descarga una plantilla de Power BI y compárala con tu reporte de Excel actual.

##### Cómo pasar de Excel a Power BI sin traumas

1. **Empieza por Power Query en Excel.** Si ya limpias datos con Power Query, en Power BI te sentirás en casa.
2. **Ordena tus datos como tablas**: una fila por registro, sin celdas combinadas ni subtotales.
3. **Separa hechos y dimensiones**: ventas por un lado; productos, clientes y fechas por otro.
4. **Traduce tus fórmulas a medidas**: tus SUMAR.SI.CONJUNTO se convierten en CALCULATE.
5. **Rehaz un solo reporte**, el más repetitivo. Cuando funcione, sigue con el próximo.
6. **Mantén Excel para lo que hace mejor**: puedes analizar un modelo de Power BI desde Excel con «Analizar en Excel».

##### Equivalencias útiles

| En Excel | En Power BI (DAX) |
|---|---|
| SUMAR.SI / SUMAR.SI.CONJUNTO | `CALCULATE(SUM(...), filtro)` |
| BUSCARV / BUSCARX | Relaciones del modelo + `RELATED` |
| Tabla dinámica | Matriz con medidas |
| % del total en tabla dinámica | `DIVIDE([Ventas], CALCULATE([Ventas], ALL(...)))` |
| SI.ERROR(a/b; 0) | `DIVIDE(a, b, 0)` |

##### Mitos frecuentes

- **«Power BI reemplaza a Excel.»** No. Lo complementa.
- **«Power BI es solo para ingenieros.»** Lo usan contadores, analistas comerciales y de RR. HH.
- **«Si sé Excel, ya sé Power BI.»** Te ayuda mucho, pero el modelado y DAX son otra lógica.
- **«Necesito una licencia cara para empezar.»** Power BI Desktop es gratuito en Windows.

Elige tu guía para aprender Power BI con ejemplos de tu país: [Chile](/guias/como-aprender-power-bi-en-chile) · [México](/mx/guias/como-aprender-power-bi-en-mexico) · [Colombia](/co/guias/como-aprender-power-bi-en-colombia) · [Argentina](/ar/guias/como-aprender-power-bi-en-argentina) · [Perú](/pe/guias/como-aprender-power-bi-en-peru) · [Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay) · [Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

**[CTA-END]** — En el curso Power BI en vivo de ProgramBI partimos de tus reportes de Excel: Power Query, modelo estrella, DAX y un tablero que se actualiza solo. 20 horas en vivo por Zoom, grabaciones de por vida y certificado.

##### Preguntas frecuentes

**¿Es más difícil Power BI que Excel?** Al principio, sí, por el modelado y DAX. Si dominas tablas dinámicas, la transición es mucho más rápida.
**¿Puedo usar Power BI sin Excel?** Sí, pero la mayoría de los datos de negocio vienen de Excel, así que conviven.
**¿Power BI es gratis?** Desktop es gratis en Windows. Compartir en la nube con otros normalmente requiere licencia Pro o capacidad de la empresa.
**¿Qué conviene aprender primero?** Excel intermedio y Power Query; luego Power BI.
**¿Power BI sirve para presupuestos?** Para mostrar presupuesto contra real, sí. Para construir el presupuesto con supuestos, Excel suele ser más cómodo.
**¿Cuántos datos aguanta Power BI?** Bastantes millones de filas en un equipo normal, gracias a la compresión; el límite depende de la memoria y de la licencia al publicar.

---

## 5. Piloto Claude (2 guías)

> Objetivo: probar si la demanda de «IA para el trabajo» trae tráfico y leads con el mismo formato. Enlazan a `/cursos/claude` y `/mx/cursos/claude`. Mismos componentes de CTA, eventos con `course=claude`. Regla: no prometer resultados de la IA; insistir en verificar.

### 5.1 CHILE — `/guias/como-usar-claude-para-analisis-de-datos`

- **Keywords:** cómo usar Claude para análisis de datos; Claude para Excel; IA para analizar datos; Claude vs ChatGPT para Excel; curso Claude Chile.
- **Title (54):** Cómo usar Claude para análisis de datos: guía práctica
- **Meta (154):** Prompts probados para limpiar planillas, resumir ventas y detectar anomalías con Claude, más los límites y cuidados de privacidad. Con ejemplos en pesos chilenos.
- **H1:** Cómo usar Claude para analizar datos en tu trabajo (sin programar)

#### Texto

Claude, el asistente de IA de Anthropic, puede leer una planilla, explicarte qué hay en ella, proponer fórmulas y detectar cosas raras en minutos. No reemplaza a un analista ni a Power BI, pero sí elimina buena parte del trabajo repetitivo que hay antes de llegar al análisis. Esta guía te muestra cómo usarlo bien: qué pedirle, cómo pedirlo y qué no delegarle nunca.

**[CTA-TOP]** — Próxima clase del curso Claude en vivo.

##### Qué puede hacer Claude con tus datos

- **Entender una planilla desconocida**: «¿Qué columnas tiene, qué significan y qué problemas ves?».
- **Limpiar**: detectar duplicados, fechas en formatos mezclados, montos escritos como texto.
- **Escribir fórmulas de Excel**: BUSCARX, SUMAR.SI.CONJUNTO o tablas dinámicas explicadas paso a paso.
- **Resumir y redactar**: convertir una tabla de resultados en un párrafo para gerencia.
- **Detectar anomalías**: «¿Qué sucursales se comportan distinto este mes?».
- **Preparar el terreno para Power BI**: proponer un modelo estrella o explicar una medida DAX.

##### Cómo pedirlo: estructura de un buen prompt

Un buen prompt tiene cinco partes: **contexto, tarea, formato, tono y restricciones**.

> *Contexto:* Soy analista de control de gestión en una cadena de farmacias con locales en Santiago, Valparaíso y Concepción. Te adjunto las ventas de octubre en CLP.
> *Tarea:* Identifica los 3 locales con mayor caída frente a septiembre y propone 2 hipótesis por local.
> *Formato:* Tabla con local, venta sep., venta oct., variación %, y luego las hipótesis en viñetas.
> *Tono:* Directo, para gerencia.
> *Restricciones:* No inventes datos que no estén en el archivo. Si algo no se puede calcular, dilo.

##### Cinco prompts que funcionan

1. **Diagnóstico**: «Revisa este archivo y lista problemas de calidad de datos: vacíos, duplicados, formatos inconsistentes. Para cada uno, dime cuántas filas afecta.»
2. **Fórmula**: «En la columna D tengo RUT y en la hoja Clientes, RUT y región. Dame la fórmula BUSCARX para traer la región y explícala.»
3. **Resumen ejecutivo**: «Resume esta tabla de ventas en 5 líneas para el gerente, destacando la mayor alza y la mayor caída.»
4. **Anomalías**: «Marca los días con ventas fuera de lo normal para cada local y explica el criterio que usaste.»
5. **Puente a Power BI**: «Propón un modelo estrella para estos datos: qué tabla es de hechos, qué dimensiones y qué relaciones.»

**[CTA-MID]** — Descarga la plantilla de prompts para análisis de datos.

##### Un caso completo, paso a paso: el informe mensual de ventas

Supongamos que cada mes recibes un Excel con las ventas de 40 locales en Santiago, Valparaíso y Concepción y tienes que entregar un informe a gerencia. Así se ve el flujo con Claude:

1. **Exploración (5 minutos).** Adjunta el archivo y pide: «Describe la estructura: columnas, tipo de dato de cada una, rango de fechas y totales por región. Señala cualquier cosa rara.» Claude suele detectar fechas en dos formatos, montos como texto («$1.234.567») o locales escritos de dos maneras.
2. **Limpieza guiada.** «Propón los pasos para limpiar estos problemas en Excel con Power Query, en orden. No modifiques los datos: solo dame los pasos.» Así el proceso queda repetible el próximo mes.
3. **Cálculo.** «Calcula la venta de octubre y septiembre por local y la variación porcentual. Muestra la tabla y explica cómo calculaste.» Luego verifica dos o tres locales a mano.
4. **Hallazgos.** «¿Qué 3 locales explican la mayor parte de la caída? Separa lo que se ve en los datos de lo que es hipótesis.»
5. **Redacción.** «Redacta un correo de 150 palabras para el gerente comercial con los hallazgos, en tono directo, sin adjetivos innecesarios.»
6. **Presentación.** Con Artifacts o Slides, pide una presentación de 4 láminas a partir del correo.

Lo que antes tomaba una tarde puede quedar en una hora, con la verificación incluida. La clave es que **tú defines las preguntas y revisas los números**.

##### Projects: que Claude conozca tu área

Si haces este informe todos los meses, crea un **Project** con los documentos de referencia: el glosario de tu área (qué es «venta neta», cómo se cuenta un local nuevo), el formato del informe y un ejemplo de mes anterior. Así no explicas el contexto cada vez y las respuestas son más consistentes. En el curso, el módulo 3 está dedicado a Projects, Artifacts, Docs y Slides.

##### Errores típicos al usar IA con datos

- **Pedir «analiza esto» sin una pregunta.** Recibes generalidades. Pregunta algo concreto.
- **No dar contexto de negocio.** Sin saber que diciembre es temporada alta, cualquier comparación con noviembre parece un milagro.
- **Aceptar un cálculo sin revisar.** Cuadra siempre al menos un total con tu fuente.
- **Subir más datos de los necesarios.** Si no necesitas el RUT o el nombre del cliente, quítalos antes.

##### Lo que no debes delegar

- **La verificación.** Claude puede equivocarse en cálculos o interpretar mal una columna. Cuadra siempre los totales con tu fuente.
- **Datos sensibles sin autorización.** Antes de subir datos de clientes o remuneraciones, revisa la política de tu empresa y el plan que usan (los planes empresariales tienen condiciones de privacidad distintas a las cuentas personales).
- **La decisión.** La IA propone hipótesis; la decisión es tuya y de tu equipo.

##### Claude y Power BI: cómo se complementan

Claude es excelente para la exploración inicial, la limpieza guiada y la redacción. Power BI es el lugar donde el reporte vive, se actualiza y se comparte. Un flujo práctico: explora y limpia con ayuda de Claude, modela y publica en Power BI, y vuelve a Claude para redactar el resumen del mes.

##### El curso Claude en vivo de ProgramBI

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Chile. Próximo inicio: **lunes 23 de noviembre de 2026**.
- **20 horas, 5 módulos** de 4 horas: primeros pasos y privacidad; prompting práctico; Projects, Artifacts, Docs y Slides; **Claude para Excel y tareas administrativas** (limpieza, fórmulas, tendencias y anomalías, conectores, Claude Cowork); y automatización ligera con proyecto final sobre un proceso real de tu trabajo.
- **Grabaciones de por vida** y **certificado**. Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]** — «Ver el curso Claude» (`/cursos/claude`) · WhatsApp.

##### Preguntas frecuentes

**¿Claude puede leer archivos de Excel?** Sí, puedes adjuntar planillas y pedirle análisis, resúmenes o fórmulas. Verifica siempre los resultados.
**¿Necesito saber programar?** No. El curso está pensado para trabajo administrativo y de análisis sin programar.
**¿Claude reemplaza a Power BI?** No. Claude ayuda a explorar y redactar; Power BI publica reportes que se actualizan y se comparten.
**¿Es seguro subir datos de la empresa?** Depende del plan y de la política de tu empresa. En el curso vemos planes y privacidad en el primer módulo.
**¿Qué diferencia a Claude de otras IA?** En el curso lo comparamos en el módulo 1; para análisis, lo importante es aprender a pedir bien y verificar, sea cual sea la herramienta.
**¿A qué hora son las clases?** Lunes y miércoles de 19:30 a 21:30, hora de Chile, con grabaciones.

### 5.2 MÉXICO — `/mx/guias/como-usar-claude-para-analisis-de-datos`

- **Keywords:** cómo usar Claude para análisis de datos México; Claude para Excel; inteligencia artificial para reportes; curso Claude México.
- **Title (49):** Cómo usar Claude para análisis de datos en México
- **Meta (153):** Prompts listos para conciliar reportes, limpiar bases de clientes y explicar variaciones con Claude. Ejemplos en pesos mexicanos y cuidados de privacidad.
- **H1:** Claude para análisis de datos: guía práctica para equipos en México

#### Texto

En muchas oficinas de México el cierre de mes significa lo mismo: conciliar reportes de distintas áreas, explicar por qué no cuadra una cifra y preparar la presentación para la dirección. Claude, el asistente de IA de Anthropic, no hace el cierre por ti, pero sí te ahorra horas en las tareas que lo rodean. Esta guía va directo a los usos que más tiempo liberan en equipos de finanzas, administración y comercial.

**[CTA-TOP]**

##### Tres usos con impacto inmediato

**1. Conciliar dos reportes.** Sube el reporte de ventas del ERP y el de facturación, y pide: «Compara ambos por número de factura. Lista las facturas que están en uno y no en el otro, y las que tienen importes distintos en MXN. Al final, dame el total de diferencias.» Luego valida una muestra a mano.

**2. Limpiar una base de clientes.** «Esta base tiene clientes repetidos con distintas escrituras de la razón social (por ejemplo, con y sin "S.A. de C.V."). Propón una regla para unificarlos y muéstrame los casos dudosos en una tabla.»

**3. Explicar variaciones.** «Te adjunto ventas por CEDIS (CDMX, Guadalajara, Monterrey) de septiembre y octubre. Explica en 6 líneas para la dirección qué cambió y qué datos adicionales necesitaría para confirmar las causas.»

##### El método: contexto, tarea, formato, tono y restricciones

Claude responde mucho mejor cuando sabe quién eres, qué necesitas y en qué formato. Agrega siempre una restricción clave: **«No inventes datos; si falta información, dímelo.»** Y pide que muestre el criterio que usó, para que puedas revisarlo.

**[CTA-MID]** — Descarga la plantilla de prompts para cierres de mes.

##### De Claude a Excel y Power BI

- Pide fórmulas de Excel explicadas («dame la fórmula y explícame cada argumento»).
- Pide que convierta una explicación en una tabla lista para pegar.
- Si tu empresa usa Power BI, pídele que te explique una medida DAX existente en lenguaje simple antes de modificarla.

##### Caso completo: el paquete de cierre para la dirección

Un equipo de finanzas en Monterrey debe entregar cada mes el comparativo de gastos por centro de costos contra presupuesto. Así se ve el flujo con Claude:

1. **Ordenar.** Adjunta la balanza o el reporte de gastos y pide: «Agrupa estas cuentas en las categorías de este catálogo (te lo adjunto). Lista las cuentas que no sepas clasificar.» Nunca dejes que adivine una clasificación contable: que te pregunte.
2. **Comparar.** «Calcula real contra presupuesto por centro de costos en MXN y en %. Marca las desviaciones mayores a 10 %.»
3. **Explicar.** «Para cada desviación marcada, redacta una línea con la explicación que dan los comentarios del archivo. Si no hay comentario, escribe "pendiente de explicar".» Así no se inventan causas.
4. **Presentar.** «Convierte esto en 3 láminas: resumen, desviaciones principales y acciones.» Con Slides o Artifacts tienes el borrador en minutos.
5. **Revisar.** Cuadra el total de gastos con la contabilidad antes de enviar.

##### Prompts listos para copiar

- **Formato de fechas y montos**: «Este archivo mezcla fechas mm/dd/aaaa y dd/mm/aaaa y montos con y sin comas. Dime qué filas tienen cada formato y cómo unificarlas en Excel.»
- **Comparativo de proveedores**: «Compara estas tres cotizaciones en una tabla: precio unitario en MXN, IVA, tiempo de entrega y condiciones de pago. Señala lo que no sea comparable.»
- **Minuta**: «A partir de estas notas desordenadas de la junta, redacta una minuta con acuerdos, responsables y fechas. No agregues acuerdos que no estén en las notas.»
- **Fórmula explicada**: «Necesito una fórmula que sume las ventas de la región Norte en el trimestre. Dámela con SUMAR.SI.CONJUNTO y explica cada argumento.»
- **Revisión de un reporte**: «Revisa este reporte como si fueras el director financiero: ¿qué preguntas me haría y qué cifras se ven inconsistentes?»

##### Projects para equipos

Si varias personas del área hacen tareas parecidas, un **Project** con el catálogo de cuentas, las políticas de gastos y un ejemplo de cierre anterior hace que todos obtengan respuestas consistentes. Es uno de los temas del módulo 3 del curso.

##### Lo que conviene acordar con TI

Antes de usar Claude con datos de la empresa, confirma con tu área de TI o de cumplimiento qué tipo de cuenta usar, qué datos se pueden subir y qué no (datos personales de clientes y empleados, por ejemplo). En el módulo 1 del curso vemos planes y privacidad para empresas, y en el módulo 5, seguridad, verificación y uso responsable.

##### Errores típicos

- **Pedir conclusiones sin datos suficientes.** Exige que diga qué le falta.
- **Pegar tablas enormes en el chat.** Mejor adjunta el archivo.
- **No guardar el prompt que funcionó.** Arma tu biblioteca de prompts del área; el curso te deja plantillas reutilizables.

##### Cuidados que no son opcionales

- **Verifica totales** contra el sistema antes de enviar cualquier cosa.
- **Datos personales**: antes de subir bases con datos de clientes, revisa la política de tu empresa y el tipo de cuenta que usan.
- **Trazabilidad**: guarda el prompt y la versión del archivo que usaste.

##### El curso Claude en vivo de ProgramBI (versión México)

- **En vivo por Zoom**, lunes y miércoles de **16:30 a 18:30, hora de México**. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Precio para México: **{precio_local}** (hoy $2,190 MXN según la ficha).
- **20 horas, 5 módulos**: primeros pasos y privacidad; prompting práctico; Projects, Artifacts, Docs y Slides; Claude para Excel y tareas administrativas; automatización ligera y proyecto final con un proceso real de tu trabajo.
- **Grabaciones de por vida** y **certificado**. Instructor: **Manuel Oliva**.

**[CTA-END]** — «Ver el curso Claude» (`/mx/cursos/claude`) · WhatsApp.

##### Preguntas frecuentes

**¿A qué hora son las clases en México?** Lunes y miércoles de 16:30 a 18:30, hora del centro de México.
**¿Cómo pago desde México?** Con tarjeta internacional; el precio se muestra en MXN y el cargo final lo define tu banco.
**¿Sirve si no sé nada de IA?** Sí. El curso parte desde crear la cuenta y la primera conversación.
**¿Puedo usar Claude con archivos del trabajo?** Sí, con los cuidados de privacidad que defina tu empresa; lo vemos en el módulo 1.
**¿Claude hace fórmulas de Excel?** Sí, y las explica. Revisa siempre el resultado con un caso conocido.
**¿Queda grabado?** Sí, todas las clases quedan en el campus de por vida.

---

## 6. Plan de medición (4–6 semanas) y criterios para escalar

**Semana 0 (publicación):** enviar el sitemap actualizado a Search Console e inspeccionar las 11 URLs (solicitar indexación). Anotar fecha de publicación de cada guía.

**Qué medir (GA4 + GSC), por guía:**
| Métrica | Fuente | Umbral «funciona» a 6 semanas |
|---|---|---|
| Indexada | GSC > Inspección | Sí, antes de la semana 2 |
| Impresiones | GSC > Rendimiento, filtro página | ≥ 300 acumuladas |
| Posición media para su keyword principal | GSC | ≤ 20 y mejorando |
| CTR | GSC | ≥ 2 % |
| Sesiones con landing = guía | GA4 > Páginas de destino | Tendencia creciente semana a semana |
| Tasa de interacción | GA4 | ≥ 55 % |
| Conversiones (click_whatsapp + click_registro + generate_lead) / sesiones | GA4, filtro `page_type=guia` | ≥ 3 % |
| Visitas desde asistentes de IA (chatgpt.com, perplexity.ai, gemini) | GA4 > Fuente | Cualquier sesión es señal positiva |

**Revisión semana 3:** ajustar títulos y metas de las guías con impresiones pero CTR < 1 %. Revisar consultas reales en GSC y agregar a la FAQ las 2–3 preguntas que aparezcan y no estén cubiertas.

**Revisión semana 6 — decisión:**
- **Escalar a SQL, Excel y Python** (mismo formato «cómo aprender X en {país}») si **al menos 4 de las 7 guías de país** cumplen impresiones y posición, **y** el clúster suma ≥ 10 conversiones.
- Escalar **primero en los países ganadores** (los que cumplan), no en los 7.
- Si las transversales superan a las de país, priorizar más transversales («funciones SQL más usadas», «Excel avanzado: fórmulas clave»).
- **Piloto Claude:** se escala (Copilot, otros países) si cualquiera de las 2 guías llega a ≥ 200 impresiones y ≥ 3 conversiones.
- Si nada cumple: revisar indexación, interlinking y si el contenido realmente responde la intención de búsqueda antes de producir más.

---

## 7. Checklist de aceptación (el LLM debe marcar cada punto)

**Contenido**
- [ ] Las 11 guías publicadas con el texto de este archivo, sin resumir ni reescribir el sentido. Correcciones de estilo menores permitidas.
- [ ] Ninguna cifra nueva sin fuente y link. No se agregaron testimonios, rankings ni estadísticas inventadas.
- [ ] Precios leídos del mismo origen de datos que la ficha (no escritos en duro). Horarios coinciden con la ficha de cada país.
- [ ] Texto compartido entre dos guías de país < 30 % (reportar el porcentaje medido).
- [ ] Fecha «Actualizado» visible.

**SEO técnico**
- [ ] `title` ≤ 60 caracteres y único; meta 140–160; un solo H1.
- [ ] `canonical` propio; hreflang recíprocos entre las 7 guías de país (+ `x-default`) y entre las 2 de Claude; transversales sin alternates.
- [ ] `<html lang>` correcto por país.
- [ ] JSON-LD `Article` + `FAQPage` + `BreadcrumbList` válido (probar en Rich Results Test); FAQ del schema idéntica a la visible.
- [ ] Rutas en sitemap con `lastmod`; respuesta 200; indexables; añadidas a `/llms.txt`.
- [ ] Índices `/guias` y `/{pais}/guias` creados.

**Enlaces y conversión**
- [ ] Cada guía de país enlaza a su landing `/{pais}/curso-power-bi`, a su ficha, a las 2 transversales y al índice.
- [ ] Landing, ficha y footer de cada país enlazan de vuelta a su guía.
- [ ] CTA top, mid y end presentes; barra fija en mobile.
- [ ] `href` de WhatsApp con `?text=` (país + guía) presente en el HTML del servidor.
- [ ] Formulario de plantilla: solo email; guarda en Supabase vía `/api/leads-magnet`.

**Medición**
- [ ] `click_whatsapp`, `click_registro` y `generate_lead` se disparan en DebugView con `country`, `page_type=guia`, `guide_slug`, `cta_position` (y `lead_type=plantilla` en el lead). Sin `_dbg`.

**Paraguay**
- [ ] Decisión aplicada: `/py/` mínima con precio en USD (monto confirmado por Manu) **o** guía en `/guias/como-aprender-power-bi-en-paraguay` sin precio. Nunca `/py/` vacío indexado.

**Entrega**
- [ ] Build y TypeScript sin errores. Rama propia (por ejemplo `contenido/guias-power-bi`), sin merge ni push a `main`. Reportar rama, hash, URLs de preview y lista de lo hecho y lo pendiente en `PLAN_MEJORAS.md`.

---

## 8. Corrección de precios (hacer ANTES de publicar las guías)

### 8.1 Contradicción detectada (verificada con curl en www.programbi.com, 4 nov 2026, ~00:20 hora de Chile)

| URL | JSON-LD `Offer` | Texto visible / props |
|---|---|---|
| `/cursos/power-bi` | `price: 249000`, `CLP` | precio visible solo tras registrarse |
| `/cursos/sql-server` | `249000 CLP` | ídem |
| `/cursos/claude` | `249000 CLP` | ídem |
| `/mx/cursos/power-bi` | `2190 MXN` | «$2,190 MXN · Se cobra en CLP» |
| `/co/cursos/power-bi` | `299900 COP` | «$299.900 COP · Se cobra en CLP» |
| `/ar/cursos/power-bi` | `159900 ARS` | «$159.900 ARS · Se cobra en CLP» y «Se cobra en pesos chilenos (CLP $169.000), equivalente aprox.» |
| `/pe/cursos/power-bi` | `349 PEN` | «S/349.00 PEN · Se cobra en CLP» |
| `/uy/cursos/power-bi` | `5990 UYU` | «$5.990 UYU · Se cobra en CLP» |
| `/ar/cursos/sql-server` | `159900 ARS` | mismo texto |

Problemas:
1. **Dos precios base distintos**: las fichas extranjeras dicen que se cobran **CLP 169.000**, pero la oferta de Chile declara **CLP 249.000** para el mismo curso. Un chileno y un extranjero ven/declaran montos incompatibles, y Google recibe un `Offer` de Chile que no coincide con lo que se cobra fuera.
2. **Mismo precio para todos los cursos**: los props serializados muestran el mismo monto local para copilot, claude, excel, access, python, sql-server, machine-learning, power-automate e ia-productividad. Si los cursos tienen precios distintos, hoy está mal; si es intencional, documentarlo.
3. **«Se cobra en CLP»** junto al precio local genera desconfianza y contradice el precio mostrado.
4. Paraguay no tiene precio (no existe `/py/`).

> **Decisión pendiente de Manu (bloqueante):** ¿cuál es el precio real en Chile del curso Power BI y de cada curso: 249.000 o 169.000 CLP (u otro)? ¿Los precios locales de cada país son fijos (tabla) o derivados del CLP por tipo de cambio? Hasta que responda, **no** cambiar montos: solo unificar la fuente.

### 8.2 Tarea técnica: una sola fuente de verdad
- Crear `config/pricing.ts` (o tabla `course_prices` en Supabase si ya hay precios en BD) con la forma:
  `{ [courseSlug]: { [country: 'cl'|'mx'|'co'|'ar'|'pe'|'uy'|'py']: { listPrice: number, price: number, currency: 'CLP'|'MXN'|'COP'|'ARS'|'PEN'|'UYU'|'USD', chargeCurrency: string, chargeAmount: number } } }`
- **Todo** lo que muestra o declara precio lee de ahí: tarjeta de precio de la ficha, tarjetas «Otros cursos», landings `/{pais}/curso-*`, bloque CTA-END de las guías, JSON-LD `Offer` (`price`, `priceCurrency`), `llms.txt` y el checkout (monto que se envía a la pasarela).
- Buscar y eliminar montos en duro: `rg -n "169\.?000|249\.?000|159\.?900|299\.?900|2,?190|5\.?990|349" src app components lib`.
- El JSON-LD `Offer` debe declarar el **precio que ve el usuario de ese país** en su moneda; `validFrom` no debe regenerarse en cada request (hoy cambia en cada carga): usar una fecha fija de vigencia del precio.

### 8.3 Texto visible
- Quitar «Se cobra en CLP» y «Se cobra en pesos chilenos (CLP $…), equivalente aprox.» de al lado del precio.
- Dejar bajo el botón de pago una nota pequeña (12–13 px, gris): «Pagas con tarjeta internacional; el cargo final lo define tu banco.» Si el cobro efectivamente es en CLP, se puede añadir en la misma nota: «El cobro se procesa en pesos chilenos.» (sin monto, para no contradecir).

### 8.4 Paraguay
- Precio de `/py/` en **USD**: **DECISIÓN PENDIENTE DE MANU. No inventar monto.** Mientras no haya monto: la ficha/guía de Paraguay muestra «Consulta el valor por WhatsApp» y el JSON-LD **no** incluye `Offer`.

### 8.5 Criterios de aceptación
- [ ] `rg` no encuentra montos de precio en duro fuera de `config/pricing.ts` (o la tabla).
- [ ] Para cada curso × país, el monto visible = `Offer.price` del JSON-LD = monto enviado al checkout (test automático que recorre la config y compara con el HTML renderizado de cada ficha).
- [ ] No aparece «Se cobra en CLP» junto al precio en ninguna ficha (`curl … | grep -c "Se cobra en"` = 0 en las 6 fichas de país).
- [ ] La nota bajo el botón de pago está presente en las fichas de país.
- [ ] Chile muestra/declara el precio que Manu confirme.
- [ ] `/py/` sin `Offer` mientras no haya monto aprobado.
- [ ] `validFrom` estable entre dos cargas.

---

## Anexo — Fuentes consultadas (4 nov 2026)
- Chiletrabajos, sueldos analista BI: https://www.chiletrabajos.cl/sueldos/analista/bi
- Indeed Chile, analista BI: https://cl.indeed.com/career/analista-bi/salaries
- Chiletrabajos, aviso 3787550 (expirado): https://www.chiletrabajos.cl/trabajo/analista-power-bi-san-bernardo-3787550
- PL-300 (precio según país, se ve al registrarse): https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
- OCC, data analyst: https://www.occ.com.mx/empleos/de-data-analyst/
- Computrabajo Colombia: https://co.computrabajo.com/salarios/analista-de-datos · https://co.computrabajo.com/trabajo-de-analista-de-datos
- Instituto IEA sobre Sysarmy 2026.1: https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana
- Computrabajo Perú: https://pe.computrabajo.com/salarios/analista-de-datos
- El País Uruguay, llamado MEF: https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026
- Paraguay: sin fuente confiable de sueldo → se omitió la cifra.


**Verificación de fuentes (4 nov 2026):** abiertas y confirmadas: Chiletrabajos sueldos y aviso, Indeed Chile (cifra actualizada a $1.035.380), OCC (rangos), Computrabajo Colombia (actualizada a $2.416.855) y Perú, Instituto IEA/Sysarmy, El País Uruguay. **Quitadas** por no poder confirmarlas: Indeed México (403), avisos individuales de Computrabajo Colombia y Perú. PL-300: no se publica monto (Microsoft lo fija por país y fuentes de terceros se contradicen). Comunidades/meetups: no se nombran grupos específicos porque no se verificó su actividad; se remite al foro oficial y a búsqueda por ciudad.
