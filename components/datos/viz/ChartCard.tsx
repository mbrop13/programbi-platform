import type { ReactNode } from "react";
import { C } from "./tokens";

/**
 * ChartCard — marco de gráfico estilo OWID (server component).
 * Header con título-pregunta y subtítulo (unidad + período), el gráfico como
 * children (isla cliente con skeleton de la misma altura o SVG server) y pie
 * con fuente · licencia · descarga CSV · acciones (compartir) · ver tabla.
 */
export interface ChartCardProps {
  title: string;
  subtitle?: string;
  source: string;
  license?: string;
  csvHref?: string;
  tableId?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const LINK_FOCUS =
  "rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2";

const linkStyle = { color: C.blueText, outlineColor: C.blueText } as const;

export function ChartCard({
  title,
  subtitle,
  source,
  license,
  csvHref,
  tableId,
  children,
  actions,
}: ChartCardProps) {
  return (
    <figure
      className="m-0 rounded-2xl border p-4 sm:p-5"
      style={{ backgroundColor: C.card, borderColor: C.line }}
    >
      <figcaption>
        <h3
          className="text-base font-semibold leading-snug sm:text-lg"
          style={{ color: C.ink }}
        >
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs sm:text-[13px]" style={{ color: C.mute }}>
            {subtitle}
          </p>
        ) : null}
      </figcaption>

      {/* El gráfico reserva su propia altura (skeleton de la misma altura en
          islas cliente diferidas) para no producir CLS. */}
      <div className="mt-4">{children}</div>

      <div
        className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t pt-3 text-xs"
        style={{ borderColor: C.line, color: C.mute }}
      >
        <span>Fuente: {source}</span>
        {license ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{license}</span>
          </>
        ) : null}
        {csvHref ? (
          <>
            <span aria-hidden="true">·</span>
            <a href={csvHref} download className={LINK_FOCUS} style={linkStyle}>
              Descargar CSV
            </a>
          </>
        ) : null}
        {actions ? (
          <>
            <span aria-hidden="true">·</span>
            {actions}
          </>
        ) : null}
        {tableId ? (
          <>
            <span aria-hidden="true">·</span>
            <a href={`#${tableId}`} className={LINK_FOCUS} style={linkStyle}>
              Ver tabla
            </a>
          </>
        ) : null}
      </div>
    </figure>
  );
}
