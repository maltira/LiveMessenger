
export interface UpdateProfileRequest {
  username?: string
  full_name?: string
  bio?: string
  avatar_url?: string
  birth_date?: Date | null
  birth_date_is_set: boolean
}

export interface OnlineStatusResponse {
  online: boolean
  last_seen: Date | null
}