export interface Project {
  id: string;
  title: string;
  description: string;
  techs: string[];
  category: string;
  link: string | null;
  github: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
