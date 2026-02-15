import type { Participant } from '@/types/chat/participant.model.ts'

export interface Chat {
  id: string;
  type: "private" | "group";
  name: string | null;
  avatar_url: string | null;
  can_join: boolean | null;
  created_by: string;

  created_at: Date;
  updated_at: Date;

  Participants: Participant[];
}