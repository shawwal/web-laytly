import { supabase } from '@/lib/supabase'; // Adjust the path as necessary

export const downloadImage = async (path: string): Promise<string | null> => {
  try {
    // Generate a signed URL for the image
    const { data, error } = await supabase
      .storage
      .from('shared_files')
      .createSignedUrl(path, 86400); // URL valid for 24 hours (86400 seconds)

    if (error) {
      throw error;
    }

    // Return the signed URL instead of converting to Base64
    return data?.signedUrl || null;
  } catch (error) {
    if (error instanceof Error) {
      // Handle error
      // console.error('Error downloading image: ', error.message);
    }
    return null;
  }
};
