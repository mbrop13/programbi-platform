"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldAlert, Menu } from "lucide-react";
import { Loader2 } from "lucide-react";

import Sidebar from "./Sidebar";
import MuroFeed from "./tabs/MuroFeed";
import MisCursos from "./tabs/MisCursos";
import AulaVirtual from "./tabs/AulaVirtual";
import ChatShell from "./ai-v2/ChatShell";
import BusinessPortal from "./tabs/BusinessPortal";
import LivePanel from "./tabs/LivePanel";
import UserProfile from "./tabs/UserProfile";
import Certificates from "./tabs/Certificates";
import SettingsModal from "./SettingsModal";
import { ToastProvider } from "./ui/Toast";

import {
  isCurrentUserAdmin,
  getCurrentUserProfile,
  getCurrentUserManagedOrganization,
} from "@/lib/supabase/comunidad";
import { getMyEnrollments, getAllPublishedCourses } from "@/lib/supabase/comunidad-ai";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  subscription_plan?: string | null;
}

export default function ComunidadPortal() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "inicio";

  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrgManager, setIsOrgManager] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasCourses, setHasCourses] = useState<boolean | null>(null);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  const [courseSlugMap, setCourseSlugMap] = useState<Record<string, string>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

  useEffect(() => {
    const loadUserData = async () => {
      // 1. Read the session synchronously from the browser storage (no network
      //    roundtrip). This lets us populate the sidebar (email/name) almost
      //    instantly instead of showing "??" while the server actions resolve.
      try {
        const browser = createBrowserClient();
        const { data: { session } } = await browser.auth.getSession();
        if (session?.user) {
          setUserProfile({
            id: session.user.id,
            full_name:
              (session.user.user_metadata?.full_name as string | undefined) ||
              session.user.email ||
              "Usuario",
            email: session.user.email || "",
            avatar_url: null,
            role: "student",
            subscription_plan: null,
          });
        }
      } catch (err) {
        console.error("Error reading local session:", err);
      } finally {
        setAuthLoading(false);
      }

      // 2. Full server-side load: validates the session with Supabase and
      //    fetches the complete profile (plan, role, avatar, etc.).
      try {
        const [adminStatus, profile, enrollmentData, orgData, allCourses] = await Promise.all([
          isCurrentUserAdmin(),
          getCurrentUserProfile(),
          getMyEnrollments(),
          getCurrentUserManagedOrganization(),
          getAllPublishedCourses().catch(() => []),
        ]);
        setIsAdmin(adminStatus);
        if (profile) setUserProfile(profile as any);
        setHasCourses(
          (Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments).length > 0
        );
        setIsOrgManager(!!orgData);

        const mapping: Record<string, string> = {};
        if (Array.isArray(allCourses)) {
          allCourses.forEach((c: any) => {
            if (c.slug && c.id) mapping[c.slug] = c.id;
          });
        }
        const enrolls = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;
        if (Array.isArray(enrolls)) {
          enrolls.forEach((e: any) => {
            const slug = e.course?.slug || e.course_slug;
            const id = e.course?.id || e.course_id;
            if (slug && id) mapping[slug] = id;
          });
        }
        setCourseSlugMap(mapping);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    loadUserData();
  }, []);

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

  // Open settings modal when navigating to /comunidad/configuracion
  useEffect(() => {
    if (activeTab === "configuracion") {
      setShowSettingsModal(true);
    }
  }, [activeTab]);

  const hasSubscription = !!userProfile?.subscription_plan;
  const canAccessFull = isAdmin || hasSubscription;

  useEffect(() => {
    if (!isCheckingPlan && !canAccessFull && !hasCourses) {
      router.push("/comunidad");
    }
  }, [isCheckingPlan, canAccessFull, hasCourses, router]);

  const restrictedView = !canAccessFull && hasCourses && activeTab !== "cursos";

  const handleTabChange = (tabId: string) => {
    handleSelectCourse(null);
    router.push(`/comunidad/${tabId}`);
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#f8f9fb]">
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
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {/* ─── MAIN AREA ─── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
          {/* Mobile menu button (floating, top-left) — oculto en el chat IA y en el aula virtual */}
          {(activeTab !== "ai" && !(activeTab === "cursos" && selectedCourseId)) && (
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 shadow-sm hover:shadow-md transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <main className="flex-1 w-full flex flex-col min-h-0">
            {/* ─── LOADING STATE (sidebar visible, content loading) ─── */}
            {isCheckingPlan || (!canAccessFull && !hasCourses) ? (
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
                        />
                      ) : (
                        <MisCursos onSelectCourse={(id) => handleSelectCourse(id)} />
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

                    {activeTab === "perfil" && <UserProfile />}

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
            />
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}
