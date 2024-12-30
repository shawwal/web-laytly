export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  banner_url?: string;
  website?: string;
  country_code?: string;
  phone_number?: string;
  email: string;
  expo_push_token?: string;
  storage_used?: number;
  total_storage?: number;
  updated_at?: string;
}
