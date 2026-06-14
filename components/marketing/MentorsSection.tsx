"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserCheck, BarChart3, Brain, Monitor, Users, Briefcase, ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";
import { mentors } from "@/lib/data/mentors";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCheck,
  BarChart3,
  Brain,
  Monitor,
};

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const themeMap: Record<string, { bg: string; text: string; border: string; hoverBg: string; hoverText: string; hoverBorder: string }> = {
  UserCheck: {
    bg: "bg-[#F0F7FF]",
    text: "text-[#1890FF]",
    border: "border-blue-100/55",
    hoverBg: "group-hover:bg-[#1890FF]",
    hoverText: "group-hover:text-[#1890FF]",
    hoverBorder: "#1890FF",
  },
  BarChart3: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100/55",
    hoverBg: "group-hover:bg-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    hoverBorder: "#10B981",
  },
  Brain: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100/55",
    hoverBg: "group-hover:bg-purple-600",
    hoverText: "group-hover:text-purple-600",
    hoverBorder: "#8B5CF6",
  },
  Monitor: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100/55",
    hoverBg: "group-hover:bg-amber-600",
    hoverText: "group-hover:text-amber-600",
    hoverBorder: "#F59E0B",
  },
};

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
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Premium background accents */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1300px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1890FF] text-xs font-bold uppercase tracking-wider mb-4">
              Equipo de Expertos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight mb-4 leading-tight">
              Mentores{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                Expertos
              </span>
            </h2>
            <p className="text-base lg:text-lg text-[#64748B] max-w-[700px] mx-auto leading-relaxed">
              Aprende de profesionales activos de las mejores universidades y empresas que lideran la transformación digital en la industria.
            </p>
          </div>
        </FadeIn>

        {/* Mentors Grid */}
        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mentors.map((mentor) => {
            const theme = themeMap[mentor.icon] || themeMap.UserCheck;
            return (
              <StaggerItem key={mentor.name} className="h-full">
                <motion.div
                  className="group bg-white border border-[#E2E8F0] rounded-[2.2rem] p-8 h-full flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                  style={{ boxShadow: "0 10px 30px -10px rgba(15,23,42,0.03)" }}
                  whileHover={{
                    y: -12,
                    borderColor: theme.hoverBorder,
                    boxShadow: `0 30px 60px -15px ${theme.hoverBorder}1a`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start text-left">
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0 relative">
                      {mentor.imageUrl ? (
                        <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[#1890FF] to-indigo-500 flex items-center justify-center shadow-md">
                          <div className="w-full h-full rounded-full overflow-hidden border border-white bg-white relative">
                            <Image
                              src={mentor.imageUrl}
                              alt={mentor.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                              priority
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradients[mentor.icon] || avatarGradients.UserCheck} flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-white select-none`}>
                          {getInitials(mentor.name)}
                        </div>
                      )}
                      
                      {mentor.isFounder && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#1890FF] text-white text-[8px] font-black uppercase tracking-wider rounded-full shadow-sm z-10 whitespace-nowrap">
                          Fundador
                        </span>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 w-full">
                      {/* Name & LinkedIn */}
                      <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                        <h3 className={`font-display text-lg font-black text-[#0F172A] ${theme.hoverText} transition-colors`}>
                          {mentor.name}
                        </h3>
                        {mentor.linkedinUrl && (
                          <a
                            href={mentor.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#0A66C2] transition-colors p-1 hover:scale-110 duration-200"
                            aria-label={`LinkedIn de ${mentor.name}`}
                          >
                            <LinkedinIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      {/* Role / Job Title */}
                      <p className={`text-xs font-black ${theme.text} uppercase tracking-widest mb-3`}>
                        {mentor.role}
                      </p>

                      <div className="w-full h-px bg-[#F1F5F9] mb-4" />

                      {/* Credentials list */}
                      <ul className="space-y-2.5 mb-4">
                        {mentor.credentials.map((cred, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#64748B] leading-relaxed">
                            <svg className={`w-4 h-4 text-[#10B981] ${theme.hoverText} transition-colors flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Trust Metrics Bar */}
                      <div className="flex items-center gap-3 mt-4 text-xs font-bold text-slate-500 select-none border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mentor.studentCount.toLocaleString()}+ estudiantes</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mentor.yearsExperience}+ años exp.</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-5 pt-3 border-t border-slate-50 flex justify-start">
                        <Link
                          href={mentor.isFounder ? "/nosotros" : "/cursos"}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-[#1890FF] hover:text-blue-700 transition-colors group/cta"
                        >
                          <span>{mentor.isFounder ? "Ver perfil completo" : `Ver cursos de ${mentor.name.split(" ")[0]}`}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                        </Link>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
