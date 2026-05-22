import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are MathGenius AI Tutor, a friendly and expert math tutor. Help students understand mathematical concepts, solve problems step by step, and provide clear explanations. Use LaTeX notation for mathematical expressions when helpful. Be encouraging and pedagogical. Keep responses concise but thorough. If the student asks about something other than math, gently redirect them to math topics.`
        },
        ...messages,
      ],
    })

    const reply = completion.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.'

    return NextResponse.json({ reply })
  } catch (error: unknown) {
    console.error('Chat error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate response'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
