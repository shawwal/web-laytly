export const getFileNameFromString = (input: any): any | null => {
  const regex = /[^\/\]]+\.(jpeg|jpg|png|gif|mp4|mov|webp)/; // Match common image/video file extensions
  const match = input.match(regex);

  if (match) {
    let fileName = match[0];
    
    // Check if the file is a video format and replace the extension with .jpeg
    if (/\.(mp4|mov)$/.test(fileName)) {
      fileName = fileName.replace(/\.(mp4|mov)$/, '.jpeg');
    }
    
    return fileName;
  }

  return null; // Return null if no match found
};
