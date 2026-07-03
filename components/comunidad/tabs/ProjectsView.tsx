"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  FileCode,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
  Trophy,
  Zap,
} from "lucide-react";
import { getUserProjects } from "@/lib/supabase/projects";

interface Project {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  language?: string;
  accepts_files: boolean;
  xp_reward: number;
  course: {
    id: string;
    title: string;
    slug: string;
    accent_color: string;
  };
  submission: {
    status: string;
    score: number | null;
  } | null;
}

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getUserProjects();
      setProjects(data as Project[]);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique courses
  const courses = Array.from(
    new Map(projects.map((p) => [p.course.slug, p.course])).values()
  );

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchCourse = selectedCourse === "all" || p.course.slug === selectedCourse;
    const matchStatus = selectedStatus === "all" || getProjectStatus(p) === selectedStatus;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCourse && matchStatus && matchSearch;
  });

  // Group by course
  const groupedProjects = filteredProjects.reduce((acc, p) => {
    if (!acc[p.course.title]) acc[p.course.title] = [];
    acc[p.course.title].push(p);
    return acc;
  }, {} as Record<string, Project[]>);

  const getProjectStatus = (p: Project) => {
    if (!p.submission) return "pending";
    if (p.submission.status === "completed") return "completed";
    return "in_progress";
  };

  const getStatusBadge = (p: Project) => {
    const status = getProjectStatus(p);
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completado
            {p.submission?.score && <span className="ml-1">{p.submission.score}%</span>}
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            En progreso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            Sin entregar
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      facil: "bg-green-100 text-green-700",
      intermedio: "bg-yellow-100 text-yellow-700",
      avanzado: "bg-red-100 text-red-700",
    };
    const labels = { facil: "Fácil", intermedio: "Intermedio", avanzado: "Avanzado" };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${colors[difficulty as keyof typeof colors] || colors.intermedio}`}>
        {labels[difficulty as keyof typeof labels] || difficulty}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proyectos Prácticos</h1>
          <p className="text-slate-600 mt-1">
            Pon a prueba tus conocimientos con proyectos reales
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
              <p className="text-sm text-slate-600">Total proyectos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {projects.filter((p) => getProjectStatus(p) === "completed").length}
              </p>
              <p className="text-sm text-slate-600">Completados</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {projects.filter((p) => getProjectStatus(p) === "in_progress").length}
              </p>
              <p className="text-sm text-slate-600">En progreso</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {projects.reduce((sum, p) => sum + (p.submission?.status === "completed" ? p.xp_reward : 0), 0)}
              </p>
              <p className="text-sm text-slate-600">XP ganados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filtros:</span>
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los cursos</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completados</option>
            <option value="in_progress">En progreso</option>
            <option value="pending">Sin entregar</option>
          </select>
        </div>
      </div>

      {/* Projects grouped by course */}
      {Object.keys(groupedProjects).length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No hay proyectos disponibles
          </h3>
          <p className="text-slate-600">
            No se encontraron proyectos con los filtros seleccionados
          </p>
        </div>
      ) : (
        Object.entries(groupedProjects).map(([courseTitle, courseProjects]) => (
          <div key={courseTitle} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded" />
              {courseTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <a
                    href={`/comunidad/proyectos/${project.id}`}
                    className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${project.course.accent_color}20` }}>
                        {project.accepts_files ? (
                          <Upload className="w-5 h-5" style={{ color: project.course.accent_color }} />
                        ) : (
                          <FileCode className="w-5 h-5" style={{ color: project.course.accent_color }} />
                        )}
                      </div>
                      {getStatusBadge(project)}
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {getDifficultyBadge(project.difficulty)}
                        {project.language && (
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold uppercase">
                            {project.language}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-semibold">{project.xp_reward} XP</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Ver detalle</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
