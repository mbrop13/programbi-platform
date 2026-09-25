"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  COMMUNITY_CLASS_LEVELS,
  type CommunityClass,
  type CommunityClassLevel,
} from "@/lib/comunidad/community-class";
import {
  adminCreateCommunityClass,
  adminDeleteCommunityClass,
} from "@/lib/comunidad/community-classes";
import { AdminPageHeader } from "@/components/admin/ui";

export function AdminCommunityClasses({ initialClasses }: { initialClasses: CommunityClass[] }) {
  const router = useRouter();
  const [classes, setClasses] = useState(initialClasses);
  const [classDate, setClassDate] = useState("");
  const [startTime, setStartTime] = useState("19:30");
  const [endTime, setEndTime] = useState("21:30");
  const [level, setLevel] = useState<CommunityClassLevel>("clase");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setClasses(initialClasses);
  }, [initialClasses]);

  function refresh(next: CommunityClass[]) {
    setClasses(next);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Clases de la comunidad"
        description="Estas fechas se ven en el calendario de /comunidad. Cada clase dura 2 horas y es Clase o Clase avanzada."
      />

      <form
        className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          startTransition(async () => {
            try {
              await adminCreateCommunityClass({ classDate, startTime, endTime, level, topic: "" });
              setClassDate("");
              refresh([
                ...classes,
                {
                  id: `pending-${classDate}-${startTime}`,
                  classDate,
                  startTime,
                  endTime,
                  level,
                  topic: null,
                },
              ].sort((a, b) => a.classDate.localeCompare(b.classDate) || a.startTime.localeCompare(b.startTime)));
            } catch (err) {
              setError(err instanceof Error ? err.message : "No se pudo guardar la clase.");
            }
          });
        }}
      >
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Fecha</span>
          <input
            required
            type="date"
            value={classDate}
            onChange={(event) => setClassDate(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Inicio</span>
          <input
            required
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Término</span>
          <input
            required
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Tipo</span>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as CommunityClassLevel)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="clase">Clase</option>
            <option value="avanzada">Clase avanzada</option>
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-2 flex items-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Publicar clase"}
          </button>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {classes.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Todavía no hay clases. La primera que publiques aparece en el calendario.</p>
        ) : (
          <ul className="divide-y divide-border">
            {classes.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">
                    {item.classDate.split("-").reverse().join("/")} · {COMMUNITY_CLASS_LEVELS[item.level].label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.startTime}–{item.endTime}
                    {item.topic ? ` · ${item.topic}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setError(null);
                    startTransition(async () => {
                      try {
                        await adminDeleteCommunityClass(item.id);
                        refresh(classes.filter((row) => row.id !== item.id));
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "No se pudo quitar la clase.");
                      }
                    });
                  }}
                  className="text-sm font-semibold text-red-600"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
