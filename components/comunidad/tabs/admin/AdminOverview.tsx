"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { adminGetDashboardStats } from "@/lib/supabase/comunidad-ai";

export default function AdminOverview() {
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
