"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Radio,
  Sparkles,
  Building2,
  ShieldAlert,
  User,
  Award,
  Settings,
  ChevronLeft,
  LogOut,
  X,
  CreditCard,
  ExternalLink,
  Search,
  Bell,
  ArrowRight,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { getUnreadNotificationCount } from "@/lib/supabase/comunidad";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface SidebarTab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  group: string;
  badge?: number;
  showPing?: boolean;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onExpand: () => void;
  isAdmin: boolean;
  isOrgManager: boolean;
  userProfile: {
    full_name: string;
    email: string;
    subscription_plan?: string | null;
  } | null;
  authLoading?: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenSettings: () => void;
  onUpgradeClick: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  onExpand,
  isAdmin,
  isOrgManager,
  userProfile,
  authLoading = false,
  mobileOpen,
  onMobileClose,
  onOpenSettings,
  onUpgradeClick,
}: SidebarProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUpcomingLives, setHasUpcomingLives] = useState(false);

  // Fetch unread count on mount
  useEffect(() => {
    getUnreadNotificationCount().then(setUnreadCount);
  }, []);

  // Check for upcoming live classes to display the Live tab
  useEffect(() => {
    const checkLives = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("live_classes")
          .select("id")
          .eq("status", "scheduled")
          .gte("scheduled_at", new Date().toISOString())
          .limit(1);
        if (data && data.length > 0) {
          setHasUpcomingLives(true);
        }
      } catch (err) {
        console.error("Error checking upcoming lives:", err);
      }
    };
    checkLives();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // "[" toggles collapse (unless typing)
      if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey && !typing) {
        onToggleCollapse();
        return;
      }

      // "/" focuses the search input (expand sidebar first if collapsed)
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !typing) {
        e.preventDefault();
        if (collapsed) onExpand();
        // wait a tick for the sidebar to expand before focusing
        setTimeout(() => searchRef.current?.focus(), 60);
      }
    },
    [onToggleCollapse, collapsed, onExpand]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close user menu when tab changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [activeTab]);

  const tabs: SidebarTab[] = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard, color: "text-blue-500", group: "Principal" },
    { id: "cursos", label: "Cursos", icon: GraduationCap, color: "text-indigo-500", group: "Principal" },
    ...(hasUpcomingLives
      ? [{ id: "live", label: "En Vivo", icon: Radio, color: "text-rose-500", group: "Principal", showPing: true }]
      : []),
    { id: "ai", label: "IA", icon: Sparkles, color: "text-purple-500", group: "Principal" },
    { id: "perfil", label: "Mi Perfil", icon: User, color: "text-cyan-500", group: "Personal" },
    { id: "certificados", label: "Certificados", icon: Award, color: "text-amber-500", group: "Personal" },
    ...(isOrgManager
      ? [{ id: "business", label: "Empresa", icon: Building2, color: "text-slate-500", group: "Gestión" }]
      : []),
  ];

  const groups = tabs.reduce<Record<string, SidebarTab[]>>((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  const displayName =
    userProfile?.full_name || userProfile?.email || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  const planLabel = userProfile?.subscription_plan?.replace("plan_", "").toUpperCase() || null;
  const sidebarWidth = collapsed ? 72 : 260;

  const handleSidebarClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest("button, a, input, select, textarea");
    if (!isInteractive) {
      onToggleCollapse();
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "flex flex-col h-full relative selection:bg-transparent",
        collapsed ? "cursor-pointer select-none" : "cursor-default"
      )}
      onClick={handleSidebarClick}
    >
      {/* Logo + Collapse button */}
      <div className={`flex items-center shrink-0 ${collapsed ? "justify-center px-2" : "px-4"} h-[68px] border-b border-gray-100`}>
        <Link href="/" className="flex items-center justify-center no-underline group shrink-0">
          {collapsed ? (
            <div className="relative w-9 h-9 shrink-0 overflow-hidden flex items-center justify-center">
              <Image
                src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                alt="ProgramBI"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="relative w-36 h-[34px] shrink-0 overflow-hidden flex items-center justify-center">
              <Image
                src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                alt="ProgramBI"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </Link>
      </div>

      {/* ─── SEARCH SECTION ─── */}
      <div className={`shrink-0 border-b border-gray-100 ${collapsed ? "px-2 py-3 flex flex-col items-center gap-2" : "px-3 py-3"}`}>
        {collapsed ? (
          <button
            onClick={() => { onExpand(); setTimeout(() => searchRef.current?.focus(), 60); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Buscar (expande la barra)"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
        ) : (
          <div className={`relative w-full transition-all duration-200 ${searchFocused ? "ring-2 ring-brand-blue/20 bg-white" : "bg-gray-50"} rounded-xl`}>
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${searchFocused ? "text-brand-blue" : "text-gray-400"}`} />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-7 py-2 bg-transparent border border-transparent rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-400 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            ) : (
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center h-5 min-w-[18px] px-1 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-gray-400 select-none">
                /
              </kbd>
            )}
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
        {Object.entries(groups).map(([groupName, groupTabs]) => (
          <div key={groupName}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2 overflow-hidden"
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3">
                    {groupName}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {groupTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      onMobileClose();
                    }}
                    title={collapsed ? tab.label : undefined}
                    className={`relative w-full flex items-center gap-3 font-medium text-[13px] transition-all duration-200
                      ${collapsed ? "justify-center px-2 py-2.5 rounded-xl" : "px-3 py-2.5 rounded-xl"}
                      ${isActive
                        ? "bg-gradient-to-r from-brand-blue/10 to-brand-blue/[0.02] text-brand-blue"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        className={`absolute top-1.5 bottom-1.5 rounded-full bg-brand-blue ${collapsed ? "left-0 w-[3px]" : "-left-3 w-[3px]"}`}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span className="relative shrink-0">
                      <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-brand-blue" : collapsed ? "text-gray-400" : tab.color}`} />
                      {tab.showPing && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                      )}
                    </span>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className={`whitespace-nowrap overflow-hidden ${isActive ? "font-semibold" : ""}`}
                        >
                          {tab.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {tab.badge && tab.badge > 0 && (
                      <span className={`shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5
                        ${collapsed ? "absolute -top-1 -right-1" : "ml-auto"}
                        ${isActive ? "bg-brand-blue text-white" : "bg-rose-500 text-white"}`}>
                        {tab.badge > 99 ? "99+" : tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade Banner for Unsubscribed Students */}
      {(() => {
        const hasSubscription = !!userProfile?.subscription_plan || isAdmin;
        if (!collapsed && !hasSubscription) {
          return (
            <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-brand-blue/5 border border-brand-blue/10 relative overflow-hidden shadow-sm shrink-0">
              {/* Sparkles glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue bg-white px-2 py-0.5 rounded-full border border-brand-blue/10 inline-flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" /> Acceso Completo
                </span>
                <h4 className="text-xs font-black text-gray-900 mt-2.5 leading-snug">
                  Desbloquea los 4 cursos
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                  Obtén acceso ilimitado a SQL, Power BI, Python y Excel.
                </p>
                <button
                  onClick={onUpgradeClick}
                  className="w-full mt-3 py-2 bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-black rounded-lg transition-all active:scale-[0.98] border-0 cursor-pointer shadow-sm flex items-center justify-center gap-1"
                >
                  Suscribirse
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        }
        return null;
      })()}
      {/* Empty space filler that acts as a clickable area to collapse */}
      <div className="flex-grow cursor-pointer" />      {/* ─── USER SECTION (bottom) ─── */}
      <div className={`shrink-0 border-t border-gray-100 ${collapsed ? "p-2 flex justify-center" : "p-3"}`}>
        {authLoading && !userProfile ? (
          // Loading skeleton (avoids the "??" / empty flash while the session
          // is being resolved from local storage).
          collapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <div className="w-full flex items-center gap-3 p-2.5 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          )
        ) : collapsed ? (
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all"
            title={displayName}
          >
            {initials}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold px-1 ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex-1 flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-200 cursor-pointer border-0 bg-transparent min-w-0
                ${userMenuOpen ? "bg-brand-blue/5 ring-1 ring-brand-blue/20" : "hover:bg-gray-50"}`}
            >
              {/* Avatar with subscription badge */}
              <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                <span aria-hidden>{initials}</span>
                {/* Tier badge below avatar */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] font-bold px-1.5 py-px rounded-full border-2 border-white dark:border-neutral-900 uppercase tracking-wider leading-none whitespace-nowrap">
                  {planLabel || "FREE"}
                </span>
              </div>

              {/* Name */}
              <span className="truncate text-[13px] font-semibold text-gray-700 min-w-0">
                {displayName}
              </span>
            </button>

            {/* Bell icon */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors shrink-0 cursor-pointer border-0 bg-transparent relative"
              title="Notificaciones"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* ─── USER DROPDOWN MENU (elegant, upward) ─── */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(
              "fixed z-50 bg-white rounded-2xl shadow-2xl shadow-gray-300/30 border border-gray-100 overflow-hidden",
              collapsed ? "bottom-16 left-3 w-56" : "bottom-16 left-3 w-[236px]"
            )}
          >
            {/* User header */}
            <div className="p-4 bg-gradient-to-br from-brand-blue/5 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate">
                    {userProfile?.full_name || "Usuario"}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">{userProfile?.email}</div>
                  {planLabel && (
                    <span className="inline-block mt-1 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue">
                      {planLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              <MenuItem
                icon={User}
                label="Mi Perfil"
                onClick={() => {
                  onTabChange("perfil");
                  setUserMenuOpen(false);
                }}
              />
              <MenuItem
                icon={Award}
                label="Certificados"
                onClick={() => {
                  onTabChange("certificados");
                  setUserMenuOpen(false);
                }}
              />
              <MenuItem
                icon={CreditCard}
                label="Suscripción"
                onClick={() => {
                  onUpgradeClick();
                  setUserMenuOpen(false);
                }}
              />

              <div className="my-1.5 h-px bg-gray-100" />

              <MenuItem
                icon={Settings}
                label="Configuración"
                onClick={() => {
                  onOpenSettings();
                  setUserMenuOpen(false);
                }}
              />

              {isAdmin && (
                <>
                  <div className="my-1.5 h-px bg-gray-100" />
                  <a
                    href="/admin"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-600 hover:bg-amber-50 transition-colors font-medium no-underline"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Panel Admin
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </a>
                </>
              )}

              <div className="my-1.5 h-px bg-gray-100" />

              <a
                href="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium no-underline"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 overflow-hidden z-30"
      >
        {sidebarContent}
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} onUnreadChange={setUnreadCount} collapsed={collapsed} />
    </>
  );
}

/* ── Menu Item Component ── */
function MenuItem({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
    >
      <Icon className="w-4 h-4 text-gray-400" />
      {label}
    </button>
  );
}
