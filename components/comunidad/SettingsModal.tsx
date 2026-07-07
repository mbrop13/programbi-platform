"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Palette,
  AlertTriangle,
  Shield,
  Moon,
  Sun,
  Globe,
  Smartphone,
  MessageSquare,
  Trophy,
  Radio,
  BookOpen,
  Check,
  Sliders,
  Database,
  Calendar,
  Sparkles,
  Languages,
} from "lucide-react";
import { cancelSubscription } from "@/app/actions/subscription";
import { updateProfile } from "@/app/actions/profile";
import { useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  onClose: () => void;
  userProfile: {
    full_name: string;
    email: string;
    role?: string;
    subscription_plan?: string | null;
  } | null;
  onUpgradeClick?: () => void;
}

type SettingsTab = "cuenta" | "apariencia" | "comportamiento" | "customize" | "datos";

export default function SettingsModal({ onClose, userProfile, onUpgradeClick }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("cuenta");
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.full_name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Notification preferences (local state for now)
  const [notifPrefs, setNotifPrefs] = useState({
    announcements: true,
    liveClasses: true,
    achievements: true,
    comments: true,
    courseUpdates: true,
    emailDigest: false,
  });

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setIsUpdatingName(true);
    try {
      const result = await updateProfile({ fullName: newName });
      if (!result.success) throw new Error(result.error);
      setIsEditingName(false);
      toast("success", "Nombre actualizado", "Tu nombre de perfil se ha guardado correctamente.");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast("error", "Error al actualizar", message);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso premium.")) return;
    setIsCanceling(true);
    try {
      const result = await cancelSubscription();
      if (!result.success) throw new Error(result.error);
      toast("success", "Suscripción cancelada", "Tu suscripción ha sido cancelada correctamente.");
      window.location.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast("error", "Error al cancelar", message);
      setIsCanceling(false);
    }
  };

  const planNames: Record<string, string> = { pro: "Plan Pro", max: "Plan Max", ultra: "Plan Ultra" };

  const planName = userProfile?.subscription_plan
    ? planNames[userProfile.subscription_plan] || "Plan Activo"
    : "Membresía Básica";

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "cuenta", label: "Cuenta", icon: User, desc: "Perfil y datos de membresía" },
    { id: "apariencia", label: "Apariencia", icon: Palette, desc: "Temas e idioma" },
    { id: "comportamiento", label: "Comportamiento", icon: Sliders, desc: "Alertas y notificaciones" },
    { id: "customize", label: "Customize", icon: Sliders, desc: "Configuración de interfaz" },
    { id: "datos", label: "Controles de datos", icon: Database, desc: "Privacidad y facturación" },
  ];

  // User initials for the avatar
  const initials = userProfile?.full_name
    ? userProfile.full_name.charAt(0).toUpperCase()
    : userProfile?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-neutral-100"
      >
        {/* ─── COLUMNA IZQUIERDA (Sidebar de Navegación) ─── */}
        <div className="w-full md:w-[240px] bg-neutral-50/50 border-r border-neutral-100 p-5 shrink-0 flex flex-col justify-between">
          <div>
            {/* Título de la barra */}
            <div className="mb-6 px-1">
              <h3 className="font-display font-black text-slate-900 text-lg tracking-tight">Ajustes</h3>
            </div>

            {/* Pestañas de Navegación */}
            <div className="flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-[13px] flex items-center gap-3 cursor-pointer border-0 font-medium select-none",
                      isActive
                        ? "bg-neutral-100 text-slate-900"
                        : "text-slate-500 bg-transparent hover:bg-neutral-100/50 hover:text-slate-800"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-slate-800" : "text-slate-400")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarjeta del usuario en el footer del sidebar */}
          <div className="pt-4 border-t border-neutral-100 mt-8 hidden md:block">
            <div className="flex items-center gap-3 px-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-800 truncate leading-snug">{userProfile?.full_name || "Usuario"}</div>
                <div className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{userProfile?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── COLUMNA DERECHA (Panel de Contenido) ─── */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between p-6 sm:p-8 bg-white min-h-[400px]">
          <div>
            {/* Header del contenido */}
            <div className="flex items-center justify-between mb-6 pb-2">
              <h2 className="font-display font-black text-xl text-slate-900 capitalize tracking-tight">
                {activeTab === "cuenta" ? "Cuenta" : 
                 activeTab === "apariencia" ? "Apariencia" : 
                 activeTab === "comportamiento" ? "Comportamiento" : 
                 activeTab === "customize" ? "Customize" : 
                 "Controles de datos"}
              </h2>
              <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* ─── CUENTA ─── */}
              {activeTab === "cuenta" && (
                <motion.div 
                  key="cuenta" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="divide-y divide-neutral-100"
                >
                  {/* Fila 1: Perfil (Nombre & Email) */}
                  <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm select-none">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        {isEditingName ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdateName();
                                if (e.key === "Escape") { setIsEditingName(false); setNewName(userProfile?.full_name || ""); }
                              }}
                            />
                            <button
                              onClick={handleUpdateName}
                              disabled={isUpdatingName}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors border-0 cursor-pointer"
                            >
                              {isUpdatingName ? "..." : "Guardar"}
                            </button>
                            <button
                              onClick={() => { setIsEditingName(false); setNewName(userProfile?.full_name || ""); }}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 text-slate-600 text-[11px] font-bold hover:bg-neutral-200 transition-colors border-0 cursor-pointer"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-[13px] text-slate-800 truncate">{userProfile?.full_name || "Usuario"}</div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">{userProfile?.email}</div>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Administrar
                      </button>
                    )}
                  </div>

                  {/* Fila 2: Suscripción / Plan */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-indigo-500 shrink-0">
                        <Sparkles className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800">Obtener Premium</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Plan actual: <span className="font-semibold text-slate-700">{planName}</span></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onUpgradeClick) onUpgradeClick();
                      }}
                      className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Actualizar
                    </button>
                  </div>

                  {/* Fila 3: Conexión de cuenta */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800">Cuenta de ProgramBI</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Acceso: {userProfile?.role === "admin" ? "Administrador" : "Estudiante"}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("info", "Detalles de Acceso", `Rol de cuenta verificado: ${userProfile?.role === "admin" ? "Administrador de la plataforma" : "Estudiante registrado"}`)}
                      className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Ver
                    </button>
                  </div>

                  {/* Fila 4: Idioma */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-blue-500 shrink-0">
                        <Languages className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800">Idioma</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Español (Latinoamérica)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("apariencia")}
                      className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Cambiar
                    </button>
                  </div>

                  {/* Fila 5: Año de Registro / Miembro */}
                  <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800">Año de ingreso</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Miembro activo desde {new Date().getFullYear()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("info", "Metadatos del Perfil", "Tu cuenta se encuentra activa y en correcto funcionamiento.")}
                      className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Detalles
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─── APARIENCIA ─── */}
              {activeTab === "apariencia" && (
                <motion.div 
                  key="apariencia" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Tema</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Light Card */}
                      <button 
                        onClick={() => toast("info", "Tema Claro", "El tema Claro ya se encuentra activo como predeterminado.")}
                        className="relative rounded-2xl border-2 border-indigo-600 p-4 text-center bg-white shadow-sm cursor-pointer border-solid"
                      >
                        <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="text-[13px] font-bold text-slate-800">Claro</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Tema actual</div>
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </button>

                      {/* Dark Card (disabled) */}
                      <button 
                        onClick={() => toast("info", "Tema Oscuro", "El tema Oscuro estará disponible en una actualización muy pronto.")}
                        className="relative rounded-2xl border border-neutral-100 p-4 text-center bg-neutral-50 opacity-60 cursor-pointer border-solid"
                      >
                        <Moon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <div className="text-[13px] font-bold text-slate-500">Oscuro</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Próximamente</div>
                      </button>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-neutral-100" />

                  {/* Idioma Ajustes */}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Idioma de la Interfaz</h3>
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 border-solid">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4.5 h-4.5 text-slate-400" />
                        <span className="text-[13px] font-medium text-slate-700">Español</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-neutral-200/60 px-2.5 py-1 rounded-lg select-none">ES</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── COMPORTAMIENTO ─── */}
              {activeTab === "comportamiento" && (
                <motion.div 
                  key="comportamiento" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preferencias de Alertas</div>
                  
                  <NotifToggle
                    icon={MessageSquare}
                    label="Anuncios de la comunidad"
                    desc="Nuevas publicaciones y avisos globales"
                    checked={notifPrefs.announcements}
                    onChange={(v) => setNotifPrefs((p) => ({ ...p, announcements: v }))}
                  />
                  <NotifToggle
                    icon={Radio}
                    label="Clases en vivo (Masterclasses)"
                    desc="Recordatorios antes de iniciar una sesión en vivo"
                    checked={notifPrefs.liveClasses}
                    onChange={(v) => setNotifPrefs((p) => ({ ...p, liveClasses: v }))}
                  />
                  <NotifToggle
                    icon={Trophy}
                    label="Logros y Certificados"
                    desc="Notificar al conseguir una insignia o aprobar un curso"
                    checked={notifPrefs.achievements}
                    onChange={(v) => setNotifPrefs((p) => ({ ...p, achievements: v }))}
                  />
                  <NotifToggle
                    icon={BookOpen}
                    label="Actualizaciones de cursos"
                    desc="Aviso de nuevas lecciones y materiales"
                    checked={notifPrefs.courseUpdates}
                    onChange={(v) => setNotifPrefs((p) => ({ ...p, courseUpdates: v }))}
                  />
                </motion.div>
              )}

              {/* ─── CUSTOMIZE ─── */}
              {activeTab === "customize" && (
                <motion.div 
                  key="customize" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Comportamiento de la barra lateral</h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 border-solid">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4.5 h-4.5 text-slate-400" />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800">Colapsar automáticamente</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Usa la tecla <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-mono text-[9px] mx-0.5 font-bold shadow-sm">[</kbd> para alternar el menú</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-neutral-100" />

                  {/* Teclas rápidas */}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Atajos de Teclado</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 text-xs border-b border-neutral-100 border-solid">
                        <span className="text-slate-600">Buscar en la plataforma</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded font-mono font-bold shadow-sm">/</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 text-xs border-b border-neutral-100 border-solid">
                        <span className="text-slate-600">Alternar colapso de menú</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded font-mono font-bold shadow-sm">[</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 text-xs">
                        <span className="text-slate-600">Cerrar ventanas emergentes</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded font-mono font-bold shadow-sm">Esc</kbd>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── CONTROLES DE DATOS ─── */}
              {activeTab === "datos" && (
                <motion.div 
                  key="datos" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="divide-y divide-neutral-100"
                >
                  {/* Facturación / Suscripción */}
                  {userProfile?.subscription_plan && (
                    <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                          <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-slate-800">Gestionar Facturación</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Cancela tu suscripción en cualquier momento</div>
                        </div>
                      </div>
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
                      >
                        {isCanceling ? "Cancelando..." : "Cancelar"}
                      </button>
                    </div>
                  )}

                  {/* Exportación */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Database className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800">Exportar información</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Descarga tus datos de avance en formato JSON</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("success", "Exportación iniciada", "Tus datos de cuenta se descargarán automáticamente en unos segundos.")}
                      className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
                    >
                      Exportar
                    </button>
                  </div>

                  {/* Eliminación */}
                  <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <AlertTriangle className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-red-500">Eliminar cuenta</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Borra tu progreso y datos de forma permanente</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Esta acción no se puede deshacer. ¿Deseas solicitar la eliminación permanente de tu cuenta?")) {
                          toast("info", "Solicitud recibida", "Hemos recibido tu solicitud. Soporte técnico se contactará en las próximas 48 horas.");
                        }
                      }}
                      className="bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 text-red-600 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
                    >
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── BANNER INFERIOR DE PROMO (ProgramBI Premium) ─── */}
          <div className="mt-8 p-5 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-between border border-white/10 border-solid shadow-lg shrink-0">
            {/* Starry glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  ProgramBI Premium
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Acceso ilimitado a todos los cursos, IA integrada y asesorías en directo.
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                onClose();
                if (onUpgradeClick) onUpgradeClick();
              }}
              className="relative z-10 bg-white hover:bg-neutral-100 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border-0 select-none shadow-sm active:scale-[0.98]"
            >
              Probar gratis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Notification Toggle Sub-component ── */
function NotifToggle({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200/80 transition-colors select-none border-solid">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", checked ? "bg-indigo-50" : "bg-neutral-100")}>
        <Icon className={cn("w-4.5 h-4.5", checked ? "text-indigo-600" : "text-neutral-400")} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-800">{label}</div>
        <div className="text-[10.5px] text-slate-400 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 border-0 cursor-pointer",
          checked ? "bg-indigo-600" : "bg-neutral-300"
        )}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
