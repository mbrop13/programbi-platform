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
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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

        let autoCerts: Certificate[] = [];
        if (stats?.courseProgress) {
          autoCerts = stats.courseProgress.map((cp: any, i: number) => ({
            id: `cert_${i}`,
            courseTitle: cp.title,
            completedAt: cp.progress === 100 ? new Date().toISOString() : "",
            code: cp.progress === 100 ? `PBI-${Date.now().toString(36).toUpperCase()}-${i}` : "",
            status: cp.progress === 100 ? "completed" : "in_progress",
            progress: cp.progress,
            studentName: userProf?.full_name || "Estudiante ProgramBI",
            isManual: false,
          }));
        }

        // Avoid duplicates: if there is a manual certificate for a course title, filter out the automatic/progress one.
        const manualTitles = new Set(manualCerts.map((c) => c.courseTitle.toLowerCase().trim()));
        const filteredAutoCerts = autoCerts.filter(
          (ac) => !manualTitles.has(ac.courseTitle.toLowerCase().trim())
        );

        setCertificates([...manualCerts, ...filteredAutoCerts]);
      } catch (err) {
        console.error("Error loading certificates", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const completed = certificates.filter((c) => c.status === "completed");
  const inProgress = certificates.filter((c) => c.status === "in_progress");

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

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          Mis Certificados
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {completed.length} certificado{completed.length !== 1 ? "s" : ""} obtenido{completed.length !== 1 ? "s" : ""} · {inProgress.length} en progreso
        </p>
      </div>

      {/* Completed Certificates */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {completed.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 group"
              >
                {/* Certificate preview */}
                <div className="relative h-36 bg-gradient-to-br from-brand-blue via-indigo-500 to-purple-600 p-5 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
                  <div className="relative z-10">
                    <Award className="w-8 h-8 text-white/80 mb-2" />
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2" title={cert.courseTitle}>
                      {cert.courseTitle}
                    </h3>
                  </div>
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-md">
                      {cert.code}
                    </span>
                    {cert.isManual && (
                      <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Emitido
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border-none"
                  >
                    {downloading === cert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Descargar PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> En Progreso
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgress.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-70"
              >
                <div className="relative h-36 bg-gradient-to-br from-gray-200 to-gray-300 p-5 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                  <div className="relative z-10 flex items-center justify-center flex-1">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-gray-700 mb-2 line-clamp-1">{cert.courseTitle}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-blue to-indigo-500 rounded-full"
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500">{cert.progress}%</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Completa el curso para obtener tu certificado</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {certificates.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Aún no tienes certificados</h3>
          <p className="text-sm text-gray-500 mb-4">
            Completa un curso o solicita tu certificado de finalización al administrador.
          </p>
        </div>
      )}
    </div>
  );
}
