"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserCheck, BarChart3, Brain, Monitor, Users, Briefcase, ArrowRight, Check } from "lucide-react";
import { mentors } from "@/lib/data/mentors";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const avatarGradients: Record<string, string> = {
  UserCheck: "from-blue-500 to-indigo-600",
  BarChart3: "from-emerald-400 to-emerald-600",
  Brain: "from-purple-500 to-indigo-600",
  Monitor: "from-amber-400 to-amber-600",
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function MentorsSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden flex justify-center items-center">
      {/* Premium background accents */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1300px] mx-auto px-5 lg:px-10 relative z-10 w-full">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Header Column (Blue Panel) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-blue-600 via-[#1890FF] to-indigo-700 text-white rounded-[2.2rem] p-8 lg:p-10 shadow-lg relative overflow-hidden select-none">
            {/* Subtle glowing mesh */}
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-5">
                  Equipo de Expertos
                </span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-tight mb-4">
                  Conoce a nuestro <span className="text-blue-100">equipo.</span>
                </h2>
                <p className="text-xs lg:text-sm text-blue-50 leading-relaxed font-medium">
                  Aprende de profesionales activos de las mejores universidades y empresas que lideran la transformación digital en la industria.
                </p>
              </div>

              {/* Mini Trust Footer */}
              <div className="border-t border-white/15 pt-5 flex items-center justify-between text-left">
                <div>
                  <p className="text-2xl font-black font-mono leading-none">100%</p>
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-blue-200 mt-1">Práctico y Real</p>
                </div>
                <div className="w-px h-8 bg-white/15" />
                <div>
                  <p className="text-2xl font-black font-mono leading-none">24/7</p>
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-blue-200 mt-1">Apoyo y Mentoría</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Column (Right) */}
          <div className="lg:col-span-8 w-full">
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[480px] w-full">
              {mentors.map((mentor, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.div
                    key={mentor.name}
                    layout
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`relative overflow-hidden rounded-[2.2rem] border transition-all duration-500 cursor-pointer group flex flex-col justify-end ${
                      isActive 
                        ? "flex-[3] lg:flex-[3.5] border-[#1890FF]/40 shadow-[0_24px_50px_rgba(24,144,255,0.08)] bg-white" 
                        : "flex-1 border-[#E2E8F0] bg-slate-50 hover:bg-slate-100/50"
                    } h-[320px] lg:h-full`}
                  >
                    
                    {/* Background Visual Container */}
                    <div className="absolute inset-0 z-0">
                      {mentor.imageUrl ? (
                        <Image
                          src={mentor.imageUrl}
                          alt={mentor.name}
                          fill
                          sizes={isActive ? "500px" : "200px"}
                          className={`object-cover transition-all duration-700 ease-in-out ${
                            isActive ? "grayscale-0 scale-[1.02] opacity-100" : "grayscale opacity-75 group-hover:opacity-90"
                          } pointer-events-none`}
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${avatarGradients[mentor.icon] || avatarGradients.UserCheck} flex items-center justify-center transition-all duration-550 ${
                          isActive ? "grayscale-0 opacity-100" : "grayscale opacity-70 group-hover:opacity-85"
                        }`}>
                          <span className="text-white text-5xl font-black select-none pointer-events-none opacity-85">
                            {getInitials(mentor.name)}
                          </span>
                        </div>
                      )}
                      
                      {/* Dark overlay gradient for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-90 pointer-events-none" />
                    </div>

                    {/* Floating Badge (Glassmorphic) for manual trigger */}
                    {mentor.isFounder && (
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-[#1890FF] text-white text-[8px] font-black uppercase tracking-wider rounded-full shadow-sm z-20 select-none">
                        Fundador
                      </span>
                    )}

                    {/* Profile Information Panel */}
                    <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7 z-20 flex flex-col justify-end text-left text-white h-full bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none">
                      
                      {/* Name & LinkedIn */}
                      <div className="flex items-center justify-between w-full mb-1 pointer-events-auto">
                        <h3 className={`font-display text-lg lg:text-xl font-black tracking-tight ${
                          isActive ? "text-[#1890FF]" : "text-white"
                        } transition-colors leading-none`}>
                          {mentor.name}
                        </h3>
                        {isActive && mentor.linkedinUrl && (
                          <a
                            href={mentor.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/75 hover:text-[#0A66C2] transition-colors p-1 hover:scale-110 duration-200 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`LinkedIn de ${mentor.name}`}
                          >
                            <LinkedinIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      {/* Role */}
                      <p className="text-[10px] font-black text-slate-350 uppercase tracking-widest mb-2 leading-none">
                        {mentor.role}
                      </p>

                      {/* Collapsed view action indicator */}
                      {!isActive && (
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide mt-1 leading-none select-none">
                          Ver perfil
                        </span>
                      )}

                      {/* Expanded View Profile Info */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="flex flex-col gap-3.5 w-full border-t border-white/10 pt-3.5 mt-2 pointer-events-auto"
                        >
                          {/* Credentials list */}
                          <ul className="space-y-1.5 p-0 m-0 select-none">
                            {mentor.credentials.map((cred, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed list-none">
                                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5 stroke-[3]" />
                                <span>{cred}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Trust Metrics Bar */}
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 select-none">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span>{mentor.studentCount.toLocaleString()}+ alumnos</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                              <span>{mentor.yearsExperience}+ años exp.</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="pt-1 flex justify-start">
                            <Link
                              href={mentor.isFounder ? "/nosotros" : "/cursos"}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-[#1890FF] hover:text-blue-400 transition-colors group/cta leading-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{mentor.isFounder ? "Ver perfil completo" : `Ver cursos de ${mentor.name.split(" ")[0]}`}</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
