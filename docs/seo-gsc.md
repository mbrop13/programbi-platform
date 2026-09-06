# SEO GSC — money pages (www.programbi.com)

Canonical host: `https://www.programbi.com`. No se tocó capacitaciones.programbi.cl.

## Titles implementados

| Ruta | Title final | Query objetivo |
|---|---|---|
| `/` | Pack Adopción Power BI y cursos Chile \| ProgramBI | marca + dual path empresas/cursos |
| `/empresas` | Pack Adopción Power BI para empresas Chile \| ProgramBI | power bi empresas chile, implementación/adopción Power BI empresas |
| `/cursos` | Cursos Power BI y análisis de datos Chile \| ProgramBI | cursos power bi chile, cursos analisis de datos |
| `/cursos/power-bi` | Curso Power BI Chile en vivo \| ProgramBI | curso power bi chile, cursos de power bi chile, curso power bi |
| `/cursos/analisis-de-datos` | Cursos de análisis de datos Chile \| ProgramBI | cursos analisis de datos, cursos de analisis de datos |
| `/cursos/analitica-mineria` | Curso Power BI para minería Chile \| ProgramBI | (potenciar lo que ya rankea) Power BI + minería Chile |
| `/implementacion-power-bi` | Implementación Power BI Chile \| Pack Adopción BI | implementación Power BI Chile |
| `/migrar-excel-a-power-bi` | Migrar Excel a Power BI Chile \| Control de gestión | migrar Excel a Power BI, control de gestión |
| `/por-que-fallan-proyectos-power-bi` | Por qué fallan los proyectos Power BI \| ProgramBI | adopción Power BI (no el dashboard) |
| `/curso-power-bi-vs-pack-adopcion` | Curso Power BI vs Pack Adopción Chile \| ProgramBI | curso vs in-company |
| `/power-bi-mineria-chile` | Power BI para minería en Chile \| ProgramBI | Power BI minería Chile |

## Técnico (código)

- Canonical y `metadataBase` en www.
- Apex `programbi.com` → www en `proxy.ts` (308).
- Sitemap: money pages 0.85–0.95; minería al mismo nivel que Power BI / análisis; blog 0.25; vanity (`/gran-partido`) 0.1. Posts CMS de blog no van al sitemap.
- robots.txt: sitemap www; disallow app/admin/referidos privados.
- JSON-LD: Organization + WebSite (layout); FAQPage + Service en `/empresas`; Course (sin AggregateRating inventado) + FAQ en fichas money; Article en guías.
- “Fecha por confirmar”: no se usa. Fallback: “Cupos abiertos — consulta fecha”.
- Métricas 0+ / ratings 4.9 inventados: no en money pages. Home usa prueba cualitativa (factura directa / Chile / cursos), no contadores.

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
