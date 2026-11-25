# Reporte — México: Excel laboral, carreras mejor pagadas IMCO 2026 y 2 arreglos (`feat/mx-excel-laboral-carreras`)

## 1. Resumen ejecutivo

- **Rama**: `feat/mx-excel-laboral-carreras` (creada desde `main`, sin merge ni deploy a producción).
- **Nuevas URLs HTML indexables**: **82 URLs**:
  - 1 hub: `/mx/datos`
  - 4 guías de Excel laboral: `/mx/guias/plantilla-aguinaldo-excel` (urgente, antes del 30 nov / 19 dic), `/mx/guias/finiquito-liquidacion-excel`, `/mx/guias/tabla-isr-2026-excel`, `/mx/guias/calcular-ptu-excel`
  - 2 páginas agregadas de carreras: `/mx/datos/carreras` (índice de las 75 fichas) y `/mx/datos/carreras-mejor-pagadas`
  - **75 fichas** `/mx/datos/carreras/[slug]` (`fichas_publicables_mx.csv`, todas las carreras IMCO 2026 con ingreso)
- **Descargables estáticos (`X-Robots-Tag: noindex, nofollow`, fuera de sitemap)**:
  - CSV: `/mx/datos/carreras-mejor-pagadas/csv/carreras-mexico-imco-2026.csv`
  - 4 plantillas `.xlsx` en `/mx/plantillas/`: `aguinaldo-mexico-2026.xlsx`, `finiquito-liquidacion-mexico-2026.xlsx`, `tabla-isr-2026-mexico.xlsx`, `ptu-mexico-2026.xlsx`.
- **Arreglos globales / locales**:
  - **Arreglo 1 (5.7)**: `lib/data/contenido-paises/bloque.ts` y `components/paises/BloqueLocalPais.tsx` reemplazan «Sin fecha confirmada» por «Coordinada por WhatsApp» con `WhatsAppCta` (`intent="clase-gratis"`, `click_whatsapp`) cuando `NEXT_PUBLIC_CLASE_GRATIS_FECHA` está vacío (con fecha definida conserva «Próxima: [fecha]»). **Nota de alcance**: al vivir en el bloque compartido, este cambio aplica también a los 11 países con bloque local.
  - **Arreglo 2 (5.8)**: `components/shared/Footer.tsx` en `/mx/**` muestra «Escríbenos por WhatsApp» (`WhatsAppCta`, `country="mx"`) como contacto principal, lee `getPais("mx").contacto` sin inventar teléfono +52 ni correo nuevo (correo `.cl` en segundo plano como «Correo»), mantiene «ProgramBI SPA · México» y agrega «Datos de México» → `/mx/datos` solo en `mx`.

## 2. Conteo del sitemap y pares `hreflang`

- **URLs `/mx/*` en sitemap**: antes `42` (más `/mx` = `43`), después `124` (+82 nuevas URLs HTML exactas; 0 CSV y 0 XLSX).
- **Tabla compartida `lib/seo/datos-hreflang.ts`** (`x-default` = Chile, reciprocidad 100 %):
  - 2 pares base: `/datos/carreras` ↔ `/mx/datos/carreras` y `/datos/carreras/mejor-pagadas` ↔ `/mx/datos/carreras-mejor-pagadas`.
  - 28 pares explícitos de fichas CL ↔ MX verificados 1:1 en oficio/nivel e indexabilidad en Chile.
  - Excluidas: `/mx/datos`, las 4 guías laborales y fichas sin par explícito.

## 3. Valores de control y decisiones sobre datos faltantes

- **ISR 2026 (SAT Anexo 8 RMF 2026)**: primer tramo `0.01–844.59` (cuota `0.00`, `1.92 %`); último tramo `425,642.00+` (cuota `133,488.54`, `35.00 %`). No se incluye subsidio para el empleo al no estar verificado en el Anexo 8 del paquete.
- **UMA 2026 (INEGI)**: `$117.31` diaria, `$3,566.22` mensual, `$42,794.64` anual (1 feb 2026 – 31 ene 2027). Aguinaldo exento 30 UMA = `$3,519.30`; PTU exenta 15 UMA = `$1,759.65`.
- **Salario mínimo 2026 (CONASAMI, DOF 9 dic 2025)**: `$315.04` general y `$440.87` ZLFN.
- **IMCO Compara Carreras 2026**: Matemáticas `$29,887` (desocupación `1.3 %`), Medicina general `$27,823` (`1.6 %`, tasa de aceptación `19 %`).
- **Exclusiones**: las 4 carreras sin ingreso (`513`, `610`, `621`, `420`) muestran «sin dato de ingreso» en el ranking de 79 carreras, no tienen ficha ni enlace ni entran al sitemap. La carrera `125` (Formación docente en educación superior) sí se publica omitiendo el KPI de desocupación por venir sin dato en IMCO.
- **Licencia IMCO**: no verificada; no se declara licencia abierta en `Dataset` JSON-LD (solo atribución a IMCO, INEGI ENOE y ANUIES). Cero menciones a «empleabilidad».

## 4. Verificaciones ejecutadas (rápidas) y pendientes (pesadas)

- **Ejecutadas**: `node scripts/build-datos-mx.mjs`, `node scripts/build-plantillas-mx.mjs`, `npx tsx --test tests/datos/seo.test.ts tests/datos-mx/mexico.test.ts`, `node scripts/verificar-guias-paso-a-paso.mjs --no-net`, `npx tsc --noEmit`.
- **Pendientes bajo solicitud explícita**: `npm run build` completo y verificación HTTP SSR en `next start` sobre las 82 URLs y headers `X-Robots-Tag`.

## 5. Checklist post-deploy (para Manu, después del merge)

1. Reenviar `https://www.programbi.com/sitemap.xml` en Search Console.
2. Pedir indexación de `/mx/guias/plantilla-aguinaldo-excel` el mismo día del deploy; luego `/mx/datos`, `/mx/datos/carreras`, `/mx/datos/carreras-mejor-pagadas`, fichas de Matemáticas y Medicina general, y `/mx/guias/tabla-isr-2026-excel` antes de enero.
3. Configurar `NEXT_PUBLIC_CLASE_GRATIS_FECHA` en Vercel cuando exista fecha real y entregar contacto local de México si se requiere para el pie.
4. A los 7 días, revisar Cobertura (82 URLs nuevas indexadas).
