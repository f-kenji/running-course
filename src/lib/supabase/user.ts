import { supabase } from "@/lib/supabase/client";
import { UserProfileRow } from "@/types/user.type";


export const fetchUserProfile = async (
  userId: string
): Promise<{ data: UserProfileRow | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
