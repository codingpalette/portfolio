"use client";

import { useMemo, useState } from "react";
import { ContributionGrid } from "./ContributionGrid";
import { ActivityMetrics } from "./ActivityMetrics";
import type { Contribution } from "./fetchContributions";
import { cn } from "@shared/lib/utils";

interface Props {
  contributions: Contribution[];
  totals: Record<string, number>;
  username: string;
}

type Range = "last" | string;

export function ActivityClient({ contributions, totals, username }: Props) {
  const years = Object.keys(totals)
    .filter((k) => /^\d{4}$/.test(k))
    .sort()
    .reverse();
  const [range, setRange] = useState<Range>("last");

  const visible = useMemo(() => {
    if (range === "last") return contributions.slice(-365);
    return contributions.filter((c) => c.date.startsWith(range));
  }, [range, contributions]);

  const rangeTotal = useMemo(() => {
    if (range === "last") return visible.reduce((s, c) => s + c.count, 0);
    return totals[range] ?? 0;
  }, [range, visible, totals]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-1 font-mono text-xs uppercase tracking-wider">
        <RangeButton active={range === "last"} onClick={() => setRange("last")}>
          Last
        </RangeButton>
        {years.map((y) => (
          <RangeButton
            key={y}
            active={range === y}
            onClick={() => setRange(y)}
          >
            {y}
          </RangeButton>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_220px] md:gap-12">
        <ContributionGrid contributions={visible} />
        <ActivityMetrics
          contributions={visible}
          total={rangeTotal}
          username={username}
          isLastYear={range === "last"}
        />
      </div>
    </div>
  );
}

function RangeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 transition-colors",
        active
          ? "text-[var(--accent)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
