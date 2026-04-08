'use client';

import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/admin/LogoutButton';

function getTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dasbor';
  if (pathname.startsWith('/admin/posts/edit')) return 'Ubah Artikel';
  if (pathname.startsWith('/admin/posts/create')) return 'Buat Artikel';
  if (pathname.startsWith('/admin/posts')) return 'Artikel';
  if (pathname.startsWith('/admin/categories')) return 'Kategori';
  return 'Admin';
}

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <h1 className="font-heading text-lg font-semibold text-zinc-900">{getTitle(pathname)}</h1>
      <LogoutButton
        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
      />
    </header>
  );
}
