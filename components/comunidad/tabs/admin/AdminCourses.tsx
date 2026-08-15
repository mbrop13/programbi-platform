"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Loader2,
  Play,
  FileText,
  Video,
  Globe,
  Trash2,
  UserPlus,
  Users,
  Upload,
  Edit3,
  Settings,
  Eye,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  adminGetCourses,
  adminCreateCourse,
  adminUpdateCourseDescription,
  adminUpdateCourseShortDescription,
  adminGetLessons,
  adminAddLesson,
  adminUpdateLesson,
  adminTogglePublish,
  adminToggleHidden,
  adminDeleteLesson,
  adminToggleFreePreview,
  adminRemoveEnrollment,
  adminGetCourseEnrollments,
  adminBulkEnrollByEmails,
  adminBulkEnrollByUserIds,
  adminBulkRemoveCourseEnrollments,
  adminUploadCourseResource,
  adminSearchMembers,
} from "@/lib/supabase/comunidad-ai";
import { courses as catalogCourses } from "@/lib/data/courses";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  short_description?: string;
  category?: string;
  level?: string;
  is_published?: boolean;
  is_hidden?: boolean;
  image_url?: string | null;
  accent_color?: string;
  badge_label?: string;
  tech_stack?: string[];
  lesson_count?: number;
  enrollment_count?: number;
  created_at?: string;
};

type MemberHit = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url?: string | null;
};

const PROGRAM_PRESETS = [
  "Power BI",
  "SQL Server",
  "Python",
  "Excel",
  "Análisis de Datos",
  "Power Automate",
  "Copilot",
  "Machine Learning",
  "Analítica Financiera",
];

const GENERIC_CATEGORIES = new Set([
  "campus virtual",
  "campus",
  "catalogo",
  "catálogo",
  "general",
  "curso",
]);

function slugifyCourseTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatVersionDate(iso: string) {
  const [y, m, d] = (iso || "").split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y.slice(2)}`;
}

function inferProgram(course: CourseRow) {
  const title = (course.title || "").trim();
  const titleLower = title.toLowerCase();
  const preset = PROGRAM_PRESETS.find(
    (p) => titleLower === p.toLowerCase() || titleLower.startsWith(`${p.toLowerCase()} `) || titleLower.includes(p.toLowerCase())
  );
  if (preset) return preset;

  const category = (course.category || "").trim();
  if (category && !GENERIC_CATEGORIES.has(category.toLowerCase())) return category;

  const dated = title.match(/^(.+?)\s+(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4})$/);
  if (dated) return dated[1].trim();
  const monthYear = title.match(/^(.+?)\s+([A-Za-záéíóúñ]+)\s+(\d{4})$/i);
  if (monthYear) return monthYear[1].trim();
  return category || "Otras versiones";
}

function catalogLook(program: string) {
  const p = program.toLowerCase().trim();
  if (!p) return undefined;
  return catalogCourses.find((c) => {
    const t = c.title.toLowerCase();
    return t.includes(p) || p.includes(t) || t.split(" ")[0] === p.split(" ")[0];
  });
}

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  return src.charAt(0).toUpperCase();
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null);
  const [courseViewTab, setCourseViewTab] = useState<"access" | "lessons">("access");
  const [listFilter, setListFilter] = useState<"campus" | "catalog" | "all">("campus");
  const [listSearch, setListSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [createProgram, setCreateProgram] = useState("");
  const [createCustomProgram, setCreateCustomProgram] = useState("");
  const [createDate, setCreateDate] = useState(todayISO());
  const [createTitleOverride, setCreateTitleOverride] = useState("");
  const [titleManual, setTitleManual] = useState(false);

  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState(emptyLesson());
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [showMarketingEdits, setShowMarketingEdits] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);
  const [editShortDescription, setEditShortDescription] = useState("");
  const [savingShortDescription, setSavingShortDescription] = useState(false);

  const [courseEnrollments, setCourseEnrollments] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [grantingAccess, setGrantingAccess] = useState(false);
  const [bulkGrantResult, setBulkGrantResult] = useState<{
    success: number;
    failed: number;
    notFound: string[];
    errors: string[];
  } | null>(null);
  const [accessSearch, setAccessSearch] = useState("");
  const [selectedEnrollIds, setSelectedEnrollIds] = useState<string[]>([]);
  const [removingAccess, setRemovingAccess] = useState(false);
  const [accessMode, setAccessMode] = useState<"search" | "emails">("search");
  const [memberQuery, setMemberQuery] = useState("");
  const [memberHits, setMemberHits] = useState<MemberHit[]>([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [pendingMemberIds, setPendingMemberIds] = useState<string[]>([]);
  const [grantingMembers, setGrantingMembers] = useState(false);

  const reloadCourses = async () => {
    const data = (await adminGetCourses()) as CourseRow[];
    setCourses(data);
    return data;
  };

  useEffect(() => {
    async function load() {
      try {
        await reloadCourses();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const loadCourseEnrollments = async (slug: string) => {
    setLoadingEnrollments(true);
    try {
      const data = await adminGetCourseEnrollments(slug);
      setCourseEnrollments(data);
      setSelectedEnrollIds([]);
    } catch (err) {
      console.error(err);
      setCourseEnrollments([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const selectCourse = async (course: CourseRow, tab: "access" | "lessons" = "access") => {
    setSelectedCourse(course);
    setCourseViewTab(tab);
    setEditDescription(course.description || "");
    setEditShortDescription(course.short_description || "");
    setShowAddLesson(false);
    setEditingLesson(null);
    setBulkEmails("");
    setBulkGrantResult(null);
    setAccessSearch("");
    setMemberQuery("");
    setMemberHits([]);
    setPendingMemberIds([]);
    setAccessMode("search");
    setLoadingLessons(true);
    try {
      const data = await adminGetLessons(course.id);
      setLessons(data);
      loadCourseEnrollments(course.slug);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingLessons(false);
    }
  };

  const resolvedProgram = createProgram === "__other__" ? createCustomProgram.trim() : createProgram.trim();
  const autoTitle = resolvedProgram ? `${resolvedProgram} ${formatVersionDate(createDate)}` : "";
  const createTitle = titleManual ? createTitleOverride : autoTitle;

  const openCreate = (program?: string) => {
    setCreateDate(todayISO());
    setTitleManual(false);
    setCreateTitleOverride("");
    setCreateCustomProgram("");
    if (program && program !== "Otras versiones") {
      setCreateProgram(program);
    } else {
      setCreateProgram("");
    }
    setShowCreate(true);
  };

  const handleCreateCourse = async () => {
    if (!resolvedProgram) {
      alert("Elige el programa (Power BI, SQL Server, etc.).");
      return;
    }
    const title = createTitle.trim();
    if (!title) {
      alert("Ingresa el nombre de la versión.");
      return;
    }
    if (creatingCourse) return;
    setCreatingCourse(true);
    try {
      const look = catalogLook(resolvedProgram);
      const created = await adminCreateCourse({
        title,
        slug: slugifyCourseTitle(title),
        description: `Grabaciones de las clases en vivo de ${title}`,
        short_description: `Acceso a las clases grabadas de ${title}`,
        category: resolvedProgram,
        level: "principiante",
        is_hidden: true,
        is_published: true,
        badge_label: "Campus",
        tech_stack: look?.techStack || [resolvedProgram],
        image_url: look?.imageUrl,
        accent_color: look?.accentColor,
      });
      const list = await reloadCourses();
      const full = list.find((c) => c.id === created.id) || created;
      setShowCreate(false);
      await selectCourse(full, "access");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error al crear la versión.");
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleBulkGrantAccess = async () => {
    if (!selectedCourse?.slug) return;
    if (!bulkEmails.trim()) {
      alert("Pega los emails de las personas a las que quieres dar acceso.");
      return;
    }
    setGrantingAccess(true);
    setBulkGrantResult(null);
    try {
      const res = await adminBulkEnrollByEmails(selectedCourse.slug, bulkEmails, "full");
      setBulkGrantResult(res);
      const data = await adminGetCourseEnrollments(selectedCourse.slug);
      setCourseEnrollments(data);
      setSelectedEnrollIds([]);
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, enrollment_count: data.length } : c))
      );
      if (res.success > 0) setBulkEmails("");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error al otorgar accesos.");
    } finally {
      setGrantingAccess(false);
    }
  };

  const handleGrantSelectedMembers = async () => {
    if (!selectedCourse?.slug || pendingMemberIds.length === 0) return;
    setGrantingMembers(true);
    try {
      await adminBulkEnrollByUserIds(selectedCourse.slug, pendingMemberIds, "full");
      const data = await adminGetCourseEnrollments(selectedCourse.slug);
      setCourseEnrollments(data);
      setSelectedEnrollIds([]);
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, enrollment_count: data.length } : c))
      );
      setPendingMemberIds([]);
      setMemberHits([]);
      setMemberQuery("");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error al otorgar accesos.");
    } finally {
      setGrantingMembers(false);
    }
  };

  const handleRemoveSelectedAccess = async () => {
    if (!selectedCourse?.slug || selectedEnrollIds.length === 0) return;
    if (!confirm(`¿Quitar acceso a ${selectedEnrollIds.length} persona(s)?`)) return;
    setRemovingAccess(true);
    try {
      await adminBulkRemoveCourseEnrollments(selectedCourse.slug, selectedEnrollIds);
      const data = await adminGetCourseEnrollments(selectedCourse.slug);
      setCourseEnrollments(data);
      setSelectedEnrollIds([]);
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, enrollment_count: data.length } : c))
      );
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error al quitar accesos.");
    } finally {
      setRemovingAccess(false);
    }
  };

  const handleRemoveOneAccess = async (userId: string) => {
    if (!selectedCourse?.slug) return;
    try {
      await adminRemoveEnrollment(userId, selectedCourse.slug);
      setCourseEnrollments((prev) => prev.filter((e) => e.user_id !== userId));
      setSelectedEnrollIds((prev) => prev.filter((id) => id !== userId));
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, enrollment_count: Math.max(0, (c.enrollment_count || 1) - 1) }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!memberQuery.trim() || memberQuery.trim().length < 2) {
      setMemberHits([]);
      setSearchingMembers(false);
      return;
    }
    let cancelled = false;
    setSearchingMembers(true);
    const t = setTimeout(async () => {
      try {
        const hits = await adminSearchMembers(memberQuery);
        if (!cancelled) setMemberHits(hits as MemberHit[]);
      } catch (err) {
        console.error(err);
        if (!cancelled) setMemberHits([]);
      } finally {
        if (!cancelled) setSearchingMembers(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [memberQuery]);

  const enrolledUserIds = useMemo(
    () => new Set(courseEnrollments.map((e) => e.user_id)),
    [courseEnrollments]
  );

  const filteredCourseEnrollments = courseEnrollments.filter((e) => {
    if (!accessSearch.trim()) return true;
    const q = accessSearch.toLowerCase();
    const name = (e.profile?.full_name || "").toLowerCase();
    const email = (e.profile?.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const programsInUse = useMemo(() => {
    const set = new Set<string>(PROGRAM_PRESETS);
    for (const c of courses) set.add(inferProgram(c));
    return Array.from(set);
  }, [courses]);

  const filteredCourses = courses.filter((c) => {
    if (listFilter === "campus" && !c.is_hidden) return false;
    if (listFilter === "catalog" && c.is_hidden) return false;
    if (!listSearch.trim()) return true;
    const q = listSearch.toLowerCase();
    return (
      (c.title || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q) ||
      inferProgram(c).toLowerCase().includes(q)
    );
  });

  const groupedCampus = useMemo(() => {
    const groups = new Map<string, CourseRow[]>();
    for (const c of filteredCourses) {
      const key = inferProgram(c);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(c);
    }
    return Array.from(groups.entries())
      .map(([program, items]) => ({
        program,
        items: items.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")),
      }))
      .sort((a, b) => a.program.localeCompare(b.program, "es"));
  }, [filteredCourses]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const newResource = await adminUploadCourseResource(formData);
      setNewLesson((prev) => ({ ...prev, resources: [...(prev.resources || []), newResource] }));
    } catch (err: any) {
      console.error("Error uploading file:", err);
      alert(`Error al subir archivo: ${err.message || "Error desconocido"}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddLesson = async () => {
    if (!selectedCourse) return;
    if (!newLesson.title.trim()) {
      alert("Ingresa el título de la clase.");
      return;
    }
    if (savingLesson) return;
    setSavingLesson(true);
    const lessonPayload = {
      title: newLesson.title.trim(),
      module_name: newLesson.module_name.trim() || "Módulo 1",
      module_order: newLesson.module_order || 1,
      lesson_order: newLesson.lesson_order || 1,
      video_url: newLesson.video_url.trim(),
      description: newLesson.description || "",
      is_free_preview: newLesson.is_free_preview,
      superclass_language: newLesson.superclass_language || null,
      resources: newLesson.resources || [],
    };
    try {
      let res: any;
      if (editingLesson) {
        res = await adminUpdateLesson(editingLesson.id, lessonPayload);
      } else {
        res = await adminAddLesson({ ...lessonPayload, course_id: selectedCourse.id });
      }
      if (res && res.success === false) {
        alert(`Error al guardar la clase: ${res.error || "Error desconocido"}`);
        return;
      }
      const data = await adminGetLessons(selectedCourse.id);
      setLessons(data);
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, lesson_count: data.length } : c))
      );
      setNewLesson(emptyLesson());
      setEditingLesson(null);
      setShowAddLesson(false);
    } catch (err: any) {
      console.error(err);
      alert(`Error al guardar la clase: ${err.message || "Ocurrió un error."}`);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await adminDeleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    const globalIdx = lessons.findIndex((l) => l.id === lesson.id);
    setNewLesson({
      title: lesson.title || "",
      module_name: lesson.module_name || "",
      video_url: lesson.video_url || "",
      description: lesson.description || lesson.content_markdown || "",
      module_order: lesson.module_order || 1,
      lesson_order: lesson.lesson_order || (globalIdx >= 0 ? globalIdx + 1 : 1),
      is_free_preview: !!lesson.is_free_preview,
      superclass_language: lesson.superclass_language || "",
      resources: lesson.resources || [],
    });
    setShowAddLesson(true);
  };

  const handleTogglePreview = async (lessonId: string) => {
    try {
      await adminToggleFreePreview(lessonId);
      setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, is_free_preview: !l.is_free_preview } : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      await adminTogglePublish(courseId);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, is_published: !c.is_published } : c)));
      setSelectedCourse((prev) => (prev && prev.id === courseId ? { ...prev, is_published: !prev.is_published } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHidden = async (courseId: string) => {
    try {
      await adminToggleHidden(courseId);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, is_hidden: !c.is_hidden } : c)));
      setSelectedCourse((prev) => (prev && prev.id === courseId ? { ...prev, is_hidden: !prev.is_hidden } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDescription = async () => {
    if (!selectedCourse) return;
    setSavingDescription(true);
    try {
      await adminUpdateCourseDescription(selectedCourse.id, editDescription);
      setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? { ...c, description: editDescription } : c)));
      setSelectedCourse((prev) => (prev ? { ...prev, description: editDescription } : null));
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la descripción.");
    } finally {
      setSavingDescription(false);
    }
  };

  const handleSaveShortDescription = async () => {
    if (!selectedCourse) return;
    setSavingShortDescription(true);
    try {
      await adminUpdateCourseShortDescription(selectedCourse.id, editShortDescription);
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, short_description: editShortDescription } : c))
      );
      setSelectedCourse((prev) => (prev ? { ...prev, short_description: editShortDescription } : null));
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la descripción corta.");
    } finally {
      setSavingShortDescription(false);
    }
  };

  if (selectedCourse) {
    const modules: Record<string, any[]> = {};
    lessons.forEach((l) => {
      if (!modules[l.module_name]) modules[l.module_name] = [];
      modules[l.module_name].push(l);
    });
    const program = inferProgram(selectedCourse);

    return (
      <div className="p-6 sm:p-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-medium mb-5 transition-colors border-0 bg-transparent cursor-pointer p-0"
        >
          ← Volver a versiones
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">{program}</p>
            <h2 className="font-display font-black text-2xl text-gray-900 leading-tight">{selectedCourse.title}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {lessons.length} {lessons.length === 1 ? "clase" : "clases"} · {courseEnrollments.length}{" "}
              {courseEnrollments.length === 1 ? "persona con acceso" : "personas con acceso"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                selectedCourse.is_hidden ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-brand-blue"
              }`}
            >
              {selectedCourse.is_hidden ? "Solo invitados" : "Catálogo público"}
            </span>
            <button
              onClick={() => handleToggleHidden(selectedCourse.id)}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              {selectedCourse.is_hidden ? "Pasar a catálogo" : "Pasar a campus"}
            </button>
            <button
              onClick={() => handleTogglePublish(selectedCourse.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                selectedCourse.is_published
                  ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {selectedCourse.is_published ? "Publicado" : "Publicar"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            onClick={() => {
              setCourseViewTab("access");
              if (courseEnrollments.length === 0) loadCourseEnrollments(selectedCourse.slug);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border-0 ${
              courseViewTab === "access" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Accesos
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                courseViewTab === "access" ? "bg-brand-blue/10 text-brand-blue" : "bg-gray-200 text-gray-600"
              }`}
            >
              {courseEnrollments.length}
            </span>
          </button>
          <button
            onClick={() => setCourseViewTab("lessons")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border-0 ${
              courseViewTab === "lessons" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Play className="w-4 h-4" /> Clases
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                courseViewTab === "lessons" ? "bg-brand-blue/10 text-brand-blue" : "bg-gray-200 text-gray-600"
              }`}
            >
              {lessons.length}
            </span>
          </button>
        </div>

        {courseViewTab === "access" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_1fr] gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Dar acceso</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Solo esas personas van a ver esta versión en la comunidad.
              </p>

              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                <button
                  onClick={() => setAccessMode("search")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold border-0 cursor-pointer ${
                    accessMode === "search" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500"
                  }`}
                >
                  Buscar alumno
                </button>
                <button
                  onClick={() => setAccessMode("emails")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold border-0 cursor-pointer ${
                    accessMode === "emails" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500"
                  }`}
                >
                  Pegar emails
                </button>
              </div>

              {accessMode === "search" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre o email</label>
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={memberQuery}
                      onChange={(e) => setMemberQuery(e.target.value)}
                      placeholder="Ej. maría o maria@empresa.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-blue/40 outline-none"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                    {searchingMembers && (
                      <div className="py-6 flex justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    {!searchingMembers && memberQuery.trim().length >= 2 && memberHits.length === 0 && (
                      <p className="text-xs text-gray-400 p-4 text-center">
                        No hay usuarios con ese nombre o email. Tienen que haberse registrado primero.
                      </p>
                    )}
                    {!searchingMembers && memberQuery.trim().length < 2 && (
                      <p className="text-xs text-gray-400 p-4 text-center">Escribe al menos 2 letras para buscar.</p>
                    )}
                    {memberHits.map((m) => {
                      const already = enrolledUserIds.has(m.id);
                      const pending = pendingMemberIds.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          disabled={already}
                          onClick={() => {
                            if (already) return;
                            setPendingMemberIds((prev) =>
                              prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                            );
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border-0 cursor-pointer ${
                            already ? "opacity-50 cursor-not-allowed bg-gray-50" : pending ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-xs font-black shrink-0">
                            {initials(m.full_name, m.email)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{m.full_name || "Sin nombre"}</div>
                            <div className="text-[11px] text-gray-400 truncate">{m.email}</div>
                          </div>
                          {already ? (
                            <span className="text-[10px] font-bold text-emerald-600">Ya tiene acceso</span>
                          ) : pending ? (
                            <Check className="w-4 h-4 text-brand-blue" />
                          ) : (
                            <Plus className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleGrantSelectedMembers}
                    disabled={grantingMembers || pendingMemberIds.length === 0}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40 cursor-pointer border-0"
                  >
                    {grantingMembers ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {pendingMemberIds.length > 0
                      ? `Dar acceso a ${pendingMemberIds.length}`
                      : "Selecciona personas"}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emails (uno por línea o separados por coma)</label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    rows={7}
                    placeholder={"maria@empresa.com\npedro@gmail.com"}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-brand-blue/40 outline-none resize-y mb-3"
                  />
                  <button
                    onClick={handleBulkGrantAccess}
                    disabled={grantingAccess || !bulkEmails.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40 cursor-pointer border-0"
                  >
                    {grantingAccess ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {grantingAccess ? "Otorgando..." : "Dar acceso"}
                  </button>
                  {bulkGrantResult && (
                    <div
                      className={`mt-3 rounded-xl p-3 border text-xs ${
                        bulkGrantResult.notFound.length > 0 || bulkGrantResult.errors.length > 0
                          ? "bg-amber-50 border-amber-200"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <p className="font-bold text-gray-900">
                        {bulkGrantResult.success} accesos otorgados
                        {bulkGrantResult.notFound.length > 0 && (
                          <span className="text-amber-700 font-semibold">
                            {" "}
                            · {bulkGrantResult.notFound.length} no registrados
                          </span>
                        )}
                      </p>
                      {bulkGrantResult.notFound.length > 0 && (
                        <div className="mt-2 max-h-24 overflow-y-auto space-y-0.5">
                          {bulkGrantResult.notFound.map((email) => (
                            <div key={email} className="font-mono text-amber-800">
                              {email}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Quién tiene acceso</h3>
                  <p className="text-xs text-gray-400">{courseEnrollments.length} en total</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={accessSearch}
                      onChange={(e) => setAccessSearch(e.target.value)}
                      placeholder="Filtrar lista..."
                      className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs w-44 focus:border-brand-blue/40 outline-none"
                    />
                  </div>
                  {selectedEnrollIds.length > 0 && (
                    <button
                      onClick={handleRemoveSelectedAccess}
                      disabled={removingAccess}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-colors cursor-pointer border-0 disabled:opacity-50"
                    >
                      {removingAccess ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Quitar ({selectedEnrollIds.length})
                    </button>
                  )}
                </div>
              </div>

              {loadingEnrollments ? (
                <div className="py-14 flex justify-center">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : filteredCourseEnrollments.length === 0 ? (
                <div className="py-14 text-center px-6">
                  <Users className="w-9 h-9 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">
                    {courseEnrollments.length === 0
                      ? "Nadie tiene acceso todavía. Busca alumnos o pega sus emails."
                      : "No hay resultados para esa búsqueda."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50/80 sticky top-0">
                    <input
                      type="checkbox"
                      checked={
                        selectedEnrollIds.length > 0 &&
                        selectedEnrollIds.length === filteredCourseEnrollments.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEnrollIds(filteredCourseEnrollments.map((x) => x.user_id));
                        } else {
                          setSelectedEnrollIds([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-brand-blue"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      Seleccionar visibles
                    </span>
                  </div>
                  {filteredCourseEnrollments.map((e) => (
                    <div key={e.id || e.user_id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80">
                      <input
                        type="checkbox"
                        checked={selectedEnrollIds.includes(e.user_id)}
                        onChange={(ev) => {
                          if (ev.target.checked) setSelectedEnrollIds((prev) => [...prev, e.user_id]);
                          else setSelectedEnrollIds((prev) => prev.filter((id) => id !== e.user_id));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-brand-blue"
                      />
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-xs font-black shrink-0">
                        {initials(e.profile?.full_name, e.profile?.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {e.profile?.full_name || "Sin nombre"}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{e.profile?.email || e.user_id}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveOneAccess(e.user_id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
                        title="Quitar acceso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {courseViewTab === "lessons" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-500">
                Sube cada clase grabada con su URL de YouTube. Quienes tengan acceso las ven en Mi Aprendizaje.
              </p>
              <div className="flex items-center gap-2">
                {!selectedCourse.is_hidden && (
                  <button
                    onClick={() => setShowMarketingEdits(!showMarketingEdits)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      showMarketingEdits
                        ? "bg-slate-100 border-slate-200 text-slate-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Descripciones
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowAddLesson(!showAddLesson);
                    setEditingLesson(null);
                    setNewLesson(emptyLesson());
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer border-0"
                >
                  <Plus className="w-4 h-4" /> Agregar clase
                </button>
              </div>
            </div>

            {showMarketingEdits && !selectedCourse.is_hidden && (
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-950 text-sm mb-1">Descripción general</h3>
                  <p className="text-xs text-gray-500 mb-3">Se muestra en la página pública del curso.</p>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleSaveDescription}
                      disabled={savingDescription}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-50 border-0 cursor-pointer"
                    >
                      {savingDescription ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-950 text-sm mb-1">Descripción corta</h3>
                  <p className="text-xs text-gray-500 mb-3">Tarjetas y checkout. Mejor bajo 150 caracteres.</p>
                  <textarea
                    value={editShortDescription}
                    onChange={(e) => setEditShortDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleSaveShortDescription}
                      disabled={savingShortDescription}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-50 border-0 cursor-pointer"
                    >
                      {savingShortDescription ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {showAddLesson && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-sm text-gray-900">
                      {editingLesson ? "Editar clase" : "Nueva clase grabada"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Título</label>
                        <input
                          type="text"
                          placeholder="Ej. Clase 1 · Modelo de datos"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Módulo</label>
                        <input
                          type="text"
                          placeholder="Ej. Módulo 1"
                          value={newLesson.module_name}
                          onChange={(e) => setNewLesson((p) => ({ ...p, module_name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">URL del video</label>
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-red-500 shrink-0" />
                          <input
                            type="text"
                            placeholder="https://youtube.com/watch?v=..."
                            value={newLesson.video_url}
                            onChange={(e) => setNewLesson((p) => ({ ...p, video_url: e.target.value }))}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notas de la clase (opcional)</label>
                        <textarea
                          rows={3}
                          placeholder="Resumen, links o apuntes en Markdown"
                          value={newLesson.description || ""}
                          onChange={(e) => setNewLesson((p) => ({ ...p, description: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none resize-y font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-500">Módulo #</label>
                          <input
                            type="number"
                            min={1}
                            value={newLesson.module_order}
                            onChange={(e) =>
                              setNewLesson((p) => ({ ...p, module_order: parseInt(e.target.value) || 1 }))
                            }
                            className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-500">Clase #</label>
                          <input
                            type="number"
                            min={1}
                            value={newLesson.lesson_order}
                            onChange={(e) =>
                              setNewLesson((p) => ({ ...p, lesson_order: parseInt(e.target.value) || 1 }))
                            }
                            className="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm text-center outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500">Super Clase</label>
                        <select
                          value={newLesson.superclass_language || ""}
                          onChange={(e) => setNewLesson((p) => ({ ...p, superclass_language: e.target.value }))}
                          className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                        >
                          <option value="">Solo video</option>
                          <option value="python">Python</option>
                          <option value="sql">SQL</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Archivos</label>
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white/50 flex flex-col items-center gap-2">
                          {uploadingFile ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                              Subiendo...
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              Subir archivo
                              <input type="file" onChange={handleUploadFile} className="hidden" />
                            </label>
                          )}
                        </div>
                        {newLesson.resources && newLesson.resources.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {newLesson.resources.map((res: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100 text-xs"
                              >
                                <span className="font-semibold text-gray-700 truncate max-w-[200px]">{res.name}</span>
                                <button
                                  onClick={() =>
                                    setNewLesson((prev) => ({
                                      ...prev,
                                      resources: prev.resources.filter((_: any, i: number) => i !== idx),
                                    }))
                                  }
                                  className="p-1 text-red-500 hover:bg-red-50 rounded border-0 bg-transparent cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {!selectedCourse.is_hidden && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="free_preview"
                            checked={newLesson.is_free_preview}
                            onChange={(e) => setNewLesson((p) => ({ ...p, is_free_preview: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-brand-blue"
                          />
                          <label htmlFor="free_preview" className="text-sm font-medium text-gray-700">
                            Clase de prueba gratuita
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowAddLesson(false);
                          setEditingLesson(null);
                          setNewLesson(emptyLesson());
                        }}
                        className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border-0 bg-transparent cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddLesson}
                        disabled={!newLesson.title.trim() || savingLesson}
                        className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm disabled:opacity-40 flex items-center gap-1.5 cursor-pointer border-0"
                      >
                        {savingLesson && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Guardar clase
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loadingLessons ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : lessons.length === 0 ? (
              <div className="py-14 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
                <Play className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">Todavía no hay clases grabadas.</p>
                <p className="text-xs text-gray-400 mt-1">Agrega el video de cada sesión en vivo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(modules).map(([moduleName, moduleLessons]) => (
                  <div key={moduleName} className="rounded-2xl overflow-hidden bg-gray-50/40">
                    <div className="bg-gray-100/60 px-5 py-3 font-bold text-sm text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" /> {moduleName || "Sin módulo"}
                    </div>
                    <div className="divide-y divide-gray-100/60">
                      {moduleLessons.map((lesson: any, idx: number) => {
                        const globalIdx = lessons.findIndex((l: any) => l.id === lesson.id);
                        const displayIndex = globalIdx >= 0 ? globalIdx + 1 : idx + 1;
                        return (
                          <div key={lesson.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100/60">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                              {displayIndex}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</span>
                                {lesson.resources?.length > 0 && (
                                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">
                                    {lesson.resources.length} archivo{lesson.resources.length === 1 ? "" : "s"}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                                {lesson.video_url ? (
                                  <>
                                    <Video className="w-3 h-3" /> YouTube
                                  </>
                                ) : (
                                  "Sin video"
                                )}
                              </div>
                            </div>
                            {lesson.is_free_preview && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                GRATIS
                              </span>
                            )}
                            {!selectedCourse.is_hidden && (
                              <button
                                onClick={() => handleTogglePreview(lesson.id)}
                                title={lesson.is_free_preview ? "Quitar preview" : "Hacer gratuita"}
                                className={`p-1.5 rounded-lg border-0 bg-transparent cursor-pointer ${
                                  lesson.is_free_preview
                                    ? "text-emerald-500 hover:bg-emerald-50"
                                    : "text-gray-300 hover:text-emerald-500 hover:bg-emerald-50"
                                }`}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleStartEditLesson(lesson)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 border-0 bg-transparent cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 border-0 bg-transparent cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">Campus y versiones</h2>
          <p className="text-sm text-gray-400 max-w-xl">
            Crea una versión por cada grupo de clases en vivo — por ejemplo Power BI 03/04/26 — y dale acceso solo a esas
            personas.
          </p>
        </div>
        <button
          onClick={() => (showCreate ? setShowCreate(false) : openCreate())}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer border-0 shrink-0"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? "Cerrar" : "Nueva versión"}
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-6"
          >
            <h3 className="font-bold text-gray-900 text-base mb-1">Nueva versión de campus</h3>
            <p className="text-xs text-gray-500 mb-5">
              Elige el programa y la fecha de esas clases en vivo. Queda oculta del catálogo: solo entra quien invites.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Programa</label>
                <select
                  value={createProgram}
                  onChange={(e) => {
                    setCreateProgram(e.target.value);
                    setTitleManual(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none"
                >
                  <option value="">Elegir...</option>
                  {programsInUse.filter((p) => p !== "Otras versiones").map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="__other__">Otro programa...</option>
                </select>
              </div>
              {createProgram === "__other__" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre del programa</label>
                  <input
                    type="text"
                    value={createCustomProgram}
                    onChange={(e) => {
                      setCreateCustomProgram(e.target.value);
                      setTitleManual(false);
                    }}
                    placeholder="Ej. DAX Avanzado"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Fecha de la versión</label>
                <input
                  type="date"
                  value={createDate}
                  onChange={(e) => {
                    setCreateDate(e.target.value);
                    setTitleManual(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                />
              </div>
              <div className={createProgram === "__other__" ? "sm:col-span-3" : ""}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre que verán los alumnos</label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => {
                    setTitleManual(true);
                    setCreateTitleOverride(e.target.value);
                  }}
                  placeholder="Power BI 03/04/26"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white font-semibold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border-0 bg-transparent cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={creatingCourse || !resolvedProgram || !createTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm disabled:opacity-40 cursor-pointer border-0"
              >
                {creatingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Crear y dar accesos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          {(
            [
              { id: "campus" as const, label: "Versiones de campus" },
              { id: "catalog" as const, label: "Catálogo público" },
              { id: "all" as const, label: "Todos" },
            ]
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setListFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                listFilter === f.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            placeholder="Buscar versión..."
            className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs w-full sm:w-56 focus:border-brand-blue/40 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <span className="text-sm text-gray-400">Cargando versiones...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-600 mb-1">
            {listFilter === "campus" ? "Todavía no hay versiones de campus" : "No hay cursos en este filtro"}
          </p>
          <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
            {listFilter === "campus"
              ? "Crea una por cada grupo que hizo clases en vivo. Ejemplo: Power BI 03/04/26."
              : "Prueba otro filtro o crea una versión nueva."}
          </p>
          <button
            onClick={() => openCreate()}
            className="px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-xl cursor-pointer border-0"
          >
            Crear la primera
          </button>
        </div>
      ) : (
        <div className="space-y-7">
          {groupedCampus.map((group) => {
            const look = catalogLook(group.program);
            return (
              <section key={group.program}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: look?.accentColor || "#1890FF" }}
                    />
                    <h3 className="font-bold text-sm text-gray-800 truncate">{group.program}</h3>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {group.items.length} {group.items.length === 1 ? "versión" : "versiones"}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreate(group.program)}
                    className="text-xs font-bold text-brand-blue hover:text-blue-700 border-0 bg-transparent cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nueva
                  </button>
                </div>
                <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50 bg-white">
                  {group.items.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition-colors"
                    >
                      <button
                        onClick={() => selectCourse(course, course.is_hidden ? "access" : "lessons")}
                        className="flex-1 flex items-center gap-3 text-left border-0 bg-transparent cursor-pointer min-w-0 p-0"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: (course.accent_color || look?.accentColor || "#1890FF") + "18" }}
                        >
                          <GraduationCap
                            className="w-5 h-5"
                            style={{ color: course.accent_color || look?.accentColor || "#1890FF" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-gray-900 truncate">{course.title}</span>
                            {!course.is_published && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                Borrador
                              </span>
                            )}
                            {!course.is_hidden && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Globe className="w-2.5 h-2.5" /> Público
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {course.lesson_count || 0} clases · {course.enrollment_count || 0} con acceso
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0 sm:pl-2">
                        <button
                          onClick={() => selectCourse(course, "access")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 border-0 cursor-pointer"
                        >
                          Dar acceso
                        </button>
                        <button
                          onClick={() => selectCourse(course, "lessons")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 border-0 cursor-pointer"
                        >
                          Clases
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function emptyLesson() {
  return {
    title: "",
    module_name: "",
    video_url: "",
    description: "",
    module_order: 1,
    lesson_order: 1,
    is_free_preview: false,
    superclass_language: "",
    resources: [] as any[],
  };
}
