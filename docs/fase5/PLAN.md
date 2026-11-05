# Fase 5 — Plan de integración

Base: `mejora/fase4` @ `0b14f1f` → rama `mejora/fase5`, worktree `C:/dev/pbi-f5`.
Siete frentes en paralelo, un worktree y una rama por frente. Sin tocar `main`, sin deploy, sin migraciones.

## Mapa de propiedad de archivos (para evitar conflictos)

| Frente | Rama | Worktree | Archivos que puede tocar |
|---|---|---|---|
| 1 Equipo | `feat/f5-equipo` | `C:/dev/pbi-f5-1` | `lib/data/equipo.ts` (nuevo), `app/(marketing)/profesores/**` (nuevo), `components/equipo/**` (nuevo), `app/(marketing)/nosotros/page.tsx`, `app/(pais)/[pais]/nosotros/page.tsx`, `lib/seo/course-jsonld.ts` |
| 2 Testimonios | `feat/f5-testimonios` | `C:/dev/pbi-f5-2` | `lib/data/testimonials.ts`, `components/marketing/Testimonios.tsx` (nuevo), `app/(marketing)/casos/page.tsx` (nuevo), `app/(marketing)/casos/[slug]/page.tsx`, `app/(marketing)/guias/[slug]/page.tsx`, `components/guias/GuiasDelCurso.tsx` |
| 3 Landings | `feat/f5-landings` | `C:/dev/pbi-f5-3` | `app/(marketing)/power-bi-para-finanzas/**`, `app/(marketing)/power-bi-sql-server-python/**`, `app/(marketing)/analisis-de-datos-mineria/**`, `app/(marketing)/capacitacion-empresas/**`, `lib/data/landings-nicho.ts`, `components/landings/**` (todo nuevo) |
| 4 Técnico SEO | `feat/f5-tecnico-seo` | `C:/dev/pbi-f5-4` | `app/sitemap.ts`, `app/robots.ts`, `next.config.ts` (solo redirects), `vercel.json`, `app/layout.tsx` (solo verificación Bing), `lib/seo/lastmod.ts` (nuevo), `public/<clave-indexnow>.txt`, `scripts/indexnow.mjs`, `scripts/verificar-redirecciones.mjs` |
| 5 Medición IA | `feat/f5-medicion-ia` | `C:/dev/pbi-f5-5` | `lib/analytics/marketing.ts`, `components/shared/MarketingAnalytics.tsx`, `ANALYTICS.md` |
| 6 llms.txt | `feat/f5-llms` | `C:/dev/pbi-f5-6` | `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` (nuevo), `lib/llms/contenido.ts` (nuevo) |
| 7 Indexación | `feat/f5-indexacion` | `C:/dev/pbi-f5-7` | `lib/data/contenido-paises/**`, `components/paises/**` (nuevo), `lib/paises/vecinos.ts` (nuevo), `app/(marketing)/cursos/[slug]/page.tsx`, `app/(marketing)/page.tsx`, `app/(marketing)/cursos/page.tsx`, `app/(pais)/[pais]/page.tsx`, `app/(pais)/[pais]/cursos/page.tsx`, `components/shared/Footer.tsx` |

`sitemap.ts` es exclusivo del frente 4. Las entradas de `/profesores`, `/casos` y las landings las agrega el orquestador al integrar, para no crear dependencias entre ramas.

## Reglas comunes

- Nada inventado: ni bios, ni casos, ni reseñas, ni métricas, ni URLs de LinkedIn. Lo que falte va como `null` + `TODO_MANU`.
- Precios siempre desde `config/pricing.ts` / `lib/paises/precios.ts`.
- Next 16.2.10: leer `node_modules/next/dist/docs/` antes de tocar metadata, sitemap o redirects.
- Los subagentes no ejecutan build, tsc ni dev server. La verificación pesada la hace el orquestador al final.
- Cada frente deja `docs/fase5/WS<n>.md` con cambios, evidencia y pendientes.
