"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@features/auth";
import { createClient } from "@shared/api/supabase/client";
import dynamic from "next/dynamic";
const PlateEditor = dynamic(() => import("@shared/ui/plate-editor"), {
  ssr: false,
});
import { GUESTBOOK_PLUGINS } from "@shared/lib/plate-presets";
import { createEmptyContent, extractPlainText } from "@shared/lib/plate-utils";

export default function GuestbookForm() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown>[]>(
    createEmptyContent(),
  );
  const [editorKey, setEditorKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plainText = extractPlainText(content as never[]);
  const charCount = plainText.length;

  const handleContentChange = useCallback(
    (value: Record<string, unknown>[]) => {
      setContent(value);
    },
    [],
  );

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          방명록을 작성하려면{" "}
          <a
            href="/login"
            className="text-cyan-600 dark:text-cyan-400 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            로그인
          </a>
          이 필요합니다.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plainText.trim()) return;
    if (charCount > 500) return;

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const authorName = user.profile.name || user.email;

    const { error: insertError } = await supabase
      .from("guestbook_entries")
      .insert({
        user_id: user.id,
        author_name: authorName,
        content,
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setContent(createEmptyContent());
    setEditorKey((k) => k + 1);
    setSubmitting(false);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}
      <div className="mb-3">
        <PlateEditor
          key={editorKey}
          plugins={GUESTBOOK_PLUGINS}
          initialValue={content}
          onChange={handleContentChange}
          placeholder="메시지를 남겨주세요..."
          variant="guestbook"
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${charCount > 500 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
        >
          {charCount}/500
        </span>
        <button
          type="submit"
          disabled={submitting || !plainText.trim() || charCount > 500}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "작성 중..." : "작성"}
        </button>
      </div>
    </form>
  );
}
