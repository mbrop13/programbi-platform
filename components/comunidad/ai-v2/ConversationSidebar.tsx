"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Loader2,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { AiChat } from "@/lib/supabase/ai";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  chats: AiChat[];
  activeChatId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
}

function groupKey(updatedAt: string): string {
  const date = new Date(updatedAt);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000
  );
  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays <= 7) return "Últimos 7 días";
  if (diffDays <= 30) return "Últimos 30 días";
  return date.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
}

const GROUP_ORDER = ["Hoy", "Ayer", "Últimos 7 días", "Últimos 30 días"];

function sortGroups(a: string, b: string): number {
  const ia = GROUP_ORDER.indexOf(a);
  const ib = GROUP_ORDER.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  return a.localeCompare(b);
}

export function ConversationSidebar({
  chats,
  activeChatId,
  loading,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onPin,
  onArchive,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return chats;
    return chats.filter((c) => (c.title ?? "").toLowerCase().includes(q));
  }, [chats, search]);

  // Pinned primero, luego agrupado por fecha
  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  const groups = useMemo(() => {
    const map = new Map<string, AiChat[]>();
    for (const c of unpinned) {
      const k = groupKey(c.updated_at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(c);
    }
    return Array.from(map.entries()).sort((a, b) => sortGroups(a[0], b[0]));
  }, [unpinned]);

  const startRename = (c: AiChat) => {
    setEditingId(c.id);
    setEditTitle(c.title ?? "");
  };

  const saveRename = (id: string) => {
    const t = editTitle.trim();
    setEditingId(null);
    if (t) onRename(id, t);
  };

  const renderRow = (c: AiChat) => {
    const isActive = c.id === activeChatId;
    const isEditing = editingId === c.id;
    return (
      <div
        key={c.id}
        onClick={() => !isEditing && onSelect(c.id)}
        onDoubleClick={() => startRename(c)}
        className={cn(
          "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors cursor-pointer",
          isActive
            ? "bg-surface-2 text-text-primary"
            : "text-text-secondary hover:bg-surface-2/60 hover:text-text-primary"
        )}
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-text-faint" />
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => saveRename(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename(c.id);
              if (e.key === "Escape") setEditingId(null);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 flex-1 rounded bg-surface-1 px-1 py-0.5 text-sm outline-none ring-1 ring-brand-blue/40"
          />
        ) : (
          <span
            className="flex-1 truncate text-sm"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black calc(100% - 20px), transparent)",
                maskImage:
                "linear-gradient(to right, black calc(100% - 20px), transparent)",
            }}
          >
            {c.title || "Sin título"}
          </span>
        )}

        {/* Acciones (hover) */}
        {!isEditing && (
          <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onPin(c.id); }}
              className={cn(
                "rounded p-1 hover:bg-surface-3",
                c.pinned ? "text-amber-500" : "text-text-faint hover:text-text-secondary"
              )}
              title={c.pinned ? "Desfijar" : "Fijar"}
            >
              <Pin className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(c.id); }}
              className="rounded p-1 text-text-faint hover:bg-surface-3 hover:text-text-secondary"
              title="Archivar"
            >
              <Archive className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              className="rounded p-1 text-text-faint hover:bg-surface-3 hover:text-red-500"
              title="Eliminar"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-surface-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
        >
          <Plus className="h-4 w-4" />
          Nuevo chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
          <input
            type="text"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-surface-2 py-1.5 pl-8 pr-3 text-sm text-text-primary outline-none placeholder:text-text-faint focus:ring-1 focus:ring-brand-blue/40"
          />
        </div>
      </div>

      {/* List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-text-faint" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-xs text-text-faint">
            {search ? "Sin resultados" : "Aún no hay conversaciones"}
          </p>
        ) : (
          <>
            {pinned.length > 0 && (
              <div className="mb-3 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-faint">
                  Fijados
                </div>
                {pinned.map(renderRow)}
              </div>
            )}
            {groups.map(([label, items]) => (
              <div key={label} className="mb-3 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-faint">
                  {label}
                </div>
                {items.map(renderRow)}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
