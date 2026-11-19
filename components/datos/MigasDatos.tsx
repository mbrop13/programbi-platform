import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ChevronRight } from "lucide-react";
import type { MigajaDatos } from "@/lib/datos/seo-carreras";
import { cn } from "@/lib/utils";

export interface MigasDatosProps {
  migas: readonly MigajaDatos[];
  className?: string;
}

export function MigasDatos({ migas, className }: MigasDatosProps) {
  if (migas.length === 0) return null;

  return (
    <nav aria-label="Ruta de navegación" className={cn("text-xs text-muted-foreground sm:text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {migas.map((miga, idx) => {
          const esUltima = idx === migas.length - 1;
          return (
            <li key={miga.path} className="inline-flex items-center gap-1.5">
              {idx > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
              ) : null}
              {esUltima ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {miga.label}
                </span>
              ) : (
                <Link
                  href={miga.path}
                  className="transition-colors hover:text-foreground"
                >
                  {miga.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
