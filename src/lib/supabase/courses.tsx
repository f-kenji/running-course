import { supabase } from "@/lib/supabase/client";
import { CourseInsert, CourseRow } from "@/types/course.type";
import { deleteGpxFile } from "./gpxStorage";

//-----------------------------------------------
// function - コース投稿
//-----------------------------------------------
export async function insertCourse(
  course: CourseInsert
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .insert([course])
    .select();
  if (error) {
    console.error('Error inserting course:', error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
//-----------------------------------------------
// function - コース更新
//-----------------------------------------------
export async function updateCourse(
  id: number,
  course: Partial<CourseInsert> // ← 更新なので Partial にして柔軟に
): Promise<{ data: CourseRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .update(course)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Error updating course:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
//-----------------------------------------------
// function - コース取得
//-----------------------------------------------
export async function getCourses(
  limit = 10
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching courses:', error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

//-----------------------------------------------
// function - 特定のコース取得
//-----------------------------------------------
export async function fetchCourse(
  id: number
): Promise<{ data: CourseRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error('Error fetching course:', error.message);
    return { data: null, error: error.message };
  }
  if (data) {
    // attributes を Record<string,string> に変換
    const courseData = {
      ...data,
      attributes: data.attributes as Record<string, string>,
    };
    return { data: courseData, error: null };
  }

  return { data: null, error: null };
}
//-----------------------------------------------
// function - コース削除
//-----------------------------------------------
export async function deleteCourse(
  id: number,
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  try {
    // まず削除対象を取得して GPX パスを確認
    const { data: existing, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id);

    if (fetchError) {
      console.error('Error fetching course before delete:', fetchError.message);
      return { data: null, error: fetchError.message };
    }

    // GPX ファイル削除
    if (existing && existing.length > 0 && existing[0].gpx_path) {
      await deleteGpxFile(existing[0].gpx_path);
    }

    // コース削除
    const { data, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select(); // 削除後のデータ返却

    if (error) {
      console.error('Error deleting course:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error deleting course:', err);
    return { data: null, error: err.message };
  }
}

