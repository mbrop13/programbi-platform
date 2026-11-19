import { permanentRedirect } from "next/navigation";

/**
 * Canibalización FAQ resuelta: la URL canónica de preguntas frecuentes es
 * /preguntas-frecuentes (SSR con contenido de lib/faq/contenido.ts).
 * La regla 301 vive además en vercel.json y next.config.ts.
 */
export default function Page(): never {
  permanentRedirect("/preguntas-frecuentes");
}
