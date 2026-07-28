import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

const DOMAINS = ['Data Analyst', 'Data Scientist', 'ML Engineer', 'AI Engineer', 'NLP', 'GenAI', 'RAG']

const STEPS = [
  { title: 'Paste a real job description', detail: 'Yours or one you\'re aiming for — we read what the role actually asks for.' },
  { title: 'Get 3 tailored project ideas', detail: 'Each one mapped to a real Kaggle dataset, scored on relevance to that JD.' },
  { title: 'Build it step by step', detail: 'Real code, plain-English breakdowns, and a quiz at every step — no copy-pasting blind.' },
  { title: 'Walk away interview-ready', detail: 'A GitHub-ready project, talking points, and a description test before you ever get asked.' },
]

const OUTCOMES = [
  'A portfolio project that actually matches the job you want, not a generic tutorial clone.',
  'Code you understand line by line — every step comes with a plain-English breakdown.',
  'Real interview talking points pulled straight from what you built.',
  'A working GitHub repo you can link on your resume today.',
  'The confidence to explain your own project under questioning.',
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--paper)' }}>
      {/* 1. Navbar (public header — logged-out visitors) */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
            Appname
          </span>
          <Link
            href="/login"
            className="text-sm font-medium rounded-lg px-4 py-2"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Log in
          </Link>
        </div>
      </header>

      {/* 2. Hero — bento layout */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
          <div
            className="rounded-2xl p-10 lg:p-14 flex flex-col justify-center"
            style={{ background: 'var(--white)', border: '1px solid var(--border)' }}
          >
            <span
              className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-6 w-fit"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
            >
              Built for the job you&apos;re actually applying to
            </span>
            <h1
              className="text-4xl lg:text-5xl font-bold leading-tight mb-5"
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              Turn any job description into a portfolio project you can defend in an interview.
            </h1>
            <p className="text-base mb-8 max-w-lg" style={{ color: 'var(--muted)' }}>
              Paste a JD. Get 3 project ideas built for that exact role, real datasets included, and a
              step-by-step build with code you actually understand — not tutorial hell.
            </p>
            <Link
              href="/login"
              className="w-fit text-sm font-medium rounded-lg px-6 py-3"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              Start building — free credits included
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl p-6 flex-1 flex flex-col justify-center"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-dark)' }}>
                Live credit tracker
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                300
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                free credits to start — no card required
              </p>
            </div>
            <div
              className="rounded-2xl p-6 flex-1 flex flex-col justify-center"
              style={{ background: 'var(--green-bg)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--green-dark)' }}>
                Session streak
              </p>
              <div className="flex gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div
                    key={d}
                    className="flex-1 h-8 rounded-md"
                    style={{ background: d <= 3 ? 'var(--green)' : 'var(--border)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How it works — asymmetric, not numbered icon row */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-10"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          How it works
        </h2>
        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`flex flex-col sm:flex-row gap-4 sm:gap-8 items-start ${i % 2 === 1 ? 'sm:pl-16' : ''}`}
            >
              <span
                className="text-sm font-semibold shrink-0 pt-1"
                style={{ color: 'var(--accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                  {step.title}
                </h3>
                <p className="text-sm max-w-md" style={{ color: 'var(--muted)' }}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Domain pills */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2.5 justify-center">
          {DOMAINS.map((d) => (
            <span
              key={d}
              className="text-sm font-medium rounded-full px-4 py-2"
              style={{ background: 'var(--tag-bg)', color: 'var(--ink)', border: '1px solid var(--border)' }}
            >
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* 5. What you get — prose, not bullet box */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-5"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          What you actually walk away with
        </h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
          Most project tutorials teach you to follow along, not to build. We built this the other way
          around — every project starts from a real job description, so what you build is what a hiring
          manager for that role would actually want to see.
        </p>
        <div className="space-y-3">
          {OUTCOMES.map((o) => (
            <p key={o} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
              {o}
            </p>
          ))}
        </div>
      </section>

      {/* 6. Credit packs pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-10 text-center"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Credit packs
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { name: 'Starter', credits: '300', inr: 'TBD', usd: 'TBD' },
            { name: 'Builder', credits: '1,000', inr: 'TBD', usd: 'TBD' },
            { name: 'Pro', credits: '3,000', inr: 'TBD', usd: 'TBD' },
          ].map((pack) => (
            <div
              key={pack.name}
              className="rounded-2xl p-8 text-center"
              style={{ background: 'var(--white)', border: '1px solid var(--border)' }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
                {pack.name}
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                {pack.credits}
              </p>
              <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
                credits
              </p>
              <p className="text-sm" style={{ color: 'var(--ink)' }}>
                ₹{pack.inr} / ${pack.usd}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Waitlist form */}
      <section className="max-w-lg mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Join the waitlist
        </h2>
        <p className="text-sm mb-8 text-center" style={{ color: 'var(--muted)' }}>
          Beta spots are limited — we&apos;ll email you when it&apos;s your turn.
        </p>
        <WaitlistForm />
      </section>

      {/* 8. Footer */}
      <footer className="border-t py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Appname
          </span>
          <div className="flex gap-6 text-sm" style={{ color: 'var(--muted)' }}>
            <a href="mailto:hello@appname.com">hello@appname.com</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}