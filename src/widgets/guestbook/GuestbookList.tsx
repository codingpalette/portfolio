"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GuestbookEntry } from "@entities/guestbook";
import { useAuthStore } from "@features/auth";
import { createClient } from "@shared/api/supabase/client";
import dynamic from "next/dynamic";
const PlateEditor = dynamic(() => import("@shared/ui/plate-editor"), {
  ssr: false,
});
import { GUESTBOOK_PLUGINS } from "@shared/lib/plate-presets";

interface GuestbookListProps {
  entries: GuestbookEntry[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GuestbookList({ entries }: GuestbookListProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isAdmin = user?.profile.role === "admin";

  const handleDelete = async (id: string) => {
    if (!confirm("이 메시지를 삭제하시겠습니까?")) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("guestbook_entries")
      .delete()
      .eq("id", id);

    if (error) {
      alert("삭제에 실패했습니다.");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    router.refresh();
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <p className="text-lg font-medium text-muted-foreground">
          아직 방명록이 비어있습니다
        </p>
        <p className="mt-1 text-sm text-muted-foreground">첫 번째 메시지를 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-border"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {entry.author_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(entry.created_at)}
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                {deletingId === entry.id ? "삭제 중..." : "삭제"}
              </button>
            )}
          </div>
          <div className="text-sm leading-relaxed text-foreground">
            <PlateEditor
              plugins={GUESTBOOK_PLUGINS}
              initialValue={entry.content}
              readOnly
            />
          </div>
        </div>
      ))}
    </div>
  );
}
