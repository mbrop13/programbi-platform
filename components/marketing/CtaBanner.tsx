"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";

export default function CtaBanner() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 animate-gradient-bg"
        style={{
          background: "linear-gradient(135deg, #1890FF 0%, #0050b3 30%, #1890FF 60%, #40a9ff 100%)",
          backgroundSize: "400% 400%",
        }}
      />
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-[15%] w-48 h-48 bg-white/5 rounded-full blur-3xl"
      />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10 text-center">
        <FadeIn>
          <motion.div
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full text-sm font-bold mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} />
            Cupos limitados 2026
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-display leading-tight">
            ¿Listo para dominar los datos?
          </h2>
          <p className="text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Invierte en tu futuro profesional. Empieza hoy con el programa que transformará tu carrera.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="#contacto"
              className="group px-10 py-5 rounded-2xl bg-white text-[#1890FF] font-bold text-xl inline-flex items-center justify-center gap-3 no-underline hover:-translate-y-1 transition-all shadow-2xl"
            >
              Solicitar Información
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/cursos"
              className="px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold text-xl inline-flex items-center justify-center gap-3 no-underline hover:bg-white/10 hover:-translate-y-1 transition-all"
            >
              Ver Catálogo
            </Link>
          </div>
        </FadeIn>
      </div>

      <style jsx>{`
        @keyframes gradient-bg-anim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          animation: gradient-bg-anim 8s ease infinite;
        }
      `}</style>
    </section>
  );
}
