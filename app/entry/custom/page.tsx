'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CORE_SKILLS = ['Python', 'R', 'SQL', 'Excel']

export default function CustomEntryPage() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async () => {
    if (!description.trim() || selectedSkills.length === 0) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: description, skills: selectedSkills }),
      })
      const data = await res.json()
      sessionStorage.setItem('suggestions', JSON.stringify(data))
      sessionStorage.setItem('entry_jd', description)
      router.push('/suggestions')
    } catch {
      setSubmitting(false)
    }
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
          placeholder="e.g. I want to build something that predicts house prices using a dataset with square footage and location..."
          className="w-full h-40 rounded-xl p-4 text-sm border mb-6"
          style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
        />

        <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
          Skills you want to use
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
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

        <button
          onClick={handleSubmit}
          disabled={!description.trim() || selectedSkills.length === 0 || submitting}
          className="text-sm font-medium rounded-lg px-6 py-3 disabled:opacity-40"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {submitting ? 'Thinking...' : 'Build my project ideas'}
        </button>
      </div>
    </div>
  )
}