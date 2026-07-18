import { createClient } from './supabase'

export async function signInWithGoogle() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) {
    console.error('Sign in error:', error.message)
  }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error.message)
  }
  window.location.href = '/login'
}