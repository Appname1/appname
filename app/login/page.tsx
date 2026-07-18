'use client'

import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    if (error) {
      console.error('Login error:', error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="max-w-sm w-full mx-auto px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-[#141312] mb-2">
          Appname
        </h1>
        <p className="text-[#6B6A66] mb-10">
          Build real projects. Land the job.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-[#E4E2DA] rounded-lg py-3 px-6 bg-white hover:bg-[#FAF9F6] transition-colors text-[#141312] font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.6 10.23c0-.68-.06-1.33-.17-1.96H10v3.71h5.38c-.23 1.25-.94 2.31-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.27z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.6-4.11H1.06v2.59C2.72 17.75 6.09 20 10 20z" fill="#34A853"/>
            <path d="M4.4 11.93A5.99 5.99 0 014.1 10c0-.67.11-1.32.3-1.93V5.48H1.06A9.96 9.96 0 000 10c0 1.61.39 3.14 1.06 4.52l3.34-2.59z" fill="#FBBC05"/>
            <path d="M10 3.96c1.47 0 2.79.51 3.82 1.5l2.87-2.87C14.95.99 12.7 0 10 0 6.09 0 2.72 2.25 1.06 5.48l3.34 2.59C5.2 5.71 7.4 3.96 10 3.96z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}