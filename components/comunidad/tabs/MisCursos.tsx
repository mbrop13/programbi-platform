"use client";

import { PlayCircle, Clock, CheckCircle, Layers, GraduationCap, BookOpen, Lock, Sparkles, Eye, ShoppingCart, ChevronRight, Zap, Timer, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllPublishedCourses, getMyEnrollments } from "@/lib/supabase/comunidad-ai";
import { cn } from "@/lib/utils";

interface CourseWithAccess {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  badge_label: string | null;
  badge_color: string | null;
  tech_stack: string[];
  duration_hours: number;
  level: string;
  image_url: string;
  icon: string;
  accent_color: string;
  is_featured: boolean;
  sort_order: number;
  access_type: 'full' | 'trial' | 'free' | null;
  price_clp: number;
  lesson_count?: number;
  latest_lesson_at?: string | null;
}

interface ProgramGroup {
  category: string;
  courses: CourseWithAccess[];
  activeCourses: number;
  totalLessons: number;
}

interface EnrollmentItem {
  course_slug: string;
  access_type: 'full' | 'trial' | 'free' | null;
  course?: {
    category?: string;
    lesson_count?: number;
    latest_lesson_at?: string | null;
  };
}

interface PublicCourse {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  badge_label: string | null;
  badge_color: string | null;
  tech_stack: string[];
  duration_hours: number;
  level: string;
  image_url: string;
  icon: string;
  accent_color: string;
  is_featured: boolean;
  sort_order: number;
  price_clp: number;
}

interface TranslationDict {
  title: string;
  subtitle: string;
  myCourses: string;
  allCourses: string;
  courseActive: string;
  courseTrial: string;
  courseLocked: string;
  coursePrep: string;
  comingSoon: string;
  continue: string;
  clpPrice: string;
  consultPrice: string;
  program: string;
  lessons: string;
  unlockedText: string;
  emptyTitle: string;
  emptyDesc: string;
  emptyBtn: string;
  recentNew: string;
  loadingText: string;
  lockedSubtitle: string;
  preparationText: string;
  turnText: string;
}

const tc: Record<'es' | 'en', TranslationDict> = {
  es: {
    title: "Mi Aprendizaje",
    subtitle: "Desarrolla tus habilidades y especialízate en ciencia y análisis de datos.",
    myCourses: "Mis Cursos",
    allCourses: "Todos los Cursos",
    courseActive: "Activo",
    courseTrial: "Prueba Gratuita",
    courseLocked: "Bloqueado",
    coursePrep: "En preparación",
    comingSoon: "Próximamente",
    continue: "Continuar",
    clpPrice: "Comprar curso",
    consultPrice: "Consultar precio",
    program: "Programa",
    lessons: "clases",
    unlockedText: "del programa desbloqueado",
    emptyTitle: "Comienza tu aprendizaje",
    emptyDesc: "Aún no tienes cursos activos. Explora el catálogo y comienza tu viaje en datos.",
    emptyBtn: "Ver catálogo",
    recentNew: "Nuevo",
    loadingText: "Cargando catálogo...",
    lockedSubtitle: "Solicita acceso al administrador",
    preparationText: "Las clases llegarán pronto",
    turnText: "Se desbloqueará en tu turno"
  },
  en: {
    title: "My Learning",
    subtitle: "Develop your skills and specialize in data science and analytics.",
    myCourses: "My Courses",
    allCourses: "All Courses",
    courseActive: "Active",
    courseTrial: "Free Trial",
    courseLocked: "Locked",
    coursePrep: "In preparation",
    comingSoon: "Coming Soon",
    continue: "Continue",
    clpPrice: "Buy course",
    consultPrice: "Consult price",
    program: "Program",
    lessons: "lessons",
    unlockedText: "of the program unlocked",
    emptyTitle: "Start your learning journey",
    emptyDesc: "You don't have active courses yet. Explore the catalog and start your journey in data.",
    emptyBtn: "View catalog",
    recentNew: "New",
    loadingText: "Loading catalog...",
    lockedSubtitle: "Request access from the administrator",
    preparationText: "Classes coming soon",
    turnText: "Will unlock in your turn"
  }
};

export default function MisCursos({ onSelectCourse, language }: { onSelectCourse: (id: string) => void; language?: 'es' | 'en' }) {
  const activeLanguage = language || "es";
  const t = tc[activeLanguage];

  const [standaloneCourses, setStandaloneCourses] = useState<CourseWithAccess[]>([]);
  const [programs, setPrograms] = useState<ProgramGroup[]>([]);
  const [allCoursesFlat, setAllCoursesFlat] = useState<CourseWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [buyingCourseId, setBuyingCourseId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
     async function loadData() {
         try {
             const [allCourses, enrollmentData] = await Promise.all([
               getAllPublishedCourses(),
               getMyEnrollments(),
             ]);

             // Handle both old (array) and new (object) return format
             const myEnrollments = (Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments) as EnrollmentItem[];
             const programSiblings = (Array.isArray(enrollmentData) ? [] : enrollmentData.programSiblings) as PublicCourse[];

             // Merge public courses with enrollment data
             const merged: CourseWithAccess[] = (allCourses as PublicCourse[]).map((course) => {
               const enrollment = myEnrollments.find((e) => e.course_slug === course.slug);
               return {
                 ...course,
                 access_type: enrollment?.access_type || null,
                 lesson_count: enrollment?.course?.lesson_count || 0,
                 latest_lesson_at: enrollment?.course?.latest_lesson_at || null,
               };
             });

             // Inject hidden enrolled courses (not in public catalog)
             for (const e of myEnrollments) {
               if (!merged.some(c => c.slug === e.course_slug) && e.course) {
                 const mappedCourse = e.course as unknown as PublicCourse;
                 merged.push({
                   ...mappedCourse,
                   access_type: e.access_type,
                   lesson_count: e.course.lesson_count || 0,
                   latest_lesson_at: e.course.latest_lesson_at || null,
                 });
               }
             }

             // Inject program siblings that the user is NOT enrolled in (for "Próximamente" cards)
             for (const sib of programSiblings) {
               if (!merged.some(c => c.slug === sib.slug)) {
                 const hasEnrolledSibling = myEnrollments.some(
                   (e) => e.course?.category === sib.category
                 );
                 if (hasEnrolledSibling) {
                   merged.push({
                     ...sib,
                     access_type: null,
                   } as unknown as CourseWithAccess);
                 }
               }
             }

             // Group by category for programs
             const categoryMap: Record<string, CourseWithAccess[]> = {};
             const ungrouped: CourseWithAccess[] = [];

             for (const c of merged) {
               if (!c.category) { ungrouped.push(c); continue; }
               if (!categoryMap[c.category]) categoryMap[c.category] = [];
               categoryMap[c.category].push(c);
             }

             const programGroups: ProgramGroup[] = [];
             const standalone: CourseWithAccess[] = [...ungrouped];

             for (const [cat, catCourses] of Object.entries(categoryMap)) {
               const hasEnrolled = catCourses.some(c => c.access_type !== null);
               if (catCourses.length >= 2 && hasEnrolled) {
                 const sorted = [...catCourses].sort((a, b) => {
                   if (a.access_type && !b.access_type) return -1;
                   if (!a.access_type && b.access_type) return 1;
                   if (a.latest_lesson_at && b.latest_lesson_at) {
                     return new Date(b.latest_lesson_at).getTime() - new Date(a.latest_lesson_at).getTime();
                   }
                   if (a.latest_lesson_at && !b.latest_lesson_at) return -1;
                   if (!a.latest_lesson_at && b.latest_lesson_at) return 1;
                   return (a.sort_order || 0) - (b.sort_order || 0);
                 });

                 programGroups.push({
                   category: cat,
                   courses: sorted,
                   activeCourses: catCourses.filter(c => c.access_type !== null).length,
                   totalLessons: catCourses.reduce((sum, c) => sum + (c.lesson_count || 0), 0),
                 });
               } else {
                 standalone.push(...catCourses);
               }
             }

             setPrograms(programGroups);
             setStandaloneCourses(standalone);
             setAllCoursesFlat(merged);
         } catch (e) {
             console.error("Error loading courses", e);
         } finally {
             setLoading(false);
         }
     }
     loadData();
  }, []);

  const activeCoursesList = allCoursesFlat.filter(c => c.access_type !== null);

  const filteredStandalone = standaloneCourses.filter(c => {
    if (filter === 'active') return c.access_type !== null;
    return true;
  }).sort((a, b) => {
    if (a.access_type && !b.access_type) return -1;
    if (!a.access_type && b.access_type) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const filteredPrograms = programs.filter(p => {
    if (filter === 'active') return p.activeCourses > 0;
    return true;
  });

  const handleBuyCourse = async (courseId: string) => {
    setBuyingCourseId(courseId);
    try {
      const res = await fetch('/api/mp/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar');
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al procesar el pago';
      alert(message);
      setBuyingCourseId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
       {/* ─── HEADER ─── */}
       <div className="mb-10 select-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5.5 h-5.5 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight leading-tight">{t.title}</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">{t.subtitle}</p>
            </div>
          </div>
       </div>

       {/* ─── FILTER TABS ─── */}
       <div className="flex items-center gap-2 mb-8 select-none">
         {[
           { id: 'active' as const, label: t.myCourses, count: activeCoursesList.length },
           { id: 'all' as const, label: t.allCourses, count: allCoursesFlat.length },
         ].map(tab => {
           const isActive = filter === tab.id;
           return (
             <button 
               key={tab.id} 
               onClick={() => setFilter(tab.id)}
               className={cn(
                 "relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer flex items-center gap-2",
                 isActive
                   ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm"
                   : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
               )}
             >
               <span>{tab.label}</span>
               <span className={cn(
                 "text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors",
                 isActive ? "bg-white/20 text-white dark:bg-black/10 dark:text-black" : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
               )}>
                 {tab.count}
               </span>
             </button>
           );
         })}
       </div>

       {/* ─── CONTENT ─── */}
       {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/80 overflow-hidden animate-pulse shadow-sm">
                <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-900" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-900 rounded-lg w-3/4" />
                  <div className="h-3 bg-neutral-150 dark:bg-neutral-900 rounded-lg w-1/2" />
                  <div className="h-2.5 bg-neutral-150 dark:bg-neutral-900 rounded-full w-full" />
                </div>
              </div>
            ))}
          </div>
       ) : (filteredPrograms.length === 0 && filteredStandalone.length === 0) ? (
          <div className="bg-white dark:bg-neutral-950 rounded-3xl p-16 text-center border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm max-w-lg mx-auto select-none mt-12">
             <div className="relative w-20 h-20 mx-auto mb-6">
               <div className="w-full h-full rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                 <GraduationCap className="w-9 h-9 text-neutral-500" />
               </div>
               <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-orange-100 dark:bg-orange-950/60 rounded-full flex items-center justify-center border border-white dark:border-neutral-900">
                 <Sparkles className="w-3.5 h-3.5 text-orange-600" />
               </div>
             </div>
             <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white mb-2">
               {t.emptyTitle}
             </h3>
             <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
               {t.emptyDesc}
             </p>
             <button
               onClick={() => setFilter('all')}
               className="bg-neutral-900 hover:bg-neutral-955 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-xs font-bold px-5 py-2.5 rounded-full border-0 cursor-pointer shadow-sm transition-all"
             >
               {t.emptyBtn}
             </button>
          </div>
       ) : (
        <div className="space-y-12">
           {/* ─── PROGRAMS ─── */}
           {filteredPrograms.map((program) => (
             <ProgramCard key={program.category} program={program} onSelectCourse={onSelectCourse} translations={t} />
           ))}

           {/* ─── STANDALONE COURSES ─── */}
           {filteredStandalone.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredStandalone.map((curso) => (
                 <StandaloneCourseCard 
                   key={curso.id} 
                   curso={curso} 
                   onSelectCourse={onSelectCourse}
                   onBuyCourse={handleBuyCourse}
                   buyingCourseId={buyingCourseId}
                   translations={t}
                 />
               ))}
             </div>
           )}
        </div>
       )}

       {/* Payment notification */}
       {paymentStatus && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55 select-none">
           <div className={cn(
             "flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl font-bold text-xs text-white",
             paymentStatus === 'success' ? 'bg-emerald-500' :
             paymentStatus === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
           )}>
             {paymentStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : 
              paymentStatus === 'pending' ? <Clock className="w-4 h-4" /> : 
              <Lock className="w-4 h-4" />}
             
             {paymentStatus === 'success' ? '¡Pago exitoso! Tu curso ya está activo.' :
              paymentStatus === 'pending' ? 'Pago pendiente. Se activará cuando se confirme.' :
              paymentStatus === 'rejected' ? 'El pago fue rechazado. Intenta de nuevo.' :
              paymentStatus === 'cancelled' ? 'Pago cancelado.' : 'Error en el pago.'}
             
             <button 
               onClick={() => router.replace('/comunidad/cursos')} 
               className="ml-3 p-1 hover:bg-white/20 rounded-lg transition-colors border-0 bg-transparent text-white cursor-pointer"
             >
               <X className="w-3.5 h-3.5" />
             </button>
           </div>
         </div>
       )}
    </div>
  );
}

// ─── PROGRAM CARD ───
function ProgramCard({ program, onSelectCourse, translations }: { 
  program: ProgramGroup; 
  onSelectCourse: (id: string) => void;
  translations: TranslationDict;
}) {
  const progressPercent = program.courses.length > 0 
    ? Math.round((program.activeCourses / program.courses.length) * 100) 
    : 0;

  return (
    <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden bg-white dark:bg-neutral-950 shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all">
      {/* Program Header */}
      <div className="relative px-6 sm:px-8 py-7 overflow-hidden border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10">
        <div className="flex items-center justify-between relative z-10 select-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 shadow-sm shrink-0">
              <Layers className="w-5.5 h-5.5 text-white dark:text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {translations.program}
                </span>
                <span className="text-[10px] font-bold text-neutral-400">
                  {program.activeCourses}/{program.courses.length} {translations.myCourses.toLowerCase()}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white leading-tight">
                {program.category}
              </h2>
            </div>
          </div>
          <div className="text-right hidden sm:block shrink-0">
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">{program.totalLessons}</div>
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{translations.lessons}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 relative z-10 select-none">
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-semibold text-neutral-400 mt-2">
            {progressPercent}% {translations.unlockedText}
          </div>
        </div>
      </div>

      {/* Sub-courses grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {program.courses.map((curso) => {
          const isActive = curso.access_type !== null;
          const hasLessons = (curso.lesson_count || 0) > 0;
          const isComingSoon = !isActive;

          return (
            <div
              key={curso.id}
              onClick={() => isActive && hasLessons && onSelectCourse(curso.id)}
              className={cn(
                "relative rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between",
                isActive && hasLessons
                  ? 'border-neutral-200/80 bg-neutral-50/20 hover:bg-neutral-50 dark:border-neutral-800/80 dark:hover:bg-neutral-900/30 cursor-pointer group'
                  : isActive && !hasLessons
                    ? 'border-neutral-200 bg-neutral-50/10 cursor-default opacity-85'
                    : 'border-dashed border-neutral-200/80 dark:border-neutral-800/60 bg-transparent cursor-default opacity-60'
              )}
            >
              <div>
                {/* Tech Badges */}
                <div className="flex items-center justify-between mb-3.5 select-none">
                  <div className="flex flex-wrap gap-1.5">
                    {curso.tech_stack?.slice(0, 2).map((tech, i) => (
                      <span key={i} className="text-[9px] font-bold bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400 px-2 py-0.5 rounded-md uppercase tracking-wide">{tech}</span>
                    ))}
                  </div>
                  {isActive && hasLessons && (
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-emerald-500/5 dark:text-emerald-400">
                      <CheckCircle className="w-2.5 h-2.5" /> {translations.courseActive}
                    </span>
                  )}
                  {isActive && !hasLessons && (
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-blue-500/5 dark:text-blue-400">
                      <Timer className="w-2.5 h-2.5" /> {translations.coursePrep}
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-neutral-900 dark:text-neutral-500">
                      <Lock className="w-2.5 h-2.5" /> {translations.comingSoon}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={cn(
                  "font-bold text-sm leading-snug mb-2.5 transition-colors",
                  isActive && hasLessons ? 'text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'
                )}>
                  {curso.title}
                </h3>

                {/* Short description */}
                {curso.short_description && (
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2 mb-4">{curso.short_description}</p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between mt-auto select-none">
                {isActive && hasLessons ? (
                  <>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-405 font-medium">
                      <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {curso.lesson_count} {translations.lessons}</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-900 dark:text-white flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      {translations.continue} <ChevronRight className="w-3 h-3" />
                    </span>
                  </>
                ) : isActive && !hasLessons ? (
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-neutral-500" /> {translations.preparationText}
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> {translations.turnText}
                  </div>
                )}
              </div>

              {/* New lessons indicator */}
              {isActive && hasLessons && curso.latest_lesson_at && (
                (() => {
                  const diff = Date.now() - new Date(curso.latest_lesson_at).getTime();
                  const isRecent = diff < 7 * 24 * 60 * 60 * 1000;
                  if (!isRecent) return null;
                  return (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-800 dark:bg-white"></span>
                      </span>
                    </div>
                  );
                })()
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STANDALONE COURSE CARD ───
function StandaloneCourseCard({ curso, onSelectCourse, onBuyCourse, buyingCourseId, translations }: {
  curso: CourseWithAccess;
  onSelectCourse: (id: string) => void;
  onBuyCourse: (id: string) => void;
  buyingCourseId: string | null;
  translations: TranslationDict;
}) {
  const isLocked = curso.access_type === null;
  const isTrial = curso.access_type === 'trial';

  return (
    <div 
      onClick={() => !isLocked && onSelectCourse(curso.id)}
      className={cn(
        "group bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col h-full relative",
        isLocked 
          ? 'border-neutral-200/80 dark:border-neutral-800/80 opacity-75 hover:opacity-90' 
          : isTrial
            ? 'border-amber-200 hover:shadow-lg dark:border-amber-900/60 dark:hover:border-amber-800 cursor-pointer active:scale-[0.99]'
            : 'border-neutral-200/80 hover:shadow-lg hover:border-neutral-300 dark:border-neutral-800/80 dark:hover:border-neutral-700 cursor-pointer active:scale-[0.99]'
      )}
    >
       {/* Thumbnail */}
       <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0 select-none">
          {isLocked && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shadow-md mb-2.5 border border-white/10">
                <Lock className="w-5.5 h-5.5 text-white" />
              </div>
              <span className="text-white font-bold text-xs uppercase tracking-wider">{translations.courseLocked}</span>
              <span className="text-white/60 text-[10px] mt-0.5 font-medium">{translations.lockedSubtitle}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 transition-colors" />
          
          <Image 
            src={curso.image_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800"} 
            alt={curso.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              !isLocked ? "group-hover:scale-103" : "grayscale-[40%]"
            )}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            {isTrial && (
              <span className="bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Eye className="w-2.5 h-2.5" /> {translations.courseTrial}
              </span>
            )}
            {curso.access_type === 'full' && (
              <span className="bg-neutral-900 text-white dark:bg-white dark:text-black text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <CheckCircle className="w-2.5 h-2.5" /> {translations.courseActive.toUpperCase()}
              </span>
            )}
            {curso.badge_label && !isTrial && (
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md text-white"
                style={{ backgroundColor: curso.badge_color || '#1890FF' }}>
                {curso.badge_label}
              </span>
            )}
          </div>

          {!isLocked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                <PlayCircle className="w-6.5 h-6.5 text-neutral-900" />
              </div>
            </div>
          )}
       </div>

       {/* Info */}
       <div className="p-5 flex flex-col flex-1">
          {curso.tech_stack && curso.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 select-none">
              {curso.tech_stack.map((tech: string, i: number) => (
                <span key={i} className="text-[9px] font-bold bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400 px-2 py-0.5 rounded-md uppercase tracking-wide">{tech}</span>
              ))}
            </div>
          )}
          
          <h3 className={cn(
            "font-bold text-[16px] mb-2 leading-snug line-clamp-2 transition-colors",
            isLocked ? "text-neutral-500" : "text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-neutral-200"
          )}>
            {curso.title}
          </h3>
          
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mb-4 line-clamp-2 leading-relaxed">
             {curso.short_description}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 select-none">
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {curso.duration_hours}h</span>
              <span className="capitalize">{curso.level}</span>
            </div>

            {isLocked ? (
              curso.price_clp && curso.price_clp > 0 ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); onBuyCourse(curso.id); }}
                  disabled={buyingCourseId === curso.id}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 px-3.5 py-1.5 rounded-full border-0 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                >
                  {buyingCourseId === curso.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                  ${(curso.price_clp).toLocaleString('es-CL')}
                </button>
              ) : (
                <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-full">
                  <Lock className="w-3 h-3 inline mr-1" /> {translations.consultPrice}
                </span>
              )
            ) : isTrial ? (
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-3 py-1.5 rounded-full">
                {translations.courseTrial}
              </span>
            ) : (
              <button className="text-[11px] font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 px-3.5 py-1.5 rounded-full transition-colors border-0 cursor-pointer">
                {translations.continue} →
              </button>
            )}
          </div>
       </div>
    </div>
  );
}
