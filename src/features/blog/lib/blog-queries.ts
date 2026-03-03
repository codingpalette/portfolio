import { createClient } from "@shared/api/supabase/server";

/**
 * 공개 포스트 목록 (content 제외, 리스트용)
 */
export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, thumbnail_url, tags, published_at, author_name, created_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * 슬러그로 포스트 조회 (content 포함)
 */
export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}

/**
 * 모든 포스트 (관리자용)
 */
export async function getAdminPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, tags, is_published, published_at, author_name, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
