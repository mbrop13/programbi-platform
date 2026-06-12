"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip 1.5 seconds after mounting, then hide it after 8 seconds
    const showTimer = setTimeout(() => setShowTooltip(true), 1500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 9500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const whatsappUrl = "https://wa.me/56935409699?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos%20de%20ProgramBI.";

  const isBlog = pathname?.startsWith("/blog");
  if (isBlog) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex items-center justify-end select-none pointer-events-none">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mr-3.5 bg-slate-900 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 pointer-events-auto cursor-pointer"
            onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
          >
            <span>💬 ¿Dudas? Hablemos por WhatsApp</span>
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-t border-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button wrapper */}
      <div 
        className="relative pointer-events-auto"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Animated pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid #25D366" }}
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Glow behind the button */}
        <div className="absolute inset-0 rounded-full blur-xl scale-125 bg-[#25D366]/20" />

        {/* Main WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 bg-[#25D366] hover:bg-[#20ba5a]"
          style={{ boxShadow: "0 8px 24px rgba(37,211,102,0.4)" }}
          aria-label="Contactar por WhatsApp"
        >
          {/* Shine effect */}
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-white/20 to-transparent" />
          
          {/* Custom official SVG WhatsApp Icon */}
          <svg className="w-7 h-7 text-white fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
