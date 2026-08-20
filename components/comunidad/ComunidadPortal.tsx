"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Menu, Loader2, LayoutDashboard, GraduationCap, Radio, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import Sidebar from "./Sidebar";
import { ToastProvider } from "./ui/Toast";
import { useCommunity } from "./CommunityProvider";

// ─── SKELETON LOADERS FOR SMOOTH TAB TRANSITIONS (estilo grok) ───

const MuroFeedSkeleton = () => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="lg:col-span-8 space-y-6">
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-border shrink-0" />
          <div className="h-4 bg-border rounded-md w-1/3" />
        </div>
        <div className="h-16 bg-surface-hover rounded-lg w-full" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-border shrink-0" />
              <div className="space-y-2">
                <div className="h-3.5 bg-border rounded-md w-32" />
                <div className="h-2.5 bg-surface-hover rounded-md w-20" />
              </div>
            </div>
            <div className="h-24 bg-surface-hover rounded-lg w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
    <div className="hidden lg:block lg:col-span-4 space-y-6">
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="h-4 bg-border-strong rounded-md w-1/2" />
        <div className="h-48 bg-surface-hover rounded-lg w-full" />
      </div>
    </div>
  </div>
);

const MisCursosSkeleton = () => (
  <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="h-6 bg-border-strong rounded-md w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="aspect-[16/10] bg-border" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-border rounded-lg w-3/4" />
            <div className="h-3 bg-surface-hover rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LivePanelSkeleton = () => (
  <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="space-y-4 flex-1">
        <div className="h-3 bg-border rounded-md w-28" />
        <div className="h-7 bg-border-strong rounded-md w-3/4" />
        <div className="h-4 bg-border rounded-md w-5/6" />
      </div>
      <div className="w-full md:w-[320px] aspect-video bg-border rounded-lg shrink-0" />
    </div>
    <div className="space-y-4">
      <div className="h-5 bg-border-strong rounded-md w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2].map((y) => (
          <div key={y} className="bg-surface border border-border rounded-xl overflow-hidden space-y-4 pb-5">
            <div className="w-full aspect-video bg-border" />
            <div className="px-5 space-y-3">
              <div className="h-3 bg-border rounded-md w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InlineLoading = () => (
  <div className="flex-1 flex items-center justify-center py-20">
    <Loader2 className="w-7 h-7 text-accent animate-spin" />
  </div>
);

// ── Lazy-loaded tabs: only the active tab's code is downloaded ──
const MuroFeed = dynamic(() => import("./tabs/MuroFeed"), {
  loading: MuroFeedSkeleton,
});
const MisCursos = dynamic(() => import("./tabs/MisCursos"), {
  loading: MisCursosSkeleton,
});
const AulaVirtual = dynamic(() => import("./tabs/AulaVirtual"), { loading: InlineLoading });
const AiChatShell = dynamic(
  () => import("@/components/ai-chat-shell").then((m) => m.AiChatShell),
  { loading: InlineLoading }
);
const BusinessPortal = dynamic(() => import("./tabs/BusinessPortal"), { loading: InlineLoading });
const LivePanel = dynamic(() => import("./tabs/LivePanel"), { loading: LivePanelSkeleton });
const Certificates = dynamic(() => import("./tabs/Certificates"), { loading: InlineLoading });
const Practicar = dynamic(() => import("./tabs/Practicar"), { loading: InlineLoading });
const SettingsModal = dynamic(() => import("./SettingsModal"), { ssr: false });
const SubscriptionModal = dynamic(() => import("./SubscriptionModal"), { ssr: false });

export default function ComunidadPortal() {
  const router = useRouter();
  const pathname = usePathname();

  // ── All shared data comes from the CommunityProvider (pre-loaded in layout) ──
  const {
    isAdmin,
    isOrgManager,
    userProfile,
    authLoading,
    isCheckingPlan,
    hasCourses,
    courseSlugMap,
    canAccessFull,
    theme,
    setTheme,
    language,
    setLanguage,
  } = useCommunity();

  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "inicio";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const selectedCourseSlug = activeTab === "cursos" ? (segments[2] || null) : null;
  const selectedCourseId = selectedCourseSlug ? (courseSlugMap[selectedCourseSlug] || null) : null;

  const handleSelectCourse = (idOrSlug: string | null) => {
    if (idOrSlug) {
      const slug = Object.keys(courseSlugMap).find(k => courseSlugMap[k] === idOrSlug) || idOrSlug;
      router.push(`/comunidad/cursos/${slug}`);
    } else {
      router.push(`/comunidad/cursos`);
    }
  };

  // Redirect non-admins/non-managers
  useEffect(() => {
    if (activeTab === "business" && !isOrgManager && userProfile !== null) {
      router.push("/comunidad/inicio");
    }
  }, [activeTab, isOrgManager, userProfile, router]);

  // Auto-redirect org managers
  useEffect(() => {
    if (isOrgManager && activeTab === "inicio") {
      router.push("/comunidad/business");
    }
  }, [isOrgManager, activeTab, router]);

  // Open settings modal when navigating to /comunidad/configuracion, or redirect AI to /ai
  useEffect(() => {
    if (activeTab === "configuracion") {
      setShowSettingsModal(true);
    }
    if (activeTab === "ai") {
      router.replace("/ai");
    }
  }, [activeTab, router]);

  useEffect(() => {
    if (!authLoading && !isCheckingPlan && !userProfile) {
      router.push("/comunidad");
    }
  }, [authLoading, isCheckingPlan, userProfile, router]);

  const [hasActiveLive, setHasActiveLive] = useState(false);
  const [showAiToast, setShowAiToast] = useState(false);

  // Check if a live session is currently active or starting within 60 minutes
  useEffect(() => {
    const checkLives = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const supabase = createClient();
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        const { data } = await supabase
          .from("live_classes")
          .select("id, status, scheduled_at")
          .or(`status.eq.active,and(status.eq.scheduled,scheduled_at.lte.${oneHourFromNow})`)
          .limit(1);

        if (data && data.length > 0) {
          setHasActiveLive(true);
        } else {
          setHasActiveLive(false);
        }
      } catch {
        setHasActiveLive(false);
      }
    };
    checkLives();

    const handleVisibility = () => {
      if (!document.hidden) checkLives();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Refresh every 60s instead of aggressive 30s when tab is active
    const interval = setInterval(checkLives, 60000);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const restrictedView = !canAccessFull && hasCourses && activeTab !== "cursos";

  const handleTabChange = (tabId: string) => {
    if (tabId === "ai") {
      setShowAiToast(true);
      setTimeout(() => setShowAiToast(false), 3500);
      return;
    }
    handleSelectCourse(null);
    router.push(`/comunidad/${tabId}`);
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen transition-colors duration-200 bg-bg text-text">
        {/* ─── SIDEBAR (oculta en el chat IA y en el aula virtual de un curso) ─── */}
        {(activeTab !== "ai" && !(activeTab === "cursos" && selectedCourseId)) && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            onExpand={() => setSidebarCollapsed(false)}
            isAdmin={isAdmin}
            isOrgManager={isOrgManager}
            userProfile={userProfile}
            authLoading={authLoading}
            mobileOpen={mobileNavOpen}
            onMobileClose={() => setMobileNavOpen(false)}
            theme={theme}
            onThemeChange={setTheme}
            language={language}
            onLanguageChange={setLanguage}
            onOpenSettings={() => setShowSettingsModal(true)}
            onUpgradeClick={() => setShowUpgradeModal(true)}
            hasActiveLive={hasActiveLive}
          />
        )}

        {/* ─── MAIN AREA ─── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
          {/* Mobile Header Bar — visible only on small viewports and hidden in AI/Course pages */}
          {(activeTab !== "ai" && !(activeTab === "cursos" && selectedCourseId)) && (
            <header className="lg:hidden sticky top-0 z-35 flex items-center justify-between px-4 py-3 bg-surface/85 backdrop-blur-md border-b border-border transition-colors duration-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover text-text-secondary hover:bg-border transition-colors border-none cursor-pointer"
                  aria-label="Menú de navegación"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative w-28 h-[24px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                    alt="ProgramBI"
                    className="w-full h-full object-contain dark:brightness-110"
                  />
                </div>
              </div>

              {userProfile && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-[11px] cursor-pointer border-none transition-transform active:scale-95"
                >
                  <span>
                    {userProfile.full_name
                      ? userProfile.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                      : "?"}
                  </span>
                </button>
              )}
            </header>
          )}

          <main className="flex-1 w-full flex flex-col min-h-0">
            {isCheckingPlan ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
              </div>
            ) : activeTab === "ai" ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <AiChatShell />
                </motion.div>
              </AnimatePresence>
            ) : (activeTab === "cursos" && selectedCourseId) ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`aula-${selectedCourseId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <AulaVirtual
                    courseId={selectedCourseId}
                    onBack={() => handleSelectCourse(null)}
                    onUpgradeClick={() => setShowUpgradeModal(true)}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex-1 p-3 sm:p-6 lg:p-8 pb-20 lg:pb-8 w-full max-w-[1600px] mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {activeTab === "inicio" && (
                      <MuroFeed isRestricted={!!restrictedView} />
                    )}

                    {activeTab === "cursos" &&
                      (selectedCourseId ? (
                        <AulaVirtual
                          courseId={selectedCourseId}
                          onBack={() => handleSelectCourse(null)}
                          onUpgradeClick={() => setShowUpgradeModal(true)}
                          interfaceLanguage={language}
                        />
                      ) : (
                        <MisCursos onSelectCourse={(id) => handleSelectCourse(id)} language={language} />
                      ))}

                    {activeTab === "live" && (
                      <div className="relative">
                        {restrictedView && (
                          <div className="absolute inset-0 z-50 rounded-xl bg-bg/60 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 border border-border">
                            <div className="w-16 h-16 bg-surface border border-border-strong rounded-2xl flex items-center justify-center mb-4 text-text">
                              <Lock className="w-7 h-7" />
                            </div>
                            <h3 className="font-display font-bold text-xl text-text mb-2">
                              Sección Premium
                            </h3>
                            <p className="text-text-secondary text-center max-w-sm mb-6">
                              Suscripciones próximamente. Mientras tanto, puedes ver las clases gratuitas en Cursos.
                            </p>
                            <button
                              onClick={() => router.push("/comunidad/cursos")}
                              className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
                            >
                              Ir a Cursos
                            </button>
                          </div>
                        )}
                        <LivePanel />
                      </div>
                    )}

                    {activeTab === "business" &&
                      (isOrgManager ? (
                        <BusinessPortal />
                      ) : (
                        <div className="bg-surface rounded-xl border border-border p-12 text-center max-w-2xl mx-auto mt-8">
                          <h2 className="font-display font-bold text-2xl text-text mb-3">
                            Acceso Restringido
                          </h2>
                          <p className="text-text-secondary mb-6">
                            Esta sección está disponible únicamente para gestores corporativos.
                          </p>
                        </div>
                      ))}

                    {activeTab === "certificados" && <Certificates />}

                    {activeTab === "practicar" && <Practicar />}

                    {activeTab === "configuracion" && (
                      <div className="bg-surface rounded-xl border border-border p-12 text-center max-w-md mx-auto">
                        <h2 className="font-display font-bold text-xl text-text mb-2">
                          Configuración
                        </h2>
                        <p className="text-text-secondary mb-4">
                          Gestiona tu cuenta, suscripción y preferencias.
                        </p>
                        <button
                          onClick={() => setShowSettingsModal(true)}
                          className="bg-accent text-accent-foreground font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Abrir Configuración
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </main>

          {/* ─── MOBILE FLOATING LIQUID GLASS OVAL NAVIGATION BAR ─── */}
          {(activeTab !== "ai" && !(activeTab === "cursos" && selectedCourseId)) && (
            <div className="lg:hidden fixed bottom-5 left-4 right-4 z-40 max-w-md mx-auto pointer-events-auto select-none">
              <nav className="bg-white/75 dark:bg-neutral-900/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 dark:border-white/10 rounded-full px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(255,255,255,0.4)_inset] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.1)_inset] flex items-center justify-around transition-all duration-300">
                {[
                  { id: "inicio", label: language === 'en' ? "Feed" : "Inicio", icon: LayoutDashboard },
                  { id: "cursos", label: language === 'en' ? "Courses" : "Cursos", icon: GraduationCap },
                  { id: "live", label: language === 'en' ? "Live" : "En Vivo", icon: Radio, showPing: hasActiveLive },
                  { id: "ai", label: "IA", icon: Sparkles },
                  { id: "practicar", label: language === 'en' ? "Practice" : "Práctica", icon: Target },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 border-none bg-transparent cursor-pointer relative min-w-[54px]",
                        isActive ? "text-neutral-950 dark:text-white font-bold" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                      )}
                    >
                      <span className="relative flex items-center justify-center mb-1">
                        <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110 text-[#1890FF]")} />
                        {item.showPing && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm" />
                        )}
                      </span>
                      <span className="text-[10px] leading-none tracking-tight">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeBottomTab"
                          className="absolute -bottom-1 w-5 h-0.5 bg-[#1890FF] rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Toast Notification for AI coming soon */}
          <AnimatePresence>
            {showAiToast && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-2.5 text-xs font-bold backdrop-blur-xl"
              >
                <Sparkles className="w-4 h-4 text-[#1890FF] shrink-0" />
                <span>{language === 'en' ? "✨ AI Assistant update coming soon! We are improving the AI features." : "✨ Asistente IA en optimización: Estamos preparando nuevas funciones para lanzarlo muy pronto."}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── MODALS ─── */}
        <AnimatePresence>
          {showSettingsModal && (
            <SettingsModal
              onClose={() => {
                setShowSettingsModal(false);
                // If user was on /configuracion, go back to inicio
                if (activeTab === "configuracion") {
                  router.push("/comunidad/inicio");
                }
              }}
              userProfile={userProfile}
              onUpgradeClick={() => setShowUpgradeModal(true)}
              language={language}
            />
          )}
        </AnimatePresence>

        <SubscriptionModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlanId={userProfile?.subscription_plan}
        />
      </div>
    </ToastProvider>
  );
}
