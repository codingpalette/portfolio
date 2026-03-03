"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@shared/api/supabase/client";

export default function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", projectId);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-500/20 dark:border-red-500/20 dark:text-red-400"
    >
      삭제
    </button>
  );
}
