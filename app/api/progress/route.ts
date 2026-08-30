import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { project_id, step_number } = body

    if (!project_id || typeof step_number !== 'number') {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { data: project } = await supabase
      .from('projects')
      .select('project_json')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    const totalSteps = project?.project_json?.steps?.length ?? 0

    await supabase
      .from('step_progress')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('project_id', project_id)
      .eq('user_id', user.id)
      .eq('step_number', step_number)

    const isLastStep = step_number >= totalSteps
    const nextStep = isLastStep ? null : step_number + 1

    if (isLastStep) {
      const { data: profile } = await supabase
        .from('users')
        .select('total_projects_completed')
        .eq('id', user.id)
        .single()

      await supabase
        .from('users')
        .update({ total_projects_completed: (profile?.total_projects_completed ?? 0) + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({ next_step: nextStep, is_complete: isLastStep })
  } catch {
    return NextResponse.json({ error: 'progress_update_failed' }, { status: 500 })
  }
}
