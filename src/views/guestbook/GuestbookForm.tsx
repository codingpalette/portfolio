"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@features/auth";
import { createClient } from "@shared/api/supabase/client";

export default function GuestbookForm() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-400">
          방명록을 작성하려면{" "}
          <a
            href="/login"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
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
    const trimmed = message.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const authorName = user.profile.name || user.email;

    const { error: insertError } = await supabase
      .from("guestbook_entries")
      .insert({
        user_id: user.id,
        author_name: authorName,
        message: trimmed,
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setMessage("");
    setSubmitting(false);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 남겨주세요..."
        maxLength={500}
        rows={3}
        required
        className="mb-3 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{message.length}/500</span>
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "작성 중..." : "작성"}
        </button>
      </div>
    </form>
  );
}
