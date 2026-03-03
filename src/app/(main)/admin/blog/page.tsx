import Link from "next/link";
import { getAdminPosts } from "@features/blog";
import BlogPostActions from "@views/admin/BlogPostActions";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">블로그 관리</h2>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/30"
        >
          + 새 포스트
        </Link>
      </div>

      {!posts.length ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-gray-400">등록된 포스트가 없습니다</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            첫 포스트를 작성하세요 &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-medium text-white">
                    {post.title}
                  </h3>
                  {post.is_published ? (
                    <span className="shrink-0 rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">
                      공개
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-gray-700/50 px-1.5 py-0.5 text-xs text-gray-500">
                      비공개
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {post.slug} · {formatDate(post.created_at)}
                </p>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  수정
                </Link>
                <BlogPostActions postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
