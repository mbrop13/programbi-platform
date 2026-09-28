import fs from "fs";
import path from "path";

const pages = [
  {
    slug: "miembros",
    content: `import AdminMembersPage from "@/components/admin/members";

export default function Page() {
  return <AdminMembersPage />;
}
`,
  },
  {
    slug: "formularios",
    content: `import AdminLeadsPage from "@/components/admin/leads";

export default function Page() {
  return <AdminLeadsPage />;
}
`,
  },
  {
    slug: "asistencia",
    import: 'import ClassTrackingTab from "@/components/comunidad/tabs/admin/ClassTrackingTab";',
    jsx: "<ClassTrackingTab />",
  },
  { slug: "soporte", name: "AdminSupport" },
  { slug: "empresas", name: "AdminCompanies" },
  {
    slug: "empleos",
    import: 'import AdminEmpleos from "@/components/comunidad/tabs/admin/AdminEmpleos";',
    jsx: "<AdminEmpleos />",
  },
  {
    slug: "referidos",
    import: 'import AdminReferidos from "@/components/comunidad/tabs/admin/AdminReferidos";',
    jsx: "<AdminReferidos />",
  },
  { slug: "precios", name: "AdminPrices" },
  { slug: "carritos", name: "AdminAbandonedCarts" },
  {
    slug: "cursos",
    import: 'import AdminCourses from "@/components/comunidad/tabs/admin/AdminCourses";',
    jsx: "<AdminCourses />",
  },
  { slug: "asesorias", name: "AdminAsesorias" },
  { slug: "vivo", name: "AdminLiveClasses" },
  { slug: "horarios", name: "AdminSchedules" },
  { slug: "exportar", name: "AdminExportCsv" },
  { slug: "importar", name: "AdminImport" },
  { slug: "planes", name: "AdminPlans" },
  { slug: "popups", name: "AdminPopups" },
  { slug: "blog", name: "AdminNewsletter" },
  { slug: "diplomas", name: "AdminDiplomas" },
  { slug: "configuracion", name: "AdminSettings" },
];

function legacyPage(name) {
  return `import { ${name} } from "@/components/admin/legacy-tabs";
import { AdminLegacyFrame } from "@/components/admin/ui";

export default function Page() {
  return (
    <AdminLegacyFrame>
      <${name} />
    </AdminLegacyFrame>
  );
}
`;
}

function framePage(imp, jsx) {
  return `${imp}
import { AdminLegacyFrame } from "@/components/admin/ui";

export default function Page() {
  return (
    <AdminLegacyFrame>
      ${jsx}
    </AdminLegacyFrame>
  );
}
`;
}

for (const page of pages) {
  const dir = path.join("app/(admin)/admin", page.slug);
  fs.mkdirSync(dir, { recursive: true });
  let content = page.content;
  if (!content && page.name) content = legacyPage(page.name);
  if (!content) content = framePage(page.import, page.jsx);
  fs.writeFileSync(path.join(dir, "page.tsx"), content);
  console.log("wrote", page.slug);
}
