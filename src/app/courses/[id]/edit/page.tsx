'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UploadForm from '@/app/components/features/uploadForm';
import { supabase } from '@/lib/supabase/client';
import type { CourseRow } from '@/types/course.type';

export default function EditCoursePage() {
    const params = useParams();
    const courseId = params?.id as string;
    const [course, setCourse] = useState<CourseRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ----------------------------------------
    // useEffect - コースデータを取得
    // ----------------------------------------
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (error) throw error;
                setCourse(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourse();
    }, [courseId]);

    // ----------------------------------------
    // JSX 
    // ----------------------------------------
    if (loading) return <div className="p-8">読み込み中...</div>;
    if (error) return <div className="p-8 text-red-600">エラー: {error}</div>;
    if (!course) return <div className="p-8">データが見つかりませんでした。</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">コースを編集</h1>
            <UploadForm course={course} />
        </div>
    );
}
