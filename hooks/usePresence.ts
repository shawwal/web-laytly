import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PresenceData {
  online: boolean;
  lastSeen: string | null;
}

interface UsePresenceProps {
  userId: string;
  channelName: string;
}

const usePresence = ({ userId, channelName }: UsePresenceProps) => {
  const [presence, setPresence] = useState<PresenceData>({ online: false, lastSeen: null });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !channelName) {
      console.warn('Supabase URL, anon key, userId, or channelName not provided.');
      return;
    }

    // Create the channel with presence tracking
    const channel = supabase.channel(channelName, {
      config: { presence: { key: userId } },
    });

    // Subscribe to the presence events
    const subscribeToPresence = async () => {
      try {
        await channel
          .on('presence', { event: 'sync' }, () => {
            const newState = channel.presenceState();
            // console.log('sync', newState);

            // Check if the current user is in the presence state
            const userPresence = newState[userId];
            if (userPresence && userPresence.length > 0) {
              // User is online
              if (!presence.online) {
                setPresence({ online: true, lastSeen: null });
              }
            } else {
              // User is offline
              if (presence.online) {
                setPresence({ online: false, lastSeen: new Date().toISOString() });
              }
            }
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('join', key, newPresences);
            if (key === userId && !presence.online) {
              setPresence({ online: true, lastSeen: null });
            }
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('leave', key, leftPresences);
            if (key === userId && presence.online) {
              setPresence({ online: false, lastSeen: new Date().toISOString() });
            }
          });

        // Subscribe to the channel
        await channel.subscribe();
      } catch (err) {
        setError(`Error subscribing to channel: ${err}`);
        console.error('Error subscribing to channel:', err);
      }
    };

    subscribeToPresence();

    // Cleanup on unmount or changes
    return () => {
      channel.unsubscribe();
    };
  }, [userId, channelName, presence.online]);

  return { presence, error };
};

export default usePresence;
