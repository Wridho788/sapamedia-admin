'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PostForm } from '@/components/post/PostForm';
import type { PostFormValues } from '@/lib/validation/post.schema';

export default function CreatePostPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: PostFormValues) => {
    setErrorMessage('');

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Gagal membuat artikel');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading mb-5 text-2xl font-semibold text-zinc-900">Buat Artikel</h2>
      {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
      <PostForm mode="create" submitLabel="Simpan" onSubmit={handleSubmit} />
    </section>
  );
}
