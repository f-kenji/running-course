"use client";
import { supabase } from "@/utils/supabaseClient";

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // ←リダイレクト先
      },
    });
    if (error) console.error("Login error:", error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Googleでログイン</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
      >
        Googleでログイン
      </button>
    </div>
  );
}
