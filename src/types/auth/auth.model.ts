
export interface User {
  id: string
  email: string
  is_verified: boolean

  created_at: Date
  deleted_at: Date
  to_be_deleted_at: Date | null
}