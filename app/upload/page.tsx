'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const CREDIT_COST = 50
const MAX_SIZE_BYTES = 10 * 1024 * 1024

interface Dataset {
  name: string
  url: string
  why_suitable: string
}

interface SelectedProject {
  title: string
  domain: string
  relevancy_score: number
  why_relevant: string
  tech_stack: string[]
  difficulty: string
  is_case_study: boolean
  datasets: Dataset[]
}

interface ColumnExplanation {
  name: string
  meaning: string
  likely_type: string
  useful_for_project: boolean
}

export default function UploadPage() {
  const router = useRouter()
  const [project, setProject] = useState<SelectedProject | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [fileError, setFileError] = useState('')
  const [fileName, setFileName] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [analysing, setAnalysing] = useState(false)
  const [explanation, setExplanation] = useState<ColumnExplanation[] | null>(null)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('appname_selected_project')
    if (raw) {
      try {
        setProject(JSON.parse(raw))
      } catch {
        setProject(null)
      }
    }

    async function loadCredits() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('credit_balance')
          .eq('id', user.id)
          .single()
        setCreditBalance(profile?.credit_balance ?? 0)
      }
    }
    loadCredits()
    setLoaded(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('')
    setExplanation(null)
    const file = e.target.files?.[0]
    if (!file) return

    const hasValidExtension = file.name.toLowerCase().endsWith('.csv')
    if (!hasValidExtension) {
      setFileError('Please upload a CSV file')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setFileError('File too large. Use a dataset under 10MB.')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      if (lines.length === 0) {
        setFileError('This file appears to be empty')
        return
      }

      const parsedColumns = lines[0].split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
      const parsedRows = lines.slice(1, 4).map((line) =>
        line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
      )

      setColumns(parsedColumns)
      runExplainCsv(parsedColumns, parsedRows)
    }
    reader.readAsText(file)
  }

  const runExplainCsv = async (cols: string[], rows: string[][]) => {
    setAnalysing(true)
    try {
      const res = await fetch('/api/explain-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columns: cols,
          sample_rows: rows,
          domain: project?.domain,
          project_title: project?.title,
        }),
      })
      const data = await res.json()
      setExplanation(data.column_explanations ?? null)
    } catch {
      setFileError('Something went wrong analysing this file. Try again.')
    }
    setAnalysing(false)
  }

  const creditsSufficient = creditBalance !== null && creditBalance >= CREDIT_COST
  const canGenerate = !!explanation && creditsSufficient && !generating

  const handleGenerate = () => {
    if (!canGenerate || !project) return
    setGenerating(true)

    sessionStorage.setItem('generate_request', JSON.stringify({
      project_title: project.title,
      domain: project.domain,
      jd: sessionStorage.getItem('entry_jd') ?? '',
      skills: project.tech_stack,
      dataset_columns: columns,
      dataset_name: fileName,
      skill_level: 'BEGINNER',
      is_case_study: project.is_case_study,
    }))

    localStorage.removeItem('appname_selected_project')
    router.push('/loading')
  }

  if (!loaded) return null

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="text-center max-w-sm px-6">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            No project selected
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            Let&apos;s start from the beginning.
          </p>
          <button
            onClick={() => router.push('/entry')}
            className="text-sm font-medium rounded-lg px-5 py-2.5"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Start over
          </button>
        </div>
      </div>
    )
  }

  const linkStyle = { background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--ink)' }
  const topupStyle = { background: 'var(--ink)', color: 'var(--paper)' }

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="rounded-2xl p-6 border mb-8"
          style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-xs font-semibold rounded-full px-2.5 py-1"
              style={{ background: 'var(--tag-bg)', color: 'var(--ink)' }}
            >
              {project.domain}
            </span>
            <span
              className="text-xs font-medium rounded-full px-2.5 py-1"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
            >
              {project.difficulty}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {project.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            This will use {CREDIT_COST} credits.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
            Suggested datasets
          </p>
          <div className="space-y-2">
            {project.datasets.map((d) => (
              <a key={d.name} href={d.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg p-3 border text-sm" style={linkStyle}>
                <span className="font-medium">{d.name}</span>
                <span className="block text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {d.why_suitable}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
            Upload your CSV
          </p>
          <label
            className="block rounded-xl border-2 border-dashed p-8 text-center cursor-pointer"
            style={{ borderColor: 'var(--border)', background: 'var(--white)' }}
          >
            <input
              type="file"
              accept=".csv,text/csv,application/vnd.ms-excel,application/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm" style={{ color: 'var(--ink)' }}>
              {fileName || 'Click to choose a CSV file'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Max 10MB
            </p>
          </label>
          {fileError && (
            <p className="text-sm mt-2" style={{ color: '#B94A48' }}>
              {fileError}
            </p>
          )}
        </div>

        {analysing && (
          <div className="mb-8 text-center py-6">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Analysing your dataset...
            </p>
          </div>
        )}

        {explanation && (
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
              What&apos;s in your data
            </p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--tag-bg)' }}>
                    <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--ink)' }}>Column</th>
                    <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--ink)' }}>What it means</th>
                    <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--ink)' }}>Type</th>
                    <th className="text-left px-4 py-2 font-medium" style={{ color: 'var(--ink)' }}>Useful?</th>
                  </tr>
                </thead>
                <tbody>
                  {explanation.map((c) => (
                    <tr key={c.name} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--ink)' }}>{c.name}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--muted)' }}>{c.meaning}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--muted)' }}>{c.likely_type}</td>
                      <td className="px-4 py-2" style={{ color: c.useful_for_project ? 'var(--accent)' : 'var(--muted)' }}>
                        {c.useful_for_project ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div
          className="rounded-xl p-4 border mb-6 flex items-center justify-between"
          style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--ink)' }}>
              Your balance: <span className="font-semibold">{creditBalance ?? '...'}</span> credits
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              This project costs {CREDIT_COST} credits
            </p>
          </div>
          {!creditsSufficient && creditBalance !== null && (
            <a href="/credits/topup" className="text-sm font-medium rounded-lg px-4 py-2 shrink-0" style={topupStyle}>
              Need {CREDIT_COST - creditBalance} more — Top up
            </a>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full text-sm font-medium rounded-lg py-3 disabled:opacity-40"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {generating ? 'Starting...' : 'Generate My Project'}
        </button>
      </div>
    </div>
  )
}