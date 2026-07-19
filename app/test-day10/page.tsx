'use client'

import { useState } from 'react'

export default function TestDay10Page() {
  const [csvResult, setCsvResult] = useState('')
  const [deepDiveResult, setDeepDiveResult] = useState('')
  const [quizResult, setQuizResult] = useState('')
  const [projectId, setProjectId] = useState('')

  const testExplainCsv = async () => {
    const res = await fetch('/api/explain-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columns: ['customer_id', 'age', 'tenure', 'monthly_charges', 'churn'],
        sample_rows: [['1', '34', '12', '70.5', 'No'], ['2', '45', '3', '89.9', 'Yes']],
        domain: 'DS',
        project_title: 'Customer Churn Prediction',
      }),
    })
    setCsvResult(JSON.stringify(await res.json(), null, 2))
  }

  const testDeepDive = async () => {
    if (!projectId) {
      setDeepDiveResult('Enter a real project_id first (from a project you generated on Day 8)')
      return
    }
    const res = await fetch('/api/explain-csv/deep-dive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    })
    setDeepDiveResult(JSON.stringify(await res.json(), null, 2))
  }

  const testQuiz = async () => {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'pandas groupby', domain: 'DS', skill_level: 'BEGINNER' }),
    })
    setQuizResult(JSON.stringify(await res.json(), null, 2))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-black">
      <h1 className="text-xl font-bold mb-4">Day 10 Route Tests</h1>

      <div className="mb-6 border-b pb-6">
        <h2 className="font-semibold mb-2">/api/explain-csv</h2>
        <button onClick={testExplainCsv} className="bg-black text-white px-3 py-1.5 rounded text-sm">
          Test
        </button>
        <pre className="bg-gray-100 p-3 text-xs mt-3 whitespace-pre-wrap">{csvResult}</pre>
      </div>

      <div className="mb-6 border-b pb-6">
        <h2 className="font-semibold mb-2">/api/explain-csv/deep-dive</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="project_id (from Supabase projects table)"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button onClick={testDeepDive} className="bg-black text-white px-3 py-1.5 rounded text-sm">
          Test
        </button>
        <pre className="bg-gray-100 p-3 text-xs mt-3 whitespace-pre-wrap">{deepDiveResult}</pre>
      </div>

      <div>
        <h2 className="font-semibold mb-2">/api/quiz</h2>
        <button onClick={testQuiz} className="bg-black text-white px-3 py-1.5 rounded text-sm">
          Test
        </button>
        <pre className="bg-gray-100 p-3 text-xs mt-3 whitespace-pre-wrap">{quizResult}</pre>
      </div>
    </div>
  )
}