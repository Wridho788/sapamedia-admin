import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { postSchema } from '@/lib/validation/post.schema';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, status, category_id, cover_image, image_urls')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    category_id: data.category_id ?? '',
    cover_image: data.cover_image ?? '',
    image_urls: Array.isArray(data.image_urls) ? data.image_urls : [],
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const payload = postSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { error: payload.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }

    const values: Record<string, unknown> = {
      title: payload.data.title,
      slug: payload.data.slug,
      excerpt: payload.data.excerpt ?? null,
      content: payload.data.content,
      status: payload.data.status,
    };

    if (payload.data.category_id) {
      values.category_id = payload.data.category_id;
    }

    if (payload.data.cover_image) {
      values.cover_image = payload.data.cover_image;
    }

    if (payload.data.image_urls && payload.data.image_urls.length > 0) {
      values.image_urls = payload.data.image_urls;
    }

    const supabase = await createClient();
    const { error } = await supabase.from('posts').update(values).eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
