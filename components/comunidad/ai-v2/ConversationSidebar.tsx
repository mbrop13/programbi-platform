"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Archive,
  ArrowUpCircle,
  ChevronRight,
  ChevronsUpDown,
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
  Home,
  GraduationCap,
  Award,
  Bell,
  ChevronDown,
  PanelLeftClose,
  Check,
  Moon,
  Monitor,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { AiChat } from "@/lib/supabase/ai";
import { createClient } from "@/lib/supabase/client";
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
  userName?: string;
  avatarUrl?: string | null;
  subscriptionPlan?: string | null;
  isAdmin?: boolean;
  onClose?: () => void;
}

/* ── Grouping helpers ── */
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
  return "Anteriores";
}

const GROUP_ORDER = ["Hoy", "Ayer", "Últimos 7 días", "Últimos 30 días", "Anteriores"];

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [chatsOpen, setChatsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<'apariencia' | 'idioma' | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'claro' | 'oscuro' | 'sistema'>('claro');
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  /* ── Theme persistence ── */
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (theme: 'claro' | 'oscuro' | 'sistema') => {
    const root = document.documentElement;
    if (theme === 'oscuro') {
      root.classList.add('dark');
    } else if (theme === 'claro') {
      root.classList.remove('dark');
    } else if (theme === 'sistema') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
      else root.classList.remove('dark');
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

  /* ── Fetch user email ── */
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  /* ── Close menu on click outside ── */
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  /* ── Chat filtering and grouping ── */
  const pinned = chats.filter((c) => c.pinned);
  const unpinned = chats.filter((c) => !c.pinned);

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

  /* ── Navigation items (matching the Grok sidebar image) ── */
  const navItems = [
    { label: "Nuevo Chat", icon: MessageSquarePlus, onClick: onNew },
    { label: "Buscar", icon: Search, href: "/comunidad/inicio" },
    { label: "Mis Cursos", icon: GraduationCap, href: "/comunidad/cursos" },
    { label: "Certificados", icon: Award, href: "/comunidad/certificados" },
    { label: "Noticias", icon: Newspaper, href: "/comunidad/inicio" },
    { label: "Inicio", icon: Home, href: "/comunidad/inicio" },
  ];

  /* ── Render single chat row ── */
  const renderRow = (c: AiChat) => {
    const isActive = c.id === activeChatId;
    const isEditing = editingId === c.id;
    return (
      <div
        key={c.id}
        role="button"
        tabIndex={isEditing ? -1 : 0}
        aria-current={isActive ? "true" : undefined}
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
        className={cn(
          "group flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] cursor-pointer transition-colors select-none",
          isActive
            ? "bg-stone-100 dark:bg-neutral-800 font-medium text-stone-900 dark:text-white"
            : "text-stone-600 dark:text-neutral-400 hover:bg-stone-50 dark:hover:bg-neutral-800/50 hover:text-stone-900 dark:hover:text-white"
        )}
      >
        {isEditing ? (
          <>
            <label htmlFor={`rename-${c.id}`} className="sr-only">
              Renombrar conversación
            </label>
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
              className="min-w-0 flex-1 rounded-md bg-white dark:bg-neutral-700 px-2 py-0.5 text-[13px] outline-none ring-1 ring-stone-300 dark:ring-neutral-600 text-stone-900 dark:text-white"
            />
          </>
        ) : (
          <span className="flex-1 truncate">{c.title || "Sin título"}</span>
        )}

        {/* Context actions on hover */}
        {!isEditing && (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); startRename(c); }}
              aria-label="Renombrar"
              className="rounded p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onPin(c.id); }}
              aria-label={c.pinned ? "Desfijar" : "Fijar"}
              className={cn(
                "rounded p-1 border-0 bg-transparent cursor-pointer",
                c.pinned ? "text-amber-500" : "text-stone-400 hover:text-stone-700 dark:hover:text-white"
              )}
            >
              <Pin className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(c.id); }}
              aria-label="Archivar"
              className="rounded p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer"
            >
              <Archive className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              aria-label="Eliminar"
              className="rounded p-1 text-stone-400 hover:text-red-600 border-0 bg-transparent cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-black relative">
      {/* ═══ Header: Logo + Collapse ═══ */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
              alt="ProgramBI"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-black text-stone-900 dark:text-white text-sm tracking-tight">ProgramBI</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Colapsar menú"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* ═══ Navigation Items (flat list like Grok) ═══ */}
      <nav className="px-3 space-y-0.5 pb-4">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800/60 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent text-left"
              >
                <Icon className="h-[18px] w-[18px] text-stone-500 dark:text-neutral-500 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={idx}
              href={item.href!}
              className="flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800/60 hover:text-stone-900 dark:hover:text-white transition-colors no-underline"
            >
              <Icon className="h-[18px] w-[18px] text-stone-500 dark:text-neutral-500 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ═══ Chats Section (collapsible like Grok) ═══ */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-stone-100 dark:border-neutral-800">
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="w-full flex items-center justify-between px-5 py-3 text-[14px] font-medium text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-neutral-800/40 transition-colors border-0 bg-transparent cursor-pointer select-none shrink-0"
        >
          <span>Chats</span>
          <ChevronDown className={cn(
            "h-4 w-4 text-stone-400 dark:text-neutral-500 transition-transform duration-200",
            chatsOpen ? "" : "-rotate-90"
          )} />
        </button>

        {chatsOpen && (
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
              </div>
            ) : chats.length === 0 ? (
              <p className="py-10 text-center text-[13px] text-stone-400 dark:text-neutral-500">
                Aún no hay conversaciones
              </p>
            ) : (
              <>
                {pinned.length > 0 && (
                  <div className="space-y-0.5">
                    <div className="px-3 py-1.5 text-[11px] font-medium text-stone-400 dark:text-neutral-500">
                      Fijados
                    </div>
                    {pinned.map(renderRow)}
                  </div>
                )}
                {groups.map(([label, items]) => (
                  <div key={label} className="space-y-0.5">
                    <div className="px-3 py-1.5 text-[11px] font-medium text-stone-400 dark:text-neutral-500">
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

      {/* ═══ Footer: Profile + Bell (Grok-style) ═══ */}
      <div className="shrink-0 border-t border-stone-100 dark:border-neutral-800 px-3 py-3 relative" ref={profileMenuRef}>
        {/* ── Profile Popup Menu ── */}
        <AnimatePresence>
          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bottom-full left-3 right-3 mb-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Main menu */}
                <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl shadow-lg shadow-stone-200/50 dark:shadow-black/40 p-1.5 flex flex-col">
                  {/* Email header */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
                    <User className="h-4 w-4 text-stone-400 dark:text-neutral-500 shrink-0" />
                    <span className="truncate text-[13px] font-medium text-stone-600 dark:text-neutral-300">{userEmail || displayName}</span>
                  </div>

                  <div className="h-px bg-stone-100 dark:bg-neutral-800 mx-2 my-1" />

                  {/* Todos los ajustes */}
                  <Link
                    href="/comunidad/perfil"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                    <span className="flex-1 font-medium">Todos los ajustes</span>
                    <span className="text-[11px] text-stone-400 dark:text-neutral-600 font-mono">⇧^,</span>
                  </Link>

                  {/* Actualizar plan */}
                  <Link
                    href="/comunidad/planes"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline cursor-pointer"
                  >
                    <ArrowUpCircle className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                    <span className="font-medium">Actualizar plan</span>
                  </Link>

                  {/* Instalar apps */}
                  <button
                    onClick={() => alert("La aplicación de escritorio se encuentra en desarrollo.")}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
                  >
                    <Download className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                    <span className="font-medium">Instalar apps</span>
                  </button>

                  <div className="h-px bg-stone-100 dark:bg-neutral-800 mx-2 my-1" />

                  {/* Apariencia - with flyout submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveSubmenu('apariencia')}
                    onMouseLeave={() => { if (activeSubmenu === 'apariencia') setActiveSubmenu(null); }}
                  >
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === 'apariencia' ? null : 'apariencia')}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] w-full text-left transition-colors cursor-pointer border-0 bg-transparent",
                        activeSubmenu === 'apariencia'
                          ? "bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-white"
                          : "text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                      )}
                    >
                      <Sun className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                      <div className="flex-1 flex flex-col items-start min-w-0">
                        <span className="font-medium">Apariencia</span>
                        <span className="text-[11px] text-stone-400 dark:text-neutral-500 capitalize">{currentTheme}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-neutral-500 shrink-0" />
                    </button>

                    {/* Flyout submenu - Apariencia */}
                    <AnimatePresence>
                      {activeSubmenu === 'apariencia' && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl shadow-lg shadow-stone-200/40 dark:shadow-black/40 p-1 flex flex-col z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {([
                            { key: 'claro' as const, label: 'Claro', icon: Sun },
                            { key: 'oscuro' as const, label: 'Oscuro', icon: Moon },
                            { key: 'sistema' as const, label: 'Sistema', icon: Monitor },
                          ]).map(({ key, label, icon: Ic }) => (
                            <button
                              key={key}
                              onClick={() => handleThemeChange(key)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors border-0 bg-transparent text-left w-full cursor-pointer",
                                currentTheme === key
                                  ? "text-stone-900 dark:text-white font-medium"
                                  : "text-stone-600 dark:text-neutral-400 hover:bg-stone-50 dark:hover:bg-neutral-800"
                              )}
                            >
                              <Ic className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                              <span className="flex-1">{label}</span>
                              {currentTheme === key && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Idioma - with flyout submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveSubmenu('idioma')}
                    onMouseLeave={() => { if (activeSubmenu === 'idioma') setActiveSubmenu(null); }}
                  >
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === 'idioma' ? null : 'idioma')}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] w-full text-left transition-colors cursor-pointer border-0 bg-transparent",
                        activeSubmenu === 'idioma'
                          ? "bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-white"
                          : "text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                      )}
                    >
                      <Globe className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                      <div className="flex-1 flex flex-col items-start min-w-0">
                        <span className="font-medium">Idioma</span>
                        <span className="text-[11px] text-stone-400 dark:text-neutral-500">{currentLanguage === 'es' ? 'Español' : 'English'}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-neutral-500 shrink-0" />
                    </button>

                    {/* Flyout submenu - Idioma */}
                    <AnimatePresence>
                      {activeSubmenu === 'idioma' && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl shadow-lg shadow-stone-200/40 dark:shadow-black/40 p-1 flex flex-col z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {([
                            { key: 'es' as const, label: 'Español' },
                            { key: 'en' as const, label: 'English' },
                          ]).map(({ key, label }) => (
                            <button
                              key={key}
                              onClick={() => handleLanguageChange(key)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors border-0 bg-transparent text-left w-full cursor-pointer",
                                currentLanguage === key
                                  ? "text-stone-900 dark:text-white font-medium"
                                  : "text-stone-600 dark:text-neutral-400 hover:bg-stone-50 dark:hover:bg-neutral-800"
                              )}
                            >
                              <span className="flex-1">{label}</span>
                              {currentLanguage === key && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Ayuda */}
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline cursor-pointer"
                  >
                    <HelpCircle className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                    <span className="flex-1 font-medium">Ayuda</span>
                    <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-neutral-500" />
                  </Link>

                  <div className="h-px bg-stone-100 dark:bg-neutral-800 mx-2 my-1" />

                  {/* Cerrar sesión */}
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
                  >
                    <LogOut className="h-4 w-4 text-stone-400 dark:text-neutral-500 shrink-0" />
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile trigger button (matching Grok: avatar+name ↕ 🔔) ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen((o) => !o);
              if (profileMenuOpen) setActiveSubmenu(null);
            }}
            className="flex-1 flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-stone-50 dark:hover:bg-neutral-800/50 cursor-pointer border-0 bg-transparent min-w-0"
          >
            {/* Avatar with subscription badge */}
            <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
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
              {/* Tier badge below avatar */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[7px] font-bold px-1.5 py-px rounded-full border-2 border-white dark:border-black uppercase tracking-wider leading-none whitespace-nowrap">
                {tierLabel}
              </span>
            </div>

            {/* Name + expand icon */}
            <span className="truncate text-[13px] font-medium text-stone-800 dark:text-neutral-200 min-w-0">
              {displayName}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 text-stone-400 dark:text-neutral-500 shrink-0 ml-auto" />
          </button>

          {/* Bell icon */}
          <button
            onClick={() => router.push("/comunidad/inicio")}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 dark:text-neutral-500 hover:bg-stone-50 dark:hover:bg-neutral-800 hover:text-stone-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer border-0 bg-transparent"
            title="Notificaciones"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
