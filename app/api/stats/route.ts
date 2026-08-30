import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: recentSteps } = await supabase
      .from('step_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('completed_at', sevenDaysAgo)

    const counts = [0, 0, 0, 0, 0, 0, 0]
    const today = new Date()

    recentSteps?.forEach((row) => {
      if (!row.completed_at) return
      const completedDate = new Date(row.completed_at)
      const diffDays = Math.floor((today.getTime() - completedDate.getTime()) / (24 * 60 * 60 * 1000))
      if (diffDays >= 0 && diffDays < 7) {
        counts[6 - diffDays] += 1
      }
    })

    return NextResponse.json({ dailyCounts: counts })
  } catch {
    return NextResponse.json({ error: 'stats_failed' }, { status: 500 })
  }
}
