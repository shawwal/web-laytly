import ImageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, // Limit the size to 1MB (you can adjust this)
    maxWidthOrHeight: 1024, // Maximum width or height
    useWebWorker: true, // Use Web Workers for compression (performance)
  };

  try {
    const compressedFile = await ImageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Image compression failed');
  }
};
