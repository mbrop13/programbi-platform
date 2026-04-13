"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expand } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { galleryImages } from "@/lib/data/images";

export default function GallerySection() {
  const [mainIndex, setMainIndex] = useState(0);

  const handleSwap = (index: number) => {
    if (index === mainIndex) return;
    setMainIndex(index);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16 max-w-[900px] mx-auto">
            <span className="inline-block bg-[rgba(24,144,255,0.08)] text-[#1890FF] font-extrabold tracking-[0.15em] uppercase text-sm px-5 py-2.5 rounded-full border border-[rgba(24,144,255,0.2)] mb-4">
              Galería Interactiva
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0F172A] leading-tight mb-6">
              Visualiza el Flujo de Datos
            </h2>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Explora cada etapa del proceso: desde la consulta SQL y el código Python, hasta el modelado de datos y el dashboard final en Power BI.
              <br />
              <span className="text-sm opacity-70">(Haz clic en las imágenes pequeñas para ampliarlas)</span>
            </p>
          </div>
        </FadeIn>

        {/* Gallery Layout */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6" style={{ height: "auto" }}>
            {/* Main Stage */}
            <div
              className="relative rounded-[2rem] overflow-hidden bg-white border border-[#E2E8F0] cursor-pointer h-[350px] lg:h-[600px] transition-all duration-400"
              style={{ boxShadow: "0 20px 50px -15px rgba(15,23,42,0.1)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryImages[mainIndex].url}
                    alt={galleryImages[mainIndex].label}
                    fill
                    className="object-contain bg-[#f8fafc] hover:scale-[1.02] transition-transform duration-600"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-lg px-5 py-2.5 rounded-xl font-extrabold text-[#1890FF] text-sm z-10 shadow-md">
                {galleryImages[mainIndex].label}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 lg:grid-cols-2 lg:grid-rows-3 gap-4">
              {galleryImages.slice(0, 6).map((img, i) => (
                <motion.div
                  key={i}
                  onClick={() => handleSwap(i)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer h-[120px] lg:h-auto bg-white transition-all duration-300 ${
                    i === mainIndex ? "ring-2 ring-[#1890FF] ring-offset-2" : "border-2 border-transparent hover:border-[#1890FF]"
                  }`}
                  whileHover={{ y: -4, boxShadow: "0 15px 30px rgba(24,144,255,0.15)" }}
                >
                  <Image
                    src={img.url}
                    alt={img.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[rgba(24,144,255,0.2)] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Expand className="text-white w-6 h-6 drop-shadow-lg" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
