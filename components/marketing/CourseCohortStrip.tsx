"use client";

import { useMemo } from "react";
import {
  type CourseSchedule,
  OPEN_COHORT_LABEL,
  nextCohortForCourse,
} from "@/lib/data/course-schedules";
import { conHoraPais } from "@/lib/paises/horarios";

export function CourseCohortStrip({
  pending,
  startLabel,
  days,
  time,
  compact = false,
  medium = false,
}: {
  pending: boolean;
  startLabel: string | null;
  days: string | null;
  time: string | null;
  compact?: boolean;
  /** 2×2, entre la ficha compacta y la tira ancha. */
  medium?: boolean;
}) {
  const facts = [
    { label: "Modalidad", value: "En vivo", pending: false },
    { label: "Días de clases", value: days ?? "Por confirmar", pending },
    { label: "Horario", value: time ?? "Por confirmar", pending },
    { label: "Certificado", value: "Al finalizar", pending: false },
  ];

  const tight = compact || medium;

  return (
    <div className={tight ? "" : "mt-4"} aria-live="polite" data-cohort-strip="">
      <p className={medium ? "mb-2.5 text-sm text-ink" : compact ? "mb-2 text-xs text-ink" : "mb-2 text-sm text-ink"}>
        <span className="font-semibold">Inicio de clases</span>
        {pending ? (
          <span className="ml-2 inline-block h-3 w-28 animate-pulse rounded-full bg-wash align-middle" />
        ) : startLabel ? (
          <span className="text-mute"> · {startLabel}</span>
        ) : null}
      </p>
      <div
        className={
          medium
            ? "overflow-hidden rounded-2xl border border-line bg-canvas"
            : compact
              ? "overflow-hidden rounded-[1.25rem] border border-line bg-canvas"
              : "overflow-hidden rounded-[1.75rem] border border-line bg-paper sm:rounded-full"
        }
      >
        <dl className={tight ? "grid grid-cols-2" : "grid grid-cols-2 sm:grid-cols-4"}>
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`flex flex-col items-center justify-center text-center ${
                medium ? "min-h-[4.25rem] px-3 py-3" : compact ? "min-h-[3.5rem] px-2 py-2.5" : "min-h-[4.25rem] px-3 py-3"
              } ${index % 2 === 0 ? "border-r border-line" : ""} ${
                index < 2 ? "border-b border-line" : ""
              } ${!tight && index % 2 === 0 ? "sm:border-r-0" : ""} ${
                !tight && index < 2 ? "sm:border-b-0" : ""
              } ${!tight && index > 0 ? "sm:border-l sm:border-line" : ""}`}
            >
              <dt className={medium ? "text-xs font-medium text-mute" : "text-[11px] font-medium text-mute"}>{fact.label}</dt>
              {fact.pending ? (
                <dd className="mt-1.5 h-4 w-16 animate-pulse rounded-full bg-wash" />
              ) : (
                <dd className={medium ? "mt-1 text-[15px] font-semibold leading-snug text-ink" : "mt-0.5 text-sm font-semibold leading-snug text-ink"}>{fact.value}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function CourseCohortFacts({
  slug,
  schedules,
  timeZone,
  pais,
  loaded,
  compact = false,
  medium = false,
  openLabel = OPEN_COHORT_LABEL,
}: {
  slug: string;
  schedules: CourseSchedule[];
  timeZone: string;
  /** Si el país tiene precio propio, el horario dice "hora de Perú". */
  pais?: string;
  loaded: boolean;
  compact?: boolean;
  medium?: boolean;
  /** Texto cuando no hay cohorte futura. null = solo "Inicio de clases". */
  openLabel?: string | null;
}) {
  const next = useMemo(
    () => (schedules.length ? nextCohortForCourse(slug, schedules, timeZone) : null),
    [slug, schedules, timeZone]
  );

  return (
    <CourseCohortStrip
      compact={compact}
      medium={medium}
      pending={!loaded && !next}
      startLabel={next?.date ?? openLabel}
      days={next?.days ?? null}
      time={next?.time ? conHoraPais(pais, next.time) : null}
    />
  );
}
