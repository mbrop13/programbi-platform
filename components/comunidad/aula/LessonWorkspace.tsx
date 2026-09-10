"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Clock,
  Download,
  FileText,
  List,
  Loader2,
  Lock,
  Sparkles,
  StickyNote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/comunidad/ai-v2/MarkdownRenderer";
import { toggleLessonProgress } from "@/lib/supabase/comunidad-ai";
import { extractYouTubeId } from "@/lib/comunidad/aula-utils";
import type { CourseSyllabus, LessonDetail } from "@/lib/comunidad/queries";
import { useCampusUi } from "@/components/comunidad/shell/CampusShell";
import { LessonPlaylist } from "./LessonPlaylist";

const SuperClase = dynamic(() => import("./SuperClase").then((m) => m.SuperClase), { ssr: false });
const LessonTutor = dynamic(() => import("./LessonTutor").then((m) => m.LessonTutor), { ssr: false });

type YTPlayer = {
  getDuration: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
};

export function LessonWorkspace({
  syllabus,
  lessonSlug,
  initialDetail,
}: {
  syllabus: CourseSyllabus;
  lessonSlug: string;
  initialDetail: LessonDetail | null;
}) {
  const router = useRouter();
  const { openUpgrade } = useCampusUi();
  const lessons = syllabus.modules.flatMap((m) => m.lessons);
  const meta = lessons.find((l) => l.slug === lessonSlug) || lessons[0];
  const [detail, setDetail] = useState<LessonDetail | null>(initialDetail);
  const [loading, setLoading] = useState(!initialDetail);
  const [completed, setCompleted] = useState(() => new Set(syllabus.completedLessonIds));
  const [tab, setTab] = useState<"overview" | "notes" | "resources">("overview");
  const [notes, setNotes] = useState("");
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [superOpen, setSuperOpen] = useState(false);
  const completedRef = useRef(completed);
  const toggleRef = useRef<((id: string) => Promise<void>) | null>(null);
  const uncheckedRef = useRef(new Set<string>());

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    setDetail(initialDetail);
    setLoading(!initialDetail);
  }, [initialDetail]);

  useEffect(() => {
    if (!meta) return;
    setNotes(localStorage.getItem(`aula-notes-${syllabus.courseId}-${meta.id}`) || "");
  }, [meta?.id, syllabus.courseId]);

  useEffect(() => {
    if (!meta) return;
    const t = setTimeout(() => {
      localStorage.setItem(`aula-notes-${syllabus.courseId}-${meta.id}`, notes);
    }, 800);
    return () => clearTimeout(t);
  }, [notes, meta?.id, syllabus.courseId]);

  const toggleComplete = useCallback(
    async (lessonId: string) => {
      const was = completed.has(lessonId);
      const next = !was;
      if (!next) uncheckedRef.current.add(lessonId);
      else uncheckedRef.current.delete(lessonId);
      setCompleted((prev) => {
        const s = new Set(prev);
        if (s.has(lessonId)) s.delete(lessonId);
        else s.add(lessonId);
        return s;
      });
      try {
        await toggleLessonProgress(syllabus.courseId, lessonId, next);
      } catch {
        setCompleted((prev) => {
          const s = new Set(prev);
          if (was) s.add(lessonId);
          else s.delete(lessonId);
          return s;
        });
      }
    },
    [completed, syllabus.courseId]
  );

  useEffect(() => {
    toggleRef.current = toggleComplete;
  }, [toggleComplete]);

  const videoId = detail?.unlocked ? extractYouTubeId(detail.video_url) : null;

  useEffect(() => {
    if (!meta?.unlocked || !syllabus.courseId) return;
    fetch("/api/tracking/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: meta.id,
        courseId: syllabus.courseId,
        incrementWatchSeconds: 10,
        lastPositionSeconds: 0,
        isCompleted: completed.has(meta.id),
      }),
    }).catch(() => {});
  }, [meta?.id, syllabus.courseId, meta?.unlocked]);

  useEffect(() => {
    if (!videoId || !meta) return;
    if (!document.getElementById("youtube-iframe-api-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    let player: YTPlayer | null = null;
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    const lessonId = meta.id;

    const bind = () => {
      const YT = (window as unknown as { YT?: { Player: new (id: string, opts: object) => YTPlayer } }).YT;
      if (!YT?.Player || !document.getElementById("youtube-player-target")) return false;
      player = new YT.Player("youtube-player-target", {
        events: {
          onReady: () => {},
          onStateChange: (event: { data: number }) => {
            if (event.data === 1) {
              if (progressInterval) clearInterval(progressInterval);
              progressInterval = setInterval(() => {
                if (!player) return;
                const duration = player.getDuration();
                const current = player.getCurrentTime();
                if (duration > 0 && (current / duration) * 100 >= 70) {
                  if (!completedRef.current.has(lessonId) && !uncheckedRef.current.has(lessonId)) {
                    toggleRef.current?.(lessonId);
                  }
                  if (progressInterval) clearInterval(progressInterval);
                }
                fetch("/api/tracking/lesson", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    lessonId,
                    courseId: syllabus.courseId,
                    incrementWatchSeconds: 5,
                    lastPositionSeconds: Math.floor(current),
                    isCompleted: completedRef.current.has(lessonId),
                  }),
                }).catch(() => {});
              }, 5000);
            } else if (progressInterval) {
              clearInterval(progressInterval);
              progressInterval = null;
            }
          },
        },
      });
      return true;
    };

    const prev = (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady;
    (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
      prev?.();
      bind();
    };
    if (!bind()) {
      const wait = setInterval(() => {
        if (bind()) clearInterval(wait);
      }, 300);
      return () => {
        clearInterval(wait);
        if (progressInterval) clearInterval(progressInterval);
        try {
          player?.destroy();
        } catch {
          /* ignore */
        }
      };
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      try {
        player?.destroy();
      } catch {
        /* ignore */
      }
    };
  }, [videoId, meta?.id, syllabus.courseId]);

  if (!meta) {
    return <p className="p-6 text-sm text-muted-foreground">Lección no encontrada.</p>;
  }

  const idx = lessons.findIndex((l) => l.id === meta.id);
  const go = (slug: string, unlocked: boolean) => {
    if (!unlocked) {
      openUpgrade();
      return;
    }
    router.push(`/comunidad/cursos/${syllabus.slug}/${slug}`);
  };

  return (
    <div className="h-dvh flex flex-col bg-bg text-foreground">
      <header className="h-12 shrink-0 border-b border-border flex items-center gap-3 px-3">
        <button
          type="button"
          onClick={() => router.push(`/comunidad/cursos/${syllabus.slug}`)}
          className="size-8 inline-flex items-center justify-center rounded-md hover:bg-muted border-0 bg-transparent cursor-pointer"
          aria-label="Inicio del curso"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground truncate">{syllabus.title}</p>
          <p className="text-sm font-medium truncate">{meta.title}</p>
        </div>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setPlaylistOpen(true)} aria-label="Clases">
          <List />
        </Button>
      </header>

      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="aspect-video bg-black relative">
            {!meta.unlocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-foreground text-background">
                <Lock className="size-8 mb-3" />
                <h2 className="text-lg font-semibold">Clase bloqueada</h2>
                <p className="text-sm text-background/70 mt-1 max-w-sm">
                  Necesitas un plan de la comunidad para ver esta lección.
                </p>
                <Button className="mt-4" variant="secondary" onClick={openUpgrade}>
                  Ver planes
                </Button>
              </div>
            ) : loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-background/70" />
              </div>
            ) : videoId ? (
              <iframe
                id="youtube-player-target"
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-background/60 text-sm">
                Video no disponible
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" /> {meta.duration_minutes} min
              </span>
              <span>Clase {idx + 1}</span>
              {completed.has(meta.id) ? (
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Check className="size-3" /> Completada
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={completed.has(meta.id) ? "secondary" : "default"} onClick={() => void toggleComplete(meta.id)}>
                <Check className="size-3.5" />
                {completed.has(meta.id) ? "Completada" : "Marcar completada"}
              </Button>
              {meta.superclass_language && meta.unlocked ? (
                <Button size="sm" variant="outline" onClick={() => setSuperOpen(true)}>
                  Super Clase
                </Button>
              ) : null}
              <Button size="sm" variant="outline" onClick={() => setTutorOpen((v) => !v)}>
                <Sparkles className="size-3.5" />
                Tutor
              </Button>
            </div>

            <div className="flex gap-4 border-b border-border">
              {(
                [
                  { id: "overview" as const, label: "Descripción", icon: FileText },
                  { id: "notes" as const, label: "Apuntes", icon: StickyNote },
                  { id: "resources" as const, label: "Archivos", icon: Download },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "pb-2 text-sm border-0 bg-transparent cursor-pointer border-b-2 -mb-px",
                    tab === t.id ? "border-foreground font-medium" : "border-transparent text-muted-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "overview" ? (
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={detail?.description || detail?.content_markdown || "Sin descripción para esta clase."} />
              </div>
            ) : null}
            {tab === "notes" ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Apuntes de esta clase (se guardan en este dispositivo)…"
                className="w-full min-h-[180px] rounded-xl border border-border bg-surface p-3 text-sm outline-none"
              />
            ) : null}
            {tab === "resources" ? (
              meta.resources.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay archivos en esta clase.</p>
              ) : (
                <ul className="space-y-2">
                  {meta.resources.map((res) => (
                    <li key={res.url}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted"
                      >
                        <Download className="size-4" />
                        {res.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )
            ) : null}

            {tutorOpen ? (
              <div className="rounded-xl border border-border overflow-hidden h-[360px]">
                <LessonTutor
                  courseId={syllabus.courseId}
                  lessonId={meta.id}
                  courseTitle={syllabus.title}
                  lessonTitle={meta.title}
                />
              </div>
            ) : null}
          </div>
        </div>

        <aside className="hidden lg:block w-[300px] shrink-0 border-l border-border overflow-y-auto p-3">
          <LessonPlaylist syllabus={syllabus} activeLessonId={meta.id} onSelect={go} />
        </aside>
      </div>

      {playlistOpen ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <button className="absolute inset-0 bg-black/20" aria-label="Cerrar" onClick={() => setPlaylistOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 max-h-[70vh] overflow-y-auto rounded-t-xl border border-border bg-bg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Clases</p>
              <Button variant="ghost" size="icon-sm" onClick={() => setPlaylistOpen(false)}>
                <X />
              </Button>
            </div>
            <LessonPlaylist
              syllabus={syllabus}
              activeLessonId={meta.id}
              onSelect={(slug, unlocked) => {
                setPlaylistOpen(false);
                go(slug, unlocked);
              }}
            />
          </div>
        </div>
      ) : null}

      {superOpen && meta.superclass_language ? (
        <SuperClase
          courseId={syllabus.courseId}
          lessonId={meta.id}
          language={meta.superclass_language}
          onClose={() => setSuperOpen(false)}
        />
      ) : null}
    </div>
  );
}
