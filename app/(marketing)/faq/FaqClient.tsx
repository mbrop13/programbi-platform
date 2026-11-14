"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePaisRuta } from "@/lib/paises/cliente";
import { rutaLocal } from "@/lib/paises/rutas";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "general", label: "General" },
  { value: "cursos", label: "Cursos y Clases" },
  { value: "pagos", label: "Pagos" },
  { value: "empresa", label: "Empresas" },
] as const;

export default function FaqClient({ faqItems }: { faqItems: FaqItem[] }) {
  const pais = usePaisRuta();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" ? true : item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqItems, searchQuery, activeCategory]);

  const categories = useMemo(
    () => CATEGORIES.filter((cat) => cat.value === "all" || faqItems.some((item) => item.category === cat.value)),
    [faqItems]
  );

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Preguntas frecuentes</h1>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
          Dudas sobre clases, certificados, pagos y el día a día del curso.
        </p>

        <div className="mt-6 flex flex-col gap-2 rounded-xl border border-line bg-paper px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mute">
            ¿Buscas precios en moneda local, horarios por país o el paso a paso de inscripción?
          </p>
          <Link
            href={rutaLocal(pais, "/preguntas-frecuentes")}
            className="shrink-0 text-sm font-semibold text-ink underline underline-offset-4 hover:text-mute"
          >
            Ver guía completa en preguntas frecuentes
          </Link>
        </div>

        <div className="relative mt-8">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar una pregunta"
            className="h-12 w-full rounded-xl border border-line-strong bg-paper pl-11 pr-4 text-base text-ink placeholder:text-faint"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                activeCategory === cat.value ? "bg-ink text-canvas" : "border border-line bg-paper text-ink hover:bg-wash"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {filtered.map((item) => (
            <details key={item.question} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.question}</span>
                <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">{item.answer}</p>
            </details>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-mute">No encontramos preguntas con esa búsqueda.</p>
        )}

        <p className="mt-12 text-sm text-mute">
          ¿No está tu duda?{" "}
          <Link href="/?auth=register" className="font-semibold text-ink underline underline-offset-2">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
