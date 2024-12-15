import { supabase } from "@/lib/supabase";

export const deleteAvatar = async (avatarUrl: string | null): Promise<void> => {
  if (!avatarUrl) return;

  // Extract the file path from the URL, starting from "author/" (no need for "avatars/")
  const regex = /\/storage\/v1\/object\/public\/(.+)/;
  const match = avatarUrl.match(regex);

  if (!match) {
    console.log("Invalid avatar URL");
    return;
  }

  // Extract only the part starting from "author/" onwards
  const filePath = match[1].replace(/^avatars\//, ""); // Remove the "avatars/" part from the path
  console.log("File path to delete:", filePath);

  try {
    // Attempt to delete the avatar from Supabase Storage
    const { error } = await supabase.storage.from('avatars').remove([filePath]);

    if (error) {
      console.error('Error deleting old avatar:', error.message);
      return;
    }

    console.log(`Avatar deleted successfully: ${filePath}`);
    // No need to return data, just log the success
  } catch (err) {
    console.error('Error deleting avatar:', err);
    // Even if deletion fails, continue with the upload
  }
};
