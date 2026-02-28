import { notFound } from "next/navigation";
import { createClient } from "@shared/api/supabase/server";
import ProjectForm from "@views/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return <ProjectForm project={project} />;
}
