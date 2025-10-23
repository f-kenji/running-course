import { supabase } from "@/lib/supabase/client";
import { CourseInsert, CourseRow } from "@/types/course.type";

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