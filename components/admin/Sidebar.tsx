'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/admin/LogoutButton';

const menus = [
  { href: '/admin', label: 'Dasbor' },
  { href: '/admin/posts', label: 'Artikel' },
  { href: '/admin/categories', label: 'Kategori' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-6 py-5">
        <p className="font-heading text-lg font-semibold text-zinc-900">Sapamedia Admin</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menus.map((menu) => {
          const isActive =
            menu.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <LogoutButton className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100" />
      </div>
    </aside>
  );
}
