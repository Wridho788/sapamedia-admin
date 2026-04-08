import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { createClient } from '@/lib/supabase/server';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  return <CategoriesManager initialRows={data ?? []} />;
}
