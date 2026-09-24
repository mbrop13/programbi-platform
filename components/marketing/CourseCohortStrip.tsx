"use client";

import { useMemo } from "react";
import {
  type CourseSchedule,
  OPEN_COHORT_LABEL,
  nextCohortForCourse,
} from "@/lib/data/course-schedules";

export function CourseCohortStrip({
  pending,
  startLabel,
  days,
  time,
  compact = false,
}: {
  pending: boolean;
  startLabel: string | null;
  days: string | null;
  time: string | null;
  compact?: boolean;
}) {
  const facts = [
    { label: "Modalidad", value: "En vivo", pending: false },
    { label: "Días de clases", value: days ?? "Por confirmar", pending },
    { label: "Horario", value: time ?? "Por confirmar", pending },
    { label: "Certificado", value: "Al finalizar", pending: false },
  ];

  return (
    <div className={compact ? "" : "mt-4"} aria-live="polite" data-cohort-strip="">
      <p className={compact ? "mb-2 text-xs text-ink" : "mb-2 text-sm text-ink"}>
        <span className="font-semibold">Próxima clase</span>
        {pending ? (
          <span className="ml-2 inline-block h-3 w-28 animate-pulse rounded-full bg-wash align-middle" />
        ) : (
          <span className="text-mute"> · {startLabel}</span>
        )}
      </p>
      <div
        className={
          compact
            ? "overflow-hidden rounded-[1.25rem] border border-line bg-canvas"
            : "overflow-hidden rounded-[1.75rem] border border-line bg-paper sm:rounded-full"
        }
      >
        <dl className={compact ? "grid grid-cols-2" : "grid grid-cols-2 sm:grid-cols-4"}>
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`flex flex-col items-center justify-center px-2 py-2.5 text-center ${
                compact ? "min-h-[3.5rem]" : "min-h-[4.25rem] px-3 py-3"
              } ${index % 2 === 0 ? "border-r border-line" : ""} ${
                index < 2 ? "border-b border-line" : ""
              } ${!compact && index % 2 === 0 ? "sm:border-r-0" : ""} ${
                !compact && index < 2 ? "sm:border-b-0" : ""
              } ${!compact && index > 0 ? "sm:border-l sm:border-line" : ""}`}
            >
              <dt className="text-[11px] font-medium text-mute">{fact.label}</dt>
              {fact.pending ? (
                <dd className="mt-1.5 h-4 w-16 animate-pulse rounded-full bg-wash" />
              ) : (
                <dd className="mt-0.5 text-sm font-semibold leading-snug text-ink">{fact.value}</dd>
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
  loaded,
  compact = false,
}: {
  slug: string;
  schedules: CourseSchedule[];
  timeZone: string;
  loaded: boolean;
  compact?: boolean;
}) {
  const next = useMemo(
    () => (schedules.length ? nextCohortForCourse(slug, schedules, timeZone) : null),
    [slug, schedules, timeZone]
  );

  return (
    <CourseCohortStrip
      compact={compact}
      pending={!loaded && !next}
      startLabel={next?.date ?? OPEN_COHORT_LABEL}
      days={next?.days ?? null}
      time={next?.time ?? null}
    />
  );
}
