"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import { courses } from "@/lib/data/courses";
import { companyLogos } from "@/lib/data/images";
import { FadeIn } from "@/components/shared/AnimatedComponents";

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/programbi",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/programbi",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@programbi",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const topCourses = courses.slice(0, 6);
  const topLogos = companyLogos.slice(0, 8);

  return (
    <footer className="relative bg-white border-t border-gray-100">
      {/* ═══ CTA BANNER ═══ */}
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 -mt-20">
        <FadeIn>
          <div
            className="rounded-[2rem] p-10 lg:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1890FF 0%, #0050b3 50%, #1890FF 100%)",
              backgroundSize: "200% 200%",
              animation: "gradient-shift 6s ease infinite",
            }}
          >
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute top-10 left-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 9, repeat: Infinity }}
              className="absolute bottom-10 right-[15%] w-52 h-52 bg-white/5 rounded-full blur-3xl"
            />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                ¿Listo para transformar tu carrera?
              </h2>
              <p className="text-white/80 text-lg max-w-[500px] mx-auto mb-8">
                Únete a más de 1.500 profesionales que ya dominan los datos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contacto"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-[#1890FF] px-8 py-4 rounded-xl font-bold text-base no-underline hover:-translate-y-1 transition-all shadow-xl"
                >
                  Comenzar Ahora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-base no-underline hover:bg-white/10 transition-all"
                >
                  Explorar Cursos
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══ TRUSTED BY ═══ */}
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-16 pb-6">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
          Empresas que confían en nosotros
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {topLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.url}
              alt={logo.name}
              width={120}
              height={40}
              className="h-7 lg:h-9 w-auto object-contain opacity-30 hover:opacity-60 grayscale hover:grayscale-0 transition-all duration-300"
              unoptimized
            />
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 my-4" />

      {/* ═══ MAIN FOOTER ═══ */}
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 pr-8">
            <Image src={LOGO_URL} alt="ProgramBI" width={160} height={45} className="h-10 w-auto mb-5" unoptimized />
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6 max-w-[380px]">
              Comprometidos con la educación tecnológica. Nuestra metodología se basa en casos reales para prepararte con las herramientas más demandadas del mercado laboral.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1890FF] hover:bg-blue-50 hover:border-blue-100 transition-all hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="font-display font-extrabold text-[13px] text-[#0F172A] uppercase tracking-[0.15em] mb-5">
              Cursos
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {topCourses.map((course) => (
                <li key={course.slug}>
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="text-gray-500 hover:text-[#1890FF] transition-colors text-sm no-underline flex items-center gap-1.5 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#1890FF] transition-colors flex-shrink-0" />
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            <div>
              <h3 className="font-display font-extrabold text-[13px] text-[#0F172A] uppercase tracking-[0.15em] mb-5">
                Empresa
              </h3>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { label: "Consultorías", href: "/consultorias" },
                  { label: "Contacto", href: "/contacto" },
                  { label: "Campus Virtual", href: "/campus" },
                  { label: "Registrarse", href: "/registro" },
                  { label: "Política de Privacidad", href: "/privacidad" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-500 hover:text-[#1890FF] transition-colors text-sm no-underline flex items-center gap-1.5 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#1890FF] transition-colors flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* Contacto */}
          <div>
            <h3 className="font-display font-extrabold text-[13px] text-[#0F172A] uppercase tracking-[0.15em] mb-5">
              Contacto
            </h3>
            <ul className="space-y-4 list-none p-0 m-0">
              <li>
                <a href="mailto:contacto@programbi.cl" className="flex items-start gap-3 text-gray-500 hover:text-[#1890FF] transition-colors text-sm no-underline">
                  <Mail size={16} className="flex-shrink-0 mt-0.5" />
                  contacto@programbi.cl
                </a>
              </li>
              <li>
                <a href="tel:+56935409699" className="flex items-start gap-3 text-gray-500 hover:text-[#1890FF] transition-colors text-sm no-underline">
                  <Phone size={16} className="flex-shrink-0 mt-0.5" />
                  +56 9 3540 9699
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-500 text-sm">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  Alonso de Córdova 5870, Ofc. 724<br />Las Condes, Santiago, Chile
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/56935409699"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-bold no-underline hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 4px 12px rgba(37,211,102,0.3)" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            © {new Date().getFullYear()} ProgramBI. Hecho con <Heart size={12} className="text-red-400 fill-red-400" /> en Chile
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/privacidad" className="hover:text-[#1890FF] transition-colors no-underline">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
}
