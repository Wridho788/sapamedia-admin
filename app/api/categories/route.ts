import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name minimal 2 karakter'),
});

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  try {
    const payload = createCategorySchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { error: payload.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: payload.data.name.trim() }])
      .select('id, name')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
