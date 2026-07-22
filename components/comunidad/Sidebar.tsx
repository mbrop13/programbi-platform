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
  Dumbbell,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { getUnreadNotificationCount, getCoursesAndLessons, getPosts } from "@/lib/supabase/comunidad";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/Toast";
import { Tooltip } from "./ai-v2/Tooltip";

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
}: SidebarProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUpcomingLives, setHasUpcomingLives] = useState(false);
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

  // Check for upcoming live classes to display the Live tab
  useEffect(() => {
    const checkLives = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("live_classes")
          .select("id")
          .eq("status", "scheduled")
          .gte("scheduled_at", new Date().toISOString())
          .limit(1);
        if (data && data.length > 0) {
          setHasUpcomingLives(true);
        }
      } catch (err) {
        console.error("Error checking upcoming lives:", err);
      }
    };
    checkLives();
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
      { id: "inicio", label: t.inicio, icon: LayoutDashboard, color: "text-blue-500", group: t.principal },
      { id: "cursos", label: t.cursos, icon: GraduationCap, color: "text-indigo-500", group: t.principal },
      { id: "live", label: t.live, icon: Radio, color: "text-rose-500", group: t.principal, showPing: hasUpcomingLives },
      { id: "buscar", label: "Buscar", icon: Search, color: "text-brand-blue", group: t.principal },
      { id: "ai", label: t.ai, icon: Sparkles, color: "text-purple-500", group: t.principal },
      { id: "practicar", label: t.practicar, icon: Dumbbell, color: "text-emerald-500", group: t.principal },
    { id: "certificados", label: t.certificados, icon: Award, color: "text-amber-500", group: t.personal },
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
        <div className={`flex items-center shrink-0 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"} h-[68px] border-b border-neutral-100 dark:border-neutral-900`}>
          {isCollapsed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-450 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors border-0 bg-transparent cursor-pointer"
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-450 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors border-0 bg-transparent cursor-pointer"
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
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider select-none">
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
                          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          : "bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-55/60 dark:hover:bg-neutral-900/60"
                      )}
                    >
                      <span className="relative shrink-0 flex items-center justify-center">
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-neutral-900 dark:text-white" : "text-neutral-450 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"}`} />
                        {tab.showPing && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                        )}
                        {isCollapsed && tab.badge && tab.badge > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-950" />
                        )}
                      </span>

                      <span className={cn(
                        "whitespace-nowrap transition-all duration-300 overflow-hidden truncate text-left",
                        isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-auto opacity-100"
                      )}>
                        {tab.label}
                      </span>

                      {!isCollapsed && tab.badge && tab.badge > 0 ? (
                        <span className="shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 ml-auto bg-neutral-200 text-neutral-800 transition-all duration-300">
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
          "shrink-0 border-t border-neutral-100 dark:border-neutral-900/60 p-3 transition-all duration-200",
          isCollapsed ? "flex justify-center px-2" : "px-3"
        )}>
          {authLoading && !userProfile ? (
            isCollapsed ? (
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse mx-auto" />
            ) : (
              <div className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50/20 dark:bg-neutral-900/10">
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
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
                      "relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm select-none transition-all duration-150",
                      userMenuOpen && "ring-2 ring-indigo-500"
                    )}>
                      <span>{initials}</span>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold px-1 ring-2 ring-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-left border-0 bg-transparent cursor-pointer rounded-xl transition-all duration-150 user-trigger-btn p-1.5 gap-2.5 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 w-full min-w-0"
                >
                  <div className={cn(
                    "relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm select-none transition-all duration-150",
                    userMenuOpen && "ring-2 ring-indigo-500"
                  )}>
                    <span>{initials}</span>
                  </div>
                  <span className="truncate text-[13px] font-semibold text-neutral-750 dark:text-neutral-200 min-w-0 flex-1">
                    {displayName}
                  </span>
                </button>
              )}

              {!isCollapsed && (
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors shrink-0 cursor-pointer border-0 relative"
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
                "fixed z-50 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-100/80 overflow-hidden",
                isCollapsed ? "bottom-16 left-3 w-56 mb-2" : "bottom-16 left-3 w-[236px] mb-2"
              )}
            >
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-normal text-neutral-600 truncate min-w-0 flex-1">
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
                <MenuItem
                  icon={ArrowUpCircle}
                  label={t.upgradePlan}
                  onMouseEnter={() => setActiveSubmenu(null)}
                  onClick={() => {
                    onUpgradeClick();
                    setUserMenuOpen(false);
                  }}
                />
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

                <div className="my-1 h-px bg-neutral-100" />

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

                <div className="my-1 h-px bg-neutral-100" />

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
                    <div className="my-1 h-px bg-neutral-100" />
                  </>
                )}

                <Link
                  href="/"
                  onMouseEnter={() => setActiveSubmenu(null)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-red-600 transition-colors font-medium no-underline"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-neutral-400 hover:text-red-500" />
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
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-white dark:bg-neutral-950 border-r border-neutral-100 dark:border-neutral-900 z-30",
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
              className="fixed inset-0 z-50 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-white dark:bg-neutral-950 shadow-2xl lg:hidden flex flex-col border-r border-neutral-150 dark:border-neutral-900"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all z-10 border-none cursor-pointer"
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
            className="fixed z-50 bg-white dark:bg-neutral-950 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-neutral-100/80 dark:border-neutral-800/80 p-1.5 space-y-0.5 w-44"
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
            className="fixed z-50 bg-white dark:bg-neutral-950 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-neutral-100/80 dark:border-neutral-800/80 p-1.5 space-y-0.5 w-44"
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
            className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/45 backdrop-blur-[4px] p-4 sm:p-10 pt-16 sm:pt-28"
            onClick={() => setSearchModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onKeyDown={handleModalKeyDown}
              className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-[28px] max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input bar */}
              <div className="relative p-5 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-900">
                <Search className="w-5.5 h-5.5 text-neutral-450 dark:text-neutral-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedResultIndex(0);
                  }}
                  placeholder="Buscar cursos y clases..."
                  className="flex-grow text-[15px] font-medium bg-transparent border-none !border-none outline-none !outline-none focus:outline-none focus:!outline-none focus:ring-0 focus:!ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-neutral-400 shadow-none focus:shadow-none"
                  style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                  autoFocus
                />
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="px-2 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-[10px] font-black text-neutral-450 tracking-wider transition-colors cursor-pointer border-0 uppercase"
                >
                  ESC
                </button>
              </div>

              {/* Suggestions / Results area */}
              {searchQuery === "" ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-neutral-400">
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
                        className="px-4 py-2 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-xs font-bold text-neutral-600 dark:text-neutral-300 border-none cursor-pointer transition-all active:scale-95"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto max-h-[360px] divide-y divide-neutral-50 dark:divide-neutral-900 p-2">
                  {loadingSearchData ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2.5">
                      <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
                      <span className="text-xs text-neutral-450">Buscando en la plataforma...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="py-12 text-center text-xs text-neutral-400 dark:text-neutral-500">
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
                            isSelected ? "bg-neutral-50 dark:bg-neutral-900" : "bg-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            isCourse 
                              ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                          )}>
                            {isCourse ? <GraduationCap className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[13.5px] text-slate-800 dark:text-slate-100 truncate flex-grow">
                                {displayTitle}
                              </span>
                              {isCourse ? (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                                  Curso
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                                  Clase
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-2 truncate">
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
                            <span className="text-[11px] font-black text-brand-blue flex items-center gap-1 shrink-0 self-center">
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
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer border-0 bg-transparent min-w-0 select-none",
        className
      )}
    >
      <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 leading-tight">{label}</div>
        {sublabel && <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal leading-normal mt-0.5">{sublabel}</div>}
      </div>
      {suffix && <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wider ml-auto">{suffix}</span>}
      {hasChevron && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-auto" />}
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
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer border-0 bg-transparent min-w-0 select-none",
        isActive && "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
      )}
    >
      <Icon className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
      <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 flex-1">{label}</span>
      {isActive && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-auto font-bold" />}
    </button>
  );
}
