import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "do",
  seo: {
    title: "Cursos de datos en vivo en Rep. Dominicana | ProgramBI",
    description:
      "Cursos en vivo de Power BI, SQL, Excel e IA para profesionales de República Dominicana. Clases por Zoom en hora de Santo Domingo y precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI y SQL en República Dominicana | ProgramBI",
      description:
        "Catálogo en vivo para República Dominicana: Power BI, SQL, Excel, Python e IA. Hora de Santo Domingo, precios en dólares y clases grabadas.",
    },
    faq: {
      title: "Preguntas frecuentes de cursos en RD | ProgramBI",
      description:
        "Horario de Santo Domingo, pago en dólares, equivalente en CLP, certificados y requisitos de los cursos en vivo de ProgramBI en República Dominicana.",
    },
    implementacion: {
      title: "Implementación Power BI en Rep. Dominicana | ProgramBI",
      description:
        "Tableros Power BI para turismo, zonas francas, retail y remesas en República Dominicana, con capacitación del equipo. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar Excel a Power BI en Rep. Dominicana | ProgramBI",
      description:
        "De planillas de ocupación, producción y ventas a tableros Power BI en República Dominicana. Curso abierto o proyecto in-company con tus datos.",
    },
    porQueFallan: {
      title: "Por qué fallan proyectos Power BI en RD | ProgramBI",
      description:
        "Qué revisar antes de un proyecto Power BI en República Dominicana: datos del e-CF, definiciones comunes y adopción. Cuándo conviene curso o consultora.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de República Dominicana",
      description:
        "Quiénes somos, cómo se siguen las clases en hora de Santo Domingo y qué encuentra un profesional dominicano en el campus de ProgramBI.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para República Dominicana",
    parrafo:
      "Academia en vivo por Zoom, en hora de Santo Domingo: Power BI, SQL, Excel e IA aplicada para turismo, zonas francas, retail y servicios financieros.",
    nota: "Clases en vivo · Horario de Santo Domingo · Precios en USD",
  },
  intro: {
    kicker: "Datos para la economía dominicana",
    titulo: "Temporada, turno y remesa: tres ritmos en el mismo tablero",
    parrafos: [
      "La economía dominicana combina negocios que se mueven a ritmos muy distintos: hoteles que viven de la temporada en Punta Cana y la costa, plantas de zonas francas que se miden por turno y línea, comercios que venden todos los días y servicios financieros que procesan remesas. Cada uno tiene su propio reporte, y casi nunca coinciden las definiciones.",
      "El curso enseña a ordenar esas fuentes en un modelo que se actualiza solo, partiendo del Comprobante Fiscal Electrónico de la DGII y del sistema de operación de cada negocio. Las clases se siguen en hora de Santo Domingo, quedan grabadas y el proyecto final se arma sobre un proceso del trabajo del alumno.",
    ],
  },
  casos: [
    {
      sector: "Turismo y hotelería",
      titulo: "Ocupación, tarifa promedio e ingreso por habitación",
      descripcion:
        "Comparar ocupación, tarifa e ingreso por habitación disponible por propiedad y temporada para decidir precios y canales de venta.",
      fuente: "PMS, motor de reservas y facturación.",
    },
    {
      sector: "Zonas francas y manufactura",
      titulo: "Rendimiento por línea y costo por turno",
      descripcion:
        "Seguir producción, eficiencia y costo por línea y turno para explicar desvíos frente al plan y al contrato con el cliente.",
      fuente: "Sistema de producción, control de calidad y ERP.",
    },
    {
      sector: "Remesas y servicios financieros",
      titulo: "Volumen por corredor y conciliación de pagos",
      descripcion:
        "Medir operaciones por origen, canal y agencia, y conciliar pagos entre sistemas sin cuadrar a mano cada cierre.",
      fuente: "Sistema transaccional, pasarelas y bases de agencias.",
    },
    {
      sector: "Retail y consumo",
      titulo: "Venta por canal e inventario por tienda",
      descripcion:
        "Cruzar venta por canal, inventario y margen por tienda en Santo Domingo, Santiago y el resto del país.",
      fuente: "Punto de venta, inventario y e-CF emitidos.",
    },
  ],
  referencias: [
    {
      nombre: "DGII (e-CF)",
      detalle: "Comprobante Fiscal Electrónico: la fuente que ordena ventas y compras en el cierre.",
    },
    {
      nombre: "ONE",
      detalle: "Oficina Nacional de Estadística: población, empleo y actividad para contextualizar indicadores.",
    },
    {
      nombre: "BCRD",
      detalle: "Tipo de cambio, turismo, remesas y series macroeconómicas para leer costos y márgenes en pesos dominicanos.",
    },
    {
      nombre: "Superintendencia de Bancos",
      detalle: "Información del sistema financiero, útil para equipos de banca, cobranza y riesgo.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares y pago con tarjeta o transferencia",
    resumen:
      "El catálogo para República Dominicana se publica en dólares (USD), aunque tus reportes de trabajo sigan en pesos dominicanos (DOP). La ficha de cada curso muestra el precio vigente.",
    nota: "Puedes pagar con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El cobro se procesa desde la cuenta de Chile: el checkout informa el equivalente en CLP antes de confirmar y tu banco define el cargo final en tu tarjeta.",
  },
  mercado: {
    ejemplo:
      "En República Dominicana el dato vive en los e-CF de la DGII, el sistema de reservas o de producción y la planilla comercial. El primer tablero suele mostrar ocupación o producción junto al margen, con una sola definición para operaciones y finanzas.",
    horario:
      "República Dominicana se mantiene en UTC-4 todo el año. La clase de 19:30 en Chile se ve a las 18:30 en Santo Domingo cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada cohorte muestra la hora exacta.",
    facturacion:
      "Los cursos se pagan en dólares con tarjeta o transferencia; el checkout informa el equivalente en CLP antes de confirmar. Los proyectos in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales dominicanos de turismo, zonas francas, retail y servicios financieros que necesitan pasar de reportes sueltos a un tablero común. Las clases se siguen en hora de Santo Domingo y quedan grabadas para repasarlas después.",
  },
  faqs: [
    {
      q: "¿Los casos incluyen turismo y zonas francas?",
      a: "Sí. Los escenarios de República Dominicana trabajan ocupación y tarifa por temporada, rendimiento por línea en zona franca, remesas por canal y venta por tienda. Son ejercicios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿A qué hora son las clases en República Dominicana?",
      a: "Las clases se dictan desde Chile de 19:30 a 21:30. República Dominicana está en UTC-4 todo el año, así que en Santo Domingo empiezan a las 18:30 cuando Chile está en horario de verano y a las 19:30 el resto del año. La ficha de cada curso indica la hora exacta.",
      categoria: "cursos",
    },
    {
      q: "¿Puedo practicar con datos de mis comprobantes e-CF?",
      a: "Sí. Modelar ventas y compras a partir de los comprobantes fiscales es un buen ejercicio de Power BI y SQL. Recomendamos anonimizar RNC y nombres de clientes antes de trabajar con datos reales en clase.",
      categoria: "cursos",
    },
    {
      q: "¿Cómo pago desde República Dominicana?",
      a: "Con Mercado Pago, tarjeta de crédito o débito internacional o transferencia en dólares. El precio se publica en USD y el cobro se procesa desde la cuenta de Chile: el checkout muestra el equivalente en CLP antes de confirmar y tu banco define el cargo final.",
      categoria: "pagos",
    },
    {
      q: "¿Hay descuentos o promociones?",
      a: `${resumenPreciosCatalogo("do")} El checkout confirma el monto final antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Trabajo en un hotel con turnos rotativos, puedo seguir el curso?",
      a: "Sí. Todas las clases quedan grabadas en el campus, así que puedes verlas cuando termine tu turno y traer tus dudas a la clase siguiente o al canal del curso.",
      categoria: "general",
    },
  ],
};

export default contenido;
