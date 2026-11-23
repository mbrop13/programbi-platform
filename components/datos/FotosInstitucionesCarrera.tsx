import Link from "@/components/datos/EnlaceNavegacionDatos";
import { getFotoInstitucion } from "@/lib/datos/instituciones-fotos";
import { getInstitucionVisual } from "@/lib/datos/instituciones-visual";
import { slugInstitucion } from "@/lib/datos/instituciones-paginas";

/**
 * Cabecera visual de la ficha de carrera: fotos reales de campus de instituciones que la imparten.
 * Reemplaza el ícono genérico del área por algo propio de cada carrera.
 */
export function FotosInstitucionesCarrera({
  instituciones,
  total,
}: {
  instituciones: readonly { institucion: string; tipo: string }[];
  total: number;
}) {
  const vistos = new Set<string>();
  const conFoto = instituciones.flatMap((i) => {
    const visual = getInstitucionVisual(i.institucion, i.tipo.toUpperCase());
    if (vistos.has(visual.key)) return [];
    vistos.add(visual.key);
    const foto = getFotoInstitucion(visual.key);
    return foto ? [{ visual, foto, slug: slugInstitucion(visual.key) }] : [];
  });
  const muestra = conFoto.slice(0, 3);

  if (muestra.length === 0) {
    return (
      <a
        href="#instituciones"
        className="flex min-h-[140px] w-full flex-col justify-end rounded-[1.5rem] bg-carreras p-5 text-white sm:w-[260px]"
      >
        <span className="font-display text-4xl font-extrabold">{total}</span>
        <span className="text-[15px] font-medium">
          {total === 1 ? "institución la imparte" : "instituciones la imparten"}
        </span>
      </a>
    );
  }

  return (
    <figure className="m-0 w-full sm:w-[300px] lg:w-[340px]">
      <div className="flex h-[150px] gap-2">
        {muestra.map(({ visual, foto, slug }, i) => {
          const contenido = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.srcSm}
                alt={foto.alt}
                width={480}
                height={300}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
              <span className="sticker absolute bottom-2 left-2 bg-white text-[11px] text-foreground">
                {visual.nombreCorto}
              </span>
            </>
          );
          const clase =
            "group relative min-w-0 flex-1 overflow-hidden rounded-[1.1rem] bg-wash first:flex-[1.6]";
          return slug ? (
            <Link key={visual.key} href={`/datos/carreras/instituciones/${slug}`} className={clase}>
              {contenido}
            </Link>
          ) : (
            <div key={visual.key} className={clase}>
              {contenido}
            </div>
          );
        })}
      </div>
      <figcaption className="mt-2 flex items-center justify-between gap-3 text-sm">
        <a href="#instituciones" className="font-semibold text-foreground underline decoration-2 underline-offset-4 hover:text-blue-700">
          {total === 1 ? "La imparte 1 institución" : `La imparten ${total} instituciones`}
        </a>
      </figcaption>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        Fotos vía Wikimedia Commons:{" "}
        {muestra.map(({ visual, foto }, i) => (
          <span key={visual.key}>
            <a href={foto.fuenteUrl} className="underline underline-offset-2 hover:text-foreground">
              {foto.autor}
            </a>{" "}
            ({foto.licencia}){i < muestra.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
    </figure>
  );
}
