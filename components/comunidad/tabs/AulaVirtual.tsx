"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Play, Code, CheckCircle, Terminal, PlayCircle, Loader2,
  BookOpen, ChevronLeft, ChevronRight, Lock, Sparkles, Monitor, X, Layers,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseLessons, toggleLessonProgress, getLessonNote, saveLessonNote } from "@/lib/supabase/comunidad-ai";

interface Lesson {
  id: string;
  title: string;
  module_name: string;
  module_order: number;
  lesson_order: number;
  video_url: string;
  duration_minutes: number;
  is_free_preview: boolean;
  superclass_language?: string | null;
}

interface Module {
  name: string;
  order: number;
  lessons: Lesson[];
}

interface AulaVirtualProps {
  courseId: string;
  onBack: () => void;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w-]+/g, "") // remove all non-word chars
    .replace(/--+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim - from start
    .replace(/-+$/, ""); // trim - from end
}

export default function AulaVirtual({ courseId, onBack }: AulaVirtualProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseSlug = segments[2];
  const selectedLessonSlug = segments[3] || null;

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Super Clase state
  const [superClaseActive, setSuperClaseActive] = useState(false);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Escribe tu código aquí\nprint('¡Hola ProgramBI!')");
  const [codeOutput, setCodeOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  // Track completed lessons (local state for now)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    router.push(`/comunidad/cursos/${courseSlug}/${slugify(lesson.title)}`);
  };

  useEffect(() => {
    if (modules.length === 0 || !selectedLessonSlug) return;
    const matched = modules.flatMap(m => m.lessons).find(l => slugify(l.title) === selectedLessonSlug);
    if (matched && matched.id !== selectedLesson?.id) {
      setSelectedLesson(matched);
    }
  }, [selectedLessonSlug, modules, selectedLesson]);

  useEffect(() => {
    async function load() {
      try {
        const { lessons, access, completedLessonIds } = await getCourseLessons(courseId);
        setAccessType(access);

        if (completedLessonIds && completedLessonIds.length > 0) {
          setCompletedLessons(new Set(completedLessonIds));
        }

        // Group lessons into modules
        const moduleMap: Record<string, Module> = {};
        lessons.forEach((l: any) => {
          if (!moduleMap[l.module_name]) {
            moduleMap[l.module_name] = { name: l.module_name, order: l.module_order, lessons: [] };
          }
          moduleMap[l.module_name].lessons.push(l);
        });

        const sorted = Object.values(moduleMap).sort((a, b) => a.order - b.order);
        setModules(sorted);

        // Auto-select lesson based on URL slug or first lesson if none
        let initialLesson = sorted.length > 0 && sorted[0].lessons.length > 0 ? sorted[0].lessons[0] : null;
        if (selectedLessonSlug) {
          const matched = sorted.flatMap(m => m.lessons).find(l => slugify(l.title) === selectedLessonSlug);
          if (matched) initialLesson = matched;
        }
        setSelectedLesson(initialLesson);
      } catch (e) {
        console.error("Error loading lessons:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, courseSlug, selectedLessonSlug]);

  // When Super Clase activates, set language from lesson and load saved note
  useEffect(() => {
    async function loadNoteAndSetLanguage() {
      if (!selectedLesson) return;
      if (selectedLesson.superclass_language) {
        setLanguage(selectedLesson.superclass_language);
        const defaultCode: Record<string, string> = {
          python: "# Escribe tu código Python aquí\nprint('¡Hola ProgramBI!')",
          sql: "-- Escribe tu consulta SQL aquí\nSELECT 'Hola ProgramBI' AS mensaje;",
          javascript: "// Escribe tu código JavaScript aquí\nconsole.log('¡Hola ProgramBI!');",
        };

        try {
          const savedNote = await getLessonNote(courseId, selectedLesson.id);
          if (savedNote) {
            setCode(savedNote);
          } else {
            setCode(defaultCode[selectedLesson.superclass_language] || defaultCode.python);
          }
        } catch (err) {
          console.error("Error loading lesson note:", err);
          setCode(defaultCode[selectedLesson.superclass_language] || defaultCode.python);
        }
      }
    }
    loadNoteAndSetLanguage();
  }, [selectedLesson, courseId]);

  // Auto-save playground code note with debounce
  useEffect(() => {
    if (!selectedLesson || !superClaseActive || !selectedLesson.superclass_language) return;

    const timer = setTimeout(async () => {
      try {
        await saveLessonNote(courseId, selectedLesson.id, code);
      } catch (err) {
        console.error("Error auto-saving lesson note:", err);
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(timer);
  }, [code, selectedLesson, courseId, superClaseActive]);

  const executeCode = async () => {
    setIsExecuting(true);
    setCodeOutput("");
    try {
      const versionMap: Record<string, string> = {
        python: "3.10.0",
        javascript: "18.15.0",
        sql: "3.36.0",
      };
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version: versionMap[language] || "*",
          files: [{
            name: `main.${language === "python" ? "py" : language === "javascript" ? "js" : "sql"}`,
            content: code,
          }],
        }),
      });
      const result = await response.json();
      if (result.compile && result.compile.code !== 0) {
        setCodeOutput(result.compile.output);
      } else if (result.run) {
        setCodeOutput(result.run.output);
      } else {
        setCodeOutput("Error desconocido");
      }
    } catch (err: any) {
      setCodeOutput(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleComplete = async (lessonId: string) => {
    const isCurrentlyCompleted = completedLessons.has(lessonId);
    const nextState = !isCurrentlyCompleted;

    // Optimistic UI update
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });

    try {
      await toggleLessonProgress(courseId, lessonId, nextState);
    } catch (err) {
      console.error("Error updating lesson progress on database:", err);
      // Revert UI update on failure
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        if (isCurrentlyCompleted) {
          next.add(lessonId);
        } else {
          next.delete(lessonId);
        }
        return next;
      });
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
  const videoId = selectedLesson ? extractYouTubeId(selectedLesson.video_url) : null;

  const selectedLessonGlobalIndex = selectedLesson ? modules.flatMap(m => m.lessons).findIndex(l => l.id === selectedLesson.id) : -1;
  const isSelectedLessonLocked = accessType === "trial" && selectedLessonGlobalIndex >= 2;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-surface-0">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-medium">Cargando clases...</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-surface-0">
        <Layers className="w-16 h-16 text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Aún no hay clases</h3>
        <p className="text-sm text-gray-500 mb-6">El instructor está preparando el contenido.</p>
        <button onClick={onBack} className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Volver a cursos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse w-full h-screen overflow-hidden bg-surface-1 text-gray-900">

      {/* ─── SIDEBAR: Lessons List ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-none h-full border-l border-gray-200 flex flex-col bg-white overflow-hidden relative z-10"
          >
            {/* Header */}
            <div className="flex-none p-5 border-b border-gray-100">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-blue text-xs font-bold mb-4 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Volver a cursos
              </button>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-sm text-gray-900">Contenido del curso</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold mb-1.5 uppercase tracking-wide">
                  <span>Progreso de estudio</span>
                  <span className="text-brand-blue">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto">
              {modules.map((mod) => (
                <div key={mod.name} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                      Módulo {mod.order}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 mt-0.5">{mod.name}</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {mod.lessons.map((lesson) => {
                      const isSelected = selectedLesson?.id === lesson.id;
                      const isCompleted = completedLessons.has(lesson.id);
                      const globalIndex = modules.flatMap(m => m.lessons).findIndex(l => l.id === lesson.id);
                      const isLocked = accessType === "trial" && globalIndex >= 2;
                      const hasSuperClase = !!lesson.superclass_language;

                      return (
                        <motion.button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                          className={`w-full text-left px-5 py-4 flex items-start gap-3.5 transition-all group border-l-[3px] border-y-0 border-r-0 cursor-pointer bg-transparent ${
                            isSelected
                              ? "bg-blue-50 border-brand-blue"
                              : "border-transparent"
                          }`}
                        >
                          {/* Number / Check / Lock Icon */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none mt-0.5 text-[11px] font-bold transition-colors ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isSelected
                              ? "bg-brand-blue text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : isLocked ? (
                              <Lock className="w-3 h-3 text-gray-400" />
                            ) : (
                              lesson.lesson_order
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`text-[13px] leading-snug line-clamp-2 transition-colors ${
                              isSelected
                                ? "text-gray-900 font-bold"
                                : "text-gray-700 group-hover:text-gray-900 font-medium"
                            }`}>
                              {lesson.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                {lesson.duration_minutes || 0} min
                              </span>
                              {hasSuperClase && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 uppercase tracking-wide border border-violet-100">
                                  <Code className="w-2.5 h-2.5 inline mr-0.5" />
                                  Super Clase
                                </span>
                              )}
                              {lesson.is_free_preview && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase tracking-wide border border-emerald-100">
                                  Gratis
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-surface-1 relative z-0">

        {/* Top Bar */}
        <div className="flex-none h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-1 cursor-pointer border-0 bg-transparent"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {selectedLesson ? `Módulo ${modules.find(m => m.lessons.includes(selectedLesson))?.order || ''} • Clase ${selectedLesson.lesson_order}` : ''}
              </div>
              <h2 className="text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">
                {selectedLesson?.title || "Selecciona una clase"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Super Clase Toggle */}
            {selectedLesson?.superclass_language && (
              <button
                onClick={() => setSuperClaseActive(!superClaseActive)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer border-0 ${
                  superClaseActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Super Clase
              </button>
            )}
            {selectedLesson && (
              <button
                onClick={() => toggleComplete(selectedLesson.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer border-0 ${
                  completedLessons.has(selectedLesson.id)
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {completedLessons.has(selectedLesson.id) ? "Completada" : "Completar"}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          {!selectedLesson ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Monitor className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Selecciona una clase para comenzar</p>
              </div>
            </div>
          ) : superClaseActive && selectedLesson.superclass_language ? (

            /* ── SUPER CLASE MODE ── */
            <div className="flex h-full">

              {/* IDE + Terminal (Left side) */}
              <div className="flex-1 flex flex-col h-full bg-white min-h-0 border-r border-gray-200">
                {/* IDE Header */}
                <div className="flex-none h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-violet-600" />
                    <span className="text-gray-900 font-semibold text-xs tracking-wide">Playground Interactivo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-gray-50 text-gray-900 text-[11px] border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none font-bold cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value="python">Python 3</option>
                      <option value="sql">SQL (SQLite)</option>
                      <option value="javascript">JavaScript</option>
                    </select>
                    <button
                      onClick={executeCode}
                      disabled={isExecuting}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black transition-colors disabled:opacity-50 cursor-pointer border-0 shadow-md shadow-emerald-500/10"
                    >
                      {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                      Ejecutar
                    </button>
                  </div>
                </div>
                {/* Editor */}
                <div className="flex-1 min-h-0">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                      padding: { top: 12 },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
                {/* Terminal */}
                <div className="flex-none h-44 bg-slate-900 border-t border-gray-200">
                  <div className="h-8 bg-slate-950 flex items-center px-4 border-b border-slate-800">
                    <Terminal className="w-3.5 h-3.5 text-gray-400 mr-2" />
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Consola de Salida</span>
                  </div>
                  <div
                    className="p-4 overflow-y-auto h-[calc(100%-32px)] font-mono text-xs leading-relaxed"
                    style={{ color: (codeOutput.includes("Error") || codeOutput.includes("Traceback")) ? "#ef4444" : "#a5b4fc" }}
                  >
                    {codeOutput ? (
                      <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                    ) : (
                      <span className="text-gray-500">El resultado de la ejecución aparecerá aquí...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Video PiP (Right side) */}
              <div className="flex-none w-[380px] flex flex-col border-l border-gray-200 bg-white">
                <div className="relative w-full pb-[56.25%] flex-none bg-black">
                  {videoId ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <p className="text-xs text-gray-500">Sin video</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-5 bg-surface-0">
                  <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <BookOpen className="w-4 h-4 text-brand-blue" /> Notas de la Clase
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Mira el video de la clase a tu ritmo mientras practicas los conceptos vistos escribiendo código en el editor interactivo de la izquierda. Cualquier código escrito se autoguarda automáticamente.
                  </p>
                </div>
              </div>
            </div>
          ) : (

            /* ── NORMAL MODE: Video full width ── */
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Video Player */}
              <div className="relative w-full aspect-video bg-black shadow-lg rounded-b-2xl overflow-hidden">
                {isSelectedLessonLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                    <Lock className="w-16 h-16 text-blue-400 mb-4 relative z-10 animate-bounce" />
                    <h2 className="text-2xl font-black text-white relative z-10 mb-2">Clase Bloqueada (Periodo de Prueba)</h2>
                    <p className="text-slate-300 text-sm max-w-md text-center relative z-10 mb-6 font-medium leading-relaxed">
                      Estás disfrutando de tus 7 días de prueba. Para desbloquear el resto de las clases y todas las herramientas Premium, puedes saltarte el periodo de prueba y acceder al 100% de la plataforma ahora.
                    </p>
                    <button
                      onClick={() => window.location.href = `/api/mercadopago/upgrade-trial?returnTo=/cursos/`}
                      className="relative z-10 px-6 py-3 bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 flex items-center gap-2 transform transition-all hover:scale-105 cursor-pointer border-0"
                    >
                      <Sparkles className="w-4 h-4" /> Desbloquear Curso Completo
                    </button>
                  </div>
                ) : videoId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Video no disponible</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1">
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-blue-50 text-brand-blue uppercase tracking-wider border border-blue-100">
                      Clase {selectedLesson.lesson_order}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{selectedLesson.duration_minutes || 0} min</span>
                    {selectedLesson.superclass_language && (
                      <button
                        onClick={() => setSuperClaseActive(true)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors flex items-center gap-1 cursor-pointer border border-violet-100"
                      >
                        <Sparkles className="w-3 h-3" /> Activar Super Clase ({selectedLesson.superclass_language.toUpperCase()})
                      </button>
                    )}
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-gray-900 mb-4">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed font-medium">
                    Mira la clase completa y practica los conceptos aprendidos.
                    {selectedLesson.superclass_language && (
                      <> Activa el modo <strong className="text-violet-600">Super Clase</strong> en la barra superior para interactuar con el Playground de código {selectedLesson.superclass_language.toUpperCase()} mientras ves la clase.</>
                    )}
                  </p>

                  {/* Next Lessons Preview */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Siguientes clases</h3>
                    <div className="divide-y divide-gray-100">
                      {modules.flatMap(m => m.lessons)
                        .filter(l => {
                          if (!selectedLesson) return false;
                          const currentIdx = modules.flatMap(m => m.lessons).findIndex(x => x.id === selectedLesson.id);
                          const thisIdx = modules.flatMap(m => m.lessons).findIndex(x => x.id === l.id);
                          return thisIdx > currentIdx && thisIdx <= currentIdx + 3;
                        })
                        .map(l => (
                          <motion.button
                            key={l.id}
                            onClick={() => handleSelectLesson(l)}
                            whileHover={{ scale: 1.005, backgroundColor: "rgba(249, 250, 251, 1)" }}
                            whileTap={{ scale: 0.995 }}
                            className="w-full flex items-center gap-4 p-4 transition-all text-left group cursor-pointer border-0 bg-transparent rounded-xl"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                              {l.lesson_order}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{l.title}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">{l.duration_minutes || 0} min</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
