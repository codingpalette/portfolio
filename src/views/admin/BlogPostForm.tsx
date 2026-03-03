"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@entities/blog";
import { createClient } from "@shared/api/supabase/client";
import { useAuthStore } from "@features/auth";
import { generateSlug } from "@features/blog/lib/slug-utils";
import { createEmptyContent, extractPlainText } from "@shared/lib/plate-utils";
import dynamic from "next/dynamic";
const PlateEditor = dynamic(() => import("@shared/ui/plate-editor"), {
  ssr: false,
});
import { BLOG_PLUGINS } from "@shared/lib/plate-presets";

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 text-cyan-400 hover:text-white"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
      />
    </div>
  );
}

interface BlogPostFormProps {
  post?: BlogPost;
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [content, setContent] = useState<Record<string, unknown>[]>(
    post?.content ?? createEmptyContent(),
  );
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleContentChange = useCallback(
    (value: Record<string, unknown>[]) => {
      setContent(value);
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const plainText = extractPlainText(content as never[]);
    if (!plainText.trim()) {
      setError("본문을 입력해주세요.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const data = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      tags,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      author_id: user.id,
      author_name: user.profile.name || user.email,
    };

    const result = isEditing
      ? await supabase.from("blog_posts").update(data).eq("id", post.id)
      : await supabase.from("blog_posts").insert(data);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-white">
        {isEditing ? "포스트 수정" : "새 포스트"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-300"
          >
            슬러그
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
          <p className="text-xs text-gray-500">
            URL에 사용될 슬러그 (제목 입력 시 자동 생성)
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-300"
          >
            요약
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="포스트 요약 (목록에 표시)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            태그
          </label>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="입력 후 Enter로 추가"
          />
          <p className="text-xs text-gray-500">
            Enter 또는 쉼표(,)로 태그 추가, Backspace로 삭제
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            본문
          </label>
          <PlateEditor
            plugins={BLOG_PLUGINS}
            initialValue={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요..."
            className="min-h-[300px]"
            variant="default"
          />
        </div>

        <div className="flex items-center space-y-2 pb-1">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            <span className="text-sm text-gray-300">공개</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "저장 중..." : isEditing ? "수정" : "등록"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
