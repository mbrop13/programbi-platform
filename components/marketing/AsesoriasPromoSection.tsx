"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Database, BarChart, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";

export default function AsesoriasPromoSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="pt-3 pb-6 lg:pt-4 lg:pb-8 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column - Copy & Grid */}
          <div className="lg:col-span-6 text-left">
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100/30 text-blue-600 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Mentoría 1 a 1 en vivo
              </span>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight font-display tracking-tight">
                Desbloquea ese problema que te lleva <span className="text-[#1890FF]">frenando días</span>.
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl font-sans">
                ¿Atascado con un modelo DAX complejo, una consulta SQL pesada o un script de Python que no corre? Agenda una sesión privada por hora y resolvamos tu problema técnico juntos en tiempo real.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <StaggerChildren className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Database className="w-5 h-5 text-emerald-500" />, text: "Optimización SQL" },
                  { icon: <BarChart className="w-5 h-5 text-blue-500" />, text: "Modelado Power BI & DAX" },
                  { icon: <Code className="w-5 h-5 text-amber-500" />, text: "Scripts de Python & ETL" },
                  { icon: <Clock className="w-5 h-5 text-purple-500" />, text: "Sesiones de 1 o más horas" },
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-center gap-3 bg-white border border-slate-150/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="p-2 rounded-lg bg-slate-50 shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-slate-800 font-bold text-sm font-sans">{item.text}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Link 
                href="/asesorias"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] transition-all shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 no-underline font-sans"
              >
                <span>Agendar una Mentoría en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>

          {/* Right Column - Premium Browser Video Mockup */}
          <div className="lg:col-span-6 relative mt-12 lg:mt-0 flex items-center justify-center w-full">
            {/* Background glowing blob */}
            <div className="absolute -inset-4 z-0 bg-gradient-to-tr from-blue-300/10 to-indigo-300/10 rounded-[2.5rem] blur-2xl opacity-75 pointer-events-none" />
            
            <FadeIn delay={0.3} className="w-full relative z-10">
              <div 
                className="relative w-full aspect-[16/10] bg-slate-950 border border-slate-150/40 rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.12)] cursor-pointer"
              >
                {/* Video Container with smooth fade-in */}
                <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {/* Grid overlay background to simulate spreadsheet style */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Themed gradient placeholder visible while video is loading */}
                  <div className={`absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0B0F19] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
                    isVideoLoaded ? "opacity-0" : "opacity-100"
                  }`}>
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 mb-3">
                      <span className="text-xs font-bold font-mono">XLS</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Cargando diagnóstico...</span>
                  </div>

                  <video
                    src="https://mail.programbi.com/uploads/Excel_common_errors_video_202606021709.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onPlay={() => setIsVideoLoaded(true)}
                    onLoadedData={() => setIsVideoLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-1000 ease-out pointer-events-none ${
                      isVideoLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  
                  {/* Glassy overlay frame elements */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent h-12 pointer-events-none" />
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
