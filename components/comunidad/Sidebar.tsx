"use client";

import { useEffect, useCallback, useState } from "react";
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
  Award,
  Settings,
  ChevronLeft,
  LogOut,
  X,
  CreditCard,
  Users,
  ExternalLink,
} from "lucide-react";

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
  onOpenSettings: () => void;
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
  onOpenSettings,
}: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  // Close user menu when tab changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [activeTab]);

  const tabs: SidebarTab[] = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard, color: "text-blue-500", group: "Principal" },
    { id: "cursos", label: "Cursos", icon: GraduationCap, color: "text-indigo-500", group: "Principal" },
    { id: "live", label: "En Vivo", icon: Radio, color: "text-rose-500", group: "Principal", showPing: true },
    { id: "chat", label: "Comunidad", icon: MessageSquare, color: "text-emerald-500", group: "Principal" },
    { id: "ai", label: "IA", icon: Sparkles, color: "text-purple-500", group: "Principal" },
    { id: "miembros", label: "Miembros", icon: Users, color: "text-teal-500", group: "Principal" },
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

  const initials = userProfile?.full_name
    ? userProfile.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const planLabel = userProfile?.subscription_plan?.replace("plan_", "").toUpperCase() || null;
  const sidebarWidth = collapsed ? 72 : 260;

  const sidebarContent = (
    <div className="flex flex-col h-full relative">
      {/* Logo */}
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
                      ${isActive
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        className={`absolute top-1 bottom-1 rounded-r-full bg-brand-blue ${collapsed ? "left-0 w-[3px]" : "-left-3 w-[3px]"}`}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span className="relative shrink-0">
                      <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-brand-blue" : "text-gray-400"}`} />
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
                          className="whitespace-nowrap overflow-hidden"
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

      {/* ─── USER SECTION (bottom) ─── */}
      <div className={`shrink-0 border-t border-gray-100 ${collapsed ? "p-2 flex justify-center" : "p-3"}`}>
        {collapsed ? (
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:shadow-md transition-all"
            title={userProfile?.full_name || "Usuario"}
          >
            {initials}
          </button>
        ) : (
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left
              ${userMenuOpen ? "bg-brand-blue/5 ring-1 ring-brand-blue/20" : "hover:bg-gray-50"}`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-gray-900 truncate leading-tight">
                {userProfile?.full_name || "Usuario"}
              </div>
              <div className="text-[11px] text-gray-400 truncate leading-tight">
                {userProfile?.email || ""}
              </div>
            </div>
            <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} className="shrink-0">
              <ChevronLeft className="w-4 h-4 text-gray-400 -rotate-90" />
            </motion.div>
          </button>
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
            className={`absolute bottom-16 ${collapsed ? "left-2 w-56" : "left-3 right-3"} z-50`}
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-300/30 border border-gray-100 overflow-hidden">
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
                    onTabChange("cursos");
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

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-40 w-6 h-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-gray-700 hover:shadow-md transition-all"
        style={{ left: sidebarWidth - 12 }}
        title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
      </button>

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
