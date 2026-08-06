import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { BranchIcon, StackedCardsIcon, BadgeIcon, ProgressRingIcon } from '@/components/Icons'

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
  const totalProjects = projects?.length ?? 0
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

  const totalStepsForActive = activeProject?.project_json?.steps?.length ?? 0
  const progressPct = totalStepsForActive > 0 ? Math.min(100, Math.round(((continueStep - 1) / totalStepsForActive) * 100)) : 0
  const continueHref = activeProject ? `/project/${activeProject.id}/step/${continueStep}` : '#'

  const whiteCard = { background: 'var(--white)', borderColor: 'var(--border)' }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <Navbar
        creditBalance={profile?.credit_balance ?? 0}
        userName={profile?.name ?? ''}
      />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
          Hi {displayName},
        </h1>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>
          {activeProject ? 'Pick up where you left off.' : "Let's build something you can show off."}
        </p>

        {/* Bento hero: big CTA + 2 stacked stat tiles, matching landing page pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 mb-8">
          <a href="/entry" className="rounded-2xl p-10 flex flex-col justify-center border transition-transform hover:scale-[1.01]" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-bg)' }}>
                <BranchIcon size={32} />
              </div>
              <div>
                <p className="text-xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                  Start a new project
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  From a job description, a role, or your own idea
                </p>
              </div>
            </div>
          </a>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5 flex-1 flex items-center gap-4" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--white)' }}>
                <ProgressRingIcon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--accent-dark)' }}>Credit balance</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                  {profile?.credit_balance ?? 0}
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-5 flex-1 flex items-center gap-4" style={{ background: 'var(--green-bg)', border: '1px solid var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--white)' }}>
                <BadgeIcon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--green-dark)' }}>Projects completed</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                  {completedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {activeProject && (
          <div className="rounded-2xl p-6 mb-8 border" style={whiteCard}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ color: 'var(--accent)', background: 'var(--accent-bg)' }}>
                {activeProject.domain}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {progressPct}% complete
              </span>
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
              {activeProject.project_json?.project_title || 'Untitled project'}
            </h2>
            <div className="h-2 rounded-full mb-4" style={{ background: 'var(--border)' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${progressPct}%`, background: 'var(--accent)' }} />
            </div>
            <a href={continueHref} className="inline-block text-sm font-medium rounded-lg px-5 py-2.5" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Continue
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <a href="/projects" className="rounded-2xl p-6 border flex items-center gap-4" style={whiteCard}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--tag-bg)' }}>
              <StackedCardsIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>My Projects</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {totalProjects} project{totalProjects === 1 ? '' : 's'} so far
              </p>
            </div>
          </a>
          <a href="/portfolio" className="rounded-2xl p-6 border flex items-center gap-4" style={whiteCard}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--tag-bg)' }}>
              <BadgeIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Portfolio</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Your public-facing showcase</p>
            </div>
          </a>
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted)' }}>
          Recent Projects
        </h3>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <a key={p.id} href={`/project/${p.id}/step/1`} className="block rounded-lg p-4 border" style={whiteCard}>
                <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  {p.domain}
                </span>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--ink)' }}>
                  {p.project_json?.project_title || 'Untitled project'}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Nothing here yet — your first project will show up once you build one.
          </p>
        )}
      </div>
    </div>
  )
}