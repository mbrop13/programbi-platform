export function buildProjectBrief(input: {
  title?: string;
  description?: string;
  projectType?: string;
  style?: string;
  [key: string]: unknown;
} = {}): string {
  const title = input.title || "Proyecto";
  const description = input.description || "";
  const projectType = input.projectType || "web";
  const style = input.style || "modern";
  return [
    `Proyecto: ${title}`,
    `Tipo: ${projectType}`,
    `Estilo: ${style}`,
    description ? `Descripción: ${description}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
