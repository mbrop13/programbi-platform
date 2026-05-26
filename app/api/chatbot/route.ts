/**
 * API Route: /api/chatbot
 * 
 * Endpoint principal del chatbot de ventas de ProgramBI.
 * Usa DeepSeek V3 (vía OpenRouter) con streaming para respuestas
 * rápidas y naturales. Persiste conversaciones en Supabase para
 * análisis y seguimiento de leads.
 * 
 * Formato de respuesta: Data Stream (compatible con useChat de @ai-sdk/react)
 */

import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { createAdminClient } from '@/lib/supabase/server'
import { buildChatbotContext } from './context'

// ─── Cliente OpenRouter configurado para el chatbot ───
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://programbi.com',
    'X-Title': 'ProgramBI Sales Chatbot',
  },
})

// Permitir hasta 60 segundos de ejecución (modelos free pueden ser lentos)
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      messages,
      conversationId: existingConvId,
      visitorId,
      sourcePage,
    } = body

    // ─── Obtener contexto dinámico (con caché interna de 5min) ───
    let dynamicContext: string
    try {
      dynamicContext = await buildChatbotContext()
    } catch (error) {
      console.error('[Chatbot] Error construyendo contexto:', error)
      dynamicContext = '(Contexto no disponible temporalmente)'
    }

    // ─── Fecha actual para relevancia de horarios ───
    const today = new Date().toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // ─── Contexto de la página actual del usuario ───
    const pageContext = sourcePage
      ? `\nEl usuario está navegando en: ${sourcePage}`
      : ''

    // ─── System prompt completo ───
    const systemPrompt = `Eres Programbi, el asistente virtual de ProgramBI, una academia online líder en Data Analytics y Business Intelligence en Latinoamérica.

REGLAS DE COMPORTAMIENTO:
- Sé amable, profesional y entusiasta. Usa un tono cercano pero no informal.
- Recomienda cursos según las necesidades del usuario. Pregunta sobre su experiencia y objetivos.
- Menciona promociones activas de forma natural cuando sea relevante, no las fuerces.
- Intenta captar el contacto del usuario (nombre, email, WhatsApp) de forma no intrusiva cuando haya interés real de compra.
- NUNCA inventes datos. Si no tienes información, redirige al usuario a contactarnos.
- Responde SIEMPRE en español.
- Usa emojis con moderación (1-2 por mensaje máximo) para dar calidez.
- Sé conciso: respuestas de 2-4 párrafos máximo. No hagas listas excesivamente largas.
- Si no sabes algo o es fuera de tu alcance → redirige a WhatsApp +56 9 3540 9699 o contacto@programbi.cl.
- NUNCA des precios específicos. Si el usuario pregunta por precios, dile que se registre en la página del curso para ver los precios actualizados y ofertas especiales: https://programbi.com/pago/{slug}
- Cuando menciones un curso, incluye su URL: https://programbi.com/cursos/{slug}
- Para llevar al pago/registro: https://programbi.com/pago/{slug}

WIDGETS DE CURSOS:
Cuando recomiendes un curso específico, incluye el widget al final de tu respuesta usando la sintaxis ((slug)). Esto mostrará una tarjeta interactiva del curso automáticamente. Slugs válidos: analisis-de-datos, power-bi, python, sql-server, excel, ia-productividad, machine-learning, power-automate, analitica-mineria, analitica-financiera.
Ejemplo: "Te recomiendo nuestro curso de Power BI, ideal para crear dashboards profesionales. ((power-bi))"
Puedes incluir múltiples widgets si recomiendas varios cursos. No incluyas más de 3 widgets por mensaje para no saturar.

URLS DEL SITIO (https://programbi.com):
- /cursos → Catálogo completo de cursos
- /cursos/{slug} → Detalle de un curso específico
- /asesorias → Asesorías personalizadas
- /pago/{slug} → Página de pago de un curso

Fecha de hoy: ${today}${pageContext}

DATOS ACTUALIZADOS DE PROGRAMBI:
${dynamicContext}`

    // ─── Determinar o crear el conversationId ───
    let conversationId = existingConvId || null



    // ─── Persistencia de conversación (callback reutilizable) ───
    const onFinishCallback = async ({ text }: { text: string }) => {
      try {
        const supabase = createAdminClient()

        if (!conversationId) {
          const { data: newConv, error: convError } = await supabase
            .from('chatbot_conversations')
            .insert({
              visitor_id: visitorId || null,
              source_page: sourcePage || null,
            })
            .select('id')
            .single()

          if (convError) {
            console.error('[Chatbot] Error al crear conversación:', convError)
            return
          }

          conversationId = newConv.id
        }

        const lastUserMsg = messages
          .filter((m: { role: string }) => m.role === 'user')
          .pop()

        const messagesToInsert = []

        if (lastUserMsg) {
          messagesToInsert.push({
            conversation_id: conversationId,
            role: 'user',
            content: lastUserMsg.content,
          })
        }

        if (text) {
          messagesToInsert.push({
            conversation_id: conversationId,
            role: 'assistant',
            content: text,
          })
        }

        if (messagesToInsert.length > 0) {
          const { error: msgError } = await supabase
            .from('chatbot_messages')
            .insert(messagesToInsert)

          if (msgError) {
            console.error('[Chatbot] Error al guardar mensajes:', msgError)
          }
        }

        await supabase.rpc('increment_chatbot_message_count', {
          conv_id: conversationId,
        }).then(({ error }) => {
          if (error) {
            return supabase
              .from('chatbot_conversations')
              .update({
                updated_at: new Date().toISOString(),
                message_count: messagesToInsert.length,
              })
              .eq('id', conversationId)
          }
        })
      } catch (err) {
        console.error('[Chatbot] Error en onFinish:', err)
      }
    }

    // ─── Stream con el modelo primario ───
    const result = streamText({
      model: openrouter('deepseek/deepseek-v4-flash:free'),
      system: systemPrompt,
      messages,
      onFinish: onFinishCallback,
    })

    return result.toTextStreamResponse({
      headers: {
        'X-Conversation-Id': conversationId || 'pending',
      },
    })
  } catch (error) {
    console.error('[Chatbot] Error general:', error)
    // Return a readable text error so the client can display it
    return new Response(
      'Lo siento, nuestro asistente no está disponible en este momento. Por favor, contáctanos por WhatsApp al +56 9 3540 9699 o escríbenos a contacto@programbi.cl.',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Conversation-Id': 'error',
        },
      }
    )
  }
}

