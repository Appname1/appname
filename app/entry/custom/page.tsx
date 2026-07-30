'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CORE_SKILLS = ['Python', 'R', 'SQL', 'Excel']

const SKILL_CATEGORIES = {
  'Data Visualization & BI': ['Power BI', 'Tableau', 'Pandas'],
  'ML & AI': ['scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost'],
  'NLP & GenAI': ['NLTK', 'LangChain', 'OpenAI API', 'Vector Databases'],
  'Engineering Tools': ['Docker', 'AWS', 'Git'],
}

export default function CustomEntryPage() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [apiDone, setApiDone] = useState(false)
  const [apiResult, setApiResult] = useState<unknown>(null)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = () => {
    if (!description.trim() || selectedSkills.length === 0) return
    setSubmitted(true)

    fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd: description, skills: selectedSkills }),
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

  if (apiDone && typeof window !== 'undefined') {
    const already = sessionStorage.getItem('suggestions')
    if (!already) {
      sessionStorage.setItem('suggestions', JSON.stringify(apiResult))
      sessionStorage.setItem('entry_jd', description)
      router.push('/suggestions')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-xl px-6 text-center w-full">
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            While we shape your project...
          </h1>
          <div
            className="rounded-2xl p-8 border text-left"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <p className="text-base mb-5" style={{ color: 'var(--muted)' }}>
              A few things worth knowing before you start building:
            </p>
            <ul className="text-base space-y-4" style={{ color: 'var(--ink)' }}>
              <li className="flex gap-3">
                <span style={{ color: 'var(--accent)' }}>●</span>
                <span>Every step comes with real, working code — never a black box.</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'var(--accent)' }}>●</span>
                <span>You&apos;ll get a short quiz after each step to check it actually stuck.</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'var(--accent)' }}>●</span>
                <span>At the end, you get interview talking points pulled from what you built.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Describe the project you want to build
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          No job description needed. Just tell us what you have in mind, however rough.
        </p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. I want to build a RAG chatbot that answers questions from a set of PDF documents..."
          className="w-full h-40 rounded-xl p-4 text-sm border mb-6"
          style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
        />

        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
            Core Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {CORE_SKILLS.map((skill) => {
              const selected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="text-sm font-medium rounded-full px-3.5 py-2 border transition-colors"
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

        {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
          <div key={category} className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const selected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="text-sm font-medium rounded-full px-3.5 py-2 border transition-colors"
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

        <button
          onClick={handleSubmit}
          disabled={!description.trim() || selectedSkills.length === 0}
          className="text-sm font-medium rounded-lg px-6 py-3 disabled:opacity-40 mt-3"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          Build my project ideas
        </button>
      </div>
    </div>
  )
}