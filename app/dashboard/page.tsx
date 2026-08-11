import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser!.id)
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', authUser!.id)
    .order('created_at', { ascending: false })

  const activeProject = projects?.[0]
  const displayName = profile?.name?.split(' ')[0] || 'there'
  const completedCount = profile?.total_projects_completed ?? 0

  let continueStep = 1
  if (activeProject) {
    const { data: completedSteps } = await supabase
      .from('step_progress')
      .select('step_number')
      .eq('project_id', activeProject.id)
      .eq('user_id', authUser!.id)
      .eq('completed', true)
      .order('step_number', { ascending: false })
      .limit(1)

    if (completedSteps && completedSteps.length > 0) {
      continueStep = completedSteps[0].step_number + 1
    }
  }

  const totalStepsForActive: number = activeProject?.project_json?.steps?.length ?? 0
  const stepList = totalStepsForActive > 0
    ? Array.from({ length: totalStepsForActive }, (_, i) => i + 1)
    : []
  const continueHref = activeProject ? `/project/${activeProject.id}/step/${continueStep}` : '/entry'

  // Ring math: circumference for r=21 is ~132
  const CIRC = 132
  const completedRingCap = 10 // decorative cap so the ring has meaning without an arbitrary infinite scale
  const completedPct = Math.min(1, completedCount / completedRingCap)
  const completedOffset = CIRC - completedPct * CIRC

  const activeProgressPct = totalStepsForActive > 0 ? (continueStep - 1) / totalStepsForActive : 0
  const activeOffset = CIRC - activeProgressPct * CIRC

  const cardStyle = { background: 'var(--white)', borderColor: 'var(--border)' }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <Navbar
        creditBalance={profile?.credit_balance ?? 0}
        userName={profile?.name ?? ''}
      />

      <div className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
          Hi {displayName},
        </h1>
        <p className="mb-9" style={{ color: 'var(--muted)' }}>
          Let&apos;s build something you can show off.
        </p>

        {/* Today's project / active project — wayfinding route icon */}
        <div className="rounded-2xl p-6 border mb-8 flex items-center gap-4" style={cardStyle}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="shrink-0">
            <path d="M6 30 Q14 30 16 22 Q18 14 26 14 Q32 14 32 8" stroke="var(--muted)" strokeWidth="2" strokeDasharray="1 4.2" strokeLinecap="round" />
            <circle cx="6" cy="30" r="2.6" fill="var(--ink)" fillOpacity="0.55" />
            <path d="M32 4 l4 4 l-4 4 l0 -3 l-3 0 l0 -2 l3 0 z" fill="var(--accent)" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--accent)' }}>
              {activeProject ? "Today's project" : 'No active project'}
            </p>
            <p className="text-base font-semibold truncate" style={{ color: 'var(--ink)' }}>
              {activeProject ? (activeProject.project_json?.project_title || 'Untitled project') : "Pick one when you're ready"}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {activeProject ? `${activeProject.domain} · continuing at step ${continueStep}` : 'No pressure — browse a role or paste a JD'}
            </p>
          </div>
          <a href={continueHref} className="text-sm font-medium rounded-lg px-4 py-2 shrink-0" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            {activeProject ? 'Continue' : 'Start'}
          </a>
        </div>

        {/* Progress rings: active project completion + total projects completed */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5 border flex items-center gap-4" style={cardStyle}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="21" stroke="var(--border)" strokeWidth="5" fill="none" />
              <circle
                cx="26" cy="26" r="21" stroke="var(--accent)" strokeWidth="5" fill="none"
                strokeDasharray={CIRC} strokeDashoffset={totalStepsForActive > 0 ? activeOffset : CIRC}
                strokeLinecap="round" transform="rotate(-90 26 26)"
              />
            </svg>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                {profile?.credit_balance ?? 0}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Credits</p>
              <a href="/credits/topup" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                Top up →
              </a>
            </div>
          </div>

          <div className="rounded-2xl p-5 border flex items-center gap-4" style={cardStyle}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="21" stroke="var(--border)" strokeWidth="5" fill="none" />
              <circle
                cx="26" cy="26" r="21" stroke="var(--green)" strokeWidth="5" fill="none"
                strokeDasharray={CIRC} strokeDashoffset={completedOffset}
                strokeLinecap="round" transform="rotate(-90 26 26)"
              />
            </svg>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                {completedCount}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Completed</p>
            </div>
          </div>
        </div>

        {/* Node graph: step path for active project */}
        {activeProject && stepList.length > 0 && (
          <div className="rounded-2xl p-6 border mb-8" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted)' }}>
              Your path on this project
            </p>
            <div className="flex items-center">
              {stepList.map((n, i) => {
                const isDone = n < continueStep
                const isCurrent = n === continueStep
                const nodeColor = isDone ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--border)'
                return (
                  <div key={n} className="flex items-center" style={{ flex: i === stepList.length - 1 ? '0 0 auto' : '1 1 auto' }}>
                    <div
                      className="rounded-full shrink-0"
                      style={{
                        width: isCurrent ? 14 : 10,
                        height: isCurrent ? 14 : 10,
                        background: nodeColor,
                        border: isCurrent ? '2px solid var(--accent-bg)' : 'none',
                      }}
                    />
                    {i < stepList.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1" style={{ background: isDone ? 'var(--green)' : 'var(--border)' }} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Step 1</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Step {totalStepsForActive}</span>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="flex gap-6 mb-10 text-sm">
          <a href="/projects" style={{ color: 'var(--accent)' }}>My Projects →</a>
          <a href="/portfolio" style={{ color: 'var(--accent)' }}>Portfolio →</a>
        </div>

        {projects && projects.length > 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted)' }}>
              Recent Projects
            </p>
            <div className="space-y-3">
              {projects.slice(1, 5).map((p) => (
                <a key={p.id} href={`/project/${p.id}/step/1`} className="flex items-baseline justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>
                    {p.project_json?.project_title || 'Untitled project'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {p.domain}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}