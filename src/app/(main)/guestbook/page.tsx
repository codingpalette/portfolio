import { GuestbookList } from "@widgets/guestbook";
import { GuestbookForm } from "@views/guestbook";
import { createClient } from "@shared/api/supabase/server";
import type { GuestbookEntry } from "@entities/guestbook";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Guestbook | 이성재.dev",
  description: "방명록에 메시지를 남겨주세요.",
};

export default async function GuestbookPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guestbook_entries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pt-28 pb-20">
      <div className="container mx-auto max-w-2xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            Guestbook
          </p>
          <h1 className="text-4xl font-bold text-white">방명록</h1>
          <p className="mx-auto mt-3 max-w-md text-gray-400">
            방문해주셔서 감사합니다. 한 마디 남겨주세요!
          </p>
        </div>

        <div className="mb-8">
          <GuestbookForm />
        </div>

        <GuestbookList entries={(data as GuestbookEntry[]) ?? []} />
      </div>
    </main>
  );
}
