'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      router.replace('/');
      return;
    }

    const params = new URLSearchParams(hash.substring(1)); // '#'を除去してパース
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => {
          // ✅ セッションセット後、トップページへ
          router.replace('/');
        });
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>ログイン処理中...</p>
    </div>
  );
}
