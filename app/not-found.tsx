import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-4xl font-bold text-[#141312] mb-3">404</h1>
        <p className="text-[#6B6A66] mb-6">
          This page doesn&apos;t exist — but your project probably does.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-[#141312] text-[#FAF9F6] text-sm font-medium rounded-lg px-5 py-2.5"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}