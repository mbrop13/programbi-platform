import { esIsoPais, getPais, ISO_CHILE, normalizarPais, PAISES, PAISES_CARPETA } from "@/config/paises";
import { absoluteUrl } from "@/lib/seo";

/** Rutas con versión por país. El resto (blog, empleos, comunidad, pago) no lleva carpeta. */
const RAICES = [
  "/cursos",
  "/empresas",
  "/faq",
  "/nosotros",
  "/implementacion-power-bi",
  "/migrar-excel-a-power-bi",
  "/por-que-fallan-proyectos-power-bi",
  "/curso-power-bi-vs-pack-adopcion",
];

export function esRutaLocalizable(path: string): boolean {
  if (path === "/") return true;
  if (RAICES.some((raiz) => path === raiz)) return true;
  const partes = path.split("/").filter(Boolean);
  return partes.length === 2 && partes[0] === "cursos";
}

export function quitarPais(pathname: string): string {
  const partes = pathname.split("?")[0]?.split("#")[0] || "/";
  const seg = partes.split("/").filter(Boolean)[0];
  if (!seg || seg === ISO_CHILE || !esIsoPais(seg)) return partes || "/";
  const resto = partes.slice(seg.length + 1);
  return resto === "" ? "/" : resto;
}

export function paisDesdeRuta(pathname: string | null | undefined): string | null {
  const seg = (pathname || "/").split("?")[0]?.split("/").filter(Boolean)[0];
  if (!seg || seg === ISO_CHILE) return null;
  return esIsoPais(seg) ? seg : null;
}

/** Home, fichas, guías y el checkout. En estas rutas el país lo marca la URL, no localStorage. */
export function esRutaComercial(pathname: string | null | undefined): boolean {
  const limpio = quitarPais(pathname || "/");
  if (limpio === "/pago" || limpio.startsWith("/pago/")) return true;
  return esRutaLocalizable(limpio);
}

export function rutaLocal(iso: string | null | undefined, href: string): string {
  if (!href.startsWith("/")) return href;
  const pais = normalizarPais(iso);
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const sinHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = sinHash.indexOf("?");
  const query = queryAt >= 0 ? sinHash.slice(queryAt) : "";
  const path = queryAt >= 0 ? sinHash.slice(0, queryAt) : sinHash;
  if (!esRutaLocalizable(path)) return href;
  if (pais === ISO_CHILE) return href;
  const prefijo = path === "/" ? `/${pais}` : `/${pais}${path}`;
  return `${prefijo}${query}${hash}`;
}

export function cambiarPais(pathname: string, iso: string): string {
  const destino = normalizarPais(iso);
  const actual = paisDesdeRuta(pathname);
  const hashAt = pathname.indexOf("#");
  const hash = hashAt >= 0 ? pathname.slice(hashAt) : "";
  const sinHash = hashAt >= 0 ? pathname.slice(0, hashAt) : pathname;
  const queryAt = sinHash.indexOf("?");
  const query = queryAt >= 0 ? sinHash.slice(queryAt) : "";
  let path = queryAt >= 0 ? sinHash.slice(0, queryAt) : sinHash;
  if (actual) {
    path = path.slice(actual.length + 1);
    if (!path) path = "/";
  }
  if (!esRutaLocalizable(path)) {
    return destino === ISO_CHILE ? `/${query ? `?${query.slice(1)}` : ""}` : `/${destino}`;
  }
  return `${rutaLocal(destino, path)}${query}${hash}`;
}

export function hreflangDe(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(path),
  };
  for (const pais of PAISES) {
    languages[pais.idioma] = absoluteUrl(rutaLocal(pais.iso, path));
  }
  return languages;
}

export function localeOg(iso: string): string {
  return getPais(iso).idioma.replace("-", "_");
}

export function paramsCarpeta(): { pais: string }[] {
  return PAISES_CARPETA.map((pais) => ({ pais: pais.iso }));
}

export { PAISES_CARPETA };
