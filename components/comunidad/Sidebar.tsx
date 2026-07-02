"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Radio,
  MessageSquare,
  Sparkles,
  Building2,
  ShieldAlert,
  User,
  Users,
  Award,
  Settings,
  ChevronLeft,
  LogOut,
  X,
} from "lucide-react";

/* ── Tab definitions ── */
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
  isAdmin: boolean;
  isOrgManager: boolean;
  userProfile: {
    full_name: string;
    email: string;
    subscription_plan?: string | null;
  } | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  isAdmin,
  isOrgManager,
  userProfile,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  /* ── Keyboard shortcut: [ to toggle ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        onToggleCollapse();
      }
    },
    [onToggleCollapse]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Build tab list ── */
  const tabs: SidebarTab[] = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard, color: "text-blue-500", group: "Principal" },
    { id: "cursos", label: "Cursos", icon: GraduationCap, color: "text-indigo-500", group: "Principal" },
    { id: "live", label: "En Vivo", icon: Radio, color: "text-rose-500", group: "Principal", showPing: true },
    { id: "chat", label: "Comunidad", icon: MessageSquare, color: "text-emerald-500", group: "Principal" },
    { id: "ai", label: "IA", icon: Sparkles, color: "text-purple-500", group: "Principal" },
    // Personal
    { id: "perfil", label: "Mi Perfil", icon: User, color: "text-cyan-500", group: "Personal" },
    { id: "certificados", label: "Certificados", icon: Award, color: "text-amber-500", group: "Personal" },
    { id: "miembros", label: "Miembros", icon: Users, color: "text-teal-500", group: "Personal" },
    { id: "configuracion", label: "Configuración", icon: Settings, color: "text-gray-500", group: "Personal" },
    // Conditional
    ...(isOrgManager
      ? [{ id: "business", label: "Empresa", icon: Building2, color: "text-slate-500", group: "Gestión" }]
      : []),
    ...(isAdmin
      ? [{ id: "admin", label: "Admin", icon: ShieldAlert, color: "text-amber-500", group: "Gestión" }]
      : []),
  ];

  /* ── Group tabs ── */
  const groups = tabs.reduce<Record<string, SidebarTab[]>>((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  /* ── User initials ── */
  const initials = userProfile?.full_name
    ? userProfile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  /* ── Plan badge ── */
  const planLabel =
    userProfile?.subscription_plan?.replace("plan_", "").toUpperCase() || null;

  /* ── Sidebar width ── */
  const sidebarWidth = collapsed ? 72 : 260;

  /* ── Content ── */
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ─── Logo ─── */}
      <div className={`flex items-center shrink-0 ${collapsed ? "justify-center px-2" : "px-5"} h-[68px] border-b border-gray-100`}>
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
              alt="ProgramBI"
              fill
              className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden"
              >
                ProgramBI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ─── Nav Items ─── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
        {Object.entries(groups).map(([groupName, groupTabs]) => (
          <div key={groupName}>
            {/* Group label */}
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

            {/* Items */}
            <div className="space-y-0.5">
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
                    className={`relative w-full flex items-center gap-3 font-medium text-[13px] transition-all duration-150
                      ${collapsed ? "justify-center px-2 py-2.5 rounded-xl" : "px-3 py-2.5 rounded-xl"}
                      ${
                        isActive
                          ? "bg-brand-blue/10 text-brand-blue"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        className={`absolute top-1 bottom-1 rounded-r-full bg-brand-blue ${collapsed ? "left-0 w-[3px]" : "-left-3 w-[3px]"}`}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span className="relative shrink-0">
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors ${
                          isActive ? "text-brand-blue" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      {/* Ping dot for live */}
                      {tab.showPing && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                      )}
                    </span>

                    {/* Label */}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {tab.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {tab.badge && tab.badge > 0 && (
                      <span
                        className={`shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5
                          ${collapsed ? "absolute -top-1 -right-1" : "ml-auto"}
                          ${isActive ? "bg-brand-blue text-white" : "bg-rose-500 text-white"}
                        `}
                      >
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

      {/* ─── User Card (bottom) ─── */}
      <div className={`shrink-0 border-t border-gray-100 ${collapsed ? "p-2 flex justify-center" : "p-4"}`}>
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-user"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
              title={userProfile?.full_name || "Usuario"}
            >
              {initials}
            </motion.div>
          ) : (
            <motion.div
              key="expanded-user"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-gray-900 truncate">
                  {userProfile?.full_name || "Usuario"}
                </div>
                {planLabel && (
                  <span className="inline-block mt-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue">
                    {planLabel}
                  </span>
                )}
              </div>
              <Link
                href="/"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 overflow-hidden z-30"
      >
        {sidebarContent}
      </motion.aside>

      {/* ─── Collapse Toggle Button (desktop only) ─── */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-40 w-6 h-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-gray-700 hover:shadow-md transition-all"
        style={{ left: sidebarWidth - 12 }}
        title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-white shadow-2xl lg:hidden flex flex-col"
            >
              {/* Mobile close button */}
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
    </>
  );
}
