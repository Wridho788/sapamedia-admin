'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type ImageUploadProps = {
  initialUrl?: string;
  disabled?: boolean;
  onUpload: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function ImageUpload({
  initialUrl,
  disabled,
  onUpload,
  onUploadingChange,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentPreview = preview ?? initialUrl ?? null;

  const handleFile = async (file: File | null | undefined) => {
    if (!file || disabled) {
      return;
    }

    setErrorMessage('');

    if (!file.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Ukuran file maksimal 2MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setLoading(true);
    onUploadingChange?.(true);

    const supabase = getSupabaseBrowserClient();
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('post-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      onUploadingChange?.(false);
      return;
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
    onUpload(data.publicUrl);

    setLoading(false);
    onUploadingChange?.(false);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        className="relative overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFile(event.dataTransfer.files?.[0]);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        {currentPreview ? (
          <Image
            src={currentPreview}
            alt="Pratinjau sampul"
            width={1200}
            height={640}
            className="mx-auto max-h-56 w-auto rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <p className="text-sm text-zinc-600">Tarik dan lepas gambar di sini, atau klik untuk unggah</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
      />

      {loading ? <p className="text-sm text-zinc-600">Sedang mengunggah gambar sampul...</p> : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
