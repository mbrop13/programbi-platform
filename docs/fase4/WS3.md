# WS3 — Test de nivel SQL/Excel

Ejecutado por el orquestador en `mejora/fase4`.

## Estado

- [x] Hecho

## Qué se hizo

- **Bug de país corregido**: `app/(marketing)/test-nivel/[tema]/page.tsx` armaba el
  `<title>` como «Test de nivel SQL en Chile» para todas las rutas. Ahora usa el país de
  la URL con `tituloSeo` (≤60 caracteres) y `metadataLocal` (canonical + hreflang).
- **Hub `/test-nivel`** (`app/(marketing)/test-nivel/page.tsx` + versión por país): lista
  los dos tests, explica cómo funciona y enlaza a cada prueba y a las fichas de curso.
  JSON-LD `ItemList` + `BreadcrumbList`.
- **Email opcional en el resultado**: formulario «¿Guardamos tu resultado?» que hace POST
  a `/api/leads-magnet` con `recurso: "test-sql" | "test-excel"` y el país de la ruta. El
  test se completa igual sin dejar email. El texto **no promete un envío automático**
  (hoy solo se guarda el lead).
- `lib/leads-magnet.ts`: se agregaron `test-sql` y `test-excel` a los recursos permitidos,
  sin tocar `plantilla-ventas-powerbi`.
- El evento `quiz_complete` ya viajaba con `tema`, `nivel`, `pais`, `aciertos` y `total`
  (`trackQuizComplete` ya aceptaba `pais`).

## Pendientes / TODO_MANU

- Conectar el envío del resultado por correo: hoy el lead queda en `leads_magnet`
  (`recurso = test-sql|test-excel`) pero no sale un email automático.
- El formulario depende de que la migración `20261102000000_leads_magnet.sql` esté aplicada
  en Supabase (sigue pendiente de Manu).

## Commits

- `11930a6` feat(f4-test-nivel): país real en title/h1, hub /test-nivel y email opcional
