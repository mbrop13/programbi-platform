# Plan EE.UU. / Miami — ProgramBI

Fecha: 16 nov 2026. Solo análisis y planificación: no se tocó código.

## 1. Resumen

La plataforma ya tiene casi todo el andamiaje para sumar un país (carpeta por URL, precios fijos por mercado, hreflang recíproco, sitemap, contenido local, `llms.txt`). Agregar `/us` es barato en lo técnico. Lo que hoy **impide vender en EE.UU.** no es el SEO sino cuatro cosas:

1. **EE.UU. no existe como mercado**: `/us` da 404 y un visitante de Miami ve la versión chilena (CLP, «hora de Chile», WhatsApp +56).
2. **El cobro**: todo pasa por Mercado Pago Chile en pesos chilenos. Un estadounidense con tarjeta de EE.UU. pagando en CLP es fricción, rechazos y desconfianza.
3. **Arbitraje de precios**: nada impide que alguien en Miami compre en `/ve` a USD 69. Con un precio EE.UU. más alto, este hueco se vuelve caro.
4. **Cero contenido propio para EE.UU.**: sin él, `/us` sería una copia de Chile con otra moneda, justo lo que ya se decidió dejar en `noindex` para los países secundarios.

La oportunidad es real: más de 60 millones de hispanos en EE.UU., Miami-Dade con cerca de 70 % de población hispana, y la clase de 19:30 de Chile cae entre **17:30 y 19:30 hora de Miami** según la época del año, es decir, justo a la salida del trabajo.

## 2. Cómo está hoy (diagnóstico)

| Tema | Estado actual | Dónde |
|---|---|---|
| Países | 17 mercados. Chile en raíz, el resto en `/xx`. EE.UU. no está en `PAISES`. | `config/paises.ts` |
| `us` «fantasma» | Existe solo en el conversor viejo (CLP × 0,00105), no en la config real. | `lib/context/CountryContext.tsx:109` |
| Detección de país | Cookie `pb_geo_country` → localStorage → zona horaria → Chile. **Nadie escribe esa cookie** (el proxy no la emite) y las zonas de EE.UU. no están mapeadas. Resultado: EE.UU. = Chile. | `lib/paises/cliente.ts`, `lib/paises/horarios.ts:109`, `proxy.ts` |
| Redirección por IP | No hay, por diseño. Correcto: Googlebot rastrea desde IPs de EE.UU. | `docs/dominios-paises.md` |
| hreflang | Recíproco entre indexables, `x-default` → Chile. Falta `es-US`. | `lib/paises/rutas.ts:107` |
| Indexabilidad | Regla clara: variante > 70 % igual a Chile y sin clics → `noindex`. | `lib/paises/indexabilidad.ts` |
| Contenido local | Solo AR, MX, PE, CO, UY tienen hero, casos por industria, FAQ y SEO propios. | `lib/data/contenido-paises/` |
| Cobro USD | `usd-chile`: muestra USD pero cobra en CLP (USD × 900) con la cuenta de Chile. | `app/api/mp/create/route.ts:220` |
| Anti-arbitraje | No existe. El precio lo fija la carpeta de la URL; el checkout no mira el país de la IP ni de la tarjeta. | `app/api/mp/create/route.ts:194` |
| Horarios | Una sola zona por país. EE.UU. tiene cuatro. | `config/paises.ts` (`zonaHoraria`) |
| Organización (JSON-LD) | «para Latinoamérica», teléfono +56, LinkedIn `cl.`, sin `areaServed`. | `components/shared/RootShell.tsx:33` |
| Empresas | `Service` con `areaServed` por país; copy y FAQ pensados para Chile (factura chilena, SENCE en 7 archivos). | `app/(marketing)/empresas/page.tsx` |
| IA | `robots.ts` permite GPTBot, ClaudeBot, Perplexity, etc. `llms.txt` y `llms-full.txt` se generan desde config; la matriz de precios cubre CL, AR, MX, PE, CO, UY. | `app/robots.ts`, `lib/llms/contenido.ts:71` |
| Prueba social | Logos mayormente chilenos; hay varios reconocibles en EE.UU. (Deloitte, Bridgestone, Anglo American, Midea, Verisure). | `lib/data/site.ts` |
| Catálogo | 13 cursos. «Analítica minería» no tiene sentido en Miami. | `config/paises.ts:9` |
| Cifras | `llms.txt` afirma «+5.000 estudiantes, 4.9/5»; `docs/seo-gsc.md` dice que esas cifras no van en money pages. Hay que alinear antes de EE.UU. | `lib/llms/contenido.ts:32` |

## 3. Estrategia de posicionamiento

**A quién**: profesionales hispanohablantes en EE.UU. (finanzas, operaciones, logística, administración) y empresas con equipos que trabajan en español, empezando por el sur de Florida.

**Promesa**: clases en vivo de Power BI, Excel, SQL, Python e IA **en español**, con profesor real, en horario de la tarde de Miami, a una fracción del precio de un curso presencial o en inglés.

**El hallazgo clave de SEO**: en Latinoamérica el modificador de búsqueda es el país («curso power bi México»). En EE.UU. es el **idioma** y la **ciudad**:

- «curso de power bi en español», «clases de excel en español», «curso de python en español online»
- «cursos de power bi en miami», «clases de excel miami en español»
- En inglés, quien compra para un equipo: «power bi training in spanish», «spanish excel training for employees»

Por eso el patrón actual `conPais()` («… en Estados Unidos») no sirve para EE.UU.: los títulos deben escribirse a mano con «en español» y, donde corresponda, «Miami».

**Ángulos que solo aplican a EE.UU.** (diferencian el contenido y evitan el duplicado):

- **Reembolso del empleador**: muchas empresas de EE.UU. reembolsan formación (asistencia educativa, hasta USD 5.250 al año libres de impuesto para el empleado). Ofrecer recibo en USD y carta de descripción del curso es un argumento de venta fuerte.
- **Sedes regionales LATAM en Miami**: equipos que reportan a casa matriz y trabajan en español.
- **Industrias locales**: logística y comercio exterior (puerto y aeropuerto de Miami), hotelería y turismo, bienes raíces, salud, construcción, banca privada internacional, retail.
- **Datos públicos de EE.UU. en los ejercicios**: Census Bureau, BLS, FRED, SEC EDGAR. Fuentes de empresa: QuickBooks, Salesforce, ADP, NetSuite (en vez de SII/ERP chileno).
- **Certificación Microsoft PL-300**: es lo que reconoce un empleador estadounidense. Ya existe la guía `certificacion-pl-300-power-bi`.

## 4. Plan por fases

### Fase 0 — Decisiones tuyas (bloquean el resto)

1. **Precio en USD.** Hoy el techo en USD es 149 (Costa Rica y Panamá). Propuesta de partida: curso estándar USD 249–299, Análisis de datos USD 499–549. Antes de fijarlo, comparar 5–8 competidores en EE.UU. (cursos en vivo en inglés y academias en español).
2. **Cómo cobrar.** Mercado Pago no opera en EE.UU. Opciones, de más rápida a mejor:
   - PayPal en USD desde Chile (días; conocido en EE.UU.).
   - Stripe con una LLC en EE.UU.: tarjeta, Apple Pay, Google Pay, ACH y pago en cuotas (Affirm/Klarna), que reemplaza las «cuotas sin interés».
   - Un «merchant of record» que se encargue del impuesto a las ventas; hay que confirmar que acepten cursos en vivo.
   Confirmar disponibilidad y costos antes de elegir; yo no puedo verificarlo desde el código.
3. **Impuestos y facturación**: validar con contador el impuesto a las ventas por estado, el formulario W-8BEN-E para clientes empresa y la factura en USD.
4. **Contacto**: número +1 (WhatsApp Business o línea virtual) y correo `@programbi.com` en lugar de `.cl`.
5. **Precio tachado**: en EE.UU. el precio «normal» debe haberse ofrecido de verdad (reglas de la FTC). Decidir si `/us` muestra tachado o solo precio final.
6. **Cifras públicas**: definir qué números se pueden sostener con evidencia (alumnos, valoración) y usar los mismos en todo el sitio.

### Fase 1 — Base técnica de `/us`

- Entrada `us` en `PAISES`: `es-US`, USD, locale `es-US`, 2 decimales, «computadora», sin voseo, `America/New_York`, medios de pago propios, contacto propio.
- Nuevo modo de pago (por ejemplo `usd-directo`) para no caer en el cobro en CLP; ajustar `resolverCobro` y el checkout.
- **Anti-arbitraje** en `/api/mp/create` (y en el nuevo cobro): si la IP es de EE.UU. y la carpeta es otra, cobrar el precio de EE.UU. o bloquear. Usar `x-vercel-ip-country` solo en el servidor del checkout.
- **Sugerencia de país sin redirigir**: mapear zonas de EE.UU. (`America/New_York`, `Chicago`, `Denver`, `Los_Angeles`, `Phoenix`…) a `us` y mostrar un aviso cerrable «¿Estás en Estados Unidos? Ver precios en USD y horario del Este». Nunca redirección automática por IP: rompería la indexación de Chile.
- Horarios: etiqueta «hora del Este (ET, Miami)» y, en fichas, equivalencia Central y Pacífico. Hoy el `default` diría «hora de Estados Unidos (UTC-5)».
- hreflang `es-US` en todas las rutas indexables de `/us`; `x-default` sigue en Chile. Con esto Google ya entrega `/us` a quien busca en español desde EE.UU.
- Limpiar el `us` viejo de `CountryContext` para que no haya dos fuentes de verdad.
- Ocultar en `/us` lo que no aplica: curso de minería, menciones a SENCE, Webpay, «factura» chilena, «Santiago» como único contacto.
- Añadir `us` a los redirects por país de `vercel.json`, a `PAISES_DESTACADOS` del sitemap y a los scripts `check-paises` y `check-sitemap`.
- Nacer con `indexable: false` hasta que la Fase 2 esté publicada; luego encender.

### Fase 2 — Contenido propio de EE.UU. (lo que hace que quede «increíble»)

Crear `lib/data/contenido-paises/us.ts` y su bloque local, con texto escrito para EE.UU., no adaptado:

- **Home `/us`**: H1 tipo «Cursos de datos e IA en vivo y en español para profesionales en Estados Unidos». Nota bajo el hero: «Clases en vivo · Horario de la tarde en Miami (ET) · Precios en USD».
- **Casos por industria** (4–6): logística y comercio exterior, hotelería, bienes raíces, salud, construcción, banca y finanzas.
- **Referencias**: Census, BLS, FRED, SEC en lugar de SII/INE.
- **Fichas de curso**: título y descripción propios por curso, con «en español». Bloque «Pide el reembolso a tu empleador» con el recibo y la carta. Bloque PL-300 en Power BI.
- **`/us/empresas`**: «Capacitación en Power BI, Excel e IA en español para empresas de EE.UU.». Propuesta para equipos hispanohablantes, factura en USD, W-8BEN-E, pago por ACH o tarjeta, sesiones en ET/CT/PT. FAQ de empresas propia.
- **`/us/precios`, `/us/faq`, `/us/nosotros`**: propias. FAQ con las preguntas reales de EE.UU.: ¿el certificado es válido en EE.UU.?, ¿puedo pedir reembolso a mi empresa?, ¿a qué hora es en Miami / Texas / California?, ¿en qué idioma es el software?, ¿cómo pago?, ¿qué pasa si falto?
- **Prueba social**: en `/us`, ordenar los logos poniendo primero las marcas globales. Testimonios de alumnos que vivan en EE.UU. en cuanto existan (no inventar).
- **Formato**: montos `$1,299.00`, fechas con el mes en palabras (evita la confusión MM/DD), teléfono +1.
- **Meta de calidad**: cada página de `/us` por debajo del 70 % de similitud con Chile, la misma vara que ya usa `indexabilidad.ts`.

### Fase 3 — SEO en EE.UU.

1. **Línea base**: en Search Console, filtrar país = Estados Unidos y ver qué consultas ya traen impresiones. Es gratis y dice por dónde empezar.
2. **Mapa de palabras clave** (validar volumen con Keyword Planner, ubicación EE.UU., idioma español):

| Intención | Consultas tipo | Página |
|---|---|---|
| Curso + idioma | curso de power bi en español, curso excel en español online | `/us/cursos/<curso>` |
| Catálogo | cursos de análisis de datos en español estados unidos | `/us/cursos` |
| Ciudad | cursos de power bi en miami, clases de excel miami | `/us/miami` (nueva) |
| Empresa (ES) | capacitación power bi para empresas en miami | `/us/empresas` |
| Empresa (EN) | power bi training in spanish, spanish excel training | página en inglés (nueva) |
| Certificación | certificación pl-300 en español | guía existente + versión EE.UU. |
| Carrera | cómo ser analista de datos en estados unidos | guías nuevas |
| Comparación | mejores cursos de power bi en español 2026 | guía-ranking EE.UU. |

3. **Página Miami**: una sola, con contenido real (industrias, horario, empresas, preguntas locales). Otras ciudades (Houston, Nueva York, Los Ángeles, Orlando, Dallas) solo si Miami muestra tracción; diez páginas iguales cambiando el nombre son «doorway pages» y Google las penaliza.
4. **Página B2B en inglés**: quien aprueba la compra en RR.HH. suele buscar en inglés. Una landing «Power BI & Excel training in Spanish for your team». Ojo técnico: `proxy.ts` redirige cualquier `/en/...`, y el `<html lang>` lo fija el layout del país, así que necesita ruta y layout propios.
5. **Guías EE.UU.** siguiendo `docs/PLANTILLA_GUIAS.md`: aprender Power BI en español en EE.UU., reembolso del empleador para cursos, PL-300 paso a paso, salarios de analista de datos según BLS, Excel a Power BI para pymes.
6. **Comparativas**: ya existe el patrón `versus/` (Coderhouse). Para EE.UU.: frente a plataformas grabadas (Coursera, Udemy, LinkedIn Learning) y frente a bootcamps en inglés, con criterios objetivos y precios con fecha.
7. **Datos estructurados**: `Course` con `inLanguage: es-US`, `Offer` en USD, `areaServed: United States`; `Service` en empresas; `FAQPage` y `BreadcrumbList`. La base ya está en `lib/seo/course-jsonld.ts`.
8. **Sin ficha de Google Business en Miami**: sin oficina o atención presencial no corresponde, y una dirección falsa arriesga la suspensión. La señal local se construye con contenido y enlaces.

### Fase 4 — Que las IA recomienden ProgramBI en EE.UU.

En el sitio:

- `llms.txt` y `llms-full.txt`: sumar `us` a `MERCADOS_MATRIZ`, cambiar el resumen a «para Latinoamérica y para hispanohablantes en Estados Unidos», añadir una sección EE.UU. con precio en USD, horario ET, forma de pago y enlaces.
- JSON-LD de organización: `areaServed` con EE.UU., segundo `contactPoint` (+1), descripción que nombre EE.UU.
- Respuestas directas y citables en las páginas: «¿Cuánto cuesta un curso de Power BI en español en EE.UU.?» con el monto, la duración y el horario en la primera frase. Los asistentes citan frases autosuficientes, no párrafos de marketing.
- Una página «ProgramBI en datos» con hechos verificables y fecha (año de fundación, cursos, horas, profesores con credenciales).
- IndexNow ya existe (`app/api/indexnow`): usarlo para `/us`. Dar de alta el sitio en Bing Webmaster Tools; la búsqueda de ChatGPT se apoya en Bing.

Fuera del sitio (pesa más que lo anterior):

- Reseñas en una plataforma que EE.UU. reconozca (Trustpilot o similar), pidiendo opinión a alumnos reales.
- Presencia donde los modelos leen: YouTube en español (clases cortas con transcripción), LinkedIn, respuestas útiles en Reddit y foros de Power BI/Excel.
- Aparecer en listas de terceros de «mejores cursos de Power BI en español».
- Un estudio propio con datos públicos (por ejemplo, demanda de habilidades de datos entre profesionales hispanos en EE.UU.): los medios lo enlazan y los asistentes lo citan.

### Fase 5 — Autoridad local

- Cámaras y asociaciones: cámaras de comercio latinas del sur de Florida, asociaciones de profesionales venezolanos, colombianos, cubanos y argentinos, grupos de ex alumnos.
- Webinar o clase gratis mensual en horario ET (ya existen `/clase-gratis` y `/webinar`), con registro propio para EE.UU.
- Alianzas con consultoras y estudios contables hispanos de Miami que necesiten capacitar clientes.
- Enlaces desde sitios `.com`, `.org` y `.edu` de EE.UU.: valen más para este mercado que diez enlaces chilenos.

### Fase 6 — Medición

- Search Console: filtro por país EE.UU. y por carpeta `/us/`; clics no de marca, posición de 10–15 consultas objetivo.
- Analítica: segmento EE.UU., conversión a lead y a pago por estado y ciudad.
- IA: una vez al mes, las mismas 10 preguntas en ChatGPT, Claude, Perplexity y Gemini («mejor curso de Power BI en español en Miami»…), anotando si aparece ProgramBI y qué fuente citan.
- Checkout: tasa de aprobación de pagos con tarjeta de EE.UU. (hoy es el dato más importante y no se mide por país).

## 5. Riesgos y qué no hacer

- No redirigir por IP a `/us`: Google rastrea desde EE.UU. y vería `/us` en lugar de Chile.
- No publicar `/us` como copia de Chile con otra moneda: quedaría como contenido duplicado.
- No fabricar páginas por ciudad en serie.
- No inventar alumnos, cifras, sedes ni acreditaciones estadounidenses. El certificado es de ProgramBI; el reconocimiento externo es la PL-300 de Microsoft.
- No lanzar campañas hasta que el cobro en USD funcione de punta a punta con una tarjeta de EE.UU.
- Lo legal (impuestos, términos, privacidad, consentimiento para WhatsApp y correo) necesita revisión profesional; aquí solo queda señalado.

## 6. Orden recomendado

| Semana | Entregable |
|---|---|
| 1 | Decisiones de la Fase 0. Línea base en Search Console. Benchmark de precios. |
| 2 | Fase 1: `/us` en `noindex`, precios, horarios, aviso de país, anti-arbitraje. |
| 3 | Cobro en USD funcionando y probado con tarjeta de EE.UU. |
| 3–4 | Fase 2: home, fichas, empresas, precios, FAQ y nosotros de EE.UU. Encender indexación. |
| 5–6 | Página Miami, página B2B en inglés, 3 guías, `llms.txt`, JSON-LD, Bing e IndexNow. |
| 7–12 | Comparativas, ranking, reseñas, YouTube, alianzas en Miami, estudio con datos. |
| Mensual | Revisión de Search Console, panel de preguntas a las IA y tasa de aprobación de pagos. |

Expectativa realista: el SEO en un mercado nuevo tarda de 3 a 6 meses en mostrar tráfico estable. Las consultas largas en español («curso de power bi en español en miami») tienen poca competencia y pueden moverse antes.
