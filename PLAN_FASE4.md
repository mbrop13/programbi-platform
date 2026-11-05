# PLAN_FASE4 — ProgramBI

Estado vivo de la fase 4. Base: `mejora/fase3` @ `d188e53` (commiteada y pusheada).
Rama integradora: `mejora/fase4` (worktree `C:/dev/pbi-f4`). Nunca `main`, sin deploy,
sin DNS, sin ads, sin Supabase de producción.

## Decisiones de Manu (4-nov-2026)

1. Las **3 cuotas sin interés aplican en todos los países**: activar ese flag.
2. La **clase gratis** todavía no tiene fecha ni cupos: implementar `/clase-gratis`
   detrás de un **flag APAGADO**.
3. Empezar la fase 4 apenas termine la fase 3 (cumplido: `mejora/fase3` = `origin/mejora/fase3`).

## Workstreams

Cada subagente trabaja en su worktree y su rama, commitea seguido y deja su estado en
`docs/fase4/WSn.md`. Solo el orquestador toca los archivos compartidos.

| WS | Rama | Worktree | Alcance | Archivos propios |
|---|---|---|---|---|
| 1 | `feat/f4-cuotas` | `C:/dev/pbi-f4-1` | 3 cuotas sin interés en todos los países, desde `config/cuotas.ts`; sin contradicciones en copy | `lib/faq/contenido.ts`, `components/faq/FaqContenido.tsx`, `components/guias/Bloque30Segundos.tsx`, `components/guias/ElementoVisual.tsx`, `lib/email/quote-template.ts`, bloque de precio de la ficha y checkout |
| 2 | `feat/f4-clase-gratis` | `C:/dev/pbi-f4-2` | `/clase-gratis` y `/{pais}/clase-gratis` detrás de flag APAGADO, sin fecha ni cupos inventados | `config/flags.ts`, `app/(marketing)/clase-gratis/**`, `app/(pais)/[pais]/clase-gratis/**`, `components/clase-gratis/**` |
| 3 | `feat/f4-test-nivel` | `C:/dev/pbi-f4-3` | Test de nivel SQL/Excel: país correcto en title/H1, hub `/test-nivel`, email opcional a `leads_magnet`, `quiz_complete` con país | `app/(marketing)/test-nivel/**`, `app/(pais)/[pais]/test-nivel/**`, `lib/data/test-nivel/**`, `app/api/leads-magnet/route.ts`, `lib/leads-magnet.ts` |
| 4 | `feat/f4-landings` | `C:/dev/pbi-f4-4` | Landings SQL y Python con contenido real por país (CO, UY, AR, MX, PE), precio local, JSON-LD y FAQ | `app/(marketing)/curso-sql-online/**`, `app/(marketing)/curso-python/**`, `app/(pais)/[pais]/curso-sql-online/**`, `app/(pais)/[pais]/curso-python/**`, `lib/data/landing-cursos.ts`, `lib/paises/landing-curso.ts` |
| 5 | `feat/f4-precios` | `C:/dev/pbi-f4-5` | `/precios` por país: metadata/canonical propios, tabla completa, medios de pago, FAQ citable | `app/(marketing)/precios/**`, `app/(pais)/[pais]/precios/**`, `lib/paises/precios-pagina.ts` |
| 6 | `feat/f4-certificado` | `C:/dev/pbi-f4-6` | Certificado verificable público `/certificado/[codigo]` con datos reales de `public.certificates` | `app/(marketing)/certificado/**`, `components/certificado/**`, `lib/certificados/**` |
| 7 | `feat/f4-medicion` | `C:/dev/pbi-f4-7` | Eventos que faltan (`webinar_signup`, `quiz_complete` con país, `ref` de WhatsApp), auditoría de `_dbg` y verificación ampliada | `lib/analytics/**`, `components/shared/MarketingAnalytics.tsx`, `lib/whatsapp.ts`, `scripts/verificar-sitio.mjs`, `scripts/verificar-fase4.mjs` |

## Archivos compartidos (solo orquestador)

`app/sitemap.ts`, `lib/paises/rutas.ts`, `next.config.*`, `package.json`/lockfile,
`middleware.ts`, `config/cuotas.ts` (creado por el orquestador como fuente única),
`PLAN_FASE4.md`.

## Reglas

- Sin `main`, sin deploy, sin migraciones aplicadas, sin inventar datos ni precios.
- Un WS = una rama = sus archivos. Si necesita otro archivo, lo pide al orquestador.
- Prohibido correr `npm`, `npx`, `node`, `tsc`, `eslint` o `next build` en los worktrees
  de feature (PC de 8 GB y un solo `node_modules` compartido). La verificación pesada
  la hace el orquestador al final, sobre la integradora.
- Commit seguido, mensajes `feat(f4-<ws>): ...` / `fix(f4-<ws>): ...`.
- Paraguay sigue sin precio: `noindex`, sin `Offer`, CTA por WhatsApp.

## Verificación final (orquestador)

1. `npx tsc --noEmit`
2. `npx next build --webpack`
3. `npx next start -p 3112` + `node scripts/verificar-sitio.mjs http://127.0.0.1:3112`
4. `node scripts/verificar-fase4.mjs http://127.0.0.1:3112` (rutas nuevas)
5. Reporte `HERMES_REPORTE_FASE4.md`

## Estado

| WS | Estado | Último hash | Nota |
|---|---|---|---|
| Base | hecho | d188e53 | fase 3 integrada y pusheada |
| 1 | en curso | — | — |
| 2 | en curso | — | — |
| 3 | en curso | — | — |
| 4 | en curso | — | — |
| 5 | en curso | — | — |
| 6 | en curso | — | — |
| 7 | en curso | — | — |
