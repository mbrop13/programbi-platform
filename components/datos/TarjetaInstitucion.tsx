import Link from "@/components/datos/EnlaceNavegacionDatos";
import { entero } from "@/lib/datos/formato";
import type { TarjetaInstitucionDatos } from "@/lib/datos/instituciones-paginas";
import { cn } from "@/lib/utils";

export type { TarjetaInstitucionDatos };


const TIPO_LARGO = { U: "Universidad", IP: "Instituto profesional", CFT: "Centro de formación técnica" };

/**
 * Tarjeta de institución con foto real de campus. Sin foto con licencia libre, se usa un bloque
 * con la sigla en el color de la institución (nunca una foto de otra institución).
 */
export function TarjetaInstitucion({ inst, className }: { inst: TarjetaInstitucionDatos; className?: string }) {
  const contenido = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-wash">
        {inst.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={inst.foto.srcSm}
            alt={inst.foto.alt}
            width={480}
            height={300}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: inst.color }}
            aria-hidden="true"
          >
            <span className="font-display text-4xl font-extrabold tracking-tight text-white">
              {inst.sigla.replace(/^(IP|CFT) /, "")}
            </span>
          </div>
        )}
        {inst.acreditacion ? (
          <span className="sticker absolute top-3 left-3 bg-white text-xs text-foreground">
            {inst.acreditacion} años de acreditación
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <h3 className="font-display text-lg leading-tight font-bold text-foreground group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
            {inst.nombre}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {TIPO_LARGO[inst.tipo]}
            {inst.ciudad ? ` · ${inst.ciudad}` : ""}
          </p>
        </div>
        {inst.programas ? (
          <p className="text-sm text-foreground">
            <strong className="font-display text-xl font-extrabold tabular-nums">
              {entero(inst.programas)}
            </strong>{" "}
            programas
            {inst.carreras ? (
              <span className="text-muted-foreground"> · {inst.carreras} carreras</span>
            ) : null}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Sin oferta propia en 2026</p>
        )}
      </div>
    </>
  );

  const base = cn(
    "group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white",
    className
  );

  if (!inst.slug) {
    return <div className={base}>{contenido}</div>;
  }

  return (
    <Link
      href={`/datos/carreras/instituciones/${inst.slug}`}
      className={cn(base, "transition-colors hover:border-foreground")}
    >
      {contenido}
    </Link>
  );
}
