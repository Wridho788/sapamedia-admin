'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactMarkdown from 'react-markdown';
import { postSchema, type PostFormValues } from '@/lib/validation/post.schema';
import { slugify } from '@/lib/utils/slugify';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { MarkdownToolbar } from '@/components/ui/MarkdownToolbar';

export type PostFormMode = 'create' | 'edit';

export function PostForm({
  mode,
  defaultValues,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  mode: PostFormMode;
  defaultValues?: Partial<PostFormValues>;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [previewMode, setPreviewMode] = useState<'write' | 'preview'>('write');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      slug: defaultValues?.slug ?? '',
      excerpt: defaultValues?.excerpt ?? '',
      content: defaultValues?.content ?? '',
      status: defaultValues?.status ?? 'draft',
      category_id: defaultValues?.category_id ?? '',
      cover_image: defaultValues?.cover_image ?? '',
      image_urls: defaultValues?.image_urls ?? [],
    },
  });

  const title = useWatch({ control, name: 'title' }) ?? '';
  const slug = useWatch({ control, name: 'slug' }) ?? '';
  const content = useWatch({ control, name: 'content' }) ?? '';
  const coverImage = useWatch({ control, name: 'cover_image' }) ?? '';
  const imageUrls = useWatch({ control, name: 'image_urls' }) ?? [];
  const slugManuallyEditedRef = useRef(Boolean(defaultValues?.slug));
  const uploadInProgress = uploadingCover || uploadingImages;

  useEffect(() => {
    if (!slugManuallyEditedRef.current) {
      setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [title, setValue]);

  useEffect(() => {
    let canceled = false;

    fetch('/api/categories')
      .then(async (response) => {
        if (!response.ok) {
          return [] as Array<{ id: string; name: string }>;
        }
        return (await response.json()) as Array<{ id: string; name: string }>;
      })
      .then((rows) => {
        if (!canceled) {
          setCategories(rows);
        }
      })
      .catch(() => {
        if (!canceled) {
          setCategories([]);
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="title">
          Judul
        </label>
        <input
          id="title"
          {...register('title')}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
        />
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          {...register('slug')}
          value={slug}
          onChange={(event) => {
            slugManuallyEditedRef.current = true;
            setValue('slug', slugify(event.target.value), { shouldValidate: true });
          }}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
        />
        {errors.slug ? <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="excerpt">
          Ringkasan
        </label>
        <textarea
          id="excerpt"
          {...register('excerpt')}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="content">
          Konten
        </label>

        <MarkdownToolbar
          onInsert={(text) => {
            const current = getValues('content') || '';
            const spacer = current.length > 0 ? '\n' : '';
            setValue('content', `${current}${spacer}${text}`, { shouldValidate: true });
          }}
        />

        <div className="mb-2 flex gap-2">
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-sm ${
              previewMode === 'write' ? 'bg-zinc-900 text-white' : 'border border-zinc-300 text-zinc-700'
            }`}
            onClick={() => setPreviewMode('write')}
          >
            Tulis
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-sm ${
              previewMode === 'preview' ? 'bg-zinc-900 text-white' : 'border border-zinc-300 text-zinc-700'
            }`}
            onClick={() => setPreviewMode('preview')}
          >
            Pratinjau
          </button>
        </div>

        {previewMode === 'write' ? (
          <textarea
            id="content"
            {...register('content')}
            rows={10}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
          />
        ) : (
          <div className="prose max-w-none rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <ReactMarkdown>{content || '*Pratinjau masih kosong*'}</ReactMarkdown>
          </div>
        )}
        {errors.content ? <p className="mt-1 text-sm text-red-600">{errors.content.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
        >
          <option value="draft">Draf</option>
          <option value="published">Terbit</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="category_id">
          Kategori
        </label>
        <select
          id="category_id"
          {...register('category_id')}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
        >
          <option value="">Tanpa kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-zinc-700">Gambar sampul</p>
        <ImageUpload
          initialUrl={coverImage}
          disabled={isSubmitting}
          onUploadingChange={setUploadingCover}
          onUpload={(url) => setValue('cover_image', url, { shouldValidate: true })}
        />
        {errors.cover_image ? <p className="mt-1 text-sm text-red-600">{errors.cover_image.message}</p> : null}
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-zinc-700">Gambar (maksimal 3)</p>
        <MultiImageUpload
          initialUrls={imageUrls}
          disabled={isSubmitting}
          onUploadingChange={setUploadingImages}
          onUpload={(urls) => {
            const previous = getValues('image_urls') ?? [];
            setValue('image_urls', urls, { shouldValidate: true });

            const existing = getValues('content') || '';
            const newUrls = urls.filter((url) => !previous.includes(url));

            if (newUrls.length > 0) {
              const snippets = newUrls.map((url) => `![image](${url})`).join('\n');
              const nextContent = `${existing}${existing ? '\n\n' : ''}${snippets}`;
              setValue('content', nextContent, { shouldValidate: true });
            }
          }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting || uploadInProgress}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting || uploadInProgress ? 'Memproses...' : submitLabel}
        </button>

        {mode === 'edit' && onDelete ? (
          <button
            type="button"
            disabled={isSubmitting || uploadInProgress}
            className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={async () => {
              if (window.confirm('Yakin ingin menghapus? Tindakan ini tidak bisa dibatalkan.')) {
                await onDelete();
              }
            }}
          >
            Hapus
          </button>
        ) : null}
      </div>
    </form>
  );
}
