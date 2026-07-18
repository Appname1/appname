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
  ]

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav className="w-full border-b border-[#E4E2DA] bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: logo */}
        <Link href="/dashboard" className="text-lg font-bold text-[#141312]">
          Appname
        </Link>

        {/* Center: nav links, hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-[#B8860B]' : 'text-[#6B6A66] hover:text-[#141312]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: credits, avatar, sign out */}
        <div className="flex items-center gap-4">
          <Link
            href="/credits/topup"
            className="flex items-center gap-1.5 bg-white border border-[#E4E2DA] rounded-full px-3 py-1.5 text-sm font-medium text-[#141312] hover:border-[#B8860B] transition-colors"
          >
            <span className="text-[#B8860B]">●</span>
            {creditBalance} credits
          </Link>

          <div className="w-8 h-8 rounded-full bg-[#141312] text-[#FAF9F6] flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>

          <button
            onClick={signOut}
            className="text-sm text-[#6B6A66] hover:text-[#141312] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}