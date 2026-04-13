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
    const { messages, conversationId } = await req.json();

    // Save the latest user message to Supabase if conversationId is provided
    if (conversationId) {
      const supabase = await createClient();
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
      model: openrouter('meta-llama/llama-3-8b-instruct:free'),
      system: 'Eres el Asistente IA de ProgramBI, experto en Data Science, Python, Power BI, SQL y Excel. Responde de forma clara y didáctica. Usa markdown para formatear tus respuestas. Fomenta las buenas prácticas.',
      messages,
      onFinish: async ({ text }) => {
        // Save the assistant response to Supabase
        if (conversationId && text) {
          try {
            const supabase = await createClient();
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
    return new Response(JSON.stringify({ error: "Error comunicando con la IA Asistente." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
