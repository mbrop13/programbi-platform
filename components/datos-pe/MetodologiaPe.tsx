import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetaCarrerasPe } from "@/lib/datos-pe/types";

export interface MetodologiaPeProps {
  meta: MetaCarrerasPe;
  className?: string;
}

export function MetodologiaPe({ meta, className }: MetodologiaPeProps) {
  return (
    <Card id="metodologia" className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Metodología y fuentes oficiales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Muestra ENAHO (INEI):</strong> pool de 3
            años ({meta.periodoEnaho}), considerando egresados completos entre 25 y 40 años. Se
            suma el ingreso laboral de la ocupación principal y secundaria.
          </li>
          <li>
            <strong className="font-medium text-foreground">Deflación y ponderación:</strong> todos
            los montos se expresan en soles constantes de 2024 deflactados con el IPC de Lima
            Metropolitana del BCRP (serie <code className="text-xs">PN01271PM</code>), usando el
            ponderador anualizado <code className="text-xs">fac500a / 3</code>.
          </li>
          <li>
            <strong className="font-medium text-foreground">Regla de publicación e IC90:</strong>{" "}
            solo se publican familias con muestra mínima <code className="text-xs">n ≥ 100</code>{" "}
            y coeficiente de variación de la mediana <code className="text-xs">CV ≤ 15 %</code>. Los
            intervalos de confianza al 90 % (<code className="text-xs">IC90</code>) se calculan por
            bootstrap.
          </li>
          <li>
            <strong className="font-medium text-foreground">Formalidad (% con pensión):</strong>{" "}
            debido a la ausencia de la variable <code className="text-xs">ocupinf</code> en los
            microdatos ENAHO 2024, se reporta el porcentaje de ocupados afiliados a un sistema de
            pensiones (AFP u ONP) como indicador observable de formalidad.
          </li>
          <li>
            <strong className="font-medium text-foreground">Cruce MTPE-DISEL (3 dígitos):</strong>{" "}
            remuneración promedio mensual en planilla privada formal para jóvenes de 18 a 29 años (
            {meta.periodoMtpe}). Cuando no existe cruce publicado para la familia, se indica{" "}
            <em>sin dato MTPE</em>.
          </li>
          <li>
            <strong className="font-medium text-foreground">Límites de EDO 2026 y SUNEDU:</strong>{" "}
            la Encuesta de Demanda Ocupacional (EDO 2026) solo publica el top 10 de familias
            demandadas (las restantes figuran como <em>fuera del top 10 EDO</em>). El padrón de
            SUNEDU (corte {meta.corteSunedu}) entrega un conteo aproximado de universidades
            licenciadas por familia de carrera, sin datos de matrícula por programa.
          </li>
        </ul>

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
            Fuentes oficiales consultadas (corte {meta.fechaCorte})
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {meta.fuentes.map((f) => (
              <li key={f.id}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline"
                >
                  <span>{f.nombre}</span>
                  <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
