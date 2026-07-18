'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-bold text-[#141312] mb-3">
          Something broke
        </h1>
        <p className="text-[#6B6A66] mb-6">
          We&apos;ve logged this and we&apos;re on it. You can try again, or head back to your dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-white border border-[#E4E2DA] text-[#141312] text-sm font-medium rounded-lg px-5 py-2.5"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="bg-[#141312] text-[#FAF9F6] text-sm font-medium rounded-lg px-5 py-2.5"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}