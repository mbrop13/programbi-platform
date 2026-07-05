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
  MoreHorizontal,
  Inbox,
  Cpu,
  Sliders,
  Database,
  X,
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
  
  // New States for settings and notifications popovers
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'cuenta' | 'apariencia' | 'comportamiento' | 'customize' | 'datos'>('cuenta');

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
    const handler = (e: MouseEvent) => {
      if (profileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
        setActiveSubmenu(null);
      }
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen, notifOpen]);

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
            ? "bg-stone-250/60 dark:bg-neutral-800 font-medium text-stone-900 dark:text-white"
            : "text-stone-600 dark:text-neutral-400 hover:bg-stone-200/25 dark:hover:bg-neutral-800/50 hover:text-stone-900 dark:hover:text-white"
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
    <div className="flex h-full flex-col bg-[#F9F9FB] dark:bg-black relative overflow-visible">
      {/* ═══ Header: Logo + Collapse ═══ */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <div className="flex items-center">
          <div className="relative w-12 h-6 flex items-center shrink-0">
            <Image
              src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
              alt="ProgramBI Logo"
              width={48}
              height={24}
              className="object-contain dark:invert"
            />
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Colapsar menú"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200/50 dark:hover:bg-neutral-800 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
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
                className="flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-stone-700 dark:text-neutral-300 hover:bg-stone-200/25 dark:hover:bg-neutral-800/60 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent text-left"
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
              className="flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-stone-700 dark:text-neutral-300 hover:bg-stone-200/25 dark:hover:bg-neutral-800/60 hover:text-stone-900 dark:hover:text-white transition-colors no-underline"
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
          className="w-full flex items-center justify-between px-5 py-3 text-[14px] font-medium text-stone-900 dark:text-white hover:bg-stone-200/25 dark:hover:bg-neutral-800/40 transition-colors border-0 bg-transparent cursor-pointer select-none shrink-0"
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
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
                  >
                    <Settings className="h-4 w-4 text-stone-500 dark:text-neutral-500 shrink-0" />
                    <span className="flex-1 font-medium">Todos los ajustes</span>
                    <span className="text-[11px] text-stone-400 dark:text-neutral-600 font-mono">⇧^,</span>
                  </button>

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

        {/* ── Notifications Popover ── */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bottom-full right-3 w-[320px] mb-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl shadow-xl p-4 flex flex-col text-stone-900 dark:text-white" ref={notifRef}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-stone-900 dark:text-white">Notificaciones</span>
                  <button className="text-stone-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="h-px bg-stone-100 dark:bg-neutral-800 my-3" />

                {/* Empty State Body */}
                <div className="flex flex-col items-center justify-center py-8">
                  <Inbox className="w-12 h-12 text-stone-300 dark:text-neutral-600 mb-3" />
                  <span className="text-xs font-semibold text-stone-500 dark:text-neutral-400">
                    Tus notificaciones aparecerán aquí
                  </span>
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
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen(!notifOpen);
            }}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 dark:text-neutral-500 hover:bg-stone-50 dark:hover:bg-neutral-800 hover:text-stone-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer border-0 bg-transparent"
            title="Notificaciones"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* ── Settings Dialog Modal (Viewport overlay) ── */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-[850px] h-[550px] bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex overflow-hidden relative text-stone-900 dark:text-white"
            >
              {/* Close button */}
              <button
                onClick={() => setSettingsOpen(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left column navigation */}
              <div className="w-60 border-r border-stone-100 dark:border-neutral-800 p-5 flex flex-col gap-1.5 shrink-0 bg-stone-50/50 dark:bg-neutral-900/50">
                {[
                  { id: 'cuenta' as const, label: 'Cuenta', icon: User },
                  { id: 'apariencia' as const, label: 'Apariencia', icon: Pencil },
                  { id: 'comportamiento' as const, label: 'Comportamiento', icon: Cpu },
                  { id: 'customize' as const, label: 'Customize', icon: Sliders },
                  { id: 'datos' as const, label: 'Controles de datos', icon: Database },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isTabActive = activeSettingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border-0 bg-transparent text-left cursor-pointer",
                        isTabActive
                          ? "bg-stone-200/60 dark:bg-neutral-800 text-stone-900 dark:text-white shadow-sm"
                          : "text-stone-600 dark:text-neutral-400 hover:bg-stone-200/25 dark:hover:bg-neutral-800/40"
                      )}
                    >
                      <TabIcon className="w-4 h-4 text-stone-500 dark:text-neutral-400 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right column details */}
              <div className="flex-1 flex flex-col p-8 min-w-0 overflow-y-auto">
                {activeSettingsTab === 'cuenta' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Cuenta</h3>
                    
                    {/* User row */}
                    <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-neutral-800">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-black text-stone-850 dark:text-white truncate">{displayName}</h4>
                        <p className="text-xs text-stone-500 dark:text-neutral-450 truncate">{userEmail}</p>
                      </div>
                      <button className="border border-stone-250 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-neutral-300">
                        Administrar
                      </button>
                    </div>

                    {/* ProgramBI Premium Row */}
                    <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-neutral-800">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                        <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-stone-850 dark:text-white">Obtener ProgramBI Premium</h4>
                      </div>
                      <button
                        onClick={() => { setSettingsOpen(false); router.push('/comunidad/planes'); }}
                        className="border border-stone-250 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-neutral-300"
                      >
                        Actualizar
                      </button>
                    </div>

                    {/* Conectar Redes Row */}
                    <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-neutral-800">
                      <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-stone-500 dark:text-neutral-450" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-stone-850 dark:text-white">Vincular Redes Sociales</h4>
                      </div>
                      <button className="border border-stone-250 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-neutral-300">
                        Conectar
                      </button>
                    </div>

                    {/* Idioma Row */}
                    <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-neutral-800">
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-stone-850 dark:text-white">Idioma</h4>
                        <p className="text-xs text-stone-500 dark:text-neutral-450 mt-0.5">{currentLanguage === 'es' ? 'Español' : 'Inglés'}</p>
                      </div>
                      <button className="border border-stone-250 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-neutral-300">
                        Cambiar
                      </button>
                    </div>

                    {/* Año de nacimiento Row */}
                    <div className="py-4">
                      <h4 className="text-sm font-semibold text-stone-850 dark:text-white">Año de nacimiento</h4>
                      <p className="text-xs text-stone-500 dark:text-neutral-450 mt-1">2007</p>
                    </div>

                    {/* Banner at bottom */}
                    <div className="mt-auto bg-stone-950 dark:bg-black rounded-2xl p-4 flex items-center justify-between border border-stone-850/80">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <Image
                            src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                            alt="ProgramBI"
                            width={20}
                            height={20}
                            className="object-contain invert brightness-200"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-[13px] font-black text-white">ProgramBI Premium</h5>
                          <p className="text-[10px] text-stone-400 mt-0.5">Menos límites de consulta, más capacidades</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSettingsOpen(false); router.push('/comunidad/planes'); }}
                        className="bg-white hover:bg-stone-100 text-stone-950 text-xs font-black px-4 py-2 rounded-full shrink-0 cursor-pointer border-0 transition-all active:scale-[0.98]"
                      >
                        Probar gratis
                      </button>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'apariencia' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Apariencia</h3>
                    <p className="text-sm text-stone-500 dark:text-neutral-400 mb-6">Personaliza el aspecto visual del Mentor IA en tu pantalla.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: 'claro' as const, label: 'Claro', icon: Sun, desc: 'Fondo brillante de alta legibilidad' },
                        { key: 'oscuro' as const, label: 'Oscuro', icon: Moon, desc: 'Fondo negro puro para evitar fatiga' },
                        { key: 'sistema' as const, label: 'Sistema', icon: Monitor, desc: 'Adapta según tu sistema operativo' },
                      ].map(({ key, label, icon: Ic, desc }) => (
                        <button
                          key={key}
                          onClick={() => handleThemeChange(key)}
                          className={cn(
                            "p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col gap-3 bg-transparent",
                            currentTheme === key
                              ? "border-blue-500 bg-blue-500/5 text-stone-900 dark:text-white font-medium"
                              : "border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-450 hover:border-stone-300 dark:hover:border-neutral-700"
                          )}
                        >
                          <Ic className={cn("w-5 h-5", currentTheme === key ? "text-blue-500" : "text-stone-400")} />
                          <div>
                            <h4 className="text-sm font-black">{label}</h4>
                            <p className="text-[11px] text-stone-500 dark:text-neutral-450 mt-1 leading-normal">{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'comportamiento' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Comportamiento</h3>
                    <p className="text-sm text-stone-500 dark:text-neutral-400 mb-6">Ajusta cómo interactúa y responde el Mentor IA en las conversaciones.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-sm font-semibold">Razonamiento profundo</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Permite explicaciones matemáticas y lógicas paso a paso.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-sm font-semibold">Auto-completado de código</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Sugiere bloques de SQL, Python o DAX mientras escribes.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'customize' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Customize</h3>
                    <p className="text-sm text-stone-500 dark:text-neutral-400 mb-6">Instrucciones personalizadas y sistema de prompts predeterminados.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 mb-2">Instrucciones para el Mentor</label>
                        <textarea
                          rows={4}
                          placeholder="Ej. 'Siempre responde con explicaciones cortas y código en Python listo para copiar...'"
                          className="w-full rounded-xl border border-stone-200 dark:border-neutral-850 bg-transparent p-3 text-sm text-stone-800 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'datos' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Controles de datos</h3>
                    <p className="text-sm text-stone-500 dark:text-neutral-400 mb-6">Administra tu historial de chats, exportaciones y seguridad.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-sm font-semibold">Historial de chat y entrenamiento</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Guarda los nuevos chats del mentor en este dispositivo.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-sm font-semibold">Exportar datos</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Descarga un archivo JSON con todo tu historial de chats.</p>
                        </div>
                        <button className="border border-stone-250 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs px-4 py-1.5 rounded-full font-bold cursor-pointer bg-transparent text-stone-750 dark:text-neutral-300">
                          Exportar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
