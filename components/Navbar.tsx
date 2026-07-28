'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth'

interface NavbarProps {
  creditBalance: number
  userName: string
}

export default function Navbar({ creditBalance, userName }: NavbarProps) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/appearance', label: 'Appearance' },
  ]

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav
      className="w-full border-b"
      style={{ background: 'var(--paper)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
          Appname
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/credits/topup"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors"
            style={{ background: 'var(--white)', borderColor: 'var(--border)', color: 'var(--ink)' }}
          >
            <span style={{ color: 'var(--accent)' }}>●</span>
            {creditBalance} credits
          </Link>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            {initials}
          </div>

          <button
            onClick={signOut}
            className="text-sm transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}