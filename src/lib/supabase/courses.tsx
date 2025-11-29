import { CourseInsert, CourseRow } from "@/types/course.type";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost4000';

//-----------------------------------------------
// function - コース投稿
//-----------------------------------------------
export async function insertCourse(
  course: CourseInsert
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error inserting course:', error.error);
      return { data: null, error: error.error };
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Error inserting course:', err.message);
    return { data: null, error: err.message };
  }
}

//-----------------------------------------------
// function - コース更新
//-----------------------------------------------
export async function updateCourse(
  id: number,
  course: Partial<CourseInsert>
): Promise<{ data: CourseRow | null; error: string | null }> {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating course:', error.error);
      return { data: null, error: error.error };
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Error updating course:', err.message);
    return { data: null, error: err.message };
  }
}

//-----------------------------------------------
// function - コース取得（READ は RLS 不要なのでそのまま）
//-----------------------------------------------
export async function getCourses(
  limit = 10
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  try {
    const response = await fetch(`${baseUrl}/api/courses?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error };
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Error fetching courses:', err.message);
    return { data: null, error: err.message };
  }
}

//-----------------------------------------------
// function - 特定のコース取得
//-----------------------------------------------
export async function fetchCourse(
  id: number
): Promise<{ data: CourseRow | null; error: string | null }> {
  try {
    const response = await fetch(`/api/courses/${id}`);

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error };
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Error fetching course:', err.message);
    return { data: null, error: err.message };
  }
}

//-----------------------------------------------
// function - コース削除
//-----------------------------------------------
export async function deleteCourse(
  id: number
): Promise<{ data: CourseRow[] | null; error: string | null }> {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting course:', error.error);
      return { data: null, error: error.error };
    }

    const result = await response.json();
    return { data: result.data || null, error: null };
  } catch (err: any) {
    console.error('Error deleting course:', err.message);
    return { data: null, error: err.message };
  }
}