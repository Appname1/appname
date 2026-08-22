import Link from 'next/link'

export default function EntryPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
            <div className="max-w-5xl mx-auto px-6 py-16">
        <a href="/dashboard" className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Dashboard
        </a>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          How do you want to start?
        </h1>
        <p className="text-base mb-12" style={{ color: 'var(--muted)' }}>
          Pick whichever fits where you are right now.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/entry/jd"
            className="rounded-2xl p-8 flex flex-col justify-between min-h-[280px] transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--white)', border: '1px solid var(--border)' }}
          >
            <div>
              <span
                className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-6"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
              >
                Fastest
              </span>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                I have a job description
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Paste a real posting. We build a project around exactly what it asks for.
              </p>
            </div>
            <span className="text-sm font-medium mt-6" style={{ color: 'var(--accent)' }}>
              Paste a JD →
            </span>
          </Link>

          <Link
            href="/entry/role"
            className="rounded-2xl p-8 flex flex-col justify-between min-h-[280px] transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--white)', border: '1px solid var(--border)' }}
          >
            <div>
              <span
                className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-6"
                style={{ background: 'var(--green-bg)', color: 'var(--green-dark)' }}
              >
                No JD yet
              </span>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                Browse by role
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Not applying anywhere specific yet. Pick a role and skill level instead.
              </p>
            </div>
            <span className="text-sm font-medium mt-6" style={{ color: 'var(--accent)' }}>
              Browse roles →
            </span>
          </Link>

          <Link
            href="/entry/custom"
            className="rounded-2xl p-8 flex flex-col justify-between min-h-[280px] transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--white)', border: '1px solid var(--border)' }}
          >
            <div>
              <span
                className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-6"
                style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
              >
                Your idea
              </span>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                Describe my own project
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Already have something in mind? Tell us and we&apos;ll help you build it right.
              </p>
            </div>
            <span className="text-sm font-medium mt-6" style={{ color: 'var(--accent)' }}>
              Describe it →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}