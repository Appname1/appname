'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface QuizData {
  question: string
  options: string[]
  correct: string
  explanation: string
}

interface StepData {
  step_number: number
  title: string
  code: string
  beginner_breakdown: string
  explanation: string
  topics_used: string[]
  variable_suggestions: string
  quiz: QuizData
}

interface DatasetColumn {
  name: string
  what_it_means: string
  example_values: string
  useful_for_project: boolean
}

interface ProjectJson {
  project_title: string
  steps: StepData[]
  dataset_deep_dive?: {
    columns: DatasetColumn[]
  }
}

let hljsLoaded = false

export default function StepPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.id)
  const stepNumber = parseInt(String(params.step_number), 10)

  const [project, setProject] = useState<ProjectJson | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [advancing, setAdvancing] = useState(false)
  const [advanceError, setAdvanceError] = useState('')
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)

  const codeRef = useRef<HTMLElement>(null)
  const breakdownRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('projects')
        .select('project_json')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

      if (!data?.project_json) {
        setNotFound(true)
        setLoaded(true)
        return
      }

      setProject(data.project_json)
      setLoaded(true)

      const { data: existing } = await supabase
        .from('step_progress')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .eq('step_number', stepNumber)
        .maybeSingle()

      if (!existing) {
        await supabase.from('step_progress').insert({
          project_id: projectId,
          user_id: user.id,
          step_number: stepNumber,
          completed: false,
        })

        fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            amount: 2,
            direction: 'earn',
            description: `Step ${stepNumber} started`,
            project_id: projectId,
          }),
        }).catch(() => {})
      }
    }
    load()
  }, [projectId, stepNumber, router])

  useEffect(() => {
    function highlightAll() {
      const w = window as unknown as { hljs?: { highlightElement: (el: Element) => void } }
      if (w.hljs) {
        if (codeRef.current) w.hljs.highlightElement(codeRef.current)
        if (breakdownRef.current) w.hljs.highlightElement(breakdownRef.current)
      }
    }

    if (hljsLoaded) {
      highlightAll()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
    script.onload = () => {
      hljsLoaded = true
      highlightAll()
    }
    document.body.appendChild(script)
  }, [project, stepNumber, breakdownOpen])

  const handleNextStep = async () => {
    setAdvancing(true)
    setAdvanceError('')
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, step_number: stepNumber }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        setAdvanceError(errData.error || `Request failed (${res.status})`)
        setAdvancing(false)
        return
      }
      const data = await res.json()
      if (data.is_complete) {
        router.push(`/project/${projectId}/complete`)
      } else if (data.next_step) {
        router.push(`/project/${projectId}/step/${data.next_step}`)
      } else {
        setAdvanceError('Unexpected response — no next step returned')
        setAdvancing(false)
      }
    } catch (err) {
      setAdvanceError(err instanceof Error ? err.message : 'Something went wrong')
      setAdvancing(false)
    }
  }

  if (!loaded) return null

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="text-center max-w-sm px-6">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            Project not found
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm font-medium rounded-lg px-5 py-2.5 mt-4"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalSteps = project.steps.length
  const step = project.steps.find((s) => s.step_number === stepNumber)

  if (!step) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <p style={{ color: 'var(--muted)' }}>This step doesn&apos;t exist.</p>
      </div>
    )
  }

  const hasCode = step.code && step.code.trim().length > 0
  const hasBreakdown = step.beginner_breakdown && step.beginner_breakdown.trim().length > 0
  const hasExplanation = step.explanation && step.explanation.trim().length > 0
  const hasQuiz = step.quiz && Array.isArray(step.quiz.options) && step.quiz.options.length >= 4
  const usedColumns = project.dataset_deep_dive?.columns?.filter((c) =>
    hasCode && step.code.includes(c.name)
  ) ?? []

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div
        className="sticky top-0 z-10 border-b"
        style={{ background: 'var(--paper)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              Step {stepNumber} of {totalSteps}
            </span>
          </div>
          <div className="h-1.5 rounded-full mb-3" style={{ background: 'var(--border)' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${(stepNumber / totalSteps) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
          <div className="flex gap-1.5">
            {project.steps.map((s) => {
              const isDone = s.step_number < stepNumber
              const isCurrent = s.step_number === stepNumber
              const color = isDone ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--border)'
              return (
                <button
                  key={s.step_number}
                  onClick={() => isDone && router.push(`/project/${projectId}/step/${s.step_number}`)}
                  disabled={!isDone}
                  className="w-3 h-3 rounded-full"
                  style={{ background: color, cursor: isDone ? 'pointer' : 'default' }}
                  aria-label={`Step ${s.step_number}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          {step.title}
        </h1>

        {hasCode ? (
          <pre className="rounded-xl overflow-x-auto mb-4" style={{ background: '#282c34' }}>
            <code ref={codeRef} className="language-python text-sm p-4 block">
              {step.code}
            </code>
          </pre>
        ) : (
          <div
            className="rounded-xl p-4 mb-4 text-sm"
            style={{ background: 'var(--tag-bg)', color: 'var(--muted)' }}
          >
            Code unavailable for this step — try refreshing
          </div>
        )}

        {hasBreakdown && (
          <div className="mb-4">
            <button
              onClick={() => setBreakdownOpen(!breakdownOpen)}
              className="text-sm font-medium rounded-lg px-4 py-2 border"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }}
            >
              {breakdownOpen ? 'Hide breakdown' : 'Confused? Break it down'}
            </button>
            {breakdownOpen && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mt-3 mb-1" style={{ color: 'var(--muted)' }}>
                  Code Breakdown
                </p>
                <pre className="rounded-xl overflow-x-auto" style={{ background: '#282c34' }}>
                  <code ref={breakdownRef} className="language-plaintext text-sm p-4 block whitespace-pre-wrap">
                    {step.beginner_breakdown}
                  </code>
                </pre>
              </div>
            )}
          </div>
        )}

        {hasExplanation ? (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
              Explanation
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink)' }}>
              {step.explanation}
            </p>
          </div>
        ) : (
          <div
            className="rounded-xl p-4 mb-6 text-sm"
            style={{ background: 'var(--tag-bg)', color: 'var(--muted)' }}
          >
            Explanation coming soon
          </div>
        )}

        {step.topics_used && step.topics_used.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 relative">
            {step.topics_used.map((topic) => (
              <div key={topic} className="relative">
                <button
                  onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
                  className="text-xs font-medium rounded-full px-3 py-1.5"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
                >
                  {topic}
                </button>
                {activeTopic === topic && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl p-4 border shadow-lg z-20"
                    style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
                  >
                    <p className="text-sm mb-3" style={{ color: 'var(--ink)' }}>
                      {topic} is one of the core concepts used in this step.
                    </p>
                    <div className="flex gap-2">
                      {(() => {
                        const pillStyle = { background: 'var(--tag-bg)', color: 'var(--ink)' }
                        const KNOWN_DOCS: Record<string, string> = {
                          pandas: 'https://pandas.pydata.org/docs/',
                          numpy: 'https://numpy.org/doc/stable/',
                          'scikit-learn': 'https://scikit-learn.org/stable/documentation.html',
                          sklearn: 'https://scikit-learn.org/stable/documentation.html',
                          tensorflow: 'https://www.tensorflow.org/api_docs',
                          pytorch: 'https://pytorch.org/docs/stable/index.html',
                          matplotlib: 'https://matplotlib.org/stable/index.html',
                          seaborn: 'https://seaborn.pydata.org/',
                          python: 'https://docs.python.org/3/',
                          sql: 'https://www.w3schools.com/sql/',
                          docker: 'https://docs.docker.com/',
                          aws: 'https://docs.aws.amazon.com/',
                          nltk: 'https://www.nltk.org/',
                          langchain: 'https://python.langchain.com/docs/introduction/',
                          xgboost: 'https://xgboost.readthedocs.io/',
                          'power bi': 'https://learn.microsoft.com/en-us/power-bi/',
                          tableau: 'https://help.tableau.com/current/pro/desktop/en-us/',
                          dictionaries: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
                          lists: 'https://docs.python.org/3/tutorial/datastructures.html',
                          loops: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
                          functions: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
                          encoding: 'https://scikit-learn.org/stable/modules/preprocessing.html#preprocessing-categorical-features',
                        }
                        const topicKey = topic.toLowerCase().trim()
                        const ytUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(topic + ' tutorial')
                        const docsUrl = KNOWN_DOCS[topicKey] ?? ('https://www.google.com/search?q=' + encodeURIComponent(topic + ' documentation'))
                        return (
                          <>
                            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium rounded-md px-3 py-1.5" style={pillStyle}>
                              YouTube
                            </a>
                            <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium rounded-md px-3 py-1.5" style={pillStyle}>
                              Docs
                            </a>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {project.dataset_deep_dive && project.dataset_deep_dive.columns?.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setColumnsOpen(!columnsOpen)}
              className="text-sm font-medium rounded-lg px-4 py-2 border"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--white)' }}
            >
              {columnsOpen ? 'Hide dataset columns' : 'Dataset columns reference'}
            </button>
            {columnsOpen && (
              <div
                className="rounded-xl p-4 mt-3 border space-y-2"
                style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
              >
                {project.dataset_deep_dive.columns.map((c) => {
                  const isUsedThisStep = usedColumns.some((u) => u.name === c.name)
                  return (
                    <div key={c.name} className="flex items-start gap-2">
                      {isUsedThisStep && (
                        <span
                          className="text-xs font-semibold rounded-full px-2 py-0.5 shrink-0"
                          style={{ background: 'var(--accent)', color: 'var(--paper)' }}
                        >
                          used
                        </span>
                      )}
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{c.name}</span>
                        <span className="text-xs block" style={{ color: 'var(--muted)' }}>{c.what_it_means}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {step.variable_suggestions && (
          <p className="text-xs mb-8" style={{ color: 'var(--muted)' }}>
            Suggested variable names: {step.variable_suggestions}
          </p>
        )}

        {hasQuiz && (
          <div
            className="rounded-xl p-6 border mb-6"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--ink)' }}>
              {step.quiz.question}
            </h3>
            <div className="space-y-2.5 mb-4">
              {step.quiz.options.map((opt) => {
                const letter = opt[0]
                const showCorrect = quizAnswer && letter === step.quiz.correct
                const showWrong = quizAnswer === letter && letter !== step.quiz.correct
                return (
                  <button
                    key={opt}
                    onClick={() => !quizAnswer && setQuizAnswer(letter)}
                    disabled={!!quizAnswer}
                    className="w-full text-left text-sm rounded-lg px-4 py-3 border transition-colors"
                    style={{
                      borderColor: showCorrect ? 'var(--accent)' : showWrong ? 'var(--muted)' : 'var(--border)',
                      background: showCorrect ? 'var(--accent-bg)' : 'var(--paper)',
                      color: 'var(--ink)',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {quizAnswer && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
                  {quizAnswer === step.quiz.correct ? 'Exactly right.' : 'Not quite —'}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {step.quiz.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {advanceError && (
          <p className="text-sm mb-3" style={{ color: '#B94A48' }}>
            {advanceError}
          </p>
        )}

        <button
          onClick={handleNextStep}
          disabled={advancing}
          className="w-full text-sm font-medium rounded-lg py-3 disabled:opacity-40"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {advancing ? 'Saving...' : stepNumber >= totalSteps ? 'Finish Project' : 'Next Step'}
        </button>
      </div>
    </div>
  )
}