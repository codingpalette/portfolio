import { BlogList } from "@views/blog";
import { getPublishedPosts } from "@features/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | 이성재.dev",
  description: "개발 블로그 - 기술 글, 프로젝트 회고, 개발 경험을 공유합니다.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background pt-28 pb-20">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            Blog
          </p>
          <h1 className="text-4xl font-bold text-foreground">블로그</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            기술 글, 프로젝트 회고, 개발 경험을 공유합니다.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </main>
  );
}
