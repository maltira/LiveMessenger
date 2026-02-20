
export interface SettingsUpdateReq {
  show_online_status: boolean | null;
  show_birth_date: "all" | "nobody" | null;
  dark_mode: boolean | null;
  language: string | null;
}