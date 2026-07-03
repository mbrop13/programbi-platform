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

export const maxDuration = 30;

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
    if (requestedModel === 'claude-3.5-sonnet') {
      modelId = 'anthropic/claude-3.5-sonnet';
    } else if (requestedModel === 'gpt-4o-mini') {
      modelId = 'openai/gpt-4o-mini';
    } else if (requestedModel === 'gemini-1.5-flash') {
      modelId = 'google/gemini-flash-1.5';
    } else if (requestedModel === 'llama-3-8b') {
      modelId = 'meta-llama/llama-3-8b-instruct:free';
    }

    // Save the latest user message to Supabase if conversationId is provided
    if (conversationId) {
      const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMsg) {
        await supabase.from('ai_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: lastUserMsg.content,
        });
      }
    }

    const result = await streamText({
      model: openrouter(modelId),
      system: 'Eres el Asistente IA de ProgramBI, experto en Data Science, Python, Power BI, SQL y Excel. Responde de forma clara y didáctica. Usa markdown para formatear tus respuestas. Fomenta las buenas prácticas.',
      messages: messages.slice(-10),
      maxOutputTokens: 1024,
      onFinish: async ({ text }) => {
        // Save the assistant response to Supabase
        if (conversationId && text) {
          try {
            await supabase.from('ai_messages').insert({
              conversation_id: conversationId,
              role: 'assistant',
              content: text,
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
