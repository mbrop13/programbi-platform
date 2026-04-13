import { useState, useEffect, useCallback } from "react";
import { Users, CreditCard, Settings, Plus, TrendingUp, Search, MoreHorizontal, ShieldCheck, Loader2, Activity, DollarSign, MessageSquare, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Ban, Mail, UserPlus, BarChart3, Palette, GraduationCap, Upload, Download, ChevronRight, Trash2, X, CheckCircle, AlertCircle, Globe, Lock, Play, FileText, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommunityMembers } from "@/lib/supabase/comunidad";
import { adminGetCourses, adminGetLessons, adminAddLesson, adminTogglePublish, adminToggleHidden, adminDeleteLesson, adminToggleFreePreview, adminGetAllUsers, adminGetUserEnrollments, adminEnrollUser, adminRemoveEnrollment, adminUpdateUserRole, adminBulkImport, adminGetExportData, getAllPublishedCourses, adminGetDashboardStats } from "@/lib/supabase/comunidad-ai";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Estadísticas", icon: BarChart3 },
    { id: "members", label: "Miembros", icon: Users },
    { id: "courses", label: "Cursos", icon: GraduationCap },
    { id: "export_csv", label: "Exportar Datos", icon: Download },
    { id: "import", label: "Importar CSV", icon: Upload },
    { id: "plans", label: "Planes", icon: CreditCard },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto min-h-[600px]">
        <div className="w-full lg:w-60 flex flex-col gap-1.5 shrink-0">
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Admin Panel</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Gestión de Plataforma</p>
                </div>
              </div>
           </div>
           
           {sidebarItems.map(item => {
             const Icon = item.icon;
             return (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                   ${activeTab === item.id 
                     ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                     : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200"}
                 `}
               >
                  <Icon className="w-4 h-4" /> {item.label}
               </button>
             )
           })}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && <AdminOverview />}
              {activeTab === "members" && <AdminMembers />}
              { activeTab === "courses" && <AdminCourses /> }
              { activeTab === "export_csv" && <AdminExportCsv /> }
              { activeTab === "import" && <AdminImport /> }
              { activeTab === "plans" && <AdminPlans /> }
              { activeTab === "settings" && <AdminSettings /> }
            </motion.div>
        </div>
    </div>
  );
}

// ─── OVERVIEW ───
function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetDashboardStats();
        setStats(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const formatCLP = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando estadísticas...</span>
      </div>
    );
  }

  const cards = [
    { label: "Ingresos este mes", value: formatCLP(stats?.revenue?.thisMonth || 0), change: `${stats?.revenue?.change || 0}%`, positive: parseFloat(stats?.revenue?.change || '0') >= 0, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "Usuarios Registrados", value: String(stats?.users?.total || 0), change: "+" + (stats?.users?.total || 0), positive: true, icon: Users, color: "bg-blue-50 text-brand-blue" },
    { label: "Enrollments Activos", value: String(stats?.enrollments?.total || 0), change: "", positive: true, icon: GraduationCap, color: "bg-violet-50 text-violet-600" },
    { label: "Ventas este mes", value: String(stats?.sales?.thisMonth || 0), change: `${stats?.sales?.change || 0}%`, positive: parseFloat(stats?.sales?.change || '0') >= 0, icon: Activity, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Visión General</h2>
           <p className="text-sm text-gray-400">Datos en tiempo real desde Supabase</p>
         </div>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
           {cards.map((stat, i) => { const Icon = stat.icon; return (
             <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
               className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
               <div className="flex items-center justify-between mb-3">
                 <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                 {stat.change && (
                   <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-500' : 'text-red-400'}`}>
                     {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}{stat.change}
                   </div>
                 )}
               </div>
               <div className="text-2xl font-black text-gray-900 mb-0.5">{stat.value}</div>
               <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
             </motion.div>
           )})}
       </div>

       {/* Best course + Total revenue */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
         <div className="bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl p-6 text-white">
           <div className="text-sm font-medium opacity-80 mb-1">Ingresos Totales</div>
           <div className="text-3xl font-black">{formatCLP(stats?.revenue?.total || 0)}</div>
           <div className="text-xs opacity-60 mt-1">Todas las ventas acumuladas</div>
         </div>
         <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
           <div className="text-sm text-gray-500 font-medium mb-1">Curso Más Vendido</div>
           <div className="text-lg font-black text-gray-900">{stats?.bestCourse || '—'}</div>
           <div className="text-xs text-gray-400 mt-1">Basado en todas las transacciones</div>
         </div>
       </div>

       {/* Recent transactions */}
       {stats?.recentPayments?.length > 0 && (
         <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-50">
             <h3 className="font-bold text-sm text-gray-900">Últimas Transacciones</h3>
           </div>
           <div className="divide-y divide-gray-50">
             {stats.recentPayments.slice(0, 5).map((p: any) => (
               <div key={p.id} className="flex items-center justify-between px-6 py-3">
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${p.status === 'paid' ? 'bg-emerald-400' : p.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'}`} />
                   <div>
                     <div className="text-sm font-semibold text-gray-800">{p.payer_email}</div>
                     <div className="text-[11px] text-gray-400">{p.course?.title || 'Curso'}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-gray-900">{formatCLP(p.amount)}</div>
                   <div className="text-[11px] text-gray-400">
                     {p.paid_at ? new Date(p.paid_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : p.status}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}
    </div>
  )
}

// ─── MEMBERS ───
function AdminMembers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollType, setEnrollType] = useState("full");

  useEffect(() => {
    async function load() {
      try {
        const [userData, courseData] = await Promise.all([adminGetAllUsers(), adminGetCourses()]);
        setUsers(userData);
        setCourses(courseData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const selectUser = async (user: any) => {
    setSelectedUser(user);
    setLoadingEnrollments(true);
    try {
      const enrolls = await adminGetUserEnrollments(user.id);
      setUserEnrollments(enrolls);
    } catch (err) { console.error(err); }
    finally { setLoadingEnrollments(false); }
  };

  const handleEnroll = async () => {
    if (!selectedUser || !enrollCourseId) return;
    try {
      await adminEnrollUser(selectedUser.id, enrollCourseId, enrollType);
      const enrolls = await adminGetUserEnrollments(selectedUser.id);
      setUserEnrollments(enrolls);
      setEnrollCourseId("");
    } catch (err) { console.error(err); }
  };

  const handleRemoveEnrollment = async (courseSlug: string) => {
    if (!selectedUser) return;
    try {
      await adminRemoveEnrollment(selectedUser.id, courseSlug);
      setUserEnrollments(prev => prev.filter(e => e.course_slug !== courseSlug));
    } catch (err) { console.error(err); }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await adminUpdateUserRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Miembros</h2>
            <p className="text-sm text-gray-400">{users.length} usuarios registrados</p>
          </div>
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Buscar usuario..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all w-full sm:w-64" />
          </div>
       </div>

       {/* User detail panel */}
       <AnimatePresence>
         {selectedUser && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
             className="mb-6 overflow-hidden">
             <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                     {(selectedUser.full_name || '?')[0]}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900">{selectedUser.full_name || "Sin nombre"}</h3>
                     <p className="text-sm text-gray-400">{selectedUser.email}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <select value={selectedUser.role || 'student'} onChange={(e) => handleChangeRole(selectedUser.id, e.target.value)}
                     className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none">
                     <option value="student">Estudiante</option>
                     <option value="instructor">Instructor</option>
                     <option value="admin">Admin</option>
                   </select>
                   <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               </div>

               <h4 className="font-bold text-sm text-gray-700 mb-3">Cursos Activos</h4>
               {loadingEnrollments ? (
                 <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
               ) : (
                 <>
                   {userEnrollments.length === 0 ? (
                     <p className="text-sm text-gray-400 mb-4">Sin cursos asignados</p>
                   ) : (
                     <div className="space-y-2 mb-4">
                       {userEnrollments.map((e: any) => (
                         <div key={e.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                           <div className="flex items-center gap-3">
                             <GraduationCap className="w-4 h-4 text-brand-blue" />
                             <span className="text-sm font-semibold text-gray-800">{e.course?.title || e.course_slug}</span>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                               e.access_type === 'full' ? 'bg-emerald-100 text-emerald-700' :
                               e.access_type === 'trial' ? 'bg-amber-100 text-amber-700' :
                               'bg-blue-100 text-blue-700'}`}>
                               {e.access_type === 'full' ? 'Completo' : e.access_type === 'trial' ? 'Prueba' : 'Gratis'}
                             </span>
                           </div>
                           <button onClick={() => handleRemoveEnrollment(e.course_slug)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}

                   <div className="flex items-center gap-2">
                     <select value={enrollCourseId} onChange={e => setEnrollCourseId(e.target.value)}
                       className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-blue/40">
                       <option value="">Seleccionar curso...</option>
                       {courses.filter(c => !userEnrollments.some((e: any) => e.course_slug === c.slug)).map((c: any) => (
                         <option key={c.id} value={c.slug}>{c.title} {c.is_hidden ? '(Oculto)' : ''}</option>
                       ))}
                     </select>
                     <select value={enrollType} onChange={e => setEnrollType(e.target.value)}
                       className="text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none w-28">
                       <option value="full">Completo</option>
                       <option value="trial">Prueba</option>
                       <option value="free">Gratis</option>
                     </select>
                     <button onClick={handleEnroll} disabled={!enrollCourseId}
                       className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-30">
                       Activar
                     </button>
                   </div>
                 </>
               )}
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <span className="text-sm text-gray-400">Cargando usuarios...</span>
          </div>
       ) : (
       <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
              <thead>
                 <tr className="bg-gray-50/80 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-5 py-3.5">Usuario</th>
                    <th className="px-5 py-3.5">Rol</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Registrado</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filtered.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => selectUser(u)}>
                       <td className="px-5 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                             {(u.full_name || '?')[0]}
                           </div>
                           <div>
                             <div className="font-semibold text-gray-900">{u.full_name || 'Sin Nombre'}</div>
                             <div className="text-xs text-gray-400">{u.email}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                              u.role === 'instructor' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'}`}>
                             {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                             {(u.role || 'student').charAt(0).toUpperCase() + (u.role || 'student').slice(1)}
                          </span>
                       </td>
                       <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : '—'}
                       </td>
                       <td className="px-5 py-4 text-right">
                          <button className="p-2 rounded-lg text-gray-300 hover:text-brand-blue hover:bg-blue-50 transition-colors" title="Ver detalles">
                             <ChevronRight className="w-4 h-4" />
                          </button>
                       </td>
                    </motion.tr>
                 ))}
              </tbody>
          </table>
       </div>
       )}
    </div>
  )
}

// ─── COURSES ───
function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', module_name: '', video_url: '', module_order: 1, lesson_order: 1, is_free_preview: false });

  useEffect(() => {
    async function load() {
      try { const data = await adminGetCourses(); setCourses(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const selectCourse = async (course: any) => {
    setSelectedCourse(course);
    setLoadingLessons(true);
    try {
      const data = await adminGetLessons(course.id);
      setLessons(data);
    } catch (err) { console.error(err); }
    finally { setLoadingLessons(false); }
  };

  const handleAddLesson = async () => {
    if (!selectedCourse || !newLesson.title || !newLesson.video_url) return;
    try {
      await adminAddLesson({ ...newLesson, course_id: selectedCourse.id });
      const data = await adminGetLessons(selectedCourse.id);
      setLessons(data);
      setNewLesson({ title: '', module_name: '', video_url: '', module_order: 1, lesson_order: 1, is_free_preview: false });
      setShowAddLesson(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await adminDeleteLesson(lessonId);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (err) { console.error(err); }
  };

  const handleTogglePreview = async (lessonId: string) => {
    try {
      await adminToggleFreePreview(lessonId);
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, is_free_preview: !l.is_free_preview } : l));
    } catch (err) { console.error(err); }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      await adminTogglePublish(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: !c.is_published } : c));
    } catch (err) { console.error(err); }
  };

  const handleToggleHidden = async (courseId: string) => {
    try {
      await adminToggleHidden(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_hidden: !c.is_hidden } : c));
    } catch (err) { console.error(err); }
  };

  if (selectedCourse) {
    // Grouped lessons by module
    const modules: Record<string, any[]> = {};
    lessons.forEach(l => {
      if (!modules[l.module_name]) modules[l.module_name] = [];
      modules[l.module_name].push(l);
    });

    return (
      <div className="p-6 sm:p-8">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mb-4 transition-colors">
          ← Volver a cursos
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">{selectedCourse.title}</h2>
            <p className="text-sm text-gray-400">{lessons.length} lecciones · {selectedCourse.duration_hours}h</p>
          </div>
          <button onClick={() => setShowAddLesson(!showAddLesson)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Agregar Lección
          </button>
        </div>

        {/* Add Lesson Form */}
        <AnimatePresence>
          {showAddLesson && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Nueva Lección</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Título de la lección" value={newLesson.title} onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  <input type="text" placeholder="Nombre del módulo" value={newLesson.module_name} onChange={e => setNewLesson(p => ({ ...p, module_name: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500 shrink-0" />
                    <input type="text" placeholder="URL de YouTube (https://youtube.com/watch?v=...)" value={newLesson.video_url} onChange={e => setNewLesson(p => ({ ...p, video_url: e.target.value }))}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500">Módulo #</label>
                      <input type="number" min={1} value={newLesson.module_order} onChange={e => setNewLesson(p => ({ ...p, module_order: parseInt(e.target.value) || 1 }))}
                        className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500">Lección #</label>
                      <input type="number" min={1} value={newLesson.lesson_order} onChange={e => setNewLesson(p => ({ ...p, lesson_order: parseInt(e.target.value) || 1 }))}
                        className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="free_preview" checked={newLesson.is_free_preview} onChange={e => setNewLesson(p => ({ ...p, is_free_preview: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                    <label htmlFor="free_preview" className="text-sm font-medium text-gray-700">Lección de prueba gratuita</label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAddLesson(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
                  <button onClick={handleAddLesson} disabled={!newLesson.title || !newLesson.video_url}
                    className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40">
                    Guardar Lección
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lessons List */}
        {loadingLessons ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
        ) : lessons.length === 0 ? (
          <div className="py-12 text-center">
            <Play className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No hay lecciones. Agrega la primera.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(modules).map(([moduleName, moduleLessons]) => (
              <div key={moduleName} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 font-bold text-sm text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> {moduleName || "Sin módulo"}
                </div>
                <div className="divide-y divide-gray-50">
                  {moduleLessons.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{lesson.lesson_order}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</div>
                        <div className="text-[11px] text-gray-400 truncate">{lesson.video_url}</div>
                      </div>
                      {lesson.is_free_preview && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">GRATIS</span>
                      )}
                      <button onClick={() => handleTogglePreview(lesson.id)} title={lesson.is_free_preview ? "Quitar preview" : "Hacer gratuita"}
                        className={`p-1.5 rounded-lg transition-colors ${lesson.is_free_preview ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Cursos</h2>
           <p className="text-sm text-gray-400">{courses.length} cursos en la plataforma</p>
         </div>
       </div>

       {loading ? (
         <div className="py-20 flex flex-col items-center gap-3">
           <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
           <span className="text-sm text-gray-400">Cargando cursos...</span>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {courses.map((course: any) => (
             <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
               onClick={() => selectCourse(course)}
               className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
               <div className="absolute top-4 right-4 flex items-center gap-2">
                 {course.is_hidden ? (
                   <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <EyeOff className="w-3 h-3" /> Oculto Catálogo
                   </span>
                 ) : null}
                 {course.is_published ? (
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <Globe className="w-3 h-3" /> Publicado
                   </span>
                 ) : (
                   <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                     <Lock className="w-3 h-3" /> Borrador
                   </span>
                 )}
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.accent_color + '15' }}>
                   <GraduationCap className="w-6 h-6" style={{ color: course.accent_color }} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-blue transition-colors truncate">{course.title}</h3>
                   <p className="text-xs text-gray-400 mt-0.5">{course.duration_hours}h · {course.level}</p>
                   {course.tech_stack && (
                     <div className="flex flex-wrap gap-1 mt-2">
                       {course.tech_stack.slice(0, 3).map((t: string, i: number) => (
                         <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{t}</span>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
               <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                 <button onClick={(e) => { e.stopPropagation(); handleTogglePublish(course.id); }}
                   className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${course.is_published ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                   {course.is_published ? 'Borrador' : 'Publicar'}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleToggleHidden(course.id); }}
                   className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors border ${course.is_hidden ? 'bg-white border-blue-200 text-brand-blue hover:bg-blue-50' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                   {course.is_hidden ? 'Mostrar Catálogo' : 'Ocultar Catálogo'}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); selectCourse(course); }}
                   className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors">
                   <Play className="w-4 h-4" />
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       )}
    </div>
  )
}

// ─── EXPORT CSV ───
function AdminExportCsv() {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); // all, course, plan
  const [filterCourse, setFilterCourse] = useState('');
  const [filterPlan, setFilterPlan] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [uData, cData] = await Promise.all([adminGetExportData(), adminGetCourses()]);
        setUsers(uData);
        setCourses(cData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleExport = () => {
    let filtered = users;
    if (filterType === 'course' && filterCourse) {
      filtered = users.filter(u => u.enrollments?.some((e: any) => e.course_slug === filterCourse));
    } else if (filterType === 'plan' && filterPlan) {
      filtered = users.filter(u => u.subscription_plan === filterPlan);
    }

    if (filtered.length === 0) return alert("No hay usuarios que coincidan con estos filtros.");

    // UTF-8 BOM helps excel read accents properly
    const head = ["ID", "Nombre", "Email", "Rol", "Suscripción", "Cursos (Slugs)", "Fecha Registro"];
    const rows = filtered.map(u => {
      const coursesNames = (u.enrollments || []).map((e: any) => e.course_slug).join(' | ');
      return [
        u.id,
        `"${u.full_name || ''}"`,
        u.email,
        u.role || 'student',
        u.subscription_plan || 'ninguno',
        `"${coursesNames}"`,
        new Date(u.created_at).toLocaleDateString("es-MX")
      ].join(',');
    });

    const csvContent = "\uFEFF" + [head.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `alumnos_export_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-3" />
        <span className="text-sm text-gray-400">Calculando matriz de usuarios y ventas...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Exportador de Datos</h2>
         <p className="text-sm text-gray-400">Filtra y exporta tus usuarios en formato CSV, listos para campañas de correos.</p>
       </div>

       <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           <button onClick={() => setFilterType('all')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'all' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <Users className={`w-5 h-5 ${filterType==='all' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='all' ? 'text-brand-blue': 'text-gray-700'}`}>Todos</div><div className="text-[10px] text-gray-400 mt-0.5">La base completa</div></div>
           </button>
           <button onClick={() => setFilterType('plan')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'plan' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <CreditCard className={`w-5 h-5 ${filterType==='plan' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='plan' ? 'text-brand-blue': 'text-gray-700'}`}>Suscriptores</div><div className="text-[10px] text-gray-400 mt-0.5">Por plan activo</div></div>
           </button>
           <button onClick={() => setFilterType('course')} className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${filterType === 'course' ? 'bg-white border-brand-blue shadow-sm ring-1 ring-brand-blue' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}>
             <GraduationCap className={`w-5 h-5 ${filterType==='course' ? 'text-brand-blue': 'text-gray-400'}`} />
             <div><div className={`text-sm font-bold ${filterType==='course' ? 'text-brand-blue': 'text-gray-700'}`}>Estudiantes</div><div className="text-[10px] text-gray-400 mt-0.5">De un curso específico</div></div>
           </button>
         </div>

         <AnimatePresence mode="wait">
           {filterType === 'plan' && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Seleccionar Plan</label>
               <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue/50">
                 <option value="">-- Elige un plan --</option>
                 <option value="pro">Plan Pro</option>
                 <option value="max">Plan Max</option>
                 <option value="ultra">Plan Ultra</option>
                 <option value="ultraplus">Plan Ultra+</option>
               </select>
             </motion.div>
           )}
           {filterType === 'course' && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Seleccionar Curso</label>
               <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue/50">
                 <option value="">-- Elige un curso --</option>
                 {courses.map(c => <option key={c.id} value={c.slug}>{c.title} {c.is_hidden ? '(Oculto)' : ''}</option>)}
               </select>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button onClick={handleExport} className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2">
              <Download className="w-4 h-4" /> 
              Generar y Descargar CSV
            </button>
         </div>
       </div>
    </div>
  )
}

// ─── CSV IMPORT ───
function AdminImport() {
  const [csvData, setCsvData] = useState<{ email: string; curso_slug: string; access_type: string }[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [rawText, setRawText] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;
    
    // Skip header
    const rows = lines.slice(1).map(line => {
      const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
      return { email: parts[0] || '', curso_slug: parts[1] || '', access_type: parts[2] || 'full' };
    }).filter(r => r.email && r.curso_slug);

    setCsvData(rows);
  };

  const handleImport = async () => {
    if (csvData.length === 0) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await adminBulkImport(csvData);
      setResult(res);
    } catch (err) { console.error(err); }
    finally { setImporting(false); }
  };

  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Importar por CSV</h2>
         <p className="text-sm text-gray-400">Carga masiva de enrollments desde un archivo CSV</p>
       </div>

       <div className="bg-gray-50 rounded-2xl border border-gray-200 border-dashed p-8 text-center mb-6">
         <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
         <p className="text-sm text-gray-500 mb-4">Arrastra un archivo CSV o haz clic para seleccionar</p>
         <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
         <label htmlFor="csv-upload" className="inline-block px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm cursor-pointer transition-colors shadow-sm">
           Seleccionar CSV
         </label>
         <p className="text-[11px] text-gray-400 mt-3">
           Formato: <code className="bg-gray-200 px-1.5 py-0.5 rounded">email,curso_slug,access_type</code>
         </p>
         <p className="text-[11px] text-gray-400 mt-1">
           access_type: <code className="bg-gray-200 px-1 rounded">full</code> | <code className="bg-gray-200 px-1 rounded">trial</code> | <code className="bg-gray-200 px-1 rounded">free</code>
         </p>
       </div>

       {/* Preview */}
       {csvData.length > 0 && (
         <div className="mb-6">
           <div className="flex items-center justify-between mb-3">
             <h3 className="font-bold text-sm text-gray-700">{csvData.length} registros para importar</h3>
             <button onClick={handleImport} disabled={importing}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
               {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               {importing ? "Importando..." : "Ejecutar Importación"}
             </button>
           </div>
           <div className="overflow-x-auto rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
             <table className="w-full text-left text-sm">
               <thead className="sticky top-0 bg-gray-50">
                 <tr className="text-gray-400 text-xs uppercase font-semibold">
                   <th className="px-4 py-2.5">#</th>
                   <th className="px-4 py-2.5">Email</th>
                   <th className="px-4 py-2.5">Curso (slug)</th>
                   <th className="px-4 py-2.5">Tipo Acceso</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {csvData.map((row, i) => (
                   <tr key={i} className="text-gray-700">
                     <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                     <td className="px-4 py-2 font-medium">{row.email}</td>
                     <td className="px-4 py-2"><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{row.curso_slug}</code></td>
                     <td className="px-4 py-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                         row.access_type === 'full' ? 'bg-emerald-100 text-emerald-700' :
                         row.access_type === 'trial' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                         {row.access_type}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}

       {/* Results */}
       {result && (
         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 space-y-3"
           style={{ borderColor: result.failed > 0 ? '#fbbf24' : '#10b981', backgroundColor: result.failed > 0 ? '#fffbeb' : '#ecfdf5' }}>
           <div className="flex items-center gap-3">
             {result.failed === 0 ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-amber-500" />}
             <h3 className="font-bold text-gray-900">Importación completada</h3>
           </div>
           <p className="text-sm text-gray-700">
             <strong className="text-emerald-600">{result.success}</strong> exitosos · <strong className="text-red-500">{result.failed}</strong> fallidos
           </p>
           {result.errors.length > 0 && (
             <div className="bg-white/60 rounded-xl p-4 max-h-32 overflow-y-auto">
               {result.errors.map((err, i) => (
                 <div key={i} className="text-xs text-red-600 py-0.5">• {err}</div>
               ))}
             </div>
           )}
         </motion.div>
       )}
    </div>
  )
}

// ─── PLANS ───
function AdminPlans() {
  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Planes de Pago</h2>
            <p className="text-sm text-gray-400">Gestiona los planes de tu comunidad</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
             <Plus className="w-4 h-4" /> Crear Plan
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="border border-gray-200 rounded-2xl p-6 relative hover:shadow-md transition-all">
              <div className="absolute top-5 right-5"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Activo</span></div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4"><CreditCard className="w-6 h-6 text-brand-blue" /></div>
              <h3 className="font-black text-lg text-gray-900 mb-1">Premium Anual</h3>
              <div className="text-3xl font-black text-brand-blue mb-1">$199 <span className="text-sm text-gray-400 font-medium">/ año</span></div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Acceso completo a todas las clases, comunidad y Masterclasses.</p>
              <div className="flex items-center gap-2">
                 <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-gray-200">Editar</button>
              </div>
           </div>
           <div className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl p-6 relative hover:shadow-md transition-all">
              <div className="absolute top-5 right-5"><span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-lg">⭐ Popular</span></div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-indigo-600" /></div>
              <h3 className="font-black text-lg text-indigo-900 mb-1">Bootcamp Intensivo</h3>
              <div className="text-3xl font-black text-indigo-600 mb-1">$499 <span className="text-sm text-gray-400 font-medium">pago único</span></div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">4 semanas en vivo con revisión de código 1-a-1 y proyectos reales.</p>
              <div className="flex items-center gap-2">
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">Editar</button>
              </div>
           </div>
       </div>
    </div>
  )
}

// ─── SETTINGS ───
function AdminSettings() {
  return (
    <div className="p-6 sm:p-8">
       <div className="mb-8">
         <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Configuración</h2>
         <p className="text-sm text-gray-400">Personaliza tu comunidad</p>
       </div>
       <div className="space-y-6 max-w-2xl">
         <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
           <h3 className="font-bold text-gray-900 text-sm mb-4">Información General</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre de la Comunidad</label>
               <input type="text" defaultValue="ProgramBI Community" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all" />
             </div>
             <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1.5">Descripción</label>
               <textarea defaultValue="Comunidad de Data Analytics, SQL, Python y Power BI" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all resize-none" rows={3} />
             </div>
           </div>
         </div>
         <button className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
           Guardar Cambios
         </button>
       </div>
    </div>
  )
}
