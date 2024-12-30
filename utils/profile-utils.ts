// /utils/profile-utils.ts
import { Profile } from "@/models/profile";

export const isProfileChanged = (profile: Profile, updatedProfile: Profile): boolean => {
  return Object.keys(updatedProfile).some((key) => profile[key as keyof Profile] !== updatedProfile[key as keyof Profile]);
};
