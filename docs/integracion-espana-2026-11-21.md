# Integración de España (`/es`) — 2026-11-21

Resumen técnico, comercial y SEO/GEO de la incorporación de España (`es`, `es-ES`) a la plataforma ProgramBI.

## 1. Arquitectura de `/es`

- **Identificador y localización:** `iso: "es"`, `idioma: "es-ES"`, `zonaHoraria: "Europe/Madrid"`, `moneda: "USD"`, `indexable: true`.
- **Rutas principales:** `/es`, `/es/cursos/[slug]`, `/es/precios`, `/es/guias`, `/es/guias/[slug]`, `/es/preguntas-frecuentes`, `/es/pago`, `/es/empresas`.
- **Enlazado interno y SEO técnico:**
  - `app/sitemap.ts`: `"es"` incorporado a `PAISES_DESTACADOS`.
  - `lib/paises/vecinos.ts`: `es: ["cl", "mx", "ar"]` y `"es"` añadido a `VECINOS.cl`.
  - `components/shared/Footer.tsx`: `"es"` añadido a `GUIAS_POR_PAIS`.
  - `components/shared/RootShell.tsx`: descripción JSON-LD específica para `lang === "es-ES"`.
  - `lib/llms/contenido.ts` y `lib/faq/contenido.ts`: inclusión de España en `/llms.txt`, `/llms-full.txt`, tablas de horarios/precios/pagos y corrección de texto para mercados `precioDirecto` / `sinDescuento` (`es` y `us`).

## 2. Tabla de precios (paridad EE.UU.)

España adopta paridad con Estados Unidos (`PRECIOS_USD_EEUU` en `config/paises.ts`), con `precioDirecto: true` y `sinDescuento: true` (sin precio tachado, sin formularios previos ni cuotas):

| Categoría de curso | Duración | Precio público (USD) | Modalidad de cobro |
|---|---|---|---|
| Cursos estándar (Power BI, SQL Server, Python, Excel, Claude, Copilot, etc.) | 20 h por nivel | USD 249 | Pago único con tarjeta |
| Mercado Financiero | 30 h | USD 369 | Pago único con tarjeta |
| Análisis de Datos / Analítica para Minería | 60 h por nivel | USD 498 | Pago único con tarjeta |

## 3. Estrategia SEO y GEO para España

Se publican 3 guías originales redactadas en español peninsular natural (`< 30%` de shingles de 5 palabras compartidos con el resto del catálogo):

1. `/es/guias/como-aprender-power-bi-en-espana` (`content/guias/pais/es.md`): mercado laboral en Madrid, Barcelona, Valencia, Bilbao y Sevilla; bandas salariales orientativas en EUR brutos/año (Indeed España, Glassdoor España, InfoJobs/Convenio TIC); portales locales; ruta de 8 semanas con `datos.gob.es` e INE; ejemplos DAX en EUR y certificación Microsoft PL-300.
2. `/es/guias/curso-analisis-de-datos-espana` (`guias/analisis-de-datos-espana.md`): stack SQL Server + Power BI + Python (60 h por nivel) alineado con InfoJobs y Tecnoempleo; casos con INE, Banco de España, SAP, Dynamics 365, Holded y Sage.
3. `/es/guias/curso-claude-espana` (`guias/claude-espana.md`): uso de Claude (20 h en 5 módulos) en finanzas y administración bajo RGPD y LOPDGDD (anonimización de DNI/NIE/nóminas, Claude Team/Enterprise) con exportaciones de Holded, Sage y AEAT.

## 4. Políticas clave para España

- **Horarios (CET / CEST):** Las cohortes abiertas en directo (19:30–21:30 hora de Chile) corresponden a **23:30–01:30 CET** en invierno y **01:30–03:30 CEST** en verano. Todas las clases quedan grabadas en HD en el campus virtual junto con los materiales. Para equipos corporativos se ofrecen programas **in-company en horario laboral español**.
- **FUNDAE y facturación:** La formación abierta no es bonificable mediante créditos FUNDAE; se emite **factura internacional** deducible como gasto de formación para empresas y autónomos.
- **RGPD y LOPDGDD:** Las guías y el temario de IA enfatizan la anonimización previa de datos personales y el uso de entornos corporativos sin entrenamiento con datos del cliente.

## 5. Checklist operativo post-despliegue

- [ ] Ejecutar `node scripts/build-guias.mjs` y verificar `node scripts/build-guias.mjs --check`.
- [ ] Verificar compilación TypeScript (`npm run typecheck` / `npm run build`) y tests de SEO/FAQ/LLMs.
- [ ] Comprobar `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/es/preguntas-frecuentes` y las 3 nuevas rutas `/es/guias/*` en producción.
- [ ] Validar etiquetas `hreflang="es-ES"` y JSON-LD (`Organization` + `FAQPage` + `Article`) con Rich Results Test.
- [ ] Enviar `/sitemap.xml` en Google Search Console tras el despliegue.
