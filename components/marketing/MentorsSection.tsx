"use client";

import { motion } from "framer-motion";
import { UserCheck, BarChart3, Brain, Monitor } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";
import { mentors } from "@/lib/data/mentors";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCheck,
  BarChart3,
  Brain,
  Monitor,
};

export default function MentorsSection() {
  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
              Mentores{" "}
              <span className="text-[#1890FF]">
                Expertos
              </span>
            </h2>
            <p className="text-base lg:text-lg text-[#64748B] max-w-[700px] mx-auto leading-relaxed">
              Aprende de profesionales activos que lideran la transformación digital en la industria.
            </p>
          </div>
        </FadeIn>

        {/* Mentors Grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => {
            const Icon = iconMap[mentor.icon];
            return (
              <StaggerItem key={mentor.name}>
                <motion.div
                  className="bg-white border border-[#F1F5F9] rounded-[2rem] p-8 text-center h-full flex flex-col transition-all duration-300"
                  style={{ boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}
                  whileHover={{
                    y: -10,
                    borderColor: "#1890FF",
                    boxShadow: "0 25px 50px -12px rgba(24,144,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-5 bg-[#F0F7FF] rounded-2xl flex items-center justify-center text-[#1890FF]"
                    whileHover={{ backgroundColor: "#1890FF", color: "#ffffff", scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {Icon ? <Icon className="w-7 h-7" /> : <UserCheck className="w-7 h-7" />}
                  </motion.div>

                  <h3 className="font-display text-lg font-extrabold text-[#0F172A] mb-1">{mentor.name}</h3>
                  <p className="text-xs font-extrabold text-[#1890FF] uppercase tracking-wider mb-5">{mentor.role}</p>

                  <div className="w-full h-px bg-[#F1F5F9] mb-5" />

                  <ul className="text-left space-y-2.5">
                    {mentor.credentials.map((cred, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#64748B] leading-relaxed">
                        <svg className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        {cred}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
