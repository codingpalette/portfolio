export interface GuestbookEntry {
  id: string;
  user_id: string;
  author_name: string;
  content: Record<string, unknown>[];
  created_at: string;
}
