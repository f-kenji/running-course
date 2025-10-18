// app/courses/page.tsx
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'
import Link from 'next/link'

type Course = Database['public']['Tables']['courses']['Row']

export default async function CoursesPage() {
    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) {
        console.error(error)
        return <p className="text-red-500">データ取得エラー: {error.message}</p>
    }

    if (!courses || courses.length === 0) {

        return <p>コースが登録されていません。</p>
    }

    // console.log(courses)

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">🏃‍♂️ ランニングコース一覧</h1>
            {courses.map((course: Course) => (
                <div
                    key={course.id}
                    className="border rounded-lg p-4 hover:shadow transition"
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
