import { supabase } from '@/lib/supabase'; // Assuming you have a Supabase client setup
import { compressImage } from '@/utils/compressImage';

// Function to upload the image to Supabase Storage
export const uploadImageToSupabase = async (
  file: File,
  bucket: string,
  userId: string
) => {
  try {
    // Compress the image (optional)
    const compressedFile = await compressImage(file);
    console.log('Compressed file: ', compressedFile); // Debugging line

    // Generate a unique file name using userId and timestamp
    const fileName = `${userId}-${Date.now()}.${compressedFile.name.split('.').pop()}`;
    console.log('Generated file name: ', fileName); // Debugging line

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile);
    
    // Check for errors during the upload
    if (error) {
      console.error('Upload failed with error: ', error); // Debugging line to log the error
      return null; // Return null if there is an error
    }

    // Successfully uploaded the image, return the image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/${data.path}`;
    console.log('Uploaded image URL: ', imageUrl); // Debugging line

    return imageUrl; // Return the URL of the uploaded image

  } catch (err) {
    // Catch any unexpected errors
    console.error('Unexpected error during upload: ', err);
    return null; // Return null in case of an unexpected error
  }
};


// Get the image from the bucket
export const getImageFromBucket = async (bucket: string, userId: string) => {
  const { data, error } = await supabase.storage.from(bucket).list('', {
    limit: 1,
    search: `banner-${userId}`,
  });

  if (error) {
    console.error('Error fetching old image', error);
    return null;
  }

  return data.length > 0 ? data[0] : null;
};

// Delete the image from the bucket
export const deleteImageFromBucket = async (bucket: string, file: any) => {
  const { error } = await supabase.storage.from(bucket).remove([file.name]);
  if (error) {
    console.error('Error deleting image', error);
  }
};