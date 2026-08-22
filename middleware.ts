import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

   // Protect /dashboard and any nested routes under it
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

    // On the public custom domain, show the real landing page at "/",
  // but redirect any deeper page (login, dashboard, entry, etc.) to coming-soon
  const hostname = request.headers.get('host') || ''
  const isCustomDomain = hostname.includes('bornout.co.in')
  const isRootPath = request.nextUrl.pathname === '/'
  const isComingSoonPath = request.nextUrl.pathname === '/coming-soon'
  const isInternalPath = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api')

  if (isCustomDomain && !isRootPath && !isComingSoonPath && !isInternalPath) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/((?!_next|api).*)'],
}