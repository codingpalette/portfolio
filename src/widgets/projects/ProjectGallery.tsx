"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import type { Project } from "@entities/project";
import { SectionHeader } from "@shared/ui/section-header";
import { StackBadge } from "@shared/ui/stack-badge";
import { cn } from "@shared/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectGalleryProps {
  projects: Project[];
}

function ProjectCard({
  project,
  onOpenDetails,
}: {
  project: Project;
  onOpenDetails: (project: Project) => void;
}) {
  return (
    <article className="project-card flex h-full flex-col rounded-lg border border-border bg-[var(--surface)] p-6 transition-colors hover:border-[var(--border-strong)]">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {project.category}
      </p>

      <h3 className="mt-3 text-lg font-semibold text-foreground">
        {project.title}
      </h3>

      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        className="mt-2 rounded-sm text-left text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        aria-label={`${project.title} 전체 설명 보기`}
      >
        <span className="line-clamp-3">
          {project.description}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        className="mt-2 w-fit font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      >
        자세히 보기
      </button>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.techs.map((tech: string) => (
          <StackBadge key={tech}>{tech}</StackBadge>
        ))}
      </div>

      <div className="mt-auto flex gap-4 pt-6">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            Live →
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            GitHub →
          </a>
        )}
      </div>
    </article>
  );
}

function ProjectDetailsDialog({
  project,
  onOpenChange,
}: {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={Boolean(project)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[min(720px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-[var(--surface)] p-6 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-8">
          {project && (
            <>
              <div className="pr-10">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {project.category}
                </p>
                <Dialog.Title className="mt-3 text-2xl font-semibold leading-tight text-foreground">
                  {project.title}
                </Dialog.Title>
              </div>

              <Dialog.Description className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {project.description}
              </Dialog.Description>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.techs.map((tech: string) => (
                  <StackBadge key={tech}>{tech}</StackBadge>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 border-t border-border pt-5">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
                  >
                    Live →
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </>
          )}

          <Dialog.Close className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-muted)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">닫기</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const container = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      gsap.set(cards, { opacity: 0, y: 8 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power1.out",
          });
        },
      });
    },
    { scope: container, dependencies: [activeFilter], revertOnUpdate: true },
  );

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      ref={container}
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="SELECTED WORK"
          title="대표 프로젝트"
          description="다양한 기술 스택으로 만든 작업물."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors",
                activeFilter === cat
                  ? "border-transparent bg-[var(--accent-subtle)] text-[var(--accent)]"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDetails={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              ─ EMPTY
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              곧 새로운 프로젝트가 추가될 예정입니다.
            </p>
          </div>
        )}
      </div>

      <ProjectDetailsDialog
        project={selectedProject}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
      />
    </section>
  );
}
