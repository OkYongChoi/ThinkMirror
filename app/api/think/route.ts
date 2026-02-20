import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
      status: 500,
    });
  }

  const { thought } = await req.json();

  if (!thought?.trim()) {
    return new Response(JSON.stringify({ error: "Thought is required" }), {
      status: 400,
    });
  }

  const systemPrompt = `You are ThinkMirror — a cognitive expansion engine. When given a thought or idea, you respond with EXACTLY this JSON structure (no markdown, no extra text):

{
  "summary": "One sentence reframing of the core idea",
  "perspectives": {
    "devil": {
      "title": "Devil's Advocate",
      "emoji": "😈",
      "points": ["counterargument 1", "counterargument 2", "counterargument 3"]
    },
    "expand": {
      "title": "Expand",
      "emoji": "🚀",
      "points": ["extension idea 1", "extension idea 2", "extension idea 3"]
    },
    "weakness": {
      "title": "Blind Spots",
      "emoji": "🔍",
      "points": ["hidden assumption 1", "hidden assumption 2", "hidden assumption 3"]
    },
    "wildcard": {
      "title": "Wild Card",
      "emoji": "⚡",
      "points": ["unexpected angle 1", "unexpected angle 2", "unexpected angle 3"]
    }
  },
  "question": "The single most important question you should ask yourself about this idea"
}

Be sharp, honest, and provocative. Don't be generic. Respond in the SAME language as the user's input.`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const client = new OpenAI({ apiKey });
        const stream = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          max_tokens: 1500,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: thought },
          ],
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
