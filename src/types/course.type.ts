import { Database } from '@/types/database.types';

export type CourseAttributes = {
  time?: string;
  terrain?: string;
  surface?: string;
  traffic?: string;
  lighting?: string;
  signal?: string;
  shade?: string;
  rain?: string;
  scenery?: string;
};

export type CourseInsert = {
  title: string;
  description: string;
  prefecture: string;
  city: string;
  distance: number;
  gpx_path: string;
  gpx_url: string;
  image_url?: string;
  attributes?: Record<string, string>;
  user_id?: string | null;
};

// CourseRow の型定義
export type CourseRow = Omit<Database['public']['Tables']['courses']['Row'], 'attributes'> & {
  attributes: CourseAttributes;
};