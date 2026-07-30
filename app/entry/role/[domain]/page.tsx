'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface PrebuiltProject {
  id: string
  title: string
  difficulty: string
  summary: string
  is_locked: boolean
}

export default function DomainProjectsPage() {
  const params = useParams()
  const router = useRouter()
  const domain = String(params.domain).toUpperCase()
  const [projects, setProjects] = useState<PrebuiltProject[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('prebuilt_projects')
        .select('*')
        .eq('domain', domain)
        .eq('is_locked', false)
      setProjects(data ?? [])
      setLoaded(true)
    }
    load()
  }, [domain])

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <button
          onClick={() => router.push('/entry/role')}
          className="text-sm mb-6"
          style={{ color: 'var(--muted)' }}
        >
          ← Back to roles
        </button>
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          {domain} projects
        </h1>

        {!loaded ? null : projects.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <p className="text-base mb-2" style={{ color: 'var(--ink)' }}>
              No pre-built projects here yet
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              We&apos;re still building out this library. Try describing what you want instead.
            </p>
            <button
              onClick={() => router.push('/entry/custom')}
              className="text-sm font-medium rounded-lg px-5 py-2.5"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              Describe a custom project
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl p-6 border"
                style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                  {p.title}
                </h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {p.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}