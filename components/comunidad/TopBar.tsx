"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Menu,
  Award,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react";

/* ── Breadcrumb labels ── */
const tabLabels: Record<string, string> = {
  inicio: "Inicio",
  cursos: "Cursos",
  live: "En Vivo",
  chat: "Comunidad",
  ai: "IA",
  perfil: "Mi Perfil",
  certificados: "Certificados",
  configuracion: "Configuración",
  business: "Empresa",
  admin: "Admin",
};

interface TopBarProps {
  activeTab: string;
  onMobileMenuOpen: () => void;
  userProfile: {
    full_name: string;
    email: string;
  } | null;
  onOpenSettings: () => void;
  unreadNotifications?: number;
}

export default function TopBar({
  activeTab,
  onMobileMenuOpen,
  userProfile,
  onOpenSettings,
  unreadNotifications = 0,
}: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard: Cmd/Ctrl+K to open search ── */
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowNotifPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── User initials ── */
  const initials = userProfile?.full_name
    ? userProfile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  /* ── Search suggestions ── */
  const searchSuggestions = [
    { icon: BookOpen, label: "Buscar cursos...", action: "cursos" },
    { icon: MessageSquare, label: "Buscar en comunidad...", action: "chat" },
    { icon: Sparkles, label: "Preguntar a la IA...", action: "ai" },
  ];

  return (
    <header className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100/80">
      <div className="flex items-center h-14 px-4 sm:px-6 gap-3">
        {/* ─── Mobile menu button ─── */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* ─── Breadcrumb ─── */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm shrink-0">
          <span className="text-gray-400 font-medium">Comunidad</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-900 font-semibold">
            {tabLabels[activeTab] || activeTab}
          </span>
        </nav>

        <div className="flex-1" />

        {/* ─── Search Bar ─── */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchRef.current?.focus(), 50);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200
              ${
                searchOpen
                  ? "w-80 bg-white border-brand-blue/30 ring-2 ring-brand-blue/10"
                  : "w-60 bg-gray-50/80 border-gray-200/80 hover:border-gray-300"
              }
            `}
          >
            <Search
              className={`w-4 h-4 shrink-0 transition-colors ${
                searchOpen ? "text-brand-blue" : "text-gray-400"
              }`}
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                setTimeout(() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }, 200);
              }}
              placeholder="Buscar..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] text-gray-400 font-mono shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Search dropdown suggestions */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-2">
                  {searchSuggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Notifications ─── */}
        <button
          onClick={() => {
            setShowNotifPanel(!showNotifPanel);
            setShowUserMenu(false);
          }}
          className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all shrink-0"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadNotifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold px-1 ring-2 ring-white"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </motion.span>
          )}
        </button>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotifPanel && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 right-16 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">
                  Notificaciones
                </h3>
                {unreadNotifications > 0 && (
                  <button className="text-xs font-semibold text-brand-blue hover:text-blue-600 transition-colors">
                    Marcar todas
                  </button>
                )}
              </div>
              <div className="p-4 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {unreadNotifications > 0
                    ? `${unreadNotifications} notificación${unreadNotifications > 1 ? "es" : ""} sin leer`
                    : "No tienes notificaciones nuevas"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── User Avatar + Dropdown ─── */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifPanel(false);
            }}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl hover:bg-gray-50 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {initials}
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="font-bold text-sm text-gray-900">
                    {userProfile?.full_name || "Usuario"}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {userProfile?.email || ""}
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/comunidad/perfil"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium no-underline"
                  >
                    <User className="w-4 h-4 text-gray-400" /> Mi Perfil
                  </Link>
                  <Link
                    href="/comunidad/certificados"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium no-underline"
                  >
                    <Award className="w-4 h-4 text-gray-400" /> Certificados
                  </Link>
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Settings className="w-4 h-4 text-gray-400" /> Configuración
                  </button>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Link
                    href="/"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium no-underline"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
