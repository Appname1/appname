import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const STEP_COUNTS: Record<string, number> = {
  DA: 8,
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
      "breakdown_simple": "",
      "beginner_breakdown": "",
      "expected_output": "",
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
Code rules: industry quality, real pandas/sklearn/matplotlib, executable in Google Colab. Code should look like a beginner-friendly tutorial, not a compressed one-liner-heavy script — favor clarity over cleverness.

VARIABLE NAMING RULE: always use "df" as the main DataFrame variable name, consistently across every step, unless the project genuinely needs to distinguish multiple DataFrames (e.g. train_df, test_df) — never invent a different single-DataFrame name like "dataset" or "data".

REQUIRED EARLY STEPS: for any project involving a DataFrame, the first 1-2 steps must cover basic exploration before any transformation happens: importing libraries, reading the CSV into df, then df.head(), df.shape, df.info(), df.describe(), and df.isnull().sum(). Do not skip straight to feature engineering or modeling without these.
DA DOMAIN STEP ALLOCATION RULE: if domain is "DA", the project MUST cover every skill the user selected (given in the message below) with real depth — never skip a selected skill entirely, and never let one skill (like Power BI alone) crowd out the others. Structure the steps like this:
1. Always start with real Python EDA: import libraries, load the CSV into df, then df.head(), df.shape, df.info(), df.describe(), df.isnull().sum() — these are non-negotiable regardless of which other skills were selected.
2. If "SQL" was selected: include 1-2 dedicated steps with real SQL queries (as a code block, using standard SQL syntax) — e.g. querying/aggregating the data as if it were loaded into a table, using SELECT, GROUP BY, WHERE, JOIN where relevant to this dataset. Do not skip this just because a BI tool was also selected.
3. If "Power BI" or "Tableau" was selected: include 2-3 dedicated steps for dashboard-building. For these steps, set "code" to an empty string. "explanation" must be a NUMBERED list of concrete clicks/actions, specific enough to follow without needing a screenshot — e.g. "1. Open Power BI Desktop. 2. Click Get Data > Text/CSV. 3. Select your file and click Load. 4. Drag 'purpose' to the X-axis of a new Clustered Column Chart. 5. Drag 'loan_amount' to the Y-axis, set aggregation to Average." Never write a single vague sentence like "we build a dashboard" — always the literal numbered click sequence. "beginner_breakdown" should restate the same sequence in even more basic terms for someone who has never opened the tool before, still using the → arrow format for anything unfamiliar (e.g. "Get Data → the button that lets you import a file into Power BI").
4. Distribute the fixed step count (6 for DA) across whichever of these categories the user actually selected — do not let any selected skill end up with zero steps. If the user selected Python, SQL, and Power BI together, aim for roughly: 2 Python EDA steps, 1-2 SQL steps, 2-3 Power BI steps, adjusting to fit exactly 6 total.
CODE RULE (applies to the "code" field itself, not just the explanation): when the logic involves iterating, filtering, or transforming data manually, write it using explicit for loops — NOT list comprehensions, lambda, map(), or filter(). This applies even when list comprehensions would be more idiomatic. Standard library/pandas/sklearn one-liners (e.g. train_test_split, model.fit, df.groupby) are fine as-is since they aren't manual iteration.
There are now TWO breakdown fields, at different depths:

breakdown_simple: a short, scannable version — one line per code line, using the → arrow to point from code to meaning, MAX 6-8 words after the arrow per line. This is the default view everyone sees. Also fold in variable naming here inline, not as a separate note: e.g. "le = LabelEncoder() → le is just a name we chose; could be 'encoder' instead." Example for the whole pattern:
"le = LabelEncoder() → creates a tool that turns text into numbers
df['Sex'] = le.fit_transform(df['Sex']) → replaces the Sex column with number versions
for c in df.columns: → c is a made-up name for each column, one at a time"

beginner_breakdown: the full deep-dive version, shown only if someone clicks "Still don't get it?" after reading breakdown_simple. This is where the full patient, first-principles teaching happens — define function/argument/return/loop the first time each appears, use analogies, go fully line by line as before. Someone who read breakdown_simple and is still lost should find real clarity here.
expected_output: MUST be concrete and specific to the ACTUAL dataset and code in this step, never generic. This is a HARD requirement — reject any phrasing that sounds like a description of what output would look like rather than the output itself.

BANNED PATTERNS (never write anything resembling these): "The dataset with X converted", "Shows the result of X", "The output will display Y", "A table showing Z". These are descriptions, not outputs, and are not acceptable.

REQUIRED PATTERNS:
- df.head() or similar → write 2-3 literal rows of fake-but-realistic data using this project's actual column names, formatted like a real pandas table output.
- df.shape → a literal tuple, e.g. (1000, 21)
- Any print(f"...") or accuracy/score output → a literal specific number, e.g. "Accuracy: 0.84"
- LabelEncoder/astype/transform lines with no print → "No visible output — this line transforms df in place. You can check it worked by running df.head() again and seeing numbers instead of text in that column."
- A plot → one literal sentence describing exactly what appears, e.g. "A bar chart with 2 bars: 'Male' around 340, 'Female' around 210."
- An import line → "No output — this just loads the tools we'll use."

Every expected_output must read like an actual result a learner would see on their screen, not a summary of what happened.

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
    max_tokens: 7000,
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