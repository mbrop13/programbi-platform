"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  COMMUNITY_CLASS_LEVELS,
  type CommunityClass,
} from "@/lib/comunidad/community-class";

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

function santiagoToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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
  return parseYmd(iso)
    .toLocaleDateString("es-CL", { month: "short", timeZone: "UTC" })
    .replace(".", "");
}

function rangeLabel(item: CommunityClass) {
  return `${item.startTime}–${item.endTime}`;
}

export default function CommunityCalendar({ classes }: { classes: CommunityClass[] }) {
  const today = useMemo(() => santiagoToday(), []);
  const sessions = useMemo(
    () =>
      [...classes].sort(
        (a, b) => a.classDate.localeCompare(b.classDate) || a.startTime.localeCompare(b.startTime)
      ),
    [classes]
  );
  const byDay = useMemo(() => {
    const map = new Map<string, CommunityClass[]>();
    for (const session of sessions) {
      const list = map.get(session.classDate) ?? [];
      list.push(session);
      map.set(session.classDate, list);
    }
    return map;
  }, [sessions]);
  const upcoming = sessions.filter((session) => session.classDate >= today);
  const next = upcoming[0] ?? null;
  const [visibleMonth, setVisibleMonth] = useState(() => monthKey(next?.classDate ?? today));
  const [selectedId, setSelectedId] = useState<string | null>(next?.id ?? null);
  const cells = monthCells(visibleMonth);
  const selected = sessions.find((session) => session.id === selectedId) ?? next;

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
              const daySessions = byDay.get(cell.iso) ?? [];
              const session = daySessions[0];
              const isSelected = !!session && daySessions.some((item) => item.id === selected?.id);
              const isToday = cell.iso === today;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!session}
                  onClick={() => session && setSelectedId(session.id)}
                  aria-label={session ? `${longDate(cell.iso)}, ${COMMUNITY_CLASS_LEVELS[session.level].label}` : undefined}
                  aria-pressed={isSelected}
                  className={`flex min-h-12 items-center justify-center rounded-2xl px-1 py-2 text-sm disabled:opacity-100 sm:min-h-16 ${
                    session?.level === "avanzada"
                      ? "bg-ink text-canvas"
                      : session
                        ? "bg-canvas text-ink"
                        : cell.inMonth
                          ? "text-ink"
                          : "text-faint/50"
                  } ${session ? "cursor-pointer" : "cursor-default"} ${
                    isSelected ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
                  } ${isToday && !session ? "ring-1 ring-ink/30" : ""}`}
                >
                  <span
                    className={`font-semibold tabular-nums ${
                      session?.level === "avanzada" ? "text-canvas" : ""
                    }`}
                  >
                    {cell.day}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-mute">
            <span className="inline-flex items-center gap-2">
              <span className="size-4 rounded-md border border-line bg-canvas" />
              Clase
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-4 rounded-md bg-ink" />
              Clase avanzada
            </span>
          </div>
        </div>

        <div className="border-t border-line bg-canvas/60 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
          {selected ? (
            <>
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                {selected.id === next?.id ? "Próxima clase" : "Clase"}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{longDate(selected.classDate)}</p>
              <p className="mt-3 inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">
                {COMMUNITY_CLASS_LEVELS[selected.level].label}
              </p>
              <p className="mt-4 text-sm font-semibold text-ink">{rangeLabel(selected)} · 2 horas</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {selected.topic || COMMUNITY_CLASS_LEVELS[selected.level].body}
              </p>
              {selected.id === next?.id ? (
                <p className="mt-4 text-sm leading-relaxed text-ink">
                  Esta es la próxima clase publicada. La suscripción de cada persona parte el día de su primera clase.
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Próxima clase</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink">Sin fechas todavía</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                Las clases de 2 horas aparecen acá cuando se publican en el admin, como Clase o Clase avanzada.
              </p>
            </>
          )}

          {upcoming.length > 0 ? (
            <ol className="mt-8 divide-y divide-line border-y border-line">
              {upcoming.slice(0, 6).map((session) => {
                const active = session.id === selected?.id;
                return (
                  <li key={session.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(session.id);
                        setVisibleMonth(monthKey(session.classDate));
                      }}
                      className={`flex w-full items-center gap-4 py-3 text-left ${active ? "text-ink" : "text-mute"}`}
                    >
                      <span className="w-12 shrink-0">
                        <span className="block text-lg font-bold tabular-nums leading-none text-ink">
                          {parseYmd(session.classDate).getUTCDate()}
                        </span>
                        <span className="mt-1 block text-[11px] uppercase tracking-widest">
                          {shortMonth(session.classDate)}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">
                          {COMMUNITY_CLASS_LEVELS[session.level].label}
                        </span>
                        <span className="block text-xs">2 horas · {rangeLabel(session)}</span>
                      </span>
                      {session.id === next?.id ? (
                        <span className="rounded-full bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-canvas">
                          Próxima
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
      </div>
    </div>
  );
}
