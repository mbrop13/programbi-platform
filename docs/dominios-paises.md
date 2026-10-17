# Países en programbi.com

Chile sigue en la raíz (`/`, `/cursos`, `/cursos/power-bi`). El resto vive en carpeta: `/ar`, `/mx`, `/pe`, `/co`, `/ec`, `/uy`, `/bo`, `/py`, `/pa`, `/cr`, `/gt`, `/sv`, `/hn`, `/ni`, `/do`, `/ve`.

No hay redirección por IP. El selector del header y del footer cambia la carpeta. Un aviso discreto puede sugerir el país que Vercel detecta (`x-vercel-ip-country`).

Brasil no está: el sitio es en español.

## Precios

`config/paises.ts`. `precios` es lo que se cobra. `listas` es el precio tachado. En Chile el original es 249.000 para un curso y 747.000 para Análisis de datos, y el panel deja el cobro en 169.000 y 338.000. En el resto, el tachado guarda esa misma relación: cerca de 32% off en un curso y 55% off en Análisis de datos. El cobro de Análisis de datos sigue siendo el doble de un curso. Analítica minería y analítica financiera usan el precio de un curso normal.

Argentina se actualiza solo en `PRECIOS_ARS`. No hay conversión automática desde el peso chileno. Chile sigue cobrando el catálogo de `lib/data/courses.ts` más los overrides y las promos de Supabase.

## Mercado Pago

Sin claves en el código. Variables:

- Chile (la de hoy): `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_WEBHOOK_SECRET`
- Argentina, México, Perú, Colombia, Uruguay: `MERCADOPAGO_ACCESS_TOKEN_AR` (y `_MX`, `_PE`, `_CO`, `_UY`) y el webhook `MERCADOPAGO_WEBHOOK_SECRET_AR` (mismo sufijo)

Si la variable del país no existe, el checkout usa la cuenta de Chile en CLP y la página muestra `[CONFIGURAR MP XX]`.

Mercado Pago no opera en Ecuador, Panamá, Costa Rica, El Salvador, Guatemala, Paraguay, Bolivia, Honduras, Venezuela, Nicaragua ni República Dominicana. Esos países cobran en USD por la cuenta de Chile y muestran `[REVISAR PAGO XX]`. Si la cuenta de Chile rechaza el dólar, el cobro no se completa: no se reemplaza por el precio chileno.

El teléfono y la ciudad local que falten están como `[PENDIENTE CONTENIDO XX]`. No inventes alumnos, cifras ni casos.

## Probar en local

```bash
npm run dev
```

- http://localhost:3000/ sigue siendo Chile, en CLP
- http://localhost:3000/mx y http://localhost:3000/mx/cursos/power-bi
- http://localhost:3000/ar http://localhost:3000/pe http://localhost:3000/co http://localhost:3000/ec http://localhost:3000/uy
- El resto: `/bo` `/py` `/pa` `/cr` `/gt` `/sv` `/hn` `/ni` `/do` `/ve`
- http://localhost:3000/cl redirige a `/`
- En el HTML: `rel="canonical"` de esa carpeta y `hreflang` de es-CL, es-AR, es-MX, es-PE, es-CO, es-EC, es-UY, es-BO, es-PY, es-PA, es-CR, es-GT, es-SV, es-HN, es-NI, es-DO, es-VE y `x-default`
- http://localhost:3000/sitemap.xml incluye las carpetas
- El checkout está en `/pago?curso=power-bi&pais=mx` (pide sesión). Sin credencial local abre Mercado Pago de Chile

## Agregar un país

1. Una entrada en `PAISES` dentro de `config/paises.ts` (idioma, moneda, `pago`, precios).
2. Si Mercado Pago opera ahí, `pago: "mp"` y la variable `MERCADOPAGO_ACCESS_TOKEN_XX`.
3. Si no opera, `pago: "usd-chile"` o `pago: "clp-chile"`.
4. No copies páginas. La carpeta `app/(marketing)/[pais]` ya lee la config.
5. El código de dos letras no puede chocar con una ruta existente (`/cursos`, `/blog`, `/es`, `/en`, `/cl`).

## Dominios propios (todavía no activos)

Cuando existan, el 301 va en `vercel.json`, con estado 301, antes del catch-all del apex. `/:path*` no cubre la home, así que cada dominio lleva dos reglas. No los actives hasta comprar el dominio.

Ejemplo para Argentina. Repite el par cambiando host y carpeta.

```json
{
  "source": "/",
  "has": [{ "type": "host", "value": "programbi.com.ar" }],
  "destination": "https://www.programbi.com/ar",
  "statusCode": 301
},
{
  "source": "/:path*",
  "has": [{ "type": "host", "value": "programbi.com.ar" }],
  "destination": "https://www.programbi.com/ar/:path*",
  "statusCode": 301
}
```

| Dominio | Carpeta |
|---|---|
| programbi.com.ar | /ar |
| programbi.mx | /mx |
| programbi.pe | /pe |
| programbi.com.co | /co |
| programbi.ec | /ec |
| programbi.com.uy | /uy |
| programbi.bo | /bo |
| programbi.com.py | /py |
| programbi.com.pa | /pa |
| programbi.cr | /cr |
| programbi.com.gt | /gt |
| programbi.com.sv | /sv |
| programbi.hn | /hn |
| programbi.com.ni | /ni |
| programbi.com.do | /do |
| programbi.com.ve | /ve |

`www` de cada dominio, si se compra, usa la misma carpeta. No crees otro proyecto de Vercel.
