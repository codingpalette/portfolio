import Link from "next/link";
import { createClient } from "@shared/api/supabase/server";
import type { Project } from "@entities/project";
import ProjectActions from "@views/admin/ProjectActions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">프로젝트 관리</h2>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-700 transition-all hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
        >
          + 새 프로젝트
        </Link>
      </div>

      {!projects?.length ? (
        <div className="rounded-xl border border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">등록된 프로젝트가 없습니다</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            첫 프로젝트를 추가하세요 &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(projects as Project[]).map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-medium text-foreground">
                    {project.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-border bg-card/50 px-2.5 py-0.5 text-xs text-muted-foreground">
                    {project.category}
                  </span>
                  {project.is_published ? (
                    <span className="shrink-0 rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">
                      공개
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      비공개
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  수정
                </Link>
                <ProjectActions projectId={project.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
