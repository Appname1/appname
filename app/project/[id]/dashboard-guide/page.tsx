'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface PreviewTile {
  type: string
  title: string
  position: string
}

interface StepData {
  step_number: number
  title: string
  code: string
  explanation: string
  beginner_breakdown: string
  dashboard_preview?: PreviewTile[]
}

interface ProjectJson {
  project_title: string
  domain: string
  steps: StepData[]
}

const TYPE_ICONS: Record<string, string> = {
  bar_chart: '▮▮▮',
  line_chart: '📈',
  card: '#',
  pie_chart: '◔',
  table: '☰',
  slicer: '▾',
}

const POSITION_GRID: Record<string, string> = {
  'top-left': 'col-start-1 row-start-1',
  'top-right': 'col-start-2 row-start-1',
  'bottom-left': 'col-start-1 row-start-2',
  'bottom-right': 'col-start-2 row-start-2',
  'full-width': 'col-span-2',
}

export default function DashboardGuidePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.id)

  const [project, setProject] = useState<ProjectJson | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

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
  const current = dashboardSteps[selectedIndex]

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <a href={`/project/${projectId}/step/1`} className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Back to project
        </a>

        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
          Dashboard building guide
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          {project?.project_title ? `For "${project.project_title}."` : 'Your dashboard steps for this project.'}
        </p>

        {dashboardSteps.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            This project doesn&apos;t have any dashboard-building steps.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            {/* Side panel: full list of dashboard steps */}
            <div className="space-y-1.5">
              {dashboardSteps.map((s, i) => (
                <button
                  key={s.step_number}
                  onClick={() => setSelectedIndex(i)}
                  className="w-full text-left rounded-lg px-3 py-2.5 text-sm border"
                  style={{
                    background: i === selectedIndex ? 'var(--accent-bg)' : 'var(--white)',
                    borderColor: i === selectedIndex ? 'var(--accent)' : 'var(--border)',
                    color: i === selectedIndex ? 'var(--accent-dark)' : 'var(--ink)',
                  }}
                >
                  <span className="block text-xs font-semibold mb-0.5" style={{ color: i === selectedIndex ? 'var(--accent-dark)' : 'var(--muted)' }}>
                    Step {s.step_number}
                  </span>
                  {s.title}
                </button>
              ))}
            </div>

            {/* Content panel */}
            {current && (
              <div className="rounded-2xl p-6 border" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}>
                    Step {current.step_number}
                  </span>
                  <p className="text-base font-semibold" style={{ color: 'var(--ink)' }}>
                    {current.title}
                  </p>
                </div>

                {current.explanation && (
                  <p className="text-sm leading-relaxed whitespace-pre-line mb-4" style={{ color: 'var(--ink)' }}>
                    {current.explanation}
                  </p>
                )}

                {current.dashboard_preview && current.dashboard_preview.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
                      What your canvas should look like
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg" style={{ background: 'var(--tag-bg)' }}>
                      {current.dashboard_preview.map((tile, i) => (
                        <div
                          key={i}
                          className={`rounded-md p-3 border text-center ${POSITION_GRID[tile.position] ?? ''}`}
                          style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
                        >
                          <p className="text-lg mb-1" style={{ color: 'var(--accent)' }}>
                            {TYPE_ICONS[tile.type] ?? '▢'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--ink)' }}>{tile.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {current.beginner_breakdown && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                      Click by click
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                      {current.beginner_breakdown}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                    disabled={selectedIndex === 0}
                    className="text-sm font-medium rounded-lg px-4 py-2 border disabled:opacity-40"
                    style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setSelectedIndex(Math.min(dashboardSteps.length - 1, selectedIndex + 1))}
                    disabled={selectedIndex === dashboardSteps.length - 1}
                    className="text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-40"
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}