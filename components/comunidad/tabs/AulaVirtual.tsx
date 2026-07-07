"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Play, Code, CheckCircle, Terminal, PlayCircle, Loader2,
  ChevronLeft, Lock, Sparkles, X, Layers,
  Share2, Star, HelpCircle, StickyNote, Download, Trash2, Send,
  Check, BookOpen, Clock, FileText, MessageSquarePlus
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseLessons, toggleLessonProgress, getLessonNote, saveLessonNote } from "@/lib/supabase/comunidad-ai";
import { getChatMessages } from "@/lib/supabase/ai";
import { MarkdownRenderer } from "@/components/comunidad/ai-v2/MarkdownRenderer";
import { cn } from "@/lib/utils";

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
  resources?: { name: string; url: string; size?: number }[];
}

interface Module {
  name: string;
  order: number;
  lessons: Lesson[];
}

interface ExtendedWindow extends Window {
  YT?: {
    Player: new (id: string, options: Record<string, unknown>) => {
      getDuration: () => number;
      getCurrentTime: () => number;
      destroy: () => void;
    };
  };
}

interface AulaVirtualProps {
  courseId: string;
  onBack: () => void;
  onUpgradeClick?: () => void;
  interfaceLanguage?: 'es' | 'en';
}

const ta = {
  es: {
    backToCourses: "Volver a los cursos",
    courseHome: "Inicio del Curso",
    progress: "Progreso",
    completedOf: "clases completadas",
    welcome: "Bienvenido a tu Aula de Aprendizaje",
    welcomeDesc: "Aprende paso a paso con lecciones en video interactivas, material de descarga y cuestionarios prácticos de código. Consulta a tu tutor de IA en cualquier momento para guiar tu aprendizaje.",
    continueLearning: "Continuar Aprendiendo",
    startCourse: "Empezar Curso",
    lessonsCount: "lecciones",
    modulesCount: "módulos",
    classesViewed: "Clases Vistas",
    totalDuration: "Duración Total",
    resources: "Recursos del Curso",
    aiStudy: "Estudio con IA",
    activeMentor: "Mentor Activo",
    syllabus: "Plan de Estudios",
    courseResources: "Recursos",
    mentorshipFaq: "Mentoría y FAQs",
    whatYouWillLearn: "Lo que aprenderás en este curso",
    syllabusFull: "Plan de estudios completo",
    noResources: "No se han subido archivos de recursos complementarios para este curso.",
    downloadResource: "Descargar",
    downloadNotes: "Descargar",
    notesPlaceholder: "Escribe aquí tus ideas, notas clave, apuntes o códigos de esta clase para tenerlos siempre a mano...",
    autoSaved: "Auto-guardado",
    saving: "Guardando...",
    emptyNotes: "Vacío",
    faqTitle: "Preguntas frecuentes del curso",
    playgroundTitle: "Playground Interactivo",
    execute: "Ejecutar",
    executing: "Ejecutando...",
    consoleResult: "Resultado Consola",
    consolePrompt: "Haz clic en Ejecutar para correr el script...",
    codingMode: "Modo Coding",
    exitPlayground: "Salir de Playground",
    codingDesc: "Lee los enunciados de la clase, escribe tus rutinas de código en el panel izquierdo y ejecuta. Tu progreso en código se sincroniza automáticamente.",
    courseContent: "Contenido del curso",
    aiAssistant: "Asistente IA",
    newConversation: "Nueva conversación",
    aiPrompt: "Pregúntale al Asistente...",
    analyzing: "Analizando...",
    courseLocked: "Clase Bloqueada (Periodo de Prueba)",
    lockedDesc: "Estás en los 7 días de prueba. Para desbloquear todas las clases adicionales, puedes contratar el plan premium de la plataforma ahora.",
    unlockCourse: "Desbloquear Curso Completo",
    videoNotAvail: "Video no disponible en este momento",
    overviewTab: "Descripción general",
    notesTab: "Mis apuntes",
    faqTab: "Preguntas frecuentes",
    filesTab: "Archivos",
    aboutLesson: "Acerca de esta lección",
    aboutLessonDesc: "En esta clase aprenderás los pilares prácticos fundamentales para el desarrollo de tus habilidades. Pon a prueba los conceptos estudiados en el video, toma apuntes clave y completa el cuestionario o práctica correspondiente en el Playground interactivo.",
    rating: "Calificación",
    students: "Estudiantes",
    duration: "Duración",
    access: "Acceso",
    instructor: "Instructor",
    personalNotes: "Mis notas personales",
    notesSavedLocal: "Tus apuntes se guardan automáticamente en tu navegador.",
    lessonsDuration: "min",
    activeLabel: "Activo",
    prepLabel: "En preparación",
    lockedLabel: "Bloqueado",
    superClaseBtn: "Activar Super Clase",
    tutorIntro: "¡Hola! Soy tu asistente de estudio con IA. ¿Tienes alguna duda sobre la clase de hoy? Pregúntame sobre los conceptos explicados, código o ejercicios."
  },
  en: {
    backToCourses: "Back to courses",
    courseHome: "Course Home",
    progress: "Progress",
    completedOf: "classes completed",
    welcome: "Welcome to your Learning Space",
    welcomeDesc: "Learn step-by-step with interactive video lessons, downloadable resources, and coding playgrounds. Ask your AI Mentor anytime to guide your learning journey.",
    continueLearning: "Continue Learning",
    startCourse: "Start Course",
    lessonsCount: "lessons",
    modulesCount: "modules",
    classesViewed: "Viewed Lessons",
    totalDuration: "Total Duration",
    resources: "Course Resources",
    aiStudy: "AI Study Mentor",
    activeMentor: "Mentor Active",
    syllabus: "Syllabus",
    courseResources: "Resources",
    mentorshipFaq: "Mentorship & FAQs",
    whatYouWillLearn: "What you will learn in this course",
    syllabusFull: "Full study plan",
    noResources: "No downloadable resources have been uploaded for this course yet.",
    downloadResource: "Download",
    downloadNotes: "Download",
    notesPlaceholder: "Write down your ideas, key points, notes or code snippets for this class to keep them handy...",
    autoSaved: "Auto-saved",
    saving: "Saving...",
    emptyNotes: "Empty",
    faqTitle: "Course Frequently Asked Questions",
    playgroundTitle: "Interactive Playground",
    execute: "Execute",
    executing: "Running...",
    consoleResult: "Console Output",
    consolePrompt: "Click Execute to run the script...",
    codingMode: "Coding Mode",
    exitPlayground: "Exit Playground",
    codingDesc: "Read the instructions, write your code in the left panel, and click run. Your coding progress is synced automatically.",
    courseContent: "Course content",
    aiAssistant: "AI Assistant",
    newConversation: "New conversation",
    aiPrompt: "Ask the Assistant...",
    analyzing: "Analyzing...",
    courseLocked: "Lesson Locked (Free Trial)",
    lockedDesc: "You are currently in the 7-day trial period. To unlock all lessons and materials, upgrade to a premium plan today.",
    unlockCourse: "Unlock Full Course",
    videoNotAvail: "Video not available at the moment",
    overviewTab: "Overview",
    notesTab: "My notes",
    faqTab: "FAQs",
    filesTab: "Files",
    aboutLesson: "About this lesson",
    aboutLessonDesc: "In this class, you will learn the core practical skills to develop your programming capability. Test the concepts from the video, take key notes, and practice writing code in the interactive Playground.",
    rating: "Rating",
    students: "Students",
    duration: "Duration",
    access: "Access",
    instructor: "Instructor",
    personalNotes: "My personal notes",
    notesSavedLocal: "Your notes are saved automatically in your browser storage.",
    lessonsDuration: "min",
    activeLabel: "Active",
    prepLabel: "Preparing",
    lockedLabel: "Locked",
    superClaseBtn: "Activate Super Class",
    tutorIntro: "Hello! I am your AI study mentor. Do you have any questions about today's class? Ask me about the concepts explained, code snippets, or exercises."
  }
};

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

export default function AulaVirtual({ courseId, onBack, onUpgradeClick, interfaceLanguage }: AulaVirtualProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseSlug = segments[2];
  const selectedLessonSlug = segments[3] || null;
  
  const activeLanguage = interfaceLanguage || "es";
  const t = ta[activeLanguage];

  // Course & Navigation States
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tabs States
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'faq' | 'resources'>('overview');
  const [sidebarTab, setSidebarTab] = useState<'content' | 'ai'>('content');

  // Text Notes States
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  // Interactive AI Assistant States
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Share Copy Link State
  const [copiedShare, setCopiedShare] = useState(false);

  // Super Clase states
  const [superClaseActive, setSuperClaseActive] = useState(false);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [homeTab, setHomeTab] = useState<'syllabus' | 'files' | 'faq'>('syllabus');
  
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
  const videoId = selectedLesson ? extractYouTubeId(selectedLesson.video_url) : null;

  // YouTube player tracking refs & state
  const playerRef = useRef<unknown>(null);
  const completedLessonsRef = useRef(completedLessons);
  const toggleCompleteRef = useRef<((id: string) => Promise<void>) | null>(null);
  const manuallyUncheckedRef = useRef<Set<string>>(new Set());

  // Setup initial tutor message when component loads
  useEffect(() => {
    setChatMessages([
      { role: 'assistant', text: t.tutorIntro }
    ]);
  }, [t.tutorIntro]);

  // Sync ref with completedLessons state
  useEffect(() => {
    completedLessonsRef.current = completedLessons;
  }, [completedLessons]);

  // YouTube Player tracking and auto-complete logic at 70% watch time
  useEffect(() => {
    if (!videoId || !selectedLesson) return;

    const lessonId = selectedLesson.id;

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let player: { getDuration: () => number; getCurrentTime: () => number; destroy: () => void } | null = null;
    let progressInterval: NodeJS.Timeout | null = null;

    const initPlayer = () => {
      const iframe = document.getElementById('youtube-player-target');
      if (!iframe) return;

      const YTClass = (window as unknown as ExtendedWindow).YT;
      if (!YTClass) return;

      player = new YTClass.Player('youtube-player-target', {
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === 1) { // YT.PlayerState.PLAYING
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

    const checkInterval = setInterval(() => {
      const YTClass = (window as unknown as ExtendedWindow).YT;
      if (YTClass && YTClass.Player) {
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
          (playerRef.current as { destroy: () => void }).destroy();
        } catch {
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
        (lessons as Lesson[]).forEach((l) => {
          if (!moduleMap[l.module_name]) {
            moduleMap[l.module_name] = { name: l.module_name, order: l.module_order, lessons: [] };
          }
          moduleMap[l.module_name].lessons.push(l);
        });

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
              const parts = (m.parts || []) as { type: string; text?: string }[];
              const text = parts
                .filter((p) => p.type === "text")
                .map((p) => p.text || "")
                .join("");
              return {
                role: m.role as 'user' | 'assistant',
                text: text || ""
              };
            }));
          } else {
            setChatMessages([
              { role: 'assistant', text: t.tutorIntro }
            ]);
          }
        } catch (err) {
          console.error("Error loading chat history:", err);
        } finally {
          setChatLoading(false);
        }
      } else {
        setChatMessages([
          { role: 'assistant', text: t.tutorIntro }
        ]);
      }
    }
    loadChatHistory();
  }, [selectedLesson, courseId, t.tutorIntro]);

  // Copy Share Link Function
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Chatbot Send Message Handler
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedLesson) return;
    const userText = chatInput;
    
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const savedChatId = localStorage.getItem(`aula-chat-${courseId}-${selectedLesson.id}`);
      
      const contextMessage = {
        id: "context-msg",
        role: "system" as const,
        content: `IMPORTANTE: El usuario está tomando el curso "${readableCourseName}" y se encuentra viendo la clase "${selectedLesson.title}". Responde a sus dudas sobre esta lección de forma clara, instructiva y adaptada a este contexto.`,
      };

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

      setChatMessages(prev => [...prev, { role: 'assistant', text: "" }]);
      
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('0:')) {
            try {
              const textVal = JSON.parse(line.substring(2));
              aiText += textVal;
              setChatMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', text: aiText };
                return next;
              });
            } catch {
              // fallback
            }
          }

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
    } catch (err) {
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
        { role: 'assistant', text: t.tutorIntro }
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
      if (result.run) {
        setCodeOutput(result.run.output || result.compile?.output || "Ejecutado sin salida.");
      } else {
        setCodeOutput("Error de ejecución");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setCodeOutput(`Error: ${message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Toggle Complete check logic
  const toggleComplete = useCallback(async (lessonId: string) => {
    const isCurrentlyCompleted = completedLessons.has(lessonId);
    const nextState = !isCurrentlyCompleted;

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
  }, [completedLessons, courseId]);

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
      <div className="flex flex-col w-full h-screen overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans">
        <div className="flex-none h-[64px] bg-white dark:bg-black flex items-center justify-between px-6 border-b border-neutral-200/60 dark:border-neutral-800/80 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-900" />
            <div className="w-24 h-6 bg-neutral-150 dark:bg-neutral-800 rounded-lg" />
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
            <div className="w-32 h-4 bg-neutral-100 dark:bg-neutral-900 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-8 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
            <div className="w-12 h-6 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
          </div>
        </div>

        <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden">
          <div className="flex-1 flex flex-col h-full p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="w-full aspect-video bg-neutral-150 dark:bg-neutral-900 rounded-2xl" />
            <div className="space-y-3">
              <div className="w-2/3 h-6 bg-neutral-100 dark:bg-neutral-900 rounded" />
              <div className="w-full h-4 bg-neutral-50 dark:bg-neutral-950 rounded" />
              <div className="w-5/6 h-4 bg-neutral-50 dark:bg-neutral-955 rounded" />
            </div>
          </div>

          <div className="flex-none w-[340px] bg-white dark:bg-black border-l border-neutral-200/60 dark:border-neutral-800/80 hidden lg:flex flex-col h-full p-4 space-y-4">
            <div className="w-full h-10 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
            <div className="flex-1 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 border border-neutral-100 dark:border-neutral-900 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-900 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-5/6 h-3 bg-neutral-100 dark:bg-neutral-900 rounded" />
                    <div className="w-1/2 h-2.5 bg-neutral-100 dark:bg-neutral-900 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 p-6 select-none">
        <Layers className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Aún no hay clases cargadas</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm text-center mb-6 leading-relaxed">El instructor se encuentra estructurando el temario del curso en este momento.</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border-0 shadow-sm transition-all cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> {t.backToCourses}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans">
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
      <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden bg-white dark:bg-black">

        {/* ─── LEFT PANE: Video / Tabs / Super Clase ─── */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative z-0">
          
          <div className="flex-1 min-h-0 overflow-hidden relative">
            {!selectedLesson ? (
              /* ── COURSE HOME / LANDING VIEW ── */
              (() => {
                const totalMinutes = modules.flatMap(m => m.lessons).reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
                const formattedHours = Math.floor(totalMinutes / 60);
                const remainingMinutes = totalMinutes % 60;
                const timeString = formattedHours > 0 
                  ? `${formattedHours}h ${remainingMinutes}m` 
                  : `${totalMinutes} ${t.lessonsDuration}`;

                const allResources = modules
                  .flatMap(m => m.lessons)
                  .filter(l => l.resources && Array.isArray(l.resources))
                  .flatMap(l => (l.resources || []).map((r) => ({ ...r, lessonTitle: l.title })));

                const CertificateCard = () => (
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" /> Certificado del Curso
                    </h2>
                    
                    {/* Certificate Mockup Preview */}
                    <div className="relative aspect-[1.41] bg-neutral-950 border border-neutral-800/60 rounded-2xl p-4 flex flex-col items-center justify-between text-white overflow-hidden shadow-sm select-none mb-4">
                      <div className="absolute inset-2 border border-amber-600/20 rounded-xl pointer-events-none" />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-[20px] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-neutral-500/5 rounded-full filter blur-[20px] pointer-events-none" />

                      <span className="text-[7px] text-amber-500 font-extrabold tracking-widest uppercase mt-2">Certificado de Finalización</span>
                      
                      <div className="text-center my-auto">
                        <span className="text-[5px] text-neutral-400 block font-semibold leading-none">Otorgado oficialmente a</span>
                        <span className="text-[9px] font-bold text-white block mt-1 leading-none uppercase truncate max-w-[120px]">Tu Nombre</span>
                        <div className="w-8 h-px bg-amber-600/30 mx-auto my-1.5" />
                        <span className="text-[5px] text-neutral-400 block leading-none">Por completar la especialización en</span>
                        <span className="text-[8px] font-bold text-amber-500/90 block mt-0.5 leading-tight truncate max-w-[140px]">{readableCourseName}</span>
                      </div>

                      <div className="w-full flex items-end justify-between px-2 pb-1 shrink-0">
                        <div className="text-left">
                          <span className="text-[4px] text-neutral-500 block leading-none">Emisor</span>
                          <span className="text-[6px] font-bold text-white block leading-none mt-0.5">ProgramBI</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center shadow-md">
                          <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                        </div>
                      </div>

                      {progress < 100 && (
                        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[1px] flex flex-col items-center justify-center select-none">
                          <Lock className="w-5 h-5 text-amber-500 mb-1.5" />
                          <span className="text-[9px] text-amber-500 font-bold tracking-wider uppercase">{progress}% completado</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {progress === 100 ? (
                        <button className="w-full py-2 bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-xs font-bold rounded-xl shadow-sm border-0 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Descargar PDF
                        </button>
                      ) : (
                        <>
                          <div>
                            <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                              <span>{t.progress}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                              <div className="h-full bg-neutral-900 dark:bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal leading-relaxed">
                            Al completar el 100% de las clases, se emitirá un certificado digital firmado con código de verificación.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );

                const InstructorCard = () => (
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                      {t.instructor}
                    </h2>
                    <div className="flex items-center gap-3.5 mb-3.5 select-none">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        MO
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-neutral-900 dark:text-white text-xs leading-none">Manuel Oliva</span>
                        <span className="block text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">Fundador & Mentor</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-555 dark:text-neutral-400 leading-relaxed">
                      Lidero un equipo dedicado a empoderar empresas con herramientas de datos avanzadas. Con años de experiencia como consultor en análisis y visualización, he desarrollado dashboards personalizados integrando web, servidores y bases de datos.
                    </p>
                    <p className="text-[10px] text-neutral-555 dark:text-neutral-400 leading-relaxed mt-2.5">
                      Mi enfoque práctico ha ayudado a compañías líderes en Minería, Finanzas y Retail a optimizar procesos críticos y tomar decisiones informadas basadas en hechos.
                    </p>
                  </div>
                );

                return (
                  <div className="flex flex-col h-full bg-white dark:bg-black overflow-y-auto no-scrollbar">
                    {/* Course Home Header Navigation */}
                    <header className="flex-none h-[64px] bg-white dark:bg-black flex items-center justify-between px-6 border-b border-neutral-200/60 dark:border-neutral-800/80 select-none">
                      <div className="flex items-center gap-4 min-w-0">
                        <button
                          onClick={onBack}
                          className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all border-0 cursor-pointer"
                          title={t.backToCourses}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                            alt="ProgramBI Logo"
                            className="h-7 w-auto object-contain cursor-pointer dark:invert"
                            onClick={onBack}
                          />
                        </div>
                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
                        <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-400 uppercase tracking-widest hidden sm:inline">
                          {t.courseHome}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-neutral-55 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl px-3.5 py-1.5 shadow-sm">
                        <div className="text-right leading-none hidden md:block">
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">{t.progress}</span>
                          <span className="text-[10px] font-bold text-neutral-900 dark:text-white mt-0.5 block">{completedLessons.size} de {totalLessons} {t.lessonsCount}</span>
                        </div>
                        <div className="bg-neutral-900 text-white dark:bg-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          {progress}%
                        </div>
                      </div>
                    </header>

                    <div className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8">
                      {/* Banner / Hero Section */}
                      <div className="bg-gradient-to-r from-blue-950 via-[#0b193c] to-neutral-950 text-white border border-blue-900/30 rounded-3xl p-8 relative overflow-hidden shadow-sm mb-8 select-none">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full filter blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                        
                        <div className="relative z-10 max-w-2xl">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-300 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-750">
                            {readableCourseName}
                          </span>
                          <h1 className="text-2xl sm:text-3xl font-bold mt-4 leading-tight">
                            {t.welcome}
                          </h1>
                          <p className="text-xs text-neutral-405 mt-3 leading-relaxed">
                            {t.welcomeDesc}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 mt-6 items-center">
                            <button
                              onClick={() => {
                                const firstLesson = modules.length > 0 && modules[0].lessons.length > 0 ? modules[0].lessons[0] : null;
                                const next = modules.flatMap(m => m.lessons).find(l => !completedLessons.has(l.id)) || firstLesson;
                                if (next) handleSelectLesson(next);
                              }}
                              className="px-5 py-2.5 bg-white text-black hover:bg-neutral-100 font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer border-0 text-xs uppercase tracking-wider"
                            >
                              {completedLessons.size > 0 ? t.continueLearning : t.startCourse}
                            </button>
                            
                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                              {totalLessons} {t.lessonsCount} • {modules.length} {t.modulesCount}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 select-none">
                        {/* Stat 1: Completed Classes */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-none">{t.classesViewed}</span>
                            <span className="block text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-none">{completedLessons.size} / {totalLessons}</span>
                          </div>
                        </div>

                        {/* Stat 2: Estimated Duration */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-neutral-900/5 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-400 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-none">{t.totalDuration}</span>
                            <span className="block text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-none">{timeString}</span>
                          </div>
                        </div>

                        {/* Stat 3: Resources */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-neutral-900/5 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-none">{t.resources}</span>
                            <span className="block text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-none">{allResources.length}</span>
                          </div>
                        </div>

                        {/* Stat 4: IA Mentor */}
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-neutral-900/5 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider leading-none">{t.aiStudy}</span>
                            <span className="block text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-none">{t.activeMentor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tabs Switcher for Course Home */}
                      <div className="flex border-b border-neutral-200/80 dark:border-neutral-800/60 mb-6 select-none">
                        {[
                          { id: 'syllabus' as const, label: t.syllabus },
                          { id: 'files' as const, label: t.resources, count: allResources.length },
                          { id: 'faq' as const, label: t.mentorshipFaq },
                        ].map((tab) => {
                          const isActive = homeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setHomeTab(tab.id)}
                              className={cn(
                                "pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all border-0 bg-transparent cursor-pointer flex items-center gap-1.5",
                                isActive
                                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                                  : 'border-transparent text-neutral-450 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                              )}
                            >
                              <span>{tab.label}</span>
                              {tab.count !== undefined && tab.count > 0 && (
                                <span className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                                  isActive ? "bg-neutral-900 text-white dark:bg-white dark:text-black" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                                )}>
                                  {tab.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Course Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                          
                          {homeTab === 'syllabus' && (
                            <>
                              {/* Teachings section */}
                              <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                                  <Sparkles className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> {t.whatYouWillLearn}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-neutral-600 dark:text-neutral-400">
                                  {[
                                    "Dominio completo de los fundamentos prácticos del curso",
                                    "Metodologías ágiles de implementación y despliegue real",
                                    "Desarrollo lógico con herramientas de última generación",
                                    "Optimización de código y mejores prácticas de la industria",
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                      </div>
                                      <span className="leading-snug font-medium">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Content curriculum section */}
                              <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 select-none">
                                  {t.syllabusFull}
                                </h2>
                                <div className="space-y-4">
                                  {modules.map((mod) => (
                                    <div key={mod.name} className="border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950">
                                      <div className="bg-neutral-50 dark:bg-neutral-900/40 px-4 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between select-none">
                                        <div className="text-left">
                                          <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">Módulo {mod.order}</span>
                                          <h3 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 leading-snug">{mod.name}</h3>
                                        </div>
                                        <span className="text-[10px] text-neutral-400 font-bold">{mod.lessons.length} clases</span>
                                      </div>
                                      <div className="divide-y divide-neutral-100 dark:divide-neutral-900 bg-white dark:bg-neutral-950">
                                        {mod.lessons.map((lesson) => {
                                          const isCompleted = completedLessons.has(lesson.id);
                                          return (
                                            <div
                                              key={lesson.id}
                                              onClick={() => handleSelectLesson(lesson)}
                                              className="px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/30 cursor-pointer transition-colors text-xs text-neutral-700 dark:text-neutral-300"
                                            >
                                              <div className="flex items-center gap-3 min-w-0">
                                                <div className={cn(
                                                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                  isCompleted ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-transparent'
                                                )}>
                                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                                </div>
                                                <span className="font-bold truncate">{lesson.lesson_order}. {lesson.title}</span>
                                              </div>
                                              <span className="text-[10px] text-neutral-400 font-bold shrink-0 ml-3">{lesson.duration_minutes || 0} min</span>
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
                            <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                              <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                                  <FileText className="w-4 h-4 text-neutral-500" /> Todos los recursos descargables
                              </h2>
                              {allResources.length === 0 ? (
                                <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl select-none">
                                  <FileText className="w-8 h-8 text-neutral-350 dark:text-neutral-700 mx-auto mb-2" />
                                  <p className="text-[11px] leading-relaxed px-4">{t.noResources}</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {allResources.map((res: { name: string; url: string; lessonTitle: string }, idx: number) => {
                                    const isExcel = res.name.endsWith('.xlsx') || res.name.endsWith('.xls') || res.name.endsWith('.csv');
                                    const isPdf = res.name.endsWith('.pdf');
                                    const isZip = res.name.endsWith('.zip') || res.name.endsWith('.rar');

                                    return (
                                      <a
                                        key={idx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start justify-between p-4 bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/60 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 transition-all text-xs font-semibold text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white shadow-sm group text-left"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            isExcel ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400' :
                                            isPdf ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/5 dark:text-rose-400' :
                                            isZip ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400' :
                                            'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                                          )}>
                                            <FileText className="w-4 h-4" />
                                          </div>
                                          <div className="min-w-0">
                                            <span className="block truncate font-bold text-neutral-800 dark:text-neutral-200 leading-none">{res.name}</span>
                                            <span className="block text-[8px] text-neutral-400 font-bold mt-1.5 truncate">Clase: {res.lessonTitle}</span>
                                          </div>
                                        </div>
                                        <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white shrink-0 ml-1.5 mt-2" />
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {homeTab === 'faq' && (
                            <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                              <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2 select-none">
                                <HelpCircle className="w-4 h-4 text-neutral-500" /> Preguntas Frecuentes y Soporte
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
                                  <div key={idx} className="p-4 bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl">
                                    <h4 className="text-xs font-bold text-neutral-950 dark:text-neutral-200 leading-snug flex items-start gap-2">
                                      <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                                      {faq.q}
                                    </h4>
                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed pl-6 font-medium">
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
              
              /* ── SUPER CLASE WORKSTATION MODE ── */
              <div className="flex h-full w-full bg-neutral-950">
                
                {/* Monaco Editor Workspace */}
                <div className="flex-1 flex flex-col h-full bg-neutral-950 border-r border-neutral-900">
                  <div className="flex-none h-12 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between px-4 select-none">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-neutral-400" />
                      <span className="text-white font-bold text-xs">{t.playgroundTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-neutral-900 text-white text-[11px] border border-neutral-800 rounded-lg px-2 py-1 outline-none font-bold cursor-pointer hover:border-neutral-700"
                      >
                        <option value="python">Python 3</option>
                        <option value="sql">SQL (SQLite)</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                      <button
                        onClick={executeCode}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black hover:bg-neutral-100 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer border-0 shadow-sm"
                      >
                        {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        {isExecuting ? t.executing : t.execute}
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
                        fontSize: 13,
                        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                        padding: { top: 12 },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                  
                  {/* Console output */}
                  <div className="flex-none h-48 bg-neutral-950 border-t border-neutral-900 flex flex-col">
                    <div className="flex-none h-8 bg-neutral-900/60 flex items-center px-4 border-b border-neutral-900 select-none">
                      <Terminal className="w-3.5 h-3.5 text-neutral-500 mr-2" />
                      <span className="text-[9px] text-neutral-450 font-bold tracking-wider uppercase">{t.consoleResult}</span>
                    </div>
                    <div
                      className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed"
                      style={{ color: (codeOutput.includes("Error") || codeOutput.includes("Traceback")) ? "#f87171" : "#e5e5e5" }}
                    >
                      {codeOutput ? (
                        <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                      ) : (
                        <span className="text-neutral-600">{t.consolePrompt}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video PiP */}
                <div className="flex-none w-[380px] bg-white dark:bg-black border-l border-neutral-200/80 dark:border-neutral-800/80 flex flex-col h-full">
                  <div className="relative w-full aspect-video bg-black shrink-0 border-b border-neutral-250 dark:border-neutral-900 select-none">
                    {videoId ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                        <p className="text-xs text-neutral-500">{t.videoNotAvail}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="flex items-center justify-between select-none">
                      <span className="text-[9px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t.codingMode}
                      </span>
                      <button
                        onClick={() => setSuperClaseActive(false)}
                        className="text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer bg-transparent border-0"
                      >
                        {t.exitPlayground}
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
                        {selectedLesson.title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                        {t.codingDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              
              /* ── STANDARD CLASSROOM VIEW: Big Video + Tabs Below ── */
              <div className="flex flex-col h-full bg-white dark:bg-black overflow-y-auto no-scrollbar">
                
                {/* ─── LESSON HEADER ─── */}
                <header className="flex-none h-[64px] bg-white dark:bg-black flex items-center justify-between px-6 border-b border-neutral-200/60 dark:border-neutral-800/80">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center shrink-0 select-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                        alt="ProgramBI Logo"
                        className="h-7 w-auto object-contain cursor-pointer dark:invert"
                        onClick={onBack}
                        title={t.backToCourses}
                      />
                    </div>

                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />

                    <button
                      onClick={onBack}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer border-0 shrink-0"
                      title={t.backToCourses}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block shrink-0" />
                    
                    <div
                      onClick={() => router.push(`/comunidad/cursos/${courseSlug}`)}
                      className="min-w-0 cursor-pointer group select-none"
                      title={t.courseHome}
                    >
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block leading-none mb-1 group-hover:underline transition-all">
                        {readableCourseName}
                      </span>
                      <h1 className="text-sm font-bold text-neutral-900 dark:text-white leading-none line-clamp-1 group-hover:text-neutral-950 dark:group-hover:text-neutral-200 transition-colors">
                        {selectedLesson?.title || "Aula Virtual"}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-none">
                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors border cursor-pointer flex items-center gap-1.5",
                        copiedShare 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-900/60" 
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-750 border-neutral-250/30 hover:border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-850 dark:text-neutral-300 dark:border-neutral-800/80 dark:hover:border-neutral-700"
                      )}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{copiedShare ? "¡Copiado!" : "Compartir"}</span>
                    </button>

                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex items-center gap-3 bg-neutral-55 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl px-3.5 py-1.5 shadow-sm select-none">
                      <div className="hidden md:block text-right leading-none">
                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">{t.progress}</span>
                        <span className="text-[10px] font-bold text-neutral-900 dark:text-white mt-0.5 block">{completedLessons.size} de {totalLessons}</span>
                      </div>
                      
                      <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-neutral-900 dark:bg-white transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="bg-neutral-900 text-white dark:bg-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {progress}%
                      </div>
                    </div>

                    {!sidebarOpen && (
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer border-0 ml-2"
                        title={t.courseContent}
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </header>
                
                {/* Cinema Screen Frame for Video */}
                <div className="flex-none w-full bg-neutral-50 dark:bg-neutral-950 flex justify-center items-center py-4 px-6 border-b border-neutral-150/70 dark:border-neutral-900">
                  <div className="relative w-full max-w-[1120px] aspect-video bg-neutral-950 rounded-2xl overflow-hidden shadow-md">
                    {isSelectedLessonLocked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden select-none">
                        <Lock className="w-10 h-10 text-orange-500 mb-3" />
                        <h2 className="text-base font-bold text-white mb-1.5 text-center px-4">{t.courseLocked}</h2>
                        <p className="text-neutral-400 text-xs max-w-xs text-center mb-5 leading-relaxed px-4 font-medium">
                          {t.lockedDesc}
                        </p>
                        <button
                          onClick={() => onUpgradeClick ? onUpgradeClick() : (window.location.href = `/api/mercadopago/upgrade-trial`)}
                          className="px-5 py-2.5 bg-white text-black hover:bg-neutral-100 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 border-0 transition-all cursor-pointer uppercase tracking-wider"
                        >
                          <Sparkles className="w-4 h-4 text-orange-600" /> {t.unlockCourse}
                        </button>
                      </div>
                    ) : videoId ? (
                      <div id="video-container-wrapper" className="absolute inset-0 w-full h-full bg-black">
                        <iframe
                          id="youtube-player-target"
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-2 select-none">
                        <Play className="w-10 h-10 text-neutral-800" />
                        <p className="text-neutral-600 text-xs font-bold">{t.videoNotAvail}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details & Interactive Tabs */}
                <div className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 bg-white dark:bg-black">
                  
                  {/* Tabs Navbar */}
                  <div className="flex items-center gap-6 mb-6 overflow-x-auto scrollbar-hide border-b border-neutral-150 dark:border-neutral-900 select-none">
                    {[
                      { id: 'overview', label: t.overviewTab, icon: FileText },
                      { id: 'notes', label: t.notesTab, icon: StickyNote },
                      { id: 'faq', label: t.faqTab, icon: HelpCircle },
                      ...(selectedLesson?.resources && Array.isArray(selectedLesson.resources) && selectedLesson.resources.length > 0
                        ? [{ id: 'resources', label: t.filesTab, icon: Download }]
                        : [])
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'overview' | 'notes' | 'faq' | 'resources')}
                          className={`flex items-center gap-1.5 pb-3.5 text-xs font-bold transition-all uppercase tracking-wider relative border-0 bg-transparent cursor-pointer whitespace-nowrap ${
                            isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                          {isActive && (
                            <motion.div
                              layoutId="activeWorkspaceTab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
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
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2 select-none">
                              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 uppercase tracking-wider border border-neutral-250/20 dark:border-neutral-800/40">
                                Módulo {selectedModuleOrder} • Clase {selectedLesson.lesson_order}
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-50 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-450 uppercase tracking-wider flex items-center gap-1 border border-neutral-150/40 dark:border-neutral-900">
                                <Clock className="w-2.5 h-2.5" /> {selectedLesson.duration_minutes} {t.lessonsDuration}
                              </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                              {selectedLesson.title}
                            </h2>
                          </div>
                          
                          {selectedLesson.superclass_language && (
                            <button
                              onClick={() => setSuperClaseActive(true)}
                              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer border-0 active:scale-98 transition-colors select-none"
                            >
                              <Sparkles className="w-4 h-4 text-orange-500" /> {t.superClaseBtn} ({selectedLesson.superclass_language.toUpperCase()})
                            </button>
                          )}
                        </div>

                        {/* Ratings & statistics overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 select-none">
                          <div className="text-left">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">{t.rating}</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-base font-bold text-neutral-900 dark:text-white">4.8</span>
                              <div className="flex text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500 stroke-none" />)}
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">{t.students}</span>
                            <span className="text-base font-bold text-neutral-900 dark:text-white mt-1.5 block">15k+</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">{t.duration}</span>
                            <span className="text-base font-bold text-neutral-900 dark:text-white mt-1.5 block">{totalLessons} clases</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">{t.access}</span>
                            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 block uppercase">Premium</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider mb-2 select-none">{t.aboutLesson}</h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed font-medium">
                            {t.aboutLessonDesc}
                          </p>
                        </div>

                        {/* Instructor Profile Card */}
                        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 flex items-start gap-4 select-none">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                            MO
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">{t.instructor}</span>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 block">Manuel Oliva</span>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-450 leading-relaxed mt-1">
                              Lidero un equipo dedicado a empoderar empresas con herramientas de datos avanzadas. Con años de experiencia como consultor en análisis y visualización, he desarrollado dashboards personalizados integrando web, servidores y bases de datos.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 2: NOTES */}
                    {activeTab === 'notes' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-900 pb-3 select-none">
                          <div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">{t.personalNotes}</h3>
                            <p className="text-[10px] text-neutral-450 dark:text-neutral-500 font-medium mt-0.5">{t.notesSavedLocal}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleDownloadNotes}
                              disabled={!notes.trim()}
                              className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-850 dark:text-neutral-200 border-0 cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                              title="Descargar apuntes .txt"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {t.downloadNotes}
                            </button>
                            <button
                              onClick={() => { if (confirm("¿Seguro que deseas eliminar tus apuntes de esta clase?")) setNotes(""); }}
                              disabled={!notes.trim()}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 border-0 cursor-pointer disabled:opacity-40 transition-colors"
                              title="Limpiar apuntes"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t.notesPlaceholder}
                            className="w-full min-h-[160px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-200 dark:focus:ring-neutral-800 leading-relaxed shadow-sm resize-y"
                          />
                          <div className="absolute bottom-3 right-3 text-[9px] font-bold select-none">
                            {notesSaving ? (
                              <span className="flex items-center gap-1 text-neutral-405"><Loader2 className="w-3 h-3 animate-spin" /> {t.saving}</span>
                            ) : notes ? (
                              <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> {t.autoSaved}</span>
                            ) : (
                              <span className="text-neutral-400">{t.emptyNotes}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 3: FAQ */}
                    {activeTab === 'faq' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <h3 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-900 pb-3 select-none">{t.faqTitle}</h3>
                        <div className="space-y-3">
                          {[
                            { q: "¿Cómo descargo los archivos y recursos del curso?", a: "Puedes encontrar los recursos descargables en la pestaña general de cada módulo o solicitarlos directamente al Asistente de IA en el panel lateral." },
                            { q: "¿Tengo acceso ilimitado a las clases y Playground?", a: "Sí, todos los usuarios suscritos en planes premium tienen acceso total a todos los videos y herramientas de ejecución de código sin restricciones." },
                            { q: "¿Qué hago si mi código en el Playground arroja error?", a: "Asegúrate de que estás usando el lenguaje adecuado en la pestaña superior (por ejemplo, Python para sintaxis de Python) y lee el mensaje que arroja la Consola de Salida." }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-neutral-50/50 dark:bg-neutral-900/20 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-250 flex items-center gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                {item.q}
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed font-medium pl-5">
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 4: RESOURCES */}
                    {activeTab === 'resources' && selectedLesson && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <h3 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-900 pb-3 select-none">Archivos y Recursos descargables</h3>
                        <p className="text-xs text-neutral-550 dark:text-neutral-400 font-medium select-none">Haz clic en los enlaces a continuación para descargar el material complementario para esta clase.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {selectedLesson.resources && Array.isArray(selectedLesson.resources) && selectedLesson.resources.map((res, idx) => {
                            const isExcel = res.name.endsWith('.xlsx') || res.name.endsWith('.xls') || res.name.endsWith('.csv');
                            const isPdf = res.name.endsWith('.pdf');
                            const isZip = res.name.endsWith('.zip') || res.name.endsWith('.rar');
                            
                            return (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 transition-all text-xs font-semibold text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white shadow-sm group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                    isExcel ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400' :
                                    isPdf ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/5 dark:text-rose-400' :
                                    isZip ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400' :
                                    'bg-neutral-100 text-neutral-850 dark:bg-neutral-800 dark:text-neutral-250'
                                  )}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <span className="block truncate font-bold text-neutral-800 dark:text-neutral-200">{res.name}</span>
                                    <span className="block text-[10px] text-neutral-400 font-bold mt-0.5">{res.size ? `${(res.size / 1024 / 1024).toFixed(2)} MB` : "Recurso"}</span>
                                  </div>
                                </div>
                                <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white shrink-0" />
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

        {/* ─── RIGHT PANE: Collapsible Sidebar ─── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-none h-full border-l border-neutral-200/80 dark:border-neutral-800/80 flex flex-col bg-white dark:bg-black overflow-hidden relative z-10"
            >
              {/* Sidebar Header & Tabs */}
              <div className="flex-none border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-black select-none">
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'content', label: t.courseContent },
                      { id: 'ai', label: t.aiAssistant, sparkles: true },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSidebarTab(tab.id as 'content' | 'ai')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                          sidebarTab === tab.id
                            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white'
                            : 'bg-transparent text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
                        }`}
                      >
                        {tab.sparkles && <Sparkles className="w-3 h-3 inline mr-1 text-orange-500" />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {sidebarTab === 'ai' && (
                      <button
                        onClick={handleResetChat}
                        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors border-0 bg-transparent cursor-pointer text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
                        title={t.newConversation}
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors border-0 bg-transparent cursor-pointer text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Workspace Area */}
              <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar bg-white dark:bg-black">
                
                {/* Mode A: COURSE CONTENT */}
                {sidebarTab === 'content' && (
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-900 bg-white dark:bg-black">
                    {modules.map((mod) => (
                      <div key={mod.name} className="bg-transparent">
                        <div className="px-5 py-3 bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-neutral-100 dark:border-neutral-900 select-none">
                          <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
                            Módulo {mod.order}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-950 dark:text-neutral-200 mt-0.5 leading-snug">{mod.name}</h4>
                        </div>
                        <div className="divide-y divide-neutral-100/40 dark:divide-neutral-900/60">
                          {mod.lessons.map((lesson) => {
                            const isSelected = selectedLesson?.id === lesson.id;
                            const isCompleted = completedLessons.has(lesson.id);
                            const globalIndex = modules.flatMap(m => m.lessons).findIndex(l => l.id === lesson.id);
                            const isLocked = accessType === "trial" && globalIndex >= 2;
                            const hasSuperClase = !!lesson.superclass_language;

                            return (
                              <div
                                key={lesson.id}
                                className={cn(
                                  "w-full flex items-start gap-3.5 px-5 py-4 transition-all group relative border-l-4",
                                  isSelected 
                                    ? 'bg-neutral-50/70 border-neutral-900 dark:bg-neutral-900/40 dark:border-white' 
                                    : 'border-transparent hover:bg-neutral-50/60 dark:hover:bg-neutral-900/10'
                                )}
                              >
                                {/* Checkbox / Lock Selector (Left) */}
                                <div className="flex-none mt-0.5 select-none">
                                  {isLocked ? (
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                                      <Lock className="w-2.5 h-2.5" />
                                    </div>
                                  ) : isSelected && !isCompleted ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm animate-pulse"
                                    >
                                      <Play className="w-2 h-2 text-neutral-900 fill-neutral-900 dark:text-white dark:fill-white" />
                                    </button>
                                  ) : isCompleted ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                    >
                                      <Check className="w-3 h-3 stroke-[3px]" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                      className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all border border-neutral-300 dark:border-neutral-700 text-transparent bg-white dark:bg-neutral-950 shadow-sm"
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
                                  <h5 className={cn(
                                    "text-[12px] leading-snug font-bold line-clamp-2 transition-colors",
                                    isSelected ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-700 dark:text-neutral-350 group-hover:text-neutral-950 dark:group-hover:text-white'
                                  )}>
                                    {lesson.lesson_order}. {lesson.title}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5 select-none">
                                    <span className="text-[9px] text-neutral-400 font-bold flex items-center gap-1 leading-none">
                                      <Clock className="w-2.5 h-2.5" />
                                      {lesson.duration_minutes || 0} min
                                    </span>
                                    {hasSuperClase && (
                                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 uppercase tracking-wide">
                                        Super Clase
                                      </span>
                                    )}
                                    {lesson.is_free_preview && (
                                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 uppercase tracking-wide">
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
                  <div className="flex flex-col h-full bg-white dark:bg-black">
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50/50 dark:bg-neutral-950/20 no-scrollbar">
                      {chatMessages.length === 1 && (
                        <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200/60 dark:border-neutral-800/80 p-4 rounded-2xl text-center shadow-sm mb-4 select-none">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">Mentor IA de ProgramBI</h4>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1 font-medium">
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
                          <div className={cn(
                            "w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold select-none",
                            msg.role === 'user' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                          )}>
                            {msg.role === 'user' ? 'Tú' : 'IA'}
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl text-[12px] leading-relaxed",
                            msg.role === 'user'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black rounded-tr-none shadow-sm font-medium'
                              : 'bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 rounded-tl-none border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm'
                          )}>
                            {msg.role === 'user' ? (
                              msg.text
                            ) : (
                              <MarkdownRenderer content={msg.text} />
                            )}
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex gap-2.5 mr-auto max-w-[85%] animate-pulse select-none">
                          <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[9px] font-bold text-neutral-800 dark:text-neutral-200 shadow-sm">IA</div>
                          <div className="p-3 bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-450 rounded-2xl rounded-tl-none text-[12px] flex items-center gap-1.5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm leading-relaxed font-semibold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600 dark:text-neutral-400 shrink-0" /> {t.analyzing}
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex-none p-3 border-t border-neutral-150 dark:border-neutral-900 bg-white dark:bg-black flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                        placeholder={t.aiPrompt}
                        className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-850 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-neutral-250 dark:focus:ring-neutral-800 transition-all"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 flex items-center justify-center cursor-pointer border-0 shrink-0 transition-all shadow-sm"
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
