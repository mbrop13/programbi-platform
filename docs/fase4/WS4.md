# WS4 — Landings SQL y Python por país

Rama: `feat/f4-landings` · Worktree: `C:/dev/pbi-f4-4` · Base: `mejora/fase4`.

## Estado

- [ ] En curso
- [x] Hecho (código y documentación; falta la verificación pesada del orquestador)
- [ ] Bloqueado (motivo y a quién le toca)

## Qué se hizo

- H1, `<title>`, meta description y canonical propios por país. Los mercados
  AR/MX/PE/CO/UY/PY tienen texto escrito (no un reemplazo de «Chile»); el resto
  cae al copy base localizado con `localizarMercado`.
- Precio visible desde `config/pricing.ts` (`precioPublico`) y `Offer` con la
  moneda del mercado. Horario local desde `lib/paises/horarios.ts` y cohorte
  desde `nextCohortForCourse` / `course_schedules`.
- Tres casos de uso locales por país y por curso (SQL y Python), con el sector
  y la fuente de datos tomados de `lib/data/contenido-paises`. Son escenarios
  cualitativos: no hay cifras, clientes ni resultados inventados.
- FAQ propia: 6 preguntas por landing (2 de horario/precio-pago con datos
  vivos + 2 del mercado + 2 del curso). El `FAQPage` usa exactamente el mismo
  arreglo que se renderiza.
- JSON-LD: `Course` + `Offer` + `FAQPage` + `BreadcrumbList`. En Paraguay se
  elimina `Offer` explícitamente y la página queda `noindex, follow`.
- Paraguay: CTA principal «Consulta el valor por WhatsApp», sin precio y sin
  `Offer`.

## URLs

| Mercado | SQL | Python | Indexación |
|---|---|---|---|
| Chile (raíz) | `/curso-sql-online` | `/curso-python` | index, follow |
| Argentina | `/ar/curso-sql-online` | `/ar/curso-python` | index, follow |
| México | `/mx/curso-sql-online` | `/mx/curso-python` | index, follow |
| Perú | `/pe/curso-sql-online` | `/pe/curso-python` | index, follow |
| Colombia | `/co/curso-sql-online` | `/co/curso-python` | index, follow |
| Uruguay | `/uy/curso-sql-online` | `/uy/curso-python` | index, follow |
| Paraguay | `/py/curso-sql-online` | `/py/curso-python` | noindex, follow; sin Offer |

Canonical: cada URL es su propio canonical. Los mercados indexables publican
`hreflang` recíproco + `x-default`; Paraguay no entra en el juego de hreflang.

## Archivos tocados

- `lib/data/landing-cursos.ts`: SEO/H1 por país, 30 casos de uso locales
  (5 países × 2 cursos × 3 casos) y 20 FAQ de mercado.
- `lib/paises/landing-curso.ts`: contenido localizado, precio/cohorte, FAQ,
  metadata y JSON-LD; `Offer` suprimido cuando no hay precio.
- `components/marketing/CursoLanding.tsx`: H1/kicker localizados, CTA por
  WhatsApp cuando no hay precio, casos con sector y fuente.
- `docs/fase4/WS4.md`: este reporte.
- `docs/p14-landings-sql-python.md`: se actualiza la integración con P8.

## Verificación local (sin build)

No se ejecutaron `npm`, `npx`, `node`, `tsc`, `eslint` ni `next build` por la
restricción del worktree. Verificación estática realizada:

- Los `<title>` de las 14 variantes miden entre 44 y 55 caracteres (tope 60).
- Los sectores de los 30 casos coinciden exactamente con los `casos` de
  `lib/data/contenido-paises` (`ar`, `mx`, `pe`, `co`, `uy`).
- Ningún caso ni FAQ local contiene cifras.
- `precioPublico("py", …)` devuelve `null`; el JSON-LD borra `offers` antes de
  serializar y el CTA visible es «Consulta el valor por WhatsApp».

Pendiente para el orquestador (en la integradora):

1. `npx tsc --noEmit` y `npx next build --webpack`.
2. `curl` de las 14 URLs: 200, H1 con el país, canonical propio, `hreflang` en
   AR/MX/PE/CO/UY y `noindex` en PY.
3. Rich Results Test: `Course`, `Offer` en AR/MX/PE/CO/UY, ausencia de `Offer`
   en PY y coincidencia literal entre FAQ visible y `FAQPage`.
4. Confirmar precio y horario contra la cohorte vigente de `course_schedules`.

## Pendientes / TODO_MANU

- Verificación pesada y revisión de copy en la rama integradora.
- Paraguay sigue sin precio publicado: cuando Manu apruebe el monto en USD, se
  carga en `config/paises.ts` y la landing dejará de mostrar el CTA por
  WhatsApp (el `Offer` aparecerá solo).
- La plantilla P9 (`PlantillaDescarga`) no se usa en estas dos landings; si se
  quiere reutilizar, debe hacerse en un workstream posterior.

## Commits

- `95b6875` `feat(f4-landings): contenido local, precio y FAQ por país en SQL y Python`
- `f5e1999` `docs(f4-landings): reporte WS4 y estado de integración con contenido por país`
- `docs/fase4/WS4.md`: este reporte (el hash de este ajuste queda en el historial).
