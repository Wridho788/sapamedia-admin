'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Terjadi gangguan jaringan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none ring-emerald-500 transition focus:ring-2"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          required
          className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none ring-emerald-500 transition focus:ring-2"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-zinc-900 px-4 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sedang masuk...' : 'Masuk ke Dasbor'}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Akses aman hanya untuk anggota tim yang berwenang.
      </p>
    </form>
  );
}
