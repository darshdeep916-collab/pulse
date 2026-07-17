import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let prompt = "Write a quick system hello message.";
    
    // Attempt to parse the prompt safely
    try {
      const body = await req.json();
      if (body && body.prompt) {
        prompt = body.prompt;
      }
    } catch (e) {
      console.log("No JSON body or prompt received, using fallback prompt.");
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Check if key is completely missing
    if (!apiKey) {
      return NextResponse.json({ 
        error: "DEBUG: The OPENAI_API_KEY environment variable is undefined on Vercel." 
      }, { status: 500 });
    }

    // 2. Check if key has basic formatting issues (like quotes or spaces)
    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json({ 
        error: `DEBUG: Your API key does not start with 'sk-'. It starts with: '${apiKey.substring(0, 5)}...'` 
      }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful terminal AI assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
      })
    });

    const data = await response.json();

    // 3. If OpenAI returned an error, send the exact error details back
    if (!response.ok) {
      return NextResponse.json({ 
        error: `DEBUG (OpenAI Error): ${data.error?.message || JSON.stringify(data)}` 
      }, { status: response.status });
    }

    const output = data.choices?.[0]?.message?.content || "No output generated.";
    return NextResponse.json({ text: output });

  } catch (error: any) {
    return NextResponse.json({ 
      error: `DEBUG (Server Crash): ${error.message}` 
    }, { status: 500 });
  }
}