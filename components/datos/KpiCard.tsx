import { cn } from "@/lib/utils";

export interface KpiCardProps {
  valor: string;
  etiqueta: string;
  delta?: string | null;
  fuente?: string;
  subtitulo?: string;
  variante?: "default" | "primary" | "accent";
  className?: string;
}

const VARIANTE_BORDE: Record<NonNullable<KpiCardProps["variante"]>, string> = {
  default: "border-[#e2e2dc]",
  primary: "border-[#e2e2dc] border-t-4 border-t-[#1890ff]",
  accent: "border-[#e2e2dc] border-t-4 border-t-[#f99c00]",
};

const VARIANTE_VALOR: Record<NonNullable<KpiCardProps["variante"]>, string> = {
  default: "text-[#171716]",
  primary: "text-[#1063b8]",
  accent: "text-[#171716]",
};

export function KpiCard({
  valor,
  etiqueta,
  delta,
  fuente,
  subtitulo,
  variante = "default",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border bg-white p-5 shadow-2xs",
        VARIANTE_BORDE[variante],
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-[#5c5c58] uppercase">
            {etiqueta}
          </p>
          {delta ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-[#e2e2dc] bg-[#f3f3f0] px-2.5 py-0.5 text-xs font-semibold text-[#171716] tabular-nums">
              {delta}
            </span>
          ) : null}
        </div>
        <p
          className={cn(
            "mt-2.5 text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl",
            VARIANTE_VALOR[variante]
          )}
        >
          {valor}
        </p>
        {subtitulo ? (
          <p className="mt-1.5 text-xs leading-relaxed text-[#5c5c58]">{subtitulo}</p>
        ) : null}
      </div>
      {fuente ? (
        <p className="mt-3 border-t border-[#f0f0ec] pt-2.5 text-[11px] text-[#5c5c58]">
          {fuente}
        </p>
      ) : null}
    </div>
  );
}
