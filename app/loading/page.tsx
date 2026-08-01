'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const QUIZ_QUESTIONS = [
  {
    question: 'How comfortable are you with Python?',
    options: [
      'A. Never written a line of it',
      'B. I know the basics — variables, loops, functions',
      'C. Comfortable writing scripts on my own',
      'D. I use it daily and can debug most things myself',
    ],
  },
  {
    question: 'How familiar are you with Pandas or DataFrames?',
    options: [
      "A. I haven't used them before",
      "B. I've loaded a CSV and looked at it",
      'C. I can filter, group, and clean data confidently',
      'D. I regularly build full data pipelines with them',
    ],
  },
  {
    question: 'How much exposure do you have to machine learning?',
    options: [
      'A. None yet — this is new to me',
      'B. I understand the basic concepts',
      "C. I've trained a model or two before",
      "D. I've built and evaluated several models",
    ],
  },
  {
    question: 'How do you feel when your code throws an error?',
    options: [
      'A. I usually need help figuring out what went wrong',
      'B. I can often trace it back with some effort',
      "C. I'm fairly quick at debugging on my own",
      'D. Errors rarely slow me down for long',
    ],
  },
  {
    question: "What's your main goal with this project?",
    options: [
      'A. Just to see how it works, step by step',
      'B. To build something I can show in my portfolio',
      'C. To practice a skill I already have some grip on',
      'D. To push myself with something genuinely challenging',
    ],
  },
]

const TIPS = [
  'Understanding your dataset before touching code is the single biggest predictor of finishing a project well.',
  'Every step ahead comes with real, working code — never a black box you just copy blindly.',
  "You'll get a short quiz after each step, just to check things actually stuck.",
  "By the end, you'll have interview talking points pulled straight from what you built.",
]

interface DatasetDeepDive {
  what_this_data_is: string
  real_world_source: string
  columns: { name: string; what_it_means: string; example_values: string; useful_for_project: boolean }[]
  interesting_patterns: string
  questions_this_data_can_answer: string[]
}

interface DeepDiveQuizQuestion {
  question: string
  options: string[]
  correct: string
  explanation: string
}

export default function LoadingPage() {
  const router = useRouter()

  const [phase, setPhase] = useState<'quiz' | 'setting_level' | 'deepdive_wait' | 'deepdive_content' | 'error'>('quiz')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const [tipIndex, setTipIndex] = useState(0)
  const [deepDive, setDeepDive] = useState<DatasetDeepDive | null>(null)
  const [deepDiveQuiz, setDeepDiveQuiz] = useState<DeepDiveQuizQuestion[]>([])
  const [deepDiveSection, setDeepDiveSection] = useState(0) // 0=what it is, 1=columns, 2=patterns, 3=questions, then quiz
  const [quizAnswerIndex, setQuizAnswerIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const projectIdRef = useRef<string | null>(null)
  const generateFailedRef = useRef(false)
  const readyToNavigateRef = useRef(false)

  const handleQuizAnswer = (letter: string) => {
    const newAnswers = [...answers, letter]
    setAnswers(newAnswers)

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else {
      setPhase('setting_level')
      finishQuiz(newAnswers)
    }
  }

  const finishQuiz = async (finalAnswers: string[]) => {
    let skillLevel = 'INTERMEDIATE'
    try {
      const res = await fetch('/api/quiz/calculate-skill-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      skillLevel = data.skill_level ?? skillLevel
    } catch {
      // fall back to default
    }

    setTimeout(() => {
      startGeneration(skillLevel)
      setPhase('deepdive_wait')
    }, 2000)
  }

  const startGeneration = (skillLevel: string) => {
    const raw = sessionStorage.getItem('generate_request')
    if (!raw) {
      generateFailedRef.current = true
      setPhase('error')
      return
    }

    const requestBody = { ...JSON.parse(raw), skill_level: skillLevel }

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.project_id) {
          generateFailedRef.current = true
          if (phase !== 'deepdive_content') setPhase('error')
          return
        }
        projectIdRef.current = data.project_id
        loadDeepDive(data.project_id)
      })
      .catch(() => {
        generateFailedRef.current = true
        setPhase('error')
      })
  }

  const loadDeepDive = async (projectId: string) => {
    try {
      const res = await fetch('/api/explain-csv/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      })
      const data = await res.json()
      if (data.dataset_deep_dive) {
        setDeepDive(data.dataset_deep_dive)
        setDeepDiveQuiz(data.quiz_questions ?? [])
        setPhase('deepdive_content')
      }
    } catch {
      // if this fails, we still have a generated project — just navigate once ready
      readyToNavigateRef.current = true
    }
  }

  // Rotate tips while waiting for generation + deep dive to become available
  useEffect(() => {
    if (phase !== 'deepdive_wait') return
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [phase])

  const advanceDeepDiveSection = () => {
    if (deepDiveSection < 3) {
      setDeepDiveSection(deepDiveSection + 1)
    } else {
      // move into quiz questions
      setDeepDiveSection(4)
    }
  }

  const handleDeepDiveQuizAnswer = (letter: string) => {
    setSelectedAnswer(letter)
  }

  const handleDeepDiveQuizNext = () => {
    setSelectedAnswer(null)
    if (quizAnswerIndex < deepDiveQuiz.length - 1) {
      setQuizAnswerIndex(quizAnswerIndex + 1)
    } else {
      // finished everything — navigate if generation is done
      if (projectIdRef.current) {
        router.push(`/project/${projectIdRef.current}/step/1`)
      } else {
        readyToNavigateRef.current = true
      }
    }
  }

  // If generation finishes after the user already finished viewing deep dive content, navigate then
  useEffect(() => {
    if (readyToNavigateRef.current && projectIdRef.current) {
      router.push(`/project/${projectIdRef.current}/step/1`)
    }
  }, [deepDive, deepDiveQuiz])

  const retry = () => {
    generateFailedRef.current = false
    setPhase('deepdive_wait')
    const raw = sessionStorage.getItem('generate_request')
    if (raw) {
      const parsed = JSON.parse(raw)
      startGeneration(parsed.skill_level ?? 'INTERMEDIATE')
    }
  }

  // --- RENDER ---

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="text-center max-w-sm px-6">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            Something went wrong
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            We hit a snag generating your project. Let&apos;s try again.
          </p>
          <button
            onClick={retry}
            className="text-sm font-medium rounded-lg px-5 py-2.5"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const q = QUIZ_QUESTIONS[questionIndex]
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-lg w-full px-6">
          <h1
            className="text-xl font-bold mb-2 text-center"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            While your project builds, let&apos;s personalise it for you
          </h1>
          <p className="text-sm text-center mb-2" style={{ color: 'var(--muted)' }}>
            Question {questionIndex + 1} of 5
          </p>
          <div className="flex justify-center gap-2 mb-8">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: i <= questionIndex ? 'var(--accent)' : 'var(--border)' }}
              />
            ))}
          </div>

          <div
            className="rounded-2xl p-6 border"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--ink)' }}>
              {q.question}
            </h2>
            <div className="space-y-2.5">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(opt[0])}
                  className="w-full text-left text-sm rounded-lg px-4 py-3 border transition-colors"
                  style={{ borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'setting_level') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Setting your difficulty level...
        </p>
      </div>
    )
  }

  if (phase === 'deepdive_wait') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-md px-6 text-center">
          <h1
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            Building your project...
          </h1>
          <div
            className="rounded-2xl p-6 border"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
              {TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // phase === 'deepdive_content'
  if (deepDiveSection < 4 && deepDive) {
    const sections = [
      { title: 'What this dataset is', body: deepDive.what_this_data_is },
      { title: 'Column by column', body: null },
      { title: 'Interesting patterns to look for', body: deepDive.interesting_patterns },
      { title: 'Questions this data can answer', body: null },
    ]
    const current = sections[deepDiveSection]

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-lg w-full px-6">
          <h1
            className="text-xl font-bold mb-6 text-center"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            Let&apos;s understand your dataset together before you start
          </h1>
          <div
            className="rounded-2xl p-6 border mb-6"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--ink)' }}>
              {current.title}
            </h2>
            {deepDiveSection === 0 && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {deepDive.what_this_data_is}
              </p>
            )}
            {deepDiveSection === 1 && (
              <div className="space-y-3">
                {deepDive.columns.map((c) => (
                  <div key={c.name}>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{c.what_it_means}</p>
                  </div>
                ))}
              </div>
            )}
            {deepDiveSection === 2 && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {deepDive.interesting_patterns}
              </p>
            )}
            {deepDiveSection === 3 && (
              <ul className="space-y-2">
                {deepDive.questions_this_data_can_answer.map((q) => (
                  <li key={q} className="text-sm" style={{ color: 'var(--muted)' }}>• {q}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={advanceDeepDiveSection}
            className="w-full text-sm font-medium rounded-lg py-3"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // deepDiveSection === 4: dataset-specific quiz
  if (deepDiveQuiz.length > 0) {
    const q = deepDiveQuiz[quizAnswerIndex]
    const isCorrect = selectedAnswer === q.correct

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-lg w-full px-6">
          <p className="text-sm text-center mb-6" style={{ color: 'var(--muted)' }}>
            Quick check {quizAnswerIndex + 1} of {deepDiveQuiz.length}
          </p>
          <div
            className="rounded-2xl p-6 border"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--ink)' }}>
              {q.question}
            </h2>
            <div className="space-y-2.5 mb-4">
              {q.options.map((opt) => {
                const letter = opt[0]
                const showCorrect = selectedAnswer && letter === q.correct
                const showWrong = selectedAnswer === letter && letter !== q.correct
                return (
                  <button
                    key={opt}
                    onClick={() => !selectedAnswer && handleDeepDiveQuizAnswer(letter)}
                    disabled={!!selectedAnswer}
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
            {selectedAnswer && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
                  {isCorrect ? 'Exactly right.' : 'Not quite —'}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {q.explanation}
                </p>
              </div>
            )}
            {selectedAnswer && (
              <button
                onClick={handleDeepDiveQuizNext}
                className="w-full text-sm font-medium rounded-lg py-2.5"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                {quizAnswerIndex < deepDiveQuiz.length - 1 ? 'Next question' : 'Start building'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Almost there...</p>
    </div>
  )
}