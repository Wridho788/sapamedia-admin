'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function LogoutButton({
  className,
  label = 'Keluar',
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}
