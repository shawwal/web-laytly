export interface FeatureRequest {
  id: string;
  created_at: string;
  user_id: string | null;
  title: string;
  description: string;
  status: string;
  like_count: number;
  dislike_count: number;
  // Add user's vote if fetched (null, 1, or -1)
  user_vote?: number | null;
  // Optional: Include user metadata if joined
  // user_metadata?: { name?: string; avatar_url?: string };
}
