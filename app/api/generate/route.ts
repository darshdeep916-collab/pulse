import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API Key is missing on Vercel." }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant built into the Pulse Network OS terminal. Keep responses short, technical, and formatted as brief terminal inputs or Intel broadcasts." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
    });

    const output = completion.choices[0]?.message?.content || "No output generated.";
    return NextResponse.json({ text: output });
  } catch (error: any) {
    console.error("OpenAI Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}