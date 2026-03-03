"use client";

import type { BlogPost } from "@entities/blog";
import dynamic from "next/dynamic";
const PlateEditor = dynamic(() => import("@shared/ui/plate-editor"), {
  ssr: false,
});
import { BLOG_PLUGINS } from "@shared/lib/plate-presets";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetail({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
          <span>{post.author_name}</span>
          {post.published_at && (
            <>
              <span>·</span>
              <span>{formatDate(post.published_at)}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-invert max-w-none">
        <PlateEditor
          plugins={BLOG_PLUGINS}
          initialValue={post.content}
          readOnly
        />
      </div>
    </article>
  );
}
