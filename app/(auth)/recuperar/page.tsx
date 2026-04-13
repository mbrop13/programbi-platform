"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase password reset
    console.log("Reset password for:", email);
    setSubmitted(true);
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
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
              <h1 className="font-display font-black text-2xl text-brand-dark mb-3">
                ¡Email enviado!
              </h1>
              <p className="text-text-muted mb-6">
                Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu
                contraseña.
              </p>
              <Link
                href="/login"
                className="text-brand-blue font-bold no-underline hover:underline"
              >
                Volver al login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display font-black text-2xl text-brand-dark mb-2 text-center">
                Recuperar contraseña
              </h1>
              <p className="text-text-muted text-center mb-8">
                Te enviaremos un enlace para restablecer tu contraseña
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@empresa.cl"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient text-white py-3.5 rounded-xl font-bold text-[0.95rem] border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Enviar enlace
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-text-muted text-sm font-medium no-underline hover:text-brand-blue flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
