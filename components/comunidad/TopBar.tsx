"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, X } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

const tabLabels: Record<string, string> = {
  inicio: "Inicio",
  cursos: "Cursos",
  live: "En Vivo",
  chat: "Comunidad",
  ai: "IA",
  perfil: "Mi Perfil",
  certificados: "Certificados",
  miembros: "Miembros",
  configuracion: "Configuración",
  business: "Empresa",
};

interface TopBarProps {
  activeTab: string;
  onMobileMenuOpen: () => void;
  unreadNotifications?: number;
}

export default function TopBar({
  activeTab,
  onMobileMenuOpen,
  unreadNotifications = 0,
}: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  /* Cmd/Ctrl+K */
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

  /* Close search on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center h-14 px-4 sm:px-6 gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb — compact */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-gray-400 font-medium">Comunidad</span>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs font-semibold text-gray-700">
            {tabLabels[activeTab] || activeTab}
          </span>
        </div>

        {/* Search — moved left, bigger, cleaner */}
        <div className="flex-1 max-w-xl" ref={searchContainerRef}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Buscar cursos, lecciones, miembros..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-700 placeholder:text-gray-400
                focus:outline-none focus:bg-white focus:border-brand-blue/30 focus:ring-2 focus:ring-brand-blue/10 transition-all duration-200"
            />
            <AnimatePresence>
              {searchOpen && searchQuery.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setSearchQuery("");
                    searchRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Search results dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                      Búsqueda rápida
                    </p>
                    {[
                      { label: "Buscar en mis cursos", shortcut: "cursos" },
                      { label: "Buscar en la comunidad", shortcut: "chat" },
                      { label: "Preguntar a la IA", shortcut: "ai" },
                      { label: "Buscar miembros", shortcut: "miembros" },
                    ].map((item) => (
                      <button
                        key={item.shortcut}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side — Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
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
          <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
      </div>
    </header>
  );
}
