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
  Image as ImageIcon,
  BarChart2,
  Trash2,
  Plus,
  Search,
  Video,
  Check,
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
  voteInPoll,
  getCoursesAndLessons,
} from "@/lib/supabase/comunidad";

const PRESET_IMAGES = [
  {
    id: "announcement",
    name: "Anuncio de Clase",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "dashboard",
    name: "Dashboard Analytics",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "achievement",
    name: "Felicitación / Logro",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "welcome",
    name: "Bienvenida Comunidad",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "challenge",
    name: "Desafío Semanal",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    color: "from-rose-500 to-red-600"
  }
];

const GUIDE_STEPS = [
  {
    title: "¿Dónde están mis clases?",
    description: "Tus especializaciones activas y tu progreso de aprendizaje se encuentran en la pestaña 'Mis Cursos' en el menú lateral.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Clases en Vivo",
    description: "Conéctate a las masterclasses semanales en vivo para resolver dudas complejas interactuando en directo con el profesor en la pestaña 'Clases en Vivo'.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Estudia con el Mentor IA",
    description: "Encuentra respuestas rápidas de SQL, Python y visualización de datos chateando 24/7 con el Mentor de IA.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
  }
];

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

  // Start Guide States
  const [showStartGuide, setShowStartGuide] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("programbi-hide-start-guide") !== "true";
    }
    return true;
  });
  const [activeGuideStep, setActiveGuideStep] = useState(0);
  const [activeModalStep, setActiveModalStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("programbi-completed-guide-steps");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [false, false, false];
  });

  const handleToggleStepCompleted = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...completedSteps];
    updated[idx] = !updated[idx];
    setCompletedSteps(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("programbi-completed-guide-steps", JSON.stringify(updated));
    }
  };

  const handleSkipGuide = () => {
    setShowStartGuide(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("programbi-hide-start-guide", "true");
    }
  };

  const handleResetGuide = () => {
    setShowStartGuide(true);
    setCompletedSteps([false, false, false]);
    setActiveGuideStep(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("programbi-hide-start-guide");
      localStorage.removeItem("programbi-completed-guide-steps");
    }
  };

  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionPost, setIsQuestionPost] = useState(false);

  // Rich Media States
  const [selectedMediaType, setSelectedMediaType] = useState<"text" | "image" | "video" | "poll">("text");
  
  // Image states
  const [imagePresetUrl, setImagePresetUrl] = useState("");
  const [imageCustomUrl, setImageCustomUrl] = useState("");
  const [showImagePresets, setShowImagePresets] = useState(true);

  // Video states
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [externalVideoUrl, setExternalVideoUrl] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Poll states
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Fetch courses and lessons for video selector
  useEffect(() => {
    if (isAdmin && selectedMediaType === "video" && availableCourses.length === 0) {
      setCoursesLoading(true);
      getCoursesAndLessons()
        .then(({ courses, lessons }) => {
          setAvailableCourses(courses);
          setAvailableLessons(lessons);
        })
        .catch(err => console.error("Error loading courses/lessons", err))
        .finally(() => setCoursesLoading(false));
    }
  }, [isAdmin, selectedMediaType, availableCourses.length]);

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
    // Determine content to submit
    let finalContent = newPostContent.trim();
    
    if (selectedMediaType !== "text") {
      const payload: any = {
        __serializedRichPost: true,
        text: newPostContent.trim(),
        mediaType: selectedMediaType
      };
      
      if (selectedMediaType === "image") {
        const imageUrl = imageCustomUrl.trim() || imagePresetUrl;
        if (!imageUrl) {
          alert("Por favor selecciona una imagen o ingresa una URL.");
          return;
        }
        payload.imageUrl = imageUrl;
      } else if (selectedMediaType === "video") {
        const course = availableCourses.find(c => c.id === selectedCourseId);
        const lesson = availableLessons.find(l => l.id === selectedLessonId);
        
        if (!selectedCourseId && !externalVideoUrl.trim()) {
          alert("Por favor selecciona un curso/clase del LMS o ingresa una URL externa.");
          return;
        }
        
        payload.videoRef = {
          courseId: selectedCourseId || undefined,
          courseTitle: course?.title || undefined,
          courseSlug: course?.slug || undefined,
          lessonId: selectedLessonId || undefined,
          lessonTitle: lesson?.title || undefined,
          externalUrl: externalVideoUrl.trim() || undefined
        };
      } else if (selectedMediaType === "poll") {
        const question = pollQuestion.trim();
        const validOptions = pollOptions.filter(o => o.trim() !== "");
        
        if (!question) {
          alert("Por favor escribe la pregunta de la encuesta.");
          return;
        }
        if (validOptions.length < 2) {
          alert("Por favor escribe al menos 2 opciones.");
          return;
        }
        
        payload.poll = {
          question,
          options: validOptions.map((text, idx) => ({
            id: `opt_${Date.now()}_${idx}`,
            text: text.trim(),
            votes: []
          }))
        };
      }
      
      finalContent = JSON.stringify(payload);
    } else {
      if (!finalContent) return;
    }
    
    setIsSubmitting(true);
    try {
      await createPost(finalContent, false);
      setNewPostContent("");
      // Reset composer states
      setSelectedMediaType("text");
      setImagePresetUrl("");
      setImageCustomUrl("");
      setSelectedCourseId("");
      setSelectedLessonId("");
      setExternalVideoUrl("");
      setPollQuestion("");
      setPollOptions(["", ""]);
      
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
          {/* Post Composer (Admins Only) */}
          {isAdmin && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-150/70 transition-all hover:shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-display font-black text-sm shadow-md shrink-0">
                    {dashStats?.userName?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Nuevo Anuncio Oficial</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Publica contenido enriquecido para la comunidad</p>
                  </div>
                </div>
                
                {/* Media Type Tabs */}
                <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 gap-0.5 self-start sm:self-auto overflow-x-auto max-w-full">
                  <button
                    onClick={() => setSelectedMediaType("text")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shrink-0
                      ${selectedMediaType === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-450 hover:text-gray-650"}`}
                  >
                    <span>Texto</span>
                  </button>
                  <button
                    onClick={() => setSelectedMediaType("image")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shrink-0
                      ${selectedMediaType === "image" ? "bg-white text-gray-900 shadow-sm" : "text-gray-450 hover:text-gray-650"}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Imagen</span>
                  </button>
                  <button
                    onClick={() => setSelectedMediaType("video")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shrink-0
                      ${selectedMediaType === "video" ? "bg-white text-gray-900 shadow-sm" : "text-gray-450 hover:text-gray-650"}`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Clase</span>
                  </button>
                  <button
                    onClick={() => setSelectedMediaType("poll")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shrink-0
                      ${selectedMediaType === "poll" ? "bg-white text-gray-900 shadow-sm" : "text-gray-450 hover:text-gray-650"}`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Encuesta</span>
                  </button>
                </div>
              </div>

              {/* Main content textarea */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                    {selectedMediaType === "poll" ? "Introducción / Contexto" : "Mensaje de la publicación"}
                  </label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={
                      selectedMediaType === "poll"
                        ? "Escribe un mensaje introductorio para esta encuesta..."
                        : selectedMediaType === "video"
                          ? "Escribe un mensaje describiendo por qué recomiendas ver esta clase..."
                          : "Escribe un anuncio o comparte algo con la comunidad..."
                    }
                    className="w-full bg-gray-50/70 rounded-2xl px-4 py-3 border border-gray-200 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white transition-all resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[80px]"
                    rows={3}
                  />
                </div>

                {/* --- IMAGE MEDIA SUB-INTERFACE --- */}
                {selectedMediaType === "image" && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                      <h5 className="text-xs font-bold text-gray-700">Adjuntar Imagen</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowImagePresets(true)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase border-none cursor-pointer
                            ${showImagePresets ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                        >
                          Presets
                        </button>
                        <button
                          onClick={() => setShowImagePresets(false)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase border-none cursor-pointer
                            ${!showImagePresets ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                        >
                          URL Personalizada
                        </button>
                      </div>
                    </div>

                    {showImagePresets ? (
                      <div className="space-y-3">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">Elige un preset temático:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {PRESET_IMAGES.map((img) => (
                            <button
                              key={img.id}
                              onClick={() => {
                                setImagePresetUrl(img.url);
                                setImageCustomUrl("");
                              }}
                              className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col justify-end p-2 text-left
                                ${imagePresetUrl === img.url ? "border-brand-blue shadow-md scale-102" : "border-transparent opacity-85 hover:opacity-100"}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                              <span className="relative z-10 text-[9px] font-black text-white uppercase tracking-wider line-clamp-1">{img.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Ingresa la URL de la imagen:</label>
                        <input
                          type="url"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={imageCustomUrl}
                          onChange={(e) => {
                            setImageCustomUrl(e.target.value);
                            setImagePresetUrl("");
                          }}
                          className="w-full bg-white border border-gray-205 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                      </div>
                    )}

                    {/* Live Image Preview */}
                    {(imageCustomUrl || imagePresetUrl) && (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white max-h-[200px] flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageCustomUrl || imagePresetUrl}
                          alt="Previsualización"
                          className="w-full h-full object-cover max-h-[190px] rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImagePresetUrl("");
                            setImageCustomUrl("");
                          }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border-none cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- VIDEO MEDIA SUB-INTERFACE --- */}
                {selectedMediaType === "video" && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-4">
                    <h5 className="text-xs font-bold text-gray-700 border-b border-gray-200/50 pb-3">Vincular Video o Clase LMS</h5>
                    
                    {coursesLoading ? (
                      <div className="flex justify-center items-center py-6 gap-2">
                        <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />
                        <span className="text-xs text-gray-400 font-semibold">Cargando cursos y clases...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Selecciona el Curso:</label>
                          <select
                            value={selectedCourseId}
                            onChange={(e) => {
                              setSelectedCourseId(e.target.value);
                              setSelectedLessonId("");
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                          >
                            <option value="">-- Elige un Curso --</option>
                            {availableCourses.map((c) => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Selecciona la Clase / Lección:</label>
                          <select
                            value={selectedLessonId}
                            onChange={(e) => setSelectedLessonId(e.target.value)}
                            disabled={!selectedCourseId}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <option value="">-- Elige una Clase --</option>
                            {availableLessons
                              .filter((l) => l.course_id === selectedCourseId)
                              .map((l) => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-extrabold uppercase">Ó</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Ingresar URL de Video Externo (YouTube, Vimeo, etc.):</label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={externalVideoUrl}
                        onChange={(e) => setExternalVideoUrl(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                      />
                    </div>
                  </div>
                )}

                {/* --- POLL MEDIA SUB-INTERFACE --- */}
                {selectedMediaType === "poll" && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-4">
                    <h5 className="text-xs font-bold text-gray-700 border-b border-gray-200/50 pb-3">Crear Encuesta</h5>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Pregunta de la Encuesta:</label>
                      <input
                        type="text"
                        placeholder="¿Qué tema te gustaría ver en la próxima Masterclass?"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 font-bold text-gray-800"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Opciones (Mínimo 2, Máximo 5):</span>
                        {pollOptions.length < 5 && (
                          <button
                            onClick={() => setPollOptions([...pollOptions, ""])}
                            className="bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-[10px] font-black px-2.5 py-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3 h-3" /> Agregar opción
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {pollOptions.map((option, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-xs font-bold text-gray-400 w-5 text-right">{idx + 1}.</span>
                            <input
                              type="text"
                              placeholder={`Opción ${idx + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOpts = [...pollOptions];
                                newOpts[idx] = e.target.value;
                                setPollOptions(newOpts);
                              }}
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                            />
                            {pollOptions.length > 2 && (
                              <button
                                onClick={() => {
                                  const newOpts = pollOptions.filter((_, i) => i !== idx);
                                  setPollOptions(newOpts);
                                }}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl border-none cursor-pointer transition-colors"
                                aria-label="Eliminar opción"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={handlePostSubmit}
                    disabled={isSubmitting || (selectedMediaType === "text" && !newPostContent.trim())}
                    className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98] border-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Publicar Anuncio
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    userId={userProfile?.id}
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

          {/* Guía de Inicio Card */}
          {showStartGuide ? (
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-gray-105 dark:border-neutral-900 p-5 space-y-4 transition-all">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-905 dark:text-white text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-blue animate-pulse" />
                    Guía de Inicio
                  </h3>
                </div>
                <button
                  onClick={handleSkipGuide}
                  className="text-[10px] font-black uppercase tracking-wide text-gray-400 hover:text-gray-650 dark:hover:text-neutral-350 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 px-2.5 py-1 rounded-lg transition-all border-none cursor-pointer"
                >
                  Saltar
                </button>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5">
                {GUIDE_STEPS.map((step, idx) => {
                  const isCompleted = completedSteps[idx];
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveModalStep(idx)}
                      className="p-3 bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 hover:border-brand-blue/30 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 rounded-xl text-left cursor-pointer transition-all flex gap-3 items-center"
                    >
                      {/* Left Circle Indicator */}
                      <button
                        onClick={(e) => handleToggleStepCompleted(idx, e)}
                        className="bg-transparent border-none p-0 shrink-0 cursor-pointer"
                        aria-label={isCompleted ? "Paso completado" : "Marcar como completado"}
                      >
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 scale-100 hover:scale-105 active:scale-95">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 dark:text-neutral-700 hover:text-brand-blue transition-colors" viewBox="0 0 24 24" fill="none">
                            <circle 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeDasharray="4 2" 
                            />
                            <text 
                              x="12" 
                              y="15.5" 
                              textAnchor="middle" 
                              className="text-[9px] font-black fill-gray-400 dark:fill-neutral-500 font-sans"
                            >
                              {idx + 1}
                            </text>
                          </svg>
                        )}
                      </button>

                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <h4 className={`text-xs font-bold leading-tight ${isCompleted ? "text-gray-500 dark:text-neutral-450 line-through" : "text-gray-800 dark:text-neutral-200"}`}>
                          {step.title}
                        </h4>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 ml-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-900 p-4 text-center">
              <span className="text-[10px] text-gray-450 font-medium">¿Te saltaste la guía de inicio?</span>
              <button
                onClick={handleResetGuide}
                className="text-[10px] font-black text-brand-blue hover:underline block mx-auto mt-1 bg-transparent border-none cursor-pointer"
              >
                Reiniciar Guía de Inicio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── START GUIDE STEP MODAL ─── */}
      <AnimatePresence>
        {activeModalStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setActiveModalStep(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalStep(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50/80 dark:bg-neutral-900/80 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-neutral-350 border-none cursor-pointer transition-all active:scale-90 z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Video Player at the Top of the Pop-up */}
              <div className="relative aspect-video w-full bg-black border-b border-gray-100 dark:border-neutral-900 overflow-hidden shadow-inner shrink-0">
                <video
                  key={GUIDE_STEPS[activeModalStep].videoUrl}
                  src={GUIDE_STEPS[activeModalStep].videoUrl}
                  poster={GUIDE_STEPS[activeGuideStep === activeModalStep ? activeGuideStep : activeModalStep].poster}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content area */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20 px-3 py-1 rounded-full border border-brand-blue/20">
                    Paso {activeModalStep + 1} de {GUIDE_STEPS.length}
                  </span>
                  <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white leading-snug mt-3">
                    {GUIDE_STEPS[activeModalStep].title}
                  </h3>
                  <p className="text-xs text-neutral-550 dark:text-neutral-450 mt-2 leading-relaxed">
                    {GUIDE_STEPS[activeModalStep].description}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  {!completedSteps[activeModalStep] ? (
                    <button
                      onClick={(e) => {
                        handleToggleStepCompleted(activeModalStep, e);
                        setActiveModalStep(null);
                      }}
                      className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 text-white text-xs font-black rounded-xl border-none cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Marcar como Completado</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleToggleStepCompleted(activeModalStep, e);
                      }}
                      className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 text-xs font-black rounded-xl border-none cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <span>Desmarcar Paso</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalStep(null)}
                    className="py-3 px-5 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-bold rounded-xl border-none cursor-pointer transition-all active:scale-[0.98]"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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



/* ── Video Attachment Card ── */
function VideoAttachmentCard({ videoRef }: any) {
  const router = useRouter();

  const handleRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.courseSlug) {
      router.push(`/comunidad/cursos/${videoRef.courseSlug}`);
    } else if (videoRef.externalUrl) {
      window.open(videoRef.externalUrl, "_blank");
    } else {
      router.push(`/comunidad/cursos`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden relative group mt-3">
      {/* Glow decorative */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full filter blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
      
      <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
        {/* Play Video Thumbnail simulation */}
        <div 
          onClick={handleRedirect}
          className="w-full sm:w-36 aspect-video rounded-xl bg-slate-950 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-slate-800 relative group/thumb"
        >
          {/* Decorative design */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 opacity-85" />
          <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 text-brand-blue group-hover/thumb:scale-110 group-hover/thumb:bg-brand-blue group-hover/thumb:text-white transition-all shadow-lg relative z-10 duration-300">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md border border-brand-blue/25">
            Clase Recomendada
          </span>
          <h4 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-1">
            {videoRef.lessonTitle || videoRef.courseTitle || "Ver video de la clase"}
          </h4>
          {videoRef.courseTitle && videoRef.lessonTitle && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
              Curso: {videoRef.courseTitle}
            </p>
          )}
          {videoRef.externalUrl && !videoRef.courseTitle && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[250px] mx-auto sm:mx-0">
              {videoRef.externalUrl}
            </p>
          )}
        </div>

        <button
          onClick={handleRedirect}
          className="w-full sm:w-auto px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-[11px] font-bold rounded-xl shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
        >
          <span>Ver Clase</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Poll Attachment Card ── */
function PollAttachmentCard({ poll, postId, userId }: any) {
  const [localPoll, setLocalPoll] = useState(poll);
  const [votingInProgress, setVotingInProgress] = useState(false);

  useEffect(() => {
    setLocalPoll(poll);
  }, [poll]);

  // Compute statistics
  const totalVotes = (localPoll.options || []).reduce((sum: number, opt: any) => sum + (opt.votes || []).length, 0);
  const hasVotedAny = (localPoll.options || []).some((opt: any) => (opt.votes || []).includes(userId));

  const handleVote = async (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votingInProgress || !userId) return;
    setVotingInProgress(true);

    // Toggle logic: check if user is voting for the option they already voted for
    const currentlyVotedOpt = localPoll.options.find((opt: any) => (opt.votes || []).includes(userId));
    const isTogglingOff = currentlyVotedOpt && currentlyVotedOpt.id === optionId;

    // Optimistic UI state update
    const updatedOptions = localPoll.options.map((opt: any) => {
      let votes = [...(opt.votes || [])];
      
      // Remove from everywhere
      const idx = votes.indexOf(userId);
      if (idx > -1) {
        votes.splice(idx, 1);
      }

      // Add to this option if it's the target and we are NOT toggling it off
      if (opt.id === optionId && !isTogglingOff) {
        votes.push(userId);
      }

      return {
        ...opt,
        votes
      };
    });

    setLocalPoll({
      ...localPoll,
      options: updatedOptions
    });

    try {
      await voteInPoll(postId, optionId);
    } catch (err: any) {
      // rollback on error
      setLocalPoll(poll);
      alert("Error al votar: " + err.message);
    } finally {
      setVotingInProgress(false);
    }
  };

  return (
    <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-150/70 dark:border-neutral-800 rounded-2xl p-4.5 space-y-3.5 mt-3">
      <div>
        <h4 className="text-xs font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brand-blue" />
          {localPoll.question}
        </h4>
      </div>

      <div className="space-y-2">
        {localPoll.options.map((opt: any) => {
          const votesCount = (opt.votes || []).length;
          const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
          const hasVotedThis = (opt.votes || []).includes(userId);

          return (
            <div key={opt.id} className="relative w-full">
              {hasVotedAny ? (
                <button
                  onClick={(e) => handleVote(opt.id, e)}
                  disabled={votingInProgress}
                  className={`w-full text-left p-3 rounded-xl transition-all relative overflow-hidden flex items-center justify-between cursor-pointer border-none
                    ${hasVotedThis
                      ? "bg-blue-50/80 dark:bg-blue-950/20 text-brand-blue font-bold border border-brand-blue/30"
                      : "bg-gray-50 dark:bg-neutral-900/70 text-gray-700 dark:text-gray-300"}`}
                >
                  {/* Progress background overlay */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`absolute left-0 top-0 bottom-0 pointer-events-none opacity-10 
                      ${hasVotedThis ? "bg-brand-blue" : "bg-gray-450 dark:bg-gray-650"}`}
                  />
                  
                  <div className="flex items-center gap-2 relative z-10">
                    {hasVotedThis && (
                      <span className="text-[9px] bg-brand-blue text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-black">
                        ✓
                      </span>
                    )}
                    <span className="text-xs">{opt.text}</span>
                  </div>
                  <span className="relative z-10 text-xs font-bold">{percentage}% ({votesCount})</span>
                </button>
              ) : (
                <button
                  onClick={(e) => handleVote(opt.id, e)}
                  disabled={votingInProgress}
                  className="w-full text-left p-3 rounded-xl border border-gray-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-gray-50 dark:hover:bg-neutral-900 hover:border-brand-blue/30 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all active:scale-[0.99] flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.text}</span>
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Votar</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 font-extrabold uppercase tracking-wide px-1 pt-1.5 border-t border-gray-100 dark:border-neutral-900">
        <span>Votos Totales: {totalVotes}</span>
        {hasVotedAny && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const votedOpt = localPoll.options.find((o: any) => (o.votes || []).includes(userId));
              if (votedOpt) handleVote(votedOpt.id, e);
            }}
            disabled={votingInProgress}
            className="text-brand-blue hover:underline bg-transparent border-none cursor-pointer text-[10px] font-black uppercase tracking-wide"
          >
            Quitar / Cambiar Voto
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Post Card ── */
function PostCard({ post, isGuest, userId, onLike, onSubmitComment, onUpgradeClick }: any) {
  let richPost: any = null;
  let isRich = false;
  try {
    if (post.content && post.content.startsWith("{") && post.content.includes("__serializedRichPost")) {
      richPost = JSON.parse(post.content);
      if (richPost.__serializedRichPost) {
        isRich = true;
      }
    }
  } catch (e) {
    // fallback to text
  }

  const postText = isRich ? richPost.text : post.content;
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
      {isGuest && post.author?.role === "admin" && !/gratis|gratuita/i.test(postText || "") ? (
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
        <>
          <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-5">
            {postText}
          </p>

          {/* Render Rich Post Attachments */}
          {isRich && (
            <div className="mt-4 mb-5">
              {richPost.mediaType === "image" && richPost.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[360px] group">
                  <img
                    src={richPost.imageUrl}
                    alt="Post Media"
                    className="w-full h-auto object-cover max-h-[360px] transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
              )}

              {richPost.mediaType === "video" && richPost.videoRef && (
                <VideoAttachmentCard videoRef={richPost.videoRef} />
              )}

              {richPost.mediaType === "poll" && richPost.poll && (
                <PollAttachmentCard 
                  poll={richPost.poll} 
                  postId={post.id} 
                  userId={userId} 
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      {!(isGuest && post.author?.role === "admin" && !/gratis|gratuita/i.test(postText || "")) && (
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
                  U
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
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-blue disabled:opacity-30 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-all border-none cursor-pointer flex items-center justify-center"
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
