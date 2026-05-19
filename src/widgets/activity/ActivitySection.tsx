import { SectionHeader } from "@shared/ui/section-header";
import { ActivityClient } from "./ActivityClient";
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
          description="실제로 코드를 쓰는 개발자. 연도별 contribution을 확인할 수 있습니다."
        />

        {data ? (
          <ActivityClient
            contributions={data.contributions}
            totals={data.total}
            username={USERNAME}
          />
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
