import { NextResponse } from 'next/server'
import { callGroqWithFallback } from '@/lib/groq'
import { createServerSupabaseClient } from '@/lib/supabase-server'


const SYSTEM_PROMPT = `You are a patient mentor helping a beginner understand a Python error message.

You will receive the error message they got and the code they ran. Explain in plain English: what went wrong, why it happened, and how to fix it. Keep it warm, never condescending — errors are normal and expected while learning.

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "what_happened": "1-2 plain sentences describing the error in everyday terms",
  "why_it_happened": "1-2 sentences on the likely cause",
  "how_to_fix": "specific, actionable steps to fix it",
  "corrected_code": "the corrected code if confident, or empty string if unsure"
}

Return ONLY raw JSON, nothing before { and nothing after }.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { error_message, code } = body

    if (!error_message || typeof error_message !== 'string') {
      return NextResponse.json({ error: 'error_message_required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const userMessage = 'Error message: ' + error_message + '\n\nCode that caused it: ' + (code || 'Not provided')

    const completion = await callGroqWithFallback({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1000,
    })

    let raw = completion.choices[0]?.message?.content ?? ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'explain_failed', retry: true }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'explain_failed', retry: true }, { status: 500 })
  }
}
