"use client";

import { useState, useEffect } from "react";
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
  UserCheck: "from-[#171716] to-[#0f7ae5]",
  BarChart3: "from-zinc-700 to-zinc-900",
  Brain: "from-[#171716] to-[#0050b3]",
  Monitor: "from-zinc-600 to-zinc-800",
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-canvas relative overflow-hidden flex justify-center items-center">
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

      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10 w-full">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Header Column (Premium Glass Panel) */}
          <div className="lg:col-span-4 flex flex-col justify-between text-white rounded-[2rem] p-8 lg:p-10 relative overflow-hidden select-none border border-white/10"
            style={{
              background: "#171716",
              boxShadow: "0 24px 60px -20px rgba(23,23,22,0.35), inset 0 1px 0 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Glass mesh overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Glowing orbs */}
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] font-black uppercase tracking-wider mb-6">
                  Equipo de Expertos
                </span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-5">
                  Conoce a nuestro <span className="text-blue-100">equipo.</span>
                </h2>
                <p className="text-sm lg:text-base text-blue-50/90 leading-relaxed font-medium">
                  Aprende de profesionales activos de las mejores universidades y empresas que lideran la transformación digital en la industria.
                </p>
              </div>

              {/* Trust footer con glass cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                  <p className="text-2xl font-black font-mono leading-none">100%</p>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-100 mt-1.5">Práctico y Real</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                  <p className="text-2xl font-black font-mono leading-none">24/7</p>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-100 mt-1.5">Apoyo y Mentoría</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Column (Right) */}
          <div className="lg:col-span-8 w-full">
            <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 h-auto lg:h-[500px] w-full pb-6 -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible lg:pb-0">
              {mentors.map((mentor, index) => {
                const isActive = activeIndex === index;
                const isCardExpanded = isMobile || isActive;
                return (
                  <motion.div
                    key={mentor.name}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`relative overflow-hidden rounded-[2rem] border backdrop-blur-md transition-all duration-500 cursor-pointer group flex flex-col justify-end snap-start shrink-0 ${
                      isCardExpanded
                        ? "border-[#171716]/40 bg-white/10"
                        : "border-white/50 bg-white/30 hover:bg-white/50"
                    } w-[290px] sm:w-[320px] lg:flex-[3.5] h-[380px] sm:h-[410px] lg:h-full`}
                    style={isCardExpanded
                      ? { boxShadow: "0 24px 50px -12px rgba(24,144,255,0.20), inset 0 1px 0 0 rgba(255,255,255,0.4)" }
                      : { boxShadow: "0 8px 30px -12px rgba(15,23,42,0.12), inset 0 1px 0 0 rgba(255,255,255,0.7)" }
                    }
                  >
                    
                    {/* Background Visual Container */}
                    <div className="absolute inset-0 z-0">
                      {mentor.imageUrl ? (
                        <Image
                          src={mentor.imageUrl}
                          alt={mentor.name}
                          fill
                          sizes={isCardExpanded ? "500px" : "200px"}
                          className={`object-cover transition-all duration-700 ease-in-out ${
                            isCardExpanded ? "grayscale-0 scale-[1.02] opacity-100" : "grayscale opacity-75 group-hover:opacity-90"
                          } pointer-events-none`}
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${avatarGradients[mentor.icon] || avatarGradients.UserCheck} flex items-center justify-center transition-all duration-550 ${
                          isCardExpanded ? "grayscale-0 opacity-100" : "grayscale opacity-70 group-hover:opacity-85"
                        }`}>
                          <span className="text-white text-5xl font-black select-none pointer-events-none opacity-85">
                            {getInitials(mentor.name)}
                          </span>
                        </div>
                      )}
                      
                      {/* Dark overlay gradient for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10 z-10 opacity-95 pointer-events-none" />
                    </div>

                    {/* Floating Badge (Glassmorphic) for manual trigger */}
                    {mentor.isFounder && (
                      <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-wider rounded-full border border-white/30 shadow-sm z-20 select-none">
                        Fundador
                      </span>
                    )}

                    {/* Profile Information Panel */}
                    <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7 z-20 flex flex-col justify-end text-left text-white h-full bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent">
                      
                      {/* Name & LinkedIn */}
                      <div className="flex items-center justify-between w-full mb-1 pointer-events-auto min-w-0">
                        <h3 className={`font-display text-lg lg:text-xl font-black tracking-tight truncate ${
                          isCardExpanded ? "text-[#171716]" : "text-white"
                        } transition-colors leading-none`}>
                          {mentor.name}
                        </h3>
                        {isCardExpanded && mentor.linkedinUrl && (
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
                      {!isCardExpanded && (
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide mt-1 leading-none select-none">
                          Ver perfil
                        </span>
                      )}

                      {/* Expanded View Profile Info */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: isCardExpanded ? "auto" : 0, 
                          opacity: isCardExpanded ? 1 : 0,
                          marginTop: isCardExpanded ? 8 : 0,
                          paddingTop: isCardExpanded ? 14 : 0
                        }}
                        transition={{ 
                          height: { duration: 0.35, ease: "easeInOut" },
                          opacity: { duration: 0.3, delay: isCardExpanded ? 0.25 : 0 }
                        }}
                        className={`flex flex-col gap-3.5 w-full border-t ${
                          isCardExpanded ? "border-white/10" : "border-transparent"
                        } pointer-events-auto overflow-hidden`}
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
                            className="inline-flex items-center gap-1 text-[11px] font-black text-[#171716] hover:text-blue-400 transition-colors group/cta leading-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{mentor.isFounder ? "Ver perfil completo" : `Ver cursos de ${mentor.name.split(" ")[0]}`}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                          </Link>
                        </div>
                      </motion.div>
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
