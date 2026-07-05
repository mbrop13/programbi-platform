export interface CommunityPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  highlight?: string;
  description: string;
  features: string[];
  courseAccessLevel: "Básico" | "Intermedio" | "Avanzado";
  aiLimitMultiplier: number;
  discountPercentage: number;
  color: string;
  priceSemiannual?: number;
  priceAnnual?: number;
}

export const communityPlans: CommunityPlan[] = [
  {
    id: "pro",
    name: "Plan Pro",
    price: 39990,
    originalPrice: 49990,
    description: "Inicia tu camino en los datos con acceso a la comunidad y cursos base.",
    features: [
      "Acceso completo a la red social y foros",
      "Acceso a todos los cursos de nivel Básico (Python, SQL, Power BI, Excel)",
      "Consultas al Asistente IA (Límite Base)",
      "20% de descuento en módulos extras (10% especializaciones)",
    ],
    courseAccessLevel: "Básico",
    aiLimitMultiplier: 1,
    discountPercentage: 20,
    color: "#3B82F6", // blue-500
    priceSemiannual: 216000,
    priceAnnual: 336000,
  },
  {
    id: "max",
    name: "Plan Max",
    price: 75990,
    highlight: "MÁS POPULAR",
    description: "Para profesionales que buscan acelerar sus habilidades analíticas.",
    features: [
      "Todo lo del Plan Pro",
      "Acceso a cursos nivel Intermedio",
      "Tus consultas al Asistente IA crecen 3x",
      "25% de descuento en módulos extras (12.5% especializaciones)",
      "Acceso a Masterclasses en vivo"
    ],
    courseAccessLevel: "Intermedio",
    aiLimitMultiplier: 3,
    discountPercentage: 25,
    color: "#8B5CF6", // violet-500
    priceSemiannual: 410000,
    priceAnnual: 638000,
  },
  {
    id: "ultra",
    name: "Plan Ultra",
    price: 149990,
    description: "El arsenal completo para dominar los datos a nivel experto.",
    features: [
      "Todo lo del Plan Max",
      "Acceso a cursos nivel Avanzado",
      "Tus consultas al Asistente IA crecen 10x",
      "Prioridad en respuestas del Asistente IA",
      "40% de descuento en módulos extras (20% especializaciones)",
      "💬 Chat integrado directo con profesores",
      "✓ Certificados al finalizar niveles"
    ],
    courseAccessLevel: "Avanzado",
    aiLimitMultiplier: 10,
    discountPercentage: 40,
    color: "#F59E0B", // amber-500
    priceSemiannual: 809000,
    priceAnnual: 1250000,
  }
];
