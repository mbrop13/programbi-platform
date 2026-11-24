import type { ContenidoPais } from "./tipos";
import { resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";

const contenido: ContenidoPais = {
  iso: "ni",
  seo: {
    title: "Cursos de análisis de datos en Nicaragua | ProgramBI",
    description:
      "Cursos en vivo de Power BI, Excel y datos para Nicaragua: café, ganadería, zona franca y comercio. Clases por Zoom en hora de Managua, precios en USD.",
  },
  seoPaginas: {
    cursos: {
      title: "Cursos Power BI, Excel y datos en Nicaragua | ProgramBI",
      description:
        "Catálogo en vivo para Nicaragua: Power BI, Excel, SQL y Python con clases grabadas y proyecto final. Horario de Managua y precios publicados en USD.",
    },
    faq: {
      title: "Preguntas frecuentes: cursos en Nicaragua | ProgramBI",
      description:
        "Horario en Managua, pagos en dólares y equivalente en CLP, certificado, grabaciones y requisitos de los cursos en vivo de ProgramBI para Nicaragua.",
    },
    implementacion: {
      title: "Implementación de Power BI en Nicaragua | ProgramBI",
      description:
        "Tableros Power BI para café, ganadería, zona franca y comercio en Nicaragua, con capacitación del equipo que los va a usar. Diagnóstico y propuesta.",
    },
    migrar: {
      title: "Migrar de Excel a Power BI en Nicaragua | ProgramBI",
      description:
        "De la planilla en córdobas y dólares a tableros Power BI con tipo de cambio ordenado. Curso abierto o proyecto in-company para equipos en Nicaragua.",
    },
    porQueFallan: {
      title: "Por qué fallan los proyectos Power BI en Nicaragua",
      description:
        "Qué revisar en un proyecto Power BI en Nicaragua: moneda, definiciones y adopción. Cuándo conviene curso abierto, consultora o un Pack de adopción.",
    },
    nosotros: {
      title: "ProgramBI para profesionales de Nicaragua",
      description:
        "Quiénes somos, cómo se siguen las clases en vivo desde Managua, León o Matagalpa y qué encuentra un profesional nicaragüense en el campus virtual.",
    },
  },
  hero: {
    h1: "Cursos de análisis de datos en vivo para Nicaragua",
    parrafo:
      "Clases en vivo por Zoom en hora de Managua: Power BI, Excel y análisis de datos para café, ganadería, zona franca y comercio.",
    nota: "Clases en vivo · Horario de Managua · Precios en USD",
  },
  intro: {
    kicker: "Datos para el mercado nicaragüense",
    titulo: "Dos monedas en la misma planilla: el primer orden que pide el reporte",
    parrafos: [
      "En Nicaragua muchas empresas registran en córdobas pero piensan en dólares: el precio del café, la venta de carne o el contrato de zona franca se pactan en USD y los costos locales se pagan en NIO. Cuando cada área convierte a su manera, el margen cambia según quién arma la planilla.",
      "El curso enseña a resolver eso una sola vez: una tabla de tipo de cambio con la referencia del BCN, un modelo que convierte con la misma regla para todos y un tablero que muestra el resultado en la moneda que pide cada reunión. Las clases se siguen en hora de Managua y el proyecto final se arma sobre un proceso del trabajo del alumno.",
    ],
  },
  casos: [
    {
      sector: "Café",
      titulo: "Acopio, rendimiento y precio por contrato",
      descripcion:
        "Seguir el café desde el acopio hasta el contrato de venta para comparar rendimiento, calidad y precio obtenido por cosecha y por productor.",
      fuente: "Registros de acopio y beneficio, contratos de exportación y planillas de campo.",
    },
    {
      sector: "Ganadería y carne",
      titulo: "Peso, rendimiento en canal y destino",
      descripcion:
        "Cruzar peso de compra, rendimiento en planta y precio por destino para ver qué lote y qué mercado dejan mejor margen.",
      fuente: "Báscula, sistema de planta y facturación de exportación.",
    },
    {
      sector: "Zona franca",
      titulo: "Cumplimiento de órdenes y costo por unidad",
      descripcion:
        "Medir avance de órdenes, reprocesos y costo por unidad en plantas textiles o de arneses para anticipar atrasos frente al cliente.",
      fuente: "Sistema de producción, control de calidad y planillas de despacho.",
    },
    {
      sector: "Comercio y distribución",
      titulo: "Venta por ruta, crédito y cobranza",
      descripcion:
        "Ordenar venta por ruta y cliente, y seguir el crédito otorgado y la cobranza para decidir a quién seguir vendiendo a plazo.",
      fuente: "Sistema de facturación, cartera de clientes y reportes de vendedores.",
    },
  ],
  referencias: [
    {
      nombre: "DGI",
      detalle: "Obligaciones tributarias y registro de compras y ventas que ordenan la información contable.",
    },
    {
      nombre: "BCN",
      detalle: "Tipo de cambio oficial del córdoba e indicadores económicos para convertir y comparar con una regla común.",
    },
    {
      nombre: "INIDE",
      detalle: "Estadísticas de población, precios y empleo para contextualizar ventas y mercado.",
    },
    {
      nombre: "SIBOIF",
      detalle: "Información del sistema financiero útil para reportes de cartera en bancos y microfinancieras.",
    },
  ],
  moneda: {
    titulo: "Precios en dólares, como muchos contratos en Nicaragua",
    resumen:
      "El catálogo para Nicaragua se publica en dólares (USD), la moneda en que ya se referencian muchos precios en el país: cada ficha muestra el valor vigente del curso.",
    nota: "Puedes pagar con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile y el checkout informa el equivalente en CLP antes de confirmar.",
  },
  mercado: {
    ejemplo:
      "En Nicaragua el dato suele estar repartido entre el sistema de facturación, la báscula o el acopio y una planilla que mezcla córdobas y dólares. El primer tablero ordena la conversión con una sola tabla de tipo de cambio y muestra margen por lote, por contrato o por ruta.",
    horario:
      "Nicaragua se mantiene en UTC-6 todo el año. La clase de 19:30 en Chile se ve a las 16:30 en Managua durante el horario de verano chileno y a las 17:30 el resto del año. La ficha de cada cohorte indica la hora exacta.",
    facturacion:
      "Los cursos se publican en dólares y se pagan con tarjeta o transferencia; el checkout muestra el equivalente en CLP antes de confirmar. Los servicios in-company se cotizan aparte, con moneda y condiciones en la propuesta.",
  },
  nosotros: {
    parrafo:
      "Acompañamos a profesionales nicaragüenses de café, ganadería, zona franca y comercio que necesitan un reporte confiable aunque los datos estén en dos monedas. Las clases se siguen en vivo en hora de Managua y quedan grabadas en el campus.",
  },
  faqs: [
    {
      q: "¿El curso enseña a trabajar con córdobas y dólares a la vez?",
      a: "Sí. Uno de los ejercicios arma una tabla de tipo de cambio con la referencia del BCN y convierte ventas y costos con la misma regla, para que el margen no dependa de quién hizo la planilla.",
      categoria: "cursos",
    },
    {
      q: "¿A qué hora son las clases en Managua?",
      a: "Las clases empiezan a las 19:30 de Chile. Nicaragua está en UTC-6 todo el año y Chile cambia de hora, así que en Managua se ven a las 16:30 durante el verano chileno y a las 17:30 el resto del año. La ficha de cada curso muestra el horario exacto.",
      categoria: "cursos",
    },
    {
      q: "¿Los casos incluyen café y ganadería?",
      a: "Sí. Hay escenarios de acopio y rendimiento de café, de peso y rendimiento en canal, y de órdenes en zona franca. Son ejercicios de práctica, no casos de clientes.",
      categoria: "general",
    },
    {
      q: "¿Cómo pago desde Nicaragua?",
      a: "Con Mercado Pago (tarjeta de crédito o débito), con tarjeta internacional o por transferencia en dólares. El cobro se procesa con la cuenta de Chile y el checkout muestra el equivalente en CLP antes de confirmar; el cargo final en tu tarjeta lo determina tu banco.",
      categoria: "pagos",
    },
    {
      q: "¿Cuál es el precio de los cursos?",
      a: `${resumenPreciosCatalogo("ni")} El monto final se confirma en el checkout antes de pagar.`,
      categoria: "pagos",
    },
    {
      q: "¿Qué pasa si se corta la conexión durante una clase?",
      a: "La clase queda grabada en el campus virtual, así que puedes retomarla desde el minuto en que se cortó. Las dudas se pueden enviar después al profesor.",
      categoria: "general",
    },
  ],
};

export default contenido;
