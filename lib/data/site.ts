export const WA_URL =
  "https://wa.me/56935409699?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos%20de%20ProgramBI.";

export const WA_NUMBER = "56935409699";

export const logos = [
  { name: "Tottus", src: "/images/logos/tottus.png" },
  { name: "Deloitte", src: "/images/logos/deloitte.png" },
  { name: "Cencosud", src: "/images/logos/cencosud.png" },
  { name: "BASF", src: "/images/logos/basf.png" },
  { name: "SQM", src: "/images/logos/sqm.png" },
  { name: "BCI", src: "/images/logos/bci.png" },
  { name: "Midea", src: "/images/logos/midea.png" },
  { name: "Pucobre", src: "/images/logos/pucobre.png" },
  { name: "Fonasa", src: "/images/logos/fonasa.png" },
  { name: "CGE", src: "/images/logos/cge.png" },
  { name: "Chilevisión", src: "/images/logos/chilevision.png" },
] as const;

export const programs = [
  {
    slug: "analisis-de-datos",
    name: "Análisis de Datos",
    hours: "144 h",
    line: "Programa integral de SQL Server, Power BI y Python.",
    image: "/images/courses/analisis-de-datos.jpg",
    href: "/cursos/analisis-de-datos",
  },
  {
    slug: "power-bi",
    name: "Power BI",
    hours: "16 h por nivel",
    line: "Dashboards, DAX y modelado para decisiones.",
    image: "/images/courses/power-bi.jpg",
    href: "/cursos/power-bi",
  },
  {
    slug: "sql-server",
    name: "SQL Server",
    hours: "16 h por nivel",
    line: "Consultas, procedimientos y arquitectura de datos.",
    image: "/images/courses/sql-server.jpg",
    href: "/cursos/sql-server",
  },
  {
    slug: "python",
    name: "Python para Datos",
    hours: "16 h por nivel",
    line: "Pandas y análisis aplicado a negocios reales.",
    image: "/images/courses/python.jpg",
    href: "/cursos/python",
  },
] as const;

export const leadCourses = [
  "Análisis de Datos",
  "Power BI",
  "Python",
  "SQL Server",
  "Excel",
  "Machine Learning",
  "IA en Productividad",
  "Power Automate",
  "Minería",
  "Finanzas",
  "Copilot",
] as const;

export const homeFaqs = [
  {
    q: "¿Necesito saber programar?",
    a: "No. Partimos desde cero. La metodología está pensada para profesionales de finanzas, operaciones, minería y administración que quieren trabajar con datos sin depender de TI.",
  },
  {
    q: "¿Cómo son las clases?",
    a: "En vivo por Zoom, dos horas por sesión, en horario vespertino Chile. Todas las clases quedan grabadas de por vida.",
  },
  {
    q: "¿Qué pasa si falto a una clase?",
    a: "Ves la grabación cuando quieras. El material y las clases quedan en el campus sin límite de tiempo.",
  },
  {
    q: "¿Hay certificado?",
    a: "Sí. Al finalizar el curso recibes un certificado digital.",
  },
] as const;
