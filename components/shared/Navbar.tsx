"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Settings,
  LifeBuoy,
  ShieldAlert,
} from "lucide-react";
import { getGroupedCourses } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";
import SupportModal from "./SupportModal";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { getNewsletterCategories } from "@/lib/supabase/comunidad-ai";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";

const navLinks = [
  { href: "/cursos", label: "Ver Cursos", hasMega: true },
  { href: "/empresas", label: "Empresas" },
  { href: "/empleos", label: "Empleos" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/blog", label: "Blog" },
];

const courseGroups = getGroupedCourses();

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(true);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; tab: "login" | "register"; redirectUrl?: string }>({
    isOpen: false,
    tab: "login",
  });
  const [profileModal, setProfileModal] = useState<{ isOpen: boolean; tab: "profile" | "settings" }>({
    isOpen: false,
    tab: "profile",
  });
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();
  const pathname = usePathname();
  const isNewsletter = pathname?.startsWith("/newsletter");

  const [nlCategories, setNlCategories] = useState<any[]>([]);
  const [nlActiveCategory, setNlActiveCategory] = useState("all");

  const keepVisible =
    isMobileOpen || authModal.isOpen || profileModal.isOpen || isSupportModalOpen;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);

      if (keepVisible) {
        setIsHidden(false);
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (y < 16) {
        setIsHidden(false);
      } else if (delta > 8) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [keepVisible]);

  useEffect(() => {
    if (!isHidden) return;
    setIsMegaOpen(false);
    setIsUserMenuOpen(false);
  }, [isHidden]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        isCurrentUserAdmin()
          .then((admin) => setIsAdmin(admin))
          .catch(() => {});
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        isCurrentUserAdmin()
          .then((admin) => setIsAdmin(admin))
          .catch(() => {});
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (!isNewsletter) return;
    getNewsletterCategories()
      .then((cats) => setNlCategories(cats))
      .catch(() => {});
  }, [isNewsletter]);

  useEffect(() => {
    const handleOpen = () => {
      if (!user) setAuthModal({ isOpen: true, tab: "register" });
    };
    const handleOpenAuth = (e?: Event) => {
      if (!user) {
        const customEvent = e as CustomEvent<{ tab?: "login" | "register"; redirectUrl?: string }>;
        const tab = customEvent?.detail?.tab || "register";
        setAuthModal({ isOpen: true, tab, redirectUrl: customEvent?.detail?.redirectUrl });
      }
    };
    window.addEventListener("open-nl-subscribe", handleOpen);
    window.addEventListener("open-nl-subscribe-auth", handleOpen);
    window.addEventListener("open-auth-modal", handleOpenAuth);

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
    if (!isMobileOpen) setIsMobileCoursesOpen(true);
  }, [isMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen || authModal.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, authModal.isOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

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
    await supabase.auth.signOut({ scope: "global" });
    window.location.replace("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        defaultTab={authModal.tab}
        redirectUrl={authModal.redirectUrl}
      />
      <ProfileSettingsModal
        isOpen={profileModal.isOpen}
        onClose={() => setProfileModal((prev) => ({ ...prev, isOpen: false }))}
        defaultTab={profileModal.tab}
      />
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} userEmail={user?.email || ""} />

      <header
        className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled || isMobileOpen
            ? "border-b border-line bg-canvas/85 shadow-xs backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="relative z-10 h-8 w-[150px] shrink-0" aria-label="ProgramBI">
            <Image
              src="/images/logo.png"
              alt="ProgramBI"
              fill
              sizes="150px"
              className="object-contain object-left"
              priority
            />
          </Link>

          <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 text-[14.5px] font-medium text-mute lg:flex" aria-label="Principal">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  <Link href={link.href} className="inline-flex items-center gap-1 transition-colors hover:text-ink no-underline">
                    {link.label}
                    <ChevronDown size={14} className={isMegaOpen ? "rotate-180" : ""} />
                  </Link>

                  <AnimatePresence>
                    {isMegaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-[calc(100%+14px)] left-1/2 w-[680px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_25px_80px_rgba(23,23,22,0.10)]"
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                      >
                        <div className="grid grid-cols-3 gap-6 px-5 py-5">
                          {courseGroups.map((group) => (
                            <div key={group.id}>
                              <p className="text-xs font-semibold text-mute">{group.label}</p>
                              <ul className="mt-2">
                                {group.items.map((course) => (
                                  <li key={course.slug}>
                                    <Link
                                      href={`/cursos/${course.slug}`}
                                      onClick={() => setIsMegaOpen(false)}
                                      className="flex items-center gap-2.5 rounded-md px-1.5 py-2 no-underline transition-colors hover:bg-wash"
                                    >
                                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-wash">
                                        <Image
                                          src={course.imageUrl}
                                          alt=""
                                          fill
                                          sizes="56px"
                                          className="object-cover"
                                        />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold leading-tight text-ink">
                                          {course.title}
                                        </span>
                                        <span className="block text-[11px] tabular-nums text-faint">
                                          {course.durationHours} h
                                        </span>
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-line px-5 py-3">
                          <Link
                            href="/cursos"
                            onClick={() => setIsMegaOpen(false)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
                          >
                            Ver todos los cursos <ArrowRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-ink no-underline">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="relative z-10 ml-auto flex items-center justify-end gap-5 lg:min-w-[17.5rem]">
            {loading ? (
              <div className="hidden h-10 w-28 rounded-full bg-surface sm:block" />
            ) : user ? (
              <div className="relative hidden sm:block" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-2 pr-3 text-sm font-semibold text-ink"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas">
                    {getInitials(user.user_metadata?.full_name || user.email)}
                  </span>
                  <span className="max-w-[90px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Cuenta"}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-[calc(100%+8px)] w-[240px] overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_16px_40px_rgba(23,23,22,0.08)]"
                    >
                      <div className="border-b border-line px-4 py-3">
                        <p className="truncate text-xs text-mute">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/comunidad/cursos"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink no-underline hover:bg-surface"
                        >
                          <LayoutDashboard className="h-4 w-4 text-mute" />
                          Comunidad
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setProfileModal({ isOpen: true, tab: "profile" });
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                        >
                          <UserCircle className="h-4 w-4 text-mute" />
                          Ver perfil
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setProfileModal({ isOpen: true, tab: "settings" });
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                        >
                          <Settings className="h-4 w-4 text-mute" />
                          Ajustes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsSupportModalOpen(true);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                        >
                          <LifeBuoy className="h-4 w-4 text-mute" />
                          Soporte
                        </button>
                        {isAdmin && (
                          <Link
                            href="/comunidad/admin"
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink no-underline hover:bg-surface"
                          >
                            <ShieldAlert className="h-4 w-4 text-mute" />
                            Panel Admin
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                        >
                          <LogOut className="h-4 w-4 text-mute" />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModal({ isOpen: true, tab: "login" })}
                className="hidden h-10 items-center px-1 text-[14.5px] font-medium text-mute transition-colors hover:text-ink sm:inline-flex"
              >
                Iniciar sesión
              </button>
            )}

            {!user && !loading ? (
              <button
                type="button"
                onClick={() => setAuthModal({ isOpen: true, tab: "register" })}
                className="hidden h-10 items-center rounded-full bg-ink px-6 text-[14.5px] font-semibold text-canvas transition-transform active:scale-95 sm:inline-flex"
              >
                Registrarse
              </button>
            ) : null}

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink lg:hidden"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isNewsletter && (
          <div className="border-t border-line bg-canvas">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                <button
                  type="button"
                  onClick={() => {
                    setNlActiveCategory("all");
                    window.dispatchEvent(new CustomEvent("nl-category", { detail: "all" }));
                  }}
                  className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap ${
                    nlActiveCategory === "all" ? "text-ink" : "text-faint"
                  }`}
                >
                  TODOS
                </button>
                {nlCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setNlActiveCategory(cat.slug);
                      window.dispatchEvent(new CustomEvent("nl-category", { detail: cat.slug }));
                    }}
                    className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap ${
                      nlActiveCategory === cat.slug ? "text-ink" : "text-faint"
                    }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobileOpen ? (
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-b border-line bg-canvas px-4 py-5 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Móvil">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div key={link.href} className="border-b border-line py-1">
                    <button
                      type="button"
                      onClick={() => setIsMobileCoursesOpen((v) => !v)}
                      aria-expanded={isMobileCoursesOpen}
                      className="flex w-full items-center justify-between py-3 text-left"
                    >
                      <span className="text-lg font-medium text-ink">Cursos</span>
                      <ChevronDown
                        size={18}
                        className={`text-mute transition-transform ${isMobileCoursesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isMobileCoursesOpen ? (
                      <div className="pb-3">
                        {courseGroups.map((group) => (
                          <div key={group.id} className="mt-3 first:mt-0">
                            <p className="px-1 text-xs font-semibold text-faint">{group.label}</p>
                            <ul className="mt-1">
                              {group.items.map((course) => (
                                <li key={course.slug}>
                                  <Link
                                    href={`/cursos/${course.slug}`}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex items-baseline justify-between gap-3 rounded-md px-1 py-2.5 no-underline"
                                  >
                                    <span className="text-[15px] font-medium text-ink">{course.title}</span>
                                    <span className="shrink-0 text-xs tabular-nums text-faint">
                                      {course.durationHours} h
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href="/cursos"
                          onClick={() => setIsMobileOpen(false)}
                          className="mt-2 inline-flex items-center gap-1.5 px-1 py-2 text-sm font-semibold text-ink no-underline"
                        >
                          Ver todos los cursos <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="border-b border-line py-3 text-lg font-medium text-ink no-underline"
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="flex flex-col gap-1 pt-4">
                {user ? (
                  <>
                    <Link
                      href="/comunidad/cursos"
                      onClick={() => setIsMobileOpen(false)}
                      className="py-3 text-lg font-medium text-ink no-underline"
                    >
                      Campus
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setProfileModal({ isOpen: true, tab: "profile" });
                      }}
                      className="py-3 text-left text-lg font-medium text-ink"
                    >
                      Perfil
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="py-3 text-left text-lg font-medium text-ink"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      setAuthModal({ isOpen: true, tab: "login" });
                    }}
                    className="py-3 text-left text-lg font-medium text-ink"
                  >
                    Iniciar sesión
                  </button>
                )}

                {!user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      setAuthModal({ isOpen: true, tab: "register" });
                    }}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-[14.5px] font-semibold text-canvas"
                  >
                    Registrarse
                  </button>
                ) : null}
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <div className={isNewsletter ? "h-[112px]" : "h-[72px]"} />
    </>
  );
}
