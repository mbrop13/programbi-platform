"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
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
  Clock,
  Gauge,
  AlertTriangle,
  Sparkles,
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
import { Tooltip } from "./Tooltip";
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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

function barColor(pct: number): string {
  if (pct >= 90) return "bg-rose-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-indigo-600";
}

function formatRemaining(isoDate?: string): string {
  if (!isoDate) return "ya";
  const ms = new Date(isoDate).getTime() - Date.now();
  if (ms <= 0) return "ya";
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return `${h}h ${m}m`;
  return `${Math.round(h / 24)}d`;
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
  collapsed = false,
  onToggleCollapse,
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
  const [activeSettingsTab, setActiveSettingsTab] = useState<'cuenta' | 'limites' | 'apariencia' | 'comportamiento' | 'customize' | 'datos'>('cuenta');

  const [quotaData, setQuotaData] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);

  useEffect(() => {
    if (activeSettingsTab === "limites" && !quotaData) {
      setQuotaLoading(true);
      fetch("/api/ai/quota")
        .then((r) => r.json())
        .then((data) => {
          setQuotaData(data);
        })
        .catch((err) => {
          console.error("Error loading quota data:", err);
        })
        .finally(() => setQuotaLoading(false));
    }
  }, [activeSettingsTab, quotaData]);

  // Behavior toggle switch states
  const [reasoningEnabled, setReasoningEnabled] = useState(true);
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);
  const [dataTrainingEnabled, setDataTrainingEnabled] = useState(true);

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

  const cleanDisplayName = useMemo(() => {
    if (userName && !userName.includes("@")) {
      return userName;
    }
    const emailToUse = userEmail || (userName && userName.includes("@") ? userName : "");
    if (emailToUse) {
      return emailToUse.split("@")[0];
    }
    return "Usuario";
  }, [userName, userEmail]);

  const initials = useMemo(() => {
    return cleanDisplayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?";
  }, [cleanDisplayName]);

  const tierLabel = useMemo(() => {
    if (isAdmin) return "Admin";
    if (!subscriptionPlan) return "Trial";
    const clean = subscriptionPlan.replace("plan_", "").toLowerCase();
    if (clean === "pro") return "Pro";
    if (clean === "expert") return "Expert";
    if (clean === "lite") return "Lite";
    return "Miembro";
  }, [subscriptionPlan, isAdmin]);

  const isPremiumUser = useMemo(() => {
    if (isAdmin) return true;
    if (!subscriptionPlan) return false;
    const clean = subscriptionPlan.replace("plan_", "").toLowerCase();
    return clean === "pro" || clean === "expert" || clean === "lite";
  }, [subscriptionPlan, isAdmin]);

  /** Estilo del badge de plan según tier (gradientes premium del manual). */
  const tierBadgeClass = useMemo(() => {
    if (isAdmin) {
      return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
    }
    const clean = subscriptionPlan?.replace("plan_", "").toLowerCase();
    if (clean === "expert") {
      return "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
    }
    if (clean === "pro" || clean === "lite") {
      return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white";
    }
    return "bg-black text-white";
  }, [subscriptionPlan, isAdmin]);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
    return (
      <button
        onClick={onChange}
        type="button"
        className={cn(
          "w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors border-0 outline-none shrink-0",
          checked ? "bg-blue-600" : "bg-stone-300"
        )}
      >
        <div
          className={cn(
            "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    );
  };

  /* ── Navigation items (matching the Grok sidebar image) ── */
  const navItems = [
    { 
      label: "Nuevo Chat", 
      icon: MessageSquarePlus, 
      onClick: () => {
        onNew();
        if (onClose) onClose();
      } 
    },
    {
      label: "Buscar",
      icon: Search,
      onClick: () => {
        window.dispatchEvent(new CustomEvent("open-search-modal"));
        if (onClose) onClose();
      }
    },
    { 
      label: "Inicio", 
      icon: Home, 
      href: "/comunidad/inicio",
      onClick: () => {
        if (onClose) onClose();
      }
    },
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
          if (!collapsed) startRename(c);
        }}
        title={collapsed ? (c.title || "Conversación") : undefined}
        className={cn(
          "group/chat group relative flex items-center transition-all duration-200 select-none cursor-pointer",
          collapsed ? "justify-center p-2 rounded-lg" : "rounded-lg px-3 py-2 text-[13px]",
          isActive
            ? "bg-stone-200 dark:bg-zinc-800 text-stone-900 dark:text-white font-bold"
            : "text-stone-600 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white"
        )}
      >
        {collapsed ? (
          <MessageSquare className="h-[18px] w-[18px] text-stone-500 dark:text-zinc-400 shrink-0" />
        ) : (
          <>
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
                  className="min-w-0 flex-1 rounded-md bg-white dark:bg-zinc-900 px-2 py-0.5 text-[13px] outline-none ring-1 ring-stone-300 dark:ring-zinc-700 text-stone-900 dark:text-white"
                />
              </>
            ) : (
              <span
                className="flex-1 truncate pr-8 text-stone-700 dark:text-zinc-200 group-hover:text-stone-950 dark:group-hover:text-white"
              >
                {c.title || "Sin título"}
              </span>
            )}

            {/* Acciones flotantes en hover (se superponen al texto) */}
            {!isEditing && (
              <div className={cn(
                "absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 opacity-0 group-hover/chat:opacity-100 transition-opacity rounded-lg shadow-sm border border-stone-300/40 dark:border-zinc-700/40",
                isActive
                  ? "bg-stone-300 dark:bg-zinc-700 text-stone-900 dark:text-white"
                  : "bg-stone-200 dark:bg-zinc-850 text-stone-700 dark:text-zinc-300"
              )}>
                {/* Botón de Renombrar */}
                <button
                  onClick={(e) => { e.stopPropagation(); startRename(c); }}
                  aria-label="Renombrar"
                  className="rounded p-1 text-stone-400 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                {/* Botón de Fijar */}
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(c.id); }}
                  aria-label={c.pinned ? "Desfijar" : "Fijar"}
                  className={cn(
                    "rounded p-1 border-0 bg-transparent cursor-pointer",
                    c.pinned ? "text-indigo-500" : "text-stone-400 hover:text-stone-700 dark:hover:text-white"
                  )}
                >
                  <Pin className="h-3 w-3" />
                </button>
                {/* Botón de Archivar */}
                <button
                  onClick={(e) => { e.stopPropagation(); onArchive(c.id); }}
                  aria-label="Archivar"
                  className="rounded p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer"
                >
                  <Archive className="h-3 w-3" />
                </button>
                {/* Botón de Eliminar */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                  aria-label="Eliminar"
                  className="rounded p-1 text-stone-400 hover:text-red-655 dark:hover:text-red-400 border-0 bg-transparent cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const handleSidebarClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest("button, a, input, select, textarea");
    if (!isInteractive && onToggleCollapse) {
      onToggleCollapse();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#F9F9FB] dark:bg-zinc-950 border-r border-stone-200 dark:border-zinc-800/80 relative overflow-visible selection:bg-transparent",
        collapsed ? "cursor-pointer select-none" : "cursor-default"
      )}
      onClick={handleSidebarClick}
    >
      {/* ═══ Header: Logo ═══ */}
      <div className={cn(
        "flex h-14 shrink-0 items-center justify-between px-5",
        collapsed && "justify-center px-2"
      )}>
        {collapsed ? (
          <div className="relative w-9 h-9 shrink-0 overflow-hidden flex items-center justify-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
              alt="ProgramBI"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="relative w-24 h-10 flex items-center shrink-0">
              <Image
                src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                alt="ProgramBI Logo"
                width={96}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        )}
        {((onToggleCollapse || onClose) && !collapsed) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleCollapse) onToggleCollapse();
              else if (onClose) onClose();
            }}
            aria-label="Colapsar menú"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 dark:text-zinc-550 hover:bg-stone-200/50 dark:hover:bg-zinc-800/50 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* ═══ Navigation Items ═══ */}
      <nav className={cn("px-3 space-y-0.5 pb-4", collapsed && "px-2 flex flex-col items-center gap-1.5")}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const buttonClass = cn(
            "flex items-center rounded-lg text-[14px] font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white transition-all duration-200 border-0 bg-transparent text-left cursor-pointer",
            collapsed ? "justify-center p-2.5 w-10 h-10" : "w-full gap-3.5 px-3 py-2.5"
          );
          const renderedButton = item.href ? (
            <Link
              href={item.href}
              onClick={item.onClick}
              className={cn(buttonClass, "no-underline")}
            >
              <Icon className="h-[18px] w-[18px] text-stone-500 dark:text-zinc-400 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden block w-[160px] truncate text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              className={buttonClass}
            >
              <Icon className="h-[18px] w-[18px] text-stone-500 dark:text-zinc-400 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden block w-[160px] truncate text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );

          return (
            <React.Fragment key={idx}>
              {collapsed ? (
                <Tooltip content={item.label} position="right">
                  {renderedButton}
                </Tooltip>
              ) : (
                renderedButton
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ═══ Chats Section ═══ */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-stone-200 dark:border-zinc-800/80">
        {!collapsed ? (
          <button
            onClick={() => setChatsOpen(!chatsOpen)}
            className="w-full flex items-center justify-between px-5 py-3 text-[14px] font-semibold text-stone-900 dark:text-white hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 transition-colors border-0 bg-transparent cursor-pointer select-none shrink-0"
          >
            <span>Chats</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-stone-500 dark:text-zinc-400 transition-transform duration-200",
              chatsOpen ? "" : "-rotate-90"
            )} />
          </button>
        ) : null}

        {!collapsed && chatsOpen && (
          <div className={cn("flex-1 overflow-y-auto pb-3 space-y-1 scrollbar-hide", collapsed ? "px-2" : "px-3")}>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
              </div>
            ) : chats.length === 0 ? (
              !collapsed && (
                <p className="py-10 text-center text-[13px] text-stone-400 dark:text-zinc-500">
                  Aún no hay conversaciones
                </p>
              )
            ) : (
              <>
                {pinned.length > 0 && (
                  <div className="space-y-0.5">
                    {!collapsed && (
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Fijados
                      </div>
                    )}
                    {pinned.map(renderRow)}
                  </div>
                )}
                {groups.map(([label, items]) => (
                  <div key={label} className="space-y-0.5">
                    {!collapsed && (
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {label}
                      </div>
                    )}
                    {items.map(renderRow)}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── Footer: Profile + Bell ─── */}
      <div className="shrink-0 border-t border-stone-200 dark:border-zinc-800/80 px-3 py-3 relative" ref={profileMenuRef}>
        {/* ── Profile Popup Menu ── */}
        <AnimatePresence>
          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "fixed z-50 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800/80 rounded-2xl shadow-xl p-1.5 flex flex-col w-56 mb-2",
                collapsed ? "bottom-16 left-3" : "bottom-16 left-3 w-[236px]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Email header */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
                <User className="h-4 w-4 text-stone-400 dark:text-zinc-500 shrink-0" />
                <span className="truncate text-[13px] font-medium text-stone-600 dark:text-zinc-400">{userEmail || cleanDisplayName}</span>
              </div>

              <div className="h-px bg-stone-100 dark:bg-zinc-800/80 mx-2 my-1" />

              {/* Todos los ajustes */}
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
              >
                <Settings className="h-4 w-4 text-stone-500 dark:text-zinc-400 shrink-0" />
                <span className="flex-1 font-semibold text-left">Todos los ajustes</span>
                <span className="text-[11px] text-stone-400 dark:text-zinc-500 font-mono">⇧^,</span>
              </button>

              {/* Actualizar plan */}
              <Link
                href="/comunidad/planes"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white transition-colors no-underline cursor-pointer"
              >
                <ArrowUpCircle className="h-4 w-4 text-stone-500 dark:text-zinc-400 shrink-0" />
                <span className="font-semibold">Actualizar plan</span>
              </Link>

              {/* Instalar apps */}
              <button
                onClick={() => alert("La aplicación de escritorio se encuentra en desarrollo.")}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
              >
                <Download className="h-4 w-4 text-stone-500 shrink-0" />
                <span className="font-semibold">Instalar apps</span>
              </button>

              <div className="h-px bg-stone-100 mx-2 my-1" />

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
                      ? "bg-stone-200/40 dark:bg-zinc-800/60 text-stone-900 dark:text-white"
                      : "text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white"
                  )}
                >
                  <Sun className="h-4 w-4 text-stone-500 dark:text-zinc-450 shrink-0" />
                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <span className="font-semibold">Apariencia</span>
                    <span className="text-[11px] text-stone-400 dark:text-zinc-500 capitalize">{currentTheme}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500 shrink-0" />
                </button>

                {/* Flyout submenu - Apariencia */}
                <AnimatePresence>
                  {activeSubmenu === 'apariencia' && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-lg p-1 flex flex-col z-50"
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
                              ? "text-stone-900 dark:text-white font-bold"
                              : "text-stone-600 dark:text-zinc-400 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white"
                          )}
                        >
                          <Ic className="h-4 w-4 text-stone-550 dark:text-zinc-500 shrink-0" />
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
                      ? "bg-stone-200/40 dark:bg-zinc-800/60 text-stone-900 dark:text-white"
                      : "text-stone-700 dark:text-zinc-300 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white"
                  )}
                >
                  <Globe className="h-4 w-4 text-stone-500 dark:text-zinc-450 shrink-0" />
                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <span className="font-semibold">Idioma</span>
                    <span className="text-[11px] text-stone-400 dark:text-zinc-500">{currentLanguage === 'es' ? 'Español' : 'English'}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500 shrink-0" />
                </button>

                {/* Flyout submenu - Idioma */}
                <AnimatePresence>
                  {activeSubmenu === 'idioma' && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-lg p-1 flex flex-col z-50"
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
                              ? "text-stone-900 dark:text-white font-bold"
                              : "text-stone-605 dark:text-zinc-400 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-900 dark:hover:text-white"
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 hover:bg-stone-200/35 hover:text-stone-900 transition-colors no-underline cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-stone-500 shrink-0" />
                <span className="flex-1 font-semibold">Ayuda</span>
                <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>

              <div className="h-px bg-stone-100 dark:bg-zinc-800/80 mx-2 my-1" />

              {/* Cerrar sesión */}
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut({ scope: "global" });
                  window.location.replace("/");
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-stone-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 dark:hover:text-red-400 transition-colors cursor-pointer border-0 bg-transparent text-left w-full"
              >
                <LogOut className="h-4 w-4 text-stone-400 dark:text-zinc-550 shrink-0" />
                <span className="font-semibold">Cerrar sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Notifications Popover ── */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "fixed z-50 w-[320px] mb-2 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800/80 rounded-2xl shadow-xl p-4 flex flex-col text-stone-900 dark:text-white",
                collapsed ? "bottom-16 left-[78px]" : "bottom-16 left-[266px]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col" ref={notifRef}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-stone-900 dark:text-white">Notificaciones</span>
                  <button className="text-stone-400 dark:text-zinc-550 hover:text-stone-700 dark:hover:text-zinc-300 border-0 bg-transparent cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="h-px bg-stone-100 dark:bg-zinc-800/80 my-3" />

                {/* Empty State Body */}
                <div className="flex flex-col items-center justify-center py-8">
                  <Inbox className="w-12 h-12 text-stone-300 dark:text-zinc-700 mb-3" />
                  <span className="text-xs font-semibold text-stone-500 dark:text-zinc-450">
                    Tus notificaciones aparecerán aquí
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed ? (
          <div className="flex items-center justify-center">
            <Tooltip content={cleanDisplayName} position="right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen((o) => !o);
                  if (profileMenuOpen) setActiveSubmenu(null);
                }}
                className={cn(
                  "relative h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all border-0",
                  isPremiumUser && "ring-[1.5px] ring-stone-800 dark:ring-white/80"
                )}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={cleanDisplayName}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span aria-hidden>{initials}</span>
                )}

              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen((o) => !o);
                if (profileMenuOpen) setActiveSubmenu(null);
              }}
              className="flex-1 flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 cursor-pointer border-0 bg-transparent min-w-0"
            >
              {/* Avatar with subscription badge */}
              <div className={cn(
                "relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs",
                isPremiumUser && "ring-[1.5px] ring-stone-800 dark:ring-white/80"
              )}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={cleanDisplayName}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span aria-hidden>{initials}</span>
                )}

              </div>

              {/* Name */}
              <span className="truncate text-[13px] font-semibold text-stone-850 dark:text-zinc-200 min-w-0">
                {cleanDisplayName}
              </span>
            </button>

            {/* Bell icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen(!notifOpen);
              }}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-500 dark:text-zinc-400 hover:bg-stone-200/35 dark:hover:bg-zinc-800/40 hover:text-stone-850 dark:hover:text-white transition-colors shrink-0 cursor-pointer border-0 bg-transparent"
              title="Notificaciones"
            >
              <Bell className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>

      {/* ── Settings Dialog Modal (Viewport overlay) ── */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-4 cursor-pointer"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-[850px] h-[500px] bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex overflow-hidden relative text-stone-900 dark:text-white cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSettingsOpen(false)}
                className="absolute top-5 right-5 text-stone-400 dark:text-zinc-550 hover:text-stone-700 dark:hover:text-white border-0 bg-transparent cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left column navigation */}
              <div className="w-60 border-r border-stone-200 dark:border-zinc-800/80 p-5 flex flex-col gap-1.5 shrink-0 bg-stone-50/50 dark:bg-zinc-900/30">
                {[
                  { id: 'cuenta' as const, label: 'Cuenta', icon: User },
                  { id: 'limites' as const, label: 'Límites de Uso', icon: Sparkles },
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
                          ? "bg-stone-200/60 dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm"
                          : "text-stone-600 dark:text-zinc-400 hover:bg-stone-200/25 dark:hover:bg-zinc-800/30"
                      )}
                    >
                      <TabIcon className="w-4 h-4 text-stone-500 dark:text-zinc-500 shrink-0" />
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
                    <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-zinc-800/80">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarUrl} alt={cleanDisplayName} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-black text-stone-850 dark:text-zinc-200 truncate">{cleanDisplayName}</h4>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 truncate">{userEmail}</p>
                      </div>
                      <button className="border border-stone-250 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-zinc-300">
                        Administrar
                      </button>
                    </div>

                    {/* ProgramBI Premium Row */}
                    {!isPremiumUser && (
                      <div className="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-zinc-800/80">
                        <div className="w-8 h-8 rounded-full bg-indigo-55/60 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                          <Sliders className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Obtener ProgramBI Premium</h4>
                        </div>
                        <button
                          onClick={() => { setSettingsOpen(false); router.push('/comunidad/planes'); }}
                          className="border border-stone-250 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-zinc-300"
                        >
                          Actualizar
                        </button>
                      </div>
                    )}

                    {/* Idioma Row */}
                    <div className="flex items-center gap-4 py-4">
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Idioma</h4>
                        <p className="text-xs text-stone-500 dark:text-zinc-450 mt-0.5">{currentLanguage === 'es' ? 'Español' : 'Inglés'}</p>
                      </div>
                      <button className="border border-stone-250 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-xs px-4 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer bg-transparent text-stone-750 dark:text-zinc-300">
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'limites' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Límites de Uso</h3>
                    {quotaLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-3 flex-grow">
                        <Loader2 className="w-8.5 h-8.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs text-stone-400 dark:text-zinc-500 font-bold">Cargando límites de uso...</span>
                      </div>
                    ) : quotaData ? (
                      <div className="space-y-5">
                        {/* Banner de Estado General */}
                        <div className={cn(
                          "p-5 rounded-2xl border relative overflow-hidden flex items-center justify-between shadow-sm",
                          quotaData.unlimited
                            ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                            : "bg-neutral-50/50 dark:bg-zinc-900/30 border-neutral-100 dark:border-zinc-800/80"
                        )}>
                          <div className="relative z-10 flex items-center gap-3.5">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              quotaData.unlimited ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" : "bg-indigo-55/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                            )}>
                              <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                              <div className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">
                                Membresía: <span className="uppercase text-indigo-600 dark:text-indigo-400 font-black">{quotaData.plan || "free"}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">
                                {quotaData.unlimited
                                  ? "Tu cuenta tiene habilitado el acceso ilimitado de administrador a la IA."
                                  : "A continuación se muestra el consumo real de tu cuenta para este periodo."}
                              </p>
                            </div>
                          </div>
                          {quotaData.unlimited && (
                            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 border border-amber-200/50 dark:border-amber-900 px-2.5 py-1 rounded-lg">
                              Ilimitado
                            </span>
                          )}
                        </div>

                        {/* Tarjetas de Límites */}
                        {!quotaData.unlimited && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tarjeta 1: 5 Horas */}
                            <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Próximas 5h</span>
                                <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                              </div>
                              <div className="mt-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                    {Math.max(0, 100 - quotaData.percentages.five_hour)}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold">restante</span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mt-1.5">
                                  {quotaData.used.five_hour} de {quotaData.quota.fiveHour} mensajes
                                </span>
                              </div>
                              <div className="mt-4">
                                <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all duration-500", barColor(quotaData.percentages.five_hour))}
                                    style={{ width: `${Math.max(0, 100 - quotaData.percentages.five_hour)}%` }}
                                  />
                                </div>
                                <span className="text-[8px] text-slate-400 dark:text-zinc-500 mt-2 block font-semibold">
                                  Reinicia en {formatRemaining(quotaData.resetAt)}
                                </span>
                              </div>
                            </div>

                            {/* Tarjeta 2: Semanal */}
                            <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Semanal</span>
                                <Gauge className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                              </div>
                              <div className="mt-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                    {Math.max(0, 100 - quotaData.percentages.weekly)}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold">restante</span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mt-1.5">
                                  {quotaData.used.weekly} de {quotaData.quota.weekly} mensajes
                                </span>
                              </div>
                              <div className="mt-4">
                                <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all duration-500", barColor(quotaData.percentages.weekly))}
                                    style={{ width: `${Math.max(0, 100 - quotaData.percentages.weekly)}%` }}
                                  />
                                </div>
                                <span className="text-[8px] text-slate-400 dark:text-zinc-500 mt-2 block font-semibold">
                                  Límite rotativo de 7 días
                                </span>
                              </div>
                            </div>

                            {/* Tarjeta 3: Mensual */}
                            <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Mensual</span>
                                <Gauge className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                              </div>
                              <div className="mt-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                    {Math.max(0, 100 - quotaData.percentages.monthly)}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold">restante</span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mt-1.5">
                                  {quotaData.used.monthly} de {quotaData.quota.monthly} mensajes
                                </span>
                              </div>
                              <div className="mt-4">
                                <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all duration-500", barColor(quotaData.percentages.monthly))}
                                    style={{ width: `${Math.max(0, 100 - quotaData.percentages.monthly)}%` }}
                                  />
                                </div>
                                <span className="text-[8px] text-slate-400 dark:text-zinc-500 mt-2 block font-semibold">
                                  Reinicio automático mensual
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-zinc-500 flex-grow">
                        <AlertTriangle className="w-8 h-8 mb-2 text-rose-500" />
                        <span className="text-xs font-bold">No se pudieron cargar los límites de uso.</span>
                      </div>
                    )}
                  </div>
                )}

                {activeSettingsTab === 'apariencia' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Apariencia</h3>
                    <p className="text-sm text-stone-500 dark:text-zinc-450 mb-6">Personaliza el aspecto visual del Mentor IA en tu pantalla.</p>
                    
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
                              : "border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:border-stone-300 dark:hover:border-zinc-700"
                          )}
                        >
                          <Ic className={cn("w-5 h-5", currentTheme === key ? "text-blue-500" : "text-stone-400 dark:text-zinc-550")} />
                          <div>
                            <h4 className="text-sm font-black text-stone-850 dark:text-zinc-200">{label}</h4>
                            <p className="text-[11px] text-stone-500 dark:text-zinc-500 mt-1 leading-normal">{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'comportamiento' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Comportamiento</h3>
                    <p className="text-sm text-stone-500 dark:text-zinc-450 mb-6">Ajusta cómo interactúa y responde el Mentor IA en las conversaciones.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-zinc-800/80">
                        <div className="pr-4">
                          <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Razonamiento profundo</h4>
                          <p className="text-xs text-stone-500 dark:text-zinc-450 mt-0.5">Permite explicaciones matemáticas y lógicas paso a paso.</p>
                        </div>
                        <ToggleSwitch checked={reasoningEnabled} onChange={() => setReasoningEnabled(!reasoningEnabled)} />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-zinc-800/80">
                        <div className="pr-4">
                          <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Auto-completado de código</h4>
                          <p className="text-xs text-stone-500 dark:text-zinc-450 mt-0.5">Sugiere bloques de SQL, Python o DAX mientras escribes.</p>
                        </div>
                        <ToggleSwitch checked={autocompleteEnabled} onChange={() => setAutocompleteEnabled(!autocompleteEnabled)} />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'customize' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Customize</h3>
                    <p className="text-sm text-stone-500 dark:text-zinc-450 mb-6">Instrucciones personalizadas y sistema de prompts predeterminados.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">Instrucciones para el Mentor</label>
                        <textarea
                          rows={4}
                          placeholder="Ej. 'Siempre responde con explicaciones cortas y código en Python listo para copiar...'"
                          className="w-full rounded-xl border border-stone-200 dark:border-zinc-800/80 bg-transparent p-3 text-sm text-stone-800 dark:text-zinc-200 outline-none focus:border-blue-500 placeholder-stone-400 dark:placeholder-zinc-650"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'datos' && (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mb-6">Controles de datos</h3>
                    <p className="text-sm text-stone-500 dark:text-zinc-450 mb-6">Administra tu historial de chats, exportaciones y seguridad.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-zinc-800/80">
                        <div className="pr-4">
                          <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Historial de chat y entrenamiento</h4>
                          <p className="text-xs text-stone-500 dark:text-zinc-450 mt-0.5">Guarda los nuevos chats del mentor en este dispositivo.</p>
                        </div>
                        <ToggleSwitch checked={dataTrainingEnabled} onChange={() => setDataTrainingEnabled(!dataTrainingEnabled)} />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-zinc-800/80">
                        <div>
                          <h4 className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Exportar datos</h4>
                          <p className="text-xs text-stone-500 dark:text-zinc-450 mt-0.5">Descarga un archivo JSON con todo tu historial de chats.</p>
                        </div>
                        <button className="border border-stone-250 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-xs px-4 py-1.5 rounded-full font-bold cursor-pointer bg-transparent text-stone-750 dark:text-zinc-300 transition-colors">
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
