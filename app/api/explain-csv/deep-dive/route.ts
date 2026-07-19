import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a mentor creating quiz questions about a specific dataset.

You will receive a dataset_deep_dive object (with real column names, meanings, and patterns). Generate exactly 3 quiz questions that test understanding of THIS specific dataset.

Questions must reference the ACTUAL column names from the dataset. Example: "The churn column contains 0 and 1 values. What do they represent?"

Do NOT write generic Python or programming questions — every question must be about the actual dataset content.

Tone: warm, encouraging, never trick questions.

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "quiz_questions": [
    {"question": "", "options": ["A. ", "B. ", "C. ", "D. "], "correct": "A", "explanation": ""}
  ]
}

Return ONLY raw JSON, nothing before { and nothing after }.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { project_id } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id_required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('project_json')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'project_not_found' }, { status: 404 })
    }

    const datasetDeepDive = project.project_json?.dataset_deep_dive

    if (!datasetDeepDive) {
      return NextResponse.json({ error: 'no_dataset_deep_dive' }, { status: 400 })
    }

    if (request.headers.get('X-Test') === 'true') {
      return NextResponse.json({
        dataset_deep_dive: datasetDeepDive,
        quiz_questions: [
          {
            question: 'Mock question about this dataset?',
            options: ['A. Mock', 'B. Mock', 'C. Mock', 'D. Mock'],
            correct: 'A',
            explanation: 'Mock explanation',
          },
        ],
      })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(datasetDeepDive) },
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

    return NextResponse.json({
      dataset_deep_dive: datasetDeepDive,
      quiz_questions: parsed.quiz_questions,
    })
  } catch {
    return NextResponse.json({ error: 'quiz_failed', retry: true }, { status: 500 })
  }
}