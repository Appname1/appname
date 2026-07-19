import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a warm, patient mentor explaining a dataset to a first-year student who has never worked with data before.

You will receive column names, sample rows, a domain, and a project title. Explain what this dataset represents, what each column means, its likely data type, and which columns are useful for the project.

Tone: warm and plain — like a mentor explaining to a first-year student who has never seen data before. Avoid jargon. Avoid sounding robotic or clinical.

Return ONLY raw JSON — nothing before { and nothing after }. No markdown. No backticks.

Exact JSON structure:
{
  "dataset_description": "",
  "column_explanations": [
    {"name": "", "meaning": "", "likely_type": "", "useful_for_project": true}
  ]
}

Return ONLY raw JSON, nothing before { and nothing after }.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { columns, sample_rows, domain, project_title } = body

    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json({ error: 'columns_required' }, { status: 400 })
    }

    if (request.headers.get('X-Test') === 'true') {
      return NextResponse.json({
        dataset_description: 'Mock dataset description for testing.',
        column_explanations: columns.map((c: string) => ({
          name: c,
          meaning: 'Mock meaning',
          likely_type: 'string',
          useful_for_project: true,
        })),
      })
    }

    const userMessage = `Project: ${project_title}\nDomain: ${domain}\nColumns: ${columns.join(', ')}\nSample rows: ${JSON.stringify(sample_rows ?? [])}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
      return NextResponse.json({ error: 'explain_failed', retry: true }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'explain_failed', retry: true }, { status: 500 })
  }
}