import { supabase } from '@/lib/supabase'; // Assuming you have a Supabase client setup

export const updateBannerUrlInProfile = async (userId: string, newBannerUrl: string) => {
  const { data, error } = await supabase
    .from('profiles')  // Table name
    .update({ banner_url: newBannerUrl })
    .eq('id', userId)  // Update the record for the specific user
    .select('banner_url');  // Optionally return the updated data

  if (error) {
    console.error('Error updating banner URL: ', error);
    return null;
  }

  return data;  // Return updated profile data (including banner_url)
};
