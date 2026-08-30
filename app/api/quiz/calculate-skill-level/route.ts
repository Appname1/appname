import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answers, project_id } = body

    if (!Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json({ error: 'invalid_answers' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const abCount = answers.filter((a: string) => a === 'A' || a === 'B').length
    const cdCount = answers.filter((a: string) => a === 'C' || a === 'D').length

    let skillLevel: string
    if (abCount >= 4) {
      skillLevel = 'BEGINNER'
    } else if (cdCount >= 4) {
      skillLevel = 'CONFIDENT'
    } else {
      skillLevel = 'INTERMEDIATE'
    }

    if (project_id) {
      await supabase
        .from('projects')
        .update({ skill_level: skillLevel })
        .eq('id', project_id)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ skill_level: skillLevel })
  } catch {
    return NextResponse.json({ error: 'calculation_failed' }, { status: 500 })
  }
}
