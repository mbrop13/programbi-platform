"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Mail, Lock, Sparkles, ArrowRight, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Reset state when modal opens/closes or tab changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setFullName("");
    setWhatsapp("");
  }, [isOpen, tab]);

  // Update tab when defaultTab changes
  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const supabase = createClient();

  // ═══ LOGIN ═══
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          setError("Correo o contraseña incorrectos. Intenta de nuevo.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("¡Bienvenido de vuelta! Redirigiendo...");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ═══ REGISTER ═══
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            whatsapp: whatsapp || null,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este correo ya está registrado. Intenta iniciar sesión.");
        } else {
          setError(error.message);
        }
      } else {
        // Auto-login after successful registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          setSuccess("¡Cuenta creada exitosamente! Revisa tu correo para verificar tu cuenta.");
        } else {
          setSuccess("¡Bienvenido a ProgramBI! 🎉");
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1200);
        }
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ═══ GOOGLE LOGIN ═══
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("No se pudo conectar con Google.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100000]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100001] w-full max-w-[900px] overflow-hidden mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 min-h-[500px]">
              {/* Left Side: Art/Info */}
              <div 
                className="hidden md:flex flex-col justify-between w-5/12 p-10 relative overflow-hidden text-white"
                style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6366F1] rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>

                <div className="relative z-10">
                  <Image
                    src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                    alt="ProgramBI"
                    width={160}
                    height={40}
                    className="h-8 w-auto brightness-0 invert opacity-90 mb-8"
                    unoptimized
                  />
                  <h3 className="text-3xl font-bold mb-4 leading-tight">
                    El futuro del <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">Análisis de Datos</span>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Únete a más de 5,000 profesionales que están transformando sus carreras con ProgramBI. Domina SQL, Power BI, Python y AI.
                  </p>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <div className="flex -space-x-2">
                       <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                       <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                       <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                    </div>
                    +5000 estudiantes
                  </div>
                </div>
                
                <div className="relative z-10 mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-xs text-slate-300 italic">
                    &quot;La plataforma que realmente me enseñó a aplicar datos en escenarios reales corporativos.&quot;
                  </p>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-7/12 p-8 lg:p-12 relative bg-white flex flex-col justify-center">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors border-none cursor-pointer"
                >
                  <X size={18} />
                </button>

                <div className="max-w-[360px] mx-auto w-full">
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => setTab("login")}
                      className={`pb-2 text-lg font-bold transition-colors bg-transparent border-none cursor-pointer ${tab === "login" ? "text-slate-900 border-b-2 border-blue-500" : "text-slate-400 hover:text-slate-600"}`}
                      style={tab === "login" ? { borderBottom: "2px solid #1890FF" } : {}}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => setTab("register")}
                      className={`pb-2 text-lg font-bold transition-colors bg-transparent border-none cursor-pointer ${tab === "register" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                      style={tab === "register" ? { borderBottom: "2px solid #1890FF" } : {}}
                    >
                      Crear Cuenta
                    </button>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
                      >
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium"
                      >
                        <CheckCircle size={16} className="flex-shrink-0" />
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {tab === "login" ? (
                    <motion.form initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4" onSubmit={handleLogin}>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="nombre@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="username email"
                            name="email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="current-password"
                            name="password"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-xs font-semibold text-blue-500 hover:text-blue-600 cursor-pointer">¿Olvidaste tu contraseña?</span>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20 group border-none cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <LogIn size={16} /> Ingresar a la plataforma
                            <ArrowRight size={16} className="opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4" onSubmit={handleRegister}>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Correo Electrónico *</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="nombre@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="email"
                            name="email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre (Opcional)</label>
                           <div className="relative">
                             <input
                               type="text"
                               placeholder="Tu nombre"
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
                               disabled={loading}
                               autoComplete="name"
                               name="name"
                               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                             />
                             <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp (Opcional)</label>
                           <div className="relative">
                             <input
                               type="tel"
                               placeholder="+56 9..."
                               value={whatsapp}
                               onChange={(e) => setWhatsapp(e.target.value)}
                               disabled={loading}
                               name="whatsapp"
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                             />
                           </div>
                         </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                            autoComplete="new-password"
                            name="new-password"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#1890FF] to-[#0050b3] hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25 group border-none cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Sparkles size={16} /> Unirse a ProgramBI
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}

                  <div className="mt-8 relative flex items-center justify-center">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                     </div>
                     <span className="relative bg-white px-4 text-xs font-medium text-slate-400 uppercase">O continuar con</span>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                     <button
                       onClick={handleGoogleLogin}
                       disabled={loading}
                       className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center font-semibold text-slate-600 text-sm bg-white cursor-pointer disabled:opacity-50"
                     >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" alt="" /> Google
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
