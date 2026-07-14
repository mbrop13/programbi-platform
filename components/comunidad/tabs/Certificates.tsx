"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Clock,
  CheckCircle2,
  Loader2,
  FileText,
  Lock,
  Info,
  HelpCircle
} from "lucide-react";
import { getCurrentUserProfile, getDashboardStats, getUserCertificates } from "@/lib/supabase/comunidad";

interface Certificate {
  id: string;
  courseTitle: string;
  completedAt: string;
  code: string;
  status: "completed" | "in_progress";
  progress: number;
  studentName?: string;
  isManual?: boolean;
}

export default function Certificates() {
  const [manualCertificates, setManualCertificates] = useState<Certificate[]>([]);
  const [courseProgressList, setCourseProgressList] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [stats, userProf, dbCerts] = await Promise.all([
          getDashboardStats(),
          getCurrentUserProfile(),
          getUserCertificates(),
        ]);
        
        setProfile(userProf);

        // 1. Manually enabled certificates by administrators
        const manualCerts: Certificate[] = (dbCerts || []).map((c: any) => ({
          id: c.id,
          courseTitle: c.course_title,
          completedAt: c.issued_at,
          code: c.certificate_code,
          status: "completed",
          progress: 100,
          studentName: c.student_name,
          isManual: true,
        }));
        setManualCertificates(manualCerts);

        // 2. LMS course progress to show evaluation states
        if (stats?.courseProgress) {
          setCourseProgressList(stats.courseProgress);
        }
      } catch (err) {
        console.error("Error loading certificates", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = async (cert: Certificate) => {
    setDownloading(cert.id);
    try {
      const { jsPDF } = await import("jspdf");

      // Canvas dimensions (A4 landscape at 2x for high res)
      const W = 2246, H = 1588;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // --- Background ---
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, W, H);

      // --- Gold Border ---
      ctx.strokeStyle = "#c5a059";
      ctx.lineWidth = 6;
      ctx.strokeRect(48, 48, W - 96, H - 96);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(60, 60, W - 120, H - 120);
      ctx.globalAlpha = 1;

      // --- White content area ---
      const cx = 84, cy = 84, cw = W - 168, ch = H - 168;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx, cy, cw, ch);

      // --- Logo ---
      try {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          logo.onload = () => resolve();
          logo.onerror = () => reject();
          logo.src = "/logo.png";
        });
        const logoH = 120;
        const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
        ctx.drawImage(logo, (W - logoW) / 2, cy + 50, logoW, logoH);
      } catch { /* continue without logo */ }

      // --- Title ---
      ctx.fillStyle = "#0f2c59";
      ctx.font = "900 84px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "14px";
      ctx.fillText("CERTIFICADO DE FINALIZACIÓN", W / 2, cy + 280);
      ctx.letterSpacing = "0px";

      // --- Subtitle ---
      ctx.fillStyle = "#c5a059";
      ctx.font = "700 24px system-ui, sans-serif";
      ctx.letterSpacing = "8px";
      ctx.fillText("ESTE DIPLOMA ES CONFERIDO CON HONORES A:", W / 2, cy + 370);
      ctx.letterSpacing = "0px";

      // --- Student Name ---
      ctx.fillStyle = "#0f2c59";
      ctx.font = 'italic 700 110px "Dancing Script", cursive, system-ui, sans-serif';
      ctx.fillText(cert.studentName || profile?.full_name || "Nombre del Alumno", W / 2, cy + 540);

      // --- Validation Code ---
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 26px system-ui, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText(`CÓDIGO DE VALIDACIÓN: ${cert.code}`, W / 2, cy + 600);
      ctx.letterSpacing = "0px";

      // --- Gold decorative line under name ---
      const lineGrad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
      lineGrad.addColorStop(0, "transparent");
      lineGrad.addColorStop(0.5, "#c5a059");
      lineGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W * 0.2, cy + 630);
      ctx.lineTo(W * 0.8, cy + 630);
      ctx.stroke();

      // --- Description ---
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 22px system-ui, sans-serif";
      ctx.letterSpacing = "5px";
      ctx.fillText("POR HABER COMPLETADO EXITOSAMENTE Y DEMOSTRADO UN DOMINIO ABSOLUTO EN:", W / 2, cy + 680);
      ctx.letterSpacing = "0px";

      // --- Course Name ---
      ctx.fillStyle = "#1e293b";
      ctx.font = "900 60px system-ui, sans-serif";
      ctx.fillText(cert.courseTitle, W / 2, cy + 770);

      // --- Footer ---
      const fy = cy + ch - 160;

      // Date
      ctx.fillStyle = "#1e293b";
      ctx.font = "700 28px system-ui, sans-serif";
      const issueDateStr = cert.completedAt
        ? new Date(cert.completedAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : new Date().toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
      ctx.fillText(issueDateStr, W * 0.25, fy);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "700 16px system-ui, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("FECHA DE EMISIÓN", W * 0.25, fy + 40);
      ctx.letterSpacing = "0px";

      // Sign line
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.15, fy - 20);
      ctx.lineTo(W * 0.35, fy - 20);
      ctx.stroke();

      // Instructor Name
      ctx.fillStyle = "#1e293b";
      ctx.font = 'italic 700 48px "Dancing Script", cursive, system-ui, sans-serif';
      ctx.fillText("Manuel Oliva", W * 0.75, fy);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "700 16px system-ui, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("INSTRUCTOR SENIOR", W * 0.75, fy + 40);
      ctx.letterSpacing = "0px";

      // Sign line
      ctx.beginPath();
      ctx.moveTo(W * 0.65, fy - 20);
      ctx.lineTo(W * 0.85, fy - 20);
      ctx.stroke();

      // Sello
      ctx.fillStyle = "linear-gradient(to bottom right, #dfc27d, #b38836)";
      const sealGrad = ctx.createLinearGradient(W / 2 - 100, fy - 100, W / 2 + 100, fy + 100);
      sealGrad.addColorStop(0, "#dfc27d");
      sealGrad.addColorStop(1, "#b38836");

      ctx.fillStyle = sealGrad;
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 15;
      
      ctx.save();
      ctx.translate(W / 2, fy - 10);
      for (let angle = 0; angle < 180; angle += 15) {
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillRect(-64, -64, 128, 128);
      }
      ctx.restore();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#fcf8f2";
      ctx.beginPath();
      ctx.arc(W / 2, fy - 10, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#c5a059";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#b38836";
      ctx.font = "900 12px system-ui, sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText("ACREDITADO", W / 2, fy - 20);
      ctx.letterSpacing = "0px";

      ctx.font = "900 18px system-ui, sans-serif";
      ctx.fillText("★ ★ ★", W / 2, fy + 10);

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      pdf.save(`Certificado_${cert.courseTitle.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  // Check qualifications for certificate emission
  const isUltraUser = profile?.subscription_plan === "ultra" || profile?.role === "admin";

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 p-1 sm:p-0">
      {/* ─── BANNER SUPERIOR ACADÉMICO ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-950 p-6 sm:p-8 text-white border border-neutral-800 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Acreditación Profesional
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-2 flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-500 shrink-0" /> Logros y Certificados
            </h1>
            <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
              Tus certificados oficiales firmados por ProgramBI. Aquí se listarán de inmediato una vez que los profesores evalúen tu progreso y habiliten la descarga.
            </p>
          </div>
          <div className="bg-neutral-850 border border-neutral-700/40 rounded-2xl p-4 shrink-0 text-center md:text-left min-w-[200px]">
            <div className="text-2xl font-black text-white">{manualCertificates.length}</div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Certificados Obtenidos</div>
          </div>
        </div>
      </div>

      {/* ─── INFORMACIÓN DE ACCESO A CERTIFICADOS ─── */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex gap-4 items-start">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-250">Requisitos de Emisión</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
            De momento, la emisión de certificados de finalización aplica únicamente para alumnos que adquirieron **Cursos Unitarios** (compras individuales) o que disponen de la membresía premium **Ultra**. Si cumples estas condiciones y finalizas el progreso del curso, nuestro equipo de profesores revisará manualmente tu desempeño para emitir y habilitar tu diploma aquí.
          </p>
        </div>
      </div>

      {/* ─── SECCIÓN: CERTIFICADOS COMPLETADOS ─── */}
      {manualCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Acreditaciones Habilitadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualCertificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-800/80 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Visual Preview */}
                <div className="relative h-40 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 flex flex-col justify-between border-b border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                  <div>
                    <div className="flex items-center justify-between">
                      <Award className="w-7 h-7 text-amber-500" />
                      <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        OFICIAL
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight mt-3 line-clamp-2" title={cert.courseTitle}>
                      {cert.courseTitle}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                      {cert.code}
                    </span>
                    <span className="text-[9px] font-bold text-neutral-400">
                      {cert.completedAt ? new Date(cert.completedAt).toLocaleDateString("es-MX", { month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                </div>

                {/* Downloader Button */}
                <div className="p-4">
                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-2xl text-xs font-black shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border-none"
                  >
                    {downloading === cert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Descargar en PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SECCIÓN: CURSOS EN PROGRESO Y ACCESO A CERTIFICADO ─── */}
      {courseProgressList.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" /> Cursos en Curso y Estado de Emisión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseProgressList.map((cp, i) => {
              // Rule: only ultra users or single course purchases have certificate rights.
              // We assume single purchases are true if cp.isUnitaryPurchase is true or isUltraUser.
              const hasAccessToCert = isUltraUser || cp.isUnitaryPurchase; 
              const isFinished = cp.progress === 100;
              const alreadyIssued = manualCertificates.some(c => c.courseTitle.toLowerCase().trim() === cp.title.toLowerCase().trim());

              // Skip rendering if already issued manually to avoid confusion
              if (alreadyIssued) return null;

              return (
                <motion.div
                  key={cp.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/80 p-5 space-y-4 shadow-sm relative overflow-hidden
                    ${!hasAccessToCert ? "opacity-60 bg-neutral-50/50 dark:bg-neutral-950/20" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 leading-snug line-clamp-2" title={cp.title}>
                        {cp.title}
                      </h3>
                      <p className="text-[10px] text-neutral-450 dark:text-neutral-400 font-medium">Progreso en el LMS</p>
                    </div>
                    {/* Status Badge */}
                    {!hasAccessToCert ? (
                      <span className="text-[9px] font-black text-neutral-500 bg-neutral-200/50 dark:bg-neutral-850 dark:text-neutral-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Lock className="w-2.5 h-2.5" /> Requerido Ultra
                      </span>
                    ) : isFinished ? (
                      <span className="text-[9px] font-black text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                        <Clock className="w-2.5 h-2.5" /> En Evaluación
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                        En Curso
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500">
                      <span>{cp.progress}% completado</span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500
                          ${isFinished ? "bg-amber-500" : "bg-brand-blue"}`}
                        style={{ width: `${cp.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Clarification Label */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-[10px] text-neutral-400 leading-snug">
                      {!hasAccessToCert 
                        ? "Compra el curso individual o mejora a Ultra para tener derecho a certificado." 
                        : isFinished 
                        ? "Progreso completado. El equipo de profesores evaluará tu trabajo para emitir el certificado."
                        : "Completa el 100% de las lecciones del curso para iniciar la evaluación."
                      }
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── ESTADO VACÍO (Si no hay cursos ni certificados) ─── */}
      {manualCertificates.length === 0 && courseProgressList.length === 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-1">Sin Actividad Acreditada</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Aún no has iniciado tus cursos del LMS. Comienza a avanzar para visualizar el estado de tus certificados.
          </p>
        </div>
      )}
    </div>
  );
}
