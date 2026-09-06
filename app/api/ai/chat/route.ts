import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://www.programbi.com',
    'X-Title': 'ProgramBI Classroom AI Tutor',
  },
});

export const maxDuration = 60;

const chatSchema = z.object({
  messages: z.array(z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  chatId: z.string().nullable().optional(),
  model: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY no está configurado." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const parseResult = chatSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: "Estructura de mensaje no válida." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = parseResult.data;

    const result = await streamText({
      model: openrouter('meta-llama/llama-3.3-70b-instruct'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("[AulaVirtual AI Chat Error]:", err);
    return new Response(JSON.stringify({ error: err.message || "Error al procesar la solicitud." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
