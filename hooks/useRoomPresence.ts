import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

interface PresenceData {
  user: string;
  online: boolean;
  lastSeen: string | null;
}

const useRoomPresence = (roomId: string, myUserId: string) => {
  const [presences, setPresences] = useState<PresenceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      console.warn('room ID not provided.');
      return;
    }

    const room = supabase.channel(roomId);

    const subscribeToPresence = async () => {
      try {
        await room.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            try {
              // Track your own presence to show online to others
              await room.track({ user: myUserId, online: true });

              // Update presence data on events
              room.on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState();
                const updatedPresences = [];
                for (const [userId, presence] of Object.entries(newState)) {
                  updatedPresences.push({
                    user: userId,
                    online: presence.length > 0,
                    lastSeen: presence.length > 0 ? null : new Date().toISOString(),
                  });
                }
                setPresences(updatedPresences);
              });

              room.on('presence', { event: 'join' }, ({ key }) => {
                if (key !== myUserId) { // Don't update for yourself
                  setPresences((prevPresences) => [...prevPresences, { user: key, online: true, lastSeen: null }]);
                }
              });

              room.on('presence', { event: 'leave' }, ({ key }) => {
                if (key !== myUserId) { // Don't update for yourself
                  setPresences((prevPresences) =>
                    prevPresences.filter((presence) => presence.user !== key)
                  );
                }
              });
            } catch (trackError) {
              console.error("Error tracking presence:", trackError);
              setError("Error tracking presence.");
            }
          } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
            setError("Channel subscription errored.");
          }
        });
      } catch (subscribeError) {
        console.error('Error subscribing to channel:', subscribeError);
        setError("Error subscribing to channel.");
      }
    };

    subscribeToPresence();

    return () => {
      room.unsubscribe();
    };
  }, [roomId, myUserId]);

  return { presences, error };
};

export default useRoomPresence;