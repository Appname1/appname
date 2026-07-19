'use client'

import { useState } from 'react'

export default function TestDay8Page() {
  const [genResult, setGenResult] = useState('')
  const [creditsResult, setCreditsResult] = useState('')
  const [userId, setUserId] = useState('')

  const testGenerateMock = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Test': 'true' },
      body: JSON.stringify({}),
    })
    setGenResult(JSON.stringify(await res.json(), null, 2))
  }

  const testGenerateReal = async () => {
    setGenResult('Generating... (10-20s)')
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_title: 'Customer Churn Prediction',
        domain: 'DS',
        jd: 'Data Scientist role focused on customer retention.',
        skills: ['Python', 'scikit-learn', 'Pandas'],
        dataset_columns: ['customer_id', 'age', 'tenure', 'monthly_charges', 'churn'],
        dataset_name: 'Telco Customer Churn',
        skill_level: 'BEGINNER',
        is_case_study: true,
      }),
    })
    setGenResult(JSON.stringify(await res.json(), null, 2))
  }

  const testCreditsEarn = async () => {
    if (!userId) {
      setCreditsResult('Enter your user_id first (find it in Supabase users table)')
      return
    }
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, amount: 50, direction: 'earn', description: 'Test earn' }),
    })
    setCreditsResult(JSON.stringify(await res.json(), null, 2))
  }

  const testCreditsSpendTooMuch = async () => {
    if (!userId) {
      setCreditsResult('Enter your user_id first')
      return
    }
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, amount: 999999, direction: 'spend', description: 'Test overspend' }),
    })
    setCreditsResult(JSON.stringify(await res.json(), null, 2))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-black">
      <h1 className="text-xl font-bold mb-4">Day 8 Route Tests</h1>

      <div className="mb-8 border-b pb-6">
        <h2 className="font-semibold mb-2">/api/generate</h2>
        <button onClick={testGenerateMock} className="bg-black text-white px-3 py-1.5 rounded mr-2 text-sm">
          Test X-Test mock
        </button>
        <button onClick={testGenerateReal} className="bg-black text-white px-3 py-1.5 rounded text-sm">
          Test real generation
        </button>
        <pre className="bg-gray-100 p-3 text-xs mt-3 whitespace-pre-wrap">{genResult}</pre>
      </div>

      <div>
        <h2 className="font-semibold mb-2">/api/credits</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Your user_id (from Supabase users table)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={testCreditsEarn} className="bg-black text-white px-3 py-1.5 rounded mr-2 text-sm">
          Earn 50 credits
        </button>
        <button onClick={testCreditsSpendTooMuch} className="bg-black text-white px-3 py-1.5 rounded text-sm">
          Spend 999999 (should fail)
        </button>
        <pre className="bg-gray-100 p-3 text-xs mt-3 whitespace-pre-wrap">{creditsResult}</pre>
      </div>
    </div>
  )
}