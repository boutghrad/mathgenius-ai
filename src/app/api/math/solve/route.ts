import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { expression, category, userId } = await req.json()

    if (!expression || !category) {
      return NextResponse.json({ error: 'Expression and category are required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are MathGenius AI, an expert mathematics solver. Solve the given math problem step by step.

IMPORTANT: You MUST respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "answer": "the final answer in plain text with LaTeX notation where needed",
  "answerLatex": "the final answer in pure LaTeX",
  "steps": [
    {"number": 1, "title": "Step title", "description": "Detailed explanation of this step", "latex": "LaTeX representation of this step"},
    {"number": 2, "title": "Step title", "description": "Detailed explanation", "latex": "LaTeX representation"}
  ],
  "graphSuggestion": null
}

If the problem involves a function that can be graphed (like y=x^2, y=sin(x), etc.), include graphSuggestion:
{
  "graphSuggestion": {
    "type": "function",
    "equation": "x^2",
    "label": "f(x) = x²",
    "xMin": -10,
    "xMax": 10
  }
}

For graph types use: "line", "parabola", "sine", "cosine", "exponential", "polynomial"
Always use proper LaTeX notation. Be thorough in step explanations.`
        },
        {
          role: 'user',
          content: `Solve this ${category} problem: ${expression}`
        }
      ],
    })

    let solution
    const rawContent = completion.choices?.[0]?.message?.content || ''

    try {
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      solution = JSON.parse(cleaned)
    } catch {
      solution = {
        answer: rawContent,
        answerLatex: rawContent,
        steps: [{ number: 1, title: 'Solution', description: rawContent, latex: rawContent }],
        graphSuggestion: null,
      }
    }

    // Save to database if userId provided
    if (userId) {
      try {
        await db.equation.create({
          data: {
            userId,
            expression,
            category,
            solution: solution.answer || '',
            steps: JSON.stringify(solution.steps || []),
            graphData: solution.graphSuggestion ? JSON.stringify(solution.graphSuggestion) : null,
          }
        })
      } catch (dbError) {
        console.error('Failed to save equation:', dbError)
      }
    }

    // Log AI generation
    try {
      await db.aIGeneration.create({
        data: {
          userId: userId || null,
          prompt: expression,
          result: JSON.stringify(solution),
          model: 'gpt-4',
          tokens: completion.usage?.total_tokens || 0,
          duration: 0,
        }
      })
    } catch (dbError) {
      console.error('Failed to log AI generation:', dbError)
    }

    return NextResponse.json({ success: true, solution })
  } catch (error: unknown) {
    console.error('Math solve error:', error)
    const message = error instanceof Error ? error.message : 'Failed to solve equation'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
