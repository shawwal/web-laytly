import { supabase } from '@/lib/supabase';

export const createAlbum = async (folderName: string, chatId: string) => {
  try {
    // Debug: Log the inputs
    console.log('Creating album with:', { folderName, chatId });
    
    const { data, error } = await supabase
      .from('albums')
      .insert([{ name: folderName, chat_id: chatId }])
      .select(); // Adding select to return the inserted data

    // Debug: Log the response from Supabase
    console.log('Supabase Response:', { data, error });

    if (error) {
      console.error('Error creating folder:', error.message);
      return null;
    }

    return data; // Should return the inserted album data
  } catch (error) {
    console.error('Error during folder creation:', error);
    return null;
  }
};
// Utility to create an album item and update the cover
// export const createAlbumItem = async (albumId: string, filePath: string, fileType: string) => {
//   try {
//     const { data: albumItem, error } = await supabase
//       .from('album_items')
//       .insert([{ album_id: albumId, file_path: filePath, file_type: fileType }]);

//     if (error) {
//       console.error('Error adding item to album:', error.message);
//       return null;
//     }

//     // Update the album cover with the latest added item
//     const { error: coverError } = await supabase
//       .from('albums')
//       .update({ cover_image: filePath })
//       .eq('id', albumId);

//     if (coverError) {
//       console.error('Error updating album cover:', coverError.message);
//     }

//     return albumItem;
//   } catch (error) {
//     console.error('Error during album item creation:', error);
//     return null;
//   }
// };

// Utility to fetch albums with album cover
export const fetchAlbums = async (chatId: string) => {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching albums:', error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error during album fetching:', error);
    return [];
  }
};


// Utility to delete an album
export const deleteAlbum = async (albumId: string) => {
  try {
    // Debug: Log the albumId to be deleted
    console.log('Attempting to delete album with ID:', albumId);

    const { data, error } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId)
      .select(); // Use .select() to return the deleted row data

    // Debug: Log the response from Supabase
    console.log('Delete Response:', { data, error });

    if (error) {
      console.error('Error deleting album:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn('No data returned after deletion. Check if the album exists.');
      return null;
    }

    return data; // Should return the deleted album data
  } catch (error) {
    console.error('Error during album deletion:', error);
    return null;
  }
};

// Utility to rename an album
export const renameAlbum = async (albumId: string, newName: string) => {
  try {
    // Debug: Log the albumId and newName
    console.log('Attempting to rename album with ID:', albumId, 'to:', newName);

    const { data, error } = await supabase
      .from('albums')
      .update({ name: newName }) // Update the name of the album
      .eq('id', albumId)
      .select(); // Use .select() to return the updated row data

    // Debug: Log the response from Supabase
    console.log('Rename Response:', { data, error });

    if (error) {
      console.error('Error renaming album:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn('No data returned after renaming. Check if the album exists.');
      return null;
    }

    return data; // Should return the renamed album data
  } catch (error) {
    console.error('Error during album renaming:', error);
    return null;
  }
};


// Utility to create an album item and update the cover
export const createAlbumItem = async (albumId: string, filePath: string, fileType: string) => {
  try {
    // Check if the item already exists
    const { data: existingItem, error: checkError } = await supabase
      .from('album_items')
      .select('id')
      .eq('album_id', albumId)
      .eq('file_path', filePath)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // 'PGRST116' is 'No rows found'
      console.error('Error checking existing item:', checkError.message);
      return { message: checkError.message, data: null };
    }

    if (existingItem) {
      // Item already exists
      console.warn('Item already exists in the album.');
      return { message: 'Item already exists in the album.', data: null };
    }

    // Proceed to insert the new item
    const { data: albumItem, error } = await supabase
      .from('album_items')
      .insert([{ album_id: albumId, file_path: filePath, file_type: fileType }]);

    if (error) {
      console.error('Error adding item to album:', error.message);
      return { message: error.message, data: null };
    }

    return { message: 'Item added successfully.', data: albumItem };
  } catch (error) {
    console.error('Error during album item creation:', error);
    return { message: 'An unexpected error occurred.', data: null };
  }
};
