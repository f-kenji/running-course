// app/page.tsx
'use client';
import Link from "next/link";
import { getCourses } from '@/lib/supabase/courses'
import { PlusIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import type { CourseRow } from '@/types/course.type';

// ----------------------------------------
// CSS 
// ----------------------------------------
const linkStyle = "ml-4 bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-800 transition"

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  // ----------------------------------------
  // useEffect - コースの取得
  // ----------------------------------------
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await getCourses(10);
      if (error) {
        setError(error);
      } else {
        setCourses(data ?? []);
      }
    };

    fetchCourses();
  }, []);
  if (error) {
    return <p className="text-red-500">データ取得エラー: {error}</p>;
  }
  if (!courses || courses.length === 0) {
    return <p>コースが登録されていません。</p>;
  }
  //-----------------------------------------------
  // eventHandler - 投稿ボタン「＋」
  //-----------------------------------------------
  const handleClick = () => {
    if (user) {
      router.push('/upload'); // 投稿ページ
    } else {
      router.push('/loginGoogle'); // ログインページ（Google認証）
    }
  };
  // ----------------------------------------
  // JSX 
  // ----------------------------------------
  return (
    <main className="p-8 text-center ">
      <h1 className="text-2xl font-bold mb-4">ランニングコース共有アプリ</h1>
      <div className="space-x-2 space-y-2">
        <Link
          href="/map"
          className={linkStyle}
        >
          地図ページへ
        </Link>
        <Link
          href="/courses"
          className={linkStyle}
        >
          コース一覧
        </Link>
        <h2 className="text-1xl font-bold mt-8">最新の投稿</h2>
        {courses.map(course => (
          <div
            key={course.id}
            className="shadow-[0_1px_5px_rgba(0,0,0,0.25)] rounded-lg p-4 hover:shadow transition mt-4">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            {course.distance && (
              <p className="mt-2 text-sm text-gray-500">
                距離: {course.distance} km
              </p>
            )}
          </div>
        ))}
      </div>
      <button className="fixed bottom-4 right-4 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition">
        <PlusIcon
          className="w-6 h-6"
          onClick={handleClick} />
      </button>
    </main>
  );
}