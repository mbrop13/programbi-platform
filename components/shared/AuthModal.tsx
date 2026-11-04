"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, Mail, Lock, Sparkles, ArrowRight, CheckCircle, AlertCircle, Loader2, User, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, FormEvent, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { validatePassword, isBreachedPassword } from "@/lib/security/password";
import { subscribeToNewsletter } from "@/lib/supabase/comunidad-ai";
import { honeypotStyle } from "@/lib/antibot";
import { persistRegistrationSource, readRegistrationSource } from "@/lib/registration-source";
import { readClientPricingVariant } from "@/lib/experiments/cookie";
import { courseSlugFromLocation, signUpCreatedUser, trackClickRegistro, trackSubmitRegistro } from "@/lib/analytics/marketing";
import { readBrowserReferralCode } from "@/lib/referrals/cookie";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  redirectUrl?: string;
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login", redirectUrl }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef<number>(Date.now());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [subscribeToBlog, setSubscribeToBlog] = useState(true);
  const [confirmPending, setConfirmPending] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const nextPath =
    redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/comunidad/inicio";

  // Reset state when modal opens/closes or tab changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setFullName("");
    setHoneypot("");
    formLoadedAt.current = Date.now();
    setShowPassword(false);
    setAcceptsPrivacy(false);
    setSubscribeToBlog(true);
    setConfirmPending(false);
    setResendState("idle");
  }, [isOpen, tab, redirectUrl]);

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
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            window.location.reload();
          }
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

    // Anti-bot check 1: Honeypot field filled by automated scrapers/bots
    if (honeypot.trim() !== "") {
      setSuccess("¡Bienvenido a ProgramBI! 🎉");
      setTimeout(() => onClose(), 1200);
      return;
    }

    // Anti-bot check 2: Instant submission check (less than 2 seconds)
    if (Date.now() - formLoadedAt.current < 2000) {
      setSuccess("¡Bienvenido a ProgramBI! 🎉");
      setTimeout(() => onClose(), 1200);
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Escribe tu nombre.");
      return;
    }
    if (!acceptsPrivacy) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      setError(pwCheck.error!);
      return;
    }

    setLoading(true);

    if (await isBreachedPassword(password)) {
      setError("Esta contraseña aparece en filtraciones conocidas. Elige otra.");
      setLoading(false);
      return;
    }

    try {
      const registrationSource = persistRegistrationSource();
      const pricingVariant = readClientPricingVariant();
      const referralCode = readBrowserReferralCode();
      const defaultName = fullName.trim() || email.split("@")[0] || "Usuario";
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}&reg_source=${encodeURIComponent(registrationSource)}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: defaultName,
            registration_source: registrationSource,
            ...(referralCode ? { referral_code: referralCode } : {}),
            ...(pricingVariant ? { pricing_variant: pricingVariant } : {}),
          },
          emailRedirectTo,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este correo ya está registrado. Intenta iniciar sesión.");
        } else {
          setError(error.message);
        }
      } else if (!signUpCreatedUser(data?.user)) {
        setError("Este correo ya está registrado. Intenta iniciar sesión.");
      } else {
        trackSubmitRegistro({
          method: "form",
          course_slug: courseSlugFromLocation(registrationSource),
        });
        // signUp ya deja la sesión si el correo no exige confirmación.
        // Si no viene sesión, se prueba el mismo acceso para distinguir
        // "falta confirmar el correo" de "cuenta lista".
        let loginError: { message: string } | null = null;
        if (!data.session) {
          const login = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          loginError = login.error;
        }

        // Guardar origen en el perfil (backup si el trigger no lo copió)
        if (data?.user?.id) {
          const profileUpdates: Record<string, string> = {
            registration_source: registrationSource,
          };
          if (pricingVariant) {
            profileUpdates.pricing_variant = pricingVariant;
          }
          await supabase.from("profiles").update(profileUpdates).eq("id", data.user.id);
        }

        if (loginError) {
          setConfirmPending(true);
          setSuccess("Cuenta creada. Revisa tu email para confirmar tu cuenta.");
        } else {
          setSuccess("Cuenta creada. Ya puedes continuar.");

          if (subscribeToBlog) {
            subscribeToNewsletter({
              categories: ["ia", "economia", "tecnologia", "general"],
              frequency: "weekly",
            }).catch((err) => console.error("Error subscribing to blog on register:", err));
          }

          // Notificar al admin del nuevo registro (fire-and-forget)
          fetch("/api/auth/new-member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: defaultName, email }),
          }).catch(() => {}); // silencioso, no bloquea al usuario

          setTimeout(() => {
            onClose();
            window.location.href = nextPath;
          }, 1200);
        }
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ═══ RESEND CONFIRMATION ═══
  const handleResend = async () => {
    if (resendState === "sending") return;
    setResendState("sending");
    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}&reg_source=${encodeURIComponent(readRegistrationSource())}`;
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo },
      });
      setResendState(resendError ? "error" : "sent");
    } catch {
      setResendState("error");
    }
  };

  // ═══ GOOGLE LOGIN ═══
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Persistir origen para el callback OAuth (nuevos registros con Google)
      const registrationSource = persistRegistrationSource();
      const callbackParams = new URLSearchParams({
        next: nextPath,
        reg_source: registrationSource,
      });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?${callbackParams.toString()}`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("No se pudo conectar con Google.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
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
            className="fixed left-1/2 top-1/2 z-[100001] max-h-[calc(100dvh-1.5rem)] w-[calc(100%-2rem)] max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 min-h-[500px]">
              {/* Left Side: Art/Info */}
              <div 
                className="hidden md:flex flex-col justify-between w-5/12 p-10 relative overflow-hidden bg-slate-50 text-slate-900"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#171716] rounded-full blur-[100px] opacity-10 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-ink rounded-full blur-[100px] opacity-10 -ml-20 -mb-20"></div>

                <div className="relative z-10">
                  <Image
                    src="/images/logo.png"
                    alt="ProgramBI"
                    width={160}
                    height={40}
                    className="h-8 w-auto mb-8"
                  />
                  <h3 className="text-3xl font-bold mb-4 leading-tight text-slate-900">
                    El futuro del <em className="italic font-semibold">Análisis de Datos</em>
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Únete a más de 5,000 profesionales que están transformando sus carreras con ProgramBI. Domina SQL, Power BI, Python y AI.
                  </p>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="flex -space-x-2">
                       <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-slate-50" alt="" />
                       <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-slate-50" alt="" />
                       <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-slate-50" alt="" />
                    </div>
                    +5000 estudiantes
                  </div>
                </div>
                
                <div className="relative z-10 mt-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm backdrop-blur-sm">
                  <p className="text-xs text-slate-600 italic leading-relaxed">
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
                      style={tab === "login" ? { borderBottom: "2px solid #171716" } : {}}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => {
                        if (tab !== "register") trackClickRegistro();
                        setTab("register");
                      }}
                      className={`pb-2 text-lg font-bold transition-colors bg-transparent border-none cursor-pointer ${tab === "register" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                      style={tab === "register" ? { borderBottom: "2px solid #171716" } : {}}
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
                        className="flex flex-col gap-2 p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle size={16} className="flex-shrink-0" />
                          {success}
                        </span>
                        {confirmPending ? (
                          <div className="mt-1 border-t border-emerald-200/70 pt-3">
                            <p className="text-xs leading-relaxed text-emerald-800">
                              Te enviamos el enlace a {email || "tu correo"}. Revisa también la carpeta de spam.
                            </p>
                            <button
                              type="button"
                              onClick={handleResend}
                              disabled={resendState === "sending"}
                              className="mt-2 bg-transparent p-0 text-sm font-semibold text-emerald-800 underline underline-offset-2 disabled:opacity-50"
                            >
                              {resendState === "sending" ? "Enviando…" : "Reenviar correo de confirmación"}
                            </button>
                            {resendState === "sent" ? (
                              <p className="mt-2 text-xs text-emerald-800">Listo. Te enviamos otro correo.</p>
                            ) : null}
                            {resendState === "error" ? (
                              <p className="mt-2 text-xs text-red-600">
                                No pudimos reenviarlo. Espera un minuto e inténtalo de nuevo.
                              </p>
                            ) : null}
                            <Link
                              href={`/login?registered=true&next=${encodeURIComponent(nextPath)}`}
                              className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-2 no-underline hover:underline"
                            >
                              Ir a iniciar sesión
                            </Link>
                          </div>
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {success && tab === "register" ? null : tab === "login" ? (
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
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/recuperar" className="text-xs font-semibold text-ink no-underline hover:underline">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-ink text-canvas font-semibold rounded-full flex items-center justify-center gap-2 transition-transform active:scale-[0.98] group border-none cursor-pointer disabled:opacity-50"
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
                      {/* Honeypot field - hidden from real users, filled by bots */}
                      <div style={honeypotStyle} aria-hidden="true">
                        <input
                          type="text"
                          name="_website"
                          autoComplete="off"
                          tabIndex={-1}
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre *</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Tu nombre"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="name"
                            name="name"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
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
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                            autoComplete="new-password"
                            name="new-password"
                            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                          />
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <button 
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             tabIndex={-1}
                             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0"
                          >
                             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Mínimo 6 caracteres. No hace falta incluir mayúsculas, números ni símbolos.
                        </p>
                      </div>
                      {/* Privacy consent checkbox */}
                      <div className="flex items-start gap-2.5 mt-1">
                        <input
                          type="checkbox"
                          id="privacy-auth"
                          checked={acceptsPrivacy}
                          onChange={(e) => setAcceptsPrivacy(e.target.checked)}
                          required
                          className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 accent-[#171716] cursor-pointer flex-shrink-0"
                        />
                        <label htmlFor="privacy-auth" className="text-[10px] text-slate-400 cursor-pointer leading-relaxed">
                          Acepto la{" "}
                          <Link href="/privacidad" className="text-[#171716] font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-ink text-canvas font-semibold rounded-full flex items-center justify-center gap-2 transition-transform active:scale-[0.98] group border-none cursor-pointer disabled:opacity-50"
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

                  {success && tab === "register" ? null : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
