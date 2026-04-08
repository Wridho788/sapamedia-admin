// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/approvals/[postId]/approve
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only editors can approve
    const userRole = (profileData as any).roles as string
    if (userRole !== 'editor' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if post exists and is pending
    const { data: postData } = await supabase
      .from('posts')
      .select('status')
      .eq('id', postId)
      .single()

    if (!postData) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if ((postData as any).status !== 'pending') {
      return NextResponse.json(
        { error: 'Post is not pending approval' },
        { status: 400 }
      )
    }

    // Update post status to approved
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ status: 'approved' })
      .eq('id', postId)
      .select()
      .single()

    if (updateError) {
      console.error('[Approve Post Error]:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Create approval record
    const { error: approvalError } = await supabase
      .from('approvals')
      .insert({
        post_id: postId,
        editor_id: user.id,
        status: 'approved'
      })

    if (approvalError) {
      console.error('[Create Approval Record Error]:', approvalError)
      // Don't fail if approval record creation fails
    }

    return NextResponse.json({ success: true, data: updatedPost })
  } catch (error) {
    console.error('[Approve Post Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
