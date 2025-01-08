import { useState, useEffect, useRef } from 'react';
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
  const lastSeenMap = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!roomId || !myUserId) {
      console.warn('Room ID or user ID not provided.');
      return;
    }

    const room = supabase.channel(roomId, { config: { presence: { key: myUserId } } });

    const subscribeToPresence = async () => {
      try {
        await room.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            try {
              await room.track({ online: true });

              room.on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState();
                setPresences((prevPresences) => {
                  return Object.entries(newState).map(([userId, presence]) => {
                    const isOnline = presence.length > 0;
                    if (!isOnline && !lastSeenMap.current[userId]) {
                      lastSeenMap.current[userId] = new Date().toISOString();
                    }
                    return {
                      userId,
                      online: isOnline,
                      lastSeen: isOnline ? null : lastSeenMap.current[userId] || null,
                    };
                  }).filter(presence => prevPresences.find(prevPresence => prevPresence.userId === presence.userId) || newState[presence.userId]);
                });
              });

              room.on('presence', { event: 'join' }, ({ key }) => {
                if (key !== myUserId) {
                  setPresences((prevPresences) => {
                    const existingPresence = prevPresences.find((p) => p.userId === key);
                    if (existingPresence) {
                      return prevPresences.map((p) =>
                        p.userId === key ? { ...p, online: true, lastSeen: null } : p
                      );
                    } else {
                      return [...prevPresences, { userId: key, online: true, lastSeen: null }];
                    }
                  });
                }
              });

              room.on('presence', { event: 'leave' }, ({ key }) => {
                if (key !== myUserId) {
                  setPresences((prevPresences) => {
                    return prevPresences.map((p) =>
                      p.userId === key ? { ...p, online: false, lastSeen: new Date().toISOString() } : p
                    );
                  });
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
        // console.error('Error subscribing to channel:', subscribeError);
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