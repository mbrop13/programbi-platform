"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Radio,
  Sparkles,
  Building2,
  ShieldAlert,
  User,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Sun,
  Moon,
  Monitor,
  Check,
  ExternalLink,
  Search,
  Bell,
  Download,
  Globe,
  HelpCircle,
  ArrowUpCircle,
  ArrowRight,
  Loader2,
  Target,
  Briefcase,
} from "lucide-react";
import dynamic from "next/dynamic";

const NotificationCenter = dynamic(() => import("./NotificationCenter"), { ssr: false });
import { getUnreadNotificationCount, getCoursesAndLessons, getPosts } from "@/lib/supabase/comunidad";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/Toast";
import { Tooltip } from "./ai-v2/Tooltip";
import { SUBSCRIPTIONS_ENABLED } from "@/lib/data/community-flags";

const translations = {
  es: {
    search: "Buscar...",
    newChat: "Nuevo Chat",
    allSettings: "Todos los ajustes",
    upgradePlan: "Actualizar plan",
    installApps: "Instalar apps",
    appearance: "Apariencia",
    language: "Idioma",
    help: "Ayuda",
    adminPanel: "Panel Admin",
    signOut: "Cerrar sesión",
    inicio: "Inicio",
    cursos: "Cursos",
    live: "En Vivo",
    ai: "IA",
    practicar: "Practica",
    perfil: "Mi Perfil",
    certificados: "Certificados",
    empresa: "Empresa",
    configuracion: "Configuración",
    claro: "Claro",
    oscuro: "Oscuro",
    sistema: "Sistema",
    idioma_name: "Español",
    premiumBannerTitle: "Membresía Premium",
    premiumBannerDesc: "Obtén acceso ilimitado a SQL, Power BI, Python y Excel.",
    subscribe: "Suscribirse",
    fullAccess: "Acceso Completo",
    principal: "Principal",
    personal: "Personal",
    gestion: "Gestión"
  },
  en: {
    search: "Search...",
    newChat: "New Chat",
    allSettings: "All Settings",
    upgradePlan: "Upgrade Plan",
    installApps: "Install Apps",
    appearance: "Appearance",
    language: "Language",
    help: "Help",
    adminPanel: "Admin Panel",
    signOut: "Sign Out",
    inicio: "Feed",
    cursos: "My Courses",
    live: "Live Class",
    ai: "AI Assistant",
    practicar: "Practice",
    perfil: "My Profile",
    certificados: "Certificates",
    empresa: "Business",
    configuracion: "Settings",
    claro: "Light",
    oscuro: "Dark",
    sistema: "System",
    idioma_name: "English",
    premiumBannerTitle: "Premium Membership",
    premiumBannerDesc: "Get unlimited access to SQL, Power BI, Python, and Excel.",
    subscribe: "Subscribe",
    fullAccess: "Full Access",
    principal: "Main",
    personal: "Personal",
    gestion: "Management"
  }
};

export interface SidebarTab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  group: string;
  badge?: number;
  showPing?: boolean;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onExpand: () => void;
  isAdmin: boolean;
  isOrgManager: boolean;
  userProfile: {
    full_name: string;
    email: string;
    subscription_plan?: string | null;
  } | null;
  authLoading?: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenSettings: () => void;
  onUpgradeClick: () => void;
  theme?: 'claro' | 'oscuro' | 'sistema';
  onThemeChange?: (theme: 'claro' | 'oscuro' | 'sistema') => void;
  language?: 'es' | 'en';
  onLanguageChange?: (lang: 'es' | 'en') => void;
  hasActiveLive?: boolean;
}

interface CourseSearchResult {
  id: string;
  title: string;
  slug: string;
}

interface LessonSearchResult {
  id: string;
  title: string;
  course_id: string;
}

interface PostSearchResult {
  id: string;
  content: string | Record<string, unknown>;
  profiles?: {
    full_name?: string;
  };
}

interface SearchDataState {
  courses: CourseSearchResult[];
  lessons: LessonSearchResult[];
  posts: PostSearchResult[];
}

export default function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  onExpand,
  isAdmin,
  isOrgManager,
  userProfile,
  authLoading = false,
  mobileOpen,
  onMobileClose,
  onOpenSettings,
  onUpgradeClick,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  hasActiveLive = false,
}: SidebarProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeSubmenu, setActiveSubmenu] = useState<"apariencia" | "idioma" | null>(null);
  
  // Search Modal States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchDataState | null>(null);
  const [loadingSearchData, setLoadingSearchData] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  useEffect(() => {
    const handleOpenSearch = () => {
      setSearchModalOpen(true);
    };
    window.addEventListener("open-search-modal", handleOpenSearch);
    return () => {
      window.removeEventListener("open-search-modal", handleOpenSearch);
    };
  }, []);
  
  const activeTheme = theme || "claro";
  const setActiveTheme = onThemeChange || (() => {});
  const activeLanguage = language || "es";
  const setActiveLanguage = onLanguageChange || (() => {});

  const aparienciaRef = useRef<HTMLDivElement>(null);
  const idiomaRef = useRef<HTMLDivElement>(null);
  const [submenuCoords, setSubmenuCoords] = useState<{ top: number; left: number } | null>(null);

  const openApariencia = () => {
    if (aparienciaRef.current) {
      const rect = aparienciaRef.current.getBoundingClientRect();
      setSubmenuCoords({ top: rect.top, left: rect.right + 8 });
      setActiveSubmenu("apariencia");
    }
  };

  const openIdioma = () => {
    if (idiomaRef.current) {
      const rect = idiomaRef.current.getBoundingClientRect();
      setSubmenuCoords({ top: rect.top, left: rect.right + 8 });
      setActiveSubmenu("idioma");
    }
  };

  // Close submenu when main user menu closes
  useEffect(() => {
    if (!userMenuOpen) {
      const handle = setTimeout(() => {
        setActiveSubmenu(null);
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [userMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const trigger = (event.target as HTMLElement).closest(".user-trigger-btn");
        if (!trigger) {
          setUserMenuOpen(false);
        }
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Fetch unread count on mount
  useEffect(() => {
    getUnreadNotificationCount().then(setUnreadCount);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // "[" toggles collapse (unless typing)
      if (e.key === "[" && !e.ctrlKey && !e.metaKey && !e.altKey && !typing) {
        onToggleCollapse();
        return;
      }

      // "/" or Ctrl+K / Cmd+K opens the new Search Modal (unless typing)
      if (
        ((e.key === "/" && !typing) ||
         ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        !searchModalOpen
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
        if (!searchData) setLoadingSearchData(true);
      }
    },
    [onToggleCollapse, searchModalOpen, searchData]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Load search data on demand when modal opens
  useEffect(() => {
    if (searchModalOpen && !searchData) {
      Promise.all([getCoursesAndLessons(), getPosts()])
        .then(([coursesLessons, postsList]) => {
          setSearchData({
            courses: coursesLessons.courses,
            lessons: coursesLessons.lessons,
            posts: postsList,
          });
        })
        .catch((err) => console.error("Error loading search data:", err))
        .finally(() => setLoadingSearchData(false));
    }
  }, [searchModalOpen, searchData]);

  // Close user menu when tab changes
  useEffect(() => {
    const handle = setTimeout(() => {
      setUserMenuOpen(false);
    }, 0);
    return () => clearTimeout(handle);
  }, [activeTab]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleResultClick = (item: CourseSearchResult | LessonSearchResult | PostSearchResult | string) => {
    setSearchModalOpen(false);
    setSearchQuery("");
    if (typeof item === "string") {
      onTabChange("ai");
      router.push(`/comunidad/ai?q=${encodeURIComponent(item)}`);
      return;
    }

    const lessonItem = item as LessonSearchResult;
    if (lessonItem.course_id) {
      const course = searchData?.courses.find(c => c.id === lessonItem.course_id);
      if (course) {
        onTabChange("cursos");
        router.push(`/comunidad/cursos/${course.slug}/${slugify(lessonItem.title)}`);
      }
    } else {
      const courseItem = item as CourseSearchResult;
      onTabChange("cursos");
      router.push(`/comunidad/cursos/${courseItem.slug}`);
    }
  };

  const t = translations[activeLanguage];

    const tabs: SidebarTab[] = [
      { id: "inicio", label: t.inicio, icon: LayoutDashboard, color: "text-text-secondary", group: t.principal },
      { id: "cursos", label: t.cursos, icon: GraduationCap, color: "text-text-secondary", group: t.principal },
      { id: "live", label: t.live, icon: Radio, color: "text-rose-500", group: t.principal, showPing: hasActiveLive },
      { id: "buscar", label: "Buscar", icon: Search, color: "text-text-secondary", group: t.principal },
      { id: "ai", label: t.ai, icon: Sparkles, color: "text-text-secondary", group: t.principal },
      { id: "practicar", label: t.practicar, icon: Target, color: "text-text-secondary", group: t.principal },
    { id: "certificados", label: t.certificados, icon: Award, color: "text-amber-500", group: t.personal },
    { id: "empleos", label: "Empleos", icon: Briefcase, color: "text-emerald-600", group: t.personal },
    ...(isOrgManager
      ? [{ id: "business", label: t.empresa, icon: Building2, color: "text-slate-500", group: t.gestion }]
      : []),
  ];

  const groups = tabs.reduce<Record<string, SidebarTab[]>>((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  const displayName =
    userProfile?.full_name || userProfile?.email || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  const sidebarWidth = collapsed ? 72 : 230;



  const renderSidebarContent = (isMobile: boolean) => {
    const isCollapsed = isMobile ? false : collapsed;
    return (
      <div
        className={cn(
          "flex flex-col h-full relative selection:bg-transparent",
          isCollapsed ? "select-none" : ""
        )}
      >
        {/* Logo + Collapse button */}
        <div className={`flex items-center shrink-0 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"} h-[68px] border-b border-border`}>
          {isCollapsed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-accent-soft transition-colors border-0 bg-transparent cursor-pointer"
              title="Expandir menú"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center justify-center no-underline group shrink-0">
                <div className="relative w-32 h-[30px] shrink-0 overflow-hidden flex items-center justify-center">
                  <Image
                    src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                    alt="ProgramBI"
                    fill
                    className="object-contain dark:brightness-110"
                  />
                </div>
              </Link>
              {!isMobile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollapse();
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-accent-soft transition-colors border-0 bg-transparent cursor-pointer"
                  title="Colapsar menú"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Nav Items */}
        <nav className={cn("py-3 px-3 scrollbar-hide flex-1", isCollapsed ? "overflow-visible space-y-1.5" : "overflow-y-auto space-y-4")}>
          {Object.entries(groups).map(([groupName, groupTabs]) => (
            <div key={groupName} className={isCollapsed ? "contents" : "space-y-2"}>
              {!isCollapsed && (
                <div className="px-3 mb-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider select-none">
                    {groupName}
                  </span>
                </div>
              )}

              <div className={isCollapsed ? "contents" : "space-y-1"}>
                {groupTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id || (tab.id === "buscar" && searchModalOpen);
                  const buttonEl = (
                    <button
                      onClick={() => {
                        if (tab.id === "buscar") {
                          setSearchModalOpen(true);
                          if (!searchData) setLoadingSearchData(true);
                        } else {
                          onTabChange(tab.id);
                        }
                        onMobileClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 font-semibold text-[13px] transition-all duration-150 select-none border-0 cursor-pointer px-3 py-2.5 rounded-xl justify-start",
                        isActive
                          ? "bg-accent-soft text-text"
                          : "bg-transparent text-text-secondary hover:text-text hover:bg-accent-soft"
                      )}
                    >
                      <span className="relative shrink-0 flex items-center justify-center">
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-text" : "text-text-secondary group-hover:text-text"}`} />
                        {tab.showPing && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                        )}
                        {isCollapsed && tab.badge && tab.badge > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-bg-elevated" />
                        )}
                      </span>

                      <span className={cn(
                        "whitespace-nowrap transition-all duration-300 overflow-hidden truncate text-left",
                        isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-auto opacity-100"
                      )}>
                        {tab.label}
                      </span>

                      {!isCollapsed && tab.badge && tab.badge > 0 ? (
                        <span className="shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 ml-auto bg-border text-text transition-all duration-300">
                          {tab.badge > 99 ? "99+" : tab.badge}
                        </span>
                      ) : null}
                    </button>
                  );

                  return (
                    <React.Fragment key={tab.id}>
                      {isCollapsed ? (
                        <Tooltip content={tab.label} position="right">
                          {buttonEl}
                        </Tooltip>
                      ) : (
                        buttonEl
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ─── USER SECTION (bottom) ─── */}
        <div className={cn(
          "shrink-0 border-t border-border/60 p-3 transition-all duration-200",
          isCollapsed ? "flex justify-center px-2" : "px-3"
        )}>
          {authLoading && !userProfile ? (
            isCollapsed ? (
              <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse mx-auto" />
            ) : (
              <div className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-accent-soft/50">
                <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-3 w-20 bg-surface-hover rounded animate-pulse" />
                </div>
              </div>
            )
          ) : (
            <div className={cn(
              "w-full flex items-center justify-between transition-all duration-200",
              isCollapsed ? "justify-center" : "gap-2"
            )}>
              {isCollapsed ? (
                <Tooltip content={displayName} position="right">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center text-left border-0 bg-transparent cursor-pointer rounded-xl transition-all duration-150 user-trigger-btn p-0 hover:scale-105"
                  >
                    <div className={cn(
                      "relative h-8 w-8 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs select-none transition-all duration-150",
                      userMenuOpen && "ring-2 ring-accent"
                    )}>
                      <span>{initials}</span>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold px-1 ring-2 ring-bg-elevated">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-left border-0 bg-transparent cursor-pointer rounded-xl transition-all duration-150 user-trigger-btn p-1.5 gap-2.5 hover:bg-accent-soft w-full min-w-0"
                >
                  <div className={cn(
                    "relative h-8 w-8 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs select-none transition-all duration-150",
                    userMenuOpen && "ring-2 ring-accent"
                  )}>
                    <span>{initials}</span>
                  </div>
                  <span className="truncate text-[13px] font-semibold text-text min-w-0 flex-1">
                    {displayName}
                  </span>
                </button>
              )}

              {!isCollapsed && (
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-text bg-surface-hover hover:bg-border transition-colors shrink-0 cursor-pointer border-0 relative"
                  title="Notificaciones"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── USER DROPDOWN MENU ─── */}
        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "fixed z-50 bg-surface rounded-xl shadow-lift border border-border overflow-hidden",
                isCollapsed ? "bottom-16 left-3 w-56 mb-2" : "bottom-16 left-3 w-[236px] mb-2"
              )}
            >
              <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-normal text-text-secondary truncate min-w-0 flex-1">
                  {userProfile?.email || "usuario@programbi.com"}
                </span>
              </div>

              <div className="p-1.5 space-y-0.5">
                <MenuItem
                  icon={Settings}
                  label={t.allSettings}
                  suffix="↑ "
                  onMouseEnter={() => setActiveSubmenu(null)}
                  onClick={() => {
                    onOpenSettings();
                    setUserMenuOpen(false);
                  }}
                />
                {SUBSCRIPTIONS_ENABLED && (
                <MenuItem
                  icon={ArrowUpCircle}
                  label={t.upgradePlan}
                  onMouseEnter={() => setActiveSubmenu(null)}
                  onClick={() => {
                    onUpgradeClick();
                    setUserMenuOpen(false);
                  }}
                />
                )}
                <MenuItem
                  icon={Download}
                  label={t.installApps}
                  onMouseEnter={() => setActiveSubmenu(null)}
                  onClick={() => {
                    const title = activeLanguage === 'es' ? "Instalación de Aplicación" : "App Installation";
                    const body = activeLanguage === 'es' 
                      ? "ProgramBI es una PWA. Puedes instalarla directamente desde el menú del navegador en tu móvil u ordenador."
                      : "ProgramBI is a PWA. You can install it directly from your browser menu on mobile or desktop.";
                    toast("info", title, body);
                    setUserMenuOpen(false);
                  }}
                />

                <div className="my-1 h-px bg-border" />

                <div ref={aparienciaRef}>
                  <MenuItem
                    icon={Sun}
                    label={t.appearance}
                    sublabel={activeTheme === "claro" ? t.claro : activeTheme === "oscuro" ? t.oscuro : t.sistema}
                    hasChevron
                    onMouseEnter={openApariencia}
                    onClick={openApariencia}
                  />
                </div>

                <div ref={idiomaRef}>
                  <MenuItem
                    icon={Globe}
                    label={t.language}
                    sublabel={t.idioma_name}
                    hasChevron
                    onMouseEnter={openIdioma}
                    onClick={openIdioma}
                  />
                </div>

                <MenuItem
                  icon={HelpCircle}
                  label={t.help}
                  hasChevron
                  onMouseEnter={() => setActiveSubmenu(null)}
                  onClick={() => {
                    const title = activeLanguage === 'es' ? "Centro de Ayuda" : "Help Center";
                    const body = activeLanguage === 'es'
                      ? "Si necesitas ayuda, puedes consultarle a nuestro Asistente IA o enviarnos un correo a soporte@programbi.com."
                      : "If you need help, you can consult our AI Assistant or send us an email at support@programbi.com.";
                    toast("info", title, body);
                    setUserMenuOpen(false);
                  }}
                />

                <div className="my-1 h-px bg-border" />

                {isAdmin && (
                  <>
                    <Link
                      href="/comunidad/admin"
                      onMouseEnter={() => setActiveSubmenu(null)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-amber-600 hover:bg-amber-50 transition-colors font-medium no-underline"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{t.adminPanel}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50 shrink-0" />
                    </Link>
                    <div className="my-1 h-px bg-border" />
                  </>
                )}

                <Link
                  href="/"
                  onMouseEnter={() => setActiveSubmenu(null)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-text-secondary hover:bg-accent-soft hover:text-danger transition-colors font-medium no-underline"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-text-muted hover:text-danger" />
                  <span>{t.signOut}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Filter search results
  const searchResults = (() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    
    if (!searchData) return [];
    const lessonsFiltered = searchData.lessons.filter(l => 
      l.title.toLowerCase().includes(query)
    );
    const coursesFiltered = searchData.courses.filter(c => 
      c.title.toLowerCase().includes(query)
    );
    return [...coursesFiltered, ...lessonsFiltered];
  })();

  const getDisplayTitle = (item: CourseSearchResult | LessonSearchResult | string): string => {
    if (typeof item === "string") {
      return item;
    }
    return (item as CourseSearchResult | LessonSearchResult).title || "";
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedResultIndex((prev) => Math.min(searchResults.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedResultIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedResultIndex]) {
        handleResultClick(searchResults[selectedResultIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearchModalOpen(false);
    }
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className={cn(
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-bg-elevated border-r border-border z-30",
          collapsed ? "overflow-visible" : "overflow-hidden"
        )}
      >
        {renderSidebarContent(false)}
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-50 bg-black/40 dark:bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-bg-elevated shadow-lift lg:hidden flex flex-col border-r border-border"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-text-muted hover:text-text hover:bg-accent-soft transition-all z-10 border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} onUnreadChange={setUnreadCount} collapsed={collapsed} />

      {/* ─── FIXED SUBMENUS DE APARIENCIA E IDIOMA ─── */}
      <AnimatePresence>
        {userMenuOpen && activeSubmenu === "apariencia" && submenuCoords && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed z-50 bg-surface rounded-xl shadow-lift border border-border p-1.5 space-y-0.5 w-44"
            style={{
              top: submenuCoords.top,
              left: submenuCoords.left,
            }}
          >
            <SubmenuItem
              icon={Sun}
              label={t.claro}
              isActive={activeTheme === "claro"}
              onClick={() => {
                setActiveTheme("claro");
                const title = activeLanguage === 'es' ? "Tema Claro activado" : "Light Theme activated";
                const body = activeLanguage === 'es' ? "Se ha establecido el tema visual de la plataforma en Claro." : "Platform visual theme set to Light.";
                toast("success", title, body);
                setActiveSubmenu(null);
              }}
            />
            <SubmenuItem
              icon={Moon}
              label={t.oscuro}
              isActive={activeTheme === "oscuro"}
              onClick={() => {
                setActiveTheme("oscuro");
                const title = activeLanguage === 'es' ? "Tema Oscuro activado" : "Dark Theme activated";
                const body = activeLanguage === 'es' ? "Se ha establecido el tema visual de la plataforma en Oscuro." : "Platform visual theme set to Dark.";
                toast("success", title, body);
                setActiveSubmenu(null);
              }}
            />
            <SubmenuItem
              icon={Monitor}
              label={t.sistema}
              isActive={activeTheme === "sistema"}
              onClick={() => {
                setActiveTheme("sistema");
                const title = activeLanguage === 'es' ? "Tema del Sistema activado" : "System Theme activated";
                const body = activeLanguage === 'es' ? "Se ha establecido la sincronización automática con el sistema." : "Automatic system theme sync set.";
                toast("success", title, body);
                setActiveSubmenu(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userMenuOpen && activeSubmenu === "idioma" && submenuCoords && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed z-50 bg-surface rounded-xl shadow-lift border border-border p-1.5 space-y-0.5 w-44"
            style={{
              top: submenuCoords.top,
              left: submenuCoords.left,
            }}
          >
            <SubmenuItem
              icon={Globe}
              label="Español"
              isActive={activeLanguage === "es"}
              onClick={() => {
                setActiveLanguage("es");
                toast("success", "Idioma cambiado", "Se ha establecido el idioma en Español.");
                setActiveSubmenu(null);
              }}
            />
            <SubmenuItem
              icon={Globe}
              label="English"
              isActive={activeLanguage === "en"}
              onClick={() => {
                setActiveLanguage("en");
                toast("success", "Language changed", "Language set to English.");
                setActiveSubmenu(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ADVANCED SEARCH MODAL ─── */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-[4px] p-4 sm:p-10 pt-16 sm:pt-28"
            onClick={() => setSearchModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onKeyDown={handleModalKeyDown}
              className="bg-surface border border-border rounded-xl max-w-2xl w-full shadow-lift overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input bar */}
              <div className="relative p-5 flex items-center gap-3 border-b border-border">
                <Search className="w-5.5 h-5.5 text-text-muted shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedResultIndex(0);
                  }}
                  placeholder="Buscar cursos y clases..."
                  className="flex-grow text-[15px] font-medium bg-transparent border-none outline-none focus:outline-none text-text placeholder:text-text-muted"
                  style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                  autoFocus
                />
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="px-2 py-1 rounded-md bg-surface-hover hover:bg-border text-[10px] font-black text-text-muted tracking-wider transition-colors cursor-pointer border-0 uppercase"
                >
                  ESC
                </button>
              </div>

              {/* Suggestions / Results area */}
              {searchQuery === "" ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest select-none">
                      Descubrir para ti
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Power Automate", "Power BI", "SQL Server", "Python", "RPA", "ChatGPT", "Copilot"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          setSelectedResultIndex(0);
                        }}
                        className="px-4 py-2 rounded-lg bg-surface-hover hover:bg-border text-xs font-bold text-text-secondary border-none cursor-pointer transition-all active:scale-95"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto max-h-[360px] divide-y divide-border p-2">
                  {loadingSearchData ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2.5">
                      <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
                      <span className="text-xs text-text-muted">Buscando en la plataforma...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="py-12 text-center text-xs text-text-muted">
                      No se encontraron resultados para &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    searchResults.map((item, idx) => {
                      const isSelected = idx === selectedResultIndex;
                      const displayTitle = getDisplayTitle(item);
                      const isCourse = typeof item !== "string" && !("course_id" in item);
                      
                      return (
                        <button
                          key={typeof item === "string" ? idx : (item.id || idx)}
                          onClick={() => handleResultClick(item)}
                          onMouseEnter={() => setSelectedResultIndex(idx)}
                          className={cn(
                            "w-full text-left p-3.5 rounded-2xl flex items-start gap-3 transition-colors border-0 cursor-pointer",
                            isSelected ? "bg-accent-soft" : "bg-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            isCourse 
                              ? "bg-accent-soft text-text"
                              : "bg-surface-hover text-text-secondary"
                          )}>
                            {isCourse ? <GraduationCap className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[13.5px] text-text truncate flex-grow">
                                {displayTitle}
                              </span>
                              {isCourse ? (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-accent-soft text-text border border-border shrink-0">
                                  Curso
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-surface-hover text-text-secondary border border-border shrink-0">
                                  Clase
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted mt-1 flex items-center gap-2 truncate">
                              {isCourse ? (
                                <span>Acceso al programa completo</span>
                              ) : (
                                <span>
                                  Clase del curso: {searchData?.courses.find(c => c.id === (item as LessonSearchResult).course_id)?.title || 'Curso'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <span className="text-[11px] font-black text-text flex items-center gap-1 shrink-0 self-center">
                              Ir <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Menu Item Component ── */
function MenuItem({
  icon: Icon,
  label,
  sublabel,
  suffix,
  hasChevron,
  onClick,
  onMouseEnter,
  className,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  suffix?: string;
  hasChevron?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-accent-soft transition-colors cursor-pointer border-0 bg-transparent min-w-0 select-none",
        className
      )}
    >
      <Icon className="w-4 h-4 text-text-secondary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text leading-tight">{label}</div>
        {sublabel && <div className="text-[11px] text-text-muted font-normal leading-normal mt-0.5">{sublabel}</div>}
      </div>
      {suffix && <span className="text-[11px] text-text-muted font-mono tracking-wider ml-auto">{suffix}</span>}
      {hasChevron && <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 ml-auto" />}
    </button>
  );
}

/* ── Submenu Item Component ── */
function SubmenuItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-accent-soft transition-colors cursor-pointer border-0 bg-transparent min-w-0 select-none",
        isActive && "bg-accent-soft text-text font-bold"
      )}
    >
      <Icon className="w-4.5 h-4.5 text-text-secondary shrink-0" />
      <span className="text-[13px] font-medium text-text flex-1">{label}</span>
      {isActive && <Check className="w-3.5 h-3.5 text-text shrink-0 ml-auto font-bold" />}
    </button>
  );
}
