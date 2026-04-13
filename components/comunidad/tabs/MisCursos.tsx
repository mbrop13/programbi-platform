import { PlayCircle, Clock, CheckCircle, TrendingUp, Search, Layers, Loader2, GraduationCap, Flame, BookOpen, Lock, Sparkles, Eye, ShoppingCart, XCircle, ChevronRight, Zap, Timer } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllPublishedCourses, getMyEnrollments } from "@/lib/supabase/comunidad-ai";

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

export default function MisCursos({ onSelectCourse }: { onSelectCourse: (id: string) => void }) {
  const [standaloneCourses, setStandaloneCourses] = useState<CourseWithAccess[]>([]);
  const [programs, setPrograms] = useState<ProgramGroup[]>([]);
  const [allCoursesFlat, setAllCoursesFlat] = useState<CourseWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState("");
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
             const myEnrollments = Array.isArray(enrollmentData) ? enrollmentData : enrollmentData.enrollments;
             const programSiblings = Array.isArray(enrollmentData) ? [] : enrollmentData.programSiblings;

             // Build a set of enrolled slugs
             const enrolledSlugs = new Set(myEnrollments.map((e: any) => e.course_slug));

             // Merge public courses with enrollment data
             const merged: CourseWithAccess[] = allCourses.map((course: any) => {
               const enrollment = myEnrollments.find((e: any) => e.course_slug === course.slug);
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
                 merged.push({
                   ...e.course,
                   access_type: e.access_type,
                   lesson_count: e.course.lesson_count || 0,
                   latest_lesson_at: e.course.latest_lesson_at || null,
                 });
               }
             }

             // Inject program siblings that the user is NOT enrolled in (for "Próximamente" cards)
             for (const sib of programSiblings) {
               if (!merged.some(c => c.slug === sib.slug)) {
                 // Only inject if the user has at least one enrollment in the same category
                 const hasEnrolledSibling = myEnrollments.some(
                   (e: any) => e.course?.category === sib.category
                 );
                 if (hasEnrolledSibling) {
                   merged.push({
                     ...sib,
                     access_type: null, // Not enrolled
                   });
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
               // Only group as "program" if there are 2+ courses AND at least one is enrolled
               const hasEnrolled = catCourses.some(c => c.access_type !== null);
               if (catCourses.length >= 2 && hasEnrolled) {
                 // Sort: courses with latest lessons first, then enrolled, then locked
                 const sorted = [...catCourses].sort((a, b) => {
                   // Active first
                   if (a.access_type && !b.access_type) return -1;
                   if (!a.access_type && b.access_type) return 1;
                   // Among active, latest lesson first
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

  const activeCourses = allCoursesFlat.filter(c => c.access_type !== null);
  const lockedCourses = allCoursesFlat.filter(c => c.access_type === null);
  const trialCourses = allCoursesFlat.filter(c => c.access_type === 'trial');

  // Filter standalone courses
  const filteredStandalone = standaloneCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'active') return matchSearch && c.access_type !== null;
    if (filter === 'locked') return matchSearch && c.access_type === null;
    return matchSearch;
  }).sort((a, b) => {
    if (a.access_type && !b.access_type) return -1;
    if (!a.access_type && b.access_type) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const matchSearch = p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courses.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filter === 'active') return matchSearch && p.activeCourses > 0;
    if (filter === 'locked') return matchSearch && p.activeCourses === 0;
    return matchSearch;
  });

  const handleBuyCourse = async (courseId: string) => {
    setBuyingCourseId(courseId);
    try {
      const res = await fetch('/api/flow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar');
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || 'Error al procesar el pago');
      setBuyingCourseId(null);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
       {/* ─── HEADER ─── */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">Mi Aprendizaje</h1>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-xl ml-[52px]">Explora tus cursos y programas. El contenido más reciente aparece primero.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
               type="text" 
               placeholder="Buscar curso..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
       </div>

       {/* ─── STAT CARDS ─── */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
           {[
             { icon: GraduationCap, label: "Mis Cursos", value: String(activeCourses.length), color: "text-brand-blue", bg: "bg-blue-50" },
             { icon: Layers, label: "Programas", value: String(programs.length), color: "text-violet-500", bg: "bg-violet-50" },
             { icon: Sparkles, label: "Pruebas", value: String(trialCourses.length), color: "text-amber-500", bg: "bg-amber-50" },
             { icon: Flame, label: "Total", value: String(allCoursesFlat.length), color: "text-rose-500", bg: "bg-rose-50" },
           ].map((stat, i) => {
             const Icon = stat.icon;
             return (
               <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                 className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                     <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                     <div className="text-2xl font-black text-gray-900 leading-none">{stat.value}</div>
                     <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
               </motion.div>
             )
           })}
       </div>

       {/* ─── FILTER TABS ─── */}
       <div className="flex items-center gap-2 mb-6">
         {[
           { id: 'all' as const, label: 'Todos', count: allCoursesFlat.length },
           { id: 'active' as const, label: 'Mis Cursos', count: activeCourses.length },
           { id: 'locked' as const, label: 'Bloqueados', count: lockedCourses.length },
         ].map(tab => (
           <button key={tab.id} onClick={() => setFilter(tab.id)}
             className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
               filter === tab.id
                 ? 'bg-brand-blue text-white shadow-sm'
                 : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}>
             {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
           </button>
         ))}
       </div>

       {/* ─── CONTENT ─── */}
       {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Cargando cursos...</span>
          </div>
       ) : (filteredPrograms.length === 0 && filteredStandalone.length === 0) ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
             <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <GraduationCap className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="font-black text-xl text-gray-900 mb-2">Sin resultados</h3>
             <p className="text-gray-400 text-sm">No se encontraron cursos con ese filtro.</p>
          </motion.div>
       ) : (
       <div className="space-y-8">
          {/* ─── PROGRAMS ─── */}
          {filteredPrograms.map((program, pi) => (
            <ProgramCard key={program.category} program={program} index={pi} onSelectCourse={onSelectCourse} />
          ))}

          {/* ─── STANDALONE COURSES ─── */}
          {filteredStandalone.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStandalone.map((curso, index) => (
                <StandaloneCourseCard 
                  key={curso.id} 
                  curso={curso} 
                  index={index} 
                  onSelectCourse={onSelectCourse}
                  onBuyCourse={handleBuyCourse}
                  buyingCourseId={buyingCourseId}
                />
              ))}
            </div>
          )}
       </div>
       )}

       {/* Payment notification */}
       <AnimatePresence>
         {paymentStatus && (
           <motion.div 
             initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
             className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
             <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl font-semibold text-sm ${
               paymentStatus === 'success' ? 'bg-emerald-500 text-white' :
               paymentStatus === 'pending' ? 'bg-amber-500 text-white' :
               'bg-red-500 text-white'}`}>
               {paymentStatus === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                paymentStatus === 'pending' ? <Clock className="w-5 h-5" /> : 
                <XCircle className="w-5 h-5" />}
               {paymentStatus === 'success' ? '¡Pago exitoso! Tu curso ya está activo.' :
                paymentStatus === 'pending' ? 'Pago pendiente. Se activará cuando se confirme.' :
                paymentStatus === 'rejected' ? 'El pago fue rechazado. Intenta de nuevo.' :
                paymentStatus === 'cancelled' ? 'Pago cancelado.' : 'Error en el pago.'}
               <button onClick={() => router.replace('/comunidad/cursos')} className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors">
                 <XCircle className="w-4 h-4" />
               </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}

// ─── PROGRAM CARD ───
function ProgramCard({ program, index, onSelectCourse }: { program: ProgramGroup; index: number; onSelectCourse: (id: string) => void }) {
  const progressPercent = program.courses.length > 0 
    ? Math.round((program.activeCourses / program.courses.length) * 100) 
    : 0;

  // Pick the accent color from the first active course
  const primaryColor = program.courses.find(c => c.access_type)?.accent_color || '#1890FF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
    >
      {/* Program Header */}
      <div 
        className="relative px-6 sm:px-8 py-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor}08 0%, ${primaryColor}15 100%)` }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.07]" 
          style={{ background: primaryColor, filter: 'blur(60px)' }} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)` }}>
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: primaryColor }}>
                  Programa
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  {program.activeCourses}/{program.courses.length} cursos activos
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-gray-900 leading-tight">
                {program.category}
              </h2>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-black" style={{ color: primaryColor }}>{program.totalLessons}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Clases</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 relative z-10">
          <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          <div className="text-[10px] font-bold text-gray-400 mt-1.5">
            {progressPercent}% del programa desbloqueado
          </div>
        </div>
      </div>

      {/* Sub-courses grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {program.courses.map((curso, ci) => {
          const isActive = curso.access_type !== null;
          const hasLessons = (curso.lesson_count || 0) > 0;
          const isComingSoon = !isActive;

          return (
            <motion.div
              key={curso.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ci * 0.06 }}
              onClick={() => isActive && hasLessons && onSelectCourse(curso.id)}
              className={`relative rounded-2xl border p-5 transition-all duration-200 flex flex-col
                ${isActive && hasLessons
                  ? 'border-gray-100 bg-white hover:shadow-lg hover:border-blue-200 cursor-pointer group'
                  : isActive && !hasLessons
                    ? 'border-gray-100 bg-gray-50/50 cursor-default'
                    : 'border-dashed border-gray-200 bg-gray-50/30 cursor-default opacity-60'
                }`}
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {curso.tech_stack?.slice(0, 2).map((tech, i) => (
                    <span key={i} className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-wide">{tech}</span>
                  ))}
                </div>
                {isActive && hasLessons && (
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Activo
                  </span>
                )}
                {isActive && !hasLessons && (
                  <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Timer className="w-2.5 h-2.5" /> En preparación
                  </span>
                )}
                {isComingSoon && (
                  <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Próximamente
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className={`font-bold text-sm leading-snug mb-2 transition-colors
                ${isActive && hasLessons ? 'text-gray-900 group-hover:text-brand-blue' : 'text-gray-400'}`}>
                {curso.title}
              </h3>

              {/* Short description */}
              {curso.short_description && (
                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-3">{curso.short_description}</p>
              )}

              {/* Footer */}
              <div className="mt-auto pt-3 border-t border-gray-100/80 flex items-center justify-between">
                {isActive && hasLessons ? (
                  <>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {curso.lesson_count} clases</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand-blue flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      Continuar <ChevronRight className="w-3 h-3" />
                    </span>
                  </>
                ) : isActive && !hasLessons ? (
                  <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-blue-400" /> Las clases llegarán pronto
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Se desbloqueará cuando sea tu turno
                  </div>
                )}
              </div>

              {/* New lessons indicator */}
              {isActive && hasLessons && curso.latest_lesson_at && (
                (() => {
                  const diff = Date.now() - new Date(curso.latest_lesson_at).getTime();
                  const isRecent = diff < 7 * 24 * 60 * 60 * 1000; // 7 days
                  if (!isRecent) return null;
                  return (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span>
                      </span>
                    </div>
                  );
                })()
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── STANDALONE COURSE CARD ───
function StandaloneCourseCard({ curso, index, onSelectCourse, onBuyCourse, buyingCourseId }: {
  curso: CourseWithAccess;
  index: number;
  onSelectCourse: (id: string) => void;
  onBuyCourse: (id: string) => void;
  buyingCourseId: string | null;
}) {
  const isLocked = curso.access_type === null;
  const isTrial = curso.access_type === 'trial';

  return (
    <motion.div 
      key={curso.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => !isLocked && onSelectCourse(curso.id)}
      className={`group bg-white rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col h-full relative
        ${isLocked 
          ? 'border-gray-200 opacity-70 cursor-default hover:opacity-90' 
          : isTrial
            ? 'border-amber-200 hover:shadow-xl hover:border-amber-300 cursor-pointer ring-2 ring-amber-100'
            : 'border-gray-100 hover:shadow-xl hover:border-brand-blue/15 cursor-pointer'}`}
    >
       {/* Thumbnail */}
       <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0">
          {isLocked && (
            <div className="absolute inset-0 z-30 bg-gray-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl mb-3">
                <Lock className="w-7 h-7 text-gray-400" />
              </div>
              <span className="text-white font-bold text-sm">Curso Bloqueado</span>
              <span className="text-white/60 text-xs mt-1">Solicita acceso al administrador</span>
            </div>
          )}
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 ${!isLocked ? 'group-hover:from-black/20' : ''} transition-colors`}></div>
          
          <Image 
            src={curso.image_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800"} 
            alt={curso.title}
            fill
            className={`object-cover transition-transform duration-700 ${!isLocked ? 'group-hover:scale-105' : 'grayscale-[30%]'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            {isTrial && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Eye className="w-3 h-3" /> PRUEBA GRATUITA
              </span>
            )}
            {curso.access_type === 'full' && (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <CheckCircle className="w-3 h-3" /> ACTIVO
              </span>
            )}
            {curso.badge_label && !isTrial && (
              <span className="text-[10px] font-black px-3 py-1 rounded-full shadow-lg text-white"
                style={{ backgroundColor: curso.badge_color || '#1890FF' }}>
                {curso.badge_label}
              </span>
            )}
          </div>

          {!isLocked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <PlayCircle className="w-7 h-7 text-brand-blue" />
              </div>
            </div>
          )}
       </div>

       {/* Info */}
       <div className="p-5 flex flex-col flex-1">
          {curso.tech_stack && curso.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {curso.tech_stack.map((tech: string, i: number) => (
                <span key={i} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{tech}</span>
              ))}
            </div>
          )}
          
          <h3 className={`font-bold text-[17px] mb-1.5 leading-snug line-clamp-2 transition-colors
            ${isLocked ? 'text-gray-500' : 'text-gray-900 group-hover:text-brand-blue'}`}>
            {curso.title}
          </h3>
          
          <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 leading-relaxed">
             {curso.short_description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {curso.duration_hours}h</span>
              <span className="capitalize">{curso.level}</span>
            </div>

            {isLocked ? (
              curso.price_clp && curso.price_clp > 0 ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); onBuyCourse(curso.id); }}
                  disabled={buyingCourseId === curso.id}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-brand-blue px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                  {buyingCourseId === curso.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
                  ${(curso.price_clp).toLocaleString('es-CL')}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  <Lock className="w-3 h-3 inline mr-1" />Consultar precio
                </span>
              )
            ) : isTrial ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                Clases de prueba
              </span>
            ) : (
              <button className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                Continuar →
              </button>
            )}
          </div>
       </div>
    </motion.div>
  );
}
