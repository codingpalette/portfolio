"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

import type { Project } from "@entities/project";

interface ProjectGalleryProps {
  projects: Project[];
}

const techColors: Record<string, string> = {
  React: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  TypeScript: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "Next.js": "border-border bg-muted/50 text-foreground",
  Flutter: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Python: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300",
  FastAPI: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Supabase: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
  NestJS: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
  PHP: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  "Claude Code": "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300",
  MCP: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300",
  "SKILL.md": "border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-300",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className={`project-card project-card-${index} group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card`}
    >
      {/* 카테고리 뱃지 */}
      <span className="mb-4 inline-block rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
        {project.category}
      </span>

      <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-cyan-400">
        {project.title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {/* 기술 스택 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techs.map((tech: string) => (
          <span
            key={tech}
            className={`rounded-full border px-2 py-0.5 text-xs ${techColors[tech] ?? "border-border bg-muted text-foreground"}`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* 링크 */}
      <div className="flex gap-3">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Live Demo &rarr;
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub &rarr;
          </a>
        )}
      </div>

      {/* 호버 그라디언트 효과 */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const container = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  useGSAP(
    () => {
      // 제목 & 필터 애니메이션
      gsap.fromTo(
        ".projects-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".projects-title", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".projects-filter",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: ".projects-filter", start: "top 85%" },
        },
      );

      // 카드 일괄 애니메이션
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      gsap.set(cards, { opacity: 0, y: 40 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 });
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
      className="relative min-h-screen bg-gradient-to-b from-background via-card to-background py-24"
    >
      {/* 배경 효과 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* 제목 */}
        <div className="projects-title mb-12 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            Portfolio
          </p>
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
            Projects
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            다양한 기술 스택을 활용하여 만든 프로젝트들입니다.
          </p>
        </div>

        {/* 필터 */}
        <div className="projects-filter mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                activeFilter === cat
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
                  : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 프로젝트 그리드 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-5xl opacity-30">
              <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-lg font-medium text-muted-foreground">프로젝트 준비 중입니다</p>
            <p className="mt-2 text-sm text-muted-foreground">곧 새로운 프로젝트가 추가될 예정입니다</p>
          </div>
        )}
      </div>
    </section>
  );
}
