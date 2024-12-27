// /utils/profile-utils.ts
import { Profile } from '@/db/dexie-db';

export const isProfileChanged = (profile: Profile, updatedProfile: Profile): boolean => {
  return Object.keys(updatedProfile).some((key) => profile[key as keyof Profile] !== updatedProfile[key as keyof Profile]);
};
