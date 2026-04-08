// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET /api/posts - List posts with filters
export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams
    const scope = searchParams.get('scope') // 'mine', 'pending', 'all'
    const status = searchParams.get('status')

    let query = supabase
      .from('posts')
      .select(`
        *,
        categories:category_id(id, name, slug),
        profiles:writer_id(id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    // Filter by scope
    if (scope === 'mine') {
      query = query.eq('writer_id', user.id)
    } else if (scope === 'pending') {
      query = query.eq('status', 'pending')
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }

    // Role-based filtering
    const userRole = (profileData as any).roles as string
    if (userRole === 'writer') {
      // Writers can only see their own posts
      query = query.eq('writer_id', user.id)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Posts GET Error]:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error('[Posts GET Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
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

    // Only writers and admins can create posts
    const userRole = (profileData as any).roles as string
    if (userRole !== 'writer' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category_id, featured_image, excerpt, meta_title, meta_description } = body

    if (!title || !content || !category_id) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = generateSlug(title)

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      const timestamp = Date.now()
      const uniqueSlug = `${slug}-${timestamp}`
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          slug: uniqueSlug,
          content,
          excerpt,
          category_id,
          featured_image,
          meta_title,
          meta_description,
          writer_id: user.id,
          status: 'draft',
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ post: data }, { status: 201 })
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        category_id,
        featured_image,
        meta_title,
        meta_description,
        writer_id: user.id,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error) {
    console.error('[Posts POST Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

