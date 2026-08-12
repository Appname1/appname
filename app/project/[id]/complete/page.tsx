'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface ProjectJson {
  project_title: string
  final_summary: string
  skills_demonstrated: string[]
  interview_talking_points: string[]
  description_test_prompt: string
}

export default function ProjectCompletePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.id)

  const [project, setProject] = useState<ProjectJson | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [testAnswer, setTestAnswer] = useState('')
  const [testSubmitted, setTestSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase
        .from('projects')
        .select('project_json')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

      setProject(data?.project_json ?? null)
      setLoaded(true)
    }
    load()
  }, [projectId, router])

  if (!loaded) return null

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <p style={{ color: 'var(--muted)' }}>We couldn&apos;t find this project.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-4"
            style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}
          >
            Project complete
          </span>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            {project.project_title}
          </h1>
          {project.final_summary && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {project.final_summary}
            </p>
          )}
        </div>

        {project.skills_demonstrated && project.skills_demonstrated.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              Skills demonstrated
            </p>
            <div className="flex flex-wrap gap-2">
              {project.skills_demonstrated.map((s) => (
                <span key={s} className="text-xs rounded-full px-3 py-1.5" style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.interview_talking_points && project.interview_talking_points.length > 0 && (
          <div className="rounded-2xl p-6 border mb-8" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
              Interview talking points
            </p>
            <ul className="space-y-2">
              {project.interview_talking_points.map((point) => (
                <li key={point} className="text-sm flex gap-2" style={{ color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.description_test_prompt && (
          <div className="rounded-2xl p-6 border mb-8" style={{ background: 'var(--accent-bg)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--accent-dark)' }}>
              Readiness check
            </p>
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--ink)' }}>
              {project.description_test_prompt}
            </p>
            {testSubmitted ? (
              <p className="text-sm" style={{ color: 'var(--accent-dark)' }}>
                Good — if you could write that, you can talk through it in an interview too.
              </p>
            ) : (
              <>
                <textarea
                  value={testAnswer}
                  onChange={(e) => setTestAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-28 rounded-lg p-3 text-sm border mb-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
                />
                <button
                  onClick={() => setTestSubmitted(true)}
                  disabled={!testAnswer.trim()}
                  className="text-sm font-medium rounded-lg px-5 py-2.5 disabled:opacity-40"
                  style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                >
                  I&apos;ve answered it
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {(() => {
            const outlineStyle = { borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }
            const filledStyle = { background: 'var(--ink)', color: 'var(--paper)' }
            return (
              <>
                <a href="/dashboard" className="flex-1 text-center text-sm font-medium rounded-lg py-3 border" style={outlineStyle}>
                  Back to Dashboard
                </a>
                <a href="/entry" className="flex-1 text-center text-sm font-medium rounded-lg py-3" style={filledStyle}>
                  Build another
                </a>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}