import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a career mentor who designs portfolio-worthy data/AI projects tailored to a specific job description.

You will receive a job description and a list of skills the user wants to practice. Based on these, generate exactly 3 distinct project suggestions.

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "suggestions": [
    {
      "title": "",
      "domain": "DA|DS|ML|AI_ENGINEER|NLP|GENAI|RAG",
      "relevancy_score": 87,
      "why_relevant": "2 sentence explanation",
      "tech_stack": ["Python", "Pandas"],
      "difficulty": "BEGINNER|INTERMEDIATE|ADVANCED",
      "is_case_study": false,
      "datasets": [
        {"name": "", "url": "https://www.kaggle.com/datasets/...", "why_suitable": ""}
      ]
    }
  ]
}

Rules:
- Exactly 3 suggestions, exactly 3 Kaggle datasets per suggestion.
- relevancy_score is a NUMBER, not a string.
- domain and difficulty must be exact values from the allowed list.
- Exactly 2 of the 3 suggestions must have is_case_study set to false (regular projects). Exactly 1 must have is_case_study set to true (a business-scenario case study). This 2-and-1 split is mandatory every time.
- Vague job descriptions must still return 3 sensible suggestions.
- The user's selected skills are listed in the message below. EVERY suggestion's tech_stack must include AT LEAST 2 of the user's selected skills, not just 1. If the user selected 3 or more skills, aim to use most of them across the 3 suggestions, not the same single skill repeated. This is a hard requirement, not a suggestion.
- Do not substitute a selected skill for a similar one the user didn't pick (e.g. if the user picked Power BI, don't swap in Tableau).
- Return ONLY raw JSON, nothing before { and nothing after }.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jd, skills } = body

    if (!jd || typeof jd !== 'string' || jd.trim().length === 0) {
      return NextResponse.json({ error: 'jd_required' }, { status: 400 })
    }
    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: 'skills_required' }, { status: 400 })
    }

    if (request.headers.get('X-Test') === 'true') {
      const mockSuggestion = (n: number) => ({
        title: `Mock Project ${n}`,
        domain: 'DA',
        relevancy_score: 90,
        why_relevant: 'Mock reason for testing.',
        tech_stack: ['Python', 'SQL'],
        difficulty: 'BEGINNER',
        is_case_study: false,
        datasets: [
          { name: 'Mock Dataset 1', url: 'https://www.kaggle.com/datasets/mock1', why_suitable: 'Mock' },
          { name: 'Mock Dataset 2', url: 'https://www.kaggle.com/datasets/mock2', why_suitable: 'Mock' },
          { name: 'Mock Dataset 3', url: 'https://www.kaggle.com/datasets/mock3', why_suitable: 'Mock' },
        ],
      })
      return NextResponse.json({
        suggestions: [mockSuggestion(1), mockSuggestion(2), mockSuggestion(3)],
      })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentCalls } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('endpoint', 'suggest')
      .gte('window_start', oneHourAgo)

    const currentCount = recentCalls?.reduce((sum, r) => sum + r.count, 0) ?? 0
    if (currentCount >= 10) {
      return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
    }

    await supabase.from('rate_limits').insert({
      user_id: user.id,
      endpoint: 'suggest',
      count: 1,
      window_start: new Date().toISOString(),
    })

    const userMessage = 'Job description: ' + jd + '\n\nSelected skills: ' + skills.join(', ')

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 2000,
    })

    let raw = completion.choices[0]?.message?.content ?? ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.error('[/api/suggest] JSON.parse failed. Raw Groq output:', raw)
      return NextResponse.json({ error: 'suggestion_failed', retry: true }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[/api/suggest] Unhandled error:', err)
    return NextResponse.json({ error: 'suggestion_failed', retry: true }, { status: 500 })
  }
}
