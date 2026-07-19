import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a mentor creating practice quiz questions for a student learning a specific topic.

You will receive a topic, domain, and skill_level. Generate exactly 3 practice questions for this topic, calibrated to the skill level.

Tone: warm, encouraging, never trick questions.

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "questions": [
    {"question": "", "options": ["A. ", "B. ", "C. ", "D. "], "correct": "A", "explanation": ""}
  ]
}

Return ONLY raw JSON, nothing before { and nothing after }.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, domain, skill_level } = body

    if (!topic) {
      return NextResponse.json({ error: 'topic_required' }, { status: 400 })
    }

    if (request.headers.get('X-Test') === 'true') {
      return NextResponse.json({
        questions: [
          {
            question: `Mock question about ${topic}?`,
            options: ['A. Mock', 'B. Mock', 'C. Mock', 'D. Mock'],
            correct: 'A',
            explanation: 'Mock explanation',
          },
        ],
      })
    }

    const userMessage = `Topic: ${topic}\nDomain: ${domain}\nSkill level: ${skill_level}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1500,
    })

    let raw = completion.choices[0]?.message?.content ?? ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'quiz_failed', retry: true }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'quiz_failed', retry: true }, { status: 500 })
  }
}