"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  Gauge,
  Clock,
} from "lucide-react";
import { cancelSubscription } from "@/app/actions/subscription";
import { updateProfile } from "@/app/actions/profile";
import { useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";

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

interface SettingsModalProps {
  onClose: () => void;
  userProfile: {
    full_name: string;
    email: string;
    role?: string;
    subscription_plan?: string | null;
  } | null;
  onUpgradeClick?: () => void;
  language?: 'es' | 'en';
}

type SettingsTab = "cuenta" | "apariencia" | "comportamiento" | "customize" | "datos" | "limites";

export default function SettingsModal({ onClose, userProfile, onUpgradeClick, language }: SettingsModalProps) {
  const activeLanguage = language || "es";
  const st = {
    es: {
      settings: "Ajustes",
      cuenta: "Cuenta",
      apariencia: "Apariencia",
      comportamiento: "Comportamiento",
      customize: "Customize",
      datos: "Controles de datos",
      limites: "Límites de Uso",
      cuentaDesc: "Perfil y datos de membresía",
      aparienciaDesc: "Temas e idioma",
      comportamientoDesc: "Alertas y notificaciones",
      customizeDesc: "Configuración de interfaz",
      datosDesc: "Privacidad y facturación",
      limitesDesc: "Consumo de mensajes de IA",
    },
    en: {
      settings: "Settings",
      cuenta: "Account",
      apariencia: "Appearance",
      comportamiento: "Behavior",
      customize: "Customize",
      datos: "Data Controls",
      limites: "Usage Limits",
      cuentaDesc: "Profile and membership details",
      aparienciaDesc: "Themes and language",
      comportamientoDesc: "Alerts and notifications",
      customizeDesc: "Interface settings",
      datosDesc: "Privacy and billing",
      limitesDesc: "AI message consumption",
    }
  }[activeLanguage];
  const [activeTab, setActiveTab] = useState<SettingsTab>("cuenta");
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.full_name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [quotaData, setQuotaData] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "limites" && !quotaData) {
      setQuotaLoading(true);
      fetch("/api/ai/quota")
        .then((res) => res.json())
        .then((data) => {
          setQuotaData(data);
        })
        .catch(() => {})
        .finally(() => setQuotaLoading(false));
    }
  }, [activeTab, quotaData]);

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
    { id: "cuenta", label: st.cuenta, icon: User, desc: st.cuentaDesc },
    { id: "limites", label: st.limites, icon: Gauge, desc: st.limitesDesc },
    { id: "apariencia", label: st.apariencia, icon: Palette, desc: st.aparienciaDesc },
    { id: "comportamiento", label: st.comportamiento, icon: Sliders, desc: st.comportamientoDesc },
    { id: "customize", label: st.customize, icon: Sliders, desc: st.customizeDesc },
    { id: "datos", label: st.datos, icon: Database, desc: st.datosDesc },
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
        className="relative bg-white dark:bg-zinc-950 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-neutral-100 dark:border-zinc-800/80"
      >
        {/* ─── COLUMNA IZQUIERDA (Sidebar de Navegación) ─── */}
        <div className="w-full md:w-[240px] bg-neutral-50/50 dark:bg-zinc-900 border-r border-neutral-100 dark:border-zinc-800 p-5 shrink-0 flex flex-col justify-between">
          <div>
            {/* Título de la barra */}
            <div className="mb-6 px-1">
              <h3 className="font-display font-black text-slate-900 dark:text-white text-lg tracking-tight">{st.settings}</h3>
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
                        ? "bg-neutral-100 dark:bg-zinc-800 text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-zinc-400 bg-transparent hover:bg-neutral-100/50 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-zinc-500")} />
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
        <div className="flex-1 overflow-y-auto flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-zinc-950 min-h-[400px]">
          <div>
            {/* Header del contenido */}
            <div className="flex items-center justify-between mb-6 pb-2">
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white capitalize tracking-tight">
                {activeTab === "cuenta" ? st.cuenta : 
                 activeTab === "apariencia" ? st.apariencia : 
                 activeTab === "comportamiento" ? st.comportamiento : 
                 activeTab === "customize" ? st.customize : 
                 activeTab === "limites" ? st.limites :
                 st.datos}
              </h2>
              <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-900/60 text-slate-500 dark:text-zinc-400 transition-colors border-0 bg-transparent cursor-pointer"
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
                  className="divide-y divide-neutral-100 dark:divide-zinc-800/80"
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
                            <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200 truncate">{userProfile?.full_name || "Usuario"}</div>
                            <div className="text-[11px] text-slate-400 dark:text-zinc-450 truncate mt-0.5">{userProfile?.email}</div>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Administrar
                      </button>
                    )}
                  </div>

                  {/* Fila 2: Suscripción / Plan */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-indigo-500 shrink-0">
                        <Sparkles className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Obtener Premium</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Plan actual: <span className="font-semibold text-slate-700 dark:text-zinc-350">{planName}</span></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onUpgradeClick) onUpgradeClick();
                      }}
                      className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Actualizar
                    </button>
                  </div>

                  {/* Fila 3: Conexión de cuenta */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 shrink-0">
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Cuenta de ProgramBI</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Acceso: {userProfile?.role === "admin" ? "Administrador" : "Estudiante"}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("info", "Detalles de Acceso", `Rol de cuenta verificado: ${userProfile?.role === "admin" ? "Administrador de la plataforma" : "Estudiante registrado"}`)}
                      className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Ver
                    </button>
                  </div>

                  {/* Fila 4: Idioma */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-blue-500 shrink-0">
                        <Languages className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Idioma</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Español (Latinoamérica)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("apariencia")}
                      className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Cambiar
                    </button>
                  </div>

                  {/* Fila 5: Año de Registro / Miembro */}
                  <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-slate-655 dark:text-zinc-400 shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Año de ingreso</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Miembro activo desde {new Date().getFullYear()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("info", "Metadatos del Perfil", "Tu cuenta se encuentra activa y en correcto funcionamiento.")}
                      className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Detalles
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─── LIMITES DE USO ─── */}
              {activeTab === "limites" && (
                <motion.div 
                  key="limites" 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {quotaLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="w-8.5 h-8.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      <span className="text-xs text-slate-400 font-bold">Cargando límites de uso...</span>
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
                            quotaData.unlimited ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
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
                          <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 border border-amber-200/50 dark:border-amber-905 px-2.5 py-1 rounded-lg">
                            Ilimitado
                          </span>
                        )}
                      </div>

                      {/* Tarjetas de Límites */}
                      {!quotaData.unlimited && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Tarjeta 1: 5 Horas */}
                          <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Próximas 5h</span>
                              <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            </div>
                            <div className="mt-4">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                  {Math.max(0, 100 - quotaData.percentages.five_hour)}%
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">restante</span>
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
                          <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Semanal</span>
                              <Gauge className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            </div>
                            <div className="mt-4">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                  {Math.max(0, 100 - quotaData.percentages.weekly)}%
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">restante</span>
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
                          <div className="bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-450 tracking-wider">Mensual</span>
                              <Gauge className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            </div>
                            <div className="mt-4">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                                  {Math.max(0, 100 - quotaData.percentages.monthly)}%
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">restante</span>
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
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <AlertTriangle className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold">No se pudieron cargar las estadísticas.</span>
                    </div>
                  )}
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
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-3">Tema</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Light Card */}
                      <button 
                        onClick={() => toast("info", "Tema Claro", "El tema Claro ya se encuentra activo como predeterminado.")}
                        className="relative rounded-2xl border-2 border-indigo-600 p-4 text-center bg-white dark:bg-zinc-900 shadow-sm cursor-pointer border-solid"
                      >
                        <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">Claro</div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-450 mt-0.5">Tema actual</div>
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </button>

                      {/* Dark Card (disabled) */}
                      <button 
                        onClick={() => toast("info", "Tema Oscuro", "El tema Oscuro estará disponible en una actualización muy pronto.")}
                        className="relative rounded-2xl border border-neutral-100 dark:border-zinc-800 p-4 text-center bg-neutral-50 dark:bg-zinc-900/40 opacity-60 cursor-pointer border-solid"
                      >
                        <Moon className="w-6 h-6 text-slate-400 dark:text-zinc-500" />
                        <div className="text-[13px] font-bold text-slate-500 dark:text-zinc-400">Oscuro</div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-450 mt-0.5">Próximamente</div>
                      </button>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-neutral-100 dark:bg-zinc-800/80" />

                  {/* Idioma Ajustes */}
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-3">Idioma de la Interfaz</h3>
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-900 rounded-2xl border border-neutral-100 dark:border-zinc-800 border-solid">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                        <span className="text-[13px] font-medium text-slate-700 dark:text-zinc-300">Español</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 bg-neutral-200/60 dark:bg-zinc-800 px-2.5 py-1 rounded-lg select-none">ES</span>
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
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-3">Comportamiento de la barra lateral</h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-zinc-900 rounded-2xl border border-neutral-100 dark:border-zinc-800/80 border-solid">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4.5 h-4.5 text-slate-400 dark:text-zinc-500" />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-zinc-250">Colapsar automáticamente</div>
                          <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Usa la tecla <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded font-mono text-[9px] mx-0.5 font-bold shadow-sm text-slate-700 dark:text-zinc-300">[</kbd> para alternar el menú</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-neutral-100 dark:bg-zinc-800/80" />

                  {/* Teclas rápidas */}
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-3">Atajos de Teclado</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 text-xs border-b border-neutral-100 dark:border-zinc-850 border-solid">
                        <span className="text-slate-655 dark:text-zinc-300">Buscar en la plataforma</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded font-mono font-bold shadow-sm text-slate-700 dark:text-zinc-300">/</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 text-xs border-b border-neutral-100 dark:border-zinc-850 border-solid">
                        <span className="text-slate-655 dark:text-zinc-300">Alternar colapso de menú</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded font-mono font-bold shadow-sm text-slate-700 dark:text-zinc-300">[</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 text-xs">
                        <span className="text-slate-655 dark:text-zinc-300">Cerrar ventanas emergentes</span>
                        <kbd className="px-2 py-0.5 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded font-mono font-bold shadow-sm text-slate-700 dark:text-zinc-300">Esc</kbd>
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
                  className="divide-y divide-neutral-100 dark:divide-zinc-800/80"
                >
                  {/* Facturación / Suscripción */}
                  {userProfile?.subscription_plan && (
                    <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-600 shrink-0">
                          <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Gestionar Facturación</div>
                          <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Cancela tu suscripción en cualquier momento</div>
                        </div>
                      </div>
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
                      >
                        {isCanceling ? "Cancelando..." : "Cancelar"}
                      </button>
                    </div>
                  )}

                  {/* Exportación */}
                  <div className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-slate-655 dark:text-zinc-400 shrink-0">
                        <Database className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-slate-800 dark:text-zinc-200">Exportar información</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Descarga tus datos de avance en formato JSON</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("success", "Exportación iniciada", "Tus datos de cuenta se descargarán automáticamente en unos segundos.")}
                      className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-white font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
                    >
                      Exportar
                    </button>
                  </div>

                  {/* Eliminación */}
                  <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                        <AlertTriangle className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-red-500">Eliminar cuenta</div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-450 mt-0.5">Borra tu progreso y datos de forma permanente</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Esta acción no se puede deshacer. ¿Deseas solicitar la eliminación permanente de tu cuenta?")) {
                          toast("info", "Solicitud recibida", "Hemos recibido tu solicitud. Soporte técnico se contactará en las próximas 48 horas.");
                        }
                      }}
                      className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950/50 hover:border-red-200 dark:hover:border-red-900 text-red-600 dark:text-red-400 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0 border-solid"
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
