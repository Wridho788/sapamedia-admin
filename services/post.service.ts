import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type PostItem = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
};

export async function getPosts() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PostItem[];
}
