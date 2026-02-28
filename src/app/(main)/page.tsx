import { Hero3D } from "@widgets/hero";
import { ProjectGallery } from "@widgets/projects";
import { createClient } from "@shared/api/supabase/server";
import type { Project } from "@entities/project";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main>
      <Hero3D />
      <ProjectGallery projects={(data as Project[]) ?? []} />
    </main>
  );
}
