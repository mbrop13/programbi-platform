import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EnResumenProps {
  frases: readonly string[];
  titulo?: string;
  fuente?: string;
  id?: string;
  className?: string;
}

export function EnResumen({
  frases,
  titulo = "En resumen",
  fuente,
  id = "en-resumen-titulo",
  className,
}: EnResumenProps) {
  if (frases.length === 0) return null;

  return (
    <Card
      aria-labelledby={id}
      className={cn(
        "prose-datos gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0",
        className
      )}
    >
      <CardHeader className="px-6 pb-0">
        <CardTitle
          id={id}
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
        >
          <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-muted-foreground">
        {frases.map((frase) => (
          <p key={frase} className="text-foreground/85">
            {frase}
          </p>
        ))}
        {fuente ? (
          <p className="pt-2 text-xs text-muted-foreground">{fuente}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
