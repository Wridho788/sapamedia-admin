import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
