'use client'

import { useState } from 'react'

export default function TestSuggestPage() {
  const [jd, setJd] = useState(
    'We are hiring a Data Analyst for our fintech team. You will write SQL queries, build Power BI dashboards, analyse transaction data, and present insights to non-technical stakeholders. Python is a plus.'
  )
  const [skills, setSkills] = useState('Python, SQL, Power BI, Pandas')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResult('')
    const res = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd, skills: skills.split(',').map((s) => s.trim()) }),
    })
    const data = await res.json()
    setResult(JSON.stringify(data, null, 2))
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-black">
      <h1 className="text-xl font-bold mb-4">Test /api/suggest</h1>
      <textarea
        className="w-full border p-2 mb-2 h-32"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Loading...' : 'Test'}
      </button>
      <pre className="bg-gray-100 p-4 text-xs whitespace-pre-wrap">{result}</pre>
    </div>
  )
}