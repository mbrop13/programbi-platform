"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  Upload,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  Clock,
  AlertCircle,
  FileCode,
  Save,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getProjectDetail,
  submitProjectCode,
  submitProjectFile,
} from "@/lib/supabase/projects";

// Monaco Editor (loaded dynamically)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Project {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  difficulty: string;
  language?: string;
  starter_code?: string;
  accepts_files: boolean;
  allowed_file_types?: string[];
  max_file_size_mb: number;
  xp_reward: number;
  course: {
    title: string;
    accent_color: string;
  };
}

interface Submission {
  id: string;
  code?: string;
  file_url?: string;
  file_name?: string;
  status: string;
  score?: number;
  feedback?: string;
  execution_result?: {
    passed_tests: number;
    total_tests: number;
    results: Array<{
      description: string;
      input: string;
      expected: string;
      output: string;
      passed: boolean;
      error?: string;
    }>;
  };
  submitted_at: string;
}

interface ProjectDetailProps {
  projectId: string;
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const { project, submission } = await getProjectDetail(projectId);
      setProject(project as any);
      setSubmission(submission as any);

      if (submission?.code) {
        setCode(submission.code);
        setExecutionResult(submission.execution_result);
      } else if ((project as any).starter_code) {
        setCode((project as any).starter_code);
      }
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCode = async () => {
    if (!code.trim()) return;
    setSaving(true);
    try {
      await submitProjectCode(projectId, code);
      // Reload to get updated submission
      await loadProject();
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRunTests = async () => {
    if (!code.trim()) return;
    setExecuting(true);
    try {
      const result = await submitProjectCode(projectId, code);
      setExecutionResult(result.executionResult);
      await loadProject();
    } catch (err) {
      console.error("Error running tests:", err);
    } finally {
      setExecuting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await submitProjectFile(projectId, file);
      await loadProject();
    } catch (err: any) {
      alert(err.message || "Error subiendo archivo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getMonacoLanguage = (lang?: string) => {
    switch (lang) {
      case "python": return "python";
      case "sql": return "sql";
      case "javascript": return "javascript";
      default: return "plaintext";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Proyecto no encontrado</h3>
        <button
          onClick={() => router.push("/comunidad/proyectos")}
          className="text-blue-600 hover:underline"
        >
          Volver a proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/comunidad/proyectos")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>{project.course.title}</span>
            <span>›</span>
            <span>Proyecto</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 rounded-lg">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-700">{project.xp_reward} XP</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {submission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 border ${
            submission.status === "completed"
              ? "bg-emerald-50 border-emerald-200"
              : submission.status === "reviewed"
              ? "bg-blue-50 border-blue-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {submission.status === "completed" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : submission.status === "reviewed" ? (
              <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
            ) : (
              <Clock className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {submission.status === "completed"
                  ? "¡Proyecto completado!"
                  : submission.status === "reviewed"
                  ? "Proyecto revisado"
                  : "Entrega en revisión"}
              </p>
              {submission.score !== null && (
                <p className="text-sm text-slate-600">
                  Puntuación: {submission.score}%
                </p>
              )}
              {submission.feedback && (
                <p className="text-sm text-slate-600 mt-1">
                  <strong>Feedback:</strong> {submission.feedback}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          {project.instructions && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Instrucciones</h2>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                  {project.instructions}
                </pre>
              </div>
            </div>
          )}

          {/* Code Editor (if language is specified) */}
          {project.language && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-slate-500" />
                  <span className="font-semibold text-slate-900">Editor de código</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600 uppercase">
                    {project.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveCode}
                    disabled={saving || !code.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar
                  </button>
                  <button
                    onClick={handleRunTests}
                    disabled={executing || !code.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {executing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Ejecutar Tests
                  </button>
                </div>
              </div>

              <div className="h-[400px]">
                <MonacoEditor
                  language={getMonacoLanguage(project.language)}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 12 },
                  }}
                />
              </div>
            </div>
          )}

          {/* File Upload (if accepts_files) */}
          {project.accepts_files && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-900">Entrega de archivo</h2>
              </div>

              {submission?.file_url ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <FileCode className="w-8 h-8 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{submission.file_name}</p>
                    <p className="text-sm text-slate-600">Archivo entregado</p>
                  </div>
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Descargar
                  </a>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium mb-1">
                    Haz clic para subir tu archivo
                  </p>
                  <p className="text-sm text-slate-500">
                    {project.allowed_file_types?.length
                      ? `Formatos: ${project.allowed_file_types.join(", ")}`
                      : "Cualquier formato aceptado"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Máximo {project.max_file_size_mb}MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept={project.allowed_file_types?.map((t) => `.${t}`).join(",")}
              />

              {uploading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Subiendo archivo...</span>
                </div>
              )}
            </div>
          )}

          {/* Test Results */}
          {executionResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Resultados de Tests</h2>
                <div
                  className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                    executionResult.passed_tests === executionResult.total_tests
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {executionResult.passed_tests} / {executionResult.total_tests} pasados
                </div>
              </div>

              <div className="space-y-3">
                {executionResult.results.map((result: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-4 ${
                      result.passed
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{result.description}</p>
                        {result.input && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-slate-500">Input:</span>
                            <code className="block mt-1 p-2 bg-white rounded text-xs text-slate-700 border border-slate-200">
                              {result.input}
                            </code>
                          </div>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs font-medium text-slate-500">Esperado:</span>
                            <code className="block mt-1 p-2 bg-white rounded text-xs text-emerald-700 border border-emerald-200">
                              {result.expected}
                            </code>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-500">Obtenido:</span>
                            <code
                              className={`block mt-1 p-2 bg-white rounded text-xs border ${
                                result.passed
                                  ? "text-emerald-700 border-emerald-200"
                                  : "text-red-700 border-red-200"
                              }`}
                            >
                              {result.output || result.error || "(vacío)"}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Project info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Información</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Curso</dt>
                <dd className="font-medium text-slate-900">{project.course.title}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Dificultad</dt>
                <dd className="font-medium text-slate-900 capitalize">{project.difficulty}</dd>
              </div>
              {project.language && (
                <div>
                  <dt className="text-slate-500">Lenguaje</dt>
                  <dd className="font-medium text-slate-900 uppercase">{project.language}</dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">Recompensa</dt>
                <dd className="font-medium text-amber-600">{project.xp_reward} XP</dd>
              </div>
              {submission && (
                <>
                  <div>
                    <dt className="text-slate-500">Estado</dt>
                    <dd className="font-medium text-slate-900 capitalize">
                      {submission.status === "completed"
                        ? "Completado"
                        : submission.status === "reviewed"
                        ? "Revisado"
                        : submission.status === "submitted"
                        ? "Entregado"
                        : submission.status}
                    </dd>
                  </div>
                  {submission.score !== null && (
                    <div>
                      <dt className="text-slate-500">Puntuación</dt>
                      <dd className="font-medium text-slate-900">{submission.score}%</dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </div>

          {/* Description */}
          {project.description && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Descripción</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Acciones rápidas</h3>
            <div className="space-y-2">
              {project.language && (
                <button
                  onClick={handleRunTests}
                  disabled={executing || !code.trim()}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-sm"
                >
                  {executing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Ejecutar tests
                </button>
              )}
              {project.accepts_files && !submission?.file_url && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium text-sm"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Entregar archivo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
