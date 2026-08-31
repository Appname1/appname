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
  const activeIsFinished = totalStepsForActive > 0 && continueStep > totalStepsForActive

  const continueHref = activeProject
    ? activeIsFinished
      ? `/project/${activeProject.id}/complete`
      : `/project/${activeProject.id}/step/${continueStep}`
    : '/entry'

  const CIRC = 2 * Math.PI * 27 // r=27
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
        <div className="dash-in dash-in-1">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
            Hi {displayName},
          </h1>
          <div className="flex items-center justify-between mb-8">
            <p style={{ color: 'var(--muted)' }}>
              {activeProject ? 'Pick up where you left off.' : "Let's build something you can show off."}
            </p>
            <a href="/entry" className="text-sm font-medium rounded-lg px-4 py-2 shrink-0" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Start new project
            </a>
          </div>
        </div>

        {/* Featured card: ring mark + active project */}
        <div
          className="dash-in dash-in-2 rounded-2xl p-6 border mb-6 flex items-center gap-5 transition-shadow hover:shadow-lg"
          style={cardStyle}
        >
          {activeProject && totalStepsForActive > 0 ? (
            <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="27" fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle
                  className="dash-ring-fill"
                  cx="32" cy="32" r="27" fill="none" stroke="var(--accent)" strokeWidth="6"
                  strokeDasharray={CIRC}
                  style={{ '--ring-offset': activeOffset } as React.CSSProperties}
                  strokeLinecap="round" transform="rotate(-90 32 32)"
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                {continueStep > totalStepsForActive ? totalStepsForActive : continueStep}/{totalStepsForActive}
              </div>
            </div>
          ) : (
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" className="shrink-0">
              <path d="M6 30 Q14 30 16 22 Q18 14 26 14 Q32 14 32 8" stroke="var(--muted)" strokeWidth="2" strokeDasharray="1 4.2" strokeLinecap="round" />
              <circle cx="6" cy="30" r="2.6" fill="var(--ink)" fillOpacity="0.55" />
              <path d="M32 4 l4 4 l-4 4 l0 -3 l-3 0 l0 -2 l3 0 z" fill="var(--accent)" />
            </svg>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--accent)' }}>
              {activeProject ? 'In progress' : 'No active project'}
            </p>
            <p className="text-base font-semibold truncate" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
              {activeProject ? (activeProject.project_json?.project_title || 'Untitled project') : "Pick one when you're ready"}
            </p>
            {activeProject && totalStepsForActive > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Step {continueStep > totalStepsForActive ? totalStepsForActive : continueStep} of {totalStepsForActive}
              </p>
            )}
          </div>

          <a
            href={continueHref}
            className="text-sm font-medium rounded-lg px-4 py-2.5 shrink-0 transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--green)', color: 'var(--white)' }}
          >
            {activeProject ? 'Continue →' : 'Start →'}
          </a>
        </div>

        {/* Stats row */}
        <div className="dash-in dash-in-3 grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5 border text-center transition-shadow hover:shadow-md" style={cardStyle}>
            <p className="text-lg font-bold leading-none" style={{ color: 'var(--muted)', fontFamily: 'var(--font-space-grotesk)' }}>
              Coming soon
            </p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>Credits</p>
          </div>
          <div className="rounded-2xl p-5 border text-center transition-shadow hover:shadow-md" style={cardStyle}>
            <p className="text-2xl font-bold leading-none" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
              {completedCount}
            </p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>Completed</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="dash-in dash-in-4 flex gap-3 mb-10">
          <a
            href="/projects"
            className="text-sm font-medium rounded-lg px-4 py-2 border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }}
          >
            My Projects →
          </a>
          <a
            href="/portfolio"
            className="text-sm font-medium rounded-lg px-4 py-2 border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }}
          >
            Portfolio →
          </a>
        </div>

        {projects && projects.length > 1 && (
          <div className="dash-in dash-in-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted)', fontFamily: 'var(--font-space-grotesk)' }}>
              Recent Projects
            </p>
            <div className="flex flex-col gap-2">
              {projects.slice(1, 5).map((p) => (
                <a
                  key={p.id}
                  href={`/project/${p.id}/step/1`}
                  className="dash-row flex items-center gap-3.5 rounded-xl p-3.5 border transition-all"
                  style={cardStyle}
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                    style={{ background: 'var(--accent-bg, #F3E9D2)', color: 'var(--accent)' }}
                  >
                    {p.domain}
                  </span>
                  <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>
                    {p.project_json?.project_title || 'Untitled project'}
                  </span>
                  <span className="dash-row-link text-xs font-medium shrink-0" style={{ color: 'var(--accent)' }}>
                    Reopen →
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dashRise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-in {
          opacity: 0;
          animation: dashRise 0.5s ease forwards;
        }
        .dash-in-1 { animation-delay: 0.02s; }
        .dash-in-2 { animation-delay: 0.08s; }
        .dash-in-3 { animation-delay: 0.14s; }
        .dash-in-4 { animation-delay: 0.20s; }
        .dash-in-5 { animation-delay: 0.26s; }

        @keyframes dashRingFill {
          from { stroke-dashoffset: ${CIRC}; }
          to { stroke-dashoffset: var(--ring-offset); }
        }
        .dash-ring-fill {
          stroke-dashoffset: ${CIRC};
          animation: dashRingFill 0.9s 0.3s cubic-bezier(.2,.7,.3,1) forwards;
        }

        .dash-row:hover {
          border-color: var(--green);
          transform: translateX(2px);
        }
        .dash-row-link {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .dash-row:hover .dash-row-link {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
