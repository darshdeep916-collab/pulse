import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API Key is missing on Vercel backend." }, { status: 500 });
    }

    // Call OpenAI directly via fetch - completely bypasses SDK version issues!
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant built into the Pulse Network OS terminal. Keep responses short, technical, and formatted as brief terminal inputs or Intel broadcasts." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json({ error: errorData.error?.message || "Failed calling OpenAI" }, { status: response.status });
    }

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No output generated.";
    
    return NextResponse.json({ text: output });
  } catch (error: any) {
    console.error("Generate Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}