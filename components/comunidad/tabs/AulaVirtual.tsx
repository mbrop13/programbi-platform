"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play, Code, CheckCircle, Terminal, PlayCircle, Loader2,
  Maximize2, Minimize2, BookOpen, ChevronLeft, ChevronRight,
  Lock, Sparkles, Monitor, X, Layers,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseLessons } from "@/lib/supabase/comunidad-ai";

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

export default function AulaVirtual({ courseId, onBack }: AulaVirtualProps) {
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

  useEffect(() => {
    async function load() {
      try {
        const { lessons, access } = await getCourseLessons(courseId);
        setAccessType(access);

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

        // Auto-select first lesson
        if (sorted.length > 0 && sorted[0].lessons.length > 0) {
          setSelectedLesson(sorted[0].lessons[0]);
        }
      } catch (e) {
        console.error("Error loading lessons:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  // When Super Clase activates, set language from lesson
  useEffect(() => {
    if (selectedLesson?.superclass_language) {
      setLanguage(selectedLesson.superclass_language);
      const defaultCode: Record<string, string> = {
        python: "# Escribe tu código Python aquí\nprint('¡Hola ProgramBI!')",
        sql: "-- Escribe tu consulta SQL aquí\nSELECT 'Hola ProgramBI' AS mensaje;",
        javascript: "// Escribe tu código JavaScript aquí\nconsole.log('¡Hola ProgramBI!');",
      };
      setCode(defaultCode[selectedLesson.superclass_language] || defaultCode.python);
    }
  }, [selectedLesson]);

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

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
  const videoId = selectedLesson ? extractYouTubeId(selectedLesson.video_url) : null;

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
    <div className="w-full h-[calc(100vh-120px)] min-h-[600px] flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      
      {/* ─── SIDEBAR: Lessons List ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-none h-full border-r border-gray-100 flex flex-col bg-[#FAFBFC] overflow-hidden"
          >
            {/* Header */}
            <div className="flex-none p-5 border-b border-gray-100">
              <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-brand-blue text-xs font-bold mb-3 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Volver a cursos
              </button>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-sm text-gray-900">Contenido del curso</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {/* Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1.5">
                  <span>Progreso</span>
                  <span className="font-bold text-gray-600">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-blue to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto">
              {modules.map((mod) => (
                <div key={mod.name} className="border-b border-gray-50">
                  <div className="px-5 py-3 bg-gray-50/60">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                      Módulo {mod.order}
                    </span>
                    <h4 className="text-xs font-bold text-gray-700 mt-0.5">{mod.name}</h4>
                  </div>
                  <div className="divide-y divide-gray-50/80">
                    {mod.lessons.map((lesson) => {
                      const isSelected = selectedLesson?.id === lesson.id;
                      const isCompleted = completedLessons.has(lesson.id);
                      const isLocked = accessType === "trial" && !lesson.is_free_preview;
                      const hasSuperClase = !!lesson.superclass_language;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !isLocked && setSelectedLesson(lesson)}
                          disabled={isLocked}
                          className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-all group ${
                            isSelected
                              ? "bg-blue-50/70 border-l-[3px] border-brand-blue"
                              : isLocked
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-gray-50 border-l-[3px] border-transparent"
                          }`}
                        >
                          {/* Number / Check */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none mt-0.5 text-[11px] font-bold ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isSelected
                              ? "bg-brand-blue text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}>
                            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3 h-3" /> : lesson.lesson_order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-400 font-medium">
                                {lesson.duration_minutes || 0} min
                              </span>
                              {hasSuperClase && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 uppercase">
                                  <Code className="w-2.5 h-2.5 inline mr-0.5" />
                                  Super Clase
                                </span>
                              )}
                              {lesson.is_free_preview && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 uppercase">
                                  Gratis
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
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
      <div className="flex-1 flex flex-col min-w-0 h-full bg-white">
        {/* Top Bar */}
        <div className="flex-none h-14 border-b border-gray-100 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors mr-1">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <div>
              <div className="text-[11px] text-gray-400 font-medium">
                {selectedLesson ? `Módulo ${modules.find(m => m.lessons.includes(selectedLesson))?.order || ''} • Clase ${selectedLesson.lesson_order}` : ''}
              </div>
              <h2 className="text-sm font-bold text-gray-900 line-clamp-1">
                {selectedLesson?.title || "Selecciona una clase"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Super Clase Toggle */}
            {selectedLesson?.superclass_language && (
              <button
                onClick={() => setSuperClaseActive(!superClaseActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  superClaseActive
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-200"
                    : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Super Clase
              </button>
            )}
            {selectedLesson && (
              <button
                onClick={() => toggleComplete(selectedLesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  completedLessons.has(selectedLesson.id)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {completedLessons.has(selectedLesson.id) ? "Completada" : "Completar"}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {!selectedLesson ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Selecciona una clase para comenzar</p>
              </div>
            </div>
          ) : superClaseActive && selectedLesson.superclass_language ? (
            /* ── SUPER CLASE MODE ── */
            <div className="flex h-full">
              {/* Video (top-right corner, small) */}
              <div className="flex-1 flex flex-col h-full">
                {/* IDE + Terminal */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0">
                  {/* IDE Header */}
                  <div className="flex-none h-11 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span className="text-white font-medium text-xs">Playground Interactivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-[#333] text-white text-[11px] border-none rounded px-2 py-1 outline-none font-bold cursor-pointer"
                      >
                        <option value="python">Python 3</option>
                        <option value="sql">SQL (SQLite)</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                      <button
                        onClick={executeCode}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[11px] font-bold transition-colors disabled:opacity-50"
                      >
                        {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlayCircle className="w-3 h-3" />}
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
                  <div className="flex-none h-36 bg-black border-t border-[#333]">
                    <div className="h-7 bg-[#252526] flex items-center px-3 border-b border-[#333]">
                      <Terminal className="w-3 h-3 text-gray-400 mr-2" />
                      <span className="text-[10px] text-gray-400 font-bold tracking-wide">Terminal</span>
                    </div>
                    <div className="p-3 overflow-y-auto h-[calc(100%-28px)] font-mono text-xs leading-relaxed"
                      style={{ color: (codeOutput.includes("Error") || codeOutput.includes("Traceback")) ? "#ef4444" : "#d1d5db" }}>
                      {codeOutput ? (
                        <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                      ) : (
                        <span className="text-gray-600">El resultado aparecerá aquí...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video PiP (right side) */}
              <div className="flex-none w-[380px] flex flex-col border-l border-[#333] bg-black">
                <div className="relative w-full pb-[56.25%] flex-none">
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
                <div className="flex-1 overflow-y-auto p-4 bg-[#111]">
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-blue" /> Notas de la Clase
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Mira el video mientras escribes código. Practica los conceptos en tiempo real con el editor interactivo.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ── NORMAL MODE: Video full width ── */
            <div className="flex flex-col h-full">
              {/* Video Player */}
              <div className="relative w-full bg-black" style={{ paddingBottom: "50%" }}>
                {videoId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Play className="w-16 h-16 text-gray-600" />
                    <p className="text-gray-500 ml-4">Video no disponible</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 text-brand-blue uppercase tracking-wider">
                      Clase {selectedLesson.lesson_order}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{selectedLesson.duration_minutes || 0} min</span>
                    {selectedLesson.superclass_language && (
                      <button
                        onClick={() => setSuperClaseActive(true)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Activar Super Clase ({selectedLesson.superclass_language.toUpperCase()})
                      </button>
                    )}
                  </div>
                  <h2 className="font-display font-black text-2xl text-gray-900 mb-3">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Mira la clase completa y practica los conceptos aprendidos.
                    {selectedLesson.superclass_language && (
                      <> Activa el modo <strong>Super Clase</strong> para ver el video mientras escribes código en {selectedLesson.superclass_language.toUpperCase()}.</>
                    )}
                  </p>

                  {/* Next Lessons Preview */}
                  <div className="mt-8 border-t border-gray-50 pt-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Siguientes clases</h3>
                    <div className="space-y-2">
                      {modules.flatMap(m => m.lessons)
                        .filter(l => {
                          if (!selectedLesson) return false;
                          const currentIdx = modules.flatMap(m => m.lessons).findIndex(x => x.id === selectedLesson.id);
                          const thisIdx = modules.flatMap(m => m.lessons).findIndex(x => x.id === l.id);
                          return thisIdx > currentIdx && thisIdx <= currentIdx + 3;
                        })
                        .map(l => (
                          <button
                            key={l.id}
                            onClick={() => setSelectedLesson(l)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                              {l.lesson_order}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-700">{l.title}</div>
                              <div className="text-[11px] text-gray-400">{l.duration_minutes || 0} min</div>
                            </div>
                            <Play className="w-4 h-4 text-gray-300 group-hover:text-brand-blue transition-colors" />
                          </button>
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
