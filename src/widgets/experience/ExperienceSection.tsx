import { SectionHeader } from "@shared/ui/section-header";

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  highlights: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    period: "2021.08 — Present",
    company: "㈜엠에스벤터",
    role: "Full-Stack Developer · 개발팀",
    highlights: [
      "프랜차이즈 ERP '프담' — MFA 아키텍처 기반 통합 관리 시스템, React + TypeScript + FastAPI + PHP. 다수 브랜드에 서비스 중",
      "축산물 이력관리 '이력스캔' — Next.js + FastAPI + Flutter 풀스택 설계. Apple App Store 배포",
      "B2B 유통 '백푸드' · 가맹점 발주 '발주닷컴' — Flutter WebView 하이브리드 앱, Android/iOS 동시 출시",
    ],
  },
  {
    period: "2020.11 — 2021.08",
    company: "㈜랭킹지지",
    role: "Frontend Developer · 개발팀",
    highlights: [
      "리그오브레전드 연승 챌린지 게임 커뮤니티 플랫폼 개발",
      "React Native 기반 Android/iOS 모바일 앱 동시 배포",
    ],
  },
  {
    period: "2018.10 — 2020.10",
    company: "나누리",
    role: "Frontend Developer · 개발팀",
    highlights: [
      "모바일 초대장 서비스 — 다양한 스킨 템플릿 시스템 구축",
      "LG 아카데미 직무평가 (Vue.js + Laravel), 이움스토어팜 영상 자동 렌더링 등 외주 개발",
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
