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

CODE RULE (applies to the "code" field itself, not just the explanation): when the logic involves iterating, filtering, or transforming data manually, write it using explicit for loops — NOT list comprehensions, lambda, map(), or filter(). This applies even when list comprehensions would be more idiomatic. Standard library/pandas/sklearn one-liners (e.g. train_test_split, model.fit, df.groupby) are fine as-is since they aren't manual iteration.

beginner_breakdown MUST be a true line-by-line walkthrough for someone who has NEVER written Python before and does not know what a function, argument, method, loop, or variable is. Do NOT summarize what the code accomplishes at a high level — that belongs in "explanation", not here.

FORMAT REQUIREMENT: write beginner_breakdown as one short block PER LINE of code, in the exact order the lines appear, separated by newlines. Do not compress multiple lines into one summarizing sentence. Every single line in the code field must get its own explanation, even simple-looking ones.

For each line:
- Quote or reference the literal code on that line.
- If it's a function or method call (e.g. train_test_split(X, y, test_size=0.2)), explicitly define: "This is called a function — a reusable block of code someone already wrote. The stuff inside the parentheses (X, y, test_size=0.2) are called arguments — the specific inputs you're giving that function to work with."
- If it's an assignment (e.g. X_train, X_test, y_train, y_test = ...), explain that the = sign stores the result on the right into the name(s) on the left, and that when there are multiple names separated by commas, the function is returning multiple pieces of data at once, one for each name in order.
- If it's a loop, explain the loop variable is just a made-up name standing in for each item, one at a time, and that it could be renamed to anything.
- If it's a dictionary, list, or method most beginners haven't seen, explain it with a small everyday analogy.
- Never assume the reader knows what "the function returns X" or "we pass Y as an argument" means without first defining function/argument/return in plain words the first time they appear in this step.

Two example patterns to match the required depth:

Example A — a loop (code: "for c in df.columns:\n    if df[c].dtype == 'object':\n        df[c] = df[c].astype('category')"):
"for c in df.columns: — this starts a loop, which means we repeat the next lines once for every item in a list. df.columns is a list of every column name in your dataframe. c is just a name we made up to stand in for each column name, one at a time, as the loop runs — you could call it col or x instead, it makes no difference.
if df[c].dtype == 'object': — this checks the data type of that column. object usually means it holds text.
df[c] = df[c].astype('category') — this replaces that column with a 'category' version of itself, which pandas and machine learning models handle better than plain text."

Example B — a function call with multiple assignment (code: "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)"):
"train_test_split(...) — train_test_split is a function, which means it's a ready-made block of code someone already wrote that does a specific job for you — in this case, splitting data into a training portion and a testing portion. X, y, test_size=0.2, random_state=42 are called arguments — these are the specific pieces of information you're handing to the function so it knows what to work with: X is your input data, y is what you're trying to predict, test_size=0.2 means use 20% of the data for testing, and random_state=42 just makes sure you get the same random split every time you run this.
X_train, X_test, y_train, y_test = ... — the = sign means 'store the result here'. Since train_test_split hands back four separate pieces of data at once, we list four names on the left, separated by commas, and each one automatically catches the matching piece of data in order."

Match this depth and format for every line in every step. If a line is truly trivial (like a single import), a one-sentence explanation is fine — but never fall back to a paragraph-level summary for anything involving a function call, loop, or unfamiliar syntax.

explanation: 2-3 sentences on WHY this step exists in the project (the practical/business reason), separate from beginner_breakdown.
VISUAL ANNOTATION RULE: within beginner_breakdown, when defining what a made-up name (loop variable, parameter name) stands for, use this exact inline arrow format so it's visually scannable: "c → just a made-up name standing in for each column, one at a time. Could be renamed to col or x." Use the → arrow specifically when pointing from a piece of code to its plain-English meaning, throughout the breakdown, not just once.

expected_output: for every step, write what a learner should see appear if they run this exact code — e.g. actual sample rows for a df.head() call, the shape tuple for df.shape, "No output — this line just imports libraries" for an import line, or a plausible printed value for a print() statement. Keep it realistic and specific to the dataset in this project, not generic placeholder text.


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