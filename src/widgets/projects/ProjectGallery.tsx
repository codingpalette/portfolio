"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@entities/project";
import { SectionHeader } from "@shared/ui/section-header";
import { StackBadge } from "@shared/ui/stack-badge";
import { cn } from "@shared/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectGalleryProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card flex h-full flex-col rounded-lg border border-border bg-[var(--surface)] p-6 transition-colors hover:border-[var(--border-strong)]">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {project.category}
      </p>

      <h3 className="mt-3 text-lg font-semibold text-foreground">
        {project.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {project.description}
      </p>

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

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const container = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

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
              <ProjectCard key={project.id} project={project} />
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
    </section>
  );
}
