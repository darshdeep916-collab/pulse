import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an elite copywriter. Write a highly engaging, viral social media post based on the user's topic. Include relevant hashtags and a strong call to action." 
        },
        { role: "user", content: prompt }
      ],
    });

    const output = completion.choices[0].message.content;
    return NextResponse.json({ output });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}