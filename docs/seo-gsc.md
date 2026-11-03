# SEO GSC — money pages (www.programbi.com)

Canonical host: `https://www.programbi.com`. No se tocó capacitaciones.programbi.cl.

## Titles implementados

| Ruta | Title final | Query objetivo |
|---|---|---|
| `/` | Cursos de análisis de datos en vivo Chile \| ProgramBI | academia de datos Chile, cursos en vivo, Power BI, análisis de datos |
| `/empresas` | Pack Adopción Power BI para empresas Chile \| ProgramBI | power bi empresas chile, implementación/adopción Power BI empresas |
| `/cursos` | Cursos Power BI y análisis de datos Chile \| ProgramBI | cursos power bi chile, cursos analisis de datos |
| `/cursos/power-bi` | Curso Power BI Chile en vivo: DAX y Query \| ProgramBI | curso power bi, cursos power bi chile, curso power bi chile, power bi empresas chile |
| `/cursos/power-automate` | Curso Power Automate Chile: flujos y RPA \| ProgramBI | curso power automate, power automate curso, cursos power automate |
| `/cursos/analisis-de-datos` | Curso de análisis de datos en vivo Chile \| ProgramBI | cursos analisis de datos, cursos de analisis de datos, curso analisis de datos, curso analista de datos |
| `/cursos/analitica-mineria` | Curso Power BI para minería Chile \| ProgramBI | (potenciar lo que ya rankea) Power BI + minería Chile |
| `/implementacion-power-bi` | Implementación Power BI Chile \| Pack Adopción BI | implementación Power BI Chile |
| `/migrar-excel-a-power-bi` | Migrar Excel a Power BI Chile \| Control de gestión | migrar Excel a Power BI, control de gestión |
| `/por-que-fallan-proyectos-power-bi` | Por qué fallan los proyectos Power BI \| ProgramBI | adopción Power BI (no el dashboard) |
| `/curso-power-bi` | Curso Power BI Chile \| Plantilla de ventas gratis | curso power bi chile, plantilla power bi |
| `/{pais}/curso-power-bi` | mismo title localizado por país | curso power bi Argentina / México / Perú / Colombia / Uruguay |
| `/curso-power-bi-vs-pack-adopcion` | Curso Power BI vs Pack Adopción Chile \| ProgramBI | curso vs in-company |
| `/curso-sql-online` | Curso SQL online en vivo en Chile \| ProgramBI | curso sql online, curso sql server chile |
| `/curso-python` | Curso Python para datos online en Chile \| ProgramBI | curso python datos, curso python chile |
| `/power-bi-mineria-chile` | Power BI para minería en Chile \| ProgramBI | Power BI minería Chile |

## Técnico (código)

- Canonical y `metadataBase` en www.
- Apex `programbi.com` → www en `proxy.ts`, `next.config.ts` y `vercel.json` (301).
- Sitemap: money pages 0.85–0.95; minería al mismo nivel que Power BI / análisis; blog 0.25; vanity (`/gran-partido`) 0.1. Posts CMS de blog no van al sitemap.
- robots.txt: sitemap www; disallow app/admin/referidos privados.
- JSON-LD: Organization + WebSite (layout); FAQPage + Service en `/empresas`; Course (sin AggregateRating inventado) + FAQ en fichas money; Course + Offer + FAQPage en las landings Power BI por país; Article en guías.
- Landings `/curso-sql-online` y `/curso-python`: Course + Offer + FAQPage + BreadcrumbList, con canonical y hreflang propios por país.
- “Fecha por confirmar”: no se usa. Fallback: “Cupos abiertos — consulta fecha”.
- Métricas 0+ / ratings 4.9 inventados: no en money pages. Home usa prueba cualitativa (factura directa / Chile / cursos), no contadores.

## Landings Power BI por país (P9)

- Rutas: `/curso-power-bi` (Chile) y `/{ar,mx,pe,co,uy}/curso-power-bi`. H1 propio con el país, precio en la moneda local (catálogo CLP en Chile), horario convertido a la zona del país, casos de uso por industria y FAQ de mercado (más la pregunta de nivel).
- Canonical y hreflang salen de `metadataLocal`/`hreflangDe`; las rutas indexables están en `app/sitemap.ts`.
- **Contenido local:** los casos de uso por industria y el FAQ de mercado de Argentina, México, Perú, Colombia y Uruguay salen de `getContenidoPais` (`lib/data/contenido-paises`). Chile mantiene el FAQ armado con su configuración. No se inventan casos de clientes ni cifras de resultados.
- Plantilla: el CSV pide email, guarda en `leads_magnet` vía `app/api/leads-magnet` y dispara `download_template`. La migración `20261102000000_leads_magnet.sql` está creada pero **no aplicada**. Falta la variante `.pbix`.

## Blog vanity

El histórico no se borra. El slider de `/blog` (categoría “Todo”) **deprioriza** posts cuyo título/excerpt/slug matchea tokenizadas, Neuralink, SpaceX, GLM, Mundial, cripto, etc.

**Noindex selectivo:** no aplicar noindex masivo sin confirmación. Si un post vanity diluye marca, marcar `noindex` uno a uno en GSC o en el CMS.

## Checklist humano (no está en código)

1. Verificar propiedad Search Console del **dominio** y de **www.programbi.com**.
2. Añadir `programbi.cl` a GSC o confirmar 301 → `https://www.programbi.com`.
3. Enviar `https://www.programbi.com/sitemap.xml` en GSC.
4. Confirmar fechas reales de cohortes (hoy hay fallbacks 2026-06 en estáticos) / Calendly / WhatsApp +56 9 3540 9699.
5. Revisar claims numéricos pendientes: bio instructor (se quitó “5.000”); no reintroducir 0+ ni ratings inventados.
6. GA4: eventos WhatsApp / `generate_lead` si faltan.
7. Cómo medir 30/90 días: clics no-marca; clics e impresión CTR de `/empresas`; posición media de `curso power bi chile` y `power bi empresas chile`.

## Fuera de alcance

capacitaciones.programbi.cl, ccTLDs, posts IA/SpaceX/tokenizadas nuevos, configurar GSC/DNS/Analytics desde este repo.
