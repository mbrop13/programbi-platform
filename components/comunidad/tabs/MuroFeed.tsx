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
} from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dashStats, setDashStats] = useState<any>(null);

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
              {dashStats.streak > 0
                ? `Llevas una racha de ${dashStats.streak} días estudiando. ¡Sigue así!`
                : "¡Es buen momento para retomar tu aprendizaje!"}
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Cursos activos"
          value={dashStats?.enrolledCourses || 0}
          color="text-blue-500"
          bg="bg-blue-50"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Horas de estudio"
          value={dashStats?.studyHours || 0}
          suffix="h"
          color="text-emerald-500"
          bg="bg-emerald-50"
          delay={0.05}
        />
        <StatCard
          icon={Flame}
          label="Racha"
          value={dashStats?.streak || 0}
          suffix=" días"
          color="text-amber-500"
          bg="bg-amber-50"
          delay={0.1}
        />
        <StatCard
          icon={Zap}
          label="Puntos XP"
          value={dashStats?.xp || 0}
          color="text-purple-500"
          bg="bg-purple-50"
          delay={0.15}
        />
      </div>

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
              onClick={() => setIsQuestionPost(true)}
              disabled={isRestricted}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-blue/20 transition-all text-left flex items-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-brand-blue/10 text-gray-400 group-hover:text-brand-blue flex items-center justify-center transition-colors shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-gray-400 group-hover:text-gray-600 text-sm font-medium transition-colors">
                ¿Tienes una pregunta? Compártela con la comunidad...
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
                    onLike={() => handleLike(post.id)}
                    onSubmitComment={(text: string) =>
                      handleCreateComment(post.id, text)
                    }
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
          {/* Upcoming Live Classes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" /> Próximas Clases
            </h3>
            {dashStats?.upcomingLives?.length > 0 ? (
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
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay clases programadas próximamente
              </p>
            )}
          </div>

          {/* Top Members */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" /> Top Miembros
            </h3>
            {dashStats?.topMembers?.length > 0 ? (
              <div className="space-y-2.5">
                {dashStats.topMembers.map(
                  (member: any, i: number) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`w-5 text-center text-xs font-bold ${
                          i === 0
                            ? "text-amber-500"
                            : i === 1
                              ? "text-gray-400"
                              : i === 2
                                ? "text-amber-700"
                                : "text-gray-300"
                        }`}
                      >
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {member.initials}
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                        {member.name}
                      </span>
                      <span className="text-xs font-bold text-purple-500">
                        {member.xp?.toLocaleString() || 0} XP
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aún no hay ranking disponible
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Recursos</h3>
            <div className="space-y-1">
              {[
                "📘 Guía de inicio rápido",
                "🎯 Roadmap de Aprendizaje",
                "💬 Preguntas Frecuentes",
              ].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color,
  bg,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
  bg: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="font-display font-black text-2xl text-gray-900">
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 mt-0.5">{label}</div>
    </motion.div>
  );
}

/* ── Post Card (unchanged logic) ── */
function PostCard({ post, onLike, onSubmitComment }: any) {
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
      <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-5">
        {post.content}
      </p>

      {/* Actions */}
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
        <div className="flex-1" />
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
          <Share2 className="w-[18px] h-[18px]" />
        </button>
      </div>

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
