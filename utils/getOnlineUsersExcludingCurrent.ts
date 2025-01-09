interface UserPresence {
  userId: string;
  online: boolean;
  lastSeen: string | null;
}

/**
 * Get all online user IDs excluding the current user ID.
 * 
 * @param presences - The list of user presence objects.
 * @param currentUserId - The ID of the current user to exclude.
 * @returns A list of user IDs that are online and not the current user.
 */
const getOnlineUsersExcludingCurrent = (
  presences: UserPresence[],
  currentUserId: string
): string[] => {
  return presences
    .filter((user) => user.online && user.userId !== currentUserId)  // Filter online users, excluding the current user
    .map((user) => user.userId);  // Extract the user IDs
};

export default getOnlineUsersExcludingCurrent;
