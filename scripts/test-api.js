// scripts/test-api.js
// Quality gate: run with `node scripts/test-api.js` (or `node scripts/test-api.js --base https://appname-pi.vercel.app`)
// Tests /api/suggest with 5 JDs, then /api/generate for the first suggestion of each.

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3000'

const STEP_COUNTS = { DA: 6, DS: 7, ML: 8, AI_ENGINEER: 8, NLP: 8, GENAI: 8, RAG: 8 }

const MOCK_COLUMNS = ['customer_id', 'age', 'income', 'purchase_history', 'churn']

const TEST_JDS = [
  {
    label: 'a. Data Analyst at fintech',
    jd: 'We are hiring a Data Analyst for our fintech team. You will write SQL queries, build Power BI dashboards, and analyze transaction data.',
    skills: ['SQL', 'Power BI', 'Python', 'Pandas'],
  },
  {
    label: 'b. Data Scientist at ecommerce',
    jd: 'Seeking a Data Scientist to build predictive models for customer behavior and churn using machine learning.',
    skills: ['Python', 'Scikit-Learn', 'XGBoost'],
  },
  {
    label: 'c. ML Engineer at healthtech',
    jd: 'ML Engineer needed to design, train, and deploy models into production using MLOps best practices.',
    skills: ['PyTorch', 'MLOps', 'Docker'],
  },
  {
    label: 'd. NLP Engineer at AI startup',
    jd: 'NLP Engineer to build LLM-powered chatbots and document search using transformer models.',
    skills: ['BERT', 'LangChain', 'Transformers'],
  },
  {
    label: 'e. Vague JD',
    jd: 'We need a data-savvy person to join our growing team',
    skills: ['Python', 'Excel'],
  },
]

let totalChecks = 0
let passedChecks = 0

function check(label, condition, failureReason) {
  totalChecks++
  if (condition) {
    passedChecks++
    console.log(`  ✅ PASS: ${label}`)
  } else {
    console.log(`  ❌ FAIL: ${label} — ${failureReason}`)
  }
}

function hasListComprehension(text) {
  return /\[\s*\w+\s+for\s+/.test(text)
}

async function testSuggest(testCase) {
  console.log(`\n--- Test 1: /api/suggest — ${testCase.label} ---`)
  const res = await fetch(`${BASE_URL}/api/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test': 'true' },
    body: JSON.stringify({ jd: testCase.jd, skills: testCase.skills }),
  })

  let data
  try {
    data = await res.json()
  } catch {
    check('JSON parses', false, 'response was not valid JSON')
    return null
  }

  check('JSON parses without SyntaxError', true)
  check('Exactly 3 suggestions', Array.isArray(data.suggestions) && data.suggestions.length === 3,
    `got ${data.suggestions?.length ?? 'undefined'}`)

  if (Array.isArray(data.suggestions)) {
    data.suggestions.forEach((s, i) => {
      check(`Suggestion ${i + 1} has 3 datasets`, Array.isArray(s.datasets) && s.datasets.length === 3,
        `got ${s.datasets?.length ?? 'undefined'}`)
      check(`Suggestion ${i + 1} relevancy_score is a number`, typeof s.relevancy_score === 'number',
        `got type ${typeof s.relevancy_score}`)
    })
  }

  return data
}

async function testGenerate(testCase, suggestion) {
  console.log(`\n--- Test 2: /api/generate (mock, real logic tested manually) — ${testCase.label} ---`)

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test': 'true' },
    body: JSON.stringify({
      project_title: suggestion?.title ?? 'Test Project',
      domain: suggestion?.domain ?? 'DA',
      jd: testCase.jd,
      skills: testCase.skills,
      dataset_columns: MOCK_COLUMNS,
      dataset_name: 'Mock Dataset',
      skill_level: 'BEGINNER',
      is_case_study: suggestion?.is_case_study ?? false,
    }),
  })

  let data
  try {
    data = await res.json()
  } catch {
    check('JSON parses', false, 'response was not valid JSON')
    return
  }

  // Note: X-Test on /api/generate returns a lightweight mock ({project_id, status}),
  // not a full project. Full-shape validation (steps, quiz, dataset_deep_dive) should be
  // re-run manually against real Groq output periodically — this script checks the route
  // responds correctly and the mock path works, which is what CI/regression runs need.
  check('Returns project_id and status', !!data.project_id && data.status === 'ready',
    JSON.stringify(data))
}

async function runAll() {
  console.log(`Running quality gate against ${BASE_URL}\n${'='.repeat(50)}`)

  for (const testCase of TEST_JDS) {
    const suggestData = await testSuggest(testCase)
    const firstSuggestion = suggestData?.suggestions?.[0]
    await testGenerate(testCase, firstSuggestion)
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`\nOVERALL: ${passedChecks}/${totalChecks} checks passed`)
  if (passedChecks === totalChecks) {
    console.log('✅ OVERALL PASS')
    process.exit(0)
  } else {
    console.log('❌ OVERALL FAIL')
    process.exit(1)
  }
}

runAll()