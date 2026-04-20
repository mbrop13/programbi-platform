import { useState, useEffect, useCallback } from "react";
import { Users, CreditCard, Settings, Plus, TrendingUp, Search, MoreHorizontal, ShieldCheck, Loader2, Activity, DollarSign, MessageSquare, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Ban, Mail, UserPlus, BarChart3, Palette, GraduationCap, Upload, Download, ChevronRight, Trash2, X, CheckCircle, AlertCircle, Globe, Lock, Play, FileText, Video, Megaphone, Sparkles, Tag, ArrowRight, Bell, Percent, ShoppingCart, Newspaper, Star, ExternalLink, Edit3, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommunityMembers } from "@/lib/supabase/comunidad";
import { adminGetCourses, adminGetLessons, adminAddLesson, adminTogglePublish, adminToggleHidden, adminDeleteLesson, adminToggleFreePreview, adminGetAllUsers, adminGetUserEnrollments, adminEnrollUser, adminRemoveEnrollment, adminUpdateUserRole, adminBulkImport, adminGetExportData, getAllPublishedCourses, adminGetDashboardStats, adminGetLeads, adminGetSchedules, adminAddSchedule, adminDeleteSchedule, adminToggleScheduleActive, adminGetPopups, adminCreatePopup, adminUpdatePopup, adminTogglePopup, adminDeletePopup, adminGetPromotions, adminCreatePromotion, adminTogglePromotion, adminDeletePromotion, adminGetPriceOverrides, adminUpsertPriceOverride, adminGetArticles, adminCreateArticle, adminUpdateArticle, adminDeleteArticle, adminToggleArticlePublish, adminToggleArticleFeatured, adminGetNewsletterCategories, adminCreateNewsletterCategory, adminUpdateNewsletterCategory, adminDeleteNewsletterCategory, adminToggleNewsletterCategory } from "@/lib/supabase/comunidad-ai";
import { Calendar } from "lucide-react";
import { courses as allCourses } from "@/lib/data/courses";
import { communityPlans } from "@/lib/data/community_plans";
import ArticleBlockEditor from "@/components/shared/ArticleBlockEditor";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [unreadMembersCount, setUnreadMembersCount] = useState(0);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);

  useEffect(() => {
    async function checkUnreads() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: views } = await supabase.from("admin_views").select("*").eq("admin_id", user.id).single();
        const supportLast = views?.support_last_viewed_at || '1970-01-01T00:00:00.000Z';
        const membersLast = views?.members_last_viewed_at || '1970-01-01T00:00:00.000Z';

        const leadsLast = views?.leads_last_viewed_at || '1970-01-01T00:00:00.000Z';

        const [
          { count: supportCount },
          { count: membersCount },
          { count: leadsCount }
        ] = await Promise.all([
          supabase.from("support_tickets").select("*", { count: 'exact', head: true }).gt("created_at", supportLast),
          supabase.from("profiles").select("*", { count: 'exact', head: true }).gt("created_at", membersLast),
          supabase.from("course_leads").select("*", { count: 'exact', head: true }).gt("created_at", leadsLast)
        ]);

        setUnreadSupportCount(supportCount || 0);
        setUnreadMembersCount(membersCount || 0);
        setUnreadLeadsCount(leadsCount || 0);

      } catch (e) {
        console.error(e);
      }
    }

    checkUnreads();
    window.addEventListener("adminViewsUpdated", checkUnreads);
    return () => window.removeEventListener("adminViewsUpdated", checkUnreads);
  }, []);

  const sidebarItems = [
    { id: "overview", label: "Estadísticas", icon: BarChart3 },
    { id: "support", label: "Soporte", icon: MessageSquare, badgeCount: unreadSupportCount },
    { id: "members", label: "Miembros", icon: Users, badgeCount: unreadMembersCount },
    { id: "leads", label: "Contactos", icon: Mail, badgeCount: unreadLeadsCount },
    { id: "prices", label: "Precios y Promos", icon: DollarSign },
    { id: "cart", label: "Carritos", icon: ShoppingCart },
    { id: "courses", label: "Cursos", icon: GraduationCap },
    { id: "schedules", label: "Horarios", icon: Calendar },
    { id: "export_csv", label: "Exportar Datos", icon: Download },
    { id: "import", label: "Importar CSV", icon: Upload },
    { id: "plans", label: "Planes", icon: CreditCard },
    { id: "popups", label: "Pop-ups", icon: Megaphone },
    { id: "newsletter", label: "Newsletter", icon: Newspaper },
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
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative
                   ${activeTab === item.id 
                     ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                     : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200"}
                 `}
               >
                  <Icon className="w-4 h-4" /> {item.label}
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black shadow-sm" style={{ paddingBottom: '0.5px' }}>
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </span>
                  ) : null}
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
              { activeTab === "overview" && <AdminOverview /> }
              { activeTab === "members" && <AdminMembers /> }
              { activeTab === "leads" && <AdminLeads /> }
              { activeTab === "cart" && <AdminAbandonedCarts /> }
              { activeTab === "courses" && <AdminCourses /> }
              { activeTab === "schedules" && <AdminSchedules /> }
              { activeTab === "export_csv" && <AdminExportCsv /> }
              { activeTab === "import" && <AdminImport /> }
              { activeTab === "plans" && <AdminPlans /> }
              { activeTab === "settings" && <AdminSettings /> }
              { activeTab === "support" && <AdminSupport /> }
              { activeTab === "popups" && <AdminPopups /> }
              { activeTab === "prices" && <AdminPrices /> }
              { activeTab === "newsletter" && <AdminNewsletter /> }
            </motion.div>
        </div>
    </div>
  );
}

// ─── SOPORTE ───
function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We fetch tickets using a local supabase client, since admin checks its own view
  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        
        // Mark as viewed
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           await supabase.from("admin_views").upsert({
             admin_id: user.id,
             support_last_viewed_at: new Date().toISOString()
           });
           
           // Evitar recargar la página pero decirle a la UI que ya se vio (el badge)
           window.dispatchEvent(new Event("adminViewsUpdated"));
        }

        const { data } = await supabase
          .from("support_tickets")
          .select("*, profile:profiles(full_name, email)")
          .order("created_at", { ascending: false });
        
        setTickets(data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const markAsResolved = async (id: string, currentStatus: string) => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
      
      await supabase.from("support_tickets").update({
        status: newStatus,
        resolved_at: newStatus === "resolved" ? new Date().toISOString() : null
      }).eq("id", id);
      
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando tickets...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Soporte</h2>
           <p className="text-sm text-gray-400">Tickets de ayuda de la comunidad</p>
         </div>
       </div>

       {tickets.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">Todo en orden</h3>
           <p className="text-gray-400 text-sm">No hay tickets de soporte creados.</p>
         </div>
       ) : (
         <div className="space-y-4">
           {tickets.map(ticket => (
             <div key={ticket.id} className={`p-5 rounded-2xl border ${ticket.status === 'resolved' ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-100 shadow-sm'}`}>
               <div className="flex items-start gap-4">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                       {ticket.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                     </span>
                     <h4 className="font-bold text-gray-900 text-sm">{ticket.subject}</h4>
                   </div>
                   <p className="text-[11px] text-gray-400 font-medium mb-3">
                     De: {ticket.profile?.full_name || 'Desconocido'} ({ticket.profile?.email || 'Sin email'}) • {new Date(ticket.created_at).toLocaleString('es-CL')}
                   </p>
                   <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 whitespace-pre-wrap">
                     {ticket.message}
                   </div>
                 </div>
                 <button
                   onClick={() => markAsResolved(ticket.id, ticket.status)}
                   className={`p-2 rounded-xl transition-colors shrink-0 ${ticket.status === 'resolved' ? 'hover:bg-gray-200 text-gray-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                   title={ticket.status === 'resolved' ? 'Marcar Pendiente' : 'Marcar Resuelto'}
                 >
                   <CheckCircle className="w-5 h-5" />
                 </button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}

// ─── LEADS / CONTACTOS ───
function AdminLeads() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetLeads();
        setAllLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const leads = allLeads.filter(l => l.lead_type !== "abandoned_cart");

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Nombre,Email,WhatsApp,Cursos Interés,Mensaje,Origen,Fecha"];
    const rows = leads.map(l => {
      const date = new Date(l.created_at).toLocaleDateString('es-CL');
      const courses = (l.selected_courses || []).join(" | ");
      return `"${l.name}","${l.email}","${l.whatsapp || ''}","${courses}","${(l.message || '').replace(/"/g, '""')}","${l.source_course || ''}","${date}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `programbi_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando contactos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Contactos (Leads)</h2>
           <p className="text-sm text-gray-400">Solicitudes de información desde los cursos</p>
         </div>
         <button onClick={exportToCSV} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border-none cursor-pointer">
           <Download className="w-4 h-4" /> Exportar a CSV
         </button>
       </div>

       {leads.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay contactos</h3>
           <p className="text-gray-400 text-sm">Aún no hay solicitudes de información.</p>
         </div>
       ) : (
         <div className="overflow-x-auto rounded-xl border border-gray-200">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-[#F8FAFC] border-b border-gray-200">
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Mensaje</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
               {leads.map(lead => (
                 <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-4 py-4">
                     <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                     <div className="text-xs text-brand-blue">{lead.email}</div>
                     {lead.whatsapp && (
                       <a 
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1 hover:underline whitespace-nowrap"
                       >
                         <MessageSquare className="w-3 h-3" /> {lead.whatsapp}
                       </a>
                     )}
                   </td>
                   <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        lead.lead_type === 'enterprise' ? 'bg-indigo-50 text-indigo-600' :
                        lead.lead_type === 'notify' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {lead.lead_type === 'enterprise' ? '🏢 Empresa' : lead.lead_type === 'notify' ? '🔔 Notificar' : '📩 Contacto'}
                      </span>
                    </td>
                   <td className="px-4 py-4">
                     <div className="flex flex-wrap gap-1 max-w-[200px]">
                       {(lead.selected_courses || []).map((c: string, i: number) => (
                         <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-blue border border-blue-100">{c}</span>
                       ))}
                     </div>
                     {lead.source_course && <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Origen: {lead.source_course}</div>}
                   </td>
                   <td className="px-4 py-4 hidden md:table-cell max-w-xs">
                     <div className="text-xs text-gray-600 line-clamp-3">{lead.message || <span className="text-gray-300 italic">Sin mensaje</span>}</div>
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap">
                     <div className="text-xs font-medium text-gray-900">{new Date(lead.created_at).toLocaleDateString('es-CL')}</div>
                     <div className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
    </div>
  );
}

// ─── CARITOS ABANDONADOS ───
function AdminAbandonedCarts() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetLeads();
        setAllLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const carts = allLeads.filter(l => l.lead_type === "abandoned_cart");

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando carritos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Carritos Abandonados</h2>
            <p className="text-sm text-gray-400">Intenciones de compra de usuarios registrados</p>
          </div>
       </div>

       {carts.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay carritos</h3>
           <p className="text-gray-400 text-sm">Aún no se han registrado intenciones de compra.</p>
         </div>
       ) : (
         <div className="overflow-x-auto rounded-xl border border-gray-200">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-[#F8FAFC] border-b border-gray-200">
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Curso</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto Directo</th>
                 <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white">
               {carts.map(lead => (
                 <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-4 py-4">
                     <div className="font-bold text-gray-900 text-sm">{lead.name === "Usuario Logueado" ? "Estudiante Registrado" : lead.name}</div>
                     <div className="text-xs text-brand-blue font-medium">{lead.email}</div>
                   </td>
                   <td className="px-4 py-4">
                     <div className="flex flex-wrap gap-1">
                       {(lead.selected_courses || []).map((c: string, i: number) => (
                         <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">{c}</span>
                       ))}
                     </div>
                   </td>
                   <td className="px-4 py-4">
                     {lead.whatsapp ? (
                       <a 
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-100 float-left transition-colors"
                       >
                         <MessageSquare className="w-3 h-3" /> Chatear
                       </a>
                     ) : (
                       <a 
                        href={`mailto:${lead.email}`} 
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 float-left transition-colors"
                       >
                         <Mail className="w-3 h-3" /> Mail
                       </a>
                     )}
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap">
                     <div className="text-xs font-medium text-gray-900">{new Date(lead.created_at).toLocaleDateString('es-CL')}</div>
                     <div className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
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
        
        // Mark as viewed using a local client
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           await supabase.from("admin_views").upsert({
             admin_id: user.id,
             members_last_viewed_at: new Date().toISOString()
           });
           window.dispatchEvent(new Event("adminViewsUpdated"));
        }
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
                    <th className="px-5 py-3.5">Email</th>
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
                           </div>
                         </div>
                       </td>
                       <td className="px-5 py-4">
                          <div className="text-sm text-gray-600">{u.email}</div>
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

// ─── SCHEDULES ───
function AdminSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    course_slug: '', level_name: 'Básico', start_date: '',
    schedule_days: 'Lunes y Miércoles', schedule_time: '19:30 a 21:30', duration_hours: 16,
  });

  useEffect(() => {
    async function load() {
      try { const data = await adminGetSchedules(); setSchedules(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleAdd = async () => {
    if (!newSchedule.course_slug || !newSchedule.start_date) return;
    try {
      await adminAddSchedule(newSchedule);
      const data = await adminGetSchedules();
      setSchedules(data);
      setShowAdd(false);
      setNewSchedule({ course_slug: '', level_name: 'Básico', start_date: '', schedule_days: 'Lunes y Miércoles', schedule_time: '19:30 a 21:30', duration_hours: 16 });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try { await adminDeleteSchedule(id); setSchedules(prev => prev.filter(s => s.id !== id)); }
    catch (err) { console.error(err); }
  };

  const handleToggle = async (id: string) => {
    try { await adminToggleScheduleActive(id); setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)); }
    catch (err) { console.error(err); }
  };

  const courseOptions = [
    { slug: 'power-bi', name: 'Power BI' },
    { slug: 'python', name: 'Python' },
    { slug: 'sql-server', name: 'SQL Server' },
    { slug: 'excel', name: 'Excel' },
    { slug: 'analisis-de-datos', name: 'Análisis de Datos' },
    { slug: 'machine-learning', name: 'Machine Learning' },
    { slug: 'ia-productividad', name: 'IA en Productividad' },
    { slug: 'power-automate', name: 'Power Automate' },
  ];

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Horarios de Cursos</h2>
           <p className="text-sm text-gray-400">Gestiona fechas y horarios de inicio de cada curso</p>
         </div>
         <button onClick={() => setShowAdd(!showAdd)}
           className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm border-none cursor-pointer">
           <Plus className="w-4 h-4" /> Agregar Horario
         </button>
       </div>

       {/* Add form */}
       <AnimatePresence>
         {showAdd && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
             <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 space-y-4">
               <h3 className="font-bold text-sm text-gray-900">Nuevo Horario</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <select value={newSchedule.course_slug} onChange={e => setNewSchedule(p => ({ ...p, course_slug: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   <option value="">Seleccionar curso...</option>
                   {courseOptions.map(c => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
                 </select>
                 <select value={newSchedule.level_name} onChange={e => setNewSchedule(p => ({ ...p, level_name: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   <option value="Básico">Básico</option>
                   <option value="Intermedio">Intermedio</option>
                   <option value="Avanzado">Avanzado</option>
                 </select>
                 <input type="date" value={newSchedule.start_date} onChange={e => setNewSchedule(p => ({ ...p, start_date: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                 <select value={newSchedule.schedule_days} onChange={e => setNewSchedule(p => ({ ...p, schedule_days: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none">
                   <option value="Lunes y Miércoles">Lunes y Miércoles</option>
                   <option value="Martes y Jueves">Martes y Jueves</option>
                   <option value="Sábados">Sábados</option>
                 </select>
                 <input type="text" placeholder="Horario (ej: 19:30 a 21:30)" value={newSchedule.schedule_time}
                   onChange={e => setNewSchedule(p => ({ ...p, schedule_time: e.target.value }))}
                   className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                 <div className="flex items-center gap-2">
                   <label className="text-xs font-semibold text-gray-500">Duración (hrs)</label>
                   <input type="number" min={1} value={newSchedule.duration_hours} onChange={e => setNewSchedule(p => ({ ...p, duration_hours: parseInt(e.target.value) || 16 }))}
                     className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none" />
                 </div>
               </div>
               <div className="flex justify-end gap-2">
                 <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors border-none cursor-pointer bg-transparent">Cancelar</button>
                 <button onClick={handleAdd} disabled={!newSchedule.course_slug || !newSchedule.start_date}
                   className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40 border-none cursor-pointer">
                   Guardar Horario
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {loading ? (
         <div className="py-20 flex flex-col items-center gap-3">
           <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
           <span className="text-sm text-gray-400">Cargando horarios...</span>
         </div>
       ) : schedules.length === 0 ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
           <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-gray-900 font-bold mb-1">No hay horarios</h3>
           <p className="text-gray-400 text-sm">Agrega el primer horario de curso.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {schedules.map(sched => (
             <motion.div key={sched.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
               className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${sched.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
               <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                 <Calendar className="w-6 h-6 text-brand-blue" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-gray-900 text-sm capitalize">{sched.course_slug.replace(/-/g, ' ')}</span>
                   <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{sched.level_name}</span>
                   {!sched.is_active && <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Inactivo</span>}
                 </div>
                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                   <span>📅 {new Date(sched.start_date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span>📆 {sched.schedule_days} · {sched.schedule_time}</span>
                   <span>⏱ {sched.duration_hours}h</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                 <button onClick={() => handleToggle(sched.id)}
                   className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-colors border-none cursor-pointer ${sched.is_active ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                   {sched.is_active ? 'Desactivar' : 'Activar'}
                 </button>
                 <button onClick={() => handleDelete(sched.id)}
                   className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer bg-transparent">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       )}
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

// ─── PROMO POPUPS ───
const POPUP_TYPES = [
  { value: "promo", label: "Promoción", icon: Sparkles, color: "#1890FF" },
  { value: "course", label: "Curso Nuevo", icon: GraduationCap, color: "#10B981" },
  { value: "discount", label: "Descuento", icon: Percent, color: "#F59E0B" },
  { value: "announcement", label: "Anuncio", icon: Megaphone, color: "#7C3AED" },
];

const TARGETS = [
  { value: "all", label: "Todos" },
  { value: "guests", label: "Solo Visitantes" },
  { value: "members", label: "Solo Miembros" },
];

function AdminPopups() {
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [editingPopupId, setEditingPopupId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    cta_text: "Ver más",
    cta_url: "/",
    badge_text: "",
    popup_type: "promo",
    accent_color: "#1890FF",
    image_url: "",
    starts_at: "",
    ends_at: "",
    show_to: "all",
    display_delay_seconds: 3,
    dismissible: true,
    show_once_per_session: true,
    custom_html: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetPopups();
        setPopups(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: "", description: "", cta_text: "Ver más", cta_url: "/", badge_text: "",
      popup_type: "promo", accent_color: "#1890FF", image_url: "",
      starts_at: "", ends_at: "", show_to: "all",
      display_delay_seconds: 3, dismissible: true, show_once_per_session: true,
      custom_html: "",
    });
    setEditorMode("visual");
    setEditingPopupId(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        badge_text: form.badge_text || null,
        image_url: form.image_url || null,
        custom_html: form.custom_html || null,
      };
      
      if (editingPopupId) {
        await adminUpdatePopup(editingPopupId, payload);
      } else {
        await adminCreatePopup(payload);
      }
      
      const data = await adminGetPopups();
      setPopups(data);
      resetForm();
      setShowCreate(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleEdit = (popup: any) => {
    setForm({
      title: popup.title || "",
      description: popup.description || "",
      cta_text: popup.cta_text || "Ver más",
      cta_url: popup.cta_url || "/",
      badge_text: popup.badge_text || "",
      popup_type: popup.popup_type || "promo",
      accent_color: popup.accent_color || "#1890FF",
      image_url: popup.image_url || "",
      starts_at: popup.starts_at ? new Date(popup.starts_at).toISOString().slice(0, 16) : "",
      ends_at: popup.ends_at ? new Date(popup.ends_at).toISOString().slice(0, 16) : "",
      show_to: popup.show_to || "all",
      display_delay_seconds: popup.display_delay_seconds || 0,
      dismissible: popup.dismissible ?? true,
      show_once_per_session: popup.show_once_per_session ?? true,
      custom_html: popup.custom_html || "",
    });
    setEditingPopupId(popup.id);
    setEditorMode(popup.custom_html ? "code" : "visual");
    setShowCreate(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id: string) => {
    try {
      await adminTogglePopup(id);
      setPopups(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeletePopup(id);
      setPopups(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const selectedType = POPUP_TYPES.find(t => t.value === form.popup_type) || POPUP_TYPES[0];

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando pop-ups...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Pop-ups Promocionales</h2>
           <p className="text-sm text-gray-400">Configura pop-ups que aparecen en la esquina inferior de tu sitio web</p>
         </div>
         <button 
           onClick={() => setShowCreate(!showCreate)}
           className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
         >
           <Plus className="w-4 h-4" /> Crear Pop-up
         </button>
       </div>

       {/* Create Form */}
       <AnimatePresence>
         {showCreate && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
             <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-6 sm:p-8">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-brand-blue" /> {editingPopupId ? 'Editar Pop-up' : 'Nuevo Pop-up'}
                  </h3>
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setEditorMode("visual")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        editorMode === "visual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      onClick={() => setEditorMode("code")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        editorMode === "code" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Code className="w-3 h-3" /> HTML
                    </button>
                  </div>
                </div>

                {editorMode === "code" ? (
                  <div className="space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-800">💡 Usa HTML y CSS inline para crear tu popup personalizado. Tu código se renderizará directamente dentro del modal con fondo oscuro.</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título (para identificar en la lista) *</label>
                      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Ej: Promo SQL Server - Diseño Custom"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Código HTML</label>
                      <textarea
                        value={form.custom_html}
                        onChange={e => setForm(f => ({ ...f, custom_html: e.target.value }))}
                        placeholder={'<div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 24px; padding: 40px; color: white; text-align: center;">\n  <h2 style="font-size: 28px; font-weight: 900;">Tu Popup Aquí</h2>\n  <a href="/cursos/sql-server" style="display: inline-block; margin-top: 20px; padding: 14px 32px; background: #f59e0b; color: white; border-radius: 12px; font-weight: 700; text-decoration: none;">Ver Curso →</a>\n</div>'}
                        rows={16}
                        className="w-full px-4 py-3 bg-[#0f172a] text-green-400 rounded-xl border border-gray-700 text-sm font-mono focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none resize-y leading-relaxed"
                        spellCheck={false}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mostrar A</label>
                        <select value={form.show_to} onChange={e => setForm(f => ({ ...f, show_to: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none">
                          {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delay (seg)</label>
                        <input type="number" min={0} value={form.display_delay_seconds} onChange={e => setForm(f => ({ ...f, display_delay_seconds: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-center focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color</label>
                        <input type="color" value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                          className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.dismissible} onChange={e => setForm(f => ({ ...f, dismissible: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="text-xs font-semibold text-gray-700">Se puede cerrar</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.show_once_per_session} onChange={e => setForm(f => ({ ...f, show_once_per_session: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="text-xs font-semibold text-gray-700">Solo 1 vez por sesión</span>
                      </label>
                    </div>

                    {form.custom_html && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Vista Previa</label>
                        <div className="bg-black/80 rounded-2xl p-8 flex items-center justify-center min-h-[200px] overflow-hidden">
                          <div className="max-w-lg w-full" dangerouslySetInnerHTML={{ __html: form.custom_html }} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Form Fields */}
                  <div className="space-y-5">
                    {/* Type Selector */}
                    <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo</label>
                     <div className="grid grid-cols-2 gap-2">
                       {POPUP_TYPES.map(type => {
                         const Icon = type.icon;
                         return (
                           <button
                             key={type.value}
                             onClick={() => setForm(f => ({ ...f, popup_type: type.value, accent_color: type.color }))}
                             className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                               form.popup_type === type.value
                                 ? "border-brand-blue bg-blue-50 text-brand-blue shadow-sm"
                                 : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                             }`}
                           >
                             <Icon className="w-3.5 h-3.5" /> {type.label}
                           </button>
                         );
                       })}
                     </div>
                   </div>

                   {/* Title & Description */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título *</label>
                     <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                       placeholder="Ej: ¡50% de descuento en Power BI!"
                       className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción</label>
                     <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                       placeholder="Un breve texto motivador..."
                       rows={2}
                       className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none resize-none" />
                   </div>

                   {/* Badge */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Etiqueta / Badge</label>
                     <input type="text" value={form.badge_text} onChange={e => setForm(f => ({ ...f, badge_text: e.target.value }))}
                       placeholder="Ej: 🔥 OFERTA LIMITADA"
                       className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>

                   {/* CTA */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Texto del Botón</label>
                       <input type="text" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                         className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">URL Destino</label>
                       <input type="text" value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))}
                         placeholder="/cursos/power-bi"
                         className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Image URL */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">URL de Imagen (Opcional)</label>
                     <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                       placeholder="https://..."
                       className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                   </div>

                   {/* Color */}
                   <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color de Acento</label>
                     <div className="flex items-center gap-3">
                       <input type="color" value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                         className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                       <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{form.accent_color}</span>
                     </div>
                   </div>

                   {/* Scheduling */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Inicio (Opcional)</label>
                       <input type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fin (Opcional)</label>
                       <input type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Target & Delay */}
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mostrar A</label>
                       <select value={form.show_to} onChange={e => setForm(f => ({ ...f, show_to: e.target.value }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none">
                         {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delay (seg)</label>
                       <input type="number" min={0} value={form.display_delay_seconds} onChange={e => setForm(f => ({ ...f, display_delay_seconds: parseInt(e.target.value) || 0 }))}
                         className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-center focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                     </div>
                   </div>

                   {/* Toggles */}
                   <div className="flex items-center gap-6 pt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={form.dismissible} onChange={e => setForm(f => ({ ...f, dismissible: e.target.checked }))}
                         className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                       <span className="text-xs font-semibold text-gray-700">Se puede cerrar</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={form.show_once_per_session} onChange={e => setForm(f => ({ ...f, show_once_per_session: e.target.checked }))}
                         className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                       <span className="text-xs font-semibold text-gray-700">Solo 1 vez por sesión</span>
                     </label>
                   </div>
                 </div>

                 {/* Right: Live Preview */}
                 <div>
                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Vista Previa en Vivo</label>
                   <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 flex items-end justify-end min-h-[300px] relative overflow-hidden">
                     <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     
                     {/* Mini preview of the popup */}
                     <div 
                       className="w-[300px] bg-white rounded-[1.2rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] relative z-10"
                       style={{ borderLeft: `3px solid ${form.accent_color}` }}
                     >
                       <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${form.accent_color}, ${form.accent_color}AA)` }}></div>
                       <div className="p-4">
                         <div className="flex gap-3">
                           <div 
                             className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md -rotate-3"
                             style={{ background: `linear-gradient(135deg, ${form.accent_color}, ${form.accent_color}CC)` }}
                           >
                             <selectedType.icon className="w-5 h-5 text-white" />
                           </div>
                           <div className="flex-1 min-w-0">
                             {form.badge_text && (
                               <span 
                                 className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                                 style={{ backgroundColor: form.accent_color + "15", color: form.accent_color }}
                               >
                                 <Bell className="w-2 h-2" /> {form.badge_text}
                               </span>
                             )}
                             <h4 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-1 line-clamp-2">
                               {form.title || "Título del Pop-up"}
                             </h4>
                             {form.description && (
                               <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-2.5 line-clamp-2">{form.description}</p>
                             )}
                             <span
                               className="inline-flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-lg"
                               style={{ backgroundColor: form.accent_color + "10", color: form.accent_color }}
                             >
                               {form.cta_text || "Ver más"} <ArrowRight className="w-3 h-3" />
                             </span>
                           </div>
                         </div>
                         {form.image_url && (
                           <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 -mx-0.5">
                             <img src={form.image_url} alt="" className="w-full h-20 object-cover" />
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
                )}

               {/* Actions */}
               <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                 <button onClick={() => { resetForm(); setShowCreate(false); }}
                   className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">Cancelar</button>
                 <button onClick={handleSave} disabled={saving || !form.title.trim()}
                   className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-sm">
                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                   {saving ? "Guardando..." : (editingPopupId ? "Guardar Cambios" : "Crear Pop-up")}
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Popups List */}
       {popups.length === 0 ? (
         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
           <Megaphone className="w-14 h-14 text-gray-300 mx-auto mb-4" />
           <h3 className="text-gray-900 font-bold mb-2 text-lg">No hay pop-ups configurados</h3>
           <p className="text-gray-400 text-sm max-w-sm mx-auto">Crea tu primer pop-up promocional para atraer a tus visitantes con ofertas, descuentos o anuncios de nuevos cursos.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {popups.map((popup, i) => {
             const pType = POPUP_TYPES.find(t => t.value === popup.popup_type) || POPUP_TYPES[0];
             const PIcon = pType.icon;
             return (
               <motion.div key={popup.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                 className={`relative rounded-2xl border overflow-hidden group ${popup.is_active ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}
               >
                 {/* Color accent bar at top */}
                 <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${popup.accent_color || '#1890FF'}, ${popup.accent_color || '#1890FF'}88)` }}></div>
                 
                 <div className="p-5">
                   <div className="flex items-start gap-4">
                     <div 
                       className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md shrink-0"
                       style={{ background: `linear-gradient(135deg, ${popup.accent_color || '#1890FF'}, ${popup.accent_color || '#1890FF'}CC)` }}
                     >
                       <PIcon className="w-5 h-5 text-white" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <h4 className="text-sm font-bold text-gray-900 truncate">{popup.title}</h4>
                         <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${popup.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                           {popup.is_active ? 'Activo' : 'Inactivo'}
                         </span>
                       </div>
                       {popup.description && (
                         <p className="text-xs text-gray-500 line-clamp-1 mb-2">{popup.description}</p>
                       )}
                       <div className="flex flex-wrap items-center gap-2">
                         {popup.badge_text && (
                           <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{popup.badge_text}</span>
                         )}
                         <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                           {TARGETS.find(t => t.value === popup.show_to)?.label || 'Todos'}
                         </span>
                         <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                           {popup.display_delay_seconds}s delay
                         </span>
                       </div>
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                     <button onClick={() => handleToggle(popup.id)}
                       className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                         popup.is_active ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                       }`}>
                       {popup.is_active ? 'Desactivar' : 'Activar'}
                     </button>
                     <button onClick={() => handleEdit(popup)}
                       className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer" title="Editar">
                       <Edit3 className="w-3.5 h-3.5" />
                     </button>
                     <button onClick={() => handleDelete(popup.id)}
                       className="py-1.5 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer" title="Eliminar">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 </div>
               </motion.div>
             );
           })}
         </div>
       )}
    </div>
  );
}

// ─── PRICES & PROMOTIONS ───
function AdminPrices() {
  const [promos, setPromos] = useState<any[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"prices" | "promos">("prices");

  // Promo form
  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<"courses" | "plans" | "all" | "specific_course" | "specific_plan">("courses");
  const [targetId, setTargetId] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  // Price editing
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [promosData, overridesData] = await Promise.all([
        adminGetPromotions(),
        adminGetPriceOverrides()
      ]);
      setPromos(promosData);
      setPriceOverrides(overridesData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const getOverriddenPrice = (itemType: string, itemId: string, levelName: string, basePrice: number) => {
    const override = priceOverrides.find((o: any) => o.item_type === itemType && o.item_id === itemId && o.level_name === levelName);
    return override ? override.price : basePrice;
  };

  const handleSavePrice = async (itemType: string, itemId: string, levelName: string) => {
    setSavingPrice(true);
    try {
      await adminUpsertPriceOverride({
        item_type: itemType,
        item_id: itemId,
        level_name: levelName,
        price: editPriceValue,
      });
      setEditingPrice(null);
      loadData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingPrice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorObj(null);
    try {
      await adminCreatePromotion({
        name,
        target_type: targetType,
        target_id: targetId,
        discount_percentage: discountPercent,
        is_active: true
      });
      setShowAdd(false);
      setName("");
      setTargetId("");
      setDiscountPercent(20);
      setViewMode("promos");
      loadData();
    } catch (err: any) {
      setErrorObj(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await adminTogglePromotion(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    try {
      await adminDeletePromotion(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const startPromo = (type: "specific_course" | "specific_plan", id: string) => {
    setTargetType(type);
    setTargetId(id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditPrice = (key: string, currentPrice: number) => {
    setEditingPrice(key);
    setEditPriceValue(currentPrice);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>;

  return (
    <div className="p-6 sm:p-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
           <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Precios y Promociones</h2>
           <p className="text-sm text-gray-400">Control maestro de precios y ofertas dinámicas</p>
         </div>
         <div className="flex bg-gray-100 p-1 rounded-xl self-start">
            <button onClick={() => setViewMode("prices")} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${viewMode === "prices" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"} border-none cursor-pointer`}>
              Precios Base
            </button>
            <button onClick={() => setViewMode("promos")} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${viewMode === "promos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"} border-none cursor-pointer flex items-center gap-2`}>
              Promos Activas
              {promos.filter(p => p.is_active).length > 0 && (
                <span className="bg-brand-blue text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{promos.filter(p => p.is_active).length}</span>
              )}
            </button>
         </div>
       </div>

       <AnimatePresence>
         {showAdd && (
           <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
             onSubmit={handleSubmit} className="mb-8 bg-gray-50 border border-gray-200 p-6 rounded-2xl overflow-hidden">
             
             {errorObj && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium">{errorObj}</div>}
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre (Ej: Black Friday)</label>
                 <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descuento (%)</label>
                 <input type="number" min="1" max="100" required value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Aplica a</label>
                 <select value={targetType} onChange={e => setTargetType(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none cursor-pointer">
                   <option value="courses">Todos los Cursos</option>
                   <option value="plans">Todas las Membresías</option>
                   <option value="all">Toda la Tienda (Cursos y Planes)</option>
                   <option value="specific_course">Curso Específico (Slug)</option>
                   <option value="specific_plan">Plan Específico (ID)</option>
                 </select>
               </div>
               {(targetType === 'specific_course' || targetType === 'specific_plan') && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID del Objetivo</label>
                   <input type="text" required value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none" />
                 </motion.div>
               )}
             </div>

             <div className="flex justify-end gap-3">
               <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors border-none cursor-pointer">Cancelar</button>
               <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-50 border-none cursor-pointer">
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                 Publicar Promoción
               </button>
             </div>
           </motion.form>
         )}
       </AnimatePresence>

       {viewMode === "prices" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-blue"><Percent className="w-5 h-5"/></div>
                 <div>
                   <h3 className="font-bold text-blue-900 text-sm">Descuento Global</h3>
                   <p className="text-xs text-blue-700">Aplica a todos los cursos y membresías</p>
                 </div>
              </div>
              <button onClick={() => { setTargetType("all"); setShowAdd(true); window.scrollTo(0,0); }} className="text-[11px] font-bold px-3 py-1.5 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5"><Plus className="w-3.5 h-3.5"/> Promoción Global</button>
            </div>

            {/* Courses Table */}
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-gray-400"/> Cursos</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr><th className="px-5 py-3">Curso</th><th className="px-5 py-3">Nivel</th><th className="px-5 py-3">Precio Actual</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allCourses.map(course => (
                      course.levels?.map((lvl, i) => {
                        const editKey = `course-${course.slug}-${lvl.name}`;
                        const currentPrice = getOverriddenPrice('course', course.slug, lvl.name, lvl.price || 0);
                        return (
                          <tr key={editKey} className="hover:bg-gray-50 transition-colors">
                            {i === 0 && (
                              <td className="px-5 py-3 align-top" rowSpan={course.levels!.length}>
                                <div className="font-bold text-gray-900 text-xs">{course.title}</div>
                                <div className="text-[10px] text-gray-400">{course.slug}</div>
                              </td>
                            )}
                            <td className="px-5 py-3 text-xs font-medium text-gray-600">{lvl.name}</td>
                            <td className="px-5 py-3">
                              {editingPrice === editKey ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">$</span>
                                  <input type="number" value={editPriceValue} onChange={e => setEditPriceValue(Number(e.target.value))} className="w-28 border border-blue-300 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none" autoFocus />
                                  <button disabled={savingPrice} onClick={() => handleSavePrice('course', course.slug, lvl.name)} className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 cursor-pointer border-none">
                                    {savingPrice ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                  </button>
                                  <button onClick={() => setEditingPrice(null)} className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 cursor-pointer border-none"><X className="w-3 h-3" /></button>
                                </div>
                              ) : (
                                <button onClick={() => startEditPrice(editKey, currentPrice)} className="font-bold text-gray-800 text-sm hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none p-0">
                                  ${currentPrice.toLocaleString('es-CL')}
                                </button>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button onClick={() => startPromo("specific_course", course.slug)} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer">Descuento</button>
                            </td>
                          </tr>
                        );
                      })
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Memberships Table */}
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400"/> Membresías</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Mensual</th><th className="px-5 py-3">Anual</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {communityPlans.map(plan => (
                      <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-bold text-gray-900 text-xs">{plan.name}</div>
                          <div className="text-[10px] text-gray-400">ID: {plan.id}</div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">${plan.price.toLocaleString('es-CL')}</td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">${(plan.priceAnnual || plan.price * 12 * 0.7).toLocaleString('es-CL')}</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => startPromo("specific_plan", plan.id)} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer">Descuento</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </motion.div>
       ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {promos.length === 0 ? (
               <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                 <Percent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <h3 className="text-lg font-black text-gray-900 mb-1">Sin Promociones Activas</h3>
                 <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">No has configurado ningún descuento dinámico. Para agregar uno, ve a la pestaña "Precios Base" o crea uno manualmente.</p>
                 <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"><Plus className="w-4 h-4"/> Nueva Promoción</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {promos.map(promo => (
                   <div key={promo.id} className={`relative bg-white rounded-2xl border ${promo.is_active ? 'border-brand-blue ring-1 ring-brand-blue/20 shadow-md' : 'border-gray-200 shadow-sm opacity-70'} overflow-hidden flex flex-col`}>
                     {promo.is_active && (
                       <div className="absolute top-0 right-0 py-1 px-3 bg-brand-blue text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">Activa</div>
                     )}
                     <div className="p-5 flex-1">
                       <div className="flex items-start gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${promo.is_active ? 'bg-blue-50 text-brand-blue' : 'bg-gray-100 text-gray-400'}`}>
                           <Percent className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="font-bold text-gray-900 leading-tight">{promo.name}</h3>
                           <p className="text-xs text-gray-500 mt-1">Regla: {
                             promo.target_type === 'courses' ? 'Cursos' :
                             promo.target_type === 'plans' ? 'Membresías' :
                             promo.target_type === 'all' ? 'Toda la Tienda' :
                             promo.target_type === 'specific_course' ? `Curso: ${promo.target_id}` :
                             `Plan: ${promo.target_id}`
                           }</p>
                         </div>
                       </div>
                       <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">Rebaja del:</span>
                          <span className="font-black text-xl text-emerald-600">{promo.discount_percentage}%</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 mt-auto p-4 border-t border-gray-50 bg-gray-50/50">
                       <button onClick={() => handleToggle(promo.id)}
                         className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border-none ${
                           promo.is_active ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                         }`}>
                         {promo.is_active ? 'Pausar' : 'Reactivar'}
                       </button>
                       <button onClick={() => handleDelete(promo.id)}
                         className="py-2 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </motion.div>
       )}
    </div>
  );
}

// ─── NEWSLETTER ───

function AdminNewsletter() {
  const [subTab, setSubTab] = useState<"articles" | "categories">("articles");

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-display font-black text-2xl text-gray-900">Newsletter</h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {[
          { id: "articles" as const, label: "📰 Artículos" },
          { id: "categories" as const, label: "📂 Categorías / Secciones" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-bold border-none cursor-pointer transition-all bg-transparent border-b-2 -mb-[1px] ${
              subTab === tab.id ? "border-b-brand-blue text-brand-blue" : "border-b-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === "articles" && <AdminNewsletterArticles />}
      {subTab === "categories" && <AdminNewsletterCategories />}
    </div>
  );
}

// ─── NEWSLETTER: ARTICLES TAB ───

function AdminNewsletterArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formBlocks, setFormBlocks] = useState<any[]>([]);
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formTags, setFormTags] = useState("");
  const [formAuthor, setFormAuthor] = useState("ProgramBI");
  const [formReadingTime, setFormReadingTime] = useState(5);
  const [formStatus, setFormStatus] = useState("draft");
  const [formFeatured, setFormFeatured] = useState(false);
  const [saving, setSaving] = useState(false);


  const loadArticles = useCallback(async () => {
    try {
      const [arts, cats] = await Promise.all([adminGetArticles(), adminGetNewsletterCategories()]);
      setArticles(arts);
      setCategories(cats.filter((c: any) => !c.parent_id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const resetForm = () => {
    setFormTitle(""); setFormSlug(""); setFormExcerpt(""); setFormContent("");
    setFormBlocks([]);
    setFormCoverImage(""); setFormCategory("general"); setFormTags("");
    setFormAuthor("ProgramBI"); setFormReadingTime(5); setFormStatus("draft");
    setFormFeatured(false); setEditingArticle(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (article: any) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormSlug(article.slug);
    setFormExcerpt(article.excerpt || "");
    setFormContent(article.content || "");
    // Try to parse blocks from content
    try {
      const parsed = JSON.parse(article.content || "[]");
      if (Array.isArray(parsed)) setFormBlocks(parsed);
      else setFormBlocks([{ type: "paragraph", text: article.content || "" }]);
    } catch {
      setFormBlocks([{ type: "paragraph", text: article.content || "" }]);
    }
    setFormCoverImage(article.cover_image || "");
    setFormCategory(article.category || "general");
    setFormTags((article.tags || []).join(", "));
    setFormAuthor(article.author_name || "ProgramBI");
    setFormReadingTime(article.reading_time_min || 5);
    setFormStatus(article.status);
    setFormFeatured(article.is_featured || false);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formTitle || formBlocks.length === 0) return;
    setSaving(true);
    try {
      const slug = formSlug || generateSlug(formTitle);
      const tags = formTags.split(",").map(t => t.trim()).filter(Boolean);

      const payload = {
        title: formTitle,
        slug,
        excerpt: formExcerpt,
        content: JSON.stringify(formBlocks),
        cover_image: formCoverImage || undefined,
        category: formCategory,
        tags,
        author_name: formAuthor,
        reading_time_min: formReadingTime,
        status: formStatus,
        is_featured: formFeatured,
      };

      if (editingArticle) {
        await adminUpdateArticle(editingArticle.id, payload);
      } else {
        await adminCreateArticle(payload);
      }

      setShowForm(false);
      resetForm();
      await loadArticles();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    try {
      await adminDeleteArticle(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await adminToggleArticlePublish(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await adminToggleArticleFeatured(id);
      await loadArticles();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando artículos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Newsletter</h2>
          <p className="text-sm text-gray-400">{articles.length} artículos · Gestiona tu blog</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors border-none cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">{editingArticle ? "Editar Artículo" : "Nuevo Artículo"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Título *</label>
                  <input
                    type="text" value={formTitle}
                    onChange={(e) => { setFormTitle(e.target.value); if (!editingArticle) setFormSlug(generateSlug(e.target.value)); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="Título del artículo"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Slug (URL)</label>
                  <input
                    type="text" value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="titulo-del-articulo"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Extracto</label>
                <textarea
                  value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40 resize-none"
                  placeholder="Breve resumen del artículo..."
                />
              </div>

              <ArticleBlockEditor
                blocks={formBlocks}
                onChange={(blocks) => setFormBlocks(blocks)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Imagen de Portada (URL)</label>
                  <input
                    type="text" value={formCoverImage} onChange={(e) => setFormCoverImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Categoría</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Autor</label>
                  <input
                    type="text" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Lectura (min)</label>
                  <input
                    type="number" value={formReadingTime} onChange={(e) => setFormReadingTime(parseInt(e.target.value) || 5)}
                    min={1}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tags (separados por coma)</label>
                  <input
                    type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="power-bi, dashboard, tips"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Estado</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-sm font-bold text-gray-700">⭐ Artículo Destacado</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!formTitle || formBlocks.length === 0 || saving}
                  className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors border-none cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {editingArticle ? "Guardar Cambios" : "Crear Artículo"}
                </button>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-300 transition-colors border-none cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles Table */}
      {articles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold mb-1">Sin artículos</h3>
          <p className="text-gray-400 text-sm">Crea tu primer artículo para el newsletter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                article.status === "published" ? "bg-white border-gray-100" : "bg-gray-50/50 border-gray-100"
              }`}
            >
              {/* Cover thumb */}
              {article.cover_image ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={article.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    article.status === "published" ? "bg-emerald-100 text-emerald-700" :
                    article.status === "archived" ? "bg-gray-200 text-gray-500" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {article.status === "published" ? "Publicado" : article.status === "archived" ? "Archivado" : "Borrador"}
                  </span>
                  {article.is_featured && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">⭐ Destacado</span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                    {categories.find(c => c.slug === article.category)?.name || article.category}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 truncate">{article.title}</h4>
                <p className="text-[11px] text-gray-400 truncate">
                  {article.author_name} · {article.reading_time_min} min · {new Date(article.created_at).toLocaleDateString('es-CL')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleToggleFeatured(article.id)} title="Destacar" className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${article.is_featured ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-300'}`}>
                  <Star className="w-4 h-4" />
                </button>
                <button onClick={() => handleTogglePublish(article.id)} title={article.status === 'published' ? 'Despublicar' : 'Publicar'}
                  className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${article.status === 'published' ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' : 'hover:bg-gray-100 text-gray-400'}`}>
                  {article.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <a href={`/newsletter/${article.slug}`} target="_blank" rel="noreferrer" title="Ver" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => openEditForm(article)} title="Editar" className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(article.id)} title="Eliminar" className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEWSLETTER: CATEGORIES TAB ───

function AdminNewsletterCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  // Form
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catEmoji, setCatEmoji] = useState("📄");
  const [catOrder, setCatOrder] = useState(0);
  const [catParent, setCatParent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await adminGetNewsletterCategories();
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };

  const resetForm = () => {
    setCatName(""); setCatSlug(""); setCatEmoji("📄"); setCatOrder(0); setCatParent(null); setEditingCat(null);
  };

  const openEdit = (cat: any) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatEmoji(cat.emoji || "📄");
    setCatOrder(cat.sort_order || 0);
    setCatParent(cat.parent_id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!catName) return;
    setSaving(true);
    try {
      const slug = catSlug || generateSlug(catName);
      const payload = {
        name: catName,
        slug,
        emoji: catEmoji,
        sort_order: catOrder,
        parent_id: catParent || null,
      };

      if (editingCat) {
        await adminUpdateNewsletterCategory(editingCat.id, payload);
      } else {
        await adminCreateNewsletterCategory(payload);
      }

      setShowForm(false);
      resetForm();
      await loadCategories();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await adminDeleteNewsletterCategory(id);
      await loadCategories();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const handleToggle = async (id: string) => {
    try {
      await adminToggleNewsletterCategory(id);
      await loadCategories();
    } catch (err: any) { alert("Error: " + err.message); }
  };

  // Separate parents and children
  const parents = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 mt-3">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">{categories.length} categorías · Estas aparecen en la barra de navegación del Newsletter</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors border-none cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900 text-sm">{editingCat ? "Editar Categoría" : "Nueva Categoría"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nombre *</label>
                  <input
                    type="text" value={catName}
                    onChange={(e) => { setCatName(e.target.value); if (!editingCat) setCatSlug(generateSlug(e.target.value)); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="Power BI"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Slug</label>
                  <input
                    type="text" value={catSlug} onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="power-bi"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Emoji</label>
                  <input
                    type="text" value={catEmoji} onChange={(e) => setCatEmoji(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                    placeholder="📊"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Orden</label>
                  <input
                    type="number" value={catOrder} onChange={(e) => setCatOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand-blue/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Padre (subcategoría)</label>
                  <select value={catParent || ""} onChange={(e) => setCatParent(e.target.value || null)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                    <option value="">— Ninguno (principal) —</option>
                    {parents.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!catName || saving}
                  className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors border-none cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {editingCat ? "Guardar" : "Crear"}
                </button>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-5 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-300 transition-colors border-none cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories list */}
      {categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
          <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold mb-1 text-sm">Sin categorías</h3>
          <p className="text-gray-400 text-xs">Crea categorías para organizar tu newsletter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {parents.map(cat => (
            <div key={cat.id}>
              {/* Parent category */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                  cat.is_active ? "bg-white border-gray-100" : "bg-gray-50/50 border-gray-100 opacity-60"
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">/{cat.slug}</span>
                    {!cat.is_active && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-500 uppercase">Oculta</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">Orden: {cat.sort_order}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(cat.id)} title={cat.is_active ? "Ocultar" : "Mostrar"}
                    className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${cat.is_active ? 'bg-emerald-50 text-emerald-500' : 'hover:bg-gray-100 text-gray-400'}`}>
                    {cat.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(cat)} title="Editar"
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} title="Eliminar"
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Subcategories */}
              {getChildren(cat.id).length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {getChildren(cat.id).map(sub => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:shadow-sm ${
                        sub.is_active ? "bg-white border-gray-50" : "bg-gray-50/50 border-gray-50 opacity-60"
                      }`}
                    >
                      <span className="text-sm">{sub.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-gray-700">{sub.name}</span>
                          <span className="text-[9px] text-gray-400 font-mono">/{sub.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggle(sub.id)} className={`p-1.5 rounded-lg transition-colors border-none cursor-pointer ${sub.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {sub.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => openEdit(sub)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue transition-colors border-none cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-colors border-none cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          💡 <strong>Tip:</strong> Las categorías principales aparecen en la barra de navegación del Newsletter. 
          Las subcategorías sirven para organizar el contenido dentro de una categoría principal.
          Cambia el <strong>orden</strong> para controlar su posición en la barra. Usa el botón del ojo para <strong>ocultar/mostrar</strong> categorías sin eliminarlas.
        </p>
      </div>
    </div>
  );
}
