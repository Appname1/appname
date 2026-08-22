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
  steps: StepData[]
}

const GENERAL_STEPS = [
  { title: 'Step 1: Open your BI tool', body: 'Open Power BI Desktop (Windows, free download from Microsoft) or Tableau Public/Desktop. Both let you import a CSV and build charts without writing code.' },
  { title: 'Step 2: Import your data', body: 'In Power BI: click "Get Data" on the Home ribbon, choose "Text/CSV," select your file, then click "Load." In Tableau: click "Connect" on the start screen, choose "Text file," and select your CSV.' },
  { title: 'Step 3: Check your data types', body: 'Click on each column header. Make sure dates are recognized as dates, numbers as numbers, and text as text. Fix any that were auto-detected wrong — this affects how charts group and sort your data.' },
  { title: 'Step 4: Build your first visual', body: 'Drag a categorical column (like a product name or region) onto a new Bar Chart or Column Chart. Drag a numeric column (like sales amount) onto the value axis. The chart builds itself as you drag.' },
  { title: 'Step 5: Add filters and slicers', body: 'Drag a column you want to filter by (like a date or category) into the Filters pane (Power BI) or onto the Filters shelf (Tableau). This lets anyone viewing the dashboard narrow down what they see.' },
  { title: 'Step 6: Add KPI cards', body: 'For key numbers (like total revenue or average order size), use a Card visual (Power BI) or a Text/Number tile (Tableau) to show a single big number at a glance.' },
  { title: 'Step 7: Arrange and publish', body: 'Resize and position your visuals on the canvas so related charts sit together. When ready, use File > Publish (Power BI, needs a free Power BI account) or Server > Publish Workbook (Tableau Public, free) to share it.' },
]

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
          A general walkthrough of Power BI / Tableau, plus this project&apos;s specific steps in one place.
        </p>

        <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--accent)' }}>
          General guide
        </h2>
        <div className="space-y-5 mb-12">
          {GENERAL_STEPS.map((s) => (
            <div key={s.title}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>{s.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{s.body}</p>
            </div>
          ))}
        </div>

        {dashboardSteps.length > 0 && (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--accent)' }}>
              This project&apos;s dashboard steps
            </h2>
            <div className="space-y-6">
              {dashboardSteps.map((s) => (
                <div key={s.step_number} className="rounded-2xl p-5 border" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    Step {s.step_number}: {s.title}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ink)' }}>
                    {s.explanation}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}