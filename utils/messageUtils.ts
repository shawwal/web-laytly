// utils/messageUtils.ts

// Check if the message is an image or video based on the pattern
export function checkMediaMessage(message: string): string {
  // Check for the Image or Video patterns
  const imagePattern = /^\[Image: .*\]$/i;  // Matches "[Image: ...]"
  const videoPattern = /^\[Video: .*\]$/i;  // Matches "[Video: ...]"

  // If the message is an image URL
  if (imagePattern.test(message)) {
    return "📷 Image is being sent";
  }

  // If the message is a video URL
  if (videoPattern.test(message)) {
    return "📹 Video is being sent";
  }

  // Return the original message if it's not an image or video
  return message;
}
