"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Book, ArrowRight } from "lucide-react";

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  details: string;
  category: string;
}

export default function GlosarioClient({ terms }: { terms: GlossaryTerm[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Get unique starting letters from terms
  const availableLetters = useMemo(() => {
    const letters = terms.map((t) => t.term[0].toUpperCase());
    return [...new Set(letters)].sort();
  }, [terms]);

  // Filter terms by query and starting letter
  const filteredTerms = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLetter = selectedLetter
        ? t.term[0].toUpperCase() === selectedLetter.toUpperCase()
        : true;

      return matchesSearch && matchesLetter;
    });
  }, [terms, searchQuery, selectedLetter]);

  return (
    <div className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-10">
          
          {/* Breadcrumbs Row */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Inicio</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Glosario</span>
          </div>

          <div className="mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
              Diccionario de Datos
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4">
              Glosario de Términos
            </h1>
            <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-3xl">
              Aprende el vocabulario técnico clave que utilizan los analistas y profesionales de datos. Definiciones directas y amigables para estructurar tu conocimiento.
            </p>
          </div>

          {/* Search & Letter Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar término o palabra clave..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter(null);
                }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Letter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">Filtrar:</span>
              <button
                onClick={() => setSelectedLetter(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  selectedLetter === null
                    ? "bg-[#1890FF] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Todos
              </button>
              {availableLetters.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLetter(l)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    selectedLetter === l
                      ? "bg-[#1890FF] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-6">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h2 className="font-display font-bold text-lg text-slate-800 mb-1">Término no encontrado</h2>
                <p className="text-slate-400 text-sm">Prueba buscando con palabras como SQL, Python o DAX.</p>
              </div>
            ) : (
              filteredTerms.map((t) => (
                <article
                  key={t.slug}
                  id={t.slug}
                  className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display font-bold text-xl text-slate-900 group-hover:text-[#1890FF] transition-colors my-0">
                      {t.term}
                    </h2>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {t.category}
                    </span>
                  </div>
                  
                  {/* Definition Lead block (TL;DR) */}
                  <blockquote className="m-0 pl-4 border-l-2 border-[#1890FF] text-slate-700 text-sm font-semibold leading-relaxed">
                    <strong>TL;DR:</strong> {t.definition}
                  </blockquote>

                  {/* Details block */}
                  <p className="text-slate-500 text-sm leading-relaxed my-0 pt-2">
                    {t.details}
                  </p>
                </article>
              ))
            )}
          </div>

          {/* Call to action */}
          <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mt-16 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display font-black text-2xl mb-3">Aprende a aplicar estos conceptos</h2>
              <p className="text-slate-350 text-sm leading-relaxed mb-6">
                No te quedes solo en la teoría. Aprende SQL, modelamiento de Power BI y programación en Python mediante proyectos prácticos guiados paso a paso con instructores en vivo.
              </p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
              >
                <span>Explorar Cursos en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </div>
  );
}
