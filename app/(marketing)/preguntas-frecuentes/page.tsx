import type { Metadata } from "next";
import Link from "next/link";
import { precioChile } from "@/config/pricing";
import { formatCLP } from "@/lib/paises/precios";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

const title = "Preguntas frecuentes de los cursos — ProgramBI";
const description =
  "Precios, duración, horarios, certificado, grabaciones, requisitos y pagos desde el extranjero: las respuestas concretas sobre los cursos en vivo de ProgramBI.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/preguntas-frecuentes") },
  openGraph: { title, description, url: absoluteUrl("/preguntas-frecuentes"), type: "website" },
};

/**
 * 20 preguntas reales, respondidas solo con datos que existen en el sitio:
 * montos de config/pricing.ts, horarios publicados y páginas del propio sitio.
 */
function preguntas(): { q: string; a: string }[] {
  const powerBiCl = precioChile("power-bi");
  const analisisCl = precioChile("analisis-de-datos");
  const mercadoCl = precioChile("mercado-financiero");
  const precioBase = powerBiCl != null ? formatCLP(powerBiCl) : "el precio publicado en /precios";
  const precioAnalisis = analisisCl != null ? formatCLP(analisisCl) : "el precio publicado";
  const precioMercado = mercadoCl != null ? formatCLP(mercadoCl) : "el precio publicado";

  return [
    {
      q: "¿Cuánto cuestan los cursos?",
      a: `El curso estándar (Power BI, SQL Server, Python, Claude, Copilot, Excel, Access e IA para productividad) cuesta ${precioBase} en Chile. Análisis de Datos cuesta ${precioAnalisis} y Mercado financiero con Python, Power BI y SQL cuesta ${precioMercado}. En el resto de los países el monto está en la moneda local y aparece en la página de precios de cada mercado.`,
    },
    {
      q: "¿El precio que veo es el que voy a pagar?",
      a: "Sí. El precio de la ficha, el que declara el buscador y el que cobra la pasarela salen de la misma lista. Pagas con tarjeta internacional y el cargo final lo define tu banco, que puede aplicar impuestos o percepciones de compras en el exterior.",
    },
    {
      q: "¿Los precios están en pesos chilenos?",
      a: "Cada país muestra su precio en su propia moneda: pesos chilenos en Chile, pesos argentinos en Argentina, pesos mexicanos en México, soles en Perú, pesos colombianos en Colombia y pesos uruguayos en Uruguay. Paraguay está pendiente de publicación y se consulta por WhatsApp.",
    },
    {
      q: "¿Cuánto dura un curso?",
      a: "Power BI son 20 horas repartidas en 8 módulos, con dos clases por semana de dos horas. La mayoría de los cursos técnicos tiene 16 horas por nivel (básico, intermedio y avanzado).",
    },
    {
      q: "¿A qué hora son las clases?",
      a: "De 19:30 a 21:30 en la hora local de tu país, dos veces por semana. Al entrar a la ficha del curso ves el horario convertido a tu zona horaria.",
    },
    {
      q: "¿Las clases son en vivo o grabadas?",
      a: "En vivo por Zoom, con el instructor respondiendo preguntas en el momento. Todas las clases quedan grabadas y disponibles en el campus para que las veas cuando quieras.",
    },
    {
      q: "¿Por cuánto tiempo tengo acceso a las grabaciones?",
      a: "Las grabaciones quedan disponibles de por vida en tu cuenta, junto con el material del curso.",
    },
    {
      q: "¿Entregan certificado?",
      a: "Sí. Al completar el curso recibes un certificado de ProgramBI. Es distinto de la certificación oficial de Microsoft (examen PL-300), que se rinde aparte y se paga directo a Microsoft.",
    },
    {
      q: "¿Necesito saber programar?",
      a: "No para empezar. Power BI, Power Query y DAX se aprenden sin experiencia previa en programación. En los cursos de Python y SQL se parte desde cero.",
    },
    {
      q: "¿Qué necesito para tomar las clases?",
      a: "Un computador con internet estable, micrófono y la versión de escritorio de Power BI (gratuita) para los cursos de Power BI. No se requiere instalar servidores ni comprar licencias.",
    },
    {
      q: "¿Puedo pagar desde otro país?",
      a: "Sí. Cada mercado tiene su pasarela local: Webpay de Flow en Chile, Mercado Pago en Argentina, México, Perú, Colombia y Uruguay, y PSE o Nequi en Colombia. También se puede pagar por transferencia bancaria en la moneda del país.",
    },
    {
      q: "¿Puedo pagar en cuotas?",
      a: "Depende de tu banco y de la pasarela del país: en Chile Flow permite cuotas con tarjetas de crédito según el emisor. La simulación se muestra al momento de pagar.",
    },
    {
      q: "¿Hay descuentos o cupones?",
      a: "Sí, hay cupones vigentes que se aplican en el checkout. Los descuentos activos aparecen en la página de precios de tu país.",
    },
    {
      q: "¿Puedo inscribirme a un solo nivel?",
      a: "Sí. Cada curso se puede tomar por nivel (básico, intermedio o avanzado) y cada nivel se cobra por separado, con su propio temario y horario.",
    },
    {
      q: "¿Qué pasa si no puedo asistir a una clase?",
      a: "Queda grabada y la puedes ver después en el campus. Si tienes dudas del contenido, puedes escribir por WhatsApp o plantearlas en la siguiente clase.",
    },
    {
      q: "¿Quién dicta los cursos?",
      a: "Manuel Oliva, director académico de ProgramBI, Magíster en Data Science (UAI) y consultor en proyectos de datos para minería, finanzas y retail.",
    },
    {
      q: "¿El curso sirve para trabajar como analista de datos?",
      a: "El curso entrega las herramientas que piden las ofertas de analista (modelado, DAX, SQL, Python y tableros) y terminas con un proyecto para mostrar. La inserción depende de tu experiencia previa y del mercado; en la bolsa de trabajo de ProgramBI se publican ofertas del rubro.",
    },
    {
      q: "¿Hacen cursos para empresas?",
      a: "Sí: programas in-company, dashboards a medida, automatización y consultoría. Se cotiza según el tamaño del equipo y el alcance, desde la página de empresas.",
    },
    {
      q: "¿Puedo descargar la plantilla de dashboard gratis?",
      a: "Sí. En las guías de Power BI por país puedes descargar la plantilla de dashboard de ventas dejando solo tu correo, sin crear cuenta.",
    },
    {
      q: "¿Cómo me inscribo?",
      a: "Creas tu cuenta con nombre, correo y contraseña, confirmas el correo, eliges el curso y el nivel, y pagas en línea. Si prefieres que te ayuden, puedes escribir por WhatsApp y te acompañamos en el proceso.",
    },
  ];
}

export default function PreguntasFrecuentesPage() {
  const faqs = preguntas();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/preguntas-frecuentes")}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <main className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[820px]">
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">Preguntas frecuentes</li>
            </ol>
          </nav>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-[46rem] leading-relaxed text-mute">
            Precio, duración, certificado, pagos desde el extranjero y todo lo que se pregunta antes de
            inscribirse en un curso en vivo de ProgramBI.
          </p>

          <dl className="mt-10 space-y-8">
            {faqs.map((faq, index) => (
              <div key={faq.q} id={`pregunta-${index + 1}`}>
                <dt className="text-lg font-semibold text-ink">
                  {index + 1}. {faq.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-mute">{faq.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 rounded-2xl border border-line bg-paper p-5 text-sm leading-relaxed text-mute">
            ¿Te quedó otra duda?{" "}
            <Link href="/cursos" className="font-semibold text-ink underline underline-offset-4">
              Revisa el catálogo
            </Link>{" "}
            o escríbenos por WhatsApp desde cualquier página del sitio.
          </p>
        </div>
      </main>
    </>
  );
}
