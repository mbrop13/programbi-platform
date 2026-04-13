"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut, Settings, CreditCard, ChevronRight, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelSubscription } from "@/app/actions/subscription";
import { updateProfile } from "@/app/actions/profile";
import { Loader2, Edit2, Check as CheckIcon } from "lucide-react";

interface SettingsModalProps {
  onClose: () => void;
  userProfile: any; // Ideally typed according to our profiles table
}

export default function SettingsModal({ onClose, userProfile }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "suscripcion">("general");
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.full_name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const router = useRouter();

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setIsUpdatingName(true);
    try {
      const result = await updateProfile({ fullName: newName });
      if (!result.success) throw new Error(result.error);
      setIsEditingName(false);
      alert("Nombre actualizado exitosamente.");
      window.location.reload();
    } catch (err: any) {
      alert("Error al actualizar: " + err.message);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a los foros completos, al Asistente IA Premium y a tus descuentos.")) return;
    
    setIsCanceling(true);
    try {
      const result = await cancelSubscription();
      if (!result.success) throw new Error(result.error);
      
      alert("Suscripción cancelada exitosamente.");
      window.location.reload(); // Reload to refresh contexts across the app
    } catch (err: any) {
      alert("Error al cancelar la suscripción: " + err.message);
      setIsCanceling(false);
    }
  };

  const planName = userProfile?.subscription_plan 
    ? userProfile.subscription_plan === 'pro' ? 'Plan Pro' 
      : userProfile.subscription_plan === 'max' ? 'Plan Max' 
      : userProfile.subscription_plan === 'ultra' ? 'Plan Ultra'
      : userProfile.subscription_plan === 'ultraplus' ? 'Plan Ultra +'
      : 'Plan Suscrito'
    : 'Cuenta Gratuita';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
      >
        {/* SIDEBAR */}
        <div className="w-full md:w-56 bg-gray-50 border-r border-gray-100 p-4 shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-gray-800">Configuración</h3>
            <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-gray-200">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-semibold flex items-center gap-3 ${activeTab === "general" ? "bg-white text-brand-blue shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}
          >
            <Settings className="w-4 h-4" /> 
            Cuenta General
          </button>
          <button 
            onClick={() => setActiveTab("suscripcion")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-semibold flex items-center gap-3 ${activeTab === "suscripcion" ? "bg-white text-brand-blue shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}
          >
            <CreditCard className="w-4 h-4" /> 
            Mi Suscripción
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 sm:p-8 bg-white overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 hidden md:flex transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Detalles de la Cuenta</h2>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {userProfile?.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{userProfile?.full_name || "Usuario"}</h3>
                    <p className="text-sm text-gray-500">{userProfile?.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
                  </div>
                </div>

                 <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                     <div className="flex-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</p>
                        {isEditingName ? (
                          <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                            placeholder="Tu nombre real"
                            autoFocus
                          />
                        ) : (
                          <p className="font-medium text-gray-800">{userProfile?.full_name || "Desconocido"}</p>
                        )}
                     </div>
                     <div className="ml-4">
                        {isEditingName ? (
                          <button 
                            onClick={handleUpdateName}
                            disabled={isUpdatingName}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border-none cursor-pointer"
                          >
                            {isUpdatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                          </button>
                        ) : (
                          <button 
                            onClick={() => setIsEditingName(true)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors border-none cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                     </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rol en Plataforma</p>
                     <p className="font-medium text-gray-800 capitalize">{userProfile?.role || "Estudiante"}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "suscripcion" && (
              <motion.div key="suscripcion" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Gestión de Suscripción</h2>

                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                   <div className="text-sm text-gray-500 font-medium mb-2">Plan Actual</div>
                   <div className="text-3xl font-black text-gray-900 flex items-center gap-3">
                     {planName}
                     {!userProfile?.subscription_plan && (
                        <span className="text-[10px] font-black uppercase tracking-wide bg-gray-200 text-gray-600 px-2 py-1 rounded-md">Básico</span>
                     )}
                   </div>
                   
                   <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                     {userProfile?.subscription_plan 
                       ? "Cuentas con acceso a la comunidad premium y descuentos especiales en la academia. Gracias por ser parte de ProgramBI."
                       : "Aún no tienes un plan de la comunidad. Obtén acceso a nuestros foros, al Asistente IA 24/7 y Masterclasses en vivo."}
                   </p>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={() => router.push('/comunidad')}
                     className="w-full bg-brand-blue text-white rounded-xl p-4 flex items-center justify-between font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                   >
                     <div className="flex items-center gap-3">
                       <ArrowUpCircle className="w-5 h-5" />
                       {userProfile?.subscription_plan ? 'Subir de Plan (Upgrade)' : 'Ver Planes Disponibles'}
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
                         {isCanceling ? 'Cancelando...' : 'Cancelar Suscripción'}
                       </div>
                     </button>
                   )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
