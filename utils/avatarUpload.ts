import ImageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';

// Compress the image before upload
export const compressImage = async (file: File) => {
  const options = {
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };
  try {
    const compressedFile = await ImageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Error compressing image.');
  }
};

// Delete the previous avatar if it exists
export const deletePreviousAvatar = async (avatarUrl: string | null) => {
  if (!avatarUrl) return;

  const previousFileName = avatarUrl.split('/').pop()?.split('?')[0];
  if (!previousFileName) return;

  const { data, error } = await supabase.storage.from('avatars').remove([previousFileName]);
  if (error) {
    console.error('Error deleting old avatar:', error.message);
    throw new Error('Error deleting old avatar.');
  }

  return data;
};

// Upload the image to Supabase Storage
export const uploadImageToSupabase = async (file: File, userId: string) => {
  const fileExtension = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error.message);
    throw new Error('Error uploading image.');
  }

  return data;
};

// Update the user's avatar URL in metadata
export const updateUserAvatar = async (avatarUrl: string) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      avatar_url: avatarUrl,
    },
  });

  if (error) {
    console.error('Error updating user metadata:', error.message);
    throw new Error('Error updating user metadata.');
  }
};
