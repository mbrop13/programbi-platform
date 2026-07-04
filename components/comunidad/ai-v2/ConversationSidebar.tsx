"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowUpCircle,
  ChevronRight,
  Download,
  Globe,
  HelpCircle,
  Loader2,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
  Pin,
  Search,
  Settings,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { AiChat } from "@/lib/supabase/ai";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { FAVICON_URL } from "./constants";

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
  userName?: string;
  avatarUrl?: string | null;
  onClose?: () => void;
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
  userName,
  avatarUrl,
  onClose,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = () => setProfileMenuOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

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

  const displayName = userName || "Usuario";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?";

  const renderRow = (c: AiChat) => {
    const isActive = c.id === activeChatId;
    const isEditing = editingId === c.id;
    return (
      <motion.div
        key={c.id}
        role="button"
        tabIndex={isEditing ? -1 : 0}
        aria-current={isActive ? "true" : undefined}
        aria-label={`Conversación: ${c.title || "Sin título"}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isEditing) onSelect(c.id);
        }}
        onKeyDown={(e) => {
          if (isEditing) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(c.id);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startRename(c);
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm transition-all duration-200 cursor-pointer focus:outline-none border select-none",
          isActive
            ? "bg-brand-blue/5 border-brand-blue/20 text-brand-blue font-semibold shadow-sm"
            : "text-text-secondary hover:bg-slate-50 hover:text-text-primary border-transparent"
        )}
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-text-faint" aria-hidden />
        {isEditing ? (
          <label htmlFor={`rename-${c.id}`} className="sr-only">
            Renombrar conversación
          </label>
        ) : null}
        {isEditing ? (
          <input
            id={`rename-${c.id}`}
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
          <span className="flex-1 truncate text-sm">
            {c.title || "Sin título"}
          </span>
        )}

        {/* Acciones: visibles en hover, foco y táctil */}
        {!isEditing && (
          <div className="touch-visible flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); startRename(c); }}
              aria-label="Renombrar conversación"
              className="rounded p-1 text-text-faint hover:bg-surface-3 hover:text-text-secondary border-0 bg-transparent cursor-pointer"
              title="Renombrar"
            >
              <Pencil className="h-3 w-3" aria-hidden />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onPin(c.id); }}
              aria-label={c.pinned ? "Desfijar conversación" : "Fijar conversación"}
              className={cn(
                "rounded p-1 hover:bg-surface-3 border-0 bg-transparent cursor-pointer",
                c.pinned ? "text-accent-yellow" : "text-text-faint hover:text-text-secondary"
              )}
              title={c.pinned ? "Desfijar" : "Fijar"}
            >
              <Pin className="h-3 w-3" aria-hidden />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(c.id); }}
              aria-label="Archivar conversación"
              className="rounded p-1 text-text-faint hover:bg-surface-3 hover:text-text-secondary border-0 bg-transparent cursor-pointer"
              title="Archivar"
            >
              <Archive className="h-3 w-3" aria-hidden />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              aria-label="Eliminar conversación"
              className="rounded p-1 text-text-faint hover:bg-surface-3 hover:text-destructive border-0 bg-transparent cursor-pointer"
              title="Eliminar"
            >
              <Trash2 className="h-3 w-3" aria-hidden />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-surface-1 relative">
      {/* Barra superior de la barra lateral */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 bg-slate-50/10">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Historial de chats</span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar historial"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text-secondary md:hidden cursor-pointer border-0 bg-transparent"
            title="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Volver + Nuevo chat + búsqueda */}
      <div className="space-y-3.5 border-b border-border px-4 py-4 bg-slate-50/50">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-fit">
          <Link
            href="/comunidad/inicio"
            className="flex items-center gap-2 rounded-xl border border-slate-200/50 bg-white/50 px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:bg-slate-50 hover:text-text-primary hover:border-slate-350 no-underline shadow-sm w-fit cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver a la comunidad
          </Link>
        </motion.div>
        <motion.button
          onClick={onNew}
          whileHover={{ scale: 1.02, y: -0.5, boxShadow: "0 6px 20px rgba(24,144,255,0.25)" }}
          whileTap={{ scale: 0.98, y: 0 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(24,144,255,0.15)] transition-all duration-200 cursor-pointer border-none"
        >
          <MessageSquarePlus className="h-4.5 w-4.5" aria-hidden />
          Nuevo chat
        </motion.button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" aria-hidden />
          <label htmlFor="chat-search" className="sr-only">
            Buscar conversaciones
          </label>
          <input
            id="chat-search"
            type="text"
            placeholder="Buscar conversaciones…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-text-primary outline-none transition-all placeholder:text-text-faint focus:border-brand-blue/40 focus:ring-4 focus:ring-brand-blue/5"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-text-faint" aria-hidden />
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

      {/* Footer: avatar + nombre (con menú desplegable premium) */}
      <div className="shrink-0 border-t border-border px-4 py-4 bg-slate-50/50 relative">
        {/* Menú Desplegable Premium */}
        <AnimatePresence>
          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bottom-full left-4 right-4 mb-2 z-30 rounded-2xl border border-border bg-surface-0 shadow-float p-1.5 flex flex-col gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Encabezado: Email */}
              <div className="flex items-center gap-2.5 px-3 py-2 text-text-secondary select-none font-medium truncate">
                <User className="h-4 w-4 text-text-muted shrink-0 animate-pulse" />
                <span className="truncate text-xs">{userEmail || displayName}</span>
              </div>
              
              <div className="h-px bg-border my-1" />

              {/* Todos los ajustes */}
              <Link
                href="/comunidad/perfil"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary no-underline transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4 text-text-muted shrink-0" />
                <span className="flex-1 font-medium">Todos los ajustes</span>
                <span className="text-[10px] text-text-faint font-mono font-semibold tracking-wider">↑^,</span>
              </Link>

              {/* Actualizar plan */}
              <Link
                href="/comunidad/planes"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary no-underline transition-colors cursor-pointer"
              >
                <ArrowUpCircle className="h-4 w-4 text-text-muted shrink-0" />
                <span className="font-medium">Actualizar plan</span>
              </Link>

              {/* Instalar apps */}
              <button
                onClick={() => alert("La aplicación de escritorio se encuentra en desarrollo.")}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
              >
                <Download className="h-4 w-4 text-text-muted shrink-0" />
                <span className="font-medium">Instalar apps</span>
              </button>

              <div className="h-px bg-border my-1" />

              {/* Apariencia */}
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors cursor-pointer">
                <Sun className="h-4 w-4 text-text-muted shrink-0" />
                <span className="flex-1 font-medium">Apariencia</span>
                <span className="text-[11px] text-text-faint">Claro</span>
                <ChevronRight className="h-3 w-3 text-text-faint" />
              </div>

              {/* Idioma */}
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors cursor-pointer">
                <Globe className="h-4 w-4 text-text-muted shrink-0" />
                <span className="flex-1 font-medium">Idioma</span>
                <span className="text-[11px] text-text-faint">Por defecto</span>
                <ChevronRight className="h-3 w-3 text-text-faint" />
              </div>

              {/* Ayuda */}
              <Link
                href="/faq"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary no-underline transition-colors cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-text-muted shrink-0" />
                <span className="flex-1 font-medium">Ayuda</span>
                <ChevronRight className="h-3 w-3 text-text-faint" />
              </Link>

              <div className="h-px bg-border my-1" />

              {/* Cerrar sesión */}
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
              >
                <LogOut className="h-4 w-4 text-text-muted shrink-0" />
                <span className="font-semibold">Cerrar sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón de Perfil Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProfileMenuOpen((o) => !o);
          }}
          className="w-full flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2.5 text-left transition-all hover:bg-slate-50 hover:border-slate-200 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark ring-2 ring-white flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden>{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-slate-800">
              {displayName}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Miembro</div>
          </div>
        </button>
      </div>
    </div>
  );
}
