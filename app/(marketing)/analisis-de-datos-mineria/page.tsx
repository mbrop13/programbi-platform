import { permanentRedirect } from "next/navigation";

/**
 * Canibalización resuelta: la landing B2B/industria canónica de minería es
 * /power-bi-mineria-chile (y el curso vive en /cursos/analitica-mineria).
 * La regla 301 vive además en vercel.json y next.config.ts.
 */
export default function Page(): never {
  permanentRedirect("/power-bi-mineria-chile");
}
