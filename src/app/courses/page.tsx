// app/courses/page.tsx
import { getCourses } from '@/lib/supabase/courses'
import Link from 'next/link'

export default async function CoursesPage() {
    const { data: courses, error } = await getCourses(10)
    if (error) {
        return <p className="text-red-500">データ取得エラー: {error}</p>;
    }
    if (!courses || courses.length === 0) {
        return <p>コースが登録されていません。</p>;
    }
    // console.log(" coourese num :",courses.length)
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">🏃‍♂️ ランニングコース一覧</h1>
            {courses.map(course => (
                <div
                    key={course.id}
                    className="shadow-[0_1px_5px_rgba(0,0,0,0.25)] rounded-lg p-4 hover:shadow transition"
                >
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                    <p className="text-gray-600">{course.description}</p>
                    {course.distance && (
                        <p className="mt-2 text-sm text-gray-500">
                            距離: {course.distance} km
                        </p>
                    )}
                </div>
            ))}
            <Link href="/">Running Course</Link>
        </div>
    )
}
