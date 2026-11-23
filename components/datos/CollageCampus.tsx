import { entero } from "@/lib/datos/formato";
import type { FotoInstitucion } from "@/lib/datos/instituciones-fotos";
import { cn } from "@/lib/utils";

export interface FotoCollage {
  key: string;
  nombre: string;
  foto: FotoInstitucion;
}

/**
 * Collage de portada del hub de carreras: fotos reales de campus (Wikimedia Commons, licencia libre)
 * con el nombre de cada institución como sticker. La primera foto es la protagonista (LCP).
 */
export function CollageCampus({
  fotos,
  carreras,
  programas,
}: {
  fotos: readonly FotoCollage[];
  carreras: number;
  programas: number;
}) {
  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col justify-end gap-2 rounded-[1.75rem] bg-carreras p-8 text-white">
        <span className="font-display text-6xl font-extrabold tracking-tight">{carreras}</span>
        <span className="text-lg font-medium">carreras con sueldos y empleabilidad oficiales</span>
      </div>
    );
  }

  const [principal, ...resto] = fotos;

  return (
    <figure className="m-0 min-w-0">
      <div
        className={cn(
          "grid gap-3",
          resto.length > 0 ? "grid-cols-[1.45fr_1fr] grid-rows-2" : "grid-cols-1"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] bg-wash",
            resto.length > 0 ? "row-span-2 aspect-[4/5] sm:aspect-auto sm:min-h-[340px]" : "aspect-[16/10]"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={principal.foto.src}
            alt={principal.foto.alt}
            width={1200}
            height={750}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="sticker absolute bottom-4 left-4 bg-white text-sm text-foreground">
            {principal.nombre}
          </span>
        </div>

        {resto.map((item, i) => (
          <div key={item.key} className="relative overflow-hidden rounded-[1.5rem] bg-wash">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.foto.srcSm}
              alt={item.foto.alt}
              width={480}
              height={300}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className={cn(
                "sticker absolute bottom-3 left-3 bg-white text-xs text-foreground",
                i % 2 === 1 && "rotate-[2deg]"
              )}
            >
              {item.nombre}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="sticker bg-carreras text-[15px] text-white">{carreras} carreras</span>
        <span className="sticker rotate-[2deg] bg-resalte text-[15px] text-foreground">
          {entero(programas)} programas 2026
        </span>
      </div>

      <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Fotos vía Wikimedia Commons:{" "}
        {fotos.map((f, i) => (
          <span key={f.key}>
            <a href={f.foto.fuenteUrl} className="underline underline-offset-2 hover:text-foreground">
              {f.nombre}
            </a>{" "}
            ({f.foto.autor}, {f.foto.licencia}){i < fotos.length - 1 ? "; " : "."}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
