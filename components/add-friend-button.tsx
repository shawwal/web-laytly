import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';  // Adjust this to your Supabase setup
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';// Import the 'UserPlus' icon from lucide-react
import { Search } from 'lucide-react';

interface AddFriendButtonProps {
  session: Session;
  fetchFriendsList?: () => void;
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({ session, fetchFriendsList }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [friendEmailOrUsername, setFriendEmailOrUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const addFriend = async () => {
    if (!session) return;

    let friend;
    // Try finding friend by username
    const { data: friendByUsername, error: usernameError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', friendEmailOrUsername)
      .single();

    // If not found by username, try finding by email
    if (usernameError || !friendByUsername) {
      const { data: friendByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', friendEmailOrUsername)
        .single();
      friend = friendByEmail;

      if (emailError || !friendByEmail) {
        setErrorMessage('Friend not found');
        return;
      }
    } else {
      friend = friendByUsername;
    }

    const { error } = await supabase
      .from('friends')
      .insert([{ user_id: session.user.id, friend_id: friend.id }]);

    if (error) {
      setErrorMessage('Failed to add friend');
    } else {
      setFriendEmailOrUsername('');
      if (fetchFriendsList) {
        fetchFriendsList();
      }
      setModalVisible(false);
      setErrorMessage('');
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  return (
    <div className="relative">
      {/* Add Friend Button */}
      <Button onClick={handleOpenModal} variant="ghost" size="icon">
        <Search className="h-5 w-5" />
      </Button>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Friend</h2>
            <input
              type="text"
              placeholder="Enter friend's username or email"
              value={friendEmailOrUsername}
              onChange={(e) => setFriendEmailOrUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Error message */}
            {errorMessage && (
              <div className="text-red-600 text-sm mb-4">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={addFriend}
                className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Add Friend
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="w-1/2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFriendButton;
