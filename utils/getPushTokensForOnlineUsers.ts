// utils/getPushTokensForOnlineUsers.ts

import { supabase } from "@/lib/supabase";  // Adjust import path as needed

/**
 * Gets Expo Push Tokens for a list of online users, excluding the current user.
 * 
 * @param onlineUserIds - Array of online user IDs to fetch push tokens for
 * @param currentUserId - The ID of the current user (this user will be excluded)
 * @returns An array of Expo Push Tokens for the online users
 */
export const getPushTokensForOnlineUsers = async (
  onlineUserIds: string[],
  currentUserId: string
): Promise<string[]> => {
  const tokens: string[] = [];

  // Loop over the online user IDs and fetch their Expo Push Tokens
  for (const userId of onlineUserIds) {
    // Skip the current user
    if (userId === currentUserId) continue;

    try {
      // Query the user's profile to get the Expo Push Token
      const { data: userProfile, error } = await supabase
        .from("profiles")  // Adjust if your Supabase table name is different
        .select("expo_push_token")
        .eq("id", userId)
        .single();

      if (error || !userProfile?.expo_push_token) {
        console.error(`Error fetching Expo token for user ${userId}:`, error);
        continue;
      }

      // Add the Expo Push Token to the tokens array
      tokens.push(userProfile.expo_push_token);
    } catch (error) {
      console.error(`Error fetching user profile for user ${userId}:`, error);
    }
  }

  return tokens;
};
