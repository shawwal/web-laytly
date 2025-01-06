import { supabase } from '@/lib/supabase';

export const createChatFolder = async (chatId: string): Promise<boolean> => {
  const path = `${chatId}/.placeholder`;

  try {
    // Check if the folder exists by listing files in the folder
    const { data, error: listError } = await supabase.storage
      .from('shared_files')
      .list(chatId, { limit: 1 });

    if (listError) {
      return false;
    }

    // If there's any file in the folder, it means the folder already exists
    if (data && data.length > 0) {
      return true;
    }

    // Folder does not exist, create it
    const content = new ArrayBuffer(0); // Empty ArrayBuffer
    const contentType = 'application/octet-stream'; // Placeholder content type

    const { error: uploadError } = await supabase.storage
      .from('shared_files')
      .upload(path, content, { contentType });

    if (uploadError) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

