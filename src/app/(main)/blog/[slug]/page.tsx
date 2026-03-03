import { notFound } from "next/navigation";
import { getPostBySlug } from "@features/blog";
import { BlogDetail } from "@views/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "포스트를 찾을 수 없습니다" };

  return {
    title: `${post.title} | 이성재.dev`,
    description: post.excerpt ?? `${post.title} - 이성재.dev 블로그`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pt-28 pb-20">
      <div className="container mx-auto px-6">
        <BlogDetail post={post} />
      </div>
    </main>
  );
}
