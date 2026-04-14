"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase auth signup
    console.log("Register:", formData);
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1.5">Nombre completo *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@empresa.cl"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1.5">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Empresa"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
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

            {/* Privacy consent */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="privacy-registro"
                checked={acceptsPrivacy}
                onChange={(e) => setAcceptsPrivacy(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1890FF] cursor-pointer flex-shrink-0"
              />
              <label htmlFor="privacy-registro" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                Acepto la{" "}
                <Link href="/privacidad" className="text-[#1890FF] font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
                y autorizo el tratamiento de mis datos personales.
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn-gradient text-white py-3.5 rounded-xl font-bold text-[0.95rem] border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Crear Cuenta
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
