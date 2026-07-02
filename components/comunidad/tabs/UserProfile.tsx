"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit3,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Flame,
  Zap,
  Trophy,
  Star,
  Shield,
  Camera,
  Save,
  Loader2,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  getCurrentUserProfile,
  getDashboardStats,
} from "@/lib/supabase/comunidad";

/* ── Achievement definitions ── */
const ACHIEVEMENTS = [
  { id: "first_lesson", name: "Primera Lección", icon: "🎯", desc: "Completa tu primera lección", xpReq: 50 },
  { id: "ten_lessons", name: "10 Lecciones", icon: "📚", desc: "Completa 10 lecciones", xpReq: 500 },
  { id: "course_done", name: "Curso Completado", icon: "🏆", desc: "Completa un curso entero", xpReq: 1000 },
  { id: "streak_7", name: "Racha 7 días", icon: "🔥", desc: "Estudia 7 días seguidos", xpReq: 70 },
  { id: "streak_30", name: "Racha 30 días", icon: "🔥🔥", desc: "Estudia 30 días seguidos", xpReq: 300 },
  { id: "first_comment", name: "Primer Comentario", icon: "💬", desc: "Comenta en el muro", xpReq: 10 },
  { id: "ten_posts", name: "10 Publicaciones", icon: "🌟", desc: "Crea 10 posts en la comunidad", xpReq: 200 },
  { id: "attended_live", name: "Asistió a Live", icon: "📺", desc: "Participa en una masterclass", xpReq: 50 },
  { id: "certificate", name: "Primer Certificado", icon: "🎓", desc: "Obtén tu primer certificado", xpReq: 1500 },
];

const LEVELS = [
  { name: "Novato", min: 0, max: 500, color: "from-gray-400 to-gray-500" },
  { name: "Aprendiz", min: 500, max: 1500, color: "from-blue-400 to-blue-600" },
  { name: "Intermedio", min: 1500, max: 3500, color: "from-emerald-400 to-emerald-600" },
  { name: "Avanzado", min: 3500, max: 7000, color: "from-purple-400 to-purple-600" },
  { name: "Experto", min: 7000, max: 99999, color: "from-amber-400 to-amber-600" },
];

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumen" | "actividad" | "logros" | "editar">("resumen");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, s] = await Promise.all([getCurrentUserProfile(), getDashboardStats()]);
        setProfile(p);
        setStats(s);
        if (p) {
          setEditName(p.full_name || "");
          setEditPhone(p.phone || "");
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-500">No se pudo cargar tu perfil.</p>
      </div>
    );
  }

  const xp = profile.xp_points || 0;
  const streak = profile.study_streak || 0;
  const currentLevel = LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.min > xp);
  const xpProgress = nextLevel
    ? Math.round(((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const tabs = [
    { id: "resumen" as const, label: "Resumen", icon: TrendingUp },
    { id: "actividad" as const, label: "Actividad", icon: Clock },
    { id: "logros" as const, label: "Logros", icon: Trophy },
    { id: "editar" as const, label: "Editar Perfil", icon: Edit3 },
  ];

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* ─── Profile Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-r from-brand-blue via-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
          <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="px-6 pb-6 -mt-12 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-display font-black text-2xl shadow-xl border-4 border-white shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                initials
              )}
            </div>
            <div className="pb-1">
              <h1 className="font-display font-black text-xl text-gray-900">{profile.full_name}</h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${currentLevel.color} text-white`}>
                  {currentLevel.name}
                </span>
                {profile.subscription_plan && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue">
                    {profile.subscription_plan.replace("plan_", "").toUpperCase()}
                  </span>
                )}
                {profile.role === "admin" && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600 flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" /> ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-3">
            <MiniStat icon={BookOpen} label="Cursos" value={stats?.enrolledCourses || 0} color="text-blue-500" />
            <MiniStat icon={Clock} label="Horas" value={stats?.studyHours || 0} color="text-emerald-500" />
            <MiniStat icon={Flame} label="Racha" value={`${streak}d`} color="text-amber-500" />
            <MiniStat icon={Zap} label="XP" value={xp.toLocaleString()} color="text-purple-500" />
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">
              Nivel: <span className="text-gray-900">{currentLevel.name}</span>
            </span>
            {nextLevel && (
              <span className="text-xs font-medium text-gray-400">
                {xp.toLocaleString()} / {nextLevel.min.toLocaleString()} XP
              </span>
            )}
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color}`}
            />
          </div>
          {nextLevel && (
            <p className="text-[11px] text-gray-400 mt-1">
              Te faltan <span className="font-bold text-gray-600">{(nextLevel.min - xp).toLocaleString()} XP</span> para alcanzar el nivel <span className="font-bold">{nextLevel.name}</span>
            </p>
          )}
        </div>
      </motion.div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.id
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {/* Resumen */}
          {activeTab === "resumen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Course progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Cursos en Progreso
                </h3>
                {stats?.courseProgress?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.courseProgress.map((cp: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-800 truncate max-w-[75%]">{cp.title}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${cp.progress === 100 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                            {cp.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cp.progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-brand-blue to-indigo-500"}`}
                            style={{ width: `${cp.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">Aún no tienes cursos activos</p>
                )}
              </div>

              {/* Profile info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" /> Información Personal
                </h3>
                <div className="space-y-3">
                  <InfoRow icon={Mail} label="Email" value={profile.email || "—"} />
                  <InfoRow icon={Phone} label="Teléfono" value={profile.phone || "No configurado"} />
                  <InfoRow
                    icon={Calendar}
                    label="Suscripción"
                    value={profile.subscription_plan ? profile.subscription_plan.replace("plan_", "").toUpperCase() : "Sin plan"}
                  />
                  <InfoRow
                    icon={Target}
                    label="Departamento"
                    value={profile.department || "—"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actividad */}
          {activeTab === "actividad" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Actividad Reciente</h3>
              <p className="text-sm text-gray-500">
                El historial de actividad estará disponible próximamente. Aquí verás tus lecciones completadas, posts, comentarios y más.
              </p>
            </div>
          )}

          {/* Logros */}
          {activeTab === "logros" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Tus Logros
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const unlocked = xp >= ach.xpReq;
                  return (
                    <motion.div
                      key={ach.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                        ${unlocked
                          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-sm"
                          : "bg-gray-50/50 border-gray-100 opacity-60"
                        }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
                        ${unlocked ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                        {unlocked ? ach.icon : "🔒"}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold ${unlocked ? "text-gray-900" : "text-gray-400"}`}>
                          {ach.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{ach.desc}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${unlocked ? "text-amber-600" : "text-gray-400"}`}>
                          {unlocked ? "¡Desbloqueado!" : `${ach.xpReq} XP requeridos`}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Editar */}
          {activeTab === "editar" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
              <h3 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-gray-500" /> Editar Perfil
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all"
                  />
                </div>
                <button
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Mini stat for header ── */
function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <div className="font-bold text-sm text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 font-medium">{label}</div>
    </div>
  );
}

/* ── Info row ── */
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
      <span className="text-xs font-medium text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 truncate">{value}</span>
    </div>
  );
}
