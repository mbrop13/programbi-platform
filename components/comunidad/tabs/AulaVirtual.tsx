"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Play, Code, CheckCircle, Terminal, PlayCircle, Loader2,
  ChevronLeft, ChevronRight, Lock, Sparkles, Monitor, X, Layers,
  Share2, Star, HelpCircle, StickyNote, Download, Trash2, Send,
  User, Check, BookOpen, Clock, FileText, ChevronDown, CheckSquare, Square,
  MessageSquarePlus
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseLessons, toggleLessonProgress, getLessonNote, saveLessonNote } from "@/lib/supabase/comunidad-ai";
import { getChatMessages } from "@/lib/supabase/ai";
import { MarkdownRenderer } from "@/components/comunidad/ai-v2/MarkdownRenderer";

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
  resources?: any[];
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
  const trimmed = url.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function AulaVirtual({ courseId, onBack }: AulaVirtualProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseSlug = segments[2];
  const selectedLessonSlug = segments[3] || null;

  // Course & Navigation States
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tabs States
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'faq' | 'resources'>('overview');
  const [sidebarTab, setSidebarTab] = useState<'content' | 'ai'>('content');

  // Text Notes States (stored in localStorage)
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  // Interactive AI Assistant States
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: '¡Hola! Soy tu asistente de estudio con IA. ¿Tienes alguna duda sobre la clase de hoy? Pregúntame sobre los conceptos explicados, código o ejercicios.' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Share Copy Link State
  const [copiedShare, setCopiedShare] = useState(false);

  // Super Clase states
  const [superClaseActive, setSuperClaseActive] = useState(false);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Escribe tu código aquí\nprint('¡Hola ProgramBI!')");
  const [codeOutput, setCodeOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [homeTab, setHomeTab] = useState<'syllabus' | 'files' | 'faq'>('syllabus');
  
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
  const videoId = selectedLesson ? extractYouTubeId(selectedLesson.video_url) : null;

  // YouTube player tracking refs & state
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedLessonsRef = useRef(completedLessons);
  const toggleCompleteRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const manuallyUncheckedRef = useRef<Set<string>>(new Set());

  // Sync ref with completedLessons state
  useEffect(() => {
    completedLessonsRef.current = completedLessons;
  }, [completedLessons]);

  // YouTube Player tracking and auto-complete logic at 70% watch time
  useEffect(() => {
    if (!videoId || !selectedLesson) return;

    const lessonId = selectedLesson.id;

    // Load the YouTube API script if not already loaded
    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let player: any;
    let progressInterval: any;

    const initPlayer = () => {
      const container = videoContainerRef.current;
      if (!container) return;

      // Clear container and create player target element
      container.innerHTML = "";
      const playerDiv = document.createElement("div");
      playerDiv.id = "youtube-player-target";
      playerDiv.className = "absolute inset-0 w-full h-full";
      container.appendChild(playerDiv);

      player = new (window as any).YT.Player('youtube-player-target', {
        videoId: videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING is 1
            if (event.data === 1) {
              if (progressInterval) clearInterval(progressInterval);
              progressInterval = setInterval(() => {
                if (player && typeof player.getDuration === 'function' && typeof player.getCurrentTime === 'function') {
                  const duration = player.getDuration();
                  const currentTime = player.getCurrentTime();
                  if (duration > 0) {
                    const percentWatched = (currentTime / duration) * 100;
                    if (percentWatched >= 70 && !completedLessonsRef.current.has(lessonId) && !manuallyUncheckedRef.current.has(lessonId)) {
                      if (toggleCompleteRef.current) {
                        toggleCompleteRef.current(lessonId);
                      }
                      if (progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = null;
                      }
                    }
                  }
                }
              }, 1000);
            } else {
              if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
              }
            }
          }
        }
      });
      playerRef.current = player;
    };

    // Poll until YT API is ready
    const checkInterval = setInterval(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        clearInterval(checkInterval);
        initPlayer();
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [videoId, selectedLesson]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);





  // Sync selected lesson based on slug change in URL
  useEffect(() => {
    if (modules.length === 0) return;
    if (!selectedLessonSlug || selectedLessonSlug === 'inicio') {
      if (selectedLesson !== null) setSelectedLesson(null);
      return;
    }
    const matched = modules.flatMap(m => m.lessons).find(l => slugify(l.title) === selectedLessonSlug);
    if (matched && matched.id !== selectedLesson?.id) {
      setSelectedLesson(matched);
    }
  }, [selectedLessonSlug, modules, selectedLesson]);

  // Initial Load of Course Lessons & Data
  useEffect(() => {
    async function load() {
      try {
        const { lessons, access, completedLessonIds } = await getCourseLessons(courseId);
        setAccessType(access);

        setCompletedLessons(new Set(completedLessonIds || []));

        const moduleMap: Record<string, Module> = {};
        lessons.forEach((l: any) => {
          if (!moduleMap[l.module_name]) {
            moduleMap[l.module_name] = { name: l.module_name, order: l.module_order, lessons: [] };
          }
          moduleMap[l.module_name].lessons.push(l);
        });

        // Deduplicate lessons inside each module by title
        Object.values(moduleMap).forEach((mod) => {
          const seen = new Set<string>();
          mod.lessons = mod.lessons.filter((lesson: Lesson) => {
            const uniqueKey = lesson.title.trim().toLowerCase();
            if (seen.has(uniqueKey)) return false;
            seen.add(uniqueKey);
            return true;
          });
        });

        const sorted = Object.values(moduleMap).sort((a, b) => a.order - b.order);
        setModules(sorted);

        let initialLesson: Lesson | null = null;
        if (selectedLessonSlug && selectedLessonSlug !== 'inicio') {
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

  // Load Super Clase notes & set language on lesson change
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

  // Auto-save Super Clase Code with debounce
  useEffect(() => {
    if (!selectedLesson || !superClaseActive || !selectedLesson.superclass_language) return;

    const timer = setTimeout(async () => {
      try {
        await saveLessonNote(courseId, selectedLesson.id, code);
      } catch (err) {
        console.error("Error auto-saving lesson note:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, selectedLesson, courseId, superClaseActive]);

  // Load Text Notes from localStorage on lesson change
  useEffect(() => {
    if (!selectedLesson) {
      setNotes("");
      return;
    }
    const saved = localStorage.getItem(`aula-notes-${courseId}-${selectedLesson.id}`);
    setNotes(saved || "");
  }, [selectedLesson, courseId]);

  // Auto-save Text Notes to localStorage with debounce
  useEffect(() => {
    if (!selectedLesson) return;
    setNotesSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem(`aula-notes-${courseId}-${selectedLesson.id}`, notes);
      setNotesSaving(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [notes, selectedLesson, courseId]);

  // Load AI Chat history for selected lesson
  useEffect(() => {
    async function loadChatHistory() {
      if (!selectedLesson) return;
      const savedChatId = localStorage.getItem(`aula-chat-${courseId}-${selectedLesson.id}`);
      if (savedChatId) {
        setChatLoading(true);
        try {
          const msgs = await getChatMessages(savedChatId);
          if (msgs && msgs.length > 0) {
            setChatMessages(msgs.map(m => {
              const text = (m.parts as any[])
                .filter((p: any) => p.type === "text")
                .map((p: any) => p.text)
                .join("");
              return {
                role: m.role as 'user' | 'assistant',
                text: text || ""
              };
            }));
          } else {
            setChatMessages([
              { role: 'assistant', text: '¡Hola! Soy tu asistente de estudio con IA. ¿Tienes alguna duda sobre la clase de hoy? Pregúntame sobre los conceptos explicados, código o ejercicios.' }
            ]);
          }
        } catch (err) {
          console.error("Error loading chat history:", err);
        } finally {
          setChatLoading(false);
        }
      } else {
        setChatMessages([
          { role: 'assistant', text: '¡Hola! Soy tu asistente de estudio con IA. ¿Tienes alguna duda sobre la clase de hoy? Pregúntame sobre los conceptos explicados, código o ejercicios.' }
        ]);
      }
    }
    loadChatHistory();
  }, [selectedLesson, courseId]);

  // Copy Share Link Function
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Chatbot Send Message Handler (connected to real /api/ai/chat streaming endpoint)
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedLesson) return;
    const userText = chatInput;
    
    // Add user message to state
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const savedChatId = localStorage.getItem(`aula-chat-${courseId}-${selectedLesson.id}`);
      
      // Inject context system message at the beginning of API payload
      const contextMessage = {
        id: "context-msg",
        role: "system" as const,
        content: `IMPORTANTE: El usuario está tomando el curso "${readableCourseName}" y se encuentra viendo la clase "${selectedLesson.title}". Responde a sus dudas sobre esta lección de forma clara, instructiva y adaptada a este contexto.`,
      };

      // Map to UIMessage structure for Vercel AI SDK
      const apiMessages = [
        contextMessage,
        ...updatedMessages.map((msg, index) => ({
          id: `msg-${index}`,
          role: msg.role,
          content: msg.text,
        }))
      ];

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          chatId: savedChatId || null,
          model: "llama-3-8b",
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la IA");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream");

      // Place a blank AI response message in the queue to update live
      setChatMessages(prev => [...prev, { role: 'assistant', text: "" }]);
      
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;

          // 0: Chunk of text streaming
          if (line.startsWith('0:')) {
            try {
              const textVal = JSON.parse(line.substring(2));
              aiText += textVal;
              setChatMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', text: aiText };
                return next;
              });
            } catch (err) {
              // fallback
            }
          }

          // 2: Metadata containing chatId
          if (line.startsWith('2:')) {
            try {
              const metadataList = JSON.parse(line.substring(2));
              const meta = Array.isArray(metadataList) ? metadataList[0] : metadataList;
              if (meta?.chatId) {
                localStorage.setItem(`aula-chat-${courseId}-${selectedLesson.id}`, meta.chatId);
              }
            } catch (err) {
              console.error("Error parsing stream metadata:", err);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Error chatting with AI:", err);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Lo siento, ocurrió un error al comunicarme con el asistente de IA. Inténtalo de nuevo." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Reset/Clear chat function
  const handleResetChat = () => {
    if (selectedLesson) {
      localStorage.removeItem(`aula-chat-${courseId}-${selectedLesson.id}`);
      setChatMessages([
        { role: 'assistant', text: '¡Hola! Soy tu asistente de estudio con IA. ¿Tienes alguna duda sobre la clase de hoy? Pregúntame sobre los conceptos explicados, código o ejercicios.' }
      ]);
    }
  };

  // Download Notes as text file
  const handleDownloadNotes = () => {
    if (!notes.trim()) return;
    const blob = new Blob([notes], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `apuntes-${slugify(selectedLesson?.title || 'clase')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Run Code logic for interactive editor
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
        setCodeOutput("Error de ejecución");
      }
    } catch (err: any) {
      setCodeOutput(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Toggle Complete check logic
  const toggleComplete = async (lessonId: string) => {
    const isCurrentlyCompleted = completedLessons.has(lessonId);
    const nextState = !isCurrentlyCompleted;

    // Update manually unchecked list
    if (nextState === false) {
      manuallyUncheckedRef.current.add(lessonId);
    } else {
      manuallyUncheckedRef.current.delete(lessonId);
    }

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
      // Revert state if database sync fails
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

  useEffect(() => {
    toggleCompleteRef.current = toggleComplete;
  }, [toggleComplete]);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    router.push(`/comunidad/cursos/${courseSlug}/${slugify(lesson.title)}`);
  };



  const selectedLessonGlobalIndex = selectedLesson ? modules.flatMap(m => m.lessons).findIndex(l => l.id === selectedLesson.id) : -1;
  const isSelectedLessonLocked = accessType === "trial" && selectedLessonGlobalIndex >= 2;

  const selectedModuleOrder = selectedLesson ? modules.find(m => m.lessons.includes(selectedLesson))?.order || "" : "";
  const readableCourseName = courseSlug ? courseSlug.replace(/-/g, ' ').toUpperCase() : "CURSO";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-900">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-medium">Cargando tu aula virtual...</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-900 p-6">
        <Layers className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay clases cargadas</h3>
        <p className="text-sm text-gray-500 max-w-sm text-center mb-6">El instructor se encuentra estructurando el temario del curso en este momento.</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg active:scale-98 transition-all hover:bg-blue-600">
          <ChevronLeft className="w-4 h-4" /> Volver a la comunidad
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white text-gray-900 font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        #video-container-wrapper iframe {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
      `}</style>

      {/* ─── BODY LAYOUT ─── */}
      <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden bg-white">

        {/* ─── LEFT PANE: Video / Tabs / Super Clase ─── */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative z-0">
          
          {/* Main workspace (depending on Super Clase Mode) */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            {!selectedLesson ? (
              /* ── COURSE HOME / LANDING VIEW (Inicio del Curso) ── */
              (() => {
                const totalMinutes = modules.flatMap(m => m.lessons).reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
                const formattedHours = Math.floor(totalMinutes / 60);
                const remainingMinutes = totalMinutes % 60;
                const timeString = formattedHours > 0 
                  ? `${formattedHours}h ${remainingMinutes}m` 
                  : `${totalMinutes} min`;

                const allResources = modules
                  .flatMap(m => m.lessons)
                  .filter(l => l.resources && Array.isArray(l.resources))
                  .flatMap(l => (l.resources || []).map((r: any) => ({ ...r, lessonTitle: l.title })));

                const CertificateCard = () => (
                  <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <h2 className="text-sm font-black text-gray-905 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-brand-blue" /> Certificado del Curso
                    </h2>
                    
                    {/* Certificate Mockup Preview */}
                    <div className="relative aspect-[1.41] bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between text-white overflow-hidden shadow-sm select-none mb-4">
                      {/* Subtle gold lines or circles decor */}
                      <div className="absolute inset-2 border border-amber-600/30 rounded-xl pointer-events-none" />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-[20px] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/5 rounded-full filter blur-[20px] pointer-events-none" />

                      <span className="text-[8px] text-amber-500 font-black tracking-widest uppercase mt-2">Certificado de Finalización</span>
                      
                      <div className="text-center my-auto">
                        <span className="text-[6px] text-slate-400 block font-semibold leading-none">Otorgado oficialmente a</span>
                        <span className="text-[9px] font-black text-white block mt-1 leading-none uppercase truncate max-w-[120px]">Tu Nombre</span>
                        <div className="w-10 h-px bg-amber-600/50 mx-auto my-1.5" />
                        <span className="text-[6px] text-slate-400 block leading-none">Por completar la especialización en</span>
                        <span className="text-[8px] font-bold text-amber-500/90 block mt-0.5 leading-tight truncate max-w-[140px]">{readableCourseName}</span>
                      </div>

                      <div className="w-full flex items-end justify-between px-2 pb-1 shrink-0">
                        <div className="text-left">
                          <span className="text-[4px] text-slate-500 block leading-none">Emisor</span>
                          <span className="text-[6px] font-bold text-white block leading-none mt-0.5">ProgramBI</span>
                        </div>
                        {/* Circular Gold Seal mockup */}
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center shadow-md">
                          <Sparkles className="w-2.5 h-2.5 text-amber-900 animate-none" />
                        </div>
                      </div>

                      {/* Lock Overlay if progress is < 100 */}
                      {progress < 100 && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center">
                          <Lock className="w-6 h-6 text-amber-500 mb-1.5" />
                          <span className="text-[9px] text-amber-500 font-black tracking-wider uppercase">{progress}% completado</span>
                          <span className="text-[7px] text-slate-400 mt-1">Sigue estudiando para desbloquearlo</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {progress === 100 ? (
                        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5">
                          <Download className="w-3.5 h-3.5" /> Descargar Certificado PDF
                        </button>
                      ) : (
                        <>
                          {/* Small progress indicator bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                              <span>Progreso</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-150/70 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-blue transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">
                            Al completar el 100% de las clases, se emitirá un certificado digital firmado con código QR de verificación.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );

                const InstructorCard = () => (
                  <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
                      Tu Instructor
                    </h2>
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-blue to-indigo-650 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-brand-blue/15">
                        MR
                      </div>
                      <div className="min-w-0">
                        <span className="block font-black text-gray-900 text-xs leading-none">Manuel Ropero</span>
                        <span className="block text-[9px] text-gray-400 font-extrabold mt-1 uppercase tracking-wider">Fundador & Mentor</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      Especialista en Business Intelligence, analítica avanzada de datos y desarrollo moderno. Apasionado por diseñar metodologías de enseñanza ágiles y proyectos aplicados al mercado profesional.
                    </p>
                  </div>
                );

                return (
                  <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
                    {/* Course Home Header Navigation */}
                    <header className="flex-none h-[64px] bg-white flex items-center justify-between px-6 border-b border-gray-100">
                      <div className="flex items-center gap-4 min-w-0">
                        <button
                          onClick={onBack}
                          className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all border-0 cursor-pointer"
                          title="Volver a los cursos"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center shrink-0">
                          <img
                            src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                            alt="ProgramBI Logo"
                            className="h-7 w-auto object-contain cursor-pointer"
                            onClick={onBack}
                          />
                        </div>
                        <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                        <span className="text-xs font-black text-brand-blue uppercase tracking-widest hidden sm:inline">
                          Inicio del Curso
                        </span>
                      </div>
                      
                      {/* Progress Badge */}
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-1.5 shadow-sm">
                        <div className="text-right leading-none hidden md:block">
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Progreso</span>
                          <span className="text-[11px] font-black text-gray-900 mt-0.5 block">{completedLessons.size} de {totalLessons} clases</span>
                        </div>
                        <div className="bg-brand-blue text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                          {progress}%
                        </div>
                      </div>
                    </header>

                    <div className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8">
                      {/* Banner / Hero Section */}
                      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg mb-8">
                        {/* Decorative glowing background shape */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/15 rounded-full filter blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-600/10 rounded-full filter blur-[60px] -ml-20 -mb-20 pointer-events-none" />
                        
                        <div className="relative z-10 max-w-2xl">
                          <span className="text-[10px] font-black tracking-widest uppercase text-brand-blue/90 bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
                            {readableCourseName}
                          </span>
                          <h1 className="text-2xl sm:text-3xl font-black mt-4 leading-tight">
                            Bienvenido a tu Aula de Aprendizaje
                          </h1>
                          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                            Aprende paso a paso con lecciones en video interactivas, material de descarga y cuestionarios prácticos de código. Consulta a tu tutor de IA en cualquier momento para guiar tu aprendizaje.
                          </p>
                          
                          <div className="flex flex-wrap gap-4 mt-6 items-center">
                            <button
                              onClick={() => {
                                const firstLesson = modules.length > 0 && modules[0].lessons.length > 0 ? modules[0].lessons[0] : null;
                                const next = modules.flatMap(m => m.lessons).find(l => !completedLessons.has(l.id)) || firstLesson;
                                if (next) handleSelectLesson(next);
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-brand-blue to-violet-650 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer border-0 text-xs sm:text-sm"
                            >
                              {completedLessons.size > 0 ? "Continuar Aprendiendo" : "Empezar Curso"}
                            </button>
                            
                            <div className="text-xs text-slate-400 font-bold">
                              {totalLessons} lecciones • {modules.length} módulos
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Premium Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {/* Stat 1: Completed Classes */}
                        <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none">Clases Vistas</span>
                            <span className="block text-base font-black text-gray-900 mt-1 leading-none">{completedLessons.size} / {totalLessons}</span>
                          </div>
                        </div>

                        {/* Stat 2: Estimated Duration */}
                        <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none">Duración Total</span>
                            <span className="block text-base font-black text-gray-900 mt-1 leading-none">{timeString}</span>
                          </div>
                        </div>

                        {/* Stat 3: Resources */}
                        <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none">Recursos</span>
                            <span className="block text-base font-black text-gray-900 mt-1 leading-none">{allResources.length} archivos</span>
                          </div>
                        </div>

                        {/* Stat 4: IA Mentor */}
                        <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-650 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 animate-none" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none">Estudio con IA</span>
                            <span className="block text-base font-black text-gray-900 mt-1 leading-none">Mentor Activo</span>
                          </div>
                        </div>
                      </div>

                      {/* Tabs Switcher for Course Home */}
                      <div className="flex border-b border-gray-150/70 mb-6">
                        <button
                          onClick={() => setHomeTab('syllabus')}
                          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all border-0 bg-transparent cursor-pointer ${
                            homeTab === 'syllabus'
                              ? 'border-brand-blue text-brand-blue'
                              : 'border-transparent text-gray-400 hover:text-gray-650'
                          }`}
                        >
                          Plan de Estudios
                        </button>
                        <button
                          onClick={() => setHomeTab('files')}
                          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all border-0 bg-transparent cursor-pointer flex items-center gap-1.5 ${
                            homeTab === 'files'
                              ? 'border-brand-blue text-brand-blue'
                              : 'border-transparent text-gray-400 hover:text-gray-650'
                          }`}
                        >
                          Recursos del Curso
                          {allResources.length > 0 && (
                            <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              {allResources.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setHomeTab('faq')}
                          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all border-0 bg-transparent cursor-pointer ${
                            homeTab === 'faq'
                              ? 'border-brand-blue text-brand-blue'
                              : 'border-transparent text-gray-400 hover:text-gray-650'
                          }`}
                        >
                          Mentoría y FAQs
                        </button>
                      </div>

                      {/* Course Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (curriculum & teachings) */}
                        <div className="lg:col-span-2 space-y-8">
                          
                          {homeTab === 'syllabus' && (
                            <>
                              {/* Teachings section */}
                              <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-brand-blue animate-none" /> Lo que aprenderás en este curso
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-600">
                                  {[
                                    "Dominio completo de los fundamentos prácticos del curso",
                                    "Metodologías ágiles de implementación y despliegue real",
                                    "Desarrollo lógico con herramientas de última generación",
                                    "Optimización de código y mejores prácticas de la industria",
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                      </div>
                                      <span className="leading-snug">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Content curriculum section */}
                              <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
                                  Plan de estudios completo
                                </h2>
                                <div className="space-y-4">
                                  {modules.map((mod) => (
                                    <div key={mod.name} className="border border-gray-150/70 rounded-2xl overflow-hidden">
                                      <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-150/70 flex items-center justify-between">
                                        <div className="text-left">
                                          <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block">Módulo {mod.order}</span>
                                          <h3 className="text-xs font-black text-gray-900 mt-0.5 leading-snug">{mod.name}</h3>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold">{mod.lessons.length} clases</span>
                                      </div>
                                      <div className="divide-y divide-gray-100/40 bg-white">
                                        {mod.lessons.map((lesson) => {
                                          const isCompleted = completedLessons.has(lesson.id);
                                          return (
                                            <div
                                              key={lesson.id}
                                              onClick={() => handleSelectLesson(lesson)}
                                              className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/40 cursor-pointer transition-colors text-xs text-gray-700"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white text-transparent'
                                                }`}>
                                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                                </div>
                                                <span className="font-medium">{lesson.lesson_order}. {lesson.title}</span>
                                              </div>
                                              <span className="text-[10px] text-gray-400 font-bold shrink-0">{lesson.duration_minutes || 0} min</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {homeTab === 'files' && (
                            <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-blue" /> Todos los recursos descargables
                              </h2>
                              {allResources.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 border border-dashed border-gray-250/80 rounded-2xl">
                                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                  <p className="text-[10px] leading-relaxed px-4">No se han subido archivos de recursos complementarios para este curso.</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {allResources.map((res: any, idx: number) => {
                                    const isExcel = res.name.endsWith('.xlsx') || res.name.endsWith('.xls') || res.name.endsWith('.csv');
                                    const isPdf = res.name.endsWith('.pdf');
                                    const isZip = res.name.endsWith('.zip') || res.name.endsWith('.rar');

                                    return (
                                      <a
                                        key={idx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start justify-between p-4 bg-gray-55 hover:bg-brand-blue/5 rounded-2xl border border-gray-150/70 hover:border-brand-blue/20 transition-all text-xs font-semibold text-gray-700 hover:text-brand-blue shadow-sm group text-left"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                            isExcel ? 'bg-emerald-50 text-emerald-600' :
                                            isPdf ? 'bg-rose-50 text-rose-600' :
                                            isZip ? 'bg-amber-50 text-amber-600' :
                                            'bg-blue-50 text-brand-blue'
                                          }`}>
                                            <FileText className="w-4 h-4" />
                                          </div>
                                          <div className="min-w-0">
                                            <span className="block truncate font-bold text-gray-800 group-hover:text-brand-blue leading-none">{res.name}</span>
                                            <span className="block text-[8px] text-gray-400 font-extrabold mt-1.5 truncate">Clase: {res.lessonTitle}</span>
                                          </div>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-405 group-hover:text-brand-blue shrink-0 ml-1.5 mt-2" />
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {homeTab === 'faq' && (
                            <div className="bg-white border border-gray-150/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-brand-blue" /> Preguntas Frecuentes y Soporte
                              </h2>
                              <div className="space-y-4">
                                {[
                                  {
                                    q: "¿Cómo interactúo con mi tutor de IA?",
                                    a: "En la barra lateral derecha de cualquier clase, dispones de una pestaña de Asistente de IA. Este asistente tiene el contexto en tiempo real del curso y la clase que estás viendo, por lo que responderá tus dudas de forma 100% personalizada."
                                  },
                                  {
                                    q: "¿Cuándo se desbloquea el certificado?",
                                    a: "El certificado de finalización oficial con validez internacional de ProgramBI se emitirá en formato PDF de manera automática tan pronto como completes el 100% de las clases del temario."
                                  },
                                  {
                                    q: "¿Cómo descargo los archivos y recursos?",
                                    a: "Cada lección cuenta con una pestaña opcional llamada 'Archivos' con sus archivos adjuntos. Si prefieres verlos todos juntos, puedes ir a la pestaña 'Recursos del Curso' aquí mismo en el Inicio del curso."
                                  },
                                  {
                                    q: "¿Tengo soporte para resolver ejercicios de programación?",
                                    a: "¡Claro! En las lecciones habilitadas como Super Clases cuentas con un playground Monaco integrado a tu izquierda para correr código. Si tu código falla, puedes pegarlo en el Asistente de IA de la clase y te guiará paso a paso."
                                  }
                                ].map((faq, idx) => (
                                  <div key={idx} className="p-4 bg-gray-50/50 border border-gray-150/70 rounded-2xl">
                                    <h4 className="text-xs font-black text-gray-950 leading-snug flex items-start gap-2">
                                      <HelpCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                                      {faq.q}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed pl-6">
                                      {faq.a}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column Widgets */}
                        <div className="space-y-6">
                          <CertificateCard />
                          <InstructorCard />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : superClaseActive && selectedLesson.superclass_language ? (
              
              /* ── SUPER CLASE WORKSTATION MODE (Side by Side Coding) ── */
              <div className="flex h-full w-full">
                
                {/* Monaco Editor Workspace */}
                <div className="flex-1 flex flex-col h-full bg-slate-900 border-r border-slate-800">
                  <div className="flex-none h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-violet-400" />
                      <span className="text-white font-bold text-xs">Playground Interactivo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-800 text-white text-[11px] border border-slate-700 rounded-lg px-2 py-1 outline-none font-bold cursor-pointer hover:border-slate-650"
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
                  
                  {/* Console output */}
                  <div className="flex-none h-48 bg-slate-955 border-t border-slate-800 flex flex-col">
                    <div className="flex-none h-8 bg-slate-900 flex items-center px-4 border-b border-slate-800">
                      <Terminal className="w-3.5 h-3.5 text-slate-500 mr-2" />
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Resultado Consola</span>
                    </div>
                    <div
                      className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed"
                      style={{ color: (codeOutput.includes("Error") || codeOutput.includes("Traceback")) ? "#f87171" : "#a5b4fc" }}
                    >
                      {codeOutput ? (
                        <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                      ) : (
                        <span className="text-slate-600">Haz clic en Ejecutar para correr el script...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video PiP (Picture in Picture Container) */}
                <div className="flex-none w-[380px] bg-white border-l border-gray-200 flex flex-col h-full">
                  <div className="relative w-full aspect-video bg-black shrink-0 border-b border-gray-200">
                    {videoId ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <p className="text-xs text-gray-500">Video no disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold bg-violet-50 text-violet-600 px-2 py-0.5 rounded border border-violet-100 uppercase tracking-wide">
                        Modo Coding
                      </span>
                      <button
                        onClick={() => setSuperClaseActive(false)}
                        className="text-xs font-bold text-brand-blue hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Salir de Playground
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
                        {selectedLesson.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Lee los enunciados de la clase, escribe tus rutinas de código en el panel izquierdo y ejecuta. Tu progreso en código se sincroniza automáticamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              
              /* ── UDEMY-LIKE VIEW: Big Video + Tabs Below (Light Theme) ── */
              <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
                
                {/* ─── LESSON HEADER ─── */}
                <header className="flex-none h-[64px] bg-white flex items-center justify-between px-6 border-b border-gray-100">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Logo ProgramBI */}
                    <div className="flex items-center shrink-0">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                        alt="ProgramBI Logo"
                        className="h-7 w-auto object-contain cursor-pointer"
                        onClick={onBack}
                        title="Volver a los cursos"
                      />
                    </div>

                    <div className="h-6 w-px bg-gray-200" />

                    {/* Back Button */}
                    <button
                      onClick={onBack}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-650 hover:text-gray-900 transition-all cursor-pointer border-0 shrink-0"
                      title="Volver a los cursos"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    
                    {/* Clickable Course Info */}
                    <div
                      onClick={() => router.push(`/comunidad/cursos/${courseSlug}`)}
                      className="min-w-0 cursor-pointer group select-none"
                      title="Ir al inicio del curso"
                    >
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block leading-none mb-1 group-hover:text-brand-blue group-hover:underline transition-all">
                        {readableCourseName}
                      </span>
                      <h1 className="text-sm md:text-base font-black text-gray-900 leading-none line-clamp-1 group-hover:text-brand-blue transition-all">
                        {selectedLesson?.title || "Aula Virtual"}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-none">
                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                        copiedShare 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-55 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{copiedShare ? "¡Copiado!" : "Compartir"}</span>
                    </button>

                    {/* Tu Progreso Premium Pill */}
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-1.5 shadow-sm">
                      <div className="hidden md:block text-right leading-none">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Progreso</span>
                        <span className="text-[11px] font-black text-gray-900 mt-0.5 block">{completedLessons.size} de {totalLessons} clases</span>
                      </div>
                      
                      {/* Progress Bar container */}
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-brand-blue transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="bg-brand-blue text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                        {progress}%
                      </div>
                    </div>

                    {/* Toggle Sidebar Icon (Hamburger-like) */}
                    {!sidebarOpen && (
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-650 hover:text-gray-900 transition-all cursor-pointer border-0 ml-2"
                        title="Mostrar contenido"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </header>
                
                {/* Cinema Screen Frame for Video */}
                <div className="flex-none w-full bg-white flex justify-center items-center py-2 px-6">
                  <div className="relative w-full max-w-[1120px] aspect-video bg-slate-900 rounded-lg overflow-hidden">
                    {isSelectedLessonLocked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-955 to-slate-900 overflow-hidden">
                        <Lock className="w-12 h-12 text-blue-500 mb-3 animate-bounce" />
                        <h2 className="text-xl font-bold text-white mb-1.5 text-center px-4">Clase Bloqueada (Periodo de Prueba)</h2>
                        <p className="text-slate-400 text-xs max-w-sm text-center mb-5 leading-relaxed px-4">
                          Estás en los 7 días de prueba. Para desbloquear todas las clases adicionales, puedes contratar el plan premium de la plataforma ahora.
                        </p>
                        <button
                          onClick={() => window.location.href = `/api/mercadopago/upgrade-trial`}
                          className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer border-0"
                        >
                          <Sparkles className="w-4 h-4" /> Desbloquear Curso Completo
                        </button>
                      </div>
                    ) : videoId ? (
                      <div id="video-container-wrapper" ref={videoContainerRef} className="absolute inset-0 w-full h-full bg-slate-900" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 gap-2">
                        <Play className="w-12 h-12 text-slate-800" />
                        <p className="text-slate-600 text-xs font-medium">Video no disponible en este momento</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details & Interactive Tabs (Udemy Style - Light Theme) */}
                <div className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-6 bg-white">
                  
                  {/* Tabs Navbar */}
                  <div className="flex items-center gap-6 mb-6 overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'overview', label: 'Descripción general', icon: FileText },
                      { id: 'notes', label: 'Mis apuntes', icon: StickyNote },
                      { id: 'faq', label: 'Preguntas frecuentes', icon: HelpCircle },
                      ...(selectedLesson?.resources && Array.isArray(selectedLesson.resources) && selectedLesson.resources.length > 0
                        ? [{ id: 'resources', label: 'Archivos', icon: Download }]
                        : [])
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-1.5 pb-3.5 text-sm font-semibold transition-all relative border-0 bg-transparent cursor-pointer whitespace-nowrap ${
                            isActive ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                          {isActive && (
                            <motion.div
                              layoutId="activeWorkspaceTab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tabs Workspace content */}
                  <div className="text-left min-h-[300px]">
                    
                    {/* Tab 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-blue-50 text-brand-blue uppercase tracking-wider border border-blue-100">
                                Módulo {selectedModuleOrder} • Clase {selectedLesson.lesson_order}
                              </span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wider flex items-center gap-1 border border-gray-200">
                                <Clock className="w-2.5 h-2.5" /> {selectedLesson.duration_minutes} min
                              </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight animate-none">
                              {selectedLesson.title}
                            </h2>
                          </div>
                          
                          {/* Super Clase Button inside Tab */}
                          {selectedLesson.superclass_language && (
                            <button
                              onClick={() => setSuperClaseActive(true)}
                              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/15 cursor-pointer border-0 active:scale-98 transition-all"
                            >
                              <Sparkles className="w-4 h-4" /> Activar Super Clase ({selectedLesson.superclass_language.toUpperCase()})
                            </button>
                          )}
                        </div>

                        {/* Udemy ratings & statistics overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                          <div className="text-left">
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Calificación</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-base font-black text-gray-900">4.8</span>
                              <div className="flex text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500 stroke-none" />)}
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Estudiantes</span>
                            <span className="text-base font-black text-gray-900 mt-1 block">15k+ en el curso</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Duración Total</span>
                            <span className="text-base font-black text-gray-900 mt-1 block">{totalLessons} clases</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Acceso</span>
                            <span className="text-base font-black text-emerald-600 mt-1 block uppercase">Premium</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-gray-900 mb-2">Acerca de esta lección</h3>
                          <p className="text-sm text-gray-650 leading-relaxed font-medium">
                            En esta clase aprenderás los pilares prácticos fundamentales para el desarrollo de tus habilidades. Pon a prueba los conceptos estudiados en el video, toma apuntes clave y completa el cuestionario o práctica correspondiente en el Playground interactivo.
                          </p>
                        </div>

                        {/* Instructor Profile Card */}
                        <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Instructor</span>
                            <span className="text-sm font-bold text-gray-900">ProgramBI Team</span>
                            <span className="text-xs text-gray-500 block mt-0.5">Especialistas en Business Intelligence y Analítica de Datos</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 2: NOTES (Personal Notepad) */}
                    {activeTab === 'notes' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <div>
                            <h3 className="font-bold text-sm text-gray-900">Mis notas personales</h3>
                            <p className="text-xs text-gray-500">Tus apuntes se guardan automáticamente en tu navegador.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleDownloadNotes}
                              disabled={!notes.trim()}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-0 cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1.5 text-xs font-bold"
                              title="Descargar apuntes como archivo .txt"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Descargar
                            </button>
                            <button
                              onClick={() => { if (confirm("¿Seguro que deseas eliminar tus apuntes de esta clase?")) setNotes(""); }}
                              disabled={!notes.trim()}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 border-0 cursor-pointer disabled:opacity-40 transition-colors"
                              title="Limpiar apuntes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Escribe aquí tus ideas, notas clave, apuntes o códigos de esta clase para tenerlos siempre a mano..."
                            className="w-full min-h-[160px] bg-white border border-gray-250 rounded-xl p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue/20 focus:border-brand-blue/30 leading-relaxed shadow-sm"
                          />
                          <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-bold">
                            {notesSaving ? (
                              <span className="flex items-center gap-1 text-brand-blue"><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</span>
                            ) : notes ? (
                              <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Auto-guardado</span>
                            ) : (
                              "Vacío"
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 3: FAQ (Frequently Asked Questions) */}
                    {activeTab === 'faq' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">Preguntas frecuentes del curso</h3>
                        <div className="space-y-3">
                          {[
                            { q: "¿Cómo descargo los archivos y recursos del curso?", a: "Puedes encontrar los recursos descargables en la pestaña general de cada módulo o solicitarlos directamente al Asistente de IA en el panel lateral." },
                            { q: "¿Tengo acceso ilimitado a las clases y Playground?", a: "Sí, todos los usuarios suscritos en planes premium tienen acceso total a todos los videos y herramientas de ejecución de código sin restricciones." },
                            { q: "¿Qué hago si mi código en el Playground arroja error?", a: "Asegúrate de que estás usando el lenguaje adecuado en la pestaña superior (por ejemplo, Python para sintaxis de Python) y lee el mensaje que arroja la Consola de Salida." }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/80">
                              <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                                {item.q}
                              </h4>
                              <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium pl-5">
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 4: RESOURCES (Class resource files) */}
                    {activeTab === 'resources' && selectedLesson && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">Archivos y Recursos descargables</h3>
                        <p className="text-xs text-gray-500">Haz clic en los enlaces a continuación para descargar el material complementario para esta clase.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {selectedLesson.resources && Array.isArray(selectedLesson.resources) && selectedLesson.resources.map((res: any, idx: number) => {
                            const isExcel = res.name.endsWith('.xlsx') || res.name.endsWith('.xls') || res.name.endsWith('.csv');
                            const isPdf = res.name.endsWith('.pdf');
                            const isZip = res.name.endsWith('.zip') || res.name.endsWith('.rar');
                            
                            return (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 bg-gray-50/60 hover:bg-brand-blue/5 rounded-xl border border-gray-200/80 hover:border-brand-blue/30 transition-all text-xs font-semibold text-gray-700 hover:text-brand-blue shadow-sm group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isExcel ? 'bg-emerald-50 text-emerald-600' :
                                    isPdf ? 'bg-rose-50 text-rose-600' :
                                    isZip ? 'bg-amber-50 text-amber-600' :
                                    'bg-blue-50 text-brand-blue'
                                  }`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <span className="block truncate font-bold text-gray-800 group-hover:text-brand-blue">{res.name}</span>
                                    <span className="block text-[10px] text-gray-400 font-bold mt-0.5">{res.size ? `${(res.size / 1024 / 1024).toFixed(2)} MB` : "Recurso"}</span>
                                  </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-blue shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANE: Collapsible Sidebar (Udemy Style - Light Theme) ─── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-none h-full border-l border-gray-200 flex flex-col bg-white overflow-hidden relative z-10"
            >
              {/* Sidebar Header & Tabs */}
              <div className="flex-none border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'content', label: 'Contenido del curso' },
                      { id: 'ai', label: 'Asistente IA', sparkles: true },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSidebarTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                          sidebarTab === tab.id
                            ? 'bg-gray-150 text-gray-900'
                            : 'bg-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.sparkles && <Sparkles className="w-3 h-3 inline mr-1 text-violet-650" />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {sidebarTab === 'ai' && (
                      <button
                        onClick={handleResetChat}
                        className="p-1.5 hover:bg-gray-105 rounded-lg transition-colors border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-900"
                        title="Nueva conversación"
                      >
                        <MessageSquarePlus className="w-4 h-4 text-brand-blue" />
                      </button>
                    )}
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Workspace Area */}
              <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
                
                {/* Mode A: COURSE CONTENT */}
                {sidebarTab === 'content' && (
                  <div className="divide-y divide-gray-100">
                    {modules.map((mod) => (
                      <div key={mod.name} className="bg-transparent">
                        <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100">
                          <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block">
                            Módulo {mod.order}
                          </span>
                          <h4 className="text-xs font-extrabold text-gray-950 mt-0.5 leading-snug">{mod.name}</h4>
                        </div>
                        <div className="divide-y divide-gray-100/40">
                          {mod.lessons.map((lesson) => {
                            const isSelected = selectedLesson?.id === lesson.id;
                            const isCompleted = completedLessons.has(lesson.id);
                            const globalIndex = modules.flatMap(m => m.lessons).findIndex(l => l.id === lesson.id);
                            const isLocked = accessType === "trial" && globalIndex >= 2;
                            const hasSuperClase = !!lesson.superclass_language;

                            return (
                              <div
                                key={lesson.id}
                                className={`w-full flex items-start gap-3.5 px-5 py-4 transition-all group relative border-l-4 ${
                                  isSelected 
                                    ? 'bg-blue-50/70 border-brand-blue' 
                                    : 'border-transparent hover:bg-gray-50/60'
                                }`}
                              >
                                {/* Checkbox / Lock Selector (Left) */}
                                <div className="flex-none mt-0.5">
                                  {isLocked ? (
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 bg-gray-50 border border-gray-200">
                                      <Lock className="w-2.5 h-2.5" />
                                    </div>
                                  ) : isSelected && !isCompleted ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-brand-blue bg-blue-50 text-brand-blue shadow-sm animate-pulse"
                                    >
                                      <Play className="w-2 h-2 text-brand-blue fill-brand-blue" />
                                    </button>
                                  ) : isCompleted ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                                    >
                                      <Check className="w-3 h-3 stroke-[3px]" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-gray-300 hover:border-brand-blue text-transparent bg-white hover:bg-gray-50 shadow-sm"
                                    >
                                      <Check className="w-3 h-3 stroke-[3px]" />
                                    </button>
                                  )}
                                </div>

                                {/* Text & Duration Details (Clickable row area) */}
                                <div 
                                  onClick={() => !isLocked && handleSelectLesson(lesson)}
                                  className="flex-1 min-w-0 cursor-pointer"
                                >
                                  <h5 className={`text-[12px] leading-snug font-medium line-clamp-2 transition-colors ${
                                    isSelected ? 'text-gray-950 font-bold' : 'text-gray-700 group-hover:text-gray-950'
                                  }`}>
                                    {lesson.lesson_order}. {lesson.title}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 leading-none">
                                      <Clock className="w-2.5 h-2.5" />
                                      {lesson.duration_minutes || 0} min
                                    </span>
                                    {hasSuperClase && (
                                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-violet-50 text-violet-650 uppercase tracking-wide border border-violet-100">
                                        Super Clase
                                      </span>
                                    )}
                                    {lesson.is_free_preview && (
                                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase tracking-wide border border-emerald-100">
                                        Gratis
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode B: AI ASSISTANT CHAT */}
                {sidebarTab === 'ai' && (
                  <div className="flex flex-col h-full bg-white">
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 no-scrollbar">
                      {chatMessages.length === 1 && (
                        <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-100/50 p-4 rounded-2xl text-center shadow-sm mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-brand-blue/10 animate-none">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-black text-gray-900 leading-snug">Mentor IA de ProgramBI</h4>
                          <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                            Pregúntame sobre los conceptos explicados en el video, ayuda con ejercicios prácticos o aclaraciones sobre el código de esta clase.
                          </p>
                        </div>
                      )}

                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-2.5 max-w-[85%] ${
                            msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                            msg.role === 'user' ? 'bg-brand-blue text-white shadow-sm' : 'bg-gradient-to-tr from-brand-blue to-violet-650 text-white shadow-sm'
                          }`}>
                            {msg.role === 'user' ? 'Tú' : 'IA'}
                          </div>
                          <div className={`p-3 rounded-2xl text-[12px] leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-brand-blue text-white rounded-tr-none shadow-md shadow-brand-blue/10 font-medium'
                              : 'bg-white text-gray-850 rounded-tl-none border border-gray-150/80 shadow-sm'
                          }`}>
                            {msg.role === 'user' ? (
                              msg.text
                            ) : (
                              <MarkdownRenderer content={msg.text} />
                            )}
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex gap-2.5 mr-auto max-w-[85%] animate-pulse">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-blue to-violet-650 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">IA</div>
                          <div className="p-3 bg-white text-gray-500 rounded-2xl rounded-tl-none text-[12px] flex items-center gap-1.5 border border-gray-200/80 shadow-sm leading-relaxed">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue shrink-0" /> Analizando...
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex-none p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                        placeholder="Pregúntale al Asistente..."
                        className="flex-1 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-inner"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        className="w-8 h-8 rounded-xl bg-gradient-to-r from-brand-blue to-violet-650 hover:opacity-95 text-white flex items-center justify-center cursor-pointer border-0 shrink-0 transition-all shadow-md shadow-brand-blue/10"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
