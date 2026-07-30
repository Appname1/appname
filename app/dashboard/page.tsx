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

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <Navbar
        creditBalance={profile?.credit_balance ?? 0}
        userName={profile?.name ?? ''}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            Hi {displayName},
          </h1>
          <p className="mb-8" style={{ color: 'var(--muted)' }}>
            {activeProject
              ? 'Pick up where you left off.'
              : "Let's build something you can show off."}
          </p>

          <div
            className="rounded-xl p-5 mb-6 border flex items-center justify-between"
            style={{ background: 'var(--accent-bg)', borderColor: 'var(--border)' }}
          >
            <div>
              <span
                className="inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-2"
                style={{ background: 'var(--accent)', color: 'var(--paper)' }}
              >
                Today&apos;s Project
              </span>
              <h3 className="text-base font-semibold" style={{ color: 'var(--ink)' }}>
                Retail Sales Performance Dashboard
              </h3>
              <p className="text-sm" style={{ color: 'var(--accent-dark)' }}>
                Data Analyst - Beginner friendly
              </p>
            </div>
            
             <a href="/entry" className="text-sm font-medium rounded-lg px-4 py-2 shrink-0" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Try it
            </a>
          </div>

          {activeProject ? (
            <div
              className="rounded-xl p-6 mb-10 border"
              style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
            >
              <span
                className="inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-3"
                style={{ color: 'var(--accent)', background: 'var(--accent-bg)' }}
              >
                {activeProject.domain}
              </span>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
                {activeProject.project_json?.project_title || 'Untitled project'}
              </h2>
              <button
                className="text-sm font-medium rounded-lg px-5 py-2.5"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Continue
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl p-10 text-center mb-10 border"
              style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
            >
              <p className="mb-5" style={{ color: 'var(--muted)' }}>
                You don&apos;t have an active project yet — no pressure, let&apos;s find one that fits.
              </p>
              <button
                className="text-sm font-medium rounded-lg px-5 py-2.5"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Start New Project
              </button>
            </div>
          )}

          <h3
            className="text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ color: 'var(--muted)' }}
          >
            My Projects
          </h3>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg p-4 border"
                  style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
                >
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    {p.domain}
                  </span>
                  <p className="text-sm font-medium mt-1" style={{ color: 'var(--ink)' }}>
                    {p.project_json?.project_title || 'Untitled project'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Nothing here yet — your first project will show up once you build one.
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl p-5 border" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Credit balance</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--ink)' }}>
              {profile?.credit_balance ?? 0}
            </p>
            <a href="/credits/topup" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Top up →
            </a>
          </div>

          <div className="rounded-xl p-5 border" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>Stats</p>
            <div className="space-y-2 text-sm" style={{ color: 'var(--ink)' }}>
              <div className="flex justify-between">
                <span>Projects completed</span>
                <span className="font-medium">{profile?.total_projects_completed ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}