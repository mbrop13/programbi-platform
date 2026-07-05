import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  TrendingUp,
  Trophy,
  ArrowRight,
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Bookmark,
  Share2,
  MoreHorizontal,
  Lock,
  BookOpen,
  Clock,
  Flame,
  Zap,
  Calendar,
  ChevronRight,
  Crown,
  X,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  isCurrentUserAdmin,
  getCurrentUserProfile,
  getDashboardStats,
} from "@/lib/supabase/comunidad";

interface MuroFeedProps {
  isRestricted?: boolean;
}

export default function MuroFeed({ isRestricted }: MuroFeedProps = {}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dashStats, setDashStats] = useState<any>(null);
  const [activeGuide, setActiveGuide] = useState<'primeros-pasos' | 'roadmap' | 'normas' | null>(null);

  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionPost, setIsQuestionPost] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [adminCheck, data, profile, stats] = await Promise.all([
          isCurrentUserAdmin(),
          getPosts(),
          getCurrentUserProfile(),
          getDashboardStats(),
        ]);
        setIsAdmin(adminCheck);
        setPosts(data);
        setUserProfile(profile);
        setDashStats(stats);
      } catch (err) {
        console.error("Failed fetching dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost(newPostContent, isQuestionPost);
      setNewPostContent("");
      setIsQuestionPost(false);
      const data = await getPosts();
      setPosts(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const currentlyLiked = p.is_liked_by_user;
          return {
            ...p,
            is_liked_by_user: !currentlyLiked,
            likes_count: currentlyLiked
              ? Math.max((p.likes_count || 0) - 1, 0)
              : (p.likes_count || 0) + 1,
          };
        }
        return p;
      })
    );
    try {
      await toggleLike(postId);
    } catch {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const currentlyLiked = p.is_liked_by_user;
            return {
              ...p,
              is_liked_by_user: !currentlyLiked,
              likes_count: currentlyLiked
                ? Math.max((p.likes_count || 0) - 1, 0)
                : (p.likes_count || 0) + 1,
            };
          }
          return p;
        })
      );
    }
  };

  const handleCreateComment = async (postId: string, content: string) => {
    try {
      await addComment(postId, content);
      const data = await getPosts();
      setPosts(data);

      // Notify post author (if not self-commenting)
      const post = data.find((p: any) => p.id === postId);
      if (post?.author && post.author.id !== userProfile?.id) {
        const { createNotification } = await import("@/lib/supabase/comunidad");
        await createNotification(
          post.author.id,
          "comment",
          `${userProfile?.full_name || "Alguien"} comentó en tu publicación`,
          content.length > 100 ? content.substring(0, 100) + "..." : content,
          "/comunidad/inicio"
        );
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 font-medium">
          Cargando tu dashboard...
        </span>
      </div>
    );
  }

  const greeting = getGreeting();
  const hasSubscription = !!userProfile?.subscription_plan;
  const hasCourses = !!(dashStats?.courseProgress && dashStats.courseProgress.length > 0);
  const isGuest = !isAdmin && !hasSubscription && !hasCourses;

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto">
      {/* ─── GREETING BANNER ─── */}
      {dashStats && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-brand-blue via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-sm border border-blue-500/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl -mb-10" />
          <div className="relative z-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none mb-2">
              {greeting}, {dashStats.userName?.split(" ")[0]}! 👋
            </h2>
            <p className="text-[14px] text-white/80 font-medium max-w-lg">
              Nos alegra tenerte de vuelta en ProgramBI. Explora el contenido, interactúa en el foro y continúa tu especialización.
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── COURSE PROGRESS ─── */}
      {dashStats?.courseProgress?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Tu Progreso
            </h3>
            <button className="text-xs font-semibold text-brand-blue hover:text-blue-600 transition-colors flex items-center gap-1">
              Ver cursos <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {dashStats.courseProgress.map((cp: any, i: number) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-800 truncate max-w-[70%]">
                    {cp.title}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      cp.progress === 100
                        ? "bg-emerald-50 text-emerald-600"
                        : cp.progress > 50
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cp.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cp.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      cp.progress === 100
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "bg-gradient-to-r from-brand-blue to-indigo-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── MAIN GRID: Feed + Sidebar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── FEED COLUMN ─── */}
        <div className="lg:col-span-8 space-y-5">
          {/* Post Composer */}
          {isAdmin ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {dashStats?.userName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Escribe un anuncio o comparte algo con la comunidad..."
                    className="w-full bg-gray-50/80 rounded-xl px-4 py-3 border border-gray-200/80 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white transition-all resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[60px]"
                    rows={2}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handlePostSubmit}
                      disabled={isSubmitting || !newPostContent.trim()}
                      className="px-5 py-2 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (isGuest) {
                  router.push("/comunidad");
                } else {
                  setIsQuestionPost(true);
                }
              }}
              disabled={isRestricted}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-blue/20 transition-all text-left flex items-center gap-4 group disabled:opacity-50"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-brand-blue/10 text-gray-400 group-hover:text-brand-blue flex items-center justify-center transition-colors shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-gray-400 group-hover:text-gray-600 text-sm font-medium transition-colors">
                {isGuest ? "Suscríbete a un plan Premium para publicar en la comunidad" : "¿Tienes una pregunta? Compártela con la comunidad..."}
              </span>
            </button>
          )}

          {/* Question Composer */}
          <AnimatePresence>
            {isQuestionPost && !isAdmin && !isRestricted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <span className="bg-indigo-100 px-2 py-1 rounded-md">
                      PREGUNTA
                    </span>
                    <span className="text-gray-400">
                      La comunidad te ayudará
                    </span>
                  </div>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    autoFocus
                    placeholder="Describe tu duda sobre programación, SQL, datos..."
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[80px]"
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsQuestionPost(false);
                        setNewPostContent("");
                      }}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handlePostSubmit}
                      disabled={isSubmitting || !newPostContent.trim()}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Publicar Pregunta
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed */}
          {!posts.length ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                Aún no hay publicaciones
              </h3>
              <p className="text-sm text-gray-500">
                Sé el primero en compartir algo con la comunidad.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard
                    post={post}
                    isGuest={isGuest}
                    onLike={() => handleLike(post.id)}
                    onSubmitComment={(text: string) =>
                      handleCreateComment(post.id, text)
                    }
                    onUpgradeClick={() => {
                      router.push("/comunidad");
                    }}
                  />
                </motion.div>
              ))}
              {posts.length > 5 && (
                <button className="w-full py-3 text-center text-sm font-semibold text-brand-blue hover:text-blue-600 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  Ver todas las publicaciones ({posts.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="hidden lg:flex flex-col lg:col-span-4 gap-5 sticky top-20">
          {/* Continuar Aprendiendo Card */}
          {(() => {
            const activeCourse = dashStats?.courseProgress?.[0];
            return (
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full filter blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl pointer-events-none" />
                
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue/90 bg-brand-blue/10 px-2.5 py-0.5 rounded-full border border-brand-blue/20">
                    Tu aprendizaje
                  </span>
                  
                  {activeCourse ? (
                    <>
                      <h4 className="text-sm font-black mt-3 leading-snug truncate">
                        {activeCourse.title}
                      </h4>
                      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        <span>Progreso</span>
                        <span>{activeCourse.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div className="h-full bg-brand-blue rounded-full" style={{ width: `${activeCourse.progress}%` }} />
                      </div>
                      
                      <button
                        onClick={() => router.push(`/comunidad/cursos/${activeCourse.courseSlug}`)}
                        className="w-full mt-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        Continuar Clase
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm font-black mt-3 leading-snug">
                        Comienza tu especialización
                      </h4>
                      <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                        Explora nuestro plan de estudios completo, asiste a las lecciones de prueba y comienza tu camino profesional en datos.
                      </p>
                      
                      <button
                        onClick={() => router.push('/comunidad/cursos')}
                        className="w-full mt-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        Explorar Cursos
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Upcoming Live Classes */}
          {dashStats?.upcomingLives?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" /> Próximas Clases
              </h3>
              <div className="space-y-3">
                {dashStats.upcomingLives.map((live: any) => (
                  <div
                    key={live.id}
                    className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {live.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatLiveDate(live.scheduled_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improved Resources List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Recursos de la Comunidad</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveGuide('primeros-pasos')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-gray-700 hover:bg-blue-50/50 hover:text-brand-blue transition-colors font-bold border-0 bg-transparent cursor-pointer flex items-center gap-2"
              >
                <span>📘</span> Guía de Primeros Pasos
              </button>
              <button
                onClick={() => setActiveGuide('roadmap')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-gray-700 hover:bg-amber-50/50 hover:text-amber-600 transition-colors font-bold border-0 bg-transparent cursor-pointer flex items-center gap-2"
              >
                <span>🎯</span> Ruta de Aprendizaje
              </button>
              <button
                onClick={() => setActiveGuide('normas')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-gray-700 hover:bg-indigo-50/50 hover:text-indigo-650 transition-colors font-bold border-0 bg-transparent cursor-pointer flex items-center gap-2"
              >
                <span>🤝</span> Código de Convivencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── GUIDE MODAL ─── */}
      <AnimatePresence>
        {activeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setActiveGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-gray-150/70 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveGuide(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-550 border-0 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {activeGuide === 'primeros-pasos' && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-gray-950 leading-tight">Guía de Primeros Pasos</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    ¡Bienvenido a la comunidad de ProgramBI! Sigue estas breves instrucciones para sacar el máximo provecho a tu espacio de estudio:
                  </p>
                  <div className="mt-5 space-y-4 text-xs text-gray-700">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Explora tus Cursos</span>
                        Ve a la pestaña de Cursos en tu panel lateral para ver tus especialidades activas y acceder al aula virtual.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Marca tu Progreso</span>
                        Los videos se auto-completarán cuando veas el 70% del video, o puedes usar el checkbox lateral para llevar el control manual de lo que has aprendido.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Estudia con el Mentor IA</span>
                        Si tienes dudas en una clase, usa el chat de IA a la derecha para hacer preguntas contextuales del tema del video en tiempo real.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGuide(null)}
                    className="w-full mt-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl border-0 cursor-pointer transition-colors"
                  >
                    ¡Entendido, empecemos!
                  </button>
                </div>
              )}

              {activeGuide === 'roadmap' && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-gray-950 leading-tight">Roadmap de Aprendizaje</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Te recomendamos seguir este flujo estructurado para optimizar tu aprendizaje en análisis de datos y business intelligence:
                  </p>
                  <div className="mt-5 space-y-4 text-xs text-gray-700">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">A</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Excel Avanzado para Analytics</span>
                        Domina tablas dinámicas, Power Query y el modelado inicial de datos para estructurar reportes básicos.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">B</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Bases de Datos & SQL</span>
                        Aprende a escribir consultas complejas, joins, agregaciones y filtros para extraer información directo de los servidores.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">C</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Visualización en Power BI & Tableau</span>
                        Conecta tus modelos de bases de datos, crea dashboards interactivos e implementa fórmulas DAX para análisis corporativo.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGuide(null)}
                    className="w-full mt-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl border-0 cursor-pointer transition-colors"
                  >
                    Seguir mi Ruta
                  </button>
                </div>
              )}

              {activeGuide === 'normas' && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 animate-none" />
                  </div>
                  <h3 className="text-lg font-black text-gray-950 leading-tight">Código de Convivencia</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Mantenemos un espacio seguro y profesional para el crecimiento mutuo. Estas son nuestras pautas de convivencia:
                  </p>
                  <div className="mt-5 space-y-4 text-xs text-gray-700">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Respeto y Colaboración</span>
                        Apoya a tus compañeros respondiendo preguntas en el muro. El conocimiento compartido multiplica el crecimiento.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Preguntas Detalladas</span>
                        Cuando publiques una duda sobre código en el muro, proporciona el fragmento exacto de tu consulta para facilitar que los demás te ayuden.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
                      <div>
                        <span className="font-bold text-gray-900 block">Crecimiento Continuo</span>
                        Celebra tus logros e hitos de aprendizaje compartiendo tus reportes completados y certificados.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGuide(null)}
                    className="w-full mt-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl border-0 cursor-pointer transition-colors"
                  >
                    Acepto las Pautas
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



/* ── Post Card (unchanged logic) ── */
function PostCard({ post, isGuest, onLike, onSubmitComment, onUpgradeClick }: any) {
  const isQuestion = post.channel_id === "support";
  const authorName = post.author?.full_name || "Estudiante";
  const timeStr = getRelativeTime(post.created_at);
  const [commentOpen, setCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user || false);

  useEffect(() => {
    setIsLiked(post.is_liked_by_user || false);
  }, [post.is_liked_by_user]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    onSubmitComment(newComment);
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0 overflow-hidden text-sm">
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              authorName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-sm">{authorName}</h4>
              {post.author?.role === "admin" && (
                <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wide">
                  ADMIN
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 font-medium">{timeStr}</span>
          </div>
        </div>
        <button className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-3">
        {isQuestion && (
          <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-wide">
            ❓ PREGUNTA
          </span>
        )}
        {post.is_pinned && (
          <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black tracking-wide">
            📌 FIJADO
          </span>
        )}
      </div>

      {/* Content */}
      {isGuest && post.author?.role === "admin" && !/gratis|gratuita/i.test(post.content || "") ? (
        <div className="relative mb-5">
          <p className="text-gray-400 text-[15px] leading-relaxed whitespace-pre-wrap select-none filter blur-[5px] pointer-events-none">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut lorem quis diam elementum elementum. Nullam luctus finibus elit eget elementum. Duis id arcu id urna finibus porta.
          </p>
          <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center p-4 text-center z-10">
            <Crown className="w-7 h-7 text-amber-500 mb-1 animate-bounce" />
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide">
              Publicación Premium Exclusiva
            </h5>
            <p className="text-[10px] text-gray-505 font-medium mt-1 mb-2.5 max-w-[260px]">
              Esta publicación del administrador es exclusiva para alumnos premium activos.
            </p>
            <button
              onClick={onUpgradeClick}
              className="bg-brand-blue hover:bg-blue-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg shadow-sm border-0 cursor-pointer transition-all active:scale-95"
            >
              Ver Planes Premium
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-5">
          {post.content}
        </p>
      )}

      {/* Actions */}
      {!(isGuest && post.author?.role === "admin" && !/gratis|gratuita/i.test(post.content || "")) && (
        <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            onLike();
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
            ${isLiked ? "text-rose-500 hover:bg-rose-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
        >
          <Heart
            className={`w-[18px] h-[18px] transition-all ${isLiked ? "fill-rose-500 scale-110" : ""}`}
          />
          {post.likes_count || ""}
        </button>
        <button
          onClick={() => setCommentOpen(!commentOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all
            ${commentOpen ? "text-brand-blue bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          {post.comments?.length > 0 ? post.comments.length : ""}
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
          <Bookmark className="w-[18px] h-[18px]" />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
          <Share2 className="w-[18px] h-[18px]" />
        </button>
      </div>
      )}

      {/* Comments */}
      <AnimatePresence>
        {commentOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              {post.comments?.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-[10px] shrink-0 text-gray-600">
                    {c.author?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-xs text-gray-900">
                        {c.author?.full_name || "Estudiante"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {getRelativeTime(c.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center font-bold text-[10px] text-brand-blue shrink-0">
                  T
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pr-11 text-sm focus:outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCommentSubmit()
                    }
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-blue disabled:opacity-30 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helpers ── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}m`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  if (diffDay < 7) return `Hace ${diffDay}d`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function formatLiveDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays <= 7) return `En ${diffDays} días`;
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
