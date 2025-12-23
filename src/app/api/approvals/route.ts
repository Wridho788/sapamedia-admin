// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/approvals - Get pending posts for approval
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only editors and admins can access approvals
    const userRole = (profileData as any).roles as string; if (userRole !== 'editor' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get pending posts
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories:category_id(id, name, slug),
        profiles:writer_id(id, full_name, avatar_url, email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Approvals GET Error]:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ approvals: data })
  } catch (error) {
    console.error('[Approvals GET Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



