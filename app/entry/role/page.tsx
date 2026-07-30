'use client'

import { useRouter } from 'next/navigation'

const DOMAINS = [
  { key: 'DA', name: 'Data Analyst', desc: 'Dashboards, SQL, and business reporting.' },
  { key: 'DS', name: 'Data Scientist', desc: 'Predictive modeling and statistical analysis.' },
  { key: 'ML', name: 'ML Engineer', desc: 'Training and deploying models to production.' },
  { key: 'AI_ENGINEER', name: 'AI Engineer', desc: 'LLM apps, agents, and AI product features.' },
  { key: 'NLP', name: 'NLP Engineer', desc: 'Text classification, sentiment, and language tasks.' },
  { key: 'GENAI', name: 'GenAI', desc: 'Generative models and creative AI applications.' },
  { key: 'RAG', name: 'RAG', desc: 'Retrieval-augmented generation over real documents.' },
]

export default function RoleEntryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Browse by role
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          Pick the domain you&apos;re aiming for.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map((d) => (
            <button
              key={d.key}
              onClick={() => router.push(`/entry/role/${d.key.toLowerCase()}`)}
              className="text-left rounded-2xl p-6 border transition-transform hover:scale-[1.02]"
              style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
            >
              <span
                className="inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-3"
                style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
              >
                {d.key}
              </span>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                {d.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {d.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}