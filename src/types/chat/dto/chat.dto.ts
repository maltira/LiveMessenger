
export interface ChatCreateRequest {
  name: string;
  avatar_url: string | null;
  can_join: boolean;
  created_by: string;
  members: string[];
}