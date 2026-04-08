// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/approvals/[postId]/reject
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only editors can reject
    if (profile.roles !== 'editor' && profile.roles !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Check if post exists and is pending
    const { data: post } = await supabase
      .from('posts')
      .select('status')
      .eq('id', postId)
      .single()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.status !== 'pending') {
      return NextResponse.json(
        { error: 'Post is not pending approval' },
        { status: 400 }
      )
    }

    // Update post status to rejected
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ status: 'rejected' })
      .eq('id', postId)
      .select()
      .single()

    if (updateError) {
      console.error('[Reject Post Error]:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Create approval record with rejection reason
    const { error: approvalError } = await supabase
      .from('approvals')
      .insert({
        post_id: postId,
        editor_id: user.id,
        status: 'rejected',
        reason: reason
      })

    if (approvalError) {
      console.error('[Create Approval Record Error]:', approvalError)
      // Don't fail if approval record creation fails
    }

    return NextResponse.json({ success: true, data: updatedPost })
  } catch (error) {
    console.error('[Reject Post Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
