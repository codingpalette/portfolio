import Link from "next/link";

interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  published_at: string | null;
  author_name: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <p className="text-lg font-medium text-muted-foreground">
          아직 작성된 글이 없습니다
        </p>
        <p className="mt-1 text-sm text-muted-foreground">곧 새로운 글이 올라옵니다!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group block rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:bg-card"
        >
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.author_name}</span>
            {post.published_at && (
              <>
                <span>·</span>
                <span>{formatDate(post.published_at)}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-600 dark:text-cyan-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
