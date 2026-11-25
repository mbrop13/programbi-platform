import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { porcentaje, soles } from "@/lib/datos-pe/formato";
import type { CarreraPe } from "@/lib/datos-pe/types";

export interface FormalVsRealPeProps {
  carreras: readonly CarreraPe[];
  className?: string;
}

export function FormalVsRealPe({ carreras, className }: FormalVsRealPeProps) {
  const comparables = carreras
    .filter((c) => c.mtpe.nacional !== null)
    .sort((a, b) => b.enaho.mediana - a.enaho.mediana)
    .slice(0, 8);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Sueldo formal vs. sueldo real: por qué ENAHO y MTPE muestran cifras distintas
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          ENAHO (INEI) mide la <strong className="font-medium text-foreground">mediana</strong> de
          ingreso laboral mensual entre egresados de <strong className="font-medium text-foreground">25 a 40 años</strong>{" "}
          e incluye trabajo dependiente e independiente. La Planilla Electrónica del MTPE mide el{" "}
          <strong className="font-medium text-foreground">promedio</strong> de jóvenes de{" "}
          <strong className="font-medium text-foreground">18 a 29 años</strong> en planilla privada
          formal. Ambos indicadores se complementan y no deben compararse como si midieran al mismo
          grupo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <p className="font-semibold text-foreground">Ingreso real total (INEI ENAHO 2022–2024)</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Incluye empleo formal, informal e independientes (25–40 años, soles de 2024). Usa
              mediana para evitar que pocos sueldos muy altos distorsionen el valor típico.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <p className="font-semibold text-foreground">Planilla formal privada (MTPE nov-2022 a oct-2023)</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Solo trabajadores dependientes en planilla privada formal de 18 a 29 años. No
              captura independientes ni sector público en la serie 2023.
            </p>
          </div>
        </div>

        <Table className="tabular-nums">
          <caption className="sr-only">
            Comparación referencial entre mediana real ENAHO y promedio formal MTPE
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead>Carrera</TableHead>
              <TableHead className="text-right">Mediana real ENAHO (25–40)</TableHead>
              <TableHead className="text-right">Promedio formal MTPE (18–29)</TableHead>
              <TableHead className="text-right">% con pensión (ENAHO)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparables.map((c) => (
              <TableRow key={c.slug}>
                <TableCell className="font-medium">
                  <Link
                    href={`/pe/datos/carreras/${c.slug}`}
                    className="hover:text-blue-700 hover:underline"
                  >
                    {c.nombre}
                  </Link>
                </TableCell>
                <TableCell className="text-right font-semibold">{soles(c.enaho.mediana)}</TableCell>
                <TableCell className="text-right">
                  {c.mtpe.nacional !== null ? soles(c.mtpe.nacional) : "sin dato MTPE"}
                </TableCell>
                <TableCell className="text-right">{porcentaje(c.enaho.pctPension)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
