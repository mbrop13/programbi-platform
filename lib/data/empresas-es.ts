/**
 * Contenido propio de /es/empresas.
 *
 * La página de empresas de Chile habla de factura electrónica chilena, OC y
 * minería; para equipos en España el copy se adapta a horario laboral CET/CEST,
 * ERPs españoles (Holded, Sage, A3ERP, Dynamics 365, SAP), RGPD/LOPDGDD y
 * transparencia sobre FUNDAE (no bonificable, con factura internacional en USD).
 */
import type { EmpresaFaq } from "@/lib/data/empresas-faqs";

export const ISO_EMPRESAS_ES = "es";

export const HERO_EMPRESAS_ES = {
  kicker: "Formación para empresas · España",
  titulo: "Formación in-company en Power BI, SQL, Python e IA en España",
  descripcion:
    "Programas cerrados en directo para equipos en España, 100 % en horario laboral peninsular (CET/CEST). Trabajamos con vuestros propios datos y ERPs, con factura internacional en USD.",
  nota: "Horario laboral español (CET/CEST) · No bonificable por FUNDAE · Factura internacional deducible.",
} as const;

export const INCLUDES_EMPRESAS_ES = [
  {
    title: "En directo en horario laboral (CET/CEST)",
    text: "A diferencia de las cohortes abiertas, los programas in-company se imparten en la jornada laboral de tu equipo en España.",
  },
  {
    title: "Con vuestros ERPs y datos",
    text: "Prácticas sobre exportaciones reales de Holded, Sage, A3ERP, Dynamics 365 Business Central, SAP o vuestras hojas de Excel.",
  },
  {
    title: "Factura internacional en USD",
    text: "Propuesta por escrito, informe de asistencia y factura corporativa internacional para gasto deducible (no bonificable por FUNDAE).",
  },
  {
    title: "Autonomía real del equipo",
    text: "El departamento sale construyendo y manteniendo sus propios cuadros de mando sin depender de consultores externos para cada cambio.",
  },
] as const;

export const VERTICALS_EMPRESAS_ES = [
  {
    sector: "Finanzas y Control de Gestión",
    title: "Cierre mensual, tesorería y fiscalidad sin Excel manual",
    deliverables: [
      "Cuadros de mando de cuenta de resultados (PyG), desviaciones presupuestarias y margen por centro de coste.",
      "Previsión de tesorería, control de cobros y conciliación automatizada desde Holded, Sage, A3ERP o Dynamics 365.",
      "Modelos en Power Query y DAX replicables por el equipo financiero y listos para auditoría interna.",
    ],
  },
  {
    sector: "Retail, E-commerce y Logística",
    title: "Rotación de stock, márgenes y puntualidad de entrega",
    deliverables: [
      "Control omnicanal de sell-through, tallas, devoluciones y roturas de stock entre tienda física y canal online.",
      "Análisis de tiempos de tránsito, ocupación de muelles y rentabilidad por ruta desde TMS y SGA.",
      "Integración automatizada de TPV, plataformas e-commerce y ERP comercial sin consolidaciones manuales.",
    ],
  },
  {
    sector: "Turismo, Energía y Servicios",
    title: "Ocupación hotelera, generación energética y rentabilidad",
    deliverables: [
      "Seguimiento de ocupación, ADR, RevPAR y coste de plantilla por establecimiento y temporada.",
      "Control de producción renovable, desvíos frente a previsión y márgenes frente a precios horarios de OMIE.",
      "Reporting operativo y de RR. HH. con anonimización de datos personales conforme al RGPD y la LOPDGDD.",
    ],
  },
] as const;

export const FAQS_EMPRESAS_ES: EmpresaFaq[] = [
  {
    q: "¿En qué horario se imparte la formación in-company en España?",
    a: "Los programas cerrados para empresas se programan íntegramente en horario laboral de España (CET en invierno / CEST en verano; adaptado también a equipos en Canarias). A diferencia de las cohortes abiertas que se dictan desde Chile en horario nocturno español, el formato in-company se ajusta al calendario y franja de tu empresa.",
  },
  {
    q: "¿La formación para empresas es bonificable por FUNDAE?",
    a: "No. ProgramBI SPA es una entidad radicada en Chile y nuestra formación no está acreditada ni es bonificable a través de FUNDAE. A cambio, emitimos una factura corporativa internacional en dólares (USD) con el detalle de horas y temario para que la empresa pueda contabilizarla como gasto deducible de formación.",
  },
  {
    q: "¿Trabajáis con los datos reales de nuestros sistemas?",
    a: "Sí. Adaptamos los casos prácticos a las tablas, KPIs y flujos del departamento: exportaciones de Holded, Sage, A3ERP, Dynamics 365 Business Central, SAP o bases SQL. El equipo termina la formación con modelos útiles para su trabajo diario.",
  },
  {
    q: "¿Cómo garantizáis el cumplimiento del RGPD y la LOPDGDD?",
    a: "Trabajamos bajo acuerdo de confidencialidad y pautas estrictas de minimización de datos: en los ejercicios de clase utilizamos muestras anonimizadas (sin DNI/NIE reales, nombres de clientes ni nóminas identificables), cumpliendo con los criterios del RGPD europeo y la LOPDGDD española.",
  },
  {
    q: "¿Cómo se presupuesta y en qué moneda se factura?",
    a: "Mantenemos una reunión breve de 20 a 30 minutos para entender el área, el número de asistentes y los objetivos técnicos. Después enviamos una propuesta cerrada por escrito con temario, calendario en horario español, importe en dólares (USD) y condiciones de pago por transferencia internacional o tarjeta corporativa.",
  },
  {
    q: "¿Qué duración y niveles tienen los programas corporativos?",
    a: "Cada módulo estándar tiene una carga de 20 horas (básico-intermedio o avanzado en Power BI, SQL Server, Python, Excel o IA), y también diseñamos itinerarios combinados de 40 o 60 horas según el punto de partida del equipo.",
  },
  {
    q: "¿Se entrega certificado e informe de asistencia?",
    a: "Sí. Cada participante recibe un certificado digital verificable de ProgramBI SPA al completar el programa, y el área de RR. HH. o dirección recibe el informe de asistencia por sesión junto con el acceso a las grabaciones en HD.",
  },
  {
    q: "¿Qué ocurre si solo queremos formar a una o dos personas?",
    a: "Para 1 o 2 personas suele resultar más ágil inscribirse en nuestros cursos abiertos en /es/cursos, donde el precio en USD es directo y las clases quedan grabadas en HD en el campus virtual para seguirlas a su ritmo sin depender del horario nocturno.",
  },
];
