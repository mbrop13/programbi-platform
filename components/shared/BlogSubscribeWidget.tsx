"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function BlogSubscribeWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Show widget 2 seconds after mount if it wasn't dismissed
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isBlog = pathname?.startsWith("/blog");

  if (!isBlog || dismissed || user) return null;

  const handleOpenSubscribe = () => {
    window.dispatchEvent(new Event("open-nl-subscribe"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[9998] max-w-[290px] sm:max-w-[320px] bg-white border-2 border-slate-950 p-5 shadow-[6px_6px_0px_#000000] select-none rounded-none flex flex-col pointer-events-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 text-slate-450 hover:text-slate-950 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Mail className="w-4 h-4 text-[#1890FF]" />
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-slate-950">
              Boletín Programbi
            </span>
          </div>

          {/* Description */}
          <p className="font-sans text-xs text-slate-650 font-medium leading-relaxed my-0 mb-4 pr-3">
            Regístrate gratis y recibe las mejores guías técnicas, artículos de IA y noticias directamente en tu correo.
          </p>

          {/* Button */}
          <button
            onClick={handleOpenSubscribe}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-none border-none cursor-pointer text-center"
          >
            SUSCRÍBETE GRATIS
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
