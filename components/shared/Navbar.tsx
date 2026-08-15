"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, UserPlus, ArrowRight, Clock, Users, Sparkles, BookOpen, LogOut, LayoutDashboard, UserCircle, Settings, LifeBuoy, ShieldAlert } from "lucide-react";
import * as LucideIcons from "lucide-react";
import React from "react";
import { courses } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";
import SupportModal from "./SupportModal";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { getNewsletterCategories } from "@/lib/supabase/comunidad-ai";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cursos", label: "Cursos", hasMega: true },
  { href: "/empresas", label: "Empresas" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/blog", label: "Blog" },
  // Webinar oculto temporalmente
  // { href: "/webinar", label: "Webinar" },
];

const featuredSlugs = ["analisis-de-datos", "power-bi", "sql-server"];

function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, tab: "login" | "register" }>({ isOpen: false, tab: "login" });
  const [profileModal, setProfileModal] = useState<{ isOpen: boolean, tab: "profile" | "settings" }>({ isOpen: false, tab: "profile" });
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const isMobileOpenRef = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();
  const isNewsletter = pathname?.startsWith("/newsletter");

  // Newsletter categories
  const [nlCategories, setNlCategories] = useState<any[]>([]);
  const [nlActiveCategory, setNlActiveCategory] = useState("all");

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    setIsScrolled(latest > 20);

    // Hide on scroll down, show on scroll up (only after 100px)
    if (latest > 100) {
      if (diff > 5 && !isMobileOpenRef.current) {
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
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        isCurrentUserAdmin().then(admin => setIsAdmin(admin)).catch(() => {});
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    
    checkUser();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        isCurrentUserAdmin().then(admin => setIsAdmin(admin)).catch(() => {});
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);



  // Load newsletter categories when on newsletter page
  useEffect(() => {
    if (!isNewsletter) return;
    getNewsletterCategories().then(cats => setNlCategories(cats)).catch(() => {});
  }, [isNewsletter]);

  // Listen for open-subscribe and open-auth-modal events from any page
  useEffect(() => {
    const handleOpen = () => {
      if (!user) {
        setAuthModal({ isOpen: true, tab: "register" });
      }
    };
    const handleOpenAuth = (e?: Event) => {
      if (!user) {
        const customEvent = e as CustomEvent<{ tab?: "login" | "register" }>;
        const tab = customEvent?.detail?.tab || "register";
        setAuthModal({ isOpen: true, tab });
      }
    };
    window.addEventListener("open-nl-subscribe", handleOpen);
    window.addEventListener("open-nl-subscribe-auth", handleOpen);
    window.addEventListener("open-auth-modal", handleOpenAuth);

    // Auto-open modal if URL query parameter contains ?auth=register or ?auth=login
    if (typeof window !== "undefined" && !user) {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (authParam === "register" || authParam === "login") {
        setAuthModal({ isOpen: true, tab: authParam });
      }
    }

    return () => {
      window.removeEventListener("open-nl-subscribe", handleOpen);
      window.removeEventListener("open-nl-subscribe-auth", handleOpen);
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };
  }, [user]);

  useEffect(() => {
    isMobileOpenRef.current = isMobileOpen;
    if (!isMobileOpen) setIsMobileCoursesOpen(false);
  }, [isMobileOpen]);

  useEffect(() => {
    if (isMobileOpen || authModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen, authModal.isOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const toggleMobileMenu = () => {
    setIsHidden(false);
    setIsMobileOpen((open) => !open);
  };

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
    // A-08 (OWASP ASVS L3): revoke ALL sessions for the user (not just the
    // current device), then redirect with replace() to avoid serving cached
    // authenticated content from the browser.
    await supabase.auth.signOut({ scope: "global" });
    window.location.replace("/");
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
      <ProfileSettingsModal isOpen={profileModal.isOpen} onClose={() => setProfileModal(prev => ({ ...prev, isOpen: false }))} defaultTab={profileModal.tab} />
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} userEmail={user?.email || ""} />
      
      <motion.nav
        animate={{ y: isHidden && !isMobileOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.04)] py-2"
            : "bg-white/60 backdrop-blur-lg py-3 lg:py-4"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-5 lg:px-12 xl:px-16 flex items-center justify-between xl:justify-start gap-4 lg:gap-8">
          <div className="flex items-center gap-2.5 lg:gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 no-underline group flex-shrink-0">
              <Image
                src={LOGO_URL}
                alt="ProgramBI"
                width={180}
                height={48}
                className="h-8 lg:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                unoptimized
                priority
              />
            </Link>
          </div>

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
                        <div className="p-8 bg-white relative">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-50 -mt-20 -mr-20 pointer-events-none" />
                          <div className="grid grid-cols-2 gap-4 relative z-10">
                            {courses.map((course) => (
                              <Link
                                key={course.slug}
                                href={`/cursos/${course.slug}`}
                                onClick={() => setIsMegaOpen(false)}
                                className="group/item flex gap-4 p-3 rounded-2xl hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/40 transition-all no-underline border border-transparent hover:border-slate-100/60 items-center relative overflow-hidden bg-white"
                              >
                                <div className="w-28 aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0 relative bg-slate-50 border border-slate-100/80 shadow-sm">
                                  <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover/item:scale-[1.03]"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-[14px] text-slate-900 group-hover/item:text-[#1890FF] transition-colors truncate mb-0.5">{course.title}</h4>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{course.shortDescription}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1890FF] group-hover/item:border-[#1890FF] group-hover/item:text-white transition-all text-slate-400 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0">
                                   <ArrowRight size={14} />
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="flex justify-center items-center mt-6 pt-5 border-t border-slate-100 relative z-10">
                            <Link
                              href="/cursos"
                              onClick={() => setIsMegaOpen(false)}
                              className="text-xs font-bold text-[#1890FF] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-all duration-300 no-underline flex items-center gap-1.5 shadow-sm hover:shadow"
                            >
                              Explorar todo el catálogo <ArrowRight size={12} />
                            </Link>
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
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-[calc(100%+8px)] right-0 w-[260px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-100/80 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {getInitials(user.user_metadata?.full_name || user.email)}
                        </div>
                        <span className="text-[13px] font-normal text-neutral-600 truncate min-w-0 flex-1">
                          {user.email}
                        </span>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/comunidad/cursos"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-slate-900 transition-colors font-medium no-underline"
                        >
                          <LayoutDashboard className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span>Comunidad</span>
                        </Link>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setProfileModal({ isOpen: true, tab: "profile" }); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-slate-900 transition-colors font-medium border-0 bg-transparent cursor-pointer text-left"
                        >
                          <UserCircle className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span>Ver perfil</span>
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setProfileModal({ isOpen: true, tab: "settings" }); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-slate-900 transition-colors font-medium border-0 bg-transparent cursor-pointer text-left"
                        >
                          <Settings className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span>Ajustes</span>
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setIsSupportModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-slate-900 transition-colors font-medium border-0 bg-transparent cursor-pointer text-left"
                        >
                          <LifeBuoy className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span>Soporte</span>
                        </button>

                        {isAdmin && (
                          <>
                            <div className="my-1 h-px bg-neutral-100" />
                            <Link
                              href="/comunidad/admin"
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-amber-600 hover:bg-amber-50 transition-colors font-medium no-underline"
                            >
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span>Panel Admin</span>
                            </Link>
                          </>
                        )}

                        <div className="my-1 h-px bg-neutral-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium border-0 bg-transparent cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4 shrink-0 text-neutral-400" />
                          <span>Cerrar sesión</span>
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

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="lg:hidden ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border-none bg-neutral-900 text-white cursor-pointer active:scale-[0.96]"
          >
            {isMobileOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
          </button>
        </div>

        {/* Newsletter subnav — integrated into navbar only on /newsletter */}
        {isNewsletter && (
          <div className="border-t border-gray-200/60">
            <div className="max-w-[1300px] mx-auto px-8 lg:px-12 xl:px-16 flex items-center justify-between">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-[1px]">
                <button
                  onClick={() => { setNlActiveCategory("all"); window.dispatchEvent(new CustomEvent("nl-category", { detail: "all" })); }}
                  className={`px-4 lg:px-5 py-2.5 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap transition-all border-none cursor-pointer bg-transparent border-b-2 ${nlActiveCategory === "all" ? "border-b-black text-black" : "border-b-transparent text-gray-400 hover:text-gray-700"}`}
                >
                  TODOS
                </button>
                {nlCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setNlActiveCategory(cat.slug); window.dispatchEvent(new CustomEvent("nl-category", { detail: cat.slug })); }}
                    className={`px-4 lg:px-5 py-2.5 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap transition-all border-none cursor-pointer bg-transparent border-b-2 ${nlActiveCategory === cat.slug ? "border-b-black text-black" : "border-b-transparent text-gray-400 hover:text-gray-700"}`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>
              {user ? (
                <span className="hidden lg:block text-[10px] font-bold tracking-[0.12em] text-emerald-500 uppercase whitespace-nowrap">
                  ✓ Ya estás suscrito
                </span>
              ) : (
                <button
                  onClick={() => {
                    setAuthModal({ isOpen: true, tab: "register" });
                  }}
                  className="hidden lg:block text-[10px] font-bold tracking-[0.12em] text-gray-400 hover:text-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer transition-colors"
                >
                  Suscríbete al Newsletter
                </button>
              )}
            </div>
          </div>
        )}
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`lg:hidden fixed inset-0 z-[49] bg-black/25 ${isNewsletter ? "top-[88px]" : "top-16"}`}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:hidden fixed inset-x-0 bottom-0 z-[49] flex flex-col bg-white ${isNewsletter ? "top-[88px]" : "top-16"}`}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                {user && (
                  <div className="mb-3 flex items-center gap-3 rounded-2xl bg-neutral-50 px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                      {getInitials(user.user_metadata?.full_name || user.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {user.user_metadata?.full_name || "Estudiante"}
                      </p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <Link
                      href="/comunidad/cursos"
                      onClick={() => setIsMobileOpen(false)}
                      className="shrink-0 text-xs font-semibold text-neutral-900 no-underline"
                    >
                      Comunidad
                    </Link>
                  </div>
                )}

                <nav className="flex flex-col">
                  {navLinks.map((link) =>
                    link.hasMega ? (
                      <div key={link.href} className="border-b border-neutral-100">
                        <div className="flex items-center">
                          <Link
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="flex-1 py-3.5 text-[17px] font-semibold text-neutral-900 no-underline"
                          >
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setIsMobileCoursesOpen((v) => !v)}
                            aria-expanded={isMobileCoursesOpen}
                            aria-label={isMobileCoursesOpen ? "Ocultar cursos" : "Ver cursos"}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-none bg-transparent text-neutral-500 cursor-pointer"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-150 ${isMobileCoursesOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                        {isMobileCoursesOpen && (
                          <div className="pb-2">
                            {courses.map((course) => (
                              <Link
                                key={course.slug}
                                href={`/cursos/${course.slug}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center justify-between gap-3 py-2.5 pl-1 pr-1 text-[15px] text-neutral-600 no-underline active:text-neutral-900"
                              >
                                <span>{course.title}</span>
                                <ArrowRight size={14} className="shrink-0 text-neutral-300" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="border-b border-neutral-100 py-3.5 text-[17px] font-semibold text-neutral-900 no-underline"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </nav>
              </div>

              <div className="shrink-0 border-t border-neutral-100 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                {user ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setProfileModal({ isOpen: true, tab: "profile" });
                      }}
                      className="flex-1 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 cursor-pointer"
                    >
                      Perfil
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex-1 rounded-xl border-none bg-neutral-100 py-3 text-sm font-semibold text-neutral-800 cursor-pointer"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setAuthModal({ isOpen: true, tab: "login" });
                      }}
                      className="flex-1 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 cursor-pointer"
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setAuthModal({ isOpen: true, tab: "register" });
                      }}
                      className="flex-1 rounded-xl border-none bg-neutral-900 py-3 text-sm font-semibold text-white cursor-pointer"
                    >
                      Regístrate
                    </button>
                  </div>
                )}
                {isAdmin && (
                  <Link
                    href="/comunidad/admin"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-neutral-500 no-underline"
                  >
                    <ShieldAlert size={14} /> Panel admin
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={isNewsletter ? "h-[88px] lg:h-[104px]" : "h-16 lg:h-20"} />
    </>
  );
}
