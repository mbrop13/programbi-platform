"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Miércoles, bloque vespertino de ProgramBI: 19:30 a 21:30 son 2 horas. */
const CLASS_WEEKDAY = 3;
const TIME_LABEL = "19:30–21:30";
const WEEKS_AHEAD = 16;

type Level = "clase" | "avanzada";

type Session = {
  iso: string;
  level: Level;
};

const LEVELS: Record<Level, { label: string; body: string }> = {
  clase: {
    label: "Clase",
    body: "Informes comerciales, control de gestión, proyectos e informes financieros.",
  },
  avanzada: {
    label: "Avanzada",
    body: "El mismo terreno de decisión, con Power BI, Python y SQL Server en un nivel más alto.",
  },
};

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function parseYmd(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatYmd(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(iso: string, days: number) {
  const date = parseYmd(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return formatYmd(date);
}

function santiagoToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildSessions(today: string): Session[] {
  const delta = (CLASS_WEEKDAY - parseYmd(today).getUTCDay() + 7) % 7;
  let cursor = addDays(today, delta);
  const sessions: Session[] = [];
  for (let index = 0; index < WEEKS_AHEAD; index += 1) {
    sessions.push({ iso: cursor, level: index % 2 === 0 ? "clase" : "avanzada" });
    cursor = addDays(cursor, 7);
  }
  return sessions;
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function shiftMonth(key: string, amount: number) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthCells(key: string) {
  const [year, month] = key.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const start = new Date(first);
  start.setUTCDate(1 - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const iso = formatYmd(date);
    return { iso, inMonth: iso.startsWith(key), day: date.getUTCDate() };
  });
}

function longDate(iso: string) {
  const label = parseYmd(iso).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function monthTitle(key: string) {
  const label = parseYmd(`${key}-01`).toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function shortMonth(iso: string) {
  return parseYmd(iso).toLocaleDateString("es-CL", { month: "short", timeZone: "UTC" }).replace(".", "");
}

export default function CommunityCalendar() {
  const today = useMemo(() => santiagoToday(), []);
  const sessions = useMemo(() => buildSessions(today), [today]);
  const byDay = useMemo(() => new Map(sessions.map((session) => [session.iso, session])), [sessions]);
  const next = sessions[0];
  const [visibleMonth, setVisibleMonth] = useState(() => monthKey(next.iso));
  const [selectedIso, setSelectedIso] = useState(next.iso);
  const selected = byDay.get(selectedIso) ?? next;
  const cells = monthCells(visibleMonth);
  const upcoming = sessions.slice(0, 6);

  return (
    <div className="overflow-hidden rounded-[26px] border border-line bg-paper shadow-[0_20px_60px_rgba(23,23,22,0.06)]">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{monthTitle(visibleMonth)}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Mes anterior"
                onClick={() => setVisibleMonth((month) => shiftMonth(month, -1))}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Mes siguiente"
                onClick={() => setVisibleMonth((month) => shiftMonth(month, 1))}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-widest text-mute">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="py-2">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              const session = byDay.get(cell.iso);
              const isSelected = cell.iso === selected.iso;
              const isToday = cell.iso === today;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!session}
                  onClick={() => session && setSelectedIso(cell.iso)}
                  aria-label={session ? `${longDate(cell.iso)}, ${LEVELS[session.level].label}` : undefined}
                  aria-pressed={isSelected}
                  className={`flex min-h-12 flex-col items-center justify-center rounded-2xl px-1 py-2 text-sm sm:min-h-16 ${
                    cell.inMonth ? "text-ink" : "text-faint/50"
                  } ${session ? "cursor-pointer" : "cursor-default"} ${
                    isSelected ? "bg-ink text-canvas" : session ? "bg-canvas" : ""
                  } ${isToday && !isSelected ? "ring-1 ring-ink/30" : ""}`}
                >
                  <span className="font-semibold tabular-nums">{cell.day}</span>
                  {session ? (
                    <span
                      className={`mt-1 size-1.5 rounded-full ${
                        isSelected ? "bg-canvas" : session.level === "avanzada" ? "bg-transparent ring-2 ring-ink" : "bg-ink"
                      }`}
                    />
                  ) : (
                    <span className="mt-1 size-1.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-mute">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-ink" />
              Clase
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full ring-2 ring-ink" />
              Avanzada
            </span>
            <span>Miércoles · {TIME_LABEL} · 2 horas · hora de Chile</span>
          </div>
        </div>

        <div className="border-t border-line bg-canvas/60 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Próxima clase</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{longDate(selected.iso)}</p>
          <p className="mt-3 inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">
            {LEVELS[selected.level].label}
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">
            {TIME_LABEL} · 2 horas
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mute">{LEVELS[selected.level].body}</p>
          {selected.iso === next.iso ? (
            <p className="mt-4 text-sm leading-relaxed text-ink">
              Esta es la próxima en el calendario. La suscripción de cada persona parte el día de su primera clase.
            </p>
          ) : null}

          <ol className="mt-8 divide-y divide-line border-y border-line">
            {upcoming.map((session) => {
              const active = session.iso === selected.iso;
              return (
                <li key={session.iso}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIso(session.iso);
                      setVisibleMonth(monthKey(session.iso));
                    }}
                    className={`flex w-full items-center gap-4 py-3 text-left ${active ? "text-ink" : "text-mute"}`}
                  >
                    <span className="w-12 shrink-0">
                      <span className="block text-lg font-bold tabular-nums leading-none text-ink">
                        {parseYmd(session.iso).getUTCDate()}
                      </span>
                      <span className="mt-1 block text-[11px] uppercase tracking-widest">{shortMonth(session.iso)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{LEVELS[session.level].label}</span>
                      <span className="block text-xs">2 horas · {TIME_LABEL}</span>
                    </span>
                    {session.iso === next.iso ? (
                      <span className="rounded-full bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-canvas">
                        Próxima
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
