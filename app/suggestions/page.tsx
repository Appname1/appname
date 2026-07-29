'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Dataset {
  name: string
  url: string
  why_suitable: string
}

interface Suggestion {
  title: string
  domain: string
  relevancy_score: number
  why_relevant: string
  tech_stack: string[]
  difficulty: string
  is_case_study: boolean
  datasets: Dataset[]
}

export default function SuggestionsPage() {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [projectsCompleted, setProjectsCompleted] = useState(0)

  useEffect(() => {
    async function init() {
      const raw = sessionStorage.getItem('suggestions')
      if (!raw) {
        setError(true)
        setLoaded(true)
        return
      }
      try {
        const parsed = JSON.parse(raw)
        if (parsed.error || !Array.isArray(parsed.suggestions)) {
          setError(true)
        } else {
          setSuggestions(parsed.suggestions)
        }
      } catch {
        setError(true)
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('total_projects_completed')
          .eq('id', user.id)
          .single()
        setProjectsCompleted(profile?.total_projects_completed ?? 0)
      }

      setLoaded(true)
    }
    init()
  }, [])

  const caseStudiesUnlocked = projectsCompleted >= 2

  const handleBuild = (suggestion: Suggestion) => {
    if (suggestion.is_case_study && !caseStudiesUnlocked) return
    localStorage.setItem('appname_selected_project', JSON.stringify(suggestion))
    router.push('/upload')
  }

  if (!loaded) return null

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="text-center max-w-sm px-6">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            We couldn&apos;t load your suggestions
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            Something went wrong reading your JD. Let&apos;s try again.
          </p>
          <button
            onClick={() => router.push('/entry/jd')}
            className="text-sm font-medium rounded-lg px-5 py-2.5"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const maxScore = Math.max(...suggestions.map((s) => s.relevancy_score))

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          3 projects built for this role
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          Pick the one that fits where you want to be.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {suggestions.map((s, i) => {
            const isRecommended = s.relevancy_score === maxScore
            const isLocked = s.is_case_study && !caseStudiesUnlocked

            return (
              <div
                key={i}
                className="rounded-2xl p-6 flex flex-col border relative"
                style={{
                  background: 'var(--white)',
                  borderColor: isRecommended ? 'var(--accent)' : 'var(--border)',
                  borderWidth: isRecommended ? '2px' : '1px',
                  opacity: isLocked ? 0.7 : 1,
                }}
              >
                {isRecommended && (
                  <span
                    className="inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-3 w-fit"
                    style={{ background: 'var(--accent)', color: 'var(--paper)' }}
                  >
                    Recommended
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="text-xs font-semibold rounded-full px-2.5 py-1"
                    style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
                  >
                    {s.domain}
                  </span>
                  <span
                    className="text-xs font-medium rounded-full px-2.5 py-1"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
                  >
                    {s.difficulty}
                  </span>
                  {s.is_case_study && (
                    <span
                      className="text-xs font-medium rounded-full px-2.5 py-1"
                      style={{ background: isLocked ? 'var(--tag-bg)' : 'var(--green-bg)', color: isLocked ? 'var(--muted)' : 'var(--green-dark)' }}
                    >
                      {isLocked ? 'Case Study (locked)' : 'Case Study'}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                  {s.title}
                </h2>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>Relevance</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {s.relevancy_score}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${s.relevancy_score}%`, background: 'var(--accent)' }}
                    />
                  </div>
                </div>

                <p className="text-base mb-4 flex-1" style={{ color: 'var(--muted)' }}>
                  {s.why_relevant}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {s.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="text-sm rounded-md px-2.5 py-1.5"
                      style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mb-4 space-y-1.5">
                  {s.datasets.map((d) => {
                    const linkStyle = { color: 'var(--muted)' }
                    return (
                      <a key={d.name} href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs block underline" style={linkStyle}>
                        {d.name}
                      </a>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-medium rounded-full px-2.5 py-1"
                    style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
                  >
                    Uses credits
                  </span>
                </div>

                {isLocked ? (
                  <div>
                    <button
                      disabled
                      className="w-full text-sm font-medium rounded-lg py-2.5 cursor-not-allowed"
                      style={{ background: 'var(--border)', color: 'var(--muted)' }}
                    >
                      Locked
                    </button>
                    <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
                      Complete {2 - projectsCompleted} more project{2 - projectsCompleted === 1 ? '' : 's'} to unlock
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuild(s)}
                    className="w-full text-sm font-medium rounded-lg py-2.5"
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                  >
                    Build This Project
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}