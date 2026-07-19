'use client'

import { useState } from 'react'

export default function TestGeneratePage() {
  const [projectTitle, setProjectTitle] = useState('Customer Churn Prediction')
  const [domain, setDomain] = useState('DS')
  const [jd, setJd] = useState('Data Scientist role focused on customer retention and predictive modeling.')
  const [skills, setSkills] = useState('Python, scikit-learn, Pandas')
  const [datasetColumns, setDatasetColumns] = useState('customer_id, age, tenure, monthly_charges, total_charges, churn')
  const [datasetName, setDatasetName] = useState('Telco Customer Churn')
  const [skillLevel, setSkillLevel] = useState('BEGINNER')
  const [isCaseStudy, setIsCaseStudy] = useState(true)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResult('')
    const res = await fetch('/api/test-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_title: projectTitle,
        domain,
        jd,
        skills: skills.split(',').map((s) => s.trim()),
        dataset_columns: datasetColumns.split(',').map((s) => s.trim()),
        dataset_name: datasetName,
        skill_level: skillLevel,
        is_case_study: isCaseStudy,
      }),
    })
    const data = await res.json()
    setResult(JSON.stringify(data, null, 2))
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto text-black">
      <h1 className="text-xl font-bold mb-4">Test /api/test-generate (Call 2)</h1>

      <label className="block text-sm font-medium mb-1">Project Title</label>
      <input className="w-full border p-2 mb-3" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Domain</label>
      <select className="w-full border p-2 mb-3" value={domain} onChange={(e) => setDomain(e.target.value)}>
        <option value="DA">DA</option>
        <option value="DS">DS</option>
        <option value="ML">ML</option>
        <option value="AI_ENGINEER">AI_ENGINEER</option>
        <option value="NLP">NLP</option>
        <option value="GENAI">GENAI</option>
        <option value="RAG">RAG</option>
      </select>

      <label className="block text-sm font-medium mb-1">Job Description</label>
      <textarea className="w-full border p-2 mb-3 h-20" value={jd} onChange={(e) => setJd(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
      <input className="w-full border p-2 mb-3" value={skills} onChange={(e) => setSkills(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Dataset Columns (comma separated)</label>
      <input className="w-full border p-2 mb-3" value={datasetColumns} onChange={(e) => setDatasetColumns(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Dataset Name</label>
      <input className="w-full border p-2 mb-3" value={datasetName} onChange={(e) => setDatasetName(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Skill Level</label>
      <select className="w-full border p-2 mb-3" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
        <option value="BEGINNER">BEGINNER</option>
        <option value="INTERMEDIATE">INTERMEDIATE</option>
        <option value="CONFIDENT">CONFIDENT</option>
      </select>

      <label className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={isCaseStudy} onChange={(e) => setIsCaseStudy(e.target.checked)} />
        Is Case Study
      </label>

      <button onClick={handleTest} disabled={loading} className="bg-black text-white px-4 py-2 rounded mb-4">
        {loading ? 'Generating... (can take 10-20s)' : 'Test'}
      </button>

      <pre className="bg-gray-100 p-4 text-xs whitespace-pre-wrap">{result}</pre>
    </div>
  )
}