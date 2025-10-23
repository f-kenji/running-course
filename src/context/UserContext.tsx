// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/lib/supabase/user';

type UserProfile = {
  id: string;
  email?: string | null;
  display_name: string | null;
};

type UserContextType = {
  user: UserProfile | null;
};

const UserContext = createContext<UserContextType>({ user: null });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  // ----------------------------------------
  // useEffect - 初期化
  // ----------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await fetchUserProfile(user.id);
        setUser({
          id: user.id,
          email: user.email,
          display_name: profile?.display_name ?? null,
        });
      } else {
        setUser(null);
      }
    };

    loadUser();

    //　ユーザーの認証状態（ログイン・ログアウトなど）を監視、
    // Supabase のセッションが変化したときに呼ばれる
    const { data: subscription }: any = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // ログイン状態になったらユーザープロフィールを取得してContextに保存
        const { data: profile } = await fetchUserProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          display_name: profile?.display_name ?? null,
        });
      } else {
        // ログアウト時はユーザー情報をクリア
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
