import { C, type DeltaDir } from "./tokens";

/**
 * StatTile — KPI compacto estilo levels.fyi (server component, sin interacción).
 * Cifra grande + mini-sparkline en la misma tarjeta. Pensado para grillas 2×2
 * compactas en móvil. Todos los colores salen de los tokens `C` (inline style);
 * el layout usa Tailwind. Sin CLS: el spark tiene altura fija.
 */
export interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
  delta?: { text: string; dir: DeltaDir; good?: boolean };
  spark?: number[];
}

const SPARK_W = 100;
const SPARK_H = 32; // altura fija (28–36px) para evitar CLS
const SPARK_PAD = 3; // margen vertical para que trazo y punto no se recorten

/** Normaliza la serie a coordenadas del viewBox y devuelve puntos + último punto. */
function sparkGeometry(data: number[]) {
  const finite = data.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return null;
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const span = max - min || 1;
  const innerH = SPARK_H - SPARK_PAD * 2;
  const n = finite.length;
  const pts = finite.map((v, i) => {
    const x = n === 1 ? SPARK_W / 2 : (i / (n - 1)) * SPARK_W;
    const y = SPARK_PAD + (1 - (v - min) / span) * innerH;
    return { x, y };
  });
  const points = pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  return { points, last: pts[pts.length - 1] };
}

function MiniSpark({ data, label }: { data: number[]; label: string }) {
  const geo = sparkGeometry(data);
  if (!geo) return null;
  return (
    <div className="relative h-8 min-w-0 flex-1">
      <svg
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        preserveAspectRatio="none"
        className="block h-full w-full overflow-visible"
        role="img"
        aria-label={`Tendencia de ${label}`}
      >
        <polyline
          points={geo.points}
          fill="none"
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Último punto: trazo casi nulo con cap redondo y non-scaling-stroke
            para que quede un círculo perfecto de r≈2.5px aunque el SVG escale
            de forma no uniforme (preserveAspectRatio="none"). */}
        <path
          d={`M ${geo.last.x.toFixed(2)} ${geo.last.y.toFixed(2)} h 0.01`}
          fill="none"
          stroke={C.blueText}
          strokeWidth={5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const DELTA_ARROW: Record<DeltaDir, string> = { up: "▲", down: "▼", flat: "→" };
const DELTA_WORD: Record<DeltaDir, string> = {
  up: "sube",
  down: "baja",
  flat: "sin cambio",
};

export function StatTile({ label, value, sub, delta, spark }: StatTileProps) {
  // Semántica del color: up=verde / down=rojo por defecto; good===false invierte.
  let deltaColor: string = C.mute;
  if (delta && delta.dir !== "flat") {
    const inverted = delta.good === false;
    const positive = delta.dir === "up" ? !inverted : inverted;
    deltaColor = positive ? C.up : C.down;
  }

  const hasSpark = Boolean(spark && spark.length > 0);

  return (
    <div
      className="rounded-[14px] border p-3.5 sm:p-4"
      style={{ backgroundColor: C.card, borderColor: C.line }}
    >
      <p className="text-xs font-medium" style={{ color: C.mute }}>
        {label}
      </p>
      <p
        className="mt-1 text-[26px] font-bold leading-tight tracking-tight tabular-nums sm:text-[30px]"
        style={{ color: C.ink }}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-xs" style={{ color: C.mute }}>
          {sub}
        </p>
      ) : null}
      {delta || hasSpark ? (
        <div className="mt-2 flex items-end gap-2">
          {delta ? (
            <p
              className="shrink-0 text-xs font-semibold tabular-nums"
              style={{ color: deltaColor }}
            >
              <span aria-hidden="true">{DELTA_ARROW[delta.dir]} </span>
              <span className="sr-only">{DELTA_WORD[delta.dir]}: </span>
              {delta.text}
            </p>
          ) : null}
          {spark && spark.length > 0 ? (
            <MiniSpark data={spark} label={label} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
