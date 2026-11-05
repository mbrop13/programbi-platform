# WS5 — Precios por país

Ejecutado por el orquestador en `mejora/fase4`.

## Estado

- [x] Hecho

## Qué se hizo

- **Bug corregido**: `app/(marketing)/precios/page.tsx` exportaba `metadata` estática con
  `canonical: /precios` y título de Chile. Todas las versiones de país
  (`/mx/precios`, `/ar/precios`, …) se declaraban como Chile. Ahora hay
  `generateMetadata({ params })` que resuelve el país y entrega:
  - título propio con el nombre del país, recortado a 60 con `tituloSeo`;
  - descripción con la moneda local;
  - canonical `absoluteUrl(rutaLocal(pais, "/precios"))`;
  - `languages` con `hreflangDe("/precios")`.
- **FAQ de cuotas**: se agregó «¿Hay cuotas sin interés?» usando `cuotasSinInteres(pais)`
  de `config/cuotas.ts`, para que la respuesta no vuelva a quedar hardcodeada.
- El cuerpo de la página ya localizaba textos con `localizarMercado` y precios con
  `preciosDePais`; se mantuvo. Paraguay sigue sin monto y con «Consulta el valor por
  WhatsApp».

## Verificación

- `npx tsc --noEmit` → EXIT 0.
- La verificación HTTP de canonical/título por país está en `scripts/verificar-fase4.mjs`
  (grupo «Precios por país»).

## Commits

- `34ac901` fix(f4-precios): canonical y título propios por país y FAQ de cuotas
