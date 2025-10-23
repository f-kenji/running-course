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
};

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

export type CourseRow = Database['public']['Tables']['courses']['Row']