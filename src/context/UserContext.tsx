// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserProfile } from '@/lib/supabase/user';

type UserProfile = {
  id: string;
  email?: string | null;
  display_name: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetch: async () => { }
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); //初期ロードは true

  const loadUser = async () => {
    try {
      setLoading(true);

      // NextAuth のセッションを取得
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user) {
        // NextAuth のセッションからユーザーIDを取得して、
        // Supabase の users テーブルからプロフィールを取得
        const { data: profile } = await fetchUserProfile(session.user.id);

        setUser({
          id: session.user.id,
          email: session.user.email,
          display_name: profile?.display_name ?? null,
          avatar_url: profile?.avatar_url ?? session.user.image ?? null,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // セッション変更を監視 (オプション: ページフォーカス時に再取得)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refetch: loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);