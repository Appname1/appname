import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'
import Logo from '@/components/Logo'

const DOMAINS = ['Data Analyst', 'Data Scientist', 'ML Engineer', 'AI Engineer', 'NLP', 'GenAI', 'RAG']

const STEPS = [
  { title: 'Paste a real job description', detail: 'Yours or one you are aiming for. We read what the role actually asks for, not a generic template.' },
  { title: 'Get 3 project ideas built for that JD', detail: 'Each one comes with a real Kaggle dataset and a relevance score against the job posting.' },
  { title: 'Build it step by step', detail: 'Real code, plain English explanations, and a short quiz at each step. No copying blind.' },
  { title: 'Walk in ready to talk about it', detail: 'A GitHub repo, interview talking points, and a description test before anyone asks you a question.' },
]

const OUTCOMES = [
  { label: 'Relevance', text: 'A project that matches the actual job you want, not a tutorial everyone else already built.' },
  { label: 'Understanding', text: 'Code you can explain line by line, because every step comes with a plain English breakdown.' },
  { label: 'Proof', text: 'A working GitHub repo you can link on your resume the same day you finish.' },
  { label: 'Talking points', text: 'Interview answers pulled straight from what you actually built, not memorized theory.' },
  { label: 'Confidence', text: 'A description test at the end so you know you can defend your own project under questioning.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--paper)' }}>
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={28} showWordmark />
          <Link
            href="/coming-soon"
            className="text-sm font-medium rounded-lg px-4 py-2"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero */}
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
              Three ways to start. One real project out.
            </span>
            <h1
              className="text-4xl lg:text-5xl font-bold leading-tight mb-5"
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              Stop guessing what to build. Start building what gets you hired.
            </h1>
            <p className="text-base mb-8 max-w-lg" style={{ color: 'var(--muted)' }}>
              Choose how you start, a job description, a role, or a custom project, then build it for
              real: working code, plain English explanations, and interview prep built in.
            </p>
            <Link
              href="/coming-soon"
              className="w-fit text-sm font-medium rounded-lg px-6 py-3"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              Start building free
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl p-6 flex-1 flex flex-col justify-center"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-dark)' }}>
                You start with
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                300 credits
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                free, no card needed
              </p>
            </div>
            <div
              className="rounded-2xl p-6 flex-1 flex flex-col justify-center"
              style={{ background: 'var(--green-bg)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--green-dark)' }}>
                Every project includes
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
                6-8 steps
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                real code, quizzes, and a working repo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-10"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          How it works
        </h2>
        <div className="relative">
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px"
            style={{ background: 'var(--border)' }}
          />
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-6 items-start relative">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 z-10"
                  style={{ background: 'var(--paper)', border: '2px solid var(--accent)', color: 'var(--accent)' }}
                >
                  {i + 1}
                </span>
                <div className="pt-1.5">
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
        </div>
      </section>

      {/* Domain pills */}
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

      {/* What you get */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-5"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          What you actually walk away with
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
          Most project tutorials teach you to follow along, not to build. This works the other way.
          Every project starts from a real job description, so what you end up with is what a hiring
          manager for that exact role would want to see.
        </p>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {OUTCOMES.map((o) => (
            <div key={o.label} className="grid grid-cols-[110px_1fr] gap-4 py-4">
              <span
                className="text-xs font-semibold uppercase tracking-wide pt-0.5"
                style={{ color: 'var(--accent)' }}
              >
                {o.label}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                {o.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Credit packs */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Credit packs
        </h2>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--muted)' }}>
          Pricing coming soon. Start free with 300 credits today.
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { name: 'Starter', credits: '300' },
            { name: 'Builder', credits: '1,000' },
            { name: 'Pro', credits: '3,000' },
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
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                credits
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section className="max-w-lg mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Join the waitlist
        </h2>
        <p className="text-sm mb-8 text-center" style={{ color: 'var(--muted)' }}>
          Beta spots are limited. We will email you when it is your turn.
        </p>
        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="border-t py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={20} showWordmark />
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