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
  loading: boolean;
};

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); //初期ロードは true

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); //ブラウザ Cookie から取得
        if (user) {
          const { data: profile } = await fetchUserProfile(user.id);
          setUser({
            id: user.id,
            email: user.email,
            display_name: profile?.display_name ?? null,
          });
        } else {
          setUser(null); // ログインしていない場合
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null); // エラー時も null
      } finally {
        setLoading(false); // loading を false にする
      }
    };

    loadUser();

    // Supabase のセッション変更を監視
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

    return () => subscription?.unsubscribe();
  }, []);

  return (
    // loading フラグは正しく状態を渡す
    <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
