'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SAMPLE_JDS: Record<string, string> = {
  'Data Analyst': `We are hiring a Data Analyst to join our retail analytics team. You will be responsible for building dashboards in Power BI, writing complex SQL queries against our data warehouse, and presenting weekly insights to category managers.

The ideal candidate has strong Excel and SQL skills, is comfortable working with large transactional datasets, and can communicate findings clearly to non-technical stakeholders. Experience with Python for data cleaning is a plus but not required.

You will work closely with the merchandising and operations teams to identify trends in sales performance, inventory turnover, and customer behavior across our store network.`,

  'Data Scientist': `Our fintech team is looking for a Data Scientist to build and deploy machine learning models for credit risk assessment and fraud detection. You will own the full model lifecycle, from feature engineering through deployment and monitoring.

Strong Python skills required, including pandas, scikit-learn, and experience with model evaluation techniques like cross-validation and ROC analysis. Experience with imbalanced classification problems is highly valued given the nature of fraud data.

You will collaborate with engineering to productionize models and with compliance to ensure our models meet regulatory explainability requirements.`,

  'ML Engineer': `We need an ML Engineer to take models from notebooks to production. You will design training pipelines, containerize models with Docker, and deploy them on AWS using SageMaker or equivalent infrastructure.

Strong software engineering fundamentals are as important as ML knowledge here. You should be comfortable with CI/CD, model versioning, and monitoring model performance drift in production over time.

Experience with TensorFlow or PyTorch is expected, along with a working understanding of MLOps practices and infrastructure-as-code tools like Terraform.`,

  'AI Engineer': `We're building LLM-powered products and need an AI Engineer to design and ship them. You will build RAG pipelines over internal documentation, integrate with OpenAI and open-source models, and design prompt strategies that are reliable in production.

Experience with LangChain or similar orchestration frameworks is expected, along with a solid understanding of vector databases and embedding strategies. You should be comfortable evaluating LLM outputs systematically, not just eyeballing results.

This role sits at the intersection of product and engineering, so clear communication about tradeoffs and limitations of AI systems matters as much as the technical build.`,
}

const SKILL_CATEGORIES = {
  'Data Analysis': ['Excel', 'SQL', 'Power BI', 'Tableau', 'Pandas'],
  'ML & AI': ['scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost'],
  'NLP & GenAI': ['NLTK', 'LangChain', 'OpenAI API', 'Vector Databases'],
  'Engineering Tools': ['Python', 'Docker', 'AWS', 'Git'],
}

export default function JdEntryPage() {
  const router = useRouter()
  const [jd, setJd] = useState('')
  const [showSkillPanel, setShowSkillPanel] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [apiResult, setApiResult] = useState<unknown>(null)
  const [apiDone, setApiDone] = useState(false)
  const [continueClicked, setContinueClicked] = useState(false)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleAnalyse = () => {
    if (!jd.trim()) return

    setShowSkillPanel(true) // show instantly, don't wait on the API

    fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd, skills: selectedSkills.length ? selectedSkills : ['Python'] }),
    })
      .then((res) => res.json())
      .then((data) => {
        setApiResult(data)
        setApiDone(true)
      })
      .catch(() => {
        setApiResult({ error: 'suggestion_failed', retry: true })
        setApiDone(true)
      })
  }

  const handleContinue = () => {
    setContinueClicked(true)
    if (apiDone) {
      sessionStorage.setItem('suggestions', JSON.stringify(apiResult))
      sessionStorage.setItem('entry_jd', jd)
      router.push('/suggestions')
    }
    // If not apiDone yet, the effect below will navigate once it lands
  }

  // Once the API finishes AFTER Continue was already clicked, navigate then
  if (apiDone && continueClicked && typeof window !== 'undefined') {
    const alreadyStored = sessionStorage.getItem('suggestions')
    if (!alreadyStored) {
      sessionStorage.setItem('suggestions', JSON.stringify(apiResult))
      sessionStorage.setItem('entry_jd', jd)
      router.push('/suggestions')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Paste the job description
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          The more detail, the better the project fits. Or try a sample below.
        </p>

        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-48 rounded-xl p-4 text-sm border mb-4"
          style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(SAMPLE_JDS).map((role) => (
            <button
              key={role}
              onClick={() => setJd(SAMPLE_JDS[role])}
              className="text-xs font-medium rounded-full px-3 py-1.5 border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--white)' }}
            >
              Try: {role}
            </button>
          ))}
        </div>

        {!showSkillPanel && (
          <button
            onClick={handleAnalyse}
            disabled={!jd.trim()}
            className="text-sm font-medium rounded-lg px-6 py-3 disabled:opacity-40"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Analyse this JD
          </button>
        )}

        {showSkillPanel && (
          <div
            className="rounded-2xl p-6 mt-6 border"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              While we read your JD, pick the skills you want to use
            </h2>
            <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
              Choose at least one to continue.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const selected = selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className="text-xs font-medium rounded-full px-3 py-1.5 border transition-colors"
                          style={{
                            borderColor: selected ? 'var(--accent)' : 'var(--border)',
                            background: selected ? 'var(--accent-bg)' : 'var(--white)',
                            color: selected ? 'var(--accent-dark)' : 'var(--ink)',
                          }}
                        >
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedSkills.length === 0}
              className="text-sm font-medium rounded-lg px-6 py-3 disabled:opacity-40"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {continueClicked && !apiDone ? 'Reading your JD...' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}