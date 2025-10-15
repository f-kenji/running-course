"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";


export default function AuthCallback() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Get user error:", error.message);
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/google"; // ログインページへ戻す
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-2xl mb-4">ログイン中</h1>
          <p className="mb-4">ユーザー: {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
          >
            ログアウト
          </button>
        </>
      ) : (
        <p>ログイン情報を確認中...</p>
      )}
    </div>
  );
}
