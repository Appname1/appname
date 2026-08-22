import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function ProjectsPage() {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('credit_balance, name')
    .eq('id', user!.id)
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  // Get completed step counts per project for a progress readout
  const projectIds = projects?.map((p) => p.id) ?? []
  const { data: allProgress } = projectIds.length > 0
    ? await supabase
        .from('step_progress')
        .select('project_id, step_number, completed')
        .in('project_id', projectIds)
        .eq('completed', true)
    : { data: [] }

  const progressByProject: Record<string, number> = {}
  allProgress?.forEach((row) => {
    progressByProject[row.project_id] = Math.max(progressByProject[row.project_id] ?? 0, row.step_number)
  })

  const cardStyle = { background: 'var(--white)', borderColor: 'var(--border)' }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <Navbar creditBalance={profile?.credit_balance ?? 0} userName={profile?.name ?? ''} />

            <div className="max-w-4xl mx-auto px-6 py-14">
        <a href="/dashboard" className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Dashboard
        </a>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            My Projects
          </h1>
          <a href="/entry" className="text-sm font-medium rounded-lg px-4 py-2" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            Start new project
          </a>
        </div>

        {projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((p) => {
              const totalSteps: number = p.project_json?.steps?.length ?? 0
              const completedStep = progressByProject[p.id] ?? 0
              const isFinished = totalSteps > 0 && completedStep >= totalSteps
              const nextStep = Math.min(completedStep + 1, totalSteps || 1)
              const progressPct = totalSteps > 0 ? Math.round((completedStep / totalSteps) * 100) : 0

              return (
                <a key={p.id} href={`/project/${p.id}/step/${nextStep}`} className="block rounded-2xl p-5 border" style={cardStyle}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}>
                          {p.domain}
                        </span>
                        {isFinished && (
                          <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}>
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-base font-semibold truncate" style={{ color: 'var(--ink)' }}>
                        {p.project_json?.project_title || 'Untitled project'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {isFinished ? 'All steps complete' : `Step ${completedStep} of ${totalSteps} done`}
                      </p>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${progressPct}%`, background: isFinished ? 'var(--green)' : 'var(--accent)' }}
                        />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center border" style={cardStyle}>
            <p className="text-base mb-5" style={{ color: 'var(--muted)' }}>
              Nothing here yet — your first project will show up once you build one.
            </p>
            <a href="/entry" className="inline-block text-sm font-medium rounded-lg px-5 py-2.5" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Start your first project
            </a>
          </div>
        )}
      </div>
    </div>
  )
}