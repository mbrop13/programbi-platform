"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  CreditCard,
  Bell,
  Palette,
  Edit2,
  Check as CheckIcon,
  Loader2,
  AlertTriangle,
  ArrowUpCircle,
  ChevronRight,
  Shield,
  Mail,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Mail as MailIcon,
  MessageSquare,
  Trophy,
  Radio,
  BookOpen,
  Check,
} from "lucide-react";
import { cancelSubscription } from "@/app/actions/subscription";
import { updateProfile } from "@/app/actions/profile";

interface SettingsModalProps {
  onClose: () => void;
  userProfile: any;
}

type SettingsTab = "cuenta" | "suscripcion" | "notificaciones" | "apariencia";

export default function SettingsModal({ onClose, userProfile }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("cuenta");
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.full_name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const router = useRouter();

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
    } catch (err: any) {
      alert("Error al actualizar: " + err.message);
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
      window.location.reload();
    } catch (err: any) {
      alert("Error: " + err.message);
      setIsCanceling(false);
    }
  };

  const planNames: Record<string, string> = { pro: "Plan Pro", max: "Plan Max", ultra: "Plan Ultra", ultraplus: "Plan Ultra+" };
  const planColors: Record<string, string> = {
    pro: "from-blue-500 to-blue-600",
    max: "from-indigo-500 to-purple-600",
    ultra: "from-violet-500 to-purple-700",
    ultraplus: "from-amber-500 to-orange-600",
  };

  const planName = userProfile?.subscription_plan
    ? planNames[userProfile.subscription_plan] || "Plan Activo"
    : "Cuenta Gratuita";

  const planColor = userProfile?.subscription_plan
    ? planColors[userProfile.subscription_plan] || "from-gray-400 to-gray-500"
    : "from-gray-400 to-gray-500";

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "cuenta", label: "Cuenta", icon: User, desc: "Perfil y datos personales" },
    { id: "suscripcion", label: "Suscripción", icon: CreditCard, desc: "Plan y facturación" },
    { id: "notificaciones", label: "Notificaciones", icon: Bell, desc: "Alertas y preferencias" },
    { id: "apariencia", label: "Apariencia", icon: Palette, desc: "Tema y visualización" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
      >
        {/* ─── SIDEBAR ─── */}
        <div className="w-full md:w-[220px] bg-gray-50/80 border-r border-gray-100 p-4 shrink-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="font-display font-bold text-gray-900 text-base">Configuración</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full text-left px-3 py-3 rounded-xl transition-all text-sm flex items-center gap-3 group
                    ${isActive
                      ? "bg-white text-brand-blue shadow-sm border border-gray-100"
                      : "text-gray-500 hover:bg-white/60 hover:text-gray-800 border border-transparent"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${isActive ? "bg-brand-blue/10" : "bg-gray-100 group-hover:bg-gray-200/60"}`}>
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-blue" : "text-gray-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] leading-tight">{tab.label}</div>
                    <div className={`text-[10px] leading-tight mt-0.5 ${isActive ? "text-brand-blue/60" : "text-gray-400"}`}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* User card at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200/60">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {userProfile?.full_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-gray-900 truncate">{userProfile?.full_name}</div>
                <div className="text-[10px] text-gray-400 truncate">{userProfile?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8">
            {/* Close button (desktop) */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence mode="wait">
              {/* ─── CUENTA ─── */}
              {activeTab === "cuenta" && (
                <motion.div key="cuenta" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                  <h2 className="font-display font-black text-xl text-gray-900 mb-1">Detalles de la Cuenta</h2>
                  <p className="text-sm text-gray-500 mb-8">Gestiona tu información personal</p>

                  {/* Avatar section */}
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                      {userProfile?.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{userProfile?.full_name || "Usuario"}</h3>
                      <p className="text-sm text-gray-500 capitalize flex items-center gap-1.5">
                        {userProfile?.role === "admin" && <Shield className="w-3.5 h-3.5 text-amber-500" />}
                        {userProfile?.role === "admin" ? "Administrador" : "Estudiante"}
                      </p>
                      {planLabel(userProfile?.subscription_plan) && (
                        <span className={`inline-block mt-2 text-[10px] font-black px-2 py-1 rounded-md bg-gradient-to-r ${planColor} text-white`}>
                          {planName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    <SettingsField
                      label="Nombre Completo"
                      value={userProfile?.full_name}
                      isEditing={isEditingName}
                      editValue={newName}
                      onEditChange={setNewName}
                      onEditStart={() => setIsEditingName(true)}
                      onEditSave={handleUpdateName}
                      onEditCancel={() => { setIsEditingName(false); setNewName(userProfile?.full_name || ""); }}
                      saving={isUpdatingName}
                    />

                    <SettingsField
                      label="Email"
                      value={userProfile?.email}
                      icon={Mail}
                      readonly
                      hint="No se puede cambiar desde aquí"
                    />

                    <SettingsField
                      label="Rol"
                      value={userProfile?.role === "admin" ? "Administrador" : "Estudiante"}
                      icon={Shield}
                      readonly
                    />
                  </div>
                </motion.div>
              )}

              {/* ─── SUSCRIPCIÓN ─── */}
              {activeTab === "suscripcion" && (
                <motion.div key="suscripcion" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                  <h2 className="font-display font-black text-xl text-gray-900 mb-1">Mi Suscripción</h2>
                  <p className="text-sm text-gray-500 mb-8">Gestiona tu plan y facturación</p>

                  {/* Current plan card */}
                  <div className={`relative rounded-2xl p-6 mb-6 overflow-hidden ${userProfile?.subscription_plan ? `bg-gradient-to-br ${planColor}` : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                    <div className="relative z-10">
                      <div className={`text-sm font-medium mb-2 ${userProfile?.subscription_plan ? "text-white/80" : "text-gray-500"}`}>Plan Actual</div>
                      <div className={`text-3xl font-black ${userProfile?.subscription_plan ? "text-white" : "text-gray-900"}`}>
                        {planName}
                      </div>
                      {!userProfile?.subscription_plan && (
                        <span className="inline-block mt-2 text-[10px] font-black uppercase bg-gray-300 text-gray-600 px-2 py-1 rounded-md">
                          Básico
                        </span>
                      )}
                      <p className={`text-sm mt-3 leading-relaxed ${userProfile?.subscription_plan ? "text-white/70" : "text-gray-500"}`}>
                        {userProfile?.subscription_plan
                          ? "Cuentas con acceso premium a la comunidad, IA avanzada y descuentos exclusivos."
                          : "Aún no tienes un plan. Obtén acceso a foros, IA 24/7 y Masterclasses en vivo."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/comunidad")}
                      className="w-full bg-brand-blue text-white rounded-xl p-4 flex items-center justify-between font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowUpCircle className="w-5 h-5" />
                        {userProfile?.subscription_plan ? "Subir de Plan" : "Ver Planes Disponibles"}
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>

                    {userProfile?.subscription_plan && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="w-full bg-white border-2 border-rose-100 text-rose-500 rounded-xl p-4 flex items-center justify-between font-bold hover:bg-rose-50 hover:border-rose-200 transition-all disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5" />
                          {isCanceling ? "Cancelando..." : "Cancelar Suscripción"}
                        </div>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── NOTIFICACIONES ─── */}
              {activeTab === "notificaciones" && (
                <motion.div key="notificaciones" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                  <h2 className="font-display font-black text-xl text-gray-900 mb-1">Notificaciones</h2>
                  <p className="text-sm text-gray-500 mb-8">Elige qué alertas deseas recibir</p>

                  <div className="space-y-2">
                    <NotifToggle
                      icon={MessageSquare}
                      label="Anuncios de la comunidad"
                      desc="Nuevas publicaciones y anuncios importantes"
                      checked={notifPrefs.announcements}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, announcements: v }))}
                    />
                    <NotifToggle
                      icon={Radio}
                      label="Masterclasses en vivo"
                      desc="Aviso antes de que comience una clase en vivo"
                      checked={notifPrefs.liveClasses}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, liveClasses: v }))}
                    />
                    <NotifToggle
                      icon={Trophy}
                      label="Logros desbloqueados"
                      desc="Cuando desbloqueas un nuevo logro o nivel"
                      checked={notifPrefs.achievements}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, achievements: v }))}
                    />
                    <NotifToggle
                      icon={MessageSquare}
                      label="Respuestas a comentarios"
                      desc="Cuando alguien responde a tu publicación o comentario"
                      checked={notifPrefs.comments}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, comments: v }))}
                    />
                    <NotifToggle
                      icon={BookOpen}
                      label="Actualizaciones de cursos"
                      desc="Nuevas lecciones o cambios en tus cursos"
                      checked={notifPrefs.courseUpdates}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, courseUpdates: v }))}
                    />

                    <div className="my-4 h-px bg-gray-100" />

                    <NotifToggle
                      icon={MailIcon}
                      label="Resumen por email"
                      desc="Recibe un resumen semanal de actividad en tu correo"
                      checked={notifPrefs.emailDigest}
                      onChange={(v) => setNotifPrefs((p) => ({ ...p, emailDigest: v }))}
                    />
                  </div>
                </motion.div>
              )}

              {/* ─── APARIENCIA ─── */}
              {activeTab === "apariencia" && (
                <motion.div key="apariencia" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                  <h2 className="font-display font-black text-xl text-gray-900 mb-1">Apariencia</h2>
                  <p className="text-sm text-gray-500 mb-8">Personaliza la visualización de la plataforma</p>

                  {/* Theme selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">Tema</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Light */}
                      <button className="relative rounded-xl border-2 border-brand-blue p-4 text-center bg-white shadow-sm">
                        <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <div className="text-sm font-bold text-gray-900">Claro</div>
                        <div className="text-[10px] text-gray-500">Tema actual</div>
                        <div className="absolute top-2 right-2 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </button>

                      {/* Dark (disabled) */}
                      <button className="relative rounded-xl border-2 border-gray-200 p-4 text-center bg-gray-50 opacity-60 cursor-not-allowed">
                        <Moon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm font-bold text-gray-500">Oscuro</div>
                        <div className="text-[10px] text-gray-400">Próximamente</div>
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">Idioma</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Español</span>
                      <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md">ES</span>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">Barra lateral</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Colapsar con <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono mx-1">[</kbd></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Helpers ── */
function planLabel(plan?: string | null) {
  if (!plan) return null;
  return plan.replace("plan_", "").toUpperCase();
}

/* ── Settings Field ── */
function SettingsField({
  label,
  value,
  icon: Icon,
  readonly,
  hint,
  isEditing,
  editValue,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  saving,
}: {
  label: string;
  value?: string;
  icon?: React.ElementType;
  readonly?: boolean;
  hint?: string;
  isEditing?: boolean;
  editValue?: string;
  onEditChange?: (v: string) => void;
  onEditStart?: () => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  saving?: boolean;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                value={editValue}
                onChange={(e) => onEditChange?.(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditSave?.();
                  if (e.key === "Escape") onEditCancel?.();
                }}
              />
              <button
                onClick={onEditSave}
                disabled={saving}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
              </button>
              <button
                onClick={onEditCancel}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
              <p className="font-medium text-gray-800 text-sm">{value || "—"}</p>
            </div>
          )}
          {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
        </div>
        {!readonly && !isEditing && (
          <button
            onClick={onEditStart}
            className="ml-4 p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Notification Toggle ── */
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
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${checked ? "bg-brand-blue/10" : "bg-gray-100"}`}>
        <Icon className={`w-4 h-4 ${checked ? "text-brand-blue" : "text-gray-400"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-[11px] text-gray-500">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
          ${checked ? "bg-brand-blue" : "bg-gray-300"}`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
