"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  MessageSquare, 
  Sparkles, 
  GraduationCap, 
  ShieldAlert, 
  LayoutDashboard,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  X,
  Lock
} from "lucide-react";

import MuroFeed from "./tabs/MuroFeed";
import MisCursos from "./tabs/MisCursos";
import AulaVirtual from "./tabs/AulaVirtual";
import ChatGlobal from "./tabs/ChatGlobal";
import AIAsistente from "./tabs/AIAsistente";
import AdminPanel from "./tabs/AdminPanel";
import { isCurrentUserAdmin, getCurrentUserProfile } from "@/lib/supabase/comunidad";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  subscription_plan?: string | null;
}

import SubscriptionGate from "./SubscriptionGate";
import SettingsModal from "./SettingsModal";
import { getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FaqSection from "@/components/marketing/FaqSection";

export default function ComunidadPortal() {
  const router = useRouter();
  const pathname = usePathname();

  // Derive active tab from URL: /comunidad/ai → "ai"
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "inicio";
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasCourses, setHasCourses] = useState<boolean | null>(null);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Fetch admin status and user profile on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [adminStatus, profile, enrollmentData] = await Promise.all([
          isCurrentUserAdmin(),
          getCurrentUserProfile(),
          getMyEnrollments(),
        ]);
        setIsAdmin(adminStatus);
        setUserProfile(profile);
        const enrollments = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;
        setHasCourses(enrollments.length > 0);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    loadUserData();
  }, []);

  // Redirect non-admins away from admin page
  useEffect(() => {
    if (activeTab === "admin" && !isAdmin && userProfile !== null) {
      router.push("/comunidad/inicio");
    }
  }, [activeTab, isAdmin, userProfile, router]);

  // User initials for avatar
  const userInitials = userProfile?.full_name
    ? userProfile.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const tabs = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard, color: "text-blue-500" },
    { id: "cursos", label: "Cursos", icon: GraduationCap, color: "text-indigo-500" },
    { id: "live", label: "Live", icon: Radio, color: "text-rose-500" },
    { id: "chat", label: "Comunidad", icon: MessageSquare, color: "text-emerald-500" },
    { id: "ai", label: "IA", icon: Sparkles, color: "text-purple-500" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: ShieldAlert, color: "text-amber-500" }] : [])
  ];

  const handleTabChange = (tabId: string) => {
    setSelectedCourseId(null);
    setShowMobileNav(false);
    router.push(`/comunidad/${tabId}`);
  };

  const handleSubscribe = (planId: string) => {
    // Aquí implementaremos el flujo con Flow después
    console.log("Subscribing to plan:", planId);
  };

  const hasSubscription = !!userProfile?.subscription_plan;
  const canAccessFull = isAdmin || hasSubscription;
  
  // Usar useEffect para el redirect si no tiene acceso a nada
  useEffect(() => {
    if (!isCheckingPlan && !canAccessFull && !hasCourses) {
       router.push("/comunidad");
    }
  }, [isCheckingPlan, canAccessFull, hasCourses, router]);

  if (isCheckingPlan || (!canAccessFull && !hasCourses)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }


  // LOGIC: No plan, pero SÍ tiene cursos -> Ve la interfaz pero bloqueado excepto en 'cursos'
  const isCursosTab = activeTab === "cursos";
  const restrictedView = !canAccessFull && hasCourses && !isCursosTab;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fb]">
      
      {/* ─── PREMIUM HEADER ─── */}
      <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-[68px] gap-3 lg:gap-6">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center shrink-0 no-underline cursor-pointer group relative">
               <div className="relative w-9 h-9 lg:w-10 lg:h-10 overflow-hidden flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                 <Image 
                   src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" 
                   alt="ProgramBI Logo" 
                   fill 
                   className="object-contain p-1 group-hover:scale-110 transition-transform duration-300" 
                 />
               </div>
            </Link>

            <div className="h-8 w-px bg-gray-200/80 hidden lg:block shrink-0"></div>

            {/* DESKTOP NAV TABS */}
            <nav className="hidden lg:flex items-center h-full gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative font-semibold px-4 py-2 transition-all text-[13px] h-full flex items-center gap-2.5 whitespace-nowrap rounded-lg group
                      ${isActive 
                        ? 'text-brand-blue' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'}
                    `}
                  >
                    <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-brand-blue' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    {tab.label}
                    {tab.id === "live" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-brand-blue rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="flex-1"></div>

            {/* SEARCH */}
            <div className={`relative hidden md:block transition-all duration-300 ${searchFocused ? 'w-80' : 'w-56'}`}>
              <input 
                type="text" 
                placeholder="Buscar en la comunidad..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all placeholder:text-gray-400"
              />
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-brand-blue' : 'text-gray-400'}`} />
            </div>

            {/* NOTIFICATIONS */}
            <button className="relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* USER AVATAR MENU */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitials}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="font-bold text-sm text-gray-900">{userProfile?.full_name || "Usuario"}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{userProfile?.email || ""}</div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                        <User className="w-4 h-4 text-gray-400" /> Mi Perfil
                      </button>
                      <button 
                        onClick={() => { setShowSettingsModal(true); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 text-gray-400" /> Configuración
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium no-underline">
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE HAMBURGER */}
            <button 
              onClick={() => setShowMobileNav(!showMobileNav)} 
              className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
            >
              {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="p-3 flex flex-wrap gap-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${isActive 
                          ? 'bg-brand-blue text-white shadow-sm' 
                          : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

    {/* ─── PAGE CONTENT ─── */}
      <main className="flex-1 w-full flex flex-col min-h-0">
        {activeTab === "ai" ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <AIAsistente isRestricted={!!restrictedView} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (selectedCourseId || "")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                  {activeTab === "inicio" && <MuroFeed isRestricted={!!restrictedView} />}
                  
                  {activeTab === "cursos" && (
                    selectedCourseId ? (
                      <AulaVirtual courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />
                    ) : (
                      <MisCursos onSelectCourse={(id) => setSelectedCourseId(id)} />
                    )
                  )}
                
                  {activeTab === "live" && (
                    <div className="relative">
                      {restrictedView && (
                        <div className="absolute inset-0 z-50 rounded-3xl bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 border border-white/20">
                           <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-blue">
                             <Lock className="w-8 h-8" />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 mb-2">Sección Premium</h3>
                           <p className="text-gray-600 text-center max-w-sm mb-6">Suscríbete a un plan de la comunidad para poder asistir a las Masterclasses semanales en vivo.</p>
                           <button onClick={() => router.push("/comunidad")} className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">Ver Planes</button>
                        </div>
                      )}
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-2xl mx-auto mt-8">
                        <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Radio className="w-10 h-10 text-rose-500" />
                        </div>
                        <h2 className="font-display font-black text-2xl text-gray-900 mb-3">Masterclasses Live</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">Sesiones en vivo con expertos en Data Analytics, SQL, Python y Power BI. Próximamente los horarios de la siguiente sesión.</p>
                        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 font-bold text-sm px-4 py-2 rounded-full">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                          Próxima sesión: Viernes 8PM CST
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "chat" && <ChatGlobal isRestricted={!!restrictedView} />}
                {activeTab === "admin" && (
                  isAdmin ? (
                    <AdminPanel />
                  ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-2xl mx-auto mt-8">
                      <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-amber-500" />
                      </div>
                      <h2 className="font-display font-black text-2xl text-gray-900 mb-3">Acceso Restringido</h2>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">Esta sección está disponible solo para administradores de la plataforma.</p>
                      <button onClick={() => router.push("/comunidad/inicio")} className="bg-brand-blue text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-sm">
                        Volver al Inicio
                      </button>
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showSettingsModal && (
          <SettingsModal 
            onClose={() => setShowSettingsModal(false)} 
            userProfile={userProfile} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
