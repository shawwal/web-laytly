export function excludeOnlineFriends(onlineFriends: string[], friendId: any): string[] {
  const index = onlineFriends.indexOf(friendId);
  if (index !== -1) {
    onlineFriends.splice(index, 1); // Remove the friend ID from the array
    // console.log(`Friend with ID ${friendId} has been removed.`);
  } else {
    // console.log(`Friend with ID ${friendId} not found.`);
  }

  // Return the updated onlineFriends array, or an empty array if no friends remain
  return onlineFriends.length > 0 ? onlineFriends : [];
}
