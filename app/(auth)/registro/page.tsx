"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Loader2, CheckCircle, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validatePassword, isBreachedPassword } from "@/lib/security/password";
import { honeypotStyle } from "@/lib/antibot";
import {
  persistRegistrationSource,
  readRegistrationSource,
} from "@/lib/registration-source";
import { readClientPricingVariant } from "@/lib/experiments/cookie";
import { safeNextPath } from "@/lib/auth/safe-next";
import {
  normalizeReferralCode,
  readBrowserReferralCode,
  writeBrowserReferralCode,
} from "@/lib/referrals/cookie";
import { whatsappHref } from "@/lib/whatsapp";
import { mensajeErrorAuth } from "@/lib/auth/mensajes-auth";
import {
  courseSlugFromLocation,
  signUpCreatedUser,
  trackRegistroStep,
  trackSubmitRegistro,
} from "@/lib/analytics/marketing";

const SURFACE = "registro_page" as const;

type CampoRegistro = "nombre" | "email" | "password" | "privacidad";

function getFromQueryParam(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("from");
}

function getNextPath(): string {
  if (typeof window === "undefined") return "/comunidad/inicio";
  return safeNextPath(new URLSearchParams(window.location.search).get("next"));
}

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CampoRegistro, string>>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef<number>(Date.now());
  const openTracked = useRef(false);
  const startTracked = useRef(false);

  // Embudo: el formulario se mostró.
  useEffect(() => {
    if (openTracked.current) return;
    openTracked.current = true;
    trackRegistroStep({ step: "open", surface: SURFACE });
  }, []);

  // Si llegaron con ?from=/cursos/... guardar ese origen
  useEffect(() => {
    const from = getFromQueryParam();
    if (from) {
      persistRegistrationSource(from.startsWith("/") ? from : `/${from}`);
    } else {
      // Mantener un origen previo (ej. vinieron desde un curso) o usar /registro
      persistRegistrationSource(readRegistrationSource() || "/registro");
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const router = useRouter();

  /** Limpia el error del campo que la persona está editando (no borra lo escrito). */
  const clearFieldError = (campo: CampoRegistro) => {
    setFieldErrors((prev) => {
      if (!prev[campo]) return prev;
      const next = { ...prev };
      delete next[campo];
      return next;
    });
  };

  /** Embudo: primer foco en un campo del formulario (una sola vez). */
  const handleFirstFocus = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    trackRegistroStep({ step: "start", surface: SURFACE });
  };

  /** Reenvía el correo de confirmación de Supabase sin crear otra cuenta. */
  const handleResend = async () => {
    if (resendState === "sending") return;
    setResendState("sending");
    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}&reg_source=${encodeURIComponent(readRegistrationSource() || "/registro")}`;
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
        options: { emailRedirectTo },
      });
      setResendState(resendError ? "error" : "sent");
    } catch {
      setResendState("error");
    }
  };

  const captureReferralFromUrl = () => {
    const fromUrl = normalizeReferralCode(
      new URLSearchParams(window.location.search).get("ref")
    );
    const code = fromUrl || readBrowserReferralCode();
    if (code) writeBrowserReferralCode(code);
    return code;
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setFieldErrors({});
    trackRegistroStep({ step: "oauth_click", surface: SURFACE, method: "oauth" });
    setLoading(true);
    try {
      captureReferralFromUrl();
      const supabase = createClient();
      const fromParam = getFromQueryParam();
      const registrationSource = persistRegistrationSource(
        fromParam
          ? (fromParam.startsWith("/") ? fromParam : `/${fromParam}`)
          : readRegistrationSource() || "/registro"
      );
      const callbackParams = new URLSearchParams({
        next: getNextPath(),
        reg_source: registrationSource,
      });

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?${callbackParams.toString()}`,
        },
      });
      if (authError) {
        const { mensaje, reason } = mensajeErrorAuth(authError.message);
        trackRegistroStep({ step: "signup_error", surface: SURFACE, reason, method: "oauth" });
        setError(
          reason === "red" || reason === "rate_limit"
            ? mensaje
            : "No pudimos continuar con Google. Inténtalo de nuevo o escríbenos por WhatsApp."
        );
      }
    } catch {
      setError("Error al conectar con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Anti-bot check 1: Honeypot field filled by automated scrapers/bots
    if (honeypot.trim() !== "") {
      router.push("/login?registered=true");
      return;
    }

    // Anti-bot check 2: Instant submission check (less than 2 seconds)
    if (Date.now() - formLoadedAt.current < 2000) {
      router.push("/login?registered=true");
      return;
    }

    trackRegistroStep({ step: "submit_attempt", surface: SURFACE, method: "form" });

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setFieldErrors({ nombre: "Escribe tu nombre (mínimo 2 letras)." });
      trackRegistroStep({ step: "validation_error", surface: SURFACE, reason: "nombre", method: "form" });
      return;
    }

    const email = formData.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setFieldErrors({ email: "Escribe un correo válido, por ejemplo nombre@empresa.cl." });
      trackRegistroStep({ step: "validation_error", surface: SURFACE, reason: "email", method: "form" });
      return;
    }

    const password = formData.password;
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      setFieldErrors({ password: pwCheck.error || "La contraseña debe tener al menos 6 caracteres." });
      trackRegistroStep({ step: "validation_error", surface: SURFACE, reason: "password", method: "form" });
      return;
    }

    if (!acceptsPrivacy) {
      setFieldErrors({ privacidad: "Marca la casilla para aceptar la Política de Privacidad." });
      trackRegistroStep({ step: "validation_error", surface: SURFACE, reason: "privacidad", method: "form" });
      return;
    }

    setLoading(true);
    if (await isBreachedPassword(password)) {
      setFieldErrors({ password: "Esta contraseña aparece en filtraciones conocidas. Elige otra." });
      trackRegistroStep({ step: "validation_error", surface: SURFACE, reason: "filtrada", method: "form" });
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const fromParam = getFromQueryParam();
      const registrationSource = persistRegistrationSource(
        fromParam
          ? (fromParam.startsWith("/") ? fromParam : `/${fromParam}`)
          : readRegistrationSource() || "/registro"
      );

      const defaultName = formData.fullName.trim() || formData.email.split("@")[0] || "Usuario";
      const pricingVariant = readClientPricingVariant();
      const referralCode = captureReferralFromUrl();
      const phone = formData.phone.trim();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: defaultName,
            whatsapp: phone || null,
            registration_source: registrationSource,
            ...(referralCode ? { referral_code: referralCode } : {}),
            ...(pricingVariant ? { pricing_variant: pricingVariant } : {}),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}&reg_source=${encodeURIComponent(registrationSource)}`,
        },
      });

      if (signUpError) {
        const { mensaje, reason } = mensajeErrorAuth(signUpError.message);
        trackRegistroStep({ step: "signup_error", surface: SURFACE, reason, method: "form" });
        if (reason === "email_invalido" || reason === "ya_registrado") {
          setFieldErrors({ email: mensaje });
        } else if (reason === "password_corta") {
          setFieldErrors({ password: mensaje });
        } else {
          setError(mensaje);
        }
        return;
      }

      if (!signUpCreatedUser(data?.user)) {
        trackRegistroStep({ step: "signup_error", surface: SURFACE, reason: "ya_registrado", method: "form" });
        setFieldErrors({ email: "Este correo ya está registrado. Inicia sesión." });
        return;
      }

      trackSubmitRegistro({
        method: "form",
        course_slug: courseSlugFromLocation(fromParam || registrationSource),
      });

      // La confirmación de correo está apagada: signUp ya deja la sesión.
      // Si no viene sesión, se intenta el login con la misma contraseña.
      if (!data.session) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (loginError) {
          // Cuenta creada, pero falta confirmar el correo.
          trackRegistroStep({ step: "confirm_pending", surface: SURFACE, method: "form" });
          setSuccess(true);
          return;
        }
      }

      trackRegistroStep({ step: "success", surface: SURFACE, method: "form" });

      if (data?.user?.id) {
        await supabase
          .from("profiles")
          .update({
            registration_source: registrationSource,
            phone,
            ...(pricingVariant ? { pricing_variant: pricingVariant } : {}),
          })
          .eq("id", data.user.id);
      }

      fetch("/api/auth/new-member", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: defaultName,
          email: formData.email,
          phone,
        }),
      }).catch(() => {});

      window.location.href = getNextPath();
    } catch (err) {
      const { mensaje, reason } = mensajeErrorAuth(
        err instanceof Error ? err.message : String(err)
      );
      trackRegistroStep({ step: "signup_error", surface: SURFACE, reason, method: "form" });
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 no-underline">
          <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl font-display">PB</span>
          </div>
          <span className="text-2xl font-black text-brand-dark font-display">ProgramBI</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-200">
          <h1 className="font-display font-black text-2xl text-brand-dark mb-2 text-center">
            {success ? "Revisa tu correo" : "Crea tu cuenta"}
          </h1>

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-600" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-text-muted">
                Enviamos el enlace de confirmación a{" "}
                <span className="font-semibold break-all text-brand-dark">{formData.email}</span>.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Si no lo ves en unos minutos, revisa también{" "}
                <span className="font-semibold text-brand-dark">Spam</span> y la pestaña{" "}
                <span className="font-semibold text-brand-dark">Promociones</span>.
              </p>
              <Link
                href={
                  getNextPath() === "/comunidad/inicio"
                    ? "/login?registered=true"
                    : `/login?registered=true&next=${encodeURIComponent(getNextPath())}`
                }
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
              >
                Ir a iniciar sesión
              </Link>
              <div className="mt-4 border-t border-emerald-100 pt-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === "sending"}
                  className="text-sm font-semibold text-brand-blue underline underline-offset-2 disabled:opacity-50"
                >
                  {resendState === "sending" ? "Enviando…" : "Reenviar correo de confirmación"}
                </button>
                {resendState === "sent" ? (
                  <p className="mt-2 text-xs text-text-muted">
                    Te enviamos otro correo a {formData.email}. Revisa también la carpeta de spam.
                  </p>
                ) : null}
                {resendState === "error" ? (
                  <p className="mt-2 text-xs text-red-600">
                    No pudimos reenviarlo. Espera un minuto e inténtalo de nuevo.
                  </p>
                ) : null}
              </div>
              <p className="mt-4 border-t border-emerald-100 pt-4 text-sm leading-relaxed text-text-muted">
                ¿Prefieres que te ayudemos?{" "}
                <a
                  href={whatsappHref({ page: "/registro", intent: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackRegistroStep({ step: "whatsapp_alt", surface: SURFACE, reason: "revisa_correo" })
                  }
                  className="inline-flex items-center gap-1 font-semibold text-brand-blue no-underline hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Escríbenos por WhatsApp
                </a>
              </p>
            </div>
          ) : (
            <>
              <p className="text-text-muted text-center mb-8">
                Crea tu cuenta con nombre, email y contraseña. Toma menos de un minuto.
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm font-semibold mb-5 text-center">
                  {error}
                </div>
              )}

              {/* Google OAuth primero: menos fricción que escribir la contraseña */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border-2 border-gray-200 py-3 rounded-xl font-bold text-sm text-brand-dark flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-text-faint text-xs font-medium">O REGÍSTRATE CON TU CORREO</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                  <label htmlFor="registro-nombre" className="block text-sm font-bold text-brand-dark mb-1.5">
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" aria-hidden="true" />
                    <input
                      id="registro-nombre"
                      type="text"
                      required
                      disabled={loading}
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        clearFieldError("nombre");
                      }}
                      onFocus={handleFirstFocus}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      aria-invalid={fieldErrors.nombre ? true : undefined}
                      aria-describedby={fieldErrors.nombre ? "registro-nombre-error" : undefined}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                    />
                  </div>
                  {fieldErrors.nombre ? (
                    <p id="registro-nombre-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.nombre}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="registro-email" className="block text-sm font-bold text-brand-dark mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" aria-hidden="true" />
                    <input
                      id="registro-email"
                      type="email"
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        clearFieldError("email");
                      }}
                      onFocus={handleFirstFocus}
                      placeholder="tu@empresa.cl"
                      autoComplete="email"
                      aria-invalid={fieldErrors.email ? true : undefined}
                      aria-describedby={fieldErrors.email ? "registro-email-error" : undefined}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                    />
                  </div>
                  {fieldErrors.email ? (
                    <p id="registro-email-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="registro-password" className="block text-sm font-bold text-brand-dark mb-1.5">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" aria-hidden="true" />
                    <input
                      id="registro-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      disabled={loading}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        clearFieldError("password");
                      }}
                      onFocus={handleFirstFocus}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      aria-invalid={fieldErrors.password ? true : undefined}
                      aria-describedby={fieldErrors.password ? "registro-password-error" : "registro-password-hint"}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      aria-pressed={showPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-secondary bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <p id="registro-password-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.password}
                    </p>
                  ) : (
                    <p id="registro-password-hint" className="mt-1 text-xs text-gray-500">
                      Mínimo 6 caracteres. No hace falta incluir mayúsculas, números ni símbolos.
                    </p>
                  )}
                </div>

                {/* Privacy consent */}
                <div>
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="privacy-registro"
                      checked={acceptsPrivacy}
                      onChange={(e) => {
                        setAcceptsPrivacy(e.target.checked);
                        clearFieldError("privacidad");
                      }}
                      required
                      disabled={loading}
                      aria-invalid={fieldErrors.privacidad ? true : undefined}
                      aria-describedby={fieldErrors.privacidad ? "registro-privacidad-error" : undefined}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#171716] cursor-pointer flex-shrink-0 disabled:opacity-50"
                    />
                    <label htmlFor="privacy-registro" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                      Acepto la{" "}
                      <Link href="/privacidad" className="text-[#171716] font-semibold no-underline hover:underline" target="_blank">
                        Política de Privacidad
                      </Link>{" "}
                      y el tratamiento de mis datos.
                    </label>
                  </div>
                  {fieldErrors.privacidad ? (
                    <p id="registro-privacidad-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.privacidad}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gradient text-white py-3.5 rounded-xl font-bold text-[0.95rem] border-none cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs leading-relaxed text-text-muted">
                ¿Dudas antes de registrarte?{" "}
                <a
                  href={whatsappHref({ page: "/registro", intent: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackRegistroStep({ step: "whatsapp_alt", surface: SURFACE, reason: "formulario" })
                  }
                  className="inline-flex items-center gap-1 font-semibold text-brand-blue no-underline hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Escríbenos por WhatsApp
                </a>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-blue font-bold no-underline hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
