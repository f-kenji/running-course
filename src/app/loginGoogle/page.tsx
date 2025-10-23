// src\app\loginGoogle\page.tsx
"use client";
import { supabase } from "@/lib/supabase/client";

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: `${window.location.origin}/auth/callback`, // ←リダイレクト先
        redirectTo: `http://localhost:4000/auth/callback`, // ←リダイレクト先
      },
    });
    if (error) console.error("Login error:", error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl mb-4">ログイン</h2>
      <div className="text-base mb-2">ソーシャルログインで登録</div>
      <button
        onClick={handleGoogleLogin}
        className="bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition"
      >
        Googleでログイン
      </button>
    </div>
  );
}
