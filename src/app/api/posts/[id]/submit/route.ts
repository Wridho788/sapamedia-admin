// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/posts/[id]/submit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only writers can submit
    if (profile.roles !== 'writer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the post
    const { data: post } = await supabase
      .from('posts')
      .select('writer_id, status')
      .eq('id', id)
      .single()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check ownership
    if (post.writer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Can only submit draft or rejected posts
    if (post.status !== 'draft' && post.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Can only submit draft or rejected posts' },
        { status: 400 }
      )
    }

    // Update status to pending
    const { data, error } = await supabase
      .from('posts')
      .update({ status: 'pending' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('[Posts Submit Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
