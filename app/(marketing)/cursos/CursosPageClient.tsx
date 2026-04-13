"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Users, ChevronRight, Search, Filter, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import React from "react";
import { courses, getFeaturedCourses } from "@/lib/data/courses";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/shared/AnimatedComponents";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

const categories = [
  { value: "all", label: "Todos" },
  { value: "programacion", label: "Programación" },
  { value: "visualizacion", label: "Visualización" },
  { value: "especializacion", label: "Especialización" },
  { value: "ia", label: "IA & Automatización" },
  { value: "automatizacion", label: "Automatización" },
  { value: "gestion", label: "Gestión" },
  { value: "fundamental", label: "Fundamental" },
];

export default function CursosPageClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = getFeaturedCourses();

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&display=swap');
        .font-handwritten {
          font-family: 'Caveat', cursive;
          font-weight: 500;
        }
      `}} />

      {/* ════ PREMIUM HERO & SEARCH ════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-44 pb-8 lg:pb-12 overflow-hidden bg-[#F8FAFC]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
          backgroundSize: "60px 60px",
          backgroundImage: "linear-gradient(to right, rgba(24,144,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,144,255,0.04) 1px, transparent 1px)",
        }} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#1890FF] rounded-full blur-[120px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#6366F1] rounded-full blur-[120px] opacity-[0.07] pointer-events-none" />

        <div className="relative z-10 max-w-[900px] mx-auto px-5 lg:px-10 text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 bg-blue-50 text-[#1890FF] font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border border-blue-100 mb-6">
              <Sparkles size={14} /> Catálogo Formativo Completo
            </span>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-[#0F172A] mb-5 leading-tight tracking-tight flex flex-col items-center justify-center gap-2">
              <span className="font-handwritten text-4xl sm:text-5xl lg:text-6xl text-black font-semibold lowercase tracking-wide" style={{ transform: 'rotate(-2deg)' }}>
                ¿Qué habilidad te llevará al...
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600 block mt-2">
                Siguiente Nivel?
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-lg lg:text-xl leading-relaxed max-w-[700px] mx-auto mb-10 mt-4">
              Explora nuestros programas especializados. Selecciona rutas de aprendizaje creadas para transformar tu carrera en datos y automatización corporativa.
            </p>
          </FadeIn>

          {/* Glowing Premium Search Bar */}
          <FadeIn delay={0.4}>
            <div className="relative max-w-[700px] mx-auto group">
              {/* Dynamic Glow Effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#1890FF] to-[#6366F1] rounded-2xl blur-lg opacity-10 group-focus-within:opacity-30 transition duration-500 pointer-events-none"></div>
              
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(24,144,255,0.1)] transition-all duration-300 group-focus-within:border-[#1890FF] hover:border-gray-300">
                <div className="pl-6 pr-4 text-gray-400 transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Ej. Python, Power BI, SQL, Finanzas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-5 pr-6 bg-transparent text-[#0F172A] placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent border-0 border-transparent font-medium text-lg"
                  autoComplete="off"
                  style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ COURSE CATALOG ════ */}
      <section className="pt-4 pb-16 lg:pt-8 lg:pb-24 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          {/* Category pills */}
          <FadeIn>
            <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-6 py-2.5 rounded-full text-[13px] font-bold border cursor-pointer transition-all ${
                    activeCategory === cat.value
                      ? "bg-[#1890FF] text-white border-[#1890FF] shadow-lg shadow-blue-500/20"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </FadeIn>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/cursos/${course.slug}`} className="group block no-underline h-full">
                    <motion.div
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col transition-colors hover:border-[#BAE7FF]"
                      whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(15,23,42,0.08)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="h-[180px] relative overflow-hidden bg-[#F8FAFC]">
                        <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-600 group-hover:scale-110" unoptimized />
                        {course.badgeLabel && (
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg text-white text-[10px] font-bold"
                            style={{ backgroundColor: course.badgeColor || course.accentColor }}>
                            {course.badgeLabel}
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center" style={{ color: course.accentColor }}>
                          <DynamicIcon name={course.icon} className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-display font-bold text-lg text-[#0F172A] mb-2 group-hover:text-[#1890FF] transition-colors">{course.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{course.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.techStack.map((tech) => (
                            <span key={tech} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded border border-gray-100">{tech}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><Clock size={14} /> {course.durationHours}h</span>
                            <span className="capitalize text-xs font-medium px-2 py-0.5 bg-gray-50 rounded">{course.level}</span>
                          </div>
                          <ChevronRight size={16} className="text-[#1890FF] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron cursos con esos filtros.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
