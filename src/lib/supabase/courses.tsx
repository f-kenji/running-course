import { supabase } from "@/lib/supabase/client";

export type CourseInsert = {
  title: string;
  description: string;
  prefecture: string;
  city: string;
  distance: number;
  gpx_url: string;
  image_url?: string;
  attributes?: Record<string, string>;
  user_id?: string | null;
};

export async function insertCourse(course: CourseInsert) {
  const { data, error } = await supabase
    .from("courses")
    .insert([course]);

  if (error) throw error;
  return data;
}