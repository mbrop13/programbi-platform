import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bloquesDeFicha } from "@/lib/data/seo-ficha";
import { ISO_CHILE, normalizarPais } from "@/config/paises";

/**
 * Bloques editoriales extra de la ficha de curso (servidor).
 *
 * Suma materia que el temario y las preguntas frecuentes no muestran: detalle
 * por clase, proyecto final, ruta laboral. El contenido vive en
 * `lib/data/seo-ficha/<slug>.ts` y solo usa datos del repo.
 *
 * Es contenido del mercado chileno (precio en CLP y hora de Chile), así que
 * se renderiza solo en la ficha raíz. Las fichas /<pais>/cursos/<slug> ya
 * tienen su propio bloque local con precio, horario y medios de pago.
 */
export default function FichaSeoExtra({ slug, pais }: { slug: string; pais: string }) {
  if (normalizarPais(pais) !== ISO_CHILE) return null;
  const bloques = bloquesDeFicha(slug);
  if (bloques.length === 0) return null;

  return (
    <section
      data-testid="ficha-seo-extra"
      aria-labelledby="ficha-seo-extra"
      className="border-t border-line bg-canvas px-5 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Programa y salida laboral
        </p>
        <h2
          id="ficha-seo-extra"
          className="mt-3 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {bloques[0]?.titulo}
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {bloques.map((bloque) => (
            <article key={bloque.titulo} className="rounded-[26px] border border-line bg-paper p-6">
              {bloque.eyebrow ? (
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                  {bloque.eyebrow}
                </p>
              ) : null}
              <h3 className="mt-2 text-lg font-bold tracking-tight text-ink">{bloque.titulo}</h3>

              {(bloque.parrafos ?? []).map((parrafo) => (
                <p key={parrafo} className="mt-3 text-sm leading-relaxed text-mute">
                  {parrafo}
                </p>
              ))}

              {bloque.bullets && bloque.bullets.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {bloque.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {bloque.enlaces && bloque.enlaces.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {bloque.enlaces.map((enlace) => (
                    <li key={enlace.href}>
                      <Link
                        href={enlace.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
                      >
                        {enlace.label}
                        <ArrowRight size={13} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
