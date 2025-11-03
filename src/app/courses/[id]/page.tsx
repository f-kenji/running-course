'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicMap from "@/app/components/features/dynamicMap";
import { deleteCourse, fetchCourse } from '@/lib/supabase/courses';
import type { CourseRow } from '@/types/course.type';
import { formatDate } from '@/lib/utils/date';
import { useUser } from '@/context/UserContext';
import Button from "@/app/components/ui/Button";
import courseAttributes from "@/app/data/courseAttributes.json";
const attributeKeys = Object.keys(courseAttributes);

// ----------------------------------------
// CSS 
// ----------------------------------------
const attStyle = "rounded-xl text-gray-800  border border-rose-400 bg-rose-200 p-1"

export default function CourseDetail() {
  const { user } = useUser() ?? { user: null }; // fallback
  const router = useRouter();

  const params = useParams(); // { id: string | undefined }
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ----------------------------------------
  // useEffect - 初期化、コース取得
  // ----------------------------------------
  useEffect(() => {
    const loadCourse = async () => {
      if (!params?.id) {
        setError("コースIDが指定されていません");
        setLoading(false);
        return;
      }
      const courseId = Number(params.id);
      if (isNaN(courseId)) {
        setError("コースIDが不正です");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await fetchCourse(courseId);
      if (error) {
        console.error(error);
        setError(error);
      } else {
        setCourse(data);
      }
      setLoading(false);
    };
    loadCourse();
  }, [params?.id]);

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p>エラー: {error}</p>;
  if (!course) return <p>コースが見つかりません</p>;
  // ----------------------------------------
  // eventhandler - 編集
  // ----------------------------------------
  const handleEdit = () => {
    router.push(`/courses/${course.id}/edit`);
  };
  // ----------------------------------------
  // eventhandler - 削除
  // ----------------------------------------
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;

    try {
      const { data, error } = await deleteCourse(Number(params.id));
      if (error) {
        alert('削除に失敗しました: ' + error);
        return;
      }
      alert('削除しました');
      router.push(`/`);
    } catch (err: any) {
      console.error(err);
      alert('予期せぬエラーが発生しました');
    }
  };
  // ----------------------------------------
  // JSX 
  // ----------------------------------------
  // console.log("user", user);
  return (
    <div className="max-w-4xl m-auto px-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <div className='text-xl '>
        <p><span className='text-base'>エリア：</span>{`${course.prefecture} ${course.city}`}</p>
      </div>
      {course.gpx_url && <DynamicMap url={course.gpx_url} />}
      {course.distance && <p className="text-xl">距離: {course.distance} km</p>}
      <p className="mt-1 px-2">{course.description}</p>
      {/* コース属性 */}
      <div className='flex text-[12px] font-medium gap-2 max-w-[400px] flex-wrap py-2'>
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
      {/* <p className="text-sm text-gray-500">
        作成者ID:
        {user?.display_name
          ? user.display_name
          : course.user_id
            ? `ゲスト****${course.user_id.slice(-8)}`
            : 'ゲスト'}</p> */}
      <p className="text-sm text-gray-500">
        作成者:
        {user?.display_name
          ? `${user.display_name}（ID: ****${course.user_id?.slice(-6) ?? '不明'}）`
          : course.user_id
            ? `ゲスト（ID: ****${course.user_id.slice(-6)}）`
            : 'ゲスト（ID: 未登録）'}
      </p>
      <p className="text-sm text-gray-500">更新日:{formatDate(course.updated_at)}</p>
      {/* 詳細ページが該当のユーザーの場合、編集可能 */}
      {user?.id === course.user_id && (
        <div className="flex gap-2 mt-2">
          <Button
            className="px-2 py-1 rounded"
            variant="primary"
            onClick={handleEdit}
          >
            編集
          </Button>
          <Button
            className="px-2 py-1 rounded"
            variant="tertiary"
            onClick={handleDelete}
          >
            削除
          </Button>
        </div>
      )}
    </div>
  );
}
