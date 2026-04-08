import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      redirect('/admin');
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-zinc-950 p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.22),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(234,179,8,0.14),transparent_40%)]" />

      <section className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:grid-cols-2">
        <aside className="hidden border-r border-white/10 p-10 md:flex md:flex-col md:justify-between">
          <div>
            <p className="font-heading text-2xl font-semibold text-white">Sapamedia</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-300">
              CMS workspace untuk tim konten modern. Rancang, preview, publish, dan scale semua dari satu dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-400">Mode Build</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">Pengalaman Login Startup</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-zinc-400">Autentikasi</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">Supabase SSR</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-zinc-400">Panel</p>
                <p className="mt-1 text-sm font-semibold text-sky-300">Siap Digunakan</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="bg-white px-6 py-8 sm:px-10 sm:py-10">
          <p className="font-heading text-2xl font-semibold text-zinc-900">Selamat Datang Kembali</p>
          <p className="mt-1 mb-6 text-sm text-zinc-600">Masuk untuk lanjut ke dasbor admin Sapamedia.</p>

          {!hasSupabaseEnv ? (
            <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.
            </p>
          ) : null}

          <LoginForm />
        </div>
      </section>
    </main>
  );
}