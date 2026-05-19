import { HeroTypographic } from "@widgets/hero";
import { StatsSection } from "@widgets/stats";
import { StackSection } from "@widgets/stack";
import { ProjectGallery } from "@widgets/projects";
import { ExperienceSection } from "@widgets/experience";
import { ContactSection } from "@widgets/contact";
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
      <HeroTypographic />
      <StatsSection />
      <StackSection />
      <ProjectGallery projects={(data as Project[]) ?? []} />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}
