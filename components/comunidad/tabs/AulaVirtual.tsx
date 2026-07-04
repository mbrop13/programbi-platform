"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Play, Code, CheckCircle, Terminal, PlayCircle, Loader2,
  Maximize2, Minimize2, BookOpen, ChevronLeft, ChevronRight,
  Lock, Sparkles, Monitor, X, Layers,
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
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm text-gray-400 mt-4 font-medium">Cargando clases...</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Layers className="w-16 h-16 text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">Aún no hay clases</h3>
        <p className="text-sm text-gray-300 mb-6">El instructor está preparando el contenido.</p>
        <button onClick={onBack} className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Volver a cursos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse w-full h-screen overflow-hidden bg-[#0B0F19] text-slate-200">
      
      {/* ─── SIDEBAR: Lessons List ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-none h-full border-l border-slate-800/60 flex flex-col bg-[#0E1322] overflow-hidden relative z-10"
          >
            {/* Header */}
            <div className="flex-none p-5 border-b border-slate-800/50">
              <button 
                onClick={onBack} 
                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 text-xs font-bold mb-4 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Volver a cursos
              </button>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-sm text-slate-100">Contenido del curso</h3>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1.5 uppercase tracking-wide">
                  <span>Progreso de estudio</span>
                  <span className="text-blue-400">{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto">
              {modules.map((mod) => (
                <div key={mod.name} className="border-b border-slate-800/40">
                  <div className="px-5 py-3.5 bg-slate-900/40 border-b border-slate-800/20">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                      Módulo {mod.order}
                    </span>
                    <h4 className="text-xs font-bold text-slate-300 mt-0.5">{mod.name}</h4>
                  </div>
                  <div className="divide-y divide-slate-800/20">
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
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                          className={`w-full text-left px-5 py-4 flex items-start gap-3.5 transition-all group border-l-[3px] cursor-pointer border-0 ${
                            isSelected
                              ? "bg-blue-500/10 border-blue-500"
                              : "border-transparent"
                          }`}
                        >
                          {/* Number / Check / Lock Icon */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none mt-0.5 text-[11px] font-bold transition-colors ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : isLocked ? (
                              <Lock className="w-3 h-3 text-slate-500" />
                            ) : (
                              lesson.lesson_order
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`text-[13px] leading-snug line-clamp-2 transition-colors ${
                              isSelected 
                                ? "text-slate-100 font-bold" 
                                : "text-slate-300 group-hover:text-slate-100 font-medium"
                            }`}>
                              {lesson.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-[10px] text-slate-500 font-medium">
                                {lesson.duration_minutes || 0} min
                              </span>
                              {hasSuperClase && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase tracking-wide border border-violet-500/30">
                                  <Code className="w-2.5 h-2.5 inline mr-0.5" />
                                  Super Clase
                                </span>
                              )}
                              {lesson.is_free_preview && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wide border border-emerald-500/30">
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
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#0B0F19] relative z-0">
        
        {/* Top Bar */}
        <div className="flex-none h-16 border-b border-slate-800/60 flex items-center justify-between px-6 bg-[#0E1322]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors mr-1 cursor-pointer border-0 bg-transparent"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {selectedLesson ? `Módulo ${modules.find(m => m.lessons.includes(selectedLesson))?.order || ''} • Clase ${selectedLesson.lesson_order}` : ''}
              </div>
              <h2 className="text-sm font-bold text-slate-100 line-clamp-1 mt-0.5">
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
                    : "bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 border border-violet-500/20"
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
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
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
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-800">
                  <Monitor className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">Selecciona una clase para comenzar</p>
              </div>
            </div>
          ) : superClaseActive && selectedLesson.superclass_language ? (
            
            /* ── SUPER CLASE MODE ── */
            <div className="flex h-full">
              
              {/* IDE + Terminal (Left side) */}
              <div className="flex-1 flex flex-col h-full bg-[#14161E] min-h-0">
                {/* IDE Header */}
                <div className="flex-none h-12 bg-[#0F111A] border-b border-slate-800/60 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-violet-400" />
                    <span className="text-slate-200 font-semibold text-xs tracking-wide">Playground Interactivo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-[#222533] text-slate-200 text-[11px] border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none font-bold cursor-pointer hover:border-slate-600 transition-colors"
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
                <div className="flex-none h-44 bg-[#090A0F] border-t border-slate-800/60">
                  <div className="h-8 bg-[#0F111A] flex items-center px-4 border-b border-slate-800/60">
                    <Terminal className="w-3.5 h-3.5 text-slate-500 mr-2" />
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Consola de Salida</span>
                  </div>
                  <div 
                    className="p-4 overflow-y-auto h-[calc(100%-32px)] font-mono text-xs leading-relaxed"
                    style={{ color: (codeOutput.includes("Error") || codeOutput.includes("Traceback")) ? "#ef4444" : "#a5b4fc" }}
                  >
                    {codeOutput ? (
                      <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                    ) : (
                      <span className="text-slate-600">El resultado de la ejecución aparecerá aquí...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Video PiP (Right side) */}
              <div className="flex-none w-[380px] flex flex-col border-l border-slate-800/60 bg-[#0F111A]">
                <div className="relative w-full pb-[56.25%] flex-none bg-black">
                  {videoId ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0B0F19]">
                      <p className="text-xs text-slate-600">Sin video</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-5 bg-[#0E1017]">
                  <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                    <BookOpen className="w-4 h-4 text-blue-400" /> Notas de la Clase
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Mira el video de la clase a tu ritmo mientras practicas los conceptos vistos escribiendo código en el editor interactivo de la izquierda. Cualquier código escrito se autoguarda automáticamente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            
            /* ── NORMAL MODE: Video full width ── */
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Video Player */}
              <div className="relative w-full aspect-video bg-black shadow-lg">
                {isSelectedLessonLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F19] border border-blue-500/20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                    <Lock className="w-16 h-16 text-blue-400 mb-4 relative z-10 animate-bounce" />
                    <h2 className="text-2xl font-black text-white relative z-10 mb-2">Clase Bloqueada (Periodo de Prueba)</h2>
                    <p className="text-slate-400 text-sm max-w-md text-center relative z-10 mb-6 font-medium leading-relaxed">
                      Estás disfrutando de tus 7 días de prueba. Para desbloquear el resto de las clases y todas las herramientas Premium, puedes saltarte el periodo de prueba y acceder al 100% de la plataforma ahora.
                    </p>
                    <button
                      onClick={() => window.location.href = `/api/mercadopago/upgrade-trial?returnTo=/cursos/`}
                      className="relative z-10 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 flex items-center gap-2 transform transition-all hover:scale-105 cursor-pointer border-0"
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
                      <Play className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Video no disponible</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1">
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 uppercase tracking-wider border border-blue-500/20">
                      Clase {selectedLesson.lesson_order}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{selectedLesson.duration_minutes || 0} min</span>
                    {selectedLesson.superclass_language && (
                      <button
                        onClick={() => setSuperClaseActive(true)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-1 cursor-pointer border border-violet-500/20"
                      >
                        <Sparkles className="w-3 h-3" /> Activar Super Clase ({selectedLesson.superclass_language.toUpperCase()})
                      </button>
                    )}
                  </div>
                  
                  <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-100 mb-4">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-base text-slate-400 leading-relaxed font-medium">
                    Mira la clase completa y practica los conceptos aprendidos. 
                    {selectedLesson.superclass_language && (
                      <> Activa el modo <strong className="text-violet-400">Super Clase</strong> en la barra superior para interactuar con el Playground de código {selectedLesson.superclass_language.toUpperCase()} mientras ves la clase.</>
                    )}
                  </p>

                  {/* Next Lessons Preview */}
                  <div className="mt-10 pt-8 border-t border-slate-800/40">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Siguientes clases</h3>
                    <div className="divide-y divide-slate-800/25">
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
                            whileHover={{ scale: 1.005, backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                            whileTap={{ scale: 0.995 }}
                            className="w-full flex items-center gap-4 p-4 transition-all text-left group cursor-pointer border-0 bg-transparent rounded-xl"
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {l.lesson_order}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-slate-300 group-hover:text-slate-100 transition-colors">{l.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{l.duration_minutes || 0} min</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
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
