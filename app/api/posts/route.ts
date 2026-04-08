import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { postSchema } from '@/lib/validation/post.schema';

export async function POST(request: Request) {
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
    const { data, error } = await supabase
      .from('posts')
      .insert([values])
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
