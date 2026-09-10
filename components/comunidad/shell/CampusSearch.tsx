"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CourseHit = { id: string; title: string; slug: string };
type LessonHit = { id: string; title: string; course_slug: string };
type PostHit = { id: string; excerpt: string };

type SearchResponse = {
  courses: CourseHit[];
  lessons: LessonHit[];
  posts: PostHit[];
};

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function CampusSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse>({ courses: [], lessons: [], posts: [] });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults({ courses: [], lessons: [], posts: [] });
    setSelected(0);
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults({ courses: [], lessons: [], posts: [] });
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/comunidad/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as SearchResponse;
        if (!cancelled) {
          setResults({
            courses: data.courses || [],
            lessons: data.lessons || [],
            posts: data.posts || [],
          });
          setSelected(0);
        }
      } catch {
        if (!cancelled) setResults({ courses: [], lessons: [], posts: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, open]);

  const flat = [
    ...results.courses.map((c) => ({ kind: "course" as const, href: `/comunidad/cursos/${c.slug}`, label: c.title })),
    ...results.lessons.map((l) => ({
      kind: "lesson" as const,
      href: `/comunidad/cursos/${l.course_slug}/${slugify(l.title)}`,
      label: l.title,
    })),
    ...results.posts.map((p) => ({ kind: "post" as const, href: "/comunidad/inicio", label: p.excerpt })),
  ];

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-black/20" aria-label="Cerrar búsqueda" onClick={onClose} />
      <div className="relative mx-auto mt-[12vh] w-full max-w-lg px-4">
        <div className="rounded-xl border border-border bg-bg shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 h-12 border-b border-border">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelected((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelected((i) => Math.max(i - 1, 0));
                }
                if (e.key === "Enter" && flat[selected]) go(flat[selected].href);
              }}
              placeholder="Buscar cursos, clases o posts…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
            <button
              type="button"
              onClick={onClose}
              className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {query.trim().length < 2 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">Escribe al menos 2 caracteres.</p>
            ) : flat.length === 0 && !loading ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">Sin resultados.</p>
            ) : (
              <ul>
                {flat.map((item, i) => (
                  <li key={`${item.kind}-${item.href}-${item.label}`}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3",
                        i === selected ? "bg-muted" : "hover:bg-muted/40"
                      )}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-14 shrink-0">
                        {item.kind === "course" ? "Curso" : item.kind === "lesson" ? "Clase" : "Post"}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
            Ctrl+K · Enter para abrir
          </div>
        </div>
      </div>
    </div>
  );
}
