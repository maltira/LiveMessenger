
export interface Participant {
  id: string;
  chat_id: string;
  user_id: string;
  role: string;

  joined_at: Date;
  muted_until: Date | null;
}