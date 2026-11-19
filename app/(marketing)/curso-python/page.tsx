import { permanentRedirect } from "next/navigation";

/**
 * Canibalización resuelta: la URL canónica es /cursos/python.
 * La regla 301 vive además en vercel.json y next.config.ts; este
 * `permanentRedirect` cubre previews, dev y entornos sin configuración.
 */
export default function Page(): never {
  permanentRedirect("/cursos/python");
}
