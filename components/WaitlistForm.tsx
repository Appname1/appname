'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({
      name,
      email,
      role,
      level,
      source: 'landing_page',
    })

    if (error) {
      setStatus('error')
    } else {
      setStatus('done')
    }
  }

  if (status === 'done') {
    return (
      <div
        className="rounded-xl p-8 text-center border"
        style={{ background: 'var(--accent-bg)', borderColor: 'var(--border)' }}
      >
        <p className="font-semibold" style={{ color: 'var(--ink)' }}>
          You&apos;re on the list.
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          We&apos;ll email you the moment beta access opens up.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-4 py-2.5 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
      />
      <input
        required
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg px-4 py-2.5 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
      />
      <select
        required
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded-lg px-4 py-2.5 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
      >
        <option value="">What role are you targeting?</option>
        <option>Data Analyst</option>
        <option>Data Scientist</option>
        <option>ML Engineer</option>
        <option>AI Engineer</option>
        <option>NLP Engineer</option>
        <option>Other</option>
      </select>
      <select
        required
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="border rounded-lg px-4 py-2.5 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--white)', color: 'var(--ink)' }}
      >
        <option value="">Your current level</option>
        <option>Student</option>
        <option>Beginner</option>
        <option>Some experience</option>
        <option>Switching careers</option>
      </select>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="sm:col-span-2 rounded-lg py-3 text-sm font-medium"
        style={{ background: 'var(--ink)', color: 'var(--paper)' }}
      >
        {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
      </button>
      {status === 'error' && (
        <p className="sm:col-span-2 text-sm" style={{ color: 'var(--muted)' }}>
          Something went wrong — mind trying again?
        </p>
      )}
    </form>
  )
}