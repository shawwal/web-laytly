import { useEffect, useState, useRef, RefObject } from 'react';
import { supabase } from '@/lib/supabase'; // Path to your Supabase client
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChannelWithMeta {
  channel: RealtimeChannel;
  channelName: string;
}

const useSupabaseRealtime = (options: { tables: string[]; filters?: Record<string, Record<string, any>> } = { tables: [] }) => {
  const [data, setData] = useState<Record<string, any[]>>({});
  const channelRef: RefObject<ChannelWithMeta | null> = useRef(null);

  const { tables, filters = {} } = options;

  useEffect(() => {
    if (!tables || tables.length === 0) {
      console.warn("No tables specified for realtime updates.");
      return;
    }

    const channelName = `public:realtime:${tables.join('-')}:${JSON.stringify(filters)}`;

    if (channelRef.current && channelRef.current.channelName === channelName) {
      return;
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current.channel);
      channelRef.current = null;
    }

    const channel = supabase.channel(channelName);

    tables.forEach((table) => {
      let filterString = '';
      if (filters[table]) {
        filterString = Object.entries(filters[table])
          .map(([key, value]) => `${key}=eq.${value}`)
          .join('&');
      }

      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: filterString },
        (payload) => {
          setData((prevData) => {
            const tableData = prevData[table] || [];

            switch (payload.eventType) {
              case 'INSERT':
                return { ...prevData, [table]: [...tableData, payload.new] };
              case 'UPDATE':
                return {
                  ...prevData,
                  [table]: tableData.map((item) =>
                    item.id === payload.new.id ? payload.new : item
                  ),
                };
              case 'DELETE':
                return {
                  ...prevData,
                  [table]: tableData.filter((item) => item.id !== payload.old.id),
                };
              default:
                return prevData;
            }
          });
        }
      );
    });

    channelRef.current = { channel, channelName };
    channel.subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current.channel);
        channelRef.current = null;
      }
    };
  }, [JSON.stringify(tables), JSON.stringify(filters)]); // Correct dependency array

  return data;
};

export default useSupabaseRealtime;