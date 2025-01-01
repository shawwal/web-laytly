import { supabase } from '@/lib/supabase';

// export const fetchAlbumImages = async (albumId: string) => {
//   try {
//     const { data, error } = await supabase
//       .from('album_items')
//       .select('id, file_path, file_type, created_at')
//       .eq('album_id', albumId)
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching album images:', error.message);
//       return [];
//     }

//     return data;
//   } catch (error) {
//     console.error('Error during album image fetching:', error);
//     return [];
//   }
// };

// albumUtils.ts
export const fetchAlbumImages = async (albumId: string) => {
  try {
    const { data, error } = await supabase
      .from('album_items')
      .select('id, file_path, file_type, created_at')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching album images:', error.message);
      return [];
    }

    // Generate signed URLs for images
    const imagesWithUrls = await Promise.all(
      data.map(async (item) => {
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('shared_files')
          .createSignedUrl(item.file_path, 60 * 60); // URL valid for 1 hour

        if (urlError) {
          console.error('Error creating signed URL:', urlError);

          // Remove item from the database if URL creation fails
          try {
            await supabase
              .from('album_items')
              .delete()
              .eq('id', item.id);

            console.log(`Item with ID ${item.id} deleted from DB due to thumbnail URL error.`);
          } catch (deleteError) {
            console.error(`Error deleting item ${item.id} from DB:`, deleteError.message);
          }

          return null;
        }

        return {
          ...item,
          file_path: signedUrlData.signedUrl,
        };
      })
    );

    return imagesWithUrls.filter((item) => item !== null);
  } catch (error) {
    console.error('Error during album image fetching:', error);
    return [];
  }
};


// Function to delete an image from the album
export const deleteAlbumImage = async (imageId: string) => {
  try {
    // First, get the album_id and file_path of the image being deleted
    const { data: imageData, error: imageError } = await supabase
      .from('album_items')
      .select('album_id, file_path')
      .eq('id', imageId)
      .single();

    if (imageError) {
      console.error('Error fetching image details:', imageError.message);
      return { success: false, message: imageError.message };
    }

    const albumId = imageData.album_id;
    const imageFilePath = imageData.file_path;

    // Delete the image from album_items
    const { error: deleteError } = await supabase
      .from('album_items')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Error deleting image from album:', deleteError.message);
      return { success: false, message: deleteError.message };
    }

    // Check if the deleted image was the album cover
    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .select('cover_image')
      .eq('id', albumId)
      .single();

    if (albumError) {
      console.error('Error fetching album details:', albumError.message);
      return { success: false, message: albumError.message };
    }

    if (albumData.cover_image === imageFilePath) {
      // The deleted image was the cover image, need to update the cover image
      // Get the latest image in the album
      const { data: latestImageData, error: latestImageError } = await supabase
        .from('album_items')
        .select('file_path')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestImageError && latestImageError.code !== 'PGRST116') {
        // 'PGRST116' means no rows found, which is acceptable if the album is now empty
        console.error('Error fetching latest album image:', latestImageError.message);
        return { success: false, message: latestImageError.message };
      }

      const newCoverImage = latestImageData ? latestImageData.file_path : null;

      // Update the album's cover_image
      const { error: updateAlbumError } = await supabase
        .from('albums')
        .update({ cover_image: newCoverImage })
        .eq('id', albumId);

      if (updateAlbumError) {
        console.error('Error updating album cover image:', updateAlbumError.message);
        return { success: false, message: updateAlbumError.message };
      }
    }

    return { success: true, message: 'Image deleted successfully.' };
  } catch (error) {
    console.error('Error during image deletion:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
};
