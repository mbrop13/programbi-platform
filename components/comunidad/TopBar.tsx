"use client";

import { Menu } from "lucide-react";

const tabLabels: Record<string, string> = {
  inicio: "Inicio",
  cursos: "Cursos",
  live: "En Vivo",
  ai: "IA",
  perfil: "Mi Perfil",
  certificados: "Certificados",
  configuracion: "Configuración",
  business: "Empresa",
};

interface TopBarProps {
  activeTab: string;
  onMobileMenuOpen: () => void;
}

export default function TopBar({ activeTab, onMobileMenuOpen }: TopBarProps) {
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

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium">Comunidad</span>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs font-semibold text-gray-700">
            {tabLabels[activeTab] || activeTab}
          </span>
        </div>
      </div>
    </header>
  );
}
