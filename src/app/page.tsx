// app/page.tsx
'use client';
import React from "react";
import Link from "next/link";
import { getCourses } from '@/lib/supabase/courses'
import { PlusIcon } from '@heroicons/react/24/solid';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import type { CourseRow } from '@/types/course.type';
import DynamicMap from "@/app/components/features/dynamicMap";
import Loading from "./loading";
import courseAttributes from "@/app/data/courseAttributes.json";
const attributeKeys = Object.keys(courseAttributes);

// ----------------------------------------
// CSS 
// ----------------------------------------
// const linkStyle = "bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-800 transition"
const attStyle = "rounded-xl text-gray-800  border border-rose-400 bg-rose-200 p-1"

export default function Home() {
  // ----------------------------------------
  // initialize (course があれば既存データを反映)
  // ----------------------------------------
  const { user } = useUser();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← ローディング状態追加 
  // ----------------------------------------
  // useEffect - コースの取得
  // ----------------------------------------
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await getCourses(10);
        if (error) {
          setError(error);
        } else {
          setCourses(data ?? []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p className="text-red-500">データ取得エラー: {error}</p>;
  }
  if (!courses || courses.length === 0) {
    return <p>コースが登録されていません。</p>;
  }

  return (
    <main className="p-6 text-center ">
      {/* <h1 className="text-2xl font-bold mb-4">ランニングコース共有アプリ</h1> */}
      <div className="space-x-2 space-y-2">
        <button className="fixed bottom-4 right-4 bg-rose-500 text-white p-4 rounded-full
         shadow-lg hover:bg-rose-600 transition z-[9999]">
          <PlusIcon
            className="w-6 h-6"
            onClick={handleClick} />
        </button>
        {/* <Link
          href="/courses"
          className={linkStyle}
        >
          コース一覧
        </Link> */}
        <h2 className="text-1xl font-bold mt-2">最新の投稿</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
          {courses.map(course => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div
                key={course.id}
                className="shadow-[0_1px_5px_rgba(0,0,0,0.25)] rounded-4xl p-3 hover:shadow transition
                flex flex-col h-110">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-center flex-1">
                    {course.title}
                  </h2>
                  {course.distance && (
                    <p className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                      距離: {course.distance} km
                    </p>
                  )}
                </div>
                <DynamicMap url={course.gpx_url ?? ""} />
                <p className="text-gray-600 line-clamp-2">{course.description}</p>
                {/* コース属性 */}
                <div className='flex text-[12px] font-medium gap-2 max-w-[400px] flex-wrap py-1'>
                  {attributeKeys.map((key) => {
                    const value = (course.attributes as Record<string, string | undefined>)?.[key];
                    return (
                      value && (
                        <p key={key} className={attStyle}>
                          {value}
                        </p>
                      )
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}