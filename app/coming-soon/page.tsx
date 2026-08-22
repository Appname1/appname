import Logo from '@/components/Logo'
import WaitlistForm from '@/components/WaitlistForm'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
      <div className="max-w-md w-full px-6 text-center">
        <div className="flex justify-center mb-6">
          <Logo size={44} showWordmark />
        </div>
        <span
          className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-5"
          style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}
        >
          Coming soon
        </span>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          We&apos;re building something worth the wait.
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          bornout turns any job description into a portfolio project you can actually defend in an interview. Leave your email and we&apos;ll let you know the moment it&apos;s ready.
        </p>
        <WaitlistForm />
      </div>
    </div>
  )
}