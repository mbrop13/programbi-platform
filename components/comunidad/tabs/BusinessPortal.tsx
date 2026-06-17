"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  Mail, 
  Building2,
  X,
  Loader2,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Member {
  id: string;
  fullName: string;
  email: string;
  department: string;
  studyStreak: number;
  xpPoints: number;
  createdAt: string;
  certificatesCount: number;
  avgProgress: number;
  coursesProgress: Array<{
    id: string;
    courseTitle: string;
    status: string;
    enrolledAt: string;
    completedAt: string | null;
  }>;
}

interface Invitation {
  id: string;
  email: string;
  department: string;
  created_at: string;
}

interface BusinessStats {
  orgName: string;
  logoUrl: string | null;
  metrics: {
    totalMembers: number;
    activeLearners: number;
    totalCertificates: number;
    averageProgress: number;
  };
  studyActivity: Array<{ day: string; hours: number }>;
  departmentStats: Array<{ name: string; employeesCount: number; progress: number }>;
}

export default function BusinessPortal() {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("todos");
  
  // Modals / Actions
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteDept, setInviteDept] = useState("General");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [inviteErrorMsg, setInviteErrorMsg] = useState<string | null>(null);
  
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [removingInviteId, setRemovingInviteId] = useState<string | null>(null);

  // Load Business Dashboard Data
  const loadDashboardData = async () => {
    try {
      const [statsRes, membersRes] = await Promise.all([
        fetch("/api/business/stats"),
        fetch("/api/business/members")
      ]);

      if (!statsRes.ok || !membersRes.ok) {
        throw new Error("No se pudieron cargar los datos del portal corporativo");
      }

      const statsData = await statsRes.json();
      const membersData = await membersRes.json();

      setStats(statsData);
      setMembers(membersData.members || []);
      setInvitations(membersData.invitations || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocurrió un error al cargar la información corporativa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Invite Submit
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInvite(true);
    setInviteSuccessMsg(null);
    setInviteErrorMsg(null);

    try {
      const res = await fetch("/api/business/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          fullName: inviteName,
          department: inviteDept
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar la invitación");
      }

      setInviteSuccessMsg(data.message || "Colaborador invitado exitosamente");
      setInviteEmail("");
      setInviteName("");
      
      // Reload members list in background
      loadDashboardData();
    } catch (err: any) {
      setInviteErrorMsg(err?.message || "Ocurrió un error al invitar.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  // Remove Employee / Disassociate
  const handleRemoveMember = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas revocar el acceso a este colaborador de la suscripción corporativa? Sus progresos se mantendrán pero no se cobrará como cupo activo.")) {
      return;
    }
    setRemovingMemberId(userId);
    try {
      const res = await fetch(`/api/business/members?userId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== userId));
        // Refresh stats
        loadDashboardData();
      } else {
        alert("Error al remover colaborador");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRemovingMemberId(null);
    }
  };

  // Cancel Pending Invitation
  const handleCancelInvitation = async (inviteId: string) => {
    if (!confirm("¿Deseas cancelar esta invitación pendiente?")) {
      return;
    }
    setRemovingInviteId(inviteId);
    try {
      const res = await fetch(`/api/business/members?inviteId=${inviteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setInvitations(invitations.filter(i => i.id !== inviteId));
      } else {
        alert("Error al cancelar invitación");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRemovingInviteId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (members.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nombre Completo,Correo Electronico,Departamento,Puntos XP,Racha (Dias),Cursos Inscritos,Certificados Obtenidos,Progreso Promedio\n";

    members.forEach((m) => {
      const cleanName = m.fullName.replace(/,/g, " ");
      const coursesStr = m.coursesProgress.map(c => c.courseTitle).join(" | ");
      csvContent += `${cleanName},${m.email},${m.department},${m.xpPoints},${m.studyStreak},"${coursesStr}",${m.certificatesCount},${m.avgProgress}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Capacitacion_ProgramBI_${stats?.orgName || "Empresa"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "todos" || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Unique departments for filtering
  const allDepartments = Array.from(new Set(members.map(m => m.department).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-8 rounded-3xl border border-red-100 max-w-2xl mx-auto text-center mt-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Acceso No Autorizado</h2>
        <p className="text-sm mb-6">{error}</p>
        <a href="/comunidad/inicio" className="bg-brand-blue text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-md">Volver al Inicio</a>
      </div>
    );
  }

  const maxHours = stats?.studyActivity ? Math.max(...stats.studyActivity.map(d => d.hours), 1) : 1;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pb-12">
      
      {/* ─── BANNER DE BIENVENIDA EMPRESA ─── */}
      <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative z-10 flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-700 flex items-center justify-center p-2.5 shadow-sm shrink-0 mx-auto">
            {stats?.logoUrl ? (
              <img src={stats.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-9 h-9 text-slate-800" />
            )}
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none mb-1.5">
              Portal Corporativo — {stats?.orgName}
            </h1>
            <p className="text-[13px] text-slate-400 font-medium">
              Gestiona el plan de capacitación, supervisa progresos y descarga reportes de tu equipo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 hover:border-white/20 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Exportar CSV
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-black text-xs shadow-md shadow-brand-blue/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Agregar Colaborador
          </button>
        </div>
      </div>

      {/* ─── METRICAS GENERALES (GRID) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* TOTAL MEMBERS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {stats?.metrics.totalMembers}
            </div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Miembros Registrados
            </div>
          </div>
        </div>

        {/* ACTIVE LEARNERS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {stats?.metrics.activeLearners}
            </div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Estudiantes Activos
            </div>
          </div>
        </div>

        {/* COMPLETED CERTIFICATES */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {stats?.metrics.totalCertificates}
            </div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Certificados Oficiales
            </div>
          </div>
        </div>

        {/* AVERAGE PROGRESS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {stats?.metrics.averageProgress}%
            </div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Promedio de Avance
            </div>
          </div>
        </div>

      </div>

      {/* ─── ACTIVIDAD SEMANAL Y AREAS DE INTERES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: ACTIVIDAD DE ESTUDIO SEMANAL */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Horas de Estudio Semanales</h3>
            <p className="text-[11px] text-gray-400">Total de horas invertidas por el equipo de lunes a domingo.</p>
          </div>
          
          {/* Custom SVG/Tailwind Bar Chart */}
          <div className="flex-1 flex items-end justify-between h-56 pt-6 px-4">
            {stats?.studyActivity.map((dayData, index) => {
              const barHeightPercent = Math.max((dayData.hours / maxHours) * 100, 4); // minimum 4% so we can see it
              return (
                <div key={dayData.day} className="flex flex-col items-center gap-2.5 w-10 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shadow absolute -translate-y-8 pointer-events-none">
                    {dayData.hours} hrs
                  </div>
                  
                  {/* Column bar */}
                  <div className="w-full bg-gray-50 rounded-xl overflow-hidden h-40 flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeightPercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-brand-blue to-indigo-500 rounded-t-lg group-hover:brightness-110 transition-all"
                    />
                  </div>
                  
                  {/* Day label */}
                  <span className="text-[11px] font-bold text-gray-400">{dayData.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DEPARTAMENTOS / AREAS DE LA EMPRESA */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Avance por Área</h3>
            <p className="text-[11px] text-gray-400">Progreso promedio por departamento corporativo.</p>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-56 pr-1">
            {stats?.departmentStats.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-12">No hay departamentos registrados.</div>
            ) : (
              stats?.departmentStats.map((dept) => (
                <div key={dept.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-700">{dept.name}</span>
                    <span className="text-brand-blue">{dept.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full" 
                      style={{ width: `${dept.progress}%` }} 
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">{dept.employeesCount} colaborador(es)</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ─── DIRECTORIO DE COLABORADORES ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Filtros de Tabla */}
        <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm w-full sm:w-auto shrink-0">Directorio de Colaboradores</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Buscar por nombre o email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue/30 transition-all"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filtrar departamento */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
            >
              <option value="todos">Todas las Áreas</option>
              {allDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Colaborador</th>
                <th className="py-4 px-6">Departamento</th>
                <th className="py-4 px-6 text-center">Racha (Días)</th>
                <th className="py-4 px-6 text-center">Puntos XP</th>
                <th className="py-4 px-6 text-center">Certificados</th>
                <th className="py-4 px-6">Progreso General</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">No se encontraron colaboradores en esta sección.</td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-[13px]">{m.fullName}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">{m.email}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-600">{m.department}</td>
                    <td className="py-4 px-6 text-center font-bold text-orange-500">{m.studyStreak} 🔥</td>
                    <td className="py-4 px-6 text-center font-semibold text-indigo-600">{m.xpPoints.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center font-bold text-brand-blue">{m.certificatesCount} 🏆</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5 w-40">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-blue rounded-full" style={{ width: `${m.avgProgress}%` }} />
                        </div>
                        <span className="font-bold text-gray-700 min-w-[28px] text-[11px]">{m.avgProgress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={removingMemberId === m.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all inline-flex items-center"
                      >
                        {removingMemberId === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SECCIÓN DE INVITACIONES PENDIENTES ─── */}
      {invitations.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Invitaciones Pendientes</h3>
            <p className="text-[11px] text-gray-400">Usuarios que aún no registran su cuenta pero ya tienen su cupo corporativo asignado.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Departamento Asignado</th>
                  <th className="py-4 px-6">Fecha de Invitación</th>
                  <th className="py-4 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {inv.email}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-600">{inv.department}</td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(inv.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleCancelInvitation(inv.id)}
                        disabled={removingInviteId === inv.id}
                        className="text-[11px] font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        {removingInviteId === inv.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Cancelar"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL: AGREGAR COLABORADOR ─── */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-display font-black text-lg text-gray-900">Agregar Colaborador</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="p-6 flex flex-col gap-4">
                
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email del Colaborador</label>
                  <input 
                    type="email" 
                    required
                    placeholder="ejemplo@miempresa.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nombre Completo (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Juan Perez"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                  />
                </div>

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Departamento / Área</label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
                  >
                    <option value="General">General</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Tecnología">Tecnología (TI)</option>
                    <option value="Marketing">Marketing / Ventas</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                  </select>
                </div>

                {/* Messages */}
                {inviteSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{inviteSuccessMsg}</span>
                  </div>
                )}
                {inviteErrorMsg && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{inviteErrorMsg}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={submittingInvite}
                  className="w-full bg-brand-blue hover:bg-blue-600 text-white font-black py-3 rounded-xl shadow-md transition-all mt-2 text-xs flex items-center justify-center gap-2"
                >
                  {submittingInvite ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Agregar Miembro"
                  )}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
