// /db/dexie-db.ts
import Dexie, { Table } from 'dexie';

// Define the structure of a profile in the local database
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  banner_url: string;
  website: string;
  phone_number: string;
  email: string;
  expo_push_token: string;
  storage_used: number;
  total_storage: number;
  updated_at: string;
}

class MyAppDatabase extends Dexie {
  profiles: Table<Profile, string>; // Profile table with 'id' as the primary key

  constructor() {
    super('MyAppDatabase');
    this.version(1).stores({
      profiles: 'id, username, full_name, avatar_url, banner_url, website, phone_number, email, expo_push_token, storage_used, total_storage, updated_at',
    });

    this.profiles = this.table('profiles');
  }
}

const db = new MyAppDatabase();
export default db;
