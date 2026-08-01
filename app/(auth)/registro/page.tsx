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

function getFromQueryParam(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("from");
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
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            whatsapp: formData.phone,
            company: formData.company,
            registration_source: registrationSource,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/comunidad/inicio")}&reg_source=${encodeURIComponent(registrationSource)}`,
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
            phone: formData.phone || undefined,
            company: formData.company || undefined,
          })
          .eq("id", data.user.id);
      }

      router.push("/login?registered=true");
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
            Accede a todos nuestros recursos y campus virtual
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
              <label className="block text-sm font-bold text-brand-dark mb-1.5">Nombre completo *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                  <input
                    type="tel"
                    disabled={loading}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1.5">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                  <input
                    type="text"
                    disabled={loading}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Empresa"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm disabled:opacity-50"
                  />
                </div>
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
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1890FF] cursor-pointer flex-shrink-0 disabled:opacity-50"
              />
              <label htmlFor="privacy-registro" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                Acepto la{" "}
                <Link href="/privacidad" className="text-[#1890FF] font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
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
