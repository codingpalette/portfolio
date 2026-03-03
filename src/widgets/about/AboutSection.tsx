"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const experiences = [
  {
    period: "2021.08 ~ 현재",
    role: "풀스택 개발자",
    company: "엠에스벤터",
    description:
      "프랜차이즈 ERP 솔루션 개발. React, Next.js 기반 프론트엔드 및 FastAPI, PHP 백엔드 개발.",
    techs: ["React", "Next.js", "FastAPI", "PHP", "TypeScript", "jQuery"],
    color: "cyan",
  },
  {
    period: "2020.11 ~ 2021.07",
    role: "웹 개발자",
    company: "랭킹지지",
    description:
      "홈페이지 개발 및 유지보수. 리그오브레전드 연승 챌린지 기능 개발. React Native으로 Android/iOS 앱 배포.",
    techs: ["React Native", "Android", "iOS"],
    color: "indigo",
  },
  {
    period: "2018.10 ~ 2020.10",
    role: "프론트엔드 개발자",
    company: "나누리",
    description:
      "홈페이지 제작 및 모바일 초대장 제작 폼, 초대장 스킨 작업.",
    techs: ["HTML", "CSS", "JavaScript"],
    color: "purple",
  },
  {
    period: "2018.04 ~ 2018.05",
    role: "웹퍼블리셔",
    company: "쇼엠",
    description:
      "보험 관련 홈페이지 웹퍼블리싱. 제로보드를 이용한 홈페이지 제작.",
    techs: ["HTML", "CSS", "제로보드"],
    color: "amber",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string; line: string }> = {
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-400",
    line: "from-cyan-400",
  },
  indigo: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-300",
    dot: "bg-indigo-400",
    line: "from-indigo-400",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-300",
    dot: "bg-purple-400",
    line: "from-purple-400",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-300",
    dot: "bg-amber-400",
    line: "from-amber-400",
  },
};

export default function AboutSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".about-title", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".about-intro",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: ".about-intro", start: "top 85%" },
        },
      );

      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      gsap.set(cards, { opacity: 0, x: 40 });
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15 });
        },
      });
    },
    { scope: container },
  );

  return (
    <section
      id="about"
      ref={container}
      className="relative bg-gradient-to-b from-background via-card to-background py-24"
    >
      {/* 배경 효과 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute -right-32 bottom-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* 제목 */}
        <div className="about-title mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            About Me
          </p>
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
            About
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* 왼쪽: 자기소개 */}
          <div className="about-intro space-y-6 lg:col-span-2">
            {/* 프로필 이미지 영역 */}
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 lg:mx-0">
              <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-cyan-400/60">
                SJ
              </div>
            </div>

            <div className="space-y-4 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground">이성재</h3>
              <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                Full-Stack Developer & AI Builder
              </p>
              <p className="leading-relaxed text-muted-foreground">
                웹퍼블리셔로 시작해 프론트엔드, 풀스택으로 성장해 온 개발자입니다.
                현재 엠에스벤터에서 프랜차이즈 ERP 솔루션을 개발하며
                React, Next.js부터 FastAPI, PHP까지 폭넓은 스택을 다루고 있습니다.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Claude Code를 메인 개발 도구로 활용하며,
                AI와 협업하여 더 높은 생산성과 완성도를 추구합니다.
              </p>
            </div>

            {/* 연락처/링크 */}
            <div className="flex justify-center gap-3 lg:justify-start">
              <a
                href="https://github.com/codingpalette"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-border hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="mailto:adfffewr@naver.com"
                className="rounded-full border border-border bg-muted/50 p-2.5 text-muted-foreground transition-all hover:border-border hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* 오른쪽: 경력 타임라인 */}
          <div className="space-y-6 lg:col-span-3">
            <h3 className="mb-8 text-lg font-semibold text-foreground">
              Experience
            </h3>

            <div className="relative space-y-6">
              {/* 타임라인 라인 */}
              <div className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-cyan-500/30 via-indigo-500/20 to-transparent" />

              {experiences.map((exp, i) => {
                const colors = colorMap[exp.color];
                return (
                  <div key={i} className="exp-card relative pl-8">
                    {/* 타임라인 점 */}
                    <div
                      className={`absolute top-2 left-0 h-[15px] w-[15px] rounded-full border-2 border-background ${colors.dot}`}
                    />

                    <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {exp.period}
                        </span>
                        <span className="text-xs text-muted-foreground">|</span>
                        <span className="text-xs text-muted-foreground">
                          {exp.company}
                        </span>
                      </div>

                      <h4 className="mb-2 text-lg font-semibold text-foreground">
                        {exp.role}
                      </h4>

                      <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.techs.map((tech) => (
                          <span
                            key={tech}
                            className={`rounded-full border px-2 py-0.5 text-xs ${colors.border} ${colors.bg} ${colors.text}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
