'use client'

import { THEMES } from '@/lib/themes'
import { useTheme } from '@/components/ThemeProvider'

export default function AppearancePage() {
  const { theme, setTheme, randomMode, setRandomMode } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
          Appearance
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          Pick a theme, or let it surprise you on every visit.
        </p>

        <div
          className="flex items-center justify-between border rounded-xl p-4 mb-8"
          style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              Surprise me
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Get a random theme every time you open the app
            </p>
          </div>
          <button
            onClick={() => setRandomMode(!randomMode)}
            type="button"
            className="flex items-center rounded-full transition-colors p-0.5"
            style={{
              width: '48px',
              height: '24px',
              background: randomMode ? 'var(--accent)' : 'var(--border)',
              justifyContent: randomMode ? 'flex-end' : 'flex-start',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              className="rounded-full transition-transform"
              style={{
                width: '20px',
                height: '20px',
                background: 'var(--white)',
                display: 'block',
              }}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className="text-left rounded-xl border-2 overflow-hidden transition-transform hover:scale-[1.02]"
              style={{
                borderColor: theme.key === t.key ? 'var(--accent)' : 'var(--border)',
              }}
            >
              <div style={{ background: t.paper, padding: '12px' }}>
                <div className="flex gap-1.5 mb-2">
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: t.accent }} />
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: t.ink }} />
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: t.canvas }} />
                </div>
                <p style={{ color: t.ink, fontSize: 12, fontWeight: 500 }}>{t.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}