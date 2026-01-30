import type { Settings } from '@/types/profile/settings.model.ts'

export interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  birth_date: Date | null
  last_seen: Date | null

  created_at: Date
  updated_at: Date

  Settings: Settings
}

