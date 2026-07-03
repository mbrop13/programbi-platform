import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://programbi.com',
    'X-Title': 'ProgramBI LMS',
  }
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { messages, conversationId, model: requestedModel } = await req.json();

    // Map model names to OpenRouter model IDs
    let modelId = 'meta-llama/llama-3-8b-instruct:free'; // default
    const modelMap: Record<string, string> = {
      'llama-3-8b': 'meta-llama/llama-3-8b-instruct:free',
      'gemini-1.5-flash': 'google/gemini-flash-1.5',
      'gpt-4o-mini': 'openai/gpt-4o-mini',
      'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
      'claude-3-5-sonnet': 'anthropic/claude-3.5-sonnet', // accept both formats
    };
    
    if (requestedModel && modelMap[requestedModel]) {
      modelId = modelMap[requestedModel];
    }

    // Save the latest user message to Supabase if conversationId is provided
    if (conversationId) {
      const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMsg) {
        await supabase.from('ai_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: lastUserMsg.content,
          model: requestedModel,
        });
      }
    }

    const result = await streamText({
      model: openrouter(modelId),
      system: `Eres el Asistente IA de ProgramBI, una plataforma de formación en Data Science, Business Intelligence y Analytics.

**Tus áreas de expertise:**
- Python (pandas, numpy, matplotlib, seaborn, scikit-learn)
- SQL (consultas, optimización, bases de datos relacionales)
- Power BI (DAX, Power Query, modelado de datos, visualizaciones)
- Excel avanzado (fórmulas, tablas dinámicas, macros)
- Estadística y análisis de datos
- Visualización de datos y storytelling

**Estilo de respuesta:**
- Sé didáctico y claro, explica conceptos paso a paso
- Usa ejemplos de código cuando sea relevante, formateados en bloques de código con el lenguaje especificado
- Usa markdown para estructurar tus respuestas (headings, listas, tablas)
- Fomenta las buenas prácticas y patrones profesionales
- Si el usuario pregunta algo fuera de tu expertise, responde honestamente pero intenta relacionarlo con data/analytics
- Responde siempre en español

**Formato de código:**
Usa bloques de código con triple backticks y especifica el lenguaje:
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
\`\`\`

Sé conciso pero completo. Prioriza claridad sobre exhaustividad.`,
      messages: messages.slice(-20), // Increased from 10 to 20 for better context
      maxOutputTokens: 4096, // Increased from 1024
      temperature: 0.7,
      onFinish: async ({ text }) => {
        // Save the assistant response to Supabase
        if (conversationId && text) {
          try {
            await supabase.from('ai_messages').insert({
              conversation_id: conversationId,
              role: 'assistant',
              content: text,
              model: requestedModel,
            });
            // Update conversation timestamp
            await supabase
              .from('ai_conversations')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', conversationId);
          } catch (err) {
            console.error('Error saving assistant message:', err);
          }
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return new Response(
      JSON.stringify({ error: isProd ? "Error comunicando con la IA Asistente." : String(error) }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
