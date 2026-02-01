import type { Profile } from '@/types/profile/profile.model.ts'

export interface Block {
  id: string;
  profile_id: string;
  blocked_profile_id: string;
  created_at: string;

  BlockedProfile: Profile;
}