
export interface UpdateProfileRequest {
  username: string
  full_name: string
  bio: string
  avatar_url: string
  birth_date: string | null
}

export interface OnlineStatusResponse {
  online: boolean
  last_seen: Date | null
}