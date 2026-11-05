# WS2 — Clase gratis detrás de flag apagado

Ejecutado por el orquestador en `mejora/fase4` (el subagente no se pudo lanzar por el
tope de delegación del runtime).

## Estado

- [x] Hecho (flag APAGADO, como pidió Manu)

## Qué se hizo

- `config/flags.ts`: `CLASE_GRATIS_HABILITADA` lee `NEXT_PUBLIC_CLASE_GRATIS` (default
  apagado) y `CLASE_GRATIS` lee fecha (`..._FECHA`, YYYY-MM-DD validada), hora
  (`..._HORA`) y cupos (`..._CUPOS`, entero > 0). Todo `null` por defecto: **no se
  inventó fecha ni cupos**.
- `app/(marketing)/clase-gratis/page.tsx` y `app/(pais)/[pais]/clase-gratis/page.tsx`:
  con el flag apagado (o sin fecha) muestran «Todavía no hay fecha confirmada», CTA a
  WhatsApp y a cursos, y **no renderizan formulario**. Metadata con `robots: noindex,
  follow`.
- `components/clase-gratis/FormularioClase.tsx`: inscripción con nombre y email + honeypot,
  reutilizando `POST /api/leads/create` (`leadType: "clase-gratis"`). Solo se monta si hay
  fecha real.
- La ruta quedó registrada en `lib/paises/rutas.ts` para que `rutaLocal`/hreflang armen
  `/{pais}/clase-gratis`, pero **no se agregó al sitemap** mientras el flag esté apagado.

## Cómo encenderla el día que haya fecha

```
NEXT_PUBLIC_CLASE_GRATIS=1
NEXT_PUBLIC_CLASE_GRATIS_FECHA=2026-12-03
NEXT_PUBLIC_CLASE_GRATIS_HORA=19:30 (hora de Chile)
NEXT_PUBLIC_CLASE_GRATIS_CUPOS=80
```

Con esas variables la página deja de ser noindex, muestra la fecha y el formulario.
Además hay que agregar `/clase-gratis` al sitemap en ese momento (hoy está fuera a propósito).

## Pendientes / TODO_MANU

- Confirmar fecha, hora y cupos reales.
- Definir si la clase se dicta en un horario único de Chile o por país (la página no
  promete horario local todavía).
- Revisar qué correo recibe el lead: `/api/leads/create` manda la confirmación general
  para cualquier `leadType` distinto de `webinar`.

## Commits

- `e4b486e` feat(f4-clase-gratis): página /clase-gratis detrás de flag apagado
