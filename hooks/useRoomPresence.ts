import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

interface PresenceData {
  userId: string;
  online: boolean;
  lastSeen: string | null;
}

const useRoomPresence = (roomId: string, myUserId: string) => {
  const [presences, setPresences] = useState<PresenceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !myUserId) {
      console.warn('Room ID or user ID not provided.');
      return;
    }

    const room = supabase.channel(roomId, { config: { presence: { key: myUserId } } }); // Key is just the userId

    const subscribeToPresence = async () => {
      try {
        await room.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            try {
              await room.track({ online: true }); // Track only online status

              room.on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState();
                const updatedPresences: PresenceData[] = [];
                for (const userId in newState) {
                  updatedPresences.push({
                    userId,
                    online: newState[userId].length > 0,
                    lastSeen: newState[userId].length > 0 ? null : new Date().toISOString(),
                  });
                }
                setPresences(updatedPresences);
              });

              room.on('presence', { event: 'join' }, ({ key }) => {
                if (key !== myUserId) {
                  setPresences((prevPresences) => {
                    if (prevPresences.find((p) => p.userId === key)) return prevPresences;
                    return [...prevPresences, { userId: key, online: true, lastSeen: null }];
                  });
                }
              });

              room.on('presence', { event: 'leave' }, ({ key }) => {
                if (key !== myUserId) {
                  setPresences((prevPresences) =>
                    prevPresences.filter((presence) => presence.userId !== key)
                  );
                }
              });
            } catch (trackError) {
              console.error('Error tracking presence:', trackError);
              setError('Error tracking presence.');
            }
          } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
            setError('Channel subscription errored.');
          }
        });
      } catch (subscribeError) {
        console.error('Error subscribing to channel:', subscribeError);
        setError('Error subscribing to channel.');
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