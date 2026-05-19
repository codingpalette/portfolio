import { SectionHeader } from "@shared/ui/section-header";
import { StackBadge } from "@shared/ui/stack-badge";

const STACKS: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui", "Zustand"],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Python", "FastAPI", "Supabase", "Postgres"],
  },
  {
    category: "3D / UI",
    items: ["Three.js", "React Three Fiber", "GSAP", "Framer Motion"],
  },
  {
    category: "Infra",
    items: ["Vercel", "Docker", "GitHub Actions"],
  },
];

export default function StackSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="TECH STACK"
          title="자주 쓰는 기술"
          description="제품을 만들 때 손에 익은 도구들."
        />

        <div className="grid gap-6">
          {STACKS.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-1 gap-3 border-t border-border pt-6 md:grid-cols-[160px_1fr] md:gap-6"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {row.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {row.items.map((item) => (
                  <StackBadge key={item}>{item}</StackBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
