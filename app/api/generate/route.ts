import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const STEP_COUNTS: Record<string, number> = {
  DA: 6,
  DS: 7,
  ML: 8,
  AI_ENGINEER: 8,
  NLP: 8,
  GENAI: 8,
  RAG: 8,
}

function buildSystemPrompt(domain: string) {
  const stepCount = STEP_COUNTS[domain] ?? 7

  return `You are an expert project mentor creating a complete, portfolio-ready guided project.

Inputs you will receive: project_title, domain, jd, skills (array), dataset_columns (array), dataset_name (string), skill_level (BEGINNER|INTERMEDIATE|CONFIDENT), is_case_study (boolean).

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "project_title": "",
  "domain": "",
  "summary": "",
  "business_context": "",
  "dataset_deep_dive": {
    "what_this_data_is": "",
    "real_world_source": "",
    "columns": [{"name":"","what_it_means":"","example_values":"","useful_for_project":true}],
    "interesting_patterns": "",
    "questions_this_data_can_answer": []
  },
  "steps": [
    {
      "step_number": 1,
      "title": "",
      "code": "",
      "beginner_breakdown": "",
      "explanation": "",
      "topics_used": [],
      "variable_suggestions": "",
      "quiz": {
        "question": "",
        "options": ["A. ","B. ","C. ","D. "],
        "correct": "A",
        "explanation": ""
      }
    }
  ],
  "final_summary": "",
  "skills_demonstrated": [],
  "interview_talking_points": [],
  "description_test_prompt": ""
}

Code rules: industry quality, real pandas/sklearn/matplotlib, executable in Google Colab.

CODE RULE (applies to the "code" field itself, not just the explanation): when the logic involves iterating, filtering, or transforming data manually, write it using explicit for loops — NOT list comprehensions, lambda, map(), or filter(). This applies even when list comprehensions would be more idiomatic. Standard library/pandas/sklearn one-liners (e.g. train_test_split, model.fit, df.groupby) are fine as-is since they aren't manual iteration.

beginner_breakdown: describe the explicit for-loop logic in plain English, explaining every variable name.

explanation: maximum 3 plain English sentences.

quiz: 4 options always, warm encouraging tone, never trick questions, correct can be any of A/B/C/D.

Step count: generate exactly ${stepCount} steps for domain ${domain}.

dataset_deep_dive: thorough enough that a student reading it understands their data before touching a line of code.

description_test_prompt: an open question asking the user to explain what they built, used for interview readiness check.

business_context: required when is_case_study is true — frames the project in a real business scenario.

Return ONLY raw JSON, nothing before { and nothing after }.`
}

async function callGroq(systemPrompt: string, userMessage: string) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 4000,
  })

  let raw = completion.choices[0]?.message?.content ?? ''
  raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

  return JSON.parse(raw)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      project_title,
      domain,
      jd,
      skills,
      dataset_columns,
      dataset_name,
      skill_level,
      is_case_study,
    } = body

    // X-Test header: return hardcoded 3-step mock project immediately
    if (request.headers.get('X-Test') === 'true') {
      return NextResponse.json({
        project_id: 'mock-project-id',
        status: 'ready',
      })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    // Rate limiting: max 3 per user per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentCalls } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('endpoint', 'generate')
      .gte('window_start', oneDayAgo)

    const currentCount = recentCalls?.reduce((sum, r) => sum + r.count, 0) ?? 0
    if (currentCount >= 3) {
      return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
    }

    await supabase.from('rate_limits').insert({
      user_id: user.id,
      endpoint: 'generate',
      count: 1,
      window_start: new Date().toISOString(),
    })

    const systemPrompt = buildSystemPrompt(domain)
    const userMessage = `project_title: ${project_title}
domain: ${domain}
jd: ${jd}
skills: ${skills.join(', ')}
dataset_columns: ${dataset_columns.join(', ')}
dataset_name: ${dataset_name}
skill_level: ${skill_level}
is_case_study: ${is_case_study}`

    let parsed
    try {
      parsed = await callGroq(systemPrompt, userMessage)
      if (!Array.isArray(parsed.steps) || parsed.steps.length < 4) {
        throw new Error('invalid_steps')
      }
    } catch {
      // Retry once with the same prompt
      try {
        parsed = await callGroq(systemPrompt, userMessage)
        if (!Array.isArray(parsed.steps) || parsed.steps.length < 4) {
          throw new Error('invalid_steps')
        }
      } catch {
        return NextResponse.json({ error: 'generation_failed', retry: true }, { status: 500 })
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        domain,
        skill_level,
        project_json: parsed,
        is_case_study: !!is_case_study,
      })
      .select()
      .single()

    if (insertError || !inserted) {
      return NextResponse.json({ error: 'generation_failed', retry: true }, { status: 500 })
    }

    return NextResponse.json({ project_id: inserted.id, status: 'ready' })
  } catch {
    return NextResponse.json({ error: 'generation_failed', retry: true }, { status: 500 })
  }
}