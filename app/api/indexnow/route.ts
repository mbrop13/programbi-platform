import { NextResponse } from "next/server";
import { CANONICAL_HOST } from "@/lib/seo";

/**
 * Endpoint IndexNow de ProgramBI.
 *
 * Sirve para avisar a Bing (y a los buscadores que comparten el protocolo:
 * Yandex, Seznam, Naver) de que una URL cambió, sin esperar al rastreo. El
 * envío masivo se hace a mano con `scripts/indexnow.mjs`; esta ruta es para
 * avisos puntuales desde un panel o un cron.
 *
 * Autenticación: la clave de IndexNow llega por la cabecera `x-indexnow-key`
 * o por `?key=`, y debe coincidir con `INDEXNOW_KEY`. La clave es pública por
 * diseño (vive en `public/<clave>.txt`), pero no se devuelve nunca en la
 * respuesta.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENDPOINT_INDEXNOW = "https://api.indexnow.org/indexnow";
const MAX_URLS = 100;
/** IndexNow admite claves de 8 a 128 caracteres alfanuméricos o guiones. */
const FORMATO_CLAVE = /^[A-Za-z0-9-]{8,128}$/;

type Cuerpo = {
  urls?: unknown;
  key?: unknown;
};

function claveConfigurada(): string | null {
  const clave = (process.env.INDEXNOW_KEY || "").trim();
  return FORMATO_CLAVE.test(clave) ? clave : null;
}

function claveRecibida(req: Request, cuerpo?: Cuerpo): string {
  const url = new URL(req.url);
  const deCabecera = req.headers.get("x-indexnow-key") || "";
  const deQuery = url.searchParams.get("key") || "";
  const deCuerpo = typeof cuerpo?.key === "string" ? cuerpo.key : "";
  return (deCabecera || deQuery || deCuerpo).trim();
}

/**
 * Normaliza una URL al canonical del sitio: https, host www y sin query ni
 * hash. Devuelve null si no pertenece a ProgramBI o no es http(s).
 */
function normalizar(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  const host = parsed.hostname.toLowerCase();
  if (host !== CANONICAL_HOST && host !== "programbi.com") return null;
  const path = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
  return `https://${CANONICAL_HOST}${path}`;
}

/** GET: estado del servicio. No expone la clave ni su ubicación. */
export function GET() {
  return NextResponse.json({
    ok: true,
    servicio: "indexnow",
    configurado: Boolean(claveConfigurada()),
    maxUrls: MAX_URLS,
    metodo: "POST",
    cuerpo: "{ urls: string[] }",
    autenticacion: "cabecera x-indexnow-key o parámetro ?key=",
    documentacion: "https://www.indexnow.org/documentation",
  });
}

export async function POST(req: Request) {
  const clave = claveConfigurada();
  if (!clave) {
    return NextResponse.json(
      { ok: false, error: "IndexNow no está configurado en este despliegue." },
      { status: 503 }
    );
  }

  let cuerpo: Cuerpo;
  try {
    cuerpo = (await req.json()) as Cuerpo;
  } catch {
    return NextResponse.json({ ok: false, error: "El cuerpo debe ser JSON." }, { status: 400 });
  }

  if (claveRecibida(req, cuerpo) !== clave) {
    return NextResponse.json({ ok: false, error: "Clave IndexNow inválida." }, { status: 401 });
  }

  if (!Array.isArray(cuerpo.urls) || cuerpo.urls.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Falta `urls`: un array con al menos una URL." },
      { status: 400 }
    );
  }

  if (cuerpo.urls.length > MAX_URLS) {
    return NextResponse.json(
      {
        ok: false,
        error: `Máximo ${MAX_URLS} URLs por envío.`,
        recibidas: cuerpo.urls.length,
      },
      { status: 400 }
    );
  }

  const recibidas = cuerpo.urls.length;
  const urls = new Set<string>();
  for (const valor of cuerpo.urls) {
    if (typeof valor !== "string") continue;
    const url = normalizar(valor);
    if (url) urls.add(url);
  }
  const lista = [...urls];

  if (lista.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `Ninguna URL pertenece a https://${CANONICAL_HOST}.`,
        recibidas,
      },
      { status: 400 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT_INDEXNOW, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: CANONICAL_HOST,
        key: clave,
        keyLocation: `https://${CANONICAL_HOST}/${clave}.txt`,
        urlList: lista,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo contactar api.indexnow.org.",
        detalle: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }

  // IndexNow responde 200 (aceptado) o 202 (aceptado, clave aún en validación).
  const aceptado = upstream.status === 200 || upstream.status === 202;
  const detalle = aceptado ? "" : (await upstream.text().catch(() => "")).slice(0, 300);

  return NextResponse.json(
    {
      ok: aceptado,
      recibidas,
      enviadas: lista.length,
      omitidas: recibidas - lista.length,
      estadoIndexNow: upstream.status,
      ...(detalle ? { detalle } : {}),
    },
    { status: aceptado ? 200 : 502 }
  );
}
