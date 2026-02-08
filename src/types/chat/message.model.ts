
export interface Message {
  id: string;
  chat_id: string;
  user_id: string | null;
  content: string;
  type: "text" | "image" | "video" | "file" | "system";
  reply_to_message: string | null;

  created_at: Date;
  edited_at: Date | null;
}