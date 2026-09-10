"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminGetLeadsPage,
  adminDeleteLead,
  adminBulkDeleteLeads,
  adminGetAllUsers,
  adminGetLeads,
} from "@/lib/supabase/comunidad-ai";
import PricingExperimentCard from "@/components/comunidad/tabs/admin/PricingExperimentCard";
import { HoldToDeleteButton } from "./HoldToDeleteButton";
import { AdminEmpty, AdminPageHeader, AdminPagination, AdminTableWrap, SelectCheck } from "./ui";

const PAGE_SIZE = 50;

const LEAD_TYPES = [
  { value: "all", label: "Todos los tipos" },
  { value: "contact", label: "Contacto" },
  { value: "enterprise", label: "Empresa" },
  { value: "notify", label: "Notificar" },
];

function useDebounced<T>(value: T, delay = 280) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [leadType, setLeadType] = useState("all");
  const debouncedSearch = useDebounced(searchQuery);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const markedViewed = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetLeadsPage({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        leadType,
      });
      setLeads(data.leads);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, leadType]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, leadType]);

  useEffect(() => {
    if (markedViewed.current) return;
    markedViewed.current = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const nowStr = new Date().toISOString();
        localStorage.setItem("admin_leads_last_viewed", nowStr);
        if (user) {
          await supabase.from("admin_views").upsert({
            admin_id: user.id,
            leads_last_viewed_at: nowStr,
          });
          window.dispatchEvent(new Event("adminViewsUpdated"));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const isAllSelected = leads.length > 0 && leads.every((l) => selectedLeadIds.includes(l.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = new Set(leads.map((l) => l.id));
      setSelectedLeadIds((prev) => prev.filter((id) => !currentIds.has(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...leads.map((l) => l.id)])));
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (deletingLeadId) return;
    setDeletingLeadId(leadId);
    try {
      const res = await adminDeleteLead(leadId);
      if (res && !res.success) {
        alert(res.error || "No se pudo eliminar el contacto.");
        return;
      }
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setSelectedLeadIds((prev) => prev.filter((id) => id !== leadId));
      setTotal((n) => Math.max(0, n - 1));
    } catch (err: any) {
      alert(err.message || "Error al eliminar contacto.");
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleBulkDeleteLeads = async () => {
    if (selectedLeadIds.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);
    try {
      const res = await adminBulkDeleteLeads(selectedLeadIds);
      if (res && !res.success) {
        alert(res.error || "Error al eliminar contactos.");
        return;
      }
      const deleted = new Set(selectedLeadIds);
      setLeads((prev) => prev.filter((l) => !deleted.has(l.id)));
      setTotal((n) => Math.max(0, n - selectedLeadIds.length));
      setSelectedLeadIds([]);
    } catch (err: any) {
      alert(err.message || "Error al eliminar contactos.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const exportToCSV = async () => {
    if (isExportingCsv) return;
    setIsExportingCsv(true);
    try {
      const all = (await adminGetLeads()).filter((l: any) => l.lead_type !== "abandoned_cart");
      if (all.length === 0) {
        alert("No hay contactos para exportar.");
        return;
      }
      const head = ["email", "name", "WhatsApp", "Cursos Interés", "Mensaje", "Origen", "Variante precio", "Fecha"];
      const rows = all.map((l: any) => {
        const date = new Date(l.created_at).toLocaleDateString("es-CL");
        const courses = (l.selected_courses || []).join(" | ");
        return [
          l.email || "",
          `"${(l.name || "").replace(/"/g, '""')}"`,
          l.whatsapp || "",
          `"${courses}"`,
          `"${(l.message || "").replace(/"/g, '""')}"`,
          l.source_course || "",
          l.pricing_variant === "direct" ? "Vio precio" : l.pricing_variant === "gate" ? "Candado" : "",
          date,
        ].join(",");
      });
      downloadCsv(`programbi_leads_${new Date().toISOString().split("T")[0]}.csv`, [head.join(","), ...rows].join("\n"));
    } catch {
      alert("Error al exportar contactos.");
    } finally {
      setIsExportingCsv(false);
    }
  };

  const exportUnifiedEmailsToCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const [membersData, leadsData] = await Promise.all([adminGetAllUsers(), adminGetLeads()]);
      const emailMap = new Map<string, string>();
      for (const m of membersData || []) {
        const email = (m.email || "").trim().toLowerCase();
        if (!email) continue;
        emailMap.set(email, (m.full_name || "").trim());
      }
      for (const l of leadsData || []) {
        const email = (l.email || "").trim().toLowerCase();
        if (!email) continue;
        const name = (l.name || "").trim();
        const existing = emailMap.get(email);
        if (!emailMap.has(email) || (!existing && name)) emailMap.set(email, name);
      }
      if (emailMap.size === 0) {
        alert("No se encontraron contactos para exportar.");
        return;
      }
      const rows = ["email,name"];
      emailMap.forEach((name, email) => {
        rows.push(`${email},${name ? `"${name.replace(/"/g, '""')}"` : '""'}`);
      });
      downloadCsv(`programbi_todos_los_contactos_sin_duplicados_${new Date().toISOString().split("T")[0]}.csv`, rows.join("\n"));
    } catch {
      alert("Error al exportar contactos unificados.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Formularios"
        description={`${total.toLocaleString("es-CL")} solicitudes de contacto`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportUnifiedEmailsToCSV} disabled={isExporting}>
              {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
              Todos sin duplicar
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExportingCsv}>
              {isExportingCsv ? <Loader2 className="animate-spin" /> : <Download />}
              Exportar CSV
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <PricingExperimentCard />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email, WhatsApp o mensaje"
            className="pl-8"
          />
        </div>
        <select
          value={leadType}
          onChange={(e) => setLeadType(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          {LEAD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <AdminTableWrap>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="w-10 px-3 py-2.5">
                  <SelectCheck checked={isAllSelected} onChange={toggleSelectAll} title="Seleccionar página" />
                </th>
                <th className="px-3 py-2.5 font-medium">Contacto</th>
                <th className="px-3 py-2.5 font-medium">Tipo</th>
                <th className="px-3 py-2.5 font-medium hidden lg:table-cell">A/B</th>
                <th className="px-3 py-2.5 font-medium">Detalle</th>
                <th className="px-3 py-2.5 font-medium hidden md:table-cell">Mensaje</th>
                <th className="px-3 py-2.5 font-medium">Fecha</th>
                <th className="px-3 py-2.5 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td colSpan={8} className="px-3 py-3">
                      <div className="h-4 w-full max-w-md rounded bg-muted animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <AdminEmpty title="Sin formularios" description="Aún no hay solicitudes con estos filtros." />
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/40 align-top">
                    <td className="px-3 py-2.5">
                      <SelectCheck checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleSelectLead(lead.id)} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{lead.name || "Sin nombre"}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                      {lead.whatsapp ? (
                        <a
                          href={`https://wa.me/${String(lead.whatsapp).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] hover:underline"
                        >
                          {lead.whatsapp}
                        </a>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] text-muted-foreground">
                        {lead.lead_type === "enterprise"
                          ? "Empresa"
                          : lead.lead_type === "notify"
                          ? "Notificar"
                          : "Contacto"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 hidden lg:table-cell text-[11px] text-muted-foreground">
                      {lead.pricing_variant === "direct" ? "Vio precio" : lead.pricing_variant === "gate" ? "Candado" : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(lead.selected_courses || []).map((c: string, i: number) => (
                          <span key={i} className="text-[11px] border border-border rounded px-1.5 py-0.5">
                            {c}
                          </span>
                        ))}
                      </div>
                      {lead.source_course ? (
                        <div className="text-[11px] text-muted-foreground mt-1">{lead.source_course}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell max-w-xs">
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap break-words line-clamp-4">
                        {lead.message || "—"}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("es-CL")}
                      <div className="text-[11px]">
                        {new Date(lead.created_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <HoldToDeleteButton
                        compact
                        onConfirm={() => handleDeleteLead(lead.id)}
                        loading={deletingLeadId === lead.id}
                        disabled={deletingLeadId !== null || isBulkDeleting}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
      </AdminTableWrap>

      {selectedLeadIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-lg border border-border bg-foreground text-background px-3 py-2 shadow-lg">
          <span className="text-xs font-medium px-1">{selectedLeadIds.length} seleccionados</span>
          <div className="w-40">
            <HoldToDeleteButton
              label={`Eliminar (${selectedLeadIds.length})`}
              onConfirm={handleBulkDeleteLeads}
              loading={isBulkDeleting}
            />
          </div>
          <Button variant="ghost" size="sm" className="text-background hover:bg-background/10" onClick={() => setSelectedLeadIds([])}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
