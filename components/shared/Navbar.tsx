"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, UserPlus, ArrowRight, Clock, Users, Sparkles, BookOpen, LogOut, LayoutDashboard, UserCircle, Settings } from "lucide-react";
import * as LucideIcons from "lucide-react";
import React from "react";
import { courses } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";

import AuthModal from "./AuthModal";

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cursos", label: "Cursos", hasMega: true },
  { href: "/consultorias", label: "Consultorías" },
  { href: "/contacto", label: "Contacto" },
  { href: "/comunidad", label: "Comunidad" },
];

const featuredSlugs = ["analisis-de-datos", "power-automate", "analitica-mineria"];

function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, tab: "login" | "register" }>({ isOpen: false, tab: "login" });
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const supabase = createClient();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    setIsScrolled(latest > 20);

    // Hide on scroll down, show on scroll up (only after 100px)
    if (latest > 100) {
      if (diff > 5) {
        setIsHidden(true);
        setIsMegaOpen(false);
        setIsUserMenuOpen(false);
      } else if (diff < -5) {
        setIsHidden(false);
      }
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

  useEffect(() => {
    // Get initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    checkUser();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (isMobileOpen || authModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen, authModal.isOpen]);

  const handleMegaEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setIsMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setIsMegaOpen(false), 150);
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimeout.current) clearTimeout(userMenuTimeout.current);
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setIsUserMenuOpen(false), 150);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const featured = courses.filter((c) => featuredSlugs.includes(c.slug));
  const otherCourses = courses.filter((c) => !featuredSlugs.includes(c.slug));

  return (
    <>
      <AuthModal isOpen={authModal.isOpen} onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))} defaultTab={authModal.tab} />
      
      <motion.nav
        animate={{ y: isHidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.04)] py-2"
            : "bg-white/60 backdrop-blur-lg py-3 lg:py-4"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-8 lg:px-12 xl:px-16 flex items-center justify-between xl:justify-start gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 no-underline group flex-shrink-0">
            <Image
              src={LOGO_URL}
              alt="ProgramBI"
              width={180}
              height={48}
              className="h-9 lg:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              unoptimized
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#334155] font-semibold text-[15px] hover:text-[#1890FF] transition-all no-underline relative group"
                  >
                    {link.label}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 group-hover:text-[#1890FF] ${isMegaOpen ? "rotate-180 text-[#1890FF]" : "text-gray-400"}`}
                    />

                  </Link>

                  <AnimatePresence>
                    {isMegaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[880px] bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.02)]"
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                      >
                        <div className="grid grid-cols-[1.4fr_1fr]">
                          <div className="p-7 relative overflow-hidden bg-slate-900 text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-5 relative z-10">
                              <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-[#1890FF]" />
                                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                  Rutas Especializadas
                                </h3>
                              </div>
                            </div>
                            <div className="space-y-3 relative z-10">
                              {featured.map((course) => (
                                <Link
                                  key={course.slug}
                                  href={`/cursos/${course.slug}`}
                                  onClick={() => setIsMegaOpen(false)}
                                  className="group/item flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#1890FF]/30 transition-all no-underline relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#1890FF]/0 via-[#1890FF]/0 to-[#1890FF]/5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative shadow-lg shadow-black/20">
                                    <Image
                                      src={course.imageUrl}
                                      alt={course.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                                      unoptimized
                                    />
                                    <div className="absolute inset-0 border border-white/10 rounded-xl" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[15px] text-white transition-colors truncate mb-1">{course.title}</h4>
                                    <p className="text-[12px] text-slate-400 line-clamp-1 mb-2">{course.shortDescription}</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                      {course.techStack.slice(0, 3).map((t) => (
                                        <span key={t} className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[9px] text-slate-300 border border-slate-700">{t}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1890FF] group-hover/item:text-white transition-all text-slate-400">
                                     <ArrowRight size={14} className="group-hover/item:translate-x-0.5 transition-transform" />
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="p-7 bg-[#F8FAFC]">
                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                <BookOpen size={12} /> Catálogo Completo
                            </p>
                            <div className="grid grid-cols-1 gap-1">
                              {otherCourses.map((course) => (
                                <Link
                                  key={course.slug}
                                  href={`/cursos/${course.slug}`}
                                  onClick={() => setIsMegaOpen(false)}
                                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all no-underline group/sm border border-transparent hover:border-slate-100"
                                >
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                    style={{ backgroundColor: `${course.accentColor}12`, color: course.accentColor }}
                                  >
                                    <CourseIcon name={course.icon} className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0 pt-0.5">
                                    <span className="text-[14px] text-slate-700 group-hover/sm:text-[#1890FF] font-bold transition-colors block truncate mb-0.5">{course.title}</span>
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                      <Clock size={10} className="text-slate-300"/> {course.durationHours} hrs &nbsp;•&nbsp; {course.level}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-5 pt-5 border-t border-slate-200">
                              <Link
                                href="/cursos"
                                onClick={() => setIsMegaOpen(false)}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[13px] hover:border-[#1890FF] hover:text-[#1890FF] hover:shadow-md transition-all no-underline group/btn"
                              >
                                Ver todos los cursos <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-[#334155] font-semibold text-[15px] hover:text-[#1890FF] transition-colors no-underline"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Premium Auth / User Section */}
          <div className="hidden lg:flex items-center gap-4 ml-auto lg:ml-0">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="relative" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                <button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1890FF] transition-all cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                    {getInitials(user.user_metadata?.full_name || user.email)}
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-slate-800 leading-none mb-1 truncate max-w-[100px]">
                      {user.user_metadata?.full_name?.split(" ")[0] || "Usuario"}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 leading-none">Mi Cuenta</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conectado como</p>
                        <p className="text-[13px] font-semibold text-slate-700 truncate">{user.email}</p>
                      </div>
                      
                      <Link href="/comunidad/mis-cursos" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-[#1890FF] no-underline transition-colors">
                        <LayoutDashboard size={16} /> Comunidad
                      </Link>
                      <Link href="/comunidad/perfil" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-[#1890FF] no-underline transition-colors">
                        <UserCircle size={16} /> Ver Perfil
                      </Link>
                      <Link href="/comunidad/perfil" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-[#1890FF] no-underline transition-colors">
                        <Settings size={16} /> Configuración
                      </Link>
                      
                      <div className="mt-1 pt-1 border-t border-gray-50 px-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border-none cursor-pointer text-left"
                        >
                          <LogOut size={16} /> Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal({ isOpen: true, tab: "login" })}
                  className="flex items-center gap-2 group text-slate-500 font-semibold text-[14px] hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Iniciar Sesión
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <LogIn size={13} className="text-slate-600" />
                  </span>
                </button>
                <div className="w-[1px] h-6 bg-slate-200"></div>
                <button
                  onClick={() => setAuthModal({ isOpen: true, tab: "register" })}
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[14px] no-underline transition-all hover:scale-105 cursor-pointer bg-[#1890FF] shadow-lg shadow-blue-500/20 group overflow-hidden border-none"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-shimmer" />
                  <span>Regístrate</span>
                  <UserPlus size={15} className="ml-1 opacity-80" />
                </button>
              </>
            )}
          </div>

          <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-gray-800 bg-transparent border-none cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors ml-auto">
            <Menu size={26} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setIsMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] z-[10000] bg-white flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Image src={LOGO_URL} alt="ProgramBI" width={140} height={40} className="h-8 w-auto" unoptimized />
                <button onClick={() => setIsMobileOpen(false)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 border-none cursor-pointer hover:bg-gray-100">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-5 space-y-1">
                {user && (
                   <div className="mb-6 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-[#1890FF] flex items-center justify-center text-white font-bold text-lg">
                            {getInitials(user.user_metadata?.full_name || user.email)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 leading-tight">{user.user_metadata?.full_name || "Estudiante"}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[180px]">{user.email}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <Link href="/comunidad/mis-cursos" onClick={() => setIsMobileOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 text-[#1890FF] no-underline">
                            <LayoutDashboard size={20} />
                            <span className="text-[10px] font-bold uppercase">Comunidad</span>
                         </Link>
                         <Link href="/comunidad/perfil" onClick={() => setIsMobileOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 text-slate-500 no-underline">
                            <UserCircle size={20} />
                            <span className="text-[10px] font-bold uppercase">Perfil</span>
                         </Link>
                      </div>
                   </div>
                )}
              
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link href={link.href} onClick={() => setIsMobileOpen(false)} className="block py-4 px-4 text-lg font-bold text-gray-800 hover:text-[#1890FF] hover:bg-blue-50 rounded-xl transition-all no-underline">
                      {link.label}
                    </Link>
                    {link.hasMega && (
                      <div className="pl-6 space-y-0.5 mb-2 mt-2">
                        {courses.slice(0, 6).map((c) => (
                          <Link key={c.slug} href={`/cursos/${c.slug}`} onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-semibold text-gray-500 hover:text-slate-900 hover:bg-slate-50 no-underline transition-colors">
                            <CourseIcon name={c.icon} className="w-4 h-4 text-slate-400" />
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="p-5 space-y-3 border-t border-gray-100 bg-slate-50">
                {user ? (
                   <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-red-500 font-bold text-base no-underline bg-red-50 hover:bg-red-100 border-none cursor-pointer shadow-sm">
                      <LogOut size={18} /> Cerrar Sesión
                   </button>
                ) : (
                   <>
                    <button onClick={() => { setIsMobileOpen(false); setAuthModal({ isOpen: true, tab: "register" }); }} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-base no-underline bg-[#1890FF] hover:bg-[#1177d1] border-none cursor-pointer shadow-lg shadow-blue-500/20">
                      <Sparkles size={18} className="text-white"/> Regístrate
                    </button>
                    <button onClick={() => { setIsMobileOpen(false); setAuthModal({ isOpen: true, tab: "login" }); }} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-slate-700 font-bold text-base no-underline border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <LogIn size={18} className="text-slate-400" /> Iniciar Sesión
                    </button>
                   </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 lg:h-20" />
    </>
  );
}
