'use client';

import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type MultiImageUploadProps = {
  disabled?: boolean;
  initialUrls?: string[];
  onUpload: (urls: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
};

const MAX_IMAGE_COUNT = 3;

export function MultiImageUpload({
  disabled,
  initialUrls,
  onUpload,
  onUploadingChange,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialUrls ?? []);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled || loading) {
      return;
    }

    setErrorMessage('');

    if (images.length + files.length > MAX_IMAGE_COUNT) {
      setErrorMessage('Maksimal 3 gambar.');
      return;
    }

    setLoading(true);
    onUploadingChange?.(true);

    const uploadedUrls: string[] = [];
    const supabase = getSupabaseBrowserClient();

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Sebagian file bukan image dan dilewati.');
        continue;
      }

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });

        const fileName = `${Date.now()}-${compressed.name.replace(/\s+/g, '-')}`;
        const { error } = await supabase.storage
          .from('post-images')
          .upload(fileName, compressed, { cacheControl: '3600', upsert: false });

        if (error) {
          setErrorMessage('Sebagian image gagal di-upload.');
          continue;
        }

        const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      } catch {
        setErrorMessage('Gagal compress/upload sebagian image.');
      }
    }

    const merged = [...images, ...uploadedUrls].slice(0, MAX_IMAGE_COUNT);
    setImages(merged);
    onUpload(merged);

    setLoading(false);
    onUploadingChange?.(false);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-sm text-zinc-600"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        Tarik dan lepas gambar (maksimal 3), atau klik untuk unggah
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled || loading}
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url) => (
            <div key={url} className="overflow-hidden rounded-lg border border-zinc-200">
              <Image
                src={url}
                alt="Gambar terunggah"
                width={400}
                height={400}
                className="h-24 w-full object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}

      {loading ? <p className="text-sm text-zinc-600">Mengompres dan mengunggah...</p> : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
