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

  const activeProject = projects?.[0] // simplest "most recent" definition for now
  const displayName = profile?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar
        creditBalance={profile?.credit_balance ?? 0}
        userName={profile?.name ?? ''}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* MAIN AREA */}
        <div>
          <h1 className="text-2xl font-bold text-[#141312] mb-1">
            Hi {displayName},
          </h1>
          <p className="text-[#6B6A66] mb-8">
            {activeProject
              ? 'Pick up where you left off.'
              : "Let's build something you can show off."}
          </p>

          {activeProject ? (
            <div className="bg-white border border-[#E4E2DA] rounded-xl p-6 mb-10">
              <span className="inline-block text-xs font-semibold text-[#B8860B] bg-[#B8860B]/10 rounded-full px-2.5 py-1 mb-3">
                {activeProject.domain}
              </span>
              <h2 className="text-xl font-bold text-[#141312] mb-4">
                {activeProject.project_json?.project_title || 'Untitled project'}
              </h2>
              <button className="bg-[#141312] text-[#FAF9F6] text-sm font-medium rounded-lg px-5 py-2.5">
                Continue
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#E4E2DA] rounded-xl p-10 text-center mb-10">
              <p className="text-[#6B6A66] mb-5">
                You don't have an active project yet — no pressure, let's find one that fits.
              </p>
              <button className="bg-[#141312] text-[#FAF9F6] text-sm font-medium rounded-lg px-5 py-2.5">
                Start New Project
              </button>
            </div>
          )}

          {/* Projects grid */}
          <h3 className="text-sm font-semibold text-[#6B6A66] uppercase tracking-wide mb-4">
            My Projects
          </h3>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white border border-[#E4E2DA] rounded-lg p-4">
                  <span className="text-xs font-semibold text-[#B8860B]">{p.domain}</span>
                  <p className="text-sm font-medium text-[#141312] mt-1">
                    {p.project_json?.project_title || 'Untitled project'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6A66]">
              Nothing here yet — your first project will show up once you build one.
            </p>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E4E2DA] rounded-xl p-5">
            <p className="text-xs text-[#6B6A66] mb-1">Credit balance</p>
            <p className="text-3xl font-bold text-[#141312]">
              {profile?.credit_balance ?? 0}
            </p>
            <a href="/credits/topup" className="text-xs text-[#B8860B] font-medium">
              Top up →
            </a>
          </div>

          <div className="bg-white border border-[#E4E2DA] rounded-xl p-5">
            <p className="text-xs text-[#6B6A66] mb-3">Stats</p>
            <div className="space-y-2 text-sm text-[#141312]">
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