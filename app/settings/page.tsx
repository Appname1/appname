export default function SettingsPage() {
  const links = [
    { label: 'Appearance', href: '/appearance', desc: 'Pick a color theme for the app' },
    { label: 'Projects', href: '/projects', desc: "See everything you've built" },
    { label: 'Portfolio', href: '/portfolio', desc: 'Your public-facing project showcase' },
    { label: 'Help with an error', href: '/help/error', desc: 'Get unstuck on a code error' },
    { label: 'Topic reference', href: '/learn', desc: 'Docs for every concept across your projects' },
    { label: 'Terms & Conditions', href: '/terms', desc: 'Legal terms for using bornout' },
    { label: 'Privacy Policy', href: '/privacy', desc: 'How your data is handled' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Settings
        </h1>

        <div className="space-y-2 mb-8">
          {links.map((link) => {
            const cardStyle = { background: 'var(--white)', borderColor: 'var(--border)' }
            return (
              <a key={link.href} href={link.href} className="block rounded-xl p-4 border" style={cardStyle}>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{link.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{link.desc}</p>
              </a>
            )
          })}
        </div>

        {(() => {
          const btnStyle = { background: 'var(--ink)', color: 'var(--paper)' }
          return (
            <a href="/dashboard" className="block text-center text-sm font-medium rounded-lg py-3" style={btnStyle}>
              Back to Dashboard
            </a>
          )
        })()}
      </div>
    </div>
  )
}