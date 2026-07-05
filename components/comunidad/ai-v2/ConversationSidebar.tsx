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
  Home,
  GraduationCap,
  Award,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Check,
  Moon,
  Monitor,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
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
  subscriptionPlan,
  isAdmin = false,
  onClose,
}: ConversationSidebarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [chatsOpen, setChatsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<'apariencia' | 'idioma' | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'claro' | 'oscuro' | 'sistema'>('claro');
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as 'claro' | 'oscuro' | 'sistema' | null;
      if (storedTheme) {
        setCurrentTheme(storedTheme);
        applyTheme(storedTheme);
      }
      const storedLang = localStorage.getItem("language") as 'es' | 'en' | null;
      if (storedLang) {
        setCurrentLanguage(storedLang);
      }
    }
  }, []);

  const applyTheme = (theme: 'claro' | 'oscuro' | 'sistema') => {
    const root = document.documentElement;
    if (theme === 'oscuro') {
      root.classList.add('dark');
    } else if (theme === 'claro') {
      root.classList.remove('dark');
    } else if (theme === 'sistema') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (theme: 'claro' | 'oscuro' | 'sistema') => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

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
    const handler = () => {
      setProfileMenuOpen(false);
      setActiveSubmenu(null);
    };
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

  const tierLabel = useMemo(() => {
    if (isAdmin) return "Admin";
    if (!subscriptionPlan) return "Trial";
    const clean = subscriptionPlan.replace("plan_", "").toLowerCase();
    if (clean === "pro") return "Pro";
    if (clean === "expert") return "Expert";
    if (clean === "lite") return "Lite";
    return "Miembro";
  }, [subscriptionPlan, isAdmin]);

  const navShortcuts = [
    { label: "Volver al Inicio", href: "/comunidad/inicio", icon: Home, color: "text-blue-500" },
    { label: "Mis Cursos", href: "/comunidad/cursos", icon: GraduationCap, color: "text-indigo-500" },
    { label: "Mis Certificados", href: "/comunidad/certificados", icon: Award, color: "text-amber-500" },
  ];

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
    <div className="flex h-full flex-col bg-white border-r border-slate-100 relative">
      {/* Header matching image: Logo on left, collapse button on right */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100/60 px-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center bg-white shadow-sm shrink-0">
            <Image
              src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
              alt="ProgramBI"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <span className="font-display font-black text-slate-800 text-xs tracking-tight">ProgramBI AI</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Colapsar menú"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
            title="Colapsar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nuevo chat button & search */}
      <div className="space-y-3 px-4 py-4 bg-white">
        <motion.button
          onClick={onNew}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 py-2.5 text-xs font-black text-slate-700 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <MessageSquarePlus className="h-4 w-4 text-slate-500" aria-hidden />
          Nuevo Chat
        </motion.button>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
          <label htmlFor="chat-search" className="sr-only">
            Buscar conversaciones
          </label>
          <input
            id="chat-search"
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-blue/40 focus:ring-4 focus:ring-brand-blue/5"
          />
        </div>

        {/* Shortcuts list (Portfolio style navigation link) */}
        <div className="pt-2 space-y-1">
          {navShortcuts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-all font-bold no-underline"
              >
                <Icon className={cn("h-4 w-4 shrink-0", item.color)} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Collapsible Chats Group */}
      <div className="flex-1 flex flex-col min-h-0 px-2 border-t border-slate-100/60 pt-3">
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest border-0 bg-transparent cursor-pointer select-none mb-1 shrink-0"
        >
          <span>Chats Recientes</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform duration-200", chatsOpen ? "" : "-rotate-90")} />
        </button>

        {chatsOpen && (
          <div className="scrollbar-hide flex-1 overflow-y-auto px-1 pb-3 space-y-3">
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
                  <div className="space-y-0.5">
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-text-faint">
                      Fijados
                    </div>
                    {pinned.map(renderRow)}
                  </div>
                )}
                {groups.map(([label, items]) => (
                  <div key={label} className="space-y-0.5">
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-text-faint">
                      {label}
                    </div>
                    {items.map(renderRow)}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer: avatar + nombre (con menú desplegable premium) */}
      <div className="shrink-0 border-t border-border px-4 py-4 bg-slate-50/50 relative">
        {/* Menú Desplegable Premium */}
        <AnimatePresence>
          {profileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 z-30">
              {/* Flyout Submenu for Appearance */}
              {activeSubmenu === 'apariencia' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute bottom-24 left-[215px] w-40 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 flex flex-col gap-0.5 z-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleThemeChange('claro')}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors border-0 bg-transparent text-left w-full cursor-pointer font-bold"
                  >
                    <Sun className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="flex-1 ml-1.5">Claro</span>
                    {currentTheme === 'claro' && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                  <button
                    onClick={() => handleThemeChange('oscuro')}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors border-0 bg-transparent text-left w-full cursor-pointer font-bold"
                  >
                    <Moon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="flex-1 ml-1.5">Oscuro</span>
                    {currentTheme === 'oscuro' && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                  <button
                    onClick={() => handleThemeChange('sistema')}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors border-0 bg-transparent text-left w-full cursor-pointer font-bold"
                  >
                    <Monitor className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="flex-1 ml-1.5">Sistema</span>
                    {currentTheme === 'sistema' && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                </motion.div>
              )}

              {/* Flyout Submenu for Language */}
              {activeSubmenu === 'idioma' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute bottom-14 left-[215px] w-40 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 flex flex-col gap-0.5 z-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors border-0 bg-transparent text-left w-full cursor-pointer font-bold"
                  >
                    <span className="flex-1 ml-1.5">Español</span>
                    {currentLanguage === 'es' && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors border-0 bg-transparent text-left w-full cursor-pointer font-bold"
                  >
                    <span className="flex-1 ml-1.5">English</span>
                    {currentLanguage === 'en' && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full rounded-2xl border border-slate-150/70 bg-white shadow-xl p-1.5 flex flex-col gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Encabezado: Email */}
                <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 select-none font-bold truncate rounded-xl bg-slate-50/50">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-xs font-black">{userEmail || displayName}</span>
                </div>
                
                <div className="h-px bg-slate-100 my-1" />

                {/* Todos los ajustes */}
                <Link
                  href="/comunidad/perfil"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 hover:text-slate-900 no-underline transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="flex-1 font-bold">Todos los ajustes</span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">↑^,</span>
                </Link>

                {/* Actualizar plan */}
                <Link
                  href="/comunidad/planes"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 hover:text-slate-900 no-underline transition-colors cursor-pointer"
                >
                  <ArrowUpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-bold">Actualizar plan</span>
                </Link>

                {/* Instalar apps */}
                <button
                  onClick={() => alert("La aplicación de escritorio se encuentra en desarrollo.")}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
                >
                  <Download className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-bold">Instalar apps</span>
                </button>

                <div className="h-px bg-slate-100 my-1" />

                {/* Apariencia */}
                <div
                  onMouseEnter={() => setActiveSubmenu('apariencia')}
                  onClick={() => setActiveSubmenu(activeSubmenu === 'apariencia' ? null : 'apariencia')}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer select-none font-bold text-slate-650",
                    activeSubmenu === 'apariencia' ? "bg-slate-50 text-slate-900" : "hover:bg-slate-50"
                  )}
                >
                  <Sun className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="flex-1 flex flex-col items-start leading-none">
                    <span>Apariencia</span>
                    <span className="text-[10px] text-slate-400 font-medium capitalize mt-1">{currentTheme}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Idioma */}
                <div
                  onMouseEnter={() => setActiveSubmenu('idioma')}
                  onClick={() => setActiveSubmenu(activeSubmenu === 'idioma' ? null : 'idioma')}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer select-none font-bold text-slate-650",
                    activeSubmenu === 'idioma' ? "bg-slate-50 text-slate-900" : "hover:bg-slate-50"
                  )}
                >
                  <Globe className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="flex-1 flex flex-col items-start leading-none">
                    <span>Idioma</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">{currentLanguage === 'es' ? 'Español' : 'English'}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Ayuda */}
                <Link
                  href="/faq"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 hover:text-slate-900 no-underline transition-colors cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="flex-1 font-bold">Ayuda</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                {/* Cerrar sesión */}
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer border-0 bg-transparent text-left w-full font-bold"
                >
                  <LogOut className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Cerrar sesión</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Botón de Perfil Trigger */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen((o) => !o);
            }}
            className="flex-1 flex items-center gap-3 rounded-xl border border-slate-150/70 bg-white p-2.5 text-left transition-all hover:bg-slate-50 hover:border-slate-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand-blue to-indigo-650 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <span aria-hidden>{initials}</span>
              )}
              {/* Subscription Tier Pill Badge */}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border border-white uppercase tracking-wider scale-90 shadow-sm leading-none whitespace-nowrap">
                {tierLabel}
              </span>
            </div>
            <div className="min-w-0 flex-1 ml-0.5">
              <div className="truncate text-xs font-black text-slate-800 leading-none">
                {displayName}
              </div>
            </div>
          </button>
          
          {/* Notification bell on the right */}
          <button
            onClick={() => router.push("/comunidad/inicio")}
            className="w-8 h-8 rounded-xl bg-white border border-slate-150/70 hover:bg-gray-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm shrink-0 cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
