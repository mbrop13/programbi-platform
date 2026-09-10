"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseSyllabus } from "@/lib/comunidad/queries";

export function LessonPlaylist({
  syllabus,
  activeLessonId,
  onSelect,
}: {
  syllabus: CourseSyllabus;
  activeLessonId?: string;
  onSelect: (slug: string, unlocked: boolean) => void;
}) {
  const all = syllabus.modules.flatMap((m) => m.lessons);
  return (
    <div className="space-y-4">
      {syllabus.modules.map((mod) => (
        <div key={mod.name}>
          <p className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Módulo {mod.order} · {mod.name}
          </p>
          <div className="space-y-0.5">
            {mod.lessons.map((lesson) => {
              const idx = all.findIndex((l) => l.id === lesson.id);
              const done = syllabus.completedLessonIds.includes(lesson.id);
              const active = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onSelect(lesson.slug, lesson.unlocked)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 border-0 cursor-pointer",
                    active ? "bg-foreground text-background" : "hover:bg-muted text-foreground bg-transparent"
                  )}
                >
                  {lesson.unlocked ? (
                    <span
                      className={cn(
                        "size-4 rounded-full border flex items-center justify-center shrink-0",
                        done ? (active ? "bg-background text-foreground" : "bg-foreground text-background") : "border-current/30"
                      )}
                    >
                      {done ? <Check className="size-2.5" /> : null}
                    </span>
                  ) : (
                    <Lock className="size-3.5 shrink-0 opacity-60" />
                  )}
                  <span className="truncate">
                    {idx + 1}. {lesson.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
