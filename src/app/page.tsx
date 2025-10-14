// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">ランニングコース共有アプリ</h1>
      <div className="space-x-2">
        <Link
          href="/map"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          地図ページへ
        </Link>
        <Link
          href="/upload"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          投稿ページへ
        </Link>

      </div>
    </main>
  );
}
