// app/page.tsx
import Link from "next/link";

// ----------------------------------------
// CSS 
// ----------------------------------------
const linkStyle = "bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-800 transition"

export default function Home() {
  
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">ランニングコース共有アプリ</h1>
      <div className="space-x-2">
        <Link
          href="/map"
          className={linkStyle}
        >
          地図ページへ
        </Link>
        <Link
          href="/upload"
          className={linkStyle}
        >
          投稿ページへ
        </Link>
        <Link
          href="/courses"
          className={linkStyle}
        >
          コース一覧
        </Link>
                <Link
          href="/google"
          className={linkStyle}
        >
          ログイン
        </Link>
      </div>
    </main>
  );
}