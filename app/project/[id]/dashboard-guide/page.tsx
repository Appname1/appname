'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface StepData {
  step_number: number
  title: string
  code: string
  explanation: string
  beginner_breakdown: string
}

interface ProjectJson {
  project_title: string
  domain: string
  steps: StepData[]
}

export default function DashboardGuidePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.id)

  const [project, setProject] = useState<ProjectJson | null>(null)
  const [loaded, setLoaded] = useState(false)

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

  const dashboardSteps = project?.steps?.filter((s) => !s.code || s.code.trim().length === 0) ?? []

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a href={`/project/${projectId}/step/1`} className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Back to project
        </a>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
          Dashboard building guide
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          {project?.project_title ? `Every dashboard step for "${project.project_title}," in one place.` : 'Your dashboard steps for this project.'}
        </p>

        {dashboardSteps.length > 0 ? (
          <div className="space-y-6">
            {dashboardSteps.map((s) => (
              <div key={s.step_number} className="rounded-2xl p-5 border" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}>
                    Step {s.step_number}
                  </span>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                    {s.title}
                  </p>
                </div>
                {s.explanation && (
                  <p className="text-sm leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--ink)' }}>
                    {s.explanation}
                  </p>
                )}
                {s.beginner_breakdown && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                      Click by click
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                      {s.beginner_breakdown}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            This project doesn&apos;t have any dashboard-building steps.
          </p>
        )}
      </div>
    </div>
  )
}