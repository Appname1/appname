import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, amount, direction, description, project_id } = body

    if (!user_id || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }
    if (direction !== 'earn' && direction !== 'spend') {
      return NextResponse.json({ error: 'invalid_direction' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== user_id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', user_id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 })
    }

    if (direction === 'spend') {
      if (profile.credit_balance < amount) {
        return NextResponse.json(
          { error: 'insufficient_credits', balance: profile.credit_balance },
          { status: 400 }
        )
      }
    }

    const newBalance =
      direction === 'earn'
        ? profile.credit_balance + amount
        : profile.credit_balance - amount

    const { error: txError } = await supabase.from('credit_transactions').insert({
      user_id,
      amount,
      direction,
      description,
      project_id: project_id ?? null,
    })

    if (txError) {
      return NextResponse.json({ error: 'transaction_failed' }, { status: 500 })
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ credit_balance: newBalance })
      .eq('id', user_id)

    if (updateError) {
      return NextResponse.json({ error: 'balance_update_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, new_balance: newBalance })
  } catch {
    return NextResponse.json({ error: 'credits_failed' }, { status: 500 })
  }
}
