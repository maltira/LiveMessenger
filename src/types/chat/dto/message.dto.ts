import type { Message } from '@/types/chat/message.model.ts'

export interface MsgCreateRequest {
  content: string;
  type: "text" | "file" | "system" | "image" | "video";
  reply_to_message: string | null;
}

export interface MsgUpdateRequest {
  content: string;
  reply_to_message: string | null;
}

export interface GetMessagesResponse {
  messages: Message[];
  total: number;
}