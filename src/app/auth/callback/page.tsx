// src\app\auth\callback\page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Get user error:", error.message);
      setUser(data.user);
    };
    fetchUser();
  }, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-2xl mb-4">ログインしました</h1>
          <p className="mb-4">email : {user.email}</p>
          <div className="flex space-x-6">            
            <button
              onClick={() => router.push("/")}
              className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/upload")}
              className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
            >
              投稿ページ
            </button>
          </div>
        </>
      ) : (
        <p>ログイン情報を確認中...</p>
      )}
    </div>
  );
}
