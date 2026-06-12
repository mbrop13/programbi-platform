"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HelpCircle, ChevronDown, MessageSquare, ArrowRight } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "general", label: "General" },
  { value: "cursos", label: "Cursos y Clases" },
  { value: "pagos", label: "Pagos y Acreditación" },
  { value: "empresa", label: "Empresas" },
] as const;

function FaqAccordion({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-slate-50 border-none cursor-pointer focus:outline-none"
      >
        <span className="font-display font-bold text-[15px] sm:text-base text-slate-900 pr-4">
          {item.question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#1890FF]" : ""
          }`} 
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 border-t border-slate-50 text-slate-500 text-sm leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqClient({ faqItems }: { faqItems: FaqItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" ? true : item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqItems, searchQuery, activeCategory]);

  return (
    <main className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
      <div className="max-w-[800px] mx-auto px-5">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Inicio</Link>
          <span className="text-slate-350">/</span>
          <span className="text-slate-800 font-bold">FAQ</span>
        </div>

        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
            Preguntas Frecuentes
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4">
            ¿Tienes dudas? Te ayudamos
          </h1>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl my-0">
            Encuentra respuestas inmediatas sobre las capacitaciones en vivo, planes empresariales y formas de pago disponibles.
          </p>
        </div>

        {/* Search & Categories Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pregunta frecuente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Categories Tablist */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    isActive
                      ? "bg-[#1890FF] text-white shadow-md shadow-blue-500/10"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-slate-800 mb-1">Duda no encontrada</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                No encontramos preguntas que coincidan con tu búsqueda. Prueba con otras palabras clave.
              </p>
            </div>
          ) : (
            filtered.map((item, index) => (
              <FaqAccordion key={index} item={item} />
            ))
          )}
        </div>

        {/* Contact Banner */}
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden mt-16 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="text-center sm:text-left">
              <h3 className="font-display font-black text-xl mb-2 flex items-center justify-center sm:justify-start gap-2">
                <MessageSquare className="w-5 h-5 text-[#1890FF]" />
                ¿Aún tienes preguntas?
              </h3>
              <p className="text-slate-350 text-xs sm:text-sm leading-relaxed my-0">
                Escríbenos directamente por WhatsApp y uno de nuestros asesores te responderá en minutos.
              </p>
            </div>
            <a
              href="https://wa.me/56935409699"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm text-center no-underline flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
            >
              <span>Escríbenos por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
