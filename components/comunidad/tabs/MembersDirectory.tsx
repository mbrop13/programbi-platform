"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users, Crown, Shield, Star, Loader2, Filter, ChevronDown } from "lucide-react";
import { getCommunityMembers } from "@/lib/supabase/comunidad";

const LEVELS = [
  { name: "Novato", min: 0, max: 500, badge: "bg-gray-100 text-gray-600" },
  { name: "Aprendiz", min: 500, max: 1500, badge: "bg-blue-100 text-blue-600" },
  { name: "Intermedio", min: 1500, max: 3500, badge: "bg-emerald-100 text-emerald-600" },
  { name: "Avanzado", min: 3500, max: 7000, badge: "bg-purple-100 text-purple-600" },
  { name: "Experto", min: 7000, max: 99999, badge: "bg-amber-100 text-amber-600" },
];

export default function MembersDirectory() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await getCommunityMembers();
        setMembers(
          data.map((m: any) => ({
            id: m.profile?.id,
            name: m.profile?.full_name || "Estudiante",
            email: m.profile?.email || "",
            avatar: m.profile?.avatar_url,
            role: m.role || "member",
            joinedAt: m.joined_at,
            initials: m.profile?.full_name
              ? m.profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
              : "??",
          }))
        );
      } catch (err) {
        console.error("Error loading members", err);
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

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-gray-900">Directorio de Miembros</h1>
          <p className="text-sm text-gray-500 mt-1">
            <Users className="w-4 h-4 inline mr-1" />
            {members.length} miembros en la comunidad
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar miembros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-all"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 cursor-pointer"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="member">Miembro</option>
        </select>
      </div>

      {/* Members Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No se encontraron miembros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {member.avatar ? (
                    <img src={member.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    member.initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{member.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {member.role === "admin" && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600 flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> ADMIN
                      </span>
                    )}
                    {member.role === "instructor" && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-600 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5" /> INSTRUCTOR
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Miembro desde {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("es-MX", { month: "short", year: "numeric" }) : "—"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
