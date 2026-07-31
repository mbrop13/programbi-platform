"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/shared/AuthModal";

export default function CommunityCtaBanner({
  isLoggedIn = false,
  subscriptionsEnabled = true,
}: {
  isLoggedIn?: boolean;
  subscriptionsEnabled?: boolean;
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white isolate">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
        redirectUrl="/comunidad/cursos"
      />

      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-5 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
            Únete a la mejor comunidad de datos en español
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6 leading-[1.1]"
        >
          Comienza tu transformación como <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
            Analista de Datos Profesional
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          {subscriptionsEnabled
            ? "Accede instantáneamente a clases en vivo, mentoría con IA 24/7 y la comunidad más activa de Latinoamérica. Cancela cuando quieras."
            : "Las suscripciones estarán disponibles próximamente. Mientras tanto, puedes acceder a la comunidad y ver las clases gratuitas."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {subscriptionsEnabled ? (
            <motion.a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white font-black text-base px-9 py-4.5 rounded-2xl shadow-[0_15px_35px_rgba(56,189,248,0.25)] hover:shadow-[0_20px_40px_rgba(56,189,248,0.35)] transition-all duration-300 cursor-pointer"
            >
              Pruébalo 7 Días Gratis
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          ) : (
            <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white/80 border border-white/20 font-black text-base px-9 py-4.5 rounded-2xl cursor-default">
              Suscripciones próximamente
            </span>
          )}

          <motion.button
            onClick={() => {
              if (isLoggedIn) {
                window.location.href = "/comunidad/cursos";
              } else {
                setShowAuthModal(true);
              }
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-base px-8 py-4.5 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            Acceder a Mi Cuenta
          </motion.button>
        </motion.div>

        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {subscriptionsEnabled ? "Sin amarras permanentes" : "Suscripciones muy pronto"}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            {subscriptionsEnabled ? "Pagos 100% seguros" : "Acceso con tu cuenta"}
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Clases gratuitas disponibles
          </div>
        </div>
      </div>
    </section>
  );
}
