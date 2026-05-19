import { SectionHeader } from "@shared/ui/section-header";
import { ContributionGrid } from "./ContributionGrid";
import { ActivityMetrics } from "./ActivityMetrics";
import { fetchContributions } from "./fetchContributions";

const USERNAME = "codingpalette";

export default async function ActivitySection() {
  const data = await fetchContributions(USERNAME);

  return (
    <section id="activity" className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="ACTIVITY"
          title="GitHub 활동"
          description="실제로 코드를 쓰는 개발자. 최근 1년 contribution."
        />

        {data ? (
          <div className="grid gap-10 md:grid-cols-[1fr_220px] md:gap-12">
            <ContributionGrid contributions={data.contributions} />
            <ActivityMetrics
              contributions={data.contributions}
              totalLastYear={data.total.lastYear}
              username={USERNAME}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              ─ UNAVAILABLE
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              GitHub 활동 데이터를 불러올 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
