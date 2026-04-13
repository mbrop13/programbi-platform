"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import React from "react";
import { courses, getFeaturedCourses, getStandardCourses } from "@/lib/data/courses";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/shared/AnimatedComponents";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

export default function CoursesSection() {
  const featured = getFeaturedCourses();
  const standard = getStandardCourses();

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1890FF] rounded-full blur-[150px] opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6366F1] rounded-full blur-[150px] opacity-5 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-20">
            <span className="inline-block bg-white text-[#1890FF] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full mb-6 border border-blue-100 shadow-sm">
              Formación Profesional Especializada
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight mb-6 tracking-tight">
              Domina las <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">herramientas</span><br />
              de la industria.
            </h2>
            <p className="text-lg text-slate-500 max-w-[700px] mx-auto leading-relaxed">
              Programas inmersivos diseñados por expertos para que te conviertas en un referente en análisis de datos, automatización e Inteligencia Artificial.
            </p>
          </div>
        </FadeIn>

        {/* ════ PREMIUM FEATURED TRIO (LIGHT THEME) ════ */}
        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {featured.map((course) => (
            <StaggerItem key={course.slug}>
              <TiltCard>
                <Link href={`/cursos/${course.slug}`} className="group block no-underline h-full relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#1890FF]/30 to-[#6366F1]/30 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]" />
                  <div className="bg-white rounded-[2rem] overflow-hidden relative h-full flex flex-col transition-all border border-slate-200 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] group-hover:shadow-[0_25px_50px_-12px_rgba(24,144,255,0.25)]">
                    
                    {/* Inner top glow effect */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#1890FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                    
                    {/* Image */}
                    <div className="relative overflow-hidden h-[250px] z-10 m-2 rounded-[1.5rem]">
                      <div className="absolute inset-0 bg-[#0F172A]/5 z-10 group-hover:bg-transparent transition-colors" />
                      <div
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl text-white text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 backdrop-blur-md shadow-sm"
                        style={{ background: `${course.badgeColor || course.accentColor}dd`, border: `1px solid ${course.badgeColor || course.accentColor}` }}
                      >
                        <Sparkles size={12} /> {course.badgeLabel || course.categoryLabel}
                      </div>
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow z-10 text-slate-900">
                      <div className="flex gap-2 flex-wrap mb-4">
                        {course.techStack.map((tech) => (
                          <span key={tech} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-mono border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-display text-2xl font-extrabold text-slate-900 mb-3 leading-tight group-hover:text-[#1890FF] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
                        {course.shortDescription}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pt-6 border-t border-slate-100">
                          <span className="flex items-center gap-1.5 font-medium"><Clock size={14} className="text-[#1890FF]"/> {course.durationHours} hrs</span>
                          <span className="flex items-center gap-1.5 font-medium"><Users size={14} className="text-[#1890FF]"/> Online Premium</span>
                        </div>
                        
                        <div className="w-full flex items-center justify-between font-bold text-slate-900 transition-all duration-300 group-hover:text-[#1890FF]">
                          <span>Ver especialización</span>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1890FF] group-hover:text-white transition-colors border border-slate-200 group-hover:border-transparent">
                             <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="flex items-center gap-6 mb-16">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-200"></div>
          <h3 className="font-display text-xl font-bold text-slate-400 uppercase tracking-widest">
            Catálogo Individual
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-200"></div>
        </div>

        {/* ════ STANDARD GRID (LIGHT THEME) ════ */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {standard.map((course) => (
            <StaggerItem key={course.slug}>
              <Link href={`/cursos/${course.slug}`} className="group block no-underline h-full">
                <motion.div
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 h-full flex flex-col transition-all duration-300 hover:border-transparent"
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(15,23,42,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Image */}
                  <div className="h-[180px] relative overflow-hidden bg-[#F8FAFC]">
                    <div className="absolute inset-0 bg-[#0F172A]/5 z-10 group-hover:bg-transparent transition-colors" />
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ color: course.accentColor }}>
                      <DynamicIcon name={course.icon} className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow relative">
                    <div className="absolute top-0 left-0 w-full h-1 group-hover:opacity-100 transition-opacity" style={{ background: course.accentColor, opacity: 0 }} />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest mb-3 text-slate-400 group-hover:text-[#1890FF] transition-colors">
                      {course.categoryLabel}
                    </span>
                    <h3 className="font-display text-[18px] font-bold text-slate-800 mb-2 leading-tight group-hover:text-[#1890FF] transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed mb-6 line-clamp-2">{course.shortDescription}</p>
                    <div className="mt-auto flex items-center justify-between font-bold text-[#1890FF] text-[13px]">
                      <span className="flex items-center gap-1"><Clock size={12}/> {course.durationHours}h</span>
                      <span className="flex items-center gap-1 group-hover:gap-2 transition-all">Ver Curso <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center mt-20">
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold text-[15px] px-8 py-4 rounded-xl hover:text-[#1890FF] hover:border-[#1890FF] hover:shadow-lg transition-all no-underline group"
            >
              Ver el catálogo completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
