export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: number;
          title: string;
          prefecture: string;
          city: string;
          distance: number| null;
          time: string| null;
          description: string | null;
          image_url: string | null;
          gpx_url: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          prefecture: string;
          city: string;
          distance: number| null;
          time: string| null;
          description?: string | null;
          image_url?: string | null;
          gpx_url?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };

      course_points: {
        Row: {
          id: number;
          course_id: number;
          lat: number;
          lon: number;
          elevation: number | null;
          order: number;
        };
        Insert: {
          id?: number;
          course_id: number;
          lat: number;
          lon: number;
          elevation?: number | null;
          order: number;
        };
        Update: Partial<Database["public"]["Tables"]["course_points"]["Insert"]>;
      };
    };
  };
};
