export interface Mentor {
  name: string;
  role: string;
  title: string;
  credentials: string[];
  icon: string;
  linkedinUrl?: string;
  imageUrl?: string;
  isFounder: boolean;
  founderBio?: string;
  founderAcademics?: string[];
  founderCareer?: string[];
  sortOrder: number;
}

export const mentors: Mentor[] = [
  {
    name: "Manuel Oliva",
    role: "CEO ProgramBI",
    title: "Fundador y Director",
    credentials: [
      "Magíster en Data Science, UAI.",
      "Docente de Econometría y TI.",
      "Experto en Riesgo Financiero.",
    ],
    icon: "UserCheck",
    linkedinUrl: "https://www.linkedin.com/in/manuel-oliva-riesgo-inversion/",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-8ae05cd1-dc25-44fb-9a7b-f1a78a0f121a.png?v=1720126074",
    isFounder: true,
    founderBio:
      "Lidero un equipo dedicado a empoderar empresas con herramientas de datos avanzadas. Con años de experiencia como consultor en análisis y visualización, he desarrollado dashboards personalizados integrando web, servidores y bases de datos. Mi enfoque práctico ha ayudado a compañías líderes en Minería, Finanzas y Retail a optimizar procesos críticos y tomar decisiones informadas.",
    founderAcademics: [
      "Magíster en Data Science (UAI)",
      "Diplomado en Derivados Financieros (UAI)",
      "Contador Auditor (U. de Concepción)",
    ],
    founderCareer: [
      "Profesor MBA y Magíster TI (U. Gabriela Mistral)",
      "Ex-Mesa de Dinero Banco Itaú Chile",
      "Ex-Gerente de Riesgos Renta 4",
    ],
    sortOrder: 1,
  },
  {
    name: "Emanuel Berrocal",
    role: "Portfolio Manager",
    title: "Ingeniero Civil Matemático",
    credentials: [
      "Ing. Civil Matemático, U. Chile.",
      "Diplomado en Estadísticas UC.",
      "Portfolio Manager en Banco Itaú.",
    ],
    icon: "BarChart3",
    isFounder: false,
    sortOrder: 2,
  },
  {
    name: "Joaquin Villagra",
    role: "Especialista IA",
    title: "MSc. Inteligencia Artificial",
    credentials: [
      "MSc. Inteligencia Artificial.",
      "Magíster Ing. Informática.",
      "Docente Postgrado UAI.",
    ],
    icon: "Brain",
    isFounder: false,
    sortOrder: 3,
  },
  {
    name: "Rodrigo Vega",
    role: "Analista BI",
    title: "Ingeniero Comercial",
    credentials: [
      "Ingeniero Comercial, U. Chile.",
      "Analista BI Infracommerce.",
      "Experto en Visualización.",
    ],
    icon: "Monitor",
    isFounder: false,
    sortOrder: 4,
  },
];

export const companyLogos = [
  { name: "Tottus", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-532dc851-5dac-4ef4-a6a0-7fb6b41a71f2.png?v=1720130366" },
  { name: "Midea", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-75c98aad-4fce-43ec-9ea7-38324baebc9f.png?v=1720130314" },
  { name: "Pucobre", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-67f9068f-0902-40d6-ae3f-6eca768dcd8d.png?v=1720128420" },
  { name: "Deloitte", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-a53761b3-b596-4a00-bbe2-a09ac193d34e.png?v=1720127578" },
  { name: "Cencosud", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-cc9e718a-0ff7-4910-997b-16c522ad5f24.png?v=1720127509" },
  { name: "BASF", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-b42b5f15-4107-4fe3-bde0-4c088b7069e2.png?v=1720127388" },
  { name: "SQM", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Sociedad_Quimica_y_Minera_logo_svg.png?v=1750694554" },
  { name: "BCI", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Bci_Logotype_svg.png?v=1750694554" },
];

export const faqItems = [
  {
    question: "¿Necesito experiencia previa en programación?",
    answer:
      "No, en absoluto. Nuestra metodología está diseñada para que puedas empezar desde cero. Te guiaremos paso a paso para que adquieras todos los fundamentos de la programación y el análisis de datos.",
  },
  {
    question: "¿Cuál es la modalidad de las clases?",
    answer:
      "El bootcamp se imparte en modalidad online con clases en directo. Esto te permite interactuar con los profesores y compañeros en tiempo real. Además, todas las clases quedan grabadas para que puedas repasarlas cuando quieras en nuestro campus virtual.",
  },
  {
    question: "¿Qué pasa si no puedo asistir a una clase en vivo?",
    answer:
      "No hay problema. Todas las clases en directo se graban y se suben a nuestra plataforma. Tendrás acceso ilimitado a las grabaciones y a todo el material del curso para que puedas estudiar a tu propio ritmo.",
  },
  {
    question: "¿Obtendré un certificado?",
    answer:
      "Sí. Al completar cada módulo obtendrás un certificado y, al finalizar el bootcamp y presentar tu Capstone Project, recibirás el certificado final del \"Bootcamp en Data Analytics & Inteligencia Artificial\" que acredita todas las competencias adquiridas.",
  },
];

export const galleryImages = [
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Dashboard_Cursos_Power_BI.png?v=1770535026",
    alt: "Dashboard Principal Power BI",
    label: "Dashboard Power BI",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Foto_Modelo_de_Datos_en_Power_BI.png?v=1770535026",
    alt: "Modelo de Datos",
    label: "Modelo de Datos",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Power_Query_en_Power_BI.png?v=1770535026",
    alt: "Power Query ETL",
    label: "Power Query",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Python_Codigos_de_Clases.png?v=1770535025",
    alt: "Código Python",
    label: "Python Code",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Python_graficos_google_colab.png?v=1770535024",
    alt: "Gráficos Python",
    label: "Python Charts",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/SQL_Diseno_Consulta.png?v=1770535026",
    alt: "Diseño SQL",
    label: "SQL Queries",
  },
];
