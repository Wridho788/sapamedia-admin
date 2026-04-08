import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('status');

  const rows = data ?? [];
  const total = rows.length;
  const published = rows.filter((row) => row.status === 'published').length;
  const draft = rows.filter((row) => row.status === 'draft').length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-zinc-500">Total Artikel</h2>
        <p className="mt-2 font-heading text-3xl font-semibold text-zinc-900">{total}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-zinc-500">Terbit</h2>
        <p className="mt-2 font-heading text-3xl font-semibold text-emerald-700">{published}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-zinc-500">Draf</h2>
        <p className="mt-2 font-heading text-3xl font-semibold text-zinc-900">{draft}</p>
      </section>
    </div>
  );
}
