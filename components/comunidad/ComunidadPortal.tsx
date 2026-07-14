"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Menu } from "lucide-react";
import { Loader2 } from "lucide-react";

import Sidebar from "./Sidebar";
import { ToastProvider } from "./ui/Toast";
import { useCommunity } from "./CommunityProvider";

// ─── SKELETON LOADERS FOR SMOOTH TAB TRANSITIONS ───

const MuroFeedSkeleton = () => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="lg:col-span-8 space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3" />
        </div>
        <div className="h-16 bg-gray-100 dark:bg-zinc-850 rounded-2xl w-full" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-2">
                <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md w-32" />
                <div className="h-2.5 bg-gray-100 dark:bg-zinc-850 rounded-md w-20" />
              </div>
            </div>
            <div className="h-24 bg-gray-100 dark:bg-zinc-850 rounded-2xl w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
    <div className="hidden lg:block lg:col-span-4 space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded-md w-1/2" />
        <div className="h-48 bg-gray-100 dark:bg-zinc-850 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);

const MisCursosSkeleton = () => (
  <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded-md w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="aspect-[16/10] bg-gray-200 dark:bg-zinc-800" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-lg w-3/4" />
            <div className="h-3 bg-gray-150 dark:bg-zinc-850 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LivePanelSkeleton = () => (
  <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
      <div className="space-y-4 flex-1">
        <div className="h-3 bg-blue-200 dark:bg-zinc-700 rounded-md w-28" />
        <div className="h-7 bg-gray-300 dark:bg-zinc-700 rounded-md w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-5/6" />
      </div>
      <div className="w-full md:w-[320px] aspect-video bg-gray-200 dark:bg-zinc-800 rounded-2xl shrink-0" />
    </div>
    <div className="space-y-4">
      <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded-md w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2].map((y) => (
          <div key={y} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm space-y-4 pb-5">
            <div className="w-full aspect-video bg-gray-200 dark:bg-zinc-800" />
            <div className="px-5 space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-md w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Lazy-loaded tabs: only the active tab's code is downloaded ──
const MuroFeed = dynamic(() => import("./tabs/MuroFeed"), {
  loading: MuroFeedSkeleton,
});
const MisCursos = dynamic(() => import("./tabs/MisCursos"), {
  loading: MisCursosSkeleton,
});
const AulaVirtual = dynamic(() => import("./tabs/AulaVirtual"), {
  loading: () => <div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>,
});
const ChatShell = dynamic(() => import("./ai-v2/ChatShell"), {
  loading: () => <div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>,
});
const BusinessPortal = dynamic(() => import("./tabs/BusinessPortal"), {
  loading: () => <div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>,
});
const LivePanel = dynamic(() => import("./tabs/LivePanel"), {
  loading: LivePanelSkeleton,
});
const Certificates = dynamic(() => import("./tabs/Certificates"), {
  loading: () => <div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>,
});
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

  const restrictedView = !canAccessFull && hasCourses && activeTab !== "cursos";

  const handleTabChange = (tabId: string) => {
    handleSelectCourse(null);
    if (tabId === "ai") {
      router.push("/ai");
    } else {
      router.push(`/comunidad/${tabId}`);
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen transition-colors duration-200 bg-[#f8f9fb] dark:bg-black text-neutral-900 dark:text-neutral-100">
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
          />
        )}

        {/* ─── MAIN AREA ─── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
          {/* Mobile Header Bar — visible only on small viewports and hidden in AI/Course pages */}
          {(activeTab !== "ai" && !(activeTab === "cursos" && selectedCourseId)) && (
            <header className="lg:hidden sticky top-0 z-35 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-900/80 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-none cursor-pointer"
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
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm cursor-pointer border-none transition-transform active:scale-95"
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
                <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
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
                  <ChatShell
                    isRestricted={!!restrictedView}
                    userName={userProfile?.full_name}
                    avatarUrl={userProfile?.avatar_url ?? null}
                    subscriptionPlan={userProfile?.subscription_plan}
                    isAdmin={isAdmin}
                  />
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
              <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
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
                          <div className="absolute inset-0 z-50 rounded-3xl bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 border border-white/20">
                            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-blue">
                              <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              Sección Premium
                            </h3>
                            <p className="text-gray-600 text-center max-w-sm mb-6">
                              Suscríbete a un plan de la comunidad para asistir a las Masterclasses semanales en vivo.
                            </p>
                            <button
                              onClick={() => router.push("/comunidad")}
                              className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                              Ver Planes
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
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-2xl mx-auto mt-8">
                          <h2 className="font-display font-black text-2xl text-gray-900 mb-3">
                            Acceso Restringido
                          </h2>
                          <p className="text-gray-500 mb-6">
                            Esta sección está disponible únicamente para gestores corporativos.
                          </p>
                        </div>
                      ))}

                    {activeTab === "certificados" && <Certificates />}

                    {activeTab === "configuracion" && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto">
                        <h2 className="font-display font-bold text-xl text-gray-900 mb-2">
                          Configuración
                        </h2>
                        <p className="text-gray-500 mb-4">
                          Gestiona tu cuenta, suscripción y preferencias.
                        </p>
                        <button
                          onClick={() => setShowSettingsModal(true)}
                          className="bg-brand-blue text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
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
