"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { courses } from "@/lib/data/courses";

const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const VIDEO_SRC =
  "https://mail.programbi.com/uploads/Astronaut_looking_at_Earth_1080p_202608102055.mp4";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/programbi",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/programbi",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 1.79 4 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@programbi",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const companyLinks = [
  { label: "Empresas", href: "/empresas" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Campus Virtual", href: "/comunidad" },
  { label: "Registrarse", href: "/registro" },
  { label: "Encuesta", href: "/feedback" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Footer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const topCourses = courses.slice(0, 6);

  useEffect(() => {
    const video = videoRef.current;
    const footer = footerRef.current;
    const cover = document.querySelector<HTMLElement>("[data-page-reveal]");
    if (!footer) return;

    const reduceMotion = prefersReducedMotion();
    let loaded = false;
    let finished = false;

    const isRevealed = () => {
      if (cover) return cover.getBoundingClientRect().bottom < window.innerHeight - 48;
      const rect = footer.getBoundingClientRect();
      return rect.top < window.innerHeight - 80 && rect.bottom > 80;
    };

    const holdLastFrame = () => {
      finished = true;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }
      video?.pause();
      video?.classList.add("is-on");
    };

    const playNow = () => {
      if (!video || finished || reduceMotion) return;
      video
        .play()
        .then(() => video.classList.add("is-on"))
        .catch(() => {});
    };

    const syncVideo = (armed: boolean) => {
      if (reduceMotion || !video) return;
      if (!armed || !isRevealed()) {
        if (!finished) video.pause();
        return;
      }
      if (!loaded) {
        loaded = true;
        video.addEventListener("ended", holdLastFrame, { once: true });
        video.addEventListener("loadeddata", playNow, { once: true });
        video.src = VIDEO_SRC;
        return;
      }
      if (!finished) playNow();
    };

    const setArmed = (armed: boolean) => {
      footer.classList.toggle("is-armed", armed);
      const coverBottom = cover?.getBoundingClientRect().bottom ?? Infinity;
      document.body.classList.toggle("footer-revealed", coverBottom < 96);
      syncVideo(armed);
    };

    const onScroll = () => {
      setArmed(footer.getBoundingClientRect().top < window.innerHeight * 2);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
      },
      { root: null, rootMargin: "0px 0px 100% 0px", threshold: 0 }
    );
    observer.observe(footer);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.body.classList.remove("footer-revealed");
      footer.classList.remove("is-armed");
      video?.pause();
    };
  }, []);

  return (
    <footer ref={footerRef} className="site-footer" aria-label="Pie de página">
      <video
        ref={videoRef}
        className="site-footer__video"
        muted
        playsInline
        preload="none"
        aria-hidden
      />
      <div className="site-footer__vignette" aria-hidden />
      <div className="site-footer__veil" aria-hidden />

      <div className="site-footer__content">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-2">
          <h2 className="m-0 max-w-[18ch] font-display text-[clamp(2.25rem,7vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.035em] text-white">
            Tu carrera, con datos.
          </h2>
          <div className="liquid-glass pill">
            <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-5 sm:pl-6">
              <span className="hidden sm:inline text-sm text-white/70 pr-2">
                Próxima convocatoria
              </span>
              <Link
                href="/cursos"
                className="inline-flex items-center justify-center rounded-full bg-[#0b0b12]/80 border border-white/15 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-[#0b0b12] active:scale-[0.98] transition-colors"
              >
                Ver cursos
              </Link>
            </div>
          </div>
        </div>

        <div className="liquid-glass dense mt-8 w-full max-w-[88rem] mx-auto">
          <div className="px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
              <div className="col-span-2 lg:col-span-4">
                <div className="liquid-glass light logo mb-4 inline-flex w-fit items-center">
                  <Image
                    src={LOGO_URL}
                    alt="ProgramBI"
                    width={160}
                    height={45}
                    className="h-8 w-auto"
                    unoptimized
                  />
                </div>
                <p className="m-0 text-sm leading-relaxed text-white/65 max-w-[34ch]">
                  Capacitaciones en Power BI, SQL, Python y análisis de datos. Casos reales, para el trabajo de verdad.
                </p>
                <div className="flex gap-2 mt-5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/16 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="m-0 mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  Cursos
                </h3>
                <ul className="space-y-2.5 list-none p-0 m-0">
                  {topCourses.map((course) => (
                    <li key={course.slug}>
                      <Link
                        href={`/cursos/${course.slug}`}
                        className="text-sm text-white/75 hover:text-white transition-colors no-underline"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <h3 className="m-0 mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  Empresa
                </h3>
                <ul className="space-y-2.5 list-none p-0 m-0">
                  {companyLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/75 hover:text-white transition-colors no-underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 lg:col-span-3">
                <h3 className="m-0 mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  Contacto
                </h3>
                <ul className="space-y-3 list-none p-0 m-0">
                  <li>
                    <a
                      href="mailto:contacto@programbi.cl"
                      className="flex items-start gap-2.5 text-sm text-white/75 hover:text-white transition-colors no-underline"
                    >
                      <Mail size={15} className="flex-shrink-0 mt-0.5 opacity-70" />
                      contacto@programbi.cl
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+56935409699"
                      className="flex items-start gap-2.5 text-sm text-white/75 hover:text-white transition-colors no-underline"
                    >
                      <Phone size={15} className="flex-shrink-0 mt-0.5 opacity-70" />
                      +56 9 3540 9699
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-2.5 text-sm text-white/75">
                      <MapPin size={15} className="flex-shrink-0 mt-0.5 opacity-70" />
                      <span>
                        Alonso de Córdova 5870, Ofc. 724
                        <br />
                        Las Condes, Santiago, Chile
                      </span>
                    </div>
                  </li>
                </ul>
                <a
                  href="https://wa.me/56935409699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/16 active:scale-[0.98] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/10">
              <p className="m-0 text-xs text-white/45">
                © {new Date().getFullYear()} ProgramBI. Hecho en Chile.
              </p>
              <div className="flex gap-5 text-xs text-white/45">
                <Link href="/privacidad" className="hover:text-white/80 transition-colors no-underline">
                  Privacidad
                </Link>
                <Link href="/terminos" className="hover:text-white/80 transition-colors no-underline">
                  Términos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
