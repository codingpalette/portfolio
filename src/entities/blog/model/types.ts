export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>[];
  excerpt: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}
