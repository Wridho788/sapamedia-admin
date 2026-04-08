'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from '@/components/post/PostForm';
import type { PostFormValues } from '@/lib/validation/post.schema';

type PostResponse = PostFormValues & { id: string };

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let canceled = false;

    fetch(`/api/posts/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Not found');
        }
        return (await response.json()) as PostResponse;
      })
      .then((payload) => {
        if (!canceled) {
          setPost(payload);
        }
      })
      .catch(() => {
        if (!canceled) {
          setErrorMessage('Artikel tidak ditemukan');
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [params.id]);

  const handleSubmit = async (values: PostFormValues) => {
    setErrorMessage('');

    const response = await fetch(`/api/posts/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Gagal memperbarui artikel');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/posts/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Gagal menghapus artikel');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  if (loading) {
    return <p className="text-zinc-600">Memuat artikel...</p>;
  }

  if (!post) {
    return <p className="text-red-600">{errorMessage || 'Artikel tidak ditemukan'}</p>;
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading mb-5 text-2xl font-semibold text-zinc-900">Ubah Artikel</h2>
      {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
      <PostForm
        mode="edit"
        submitLabel="Perbarui"
        defaultValues={post}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </section>
  );
}
