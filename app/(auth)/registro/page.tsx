"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef<number>(Date.now());

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
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

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
      if (authError) setError(authError.message);
    } catch {
      setError("Error al conectar con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Anti-bot check 1: Honeypot field filled by automated scrapers/bots
    if (honeypot.trim() !== "") {
      console.log("🤖 Bot registration blocked (honeypot)");
      router.push("/login?registered=true");
      return;
    }

    // Anti-bot check 2: Instant submission check (less than 2 seconds)
    if (Date.now() - formLoadedAt.current < 2000) {
      console.log("🤖 Bot registration blocked (too fast)");
      router.push("/login?registered=true");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const password = formData.password;
    // A-01 / V2.5.1 (OWASP ASVS L3): unified centralized policy (>= 12 chars).
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      setError(pwCheck.error!);
      return;
    }

    // A-02 / V2.5.7 (OWASP ASVS L3): reject passwords found in known breaches.
    setLoading(true);
    if (await isBreachedPassword(password)) {
      setError("Esta contraseña aparece en filtraciones conocidas. Elige otra.");
      setLoading(false);
      return;
    }

    if (!acceptsPrivacy) {
      setError("Debes aceptar la política de privacidad.");
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

      const defaultName = formData.email.split("@")[0] || "Usuario";
      const pricingVariant = readClientPricingVariant();
      const referralCode = captureReferralFromUrl();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: defaultName,
            registration_source: registrationSource,
            ...(referralCode ? { referral_code: referralCode } : {}),
            ...(pricingVariant ? { pricing_variant: pricingVariant } : {}),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}&reg_source=${encodeURIComponent(registrationSource)}`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Backup: escribir origen en el perfil si el usuario ya quedó creado
      if (data?.user?.id) {
        await supabase
          .from("profiles")
          .update({
            registration_source: registrationSource,
            ...(pricingVariant ? { pricing_variant: pricingVariant } : {}),
          })
          .eq("id", data.user.id);
      }

      const next = getNextPath();
      const loginUrl =
        next === "/comunidad/inicio"
          ? "/login?registered=true"
          : `/login?registered=true&next=${encodeURIComponent(next)}`;
      router.push(loginUrl);
    } catch (err) {
      setError("Ocurrió un error inesperado al registrar su cuenta.");
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
            Crea tu cuenta
          </h1>
          <p className="text-text-muted text-center mb-8">
            Accede a todos nuestros recursos y comunidad
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm font-semibold mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-bold text-brand-dark mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@empresa.cl"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1.5">Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 10 caracteres (mayúsculas y números)"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-secondary bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1.5">Confirmar Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Privacy consent */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="privacy-registro"
                checked={acceptsPrivacy}
                onChange={(e) => setAcceptsPrivacy(e.target.checked)}
                required
                disabled={loading}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#171716] cursor-pointer flex-shrink-0 disabled:opacity-50"
              />
              <label htmlFor="privacy-registro" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                Acepto la{" "}
                <Link href="/privacidad" className="text-[#171716] font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
                y autorizo el tratamiento de mis datos personales.
              </label>
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-text-faint text-xs font-medium">O REGISTRARSE CON</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Google OAuth */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-200 py-3 rounded-xl font-bold text-sm text-brand-dark flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Google
          </button>
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
