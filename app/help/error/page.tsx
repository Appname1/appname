'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ErrorExplanation {
  what_happened: string
  why_it_happened: string
  how_to_fix: string
  corrected_code: string
}
export default function ErrorHelpPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const step = searchParams.get('step')
  const backHref = projectId && step ? `/project/${projectId}/step/${step}` : '/dashboard'

  const [errorMessage, setErrorMessage] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ErrorExplanation | null>(null)
  const [failed, setFailed] = useState(false)

  const handleSubmit = async () => {
    if (!errorMessage.trim()) return
    setLoading(true)
    setFailed(false)
    setResult(null)

    try {
      const res = await fetch('/api/explain-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error_message: errorMessage, code }),
      })
      const data = await res.json()
      if (data.error) {
        setFailed(true)
      } else {
        setResult(data)
      }
    } catch {
      setFailed(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            Stuck on an error?
          </h1>
          <div className="flex items-center gap-3">
            {projectId && step && (
              <a href={backHref} className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                ← Back to Step {step}
              </a>
            )}
            <a href="/dashboard" className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              Dashboard
            </a>
          </div>
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          Paste the error message you got, and the code that caused it if you have it. We&apos;ll break down what went wrong.
        </p>

        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--muted)' }}>
          Error message
        </label>
        <textarea
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          placeholder="Paste the full error message here..."
          className="w-full h-28 rounded-xl p-4 text-sm border mb-4"
          style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
        />

        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--muted)' }}>
          Your code (optional, but helps)
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste the code you ran..."
          className="w-full h-28 rounded-xl p-4 text-sm border mb-6 font-mono"
          style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
        />

        <button
          onClick={handleSubmit}
          disabled={!errorMessage.trim() || loading}
          className="text-sm font-medium rounded-lg px-6 py-3 disabled:opacity-40"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {loading ? 'Reading your error...' : 'Explain this error'}
        </button>

        {failed && (
          <p className="text-sm mt-4" style={{ color: '#B94A48' }}>
            Something went wrong explaining this — mind trying again?
          </p>
        )}

        {result && (
          <div
            className="rounded-2xl p-6 border mt-8"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                What happened
              </p>
              <p className="text-sm" style={{ color: 'var(--ink)' }}>{result.what_happened}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                Why it happened
              </p>
              <p className="text-sm" style={{ color: 'var(--ink)' }}>{result.why_it_happened}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                How to fix it
              </p>
              <p className="text-sm" style={{ color: 'var(--ink)' }}>{result.how_to_fix}</p>
            </div>
            {result.corrected_code && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                  Corrected code
                </p>
                <pre
                  className="rounded-lg p-3 text-xs overflow-x-auto"
                  style={{ background: '#282c34', color: '#e6e6e6' }}
                >
                  {result.corrected_code}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}