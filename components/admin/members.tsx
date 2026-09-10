"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Globe, GraduationCap, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  adminGetUsersPage,
  adminGetCourseOptions,
  adminGetUserEnrollments,
  adminEnrollUser,
  adminRemoveEnrollment,
  adminUpdateUserRole,
  adminDeleteUser,
  adminBulkDeleteUsers,
  adminGetAllUsers,
  adminGetLeads,
} from "@/lib/supabase/comunidad-ai";
import { adminUpdateUserSubscription } from "@/lib/supabase/comunidad";
import {
  formatRegistrationSource,
  matchesRegistrationSourceFilter,
  REGISTRATION_SOURCE_FILTERS,
  type RegistrationSourceCategory,
} from "@/lib/registration-source";
import { HoldToDeleteButton } from "./HoldToDeleteButton";
import { AdminEmpty, AdminPageHeader, AdminPagination, AdminTableWrap, SelectCheck } from "./ui";

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  created_at: string | null;
  registration_source: string | null;
  pricing_variant: string | null;
  subscription_plan: string | null;
  subscription_expires_at: string | null;
};

const PAGE_SIZE = 50;

function useDebounced<T>(value: T, delay = 280) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminMembersPage() {
  const [users, setUsers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<RegistrationSourceCategory>("all");
  const debouncedSearch = useDebounced(searchQuery);

  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollType, setEnrollType] = useState("full");
  const [subPlan, setSubPlan] = useState("none");
  const [subExpiresAt, setSubExpiresAt] = useState("");
  const [updatingSub, setUpdatingSub] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPage, setIsExportingPage] = useState(false);
  const markedViewed = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetUsersPage({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        source: sourceFilter,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sourceFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sourceFilter]);

  useEffect(() => {
    if (markedViewed.current) return;
    markedViewed.current = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("admin_views").upsert({
            admin_id: user.id,
            members_last_viewed_at: new Date().toISOString(),
          });
          window.dispatchEvent(new Event("adminViewsUpdated"));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const selectUser = async (user: Member) => {
    setSelectedUser(user);
    setSubPlan(user.subscription_plan || "none");
    setSubExpiresAt(user.subscription_expires_at ? user.subscription_expires_at.split("T")[0] : "");
    setLoadingEnrollments(true);
    try {
      const [enrolls, courseData] = await Promise.all([
        adminGetUserEnrollments(user.id),
        courses.length ? Promise.resolve(courses) : adminGetCourseOptions(),
      ]);
      setUserEnrollments(enrolls);
      if (!courses.length) setCourses(courseData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = new Set(users.map((u) => u.id));
      setSelectedUserIds((prev) => prev.filter((id) => !currentIds.has(id)));
    } else {
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...users.map((u) => u.id)])));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (deletingUserId) return;
    setDeletingUserId(userId);
    try {
      const res = await adminDeleteUser(userId);
      if (res && !res.success) {
        alert(res.error || "No se pudo eliminar el miembro.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
      setTotal((n) => Math.max(0, n - 1));
      if (selectedUser?.id === userId) setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || "Error al eliminar miembro.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);
    try {
      const res = await adminBulkDeleteUsers(selectedUserIds);
      if (res && !res.success) {
        alert(res.error || "Error al eliminar miembros.");
        return;
      }
      const deleted = new Set(selectedUserIds);
      setUsers((prev) => prev.filter((u) => !deleted.has(u.id)));
      setTotal((n) => Math.max(0, n - selectedUserIds.length));
      if (selectedUser && deleted.has(selectedUser.id)) setSelectedUser(null);
      setSelectedUserIds([]);
    } catch (err: any) {
      alert(err.message || "Error al eliminar miembros.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser || updatingSub) return;
    setUpdatingSub(true);
    try {
      const planVal = subPlan === "none" ? null : subPlan;
      const expiresVal = subExpiresAt ? new Date(subExpiresAt).toISOString() : null;
      const res = await adminUpdateUserSubscription(selectedUser.id, planVal, expiresVal);
      if (res && !res.success) {
        alert(res.error || "Error al actualizar suscripción.");
        return;
      }
      const updatedUser = { ...selectedUser, subscription_plan: planVal, subscription_expires_at: expiresVal };
      setSelectedUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
    } catch (err: any) {
      alert(err.message || "Error al actualizar suscripción.");
    } finally {
      setUpdatingSub(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedUser || !enrollCourseId) return;
    try {
      await adminEnrollUser(selectedUser.id, enrollCourseId, enrollType);
      const enrolls = await adminGetUserEnrollments(selectedUser.id);
      setUserEnrollments(enrolls);
      setEnrollCourseId("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveEnrollment = async (courseSlug: string) => {
    if (!selectedUser) return;
    try {
      await adminRemoveEnrollment(selectedUser.id, courseSlug);
      setUserEnrollments((prev) => prev.filter((e) => e.course_slug !== courseSlug));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await adminUpdateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, role });
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = async () => {
    if (isExportingPage) return;
    setIsExportingPage(true);
    try {
      const all = await adminGetAllUsers();
      const filtered = all.filter((u: Member) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (u.full_name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.phone || "").toLowerCase().includes(q);
        return matchesSearch && matchesRegistrationSourceFilter(u.registration_source, sourceFilter);
      });
      if (filtered.length === 0) {
        alert("No hay miembros para exportar.");
        return;
      }
      const head = ["email", "name", "ID", "Teléfono", "Rol", "Origen Registro", "Ruta Origen", "Variante precio", "Fecha Registro"];
      const rows = filtered.map((u: Member) =>
        [
          u.email || "",
          `"${(u.full_name || "").replace(/"/g, '""')}"`,
          u.id,
          u.phone || "",
          u.role || "student",
          `"${formatRegistrationSource(u.registration_source).replace(/"/g, '""')}"`,
          `"${(u.registration_source || "").replace(/"/g, '""')}"`,
          u.pricing_variant === "direct" ? "Vio precio" : u.pricing_variant === "gate" ? "Candado" : "",
          u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL") : "",
        ].join(",")
      );
      downloadCsv(`programbi_miembros_${new Date().toISOString().split("T")[0]}.csv`, [head.join(","), ...rows].join("\n"));
    } catch {
      alert("Error al exportar miembros.");
    } finally {
      setIsExportingPage(false);
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
        title="Miembros"
        description={`${total.toLocaleString("es-CL")} usuarios registrados`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportUnifiedEmailsToCSV} disabled={isExporting}>
              {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
              Todos sin duplicar
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExportingPage}>
              {isExportingPage ? <Loader2 className="animate-spin" /> : <Download />}
              Exportar CSV
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono"
            className="pl-8"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as RegistrationSourceCategory)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          {REGISTRATION_SOURCE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
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
                <th className="px-3 py-2.5 font-medium">Usuario</th>
                <th className="px-3 py-2.5 font-medium">Contacto</th>
                <th className="px-3 py-2.5 font-medium">Rol</th>
                <th className="px-3 py-2.5 font-medium hidden md:table-cell">Origen</th>
                <th className="px-3 py-2.5 font-medium hidden lg:table-cell">A/B</th>
                <th className="px-3 py-2.5 font-medium hidden sm:table-cell">Alta</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <AdminEmpty title="Sin miembros" description="Prueba otro filtro o término de búsqueda." />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => selectUser(u)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer"
                  >
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <SelectCheck checked={selectedUserIds.includes(u.id)} onChange={() => toggleSelectUser(u.id)} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-md bg-muted text-[11px] font-medium flex items-center justify-center shrink-0">
                          {(u.full_name || u.email || "?")[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium truncate">{u.full_name || "Sin nombre"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-muted-foreground truncate max-w-[220px]">{u.email || "—"}</div>
                      {u.phone ? (
                        <a
                          href={`https://wa.me/${u.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-foreground/70 hover:underline"
                        >
                          {u.phone}
                        </a>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      <RolePill role={u.role} />
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground max-w-[180px] truncate" title={u.registration_source || ""}>
                        <Globe className="size-3 shrink-0" />
                        {formatRegistrationSource(u.registration_source)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 hidden lg:table-cell">
                      <AbPill value={u.pricing_variant} />
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell text-muted-foreground text-xs whitespace-nowrap">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <HoldToDeleteButton
                        compact
                        onConfirm={() => handleDeleteUser(u.id)}
                        loading={deletingUserId === u.id}
                        disabled={deletingUserId !== null || isBulkDeleting}
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

      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-lg border border-border bg-foreground text-background px-3 py-2 shadow-lg">
          <span className="text-xs font-medium px-1">{selectedUserIds.length} seleccionados</span>
          <div className="w-40">
            <HoldToDeleteButton
              label={`Eliminar (${selectedUserIds.length})`}
              onConfirm={handleBulkDelete}
              loading={isBulkDeleting}
            />
          </div>
          <Button variant="ghost" size="sm" className="text-background hover:bg-background/10" onClick={() => setSelectedUserIds([])}>
            Cancelar
          </Button>
        </div>
      )}

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto bg-surface">
          {selectedUser && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>{selectedUser.full_name || "Sin nombre"}</SheetTitle>
                <SheetDescription>{selectedUser.email}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-8 space-y-6">
                {selectedUser.phone && (
                  <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                    <Globe className="size-3" />
                    {formatRegistrationSource(selectedUser.registration_source)}
                  </span>
                  <AbPill value={selectedUser.pricing_variant} />
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rol</label>
                  <select
                    value={selectedUser.role || "student"}
                    onChange={(e) => handleChangeRole(selectedUser.id, e.target.value)}
                    className="mt-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    <option value="student">Estudiante</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Cursos</h4>
                  {loadingEnrollments ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      {userEnrollments.length === 0 ? (
                        <p className="text-sm text-muted-foreground mb-3">Sin cursos asignados</p>
                      ) : (
                        <div className="space-y-1.5 mb-3">
                          {userEnrollments.map((e: any) => (
                            <div key={e.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <GraduationCap className="size-3.5 shrink-0 text-muted-foreground" />
                                <span className="text-sm truncate">{e.course?.title || e.course_slug}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveEnrollment(e.course_slug)}
                                className="text-muted-foreground hover:text-destructive p-1"
                                aria-label="Quitar curso"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <select
                          value={enrollCourseId}
                          onChange={(e) => setEnrollCourseId(e.target.value)}
                          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                        >
                          <option value="">Seleccionar curso…</option>
                          {courses
                            .filter((c) => !userEnrollments.some((e: any) => e.course_slug === c.slug))
                            .map((c: any) => (
                              <option key={c.id} value={c.slug}>
                                {c.title} {c.is_hidden ? "(oculto)" : ""}
                              </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                          <select
                            value={enrollType}
                            onChange={(e) => setEnrollType(e.target.value)}
                            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                          >
                            <option value="full">Completo</option>
                            <option value="trial">Prueba</option>
                            <option value="free">Gratis</option>
                          </select>
                          <Button size="sm" onClick={handleEnroll} disabled={!enrollCourseId}>
                            Activar
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Suscripción</h4>
                  <div className="space-y-2">
                    <select
                      value={subPlan}
                      onChange={(e) => setSubPlan(e.target.value)}
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    >
                      <option value="none">Sin suscripción</option>
                      <option value="trial">Prueba</option>
                      <option value="premium">Premium</option>
                      <option value="ultra">Ultra</option>
                    </select>
                    <Input type="date" value={subExpiresAt} onChange={(e) => setSubExpiresAt(e.target.value)} />
                    <Button size="sm" onClick={handleUpdateSubscription} disabled={updatingSub}>
                      {updatingSub && <Loader2 className="animate-spin" />}
                      Guardar plan
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Elimina la cuenta de {selectedUser.full_name || selectedUser.email} y revoca sus accesos.
                  </p>
                  <HoldToDeleteButton
                    onConfirm={() => handleDeleteUser(selectedUser.id)}
                    label="Mantén para eliminar"
                    loading={deletingUserId === selectedUser.id}
                    disabled={deletingUserId !== null}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RolePill({ role }: { role: string | null }) {
  const value = role || "student";
  return (
    <span className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[11px] capitalize text-muted-foreground">
      {value}
    </span>
  );
}

function AbPill({ value }: { value: string | null }) {
  if (value === "direct") {
    return <span className="text-[11px] text-muted-foreground">Vio precio</span>;
  }
  if (value === "gate") {
    return <span className="text-[11px] text-muted-foreground">Candado</span>;
  }
  return <span className="text-[11px] text-muted-foreground/50">—</span>;
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
