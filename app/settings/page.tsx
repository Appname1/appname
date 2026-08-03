import Link from 'next/link'

const LINKS = [
  { label: 'Appearance', href: '/appearance', desc: 'Pick a theme for the app' },
  { label: 'Dashboard', href: '/dashboard', desc: 'Back to your home base' },
  { label: 'Projects', href: '/dashboard', desc: 'See everything you have built' },
  { label: 'Portfolio', href: '/portfolio', desc: 'Your public-facing project showcase' },
  { label: 'Get help with an error', href: '/help/error', desc: 'Stuck on something? We can help' },
  { label: 'Topic reference', href: '/learn', desc: 'Docs for every concept you might hit' },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Settings
        </h1>
        <div className="space-y-3">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="flex items-center justify-between rounded-xl p-4 border"
              style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{l.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{l.desc}</p>
              </div>
              <span style={{ color: 'var(--muted)' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}