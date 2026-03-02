

export interface Settings {
  id: string
  user_id: string

  show_online_status: boolean
  show_birth_date: "all" | "nobody"

  dark_mode: boolean
  language: string
}