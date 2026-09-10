"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, Clock, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CourseSyllabus, SyllabusLesson } from "@/lib/comunidad/queries";
import { useCampusUi } from "@/components/comunidad/shell/CampusShell";

export function CourseHome({ syllabus }: { syllabus: CourseSyllabus }) {
  const router = useRouter();
  const { openUpgrade } = useCampusUi();
  const lessons = syllabus.modules.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = syllabus.completedLessonIds.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const next =
    lessons.find((l) => !syllabus.completedLessonIds.includes(l.id) && l.unlocked) ||
    lessons.find((l) => l.unlocked) ||
    lessons[0];

  const openLesson = (lesson: SyllabusLesson) => {
    if (!lesson.unlocked) {
      openUpgrade();
      return;
    }
    router.push(`/comunidad/cursos/${syllabus.slug}/${lesson.slug}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/comunidad/cursos"
          className="size-8 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted"
          aria-label="Volver a cursos"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Curso</p>
          <h1 className="text-xl font-semibold tracking-tight truncate">{syllabus.title}</h1>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">
            {done} de {total} clases
          </p>
          <p className="text-sm font-medium">{progress}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-sm text-muted-foreground max-w-xl">
          Plan de estudios, progreso y acceso a cada clase. El video y el playground se cargan al abrir una lección.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => next && openLesson(next)}
            disabled={!next}
          >
            <PlayCircle className="size-4" />
            {done > 0 ? "Continuar" : "Empezar curso"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {total} clases · {syllabus.modules.length} módulos
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {syllabus.modules.map((mod) => (
          <section key={mod.name} className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Módulo {mod.order}</p>
                <h2 className="text-sm font-semibold">{mod.name}</h2>
              </div>
              <span className="text-xs text-muted-foreground">{mod.lessons.length} clases</span>
            </div>
            <ul>
              {mod.lessons.map((lesson) => {
                const globalIndex = lessons.findIndex((l) => l.id === lesson.id);
                const completed = syllabus.completedLessonIds.includes(lesson.id);
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => openLesson(lesson)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/40 border-0 bg-transparent cursor-pointer border-t border-border first:border-t-0"
                    >
                      {lesson.unlocked ? (
                        <span
                          className={cn(
                            "size-5 rounded-full border flex items-center justify-center shrink-0",
                            completed ? "bg-foreground text-background border-foreground" : "border-border"
                          )}
                        >
                          {completed ? <Check className="size-3" /> : null}
                        </span>
                      ) : (
                        <Lock className="size-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="flex-1 min-w-0 text-sm truncate">
                        {globalIndex + 1}. {lesson.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {lesson.duration_minutes} min
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
