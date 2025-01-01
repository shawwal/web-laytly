import { supabase } from '@/lib/supabase';

const fetchThumbnails = async (chatId: string) => {
  const { data, error } = await supabase.storage
    .from('shared_files')
    .list(`${chatId}/thumbnails`, { limit: 100 }); // Adjust limit as needed

  if (error) {
    console.error('Error fetching thumbnails:', error);
    return [];
  }

  // Filter out the .emptyFolderPlaceholder before proceeding
  const filteredData = data?.filter(file => file.name !== '.emptyFolderPlaceholder') || [];

  const filesWithUrls = await Promise.all(
    filteredData.map(async (file) => {
      // Generate signed URL for each thumbnail file
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('shared_files')
        .createSignedUrl(`${chatId}/thumbnails/${file.name}`, 60 * 60); // URL valid for 1 hour

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        return null;
      }

      return {
        id: file.name,
        image: signedUrlData.signedUrl, // Use the signed URL for the image
      };
    }) || []
  );

  // Filter out any null results in case of errors
  const validFiles = filesWithUrls.filter(file => file !== null);

  // Sort the files by the numeric timestamp in the file name
  const sortedFiles = validFiles.sort((a: any, b: any) => {
    const aTimestamp = parseInt(a.id.match(/\d+/)[0]);
    const bTimestamp = parseInt(b.id.match(/\d+/)[0]);
    return bTimestamp - aTimestamp; // Sort by timestamp, newest first
  });

  return sortedFiles;
};


export default fetchThumbnails;
