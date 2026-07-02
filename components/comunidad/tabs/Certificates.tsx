"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
  FileText,
  Lock,
} from "lucide-react";
import { getCurrentUserProfile, getDashboardStats } from "@/lib/supabase/comunidad";

interface Certificate {
  id: string;
  courseTitle: string;
  completedAt: string;
  code: string;
  status: "completed" | "in_progress";
  progress: number;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const stats = await getDashboardStats();
        if (stats?.courseProgress) {
          const certs: Certificate[] = stats.courseProgress.map((cp: any, i: number) => ({
            id: `cert_${i}`,
            courseTitle: cp.title,
            completedAt: cp.progress === 100 ? new Date().toISOString() : "",
            code: cp.progress === 100 ? `PBI-${Date.now().toString(36).toUpperCase()}-${i}` : "",
            status: cp.progress === 100 ? "completed" : "in_progress",
            progress: cp.progress,
          }));
          setCertificates(certs);
        }
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
    // Will use jsPDF + html2canvas — for now simulate
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF("landscape", "mm", "a4");

      // Professional certificate template
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Top blue bar
      doc.setFillColor(24, 144, 255);
      doc.rect(0, 0, pageWidth, 8, "F");

      // Bottom blue bar
      doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

      // Border
      doc.setDrawColor(24, 144, 255);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Inner border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.rect(18, 18, pageWidth - 36, pageHeight - 36);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(15, 23, 42);
      doc.text("CERTIFICADO", pageWidth / 2, 55, { align: "center" });

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139);
      doc.text("DE FINALIZACIÓN", pageWidth / 2, 65, { align: "center" });

      // Decorative line
      doc.setDrawColor(24, 144, 255);
      doc.setLineWidth(1);
      doc.line(pageWidth / 2 - 40, 72, pageWidth / 2 + 40, 72);

      // "This certifies that"
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text("Se certifica que", pageWidth / 2, 85, { align: "center" });

      // Student name (placeholder)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(15, 23, 42);
      doc.text("Estudiante ProgramBI", pageWidth / 2, 100, { align: "center" });

      // Name underline
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(pageWidth / 2 - 60, 105, pageWidth / 2 + 60, 105);

      // Course description
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text("ha completado satisfactoriamente el curso", pageWidth / 2, 118, { align: "center" });

      // Course name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(24, 144, 255);
      doc.text(cert.courseTitle, pageWidth / 2, 132, { align: "center" });

      // Footer info
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Código de verificación: ${cert.code}`, pageWidth / 2, 155, { align: "center" });
      doc.text(
        `Fecha de emisión: ${new Date(cert.completedAt).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`,
        pageWidth / 2,
        163,
        { align: "center" }
      );

      // ProgramBI branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("ProgramBI", pageWidth / 2, 180, { align: "center" });
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Plataforma de Formación en Datos", pageWidth / 2, 186, { align: "center" });

      doc.save(`Certificado_${cert.courseTitle.replace(/\s+/g, "_")}.pdf`);
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
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                      {cert.courseTitle}
                    </h3>
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-md">
                      {cert.code}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {downloading === cert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Descargar PDF
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-blue-50 transition-all">
                    <Share2 className="w-4 h-4" />
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
            Completa un curso para obtener tu certificado de finalización.
          </p>
        </div>
      )}
    </div>
  );
}
