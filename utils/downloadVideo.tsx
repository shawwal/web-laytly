import { supabase } from '@/lib/supabase'; // Import Supabase client for web

export const downloadVideo = async (path: string): Promise<string | null> => {
  try {
    // Log the path to debug
    // console.log('Requested path:', path);

    // Generate a signed URL for the video (valid for 24 hours)
    const { data, error: urlError } = await supabase
      .storage
      .from('shared_files')
      .createSignedUrl(path, 86400); // URL valid for 24 hours (86400 seconds)

    if (urlError) {
      // console.error('Error generating signed URL:', urlError.message); // Log error message
      throw urlError; // Rethrow the error to handle it
    }

    if (!data?.signedUrl) {
      throw new Error('Signed URL not available');
    }

    console.log('Signed URL:', data.signedUrl); // Log the signed URL for debugging

    return data.signedUrl; // Return the signed URL to be used in the video tag
  } catch {
    // Log the error
    // console.error('Error in downloadVideo function:', error instanceof Error ? error.message : error);
    return null;
  }
};
