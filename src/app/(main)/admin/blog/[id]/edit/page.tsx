import { notFound } from "next/navigation";
import { createClient } from "@shared/api/supabase/server";
import BlogPostForm from "@views/admin/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return <BlogPostForm post={post} />;
}
