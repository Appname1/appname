# Environment Variables Checklist

| Variable | Source | Used For | Added to Vercel |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Client + server Supabase connection | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Client + server Supabase connection (RLS-scoped) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | Server-only, bypasses RLS — never expose to browser | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Manually set to live Vercel URL | OAuth redirect construction | ✅ |
| `SENTRY_AUTH_TOKEN` | Sentry wizard (sentry.io) | Uploading source maps during build | ✅ |

## Google OAuth (configured in Supabase + Google Cloud Console directly, not as env vars)
- Google Cloud Console Client ID / Secret pasted into Supabase → Authentication → Providers → Google
- Redirect URIs and JavaScript origins configured in Google Cloud Console

## Notes
- `.env.local` holds all of the above for local dev — confirmed gitignored
- `.env.sentry-build-plugin` (auto-created by Sentry wizard) — confirmed gitignored
- Still to come in later days: `GROQ_API_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`, `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY`, `ANTHROPIC_API_KEY`