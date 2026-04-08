'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Table from '@/components/ui/Table';
import { usePosts } from '@/hooks/usePosts';
import type { PostItem } from '@/services/post.service';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function StatusBadge({ status }: { status: PostItem['status'] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        status === 'published'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-zinc-200 text-zinc-700'
      }`}
    >
      {status === 'published' ? 'terbit' : 'draf'}
    </span>
  );
}

export default function PostsPage() {
  const { data, loading, error } = usePosts();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const filteredPosts = useMemo(() => {
    return data.filter((row) => {
      const matchQuery = row.title.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' ? true : row.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [data, query, statusFilter]);

  if (loading) {
    return <p className="text-zinc-600">Memuat artikel...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-semibold text-zinc-900">Artikel</h2>
        <Link
          href="/admin/posts/create"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Artikel Baru
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Cari berdasarkan judul"
          className="h-10 w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 outline-none ring-emerald-500 focus:ring-2"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 outline-none ring-emerald-500 focus:ring-2"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | 'draft' | 'published')}
        >
          <option value="all">Semua</option>
          <option value="draft">Draf</option>
          <option value="published">Terbit</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-zinc-700">Belum ada artikel.</p>
          <Link
            href="/admin/posts/create"
            className="mt-3 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Buat artikel pertamamu
          </Link>
        </div>
      ) : (
        <Table
          data={filteredPosts}
          columns={[
            { key: 'title', label: 'Judul' },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge status={value as PostItem['status']} />,
            },
            {
              key: 'created_at',
              label: 'Tanggal',
              render: (value) => formatDate(String(value)),
            },
            {
              key: 'id',
              label: 'Aksi',
              render: (value) => (
                <Link href={`/admin/posts/edit/${value}`} className="text-emerald-700 hover:underline">
                  Ubah
                </Link>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}
