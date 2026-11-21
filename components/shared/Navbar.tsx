"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
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
  Handshake,
} from "lucide-react";
import { NAV_COURSE_GROUPS } from "@/lib/data/course-nav";
import { trackNavRegistro } from "@/lib/analytics/marketing";
import { ISO_CHILE } from "@/config/paises";
import { etiquetaBoton } from "@/config/textos";
import { esRutaLocalizable, paisDesdeRuta, rutaLocal } from "@/lib/paises/rutas";
import { esRutaIndexablePais } from "@/lib/seo/indexabilidad";
import { COMUNIDAD_PUBLICA } from "@/lib/comunidad/visibilidad";
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });
const SupportModal = dynamic(() => import("./SupportModal"), { ssr: false });
const ProfileSettingsModal = dynamic(() => import("./ProfileSettingsModal"), { ssr: false });

const navLinks: Array<{
  href: string;
  label: string;
  hasMega?: boolean;
  hasRecursos?: boolean;
}> = [
  { href: "/cursos", label: "Ver Cursos", hasMega: true },
  { href: "/precios", label: "Precios" },
  { href: "/plantillas", label: "Recursos", hasRecursos: true },
  { href: "/empresas", label: "Empresas" },
  ...(COMUNIDAD_PUBLICA ? [{ href: "/comunidad", label: "Comunidad" }] : []),
  { href: "/guias", label: "Guías" },
];

const RECURSOS_LINKS = [
  {
    href: "/plantillas",
    label: "Plantillas Power BI y SQL",
    desc: "8 datasets, medidas DAX, SQL y Python gratis",
  },
  {
    href: "/simulador-pl-300",
    label: "Simulador PL-300",
    desc: "40 preguntas tipo examen Microsoft en español",
  },
  {
    href: "/herramientas/excel-a-dax",
    label: "Conversor Excel a DAX",
    desc: "Traduce 28 fórmulas de Excel a Power BI",
  },
  {
    href: "/sueldos-analista-datos-chile",
    label: "Sueldos analista de datos Chile",
    desc: "Benchmark salarial y calculadora Bruto ↔ Líquido",
  },
  {
    href: "/guias",
    label: "Guías prácticas",
    desc: "Roadmaps, comparativas y tutoriales paso a paso",
  },
  {
    href: "/datos",
    label: "Datos de Chile",
    desc: "Desempleo, carreras, capacitación e IPC de Chile",
  },
] as const;

const courseGroups = NAV_COURSE_GROUPS;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [isMobileRecursosOpen, setIsMobileRecursosOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isRecursosOpen, setIsRecursosOpen] = useState(false);
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

  const [user, setUser] = useState<{
    email?: string;
    user_metadata?: { full_name?: string };
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recursosTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const paisNav = paisDesdeRuta(pathname) ?? ISO_CHILE;
  const recursosLinks = RECURSOS_LINKS.filter((item) => paisNav === ISO_CHILE || item.href !== "/datos");
  const hrefLocal = (href: string) => rutaLocal(paisNav, href);
  const hrefNav = (href: string) => {
    if (paisNav === ISO_CHILE) return href;
    const base = href.split("?")[0]?.split("#")[0] || "/";
    if (!esRutaLocalizable(base)) return href;
    return esRutaIndexablePais(paisNav, base) ? hrefLocal(href) : href;
  };
  const isNewsletter = pathname?.startsWith("/blog");
  const isGuidesActive = Boolean(
    pathname && (pathname.startsWith("/guias") || /^\/[a-z]{2}\/guias(\/|$)/.test(pathname)),
  );

  const [nlCategories, setNlCategories] = useState<
    { id: string; slug: string; name: string }[]
  >([]);
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
    setIsRecursosOpen(false);
    setIsUserMenuOpen(false);
  }, [isHidden]);

  useEffect(() => {
    const root = document.documentElement;
    if (isHidden) root.dataset.navHidden = "true";
    else delete root.dataset.navHidden;
    return () => {
      delete root.dataset.navHidden;
    };
  }, [isHidden]);

  useEffect(() => {
    let unsub = () => {};
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          import("@/lib/supabase/comunidad")
            .then((m) => m.isCurrentUserAdmin())
            .then((admin) => setIsAdmin(admin))
            .catch(() => {});
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          import("@/lib/supabase/comunidad")
            .then((m) => m.isCurrentUserAdmin())
            .then((admin) => setIsAdmin(admin))
            .catch(() => {});
        } else {
          setIsAdmin(false);
        }
      });
      unsub = () => subscription.unsubscribe();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isNewsletter) return;
    import("@/lib/supabase/comunidad-ai")
      .then((m) => m.getNewsletterCategories())
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
    if (!isMobileOpen) {
      setIsMobileCoursesOpen(false);
      setIsMobileRecursosOpen(false);
    }
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

  const handleRecursosEnter = () => {
    if (recursosTimeout.current) clearTimeout(recursosTimeout.current);
    setIsRecursosOpen(true);
  };

  const handleRecursosLeave = () => {
    recursosTimeout.current = setTimeout(() => setIsRecursosOpen(false), 150);
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimeout.current) clearTimeout(userMenuTimeout.current);
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setIsUserMenuOpen(false), 150);
  };

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut({ scope: "global" });
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

  // El brochure se muestra como visor de documento a pantalla completa: sin navbar.
  const isBrochure = pathname?.endsWith("/brochure") ?? false;
  if (isBrochure) return null;

  return (
    <>
      {authModal.isOpen ? (
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
          defaultTab={authModal.tab}
          redirectUrl={authModal.redirectUrl}
        />
      ) : null}
      {profileModal.isOpen ? (
        <ProfileSettingsModal
          isOpen={profileModal.isOpen}
          onClose={() => setProfileModal((prev) => ({ ...prev, isOpen: false }))}
          defaultTab={profileModal.tab}
        />
      ) : null}
      {isSupportModalOpen ? (
        <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} userEmail={user?.email || ""} />
      ) : null}

      <header
        className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled || isMobileOpen
            ? "border-b border-border bg-bg/90 shadow-xs backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href={hrefLocal("/")} className="relative z-10 h-8 w-[150px] shrink-0" aria-label="ProgramBI">
            <Image
              src="/images/logo-nav.webp"
              alt="ProgramBI"
              width={150}
              height={32}
              sizes="150px"
              className="h-8 w-[150px] object-contain object-left"
            />
          </Link>

          <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 text-[14.5px] font-medium text-text-secondary lg:flex xl:gap-7" aria-label="Principal">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  <Link href={hrefNav(link.href)} className="inline-flex items-center gap-1 transition-colors hover:text-text-primary no-underline">
                    {link.label}
                    <ChevronDown size={14} className={isMegaOpen ? "rotate-180" : ""} />
                  </Link>

                  {isMegaOpen ? (
                      <div
                        className="absolute top-[calc(100%+14px)] left-1/2 w-[680px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-border bg-surface shadow-[0_25px_80px_rgba(17,24,39,0.10)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                      >
                        <div className="grid grid-cols-3 gap-6 px-5 py-5">
                          {courseGroups.map((group) => (
                            <div key={group.id}>
                              <p className="text-xs font-semibold text-text-secondary">{group.label}</p>
                              <ul className="mt-2">
                                {group.items.map((course) => (
                                  <li key={course.slug}>
                                    <Link
                                      href={hrefLocal(`/cursos/${course.slug}`)}
                                      onClick={() => setIsMegaOpen(false)}
                                      className="flex items-center gap-2.5 rounded-md px-1.5 py-2 no-underline transition-colors hover:bg-surface-hover"
                                    >
                                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface-hover">
                                        <Image
                                          src={course.imageUrl}
                                          alt={course.title}
                                          fill
                                          sizes="56px"
                                          className="object-cover"
                                        />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block line-clamp-2 text-sm font-semibold leading-tight text-text-primary">
                                          {course.title}
                                        </span>
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border px-5 py-3">
                          <Link
                            href={hrefLocal("/cursos")}
                            onClick={() => setIsMegaOpen(false)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary no-underline transition-colors hover:text-text-secondary"
                          >
                            Ver todos los cursos <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                  ) : null}
                </div>
              ) : link.hasRecursos ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleRecursosEnter}
                  onMouseLeave={handleRecursosLeave}
                >
                  <Link href={hrefNav(link.href)} className="inline-flex items-center gap-1 transition-colors hover:text-text-primary no-underline">
                    {link.label}
                    <ChevronDown size={14} className={isRecursosOpen ? "rotate-180" : ""} />
                  </Link>

                  {isRecursosOpen ? (
                    <div
                      className="absolute top-[calc(100%+14px)] left-1/2 w-[340px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-border bg-surface p-2.5 shadow-[0_25px_80px_rgba(17,24,39,0.10)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                      onMouseEnter={handleRecursosEnter}
                      onMouseLeave={handleRecursosLeave}
                    >
                      <ul className="space-y-0.5">
                        {recursosLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={hrefNav(item.href)}
                              onClick={() => setIsRecursosOpen(false)}
                              className="block rounded-xl px-3 py-2.5 no-underline transition-colors hover:bg-surface-hover"
                            >
                              <span className="block text-sm font-semibold leading-tight text-text-primary">
                                {item.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-text-secondary">
                                {item.desc}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={hrefNav(link.href)}
                  aria-current={link.href === "/guias" && isGuidesActive ? "page" : undefined}
                  className={`transition-colors hover:text-text-primary no-underline ${
                    link.href === "/guias" && isGuidesActive ? "font-semibold text-text-primary" : ""
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="relative z-10 ml-auto flex items-center justify-end gap-3 lg:min-w-[17.5rem]">
            {loading ? (
              <div className="hidden h-10 w-28 rounded-full bg-surface-hover sm:block" />
            ) : user ? (
              <div className="relative hidden sm:block" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-2 pr-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                    {getInitials(user.user_metadata?.full_name || user.email || "")}
                  </span>
                  <span className="max-w-[90px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Cuenta"}
                  </span>
                </button>

                {isUserMenuOpen ? (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[240px] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_40px_rgba(17,24,39,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                      <div className="border-b border-border px-4 py-3">
                        <p className="truncate text-xs text-text-secondary">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/comunidad/cursos"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-primary no-underline transition-colors hover:bg-surface-hover"
                        >
                          <LayoutDashboard className="h-4 w-4 text-text-secondary" />
                          Comunidad
                        </Link>
                        <Link
                          href="/referidos/app"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-primary no-underline transition-colors hover:bg-surface-hover"
                        >
                          <Handshake className="h-4 w-4 text-text-secondary" />
                          Referidos
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setProfileModal({ isOpen: true, tab: "profile" });
                          }}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
                        >
                          <UserCircle className="h-4 w-4 text-text-secondary" />
                          Ver perfil
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setProfileModal({ isOpen: true, tab: "settings" });
                          }}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
                        >
                          <Settings className="h-4 w-4 text-text-secondary" />
                          Ajustes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsSupportModalOpen(true);
                          }}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
                        >
                          <LifeBuoy className="h-4 w-4 text-text-secondary" />
                          Soporte
                        </button>
                        {isAdmin && (
                          <Link
                            href="/comunidad/admin"
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-primary no-underline transition-colors hover:bg-surface-hover"
                          >
                            <ShieldAlert className="h-4 w-4 text-text-secondary" />
                            Panel Admin
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
                        >
                          <LogOut className="h-4 w-4 text-text-secondary" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModal({ isOpen: true, tab: "login" })}
                className="hidden h-10 cursor-pointer items-center px-1 text-[14.5px] font-medium text-text-secondary transition-colors hover:text-text-primary sm:inline-flex"
              >
                Iniciar sesión
              </button>
            )}

            {!user && !loading ? (
              <button
                type="button"
                data-cta-id={pathname === "/" ? "home_nav_registrarse" : undefined}
                onClick={() => {
                  trackNavRegistro(pathname);
                  setAuthModal({ isOpen: true, tab: "register" });
                }}
                className="hidden h-10 cursor-pointer items-center rounded-full bg-accent px-6 text-[14.5px] font-semibold text-accent-foreground transition-transform active:scale-95 sm:inline-flex"
              >
                {etiquetaBoton(paisNav, "Registrarse")}
              </button>
            ) : null}

            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-hover lg:hidden"
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
          <div className="border-t border-border bg-bg">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                <button
                  type="button"
                  onClick={() => {
                    setNlActiveCategory("all");
                    window.dispatchEvent(new CustomEvent("nl-category", { detail: "all" }));
                  }}
                  className={`min-h-[44px] cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap transition-colors ${
                    nlActiveCategory === "all" ? "text-text-primary" : "text-text-muted hover:text-text-primary"
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
                    className={`min-h-[44px] cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap transition-colors ${
                      nlActiveCategory === cat.slug ? "text-text-primary" : "text-text-muted hover:text-text-primary"
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
            className="absolute inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-b border-border bg-bg px-4 py-5 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Móvil">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div key={link.href} className="border-b border-border py-1">
                    <button
                      type="button"
                      onClick={() => setIsMobileCoursesOpen((v) => !v)}
                      aria-expanded={isMobileCoursesOpen}
                      className="flex min-h-[44px] w-full cursor-pointer items-center justify-between py-3 text-left"
                    >
                      <span className="text-lg font-medium text-text-primary">Cursos</span>
                      <ChevronDown
                        size={18}
                        className={`text-text-secondary transition-transform ${isMobileCoursesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isMobileCoursesOpen ? (
                      <div className="pb-3">
                        {courseGroups.map((group) => (
                          <div key={group.id} className="mt-3 first:mt-0">
                            <p className="px-1 text-xs font-semibold text-text-muted">{group.label}</p>
                            <ul className="mt-1">
                              {group.items.map((course) => (
                                <li key={course.slug}>
                                  <Link
                                    href={hrefLocal(`/cursos/${course.slug}`)}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex min-h-[44px] items-center rounded-md px-1 py-2.5 no-underline transition-colors hover:bg-surface-hover"
                                  >
                                    <span className="text-[15px] font-medium text-text-primary">{course.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href={hrefLocal("/cursos")}
                          onClick={() => setIsMobileOpen(false)}
                          className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 px-1 py-2 text-sm font-semibold text-text-primary no-underline"
                        >
                          Ver todos los cursos <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ) : link.hasRecursos ? (
                  <div key={link.href} className="border-b border-border py-1">
                    <button
                      type="button"
                      onClick={() => setIsMobileRecursosOpen((v) => !v)}
                      aria-expanded={isMobileRecursosOpen}
                      className="flex min-h-[44px] w-full cursor-pointer items-center justify-between py-3 text-left"
                    >
                      <span className="text-lg font-medium text-text-primary">{link.label}</span>
                      <ChevronDown
                        size={18}
                        className={`text-text-secondary transition-transform ${isMobileRecursosOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isMobileRecursosOpen ? (
                      <div className="pb-3">
                        <ul className="space-y-1">
                          {recursosLinks.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={hrefNav(item.href)}
                                onClick={() => setIsMobileOpen(false)}
                                className="block min-h-[44px] rounded-md px-1 py-2 no-underline transition-colors hover:bg-surface-hover"
                              >
                                <span className="block text-[15px] font-medium text-text-primary">{item.label}</span>
                                <span className="block text-xs text-text-secondary">{item.desc}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={hrefNav(link.href)}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={link.href === "/guias" && isGuidesActive ? "page" : undefined}
                    className={`flex min-h-[44px] items-center border-b border-border py-3 text-lg no-underline ${
                      link.href === "/guias" && isGuidesActive
                        ? "font-semibold text-text-primary"
                        : "font-medium text-text-primary"
                    }`}
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
                      className="flex min-h-[44px] items-center py-3 text-lg font-medium text-text-primary no-underline"
                    >
                      Campus
                    </Link>
                    <Link
                      href="/referidos/app"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex min-h-[44px] items-center py-3 text-lg font-medium text-text-primary no-underline"
                    >
                      Referidos
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setProfileModal({ isOpen: true, tab: "profile" });
                      }}
                      className="min-h-[44px] cursor-pointer py-3 text-left text-lg font-medium text-text-primary"
                    >
                      Perfil
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="min-h-[44px] cursor-pointer py-3 text-left text-lg font-medium text-text-primary"
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
                    className="min-h-[44px] cursor-pointer py-3 text-left text-lg font-medium text-text-primary"
                  >
                    Iniciar sesión
                  </button>
                )}

                {!user ? (
                  <button
                    type="button"
                    data-cta-id={pathname === "/" ? "home_nav_registrarse" : undefined}
                    onClick={() => {
                      trackNavRegistro(pathname);
                      setIsMobileOpen(false);
                      setAuthModal({ isOpen: true, tab: "register" });
                    }}
                    className="mt-2 inline-flex h-12 min-h-[44px] w-full cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-[14.5px] font-semibold text-accent-foreground"
                  >
                    {etiquetaBoton(paisNav, "Registrarse")}
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
