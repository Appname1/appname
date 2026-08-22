const TOPIC_CATEGORIES = {
  'Python Fundamentals': [
    { name: 'Lists', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
    { name: 'Dictionaries', url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
    { name: 'Loops', url: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' },
    { name: 'Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
    { name: 'f-strings', url: 'https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals' },
  ],
  'Data Handling': [
    { name: 'Pandas', url: 'https://pandas.pydata.org/docs/' },
    { name: 'NumPy', url: 'https://numpy.org/doc/stable/' },
    { name: 'Encoding', url: 'https://scikit-learn.org/stable/modules/preprocessing.html#preprocessing-categorical-features' },
  ],
  'Machine Learning': [
    { name: 'Scikit-learn', url: 'https://scikit-learn.org/stable/documentation.html' },
    { name: 'XGBoost', url: 'https://xgboost.readthedocs.io/' },
    { name: 'TensorFlow', url: 'https://www.tensorflow.org/api_docs' },
    { name: 'PyTorch', url: 'https://pytorch.org/docs/stable/index.html' },
  ],
  'Visualization': [
    { name: 'Matplotlib', url: 'https://matplotlib.org/stable/index.html' },
    { name: 'Seaborn', url: 'https://seaborn.pydata.org/' },
    { name: 'Power BI', url: 'https://learn.microsoft.com/en-us/power-bi/' },
    { name: 'Tableau', url: 'https://help.tableau.com/current/pro/desktop/en-us/' },
  ],
  'AI & NLP': [
    { name: 'NLTK', url: 'https://www.nltk.org/' },
    { name: 'LangChain', url: 'https://python.langchain.com/docs/introduction/' },
  ],
  'Data & SQL': [
    { name: 'SQL', url: 'https://www.w3schools.com/sql/' },
  ],
  'Infrastructure': [
    { name: 'Docker', url: 'https://docs.docker.com/' },
    { name: 'AWS', url: 'https://docs.aws.amazon.com/' },
  ],
}

export default function LearnPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
            <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/settings" className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Settings
        </a>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Topic reference
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          Official docs for every concept you might run into across your projects.
        </p>

        {Object.entries(TOPIC_CATEGORIES).map(([category, topics]) => (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--accent)' }}>
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {topics.map((t) => {
                const linkStyle = { background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--ink)' }
                return (
                  <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-3 border text-sm" style={linkStyle}>
                    {t.name}
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}