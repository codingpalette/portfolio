import { SectionHeader } from "@shared/ui/section-header";

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  highlights: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    period: "2024 — Present",
    company: "Company A",
    role: "Senior Frontend Engineer",
    highlights: [
      "주요 서비스 리뉴얼 리딩, 핵심 페이지 LCP 40% 개선",
      "디자인 시스템 v2 설계 및 8개 팀 도입",
    ],
  },
  {
    period: "2022 — 2024",
    company: "Company B",
    role: "Full-Stack Engineer",
    highlights: [
      "Supabase 기반 SaaS MVP 출시, 6개월 MAU 5천 달성",
      "결제·인증 등 핵심 기능 단독 구현",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader label="EXPERIENCE" title="이력" />

        <ol className="grid gap-10">
          {EXPERIENCE.map((item) => (
            <li
              key={`${item.period}-${item.company}`}
              className="grid gap-3 border-t border-border pt-6 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {item.period}
              </p>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {item.company}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.role}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {item.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground before:mr-2 before:text-muted-foreground before:content-['·']"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
