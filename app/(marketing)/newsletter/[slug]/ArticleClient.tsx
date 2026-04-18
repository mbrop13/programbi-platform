"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Tag, Share2, ChevronRight, Newspaper, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getArticleBySlug, getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import ArticleBlockRenderer from "@/components/shared/ArticleBlockRenderer";

const categoryColors: Record<string, string> = {
  "power-bi": "#F2C811",
  sql: "#CC2927",
  python: "#3776AB",
  ia: "#7C3AED",
  industria: "#059669",
  general: "#1890FF",
};

const categoryLabels: Record<string, string> = {
  "power-bi": "Power BI",
  sql: "SQL",
  python: "Python",
  ia: "Inteligencia Artificial",
  industria: "Industria",
  general: "General",
};

export default function ArticleClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticleBySlug(slug);
        setArticle(data);

        if (data?.category) {
          const allArticles = await getPublishedArticles(data.category);
          setRelated(allArticles.filter((a: any) => a.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="-mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#1890FF] rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Cargando artículo...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="-mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-200 mx-auto mb-5" />
          <h2 className="font-display font-black text-2xl text-gray-900 mb-2">Artículo no encontrado</h2>
          <p className="text-gray-400 text-sm mb-6">Este artículo no existe o no está publicado.</p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1890FF] text-white font-bold rounded-xl text-sm no-underline hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Newsletter
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="-mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-screen bg-[#FAFBFC]">
      {/* Cover Image */}
      {article.cover_image && (
        <div className="relative w-full h-[300px] lg:h-[480px] overflow-hidden">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-[#0F172A]/30" />
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-[760px] mx-auto px-5">
        <div className={article.cover_image ? "-mt-24 relative z-10" : "pt-12"}>
          <FadeIn>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
              <Link href="/newsletter" className="hover:text-[#1890FF] no-underline text-gray-400 transition-colors">
                Newsletter
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: categoryColors[article.category] || "#1890FF" }}>
                {categoryLabels[article.category] || article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] leading-[1.15] tracking-tight mb-6">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20">
                  {(article.author_name || "P")[0]}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900 block">{article.author_name || "ProgramBI"}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {article.reading_time_min} min
                </span>
                <span
                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: categoryColors[article.category] || "#1890FF" }}
                >
                  {categoryLabels[article.category] || article.category}
                </span>
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed font-medium mb-10 border-l-4 border-[#1890FF] pl-5">
                {article.excerpt}
              </p>
            )}

            {/* Article Body */}
            <ArticleBlockRenderer content={article.content} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-gray-100">
                <Tag className="w-4 h-4 text-gray-400" />
                {article.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-4 mb-16">
              <span className="text-sm font-bold text-gray-900">Compartir:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-all no-underline"
              >
                𝕏
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-all no-underline text-sm font-bold"
              >
                in
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("¡Link copiado!");
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-800 hover:text-white transition-all border-none cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pb-16">
            <h3 className="font-display font-black text-xl text-gray-900 mb-6">Artículos Relacionados</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/newsletter/${r.slug}`} className="group block no-underline">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-32 overflow-hidden">
                      {r.cover_image ? (
                        <Image
                          src={r.cover_image}
                          alt={r.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1890FF] transition-colors line-clamp-2 leading-tight">
                        {r.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 mt-2 block">
                        {r.reading_time_min} min · {formatDate(r.published_at || r.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
