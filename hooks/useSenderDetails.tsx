// useSenderDetails.ts
import { supabase } from '@/lib/supabase';

const useSenderDetails = () => {
  const senderDetailsCache = {} as any;

  const fetchSenderDetails = async (senderId: string) => {
    if (senderDetailsCache[senderId]) {
      return senderDetailsCache[senderId];
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('username, email, id, avatar_url')
      .eq('id', senderId)
      .single();

    if (error) {
      // console.error('Error fetching sender details:', error.message);
      return null;
    }

    const senderData = { id: data.id, username: data.username, email: data.email, avatar_url: data.avatar_url };
    senderDetailsCache[senderId] = senderData;
    return senderData;
  };

  return { fetchSenderDetails };
};

export default useSenderDetails;
