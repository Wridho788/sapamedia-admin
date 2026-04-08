'use client';

import { FormEvent, useState } from 'react';

type Category = {
  id: string;
  name: string;
};

export function CategoriesManager({ initialRows }: { initialRows: Category[] }) {
  const [rows, setRows] = useState<Category[]>(initialRows);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setErrorMessage('');

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.trim() }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Gagal membuat kategori');
      setSubmitting(false);
      return;
    }

    const created = (await response.json()) as Category;
    setRows((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
    setName('');
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Hapus kategori ini?');
    if (!confirmed) return;

    setErrorMessage('');

    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Gagal menghapus kategori');
      return;
    }

    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-semibold text-zinc-900">Kategori</h2>
      </div>

      <form onSubmit={handleCreate} className="mb-5 flex flex-wrap gap-2">
        <input
          type="text"
          className="h-10 w-full max-w-sm rounded-lg border border-zinc-300 px-3 outline-none ring-emerald-500 focus:ring-2"
          placeholder="Nama kategori baru"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Menyimpan...' : '+ Tambah Kategori'}
        </button>
      </form>

      {errorMessage ? <p className="mb-3 text-sm text-red-600">{errorMessage}</p> : null}

      {rows.length === 0 ? (
        <p className="text-zinc-600">Belum ada kategori.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2"
            >
              <span className="text-zinc-800">{row.name}</span>
              <button
                type="button"
                onClick={() => void handleDelete(row.id)}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
