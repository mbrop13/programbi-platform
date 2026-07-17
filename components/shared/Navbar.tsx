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
import { useCountry } from "@/lib/context/CountryContext";

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cursos", label: "Cursos", hasMega: true },
  { href: "/empresas", label: "Empresas" },
  { href: "/webinar", label: "Webinar" },
  { href: "/blog", label: "Blog" },
  // { href: "/comunidad", label: "Comunidad" },
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
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, tab: "login" | "register" }>({ isOpen: false, tab: "login" });
  const [profileModal, setProfileModal] = useState<{ isOpen: boolean, tab: "profile" | "settings" }>({ isOpen: false, tab: "profile" });
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const supabase = createClient();
  const pathname = usePathname();
  const isNewsletter = pathname?.startsWith("/newsletter");
  const { country, setCountryByIso, countries } = useCountry();

  // Close country dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Newsletter categories
  const [nlCategories, setNlCategories] = useState<any[]>([]);
  const [nlActiveCategory, setNlActiveCategory] = useState("all");

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
        animate={{ y: isHidden ? "-100%" : "0%" }}
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

            {/* Country Selector — solo bandera al lado del logo */}
            <div className="relative flex items-center" ref={countryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                aria-label={`País: ${country.name}. Cambiar país`}
                aria-expanded={isCountryOpen}
                title={country.name}
                className="flex items-center justify-center p-0 m-0 bg-transparent border-0 shadow-none outline-none cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:ring-offset-1"
              >
                <img
                  src={country.flagUrl.replace("/w40/", "/w80/")}
                  alt=""
                  className={`w-8 h-auto sm:w-9 lg:w-10 object-contain transition-transform duration-150 hover:scale-105 ${
                    isCountryOpen ? "scale-105" : ""
                  }`}
                  draggable={false}
                />
              </button>

              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[100]"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Seleccionar país
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {countries.map((c) => (
                        <button
                          key={c.iso}
                          type="button"
                          onClick={() => {
                            setCountryByIso(c.iso);
                            setIsCountryOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2.5 transition-colors border-none cursor-pointer ${
                            c.iso === country.iso
                              ? "bg-blue-50 text-blue-700 font-semibold"
                              : "bg-transparent text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <img
                            src={c.flagUrl.replace("/w40/", "/w80/")}
                            alt=""
                            className="w-6 h-auto flex-shrink-0 object-contain"
                            draggable={false}
                          />
                          <span className="flex-1">{c.name}</span>
                          <span className="text-[11px] text-slate-400">{c.currency.code}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                          href="/comunidad/mis-cursos"
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

          <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-gray-800 bg-transparent border-none cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors ml-auto">
            <Menu size={26} />
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={() => setIsMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] z-[10000] bg-white flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Image src={LOGO_URL} alt="ProgramBI" width={140} height={40} className="h-8 w-auto" unoptimized />
                <button onClick={() => setIsMobileOpen(false)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 border-none cursor-pointer hover:bg-gray-100">
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Sidebar Country Selector removed as it's now in the header */}

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
                          <button
                             onClick={() => { setIsMobileOpen(false); setProfileModal({ isOpen: true, tab: "profile" }); }}
                             className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 text-slate-500 bg-transparent cursor-pointer font-sans"
                          >
                             <UserCircle size={20} />
                             <span className="text-[10px] font-bold uppercase">Perfil</span>
                          </button>
                         {isAdmin && (
                           <Link href="/comunidad/admin" onClick={() => setIsMobileOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 no-underline col-span-2">
                              <ShieldAlert size={20} />
                              <span className="text-[10px] font-bold uppercase">Panel Admin</span>
                           </Link>
                         )}
                      </div>
                   </div>
                )}
              
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link href={link.href} onClick={() => setIsMobileOpen(false)} className="block py-4 px-4 text-lg font-bold text-gray-800 hover:text-[#1890FF] hover:bg-blue-50 rounded-xl transition-all no-underline">
                      {link.label}
                    </Link>
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

      <div className={isNewsletter ? "h-[88px] lg:h-[104px]" : "h-16 lg:h-20"} />
    </>
  );
}
