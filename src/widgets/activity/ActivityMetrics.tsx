import type { Contribution } from "./fetchContributions";

interface Props {
  contributions: Contribution[];
  total: number;
  username: string;
  isLastYear: boolean;
}

function sumLastN(contributions: Contribution[], n: number): number {
  return contributions.slice(-n).reduce((sum, c) => sum + c.count, 0);
}

function longestStreak(contributions: Contribution[]): number {
  let longest = 0;
  let current = 0;
  for (const c of contributions) {
    if (c.count > 0) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

function currentStreak(contributions: Contribution[]): number {
  let streak = 0;
  for (let i = contributions.length - 1; i >= 0; i -= 1) {
    if (contributions[i].count > 0) streak += 1;
    else break;
  }
  return streak;
}

export function ActivityMetrics({
  contributions,
  total,
  username,
  isLastYear,
}: Props) {
  const longest = longestStreak(contributions);
  const rows = isLastYear
    ? [
        {
          label: "Last 7 days",
          value: `${sumLastN(contributions, 7)}`,
          accent: true,
        },
        { label: "Last 30 days", value: `${sumLastN(contributions, 30)}` },
        { label: "Last 12 months", value: `${total}` },
        { label: "Longest streak", value: `${longest}d` },
        { label: "Current streak", value: `${currentStreak(contributions)}d` },
      ]
    : (() => {
        const activeDays = contributions.filter((c) => c.count > 0).length;
        const avg =
          contributions.length > 0
            ? Math.round((total / contributions.length) * 10) / 10
            : 0;
        return [
          { label: "Total", value: `${total}`, accent: true },
          { label: "Active days", value: `${activeDays}` },
          { label: "Longest streak", value: `${longest}d` },
          { label: "Daily average", value: `${avg}` },
        ];
      })();

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between border-b border-border pb-2"
          >
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {row.label}
            </dt>
            <dd
              className={`font-mono text-base font-semibold tabular-nums ${
                row.accent ? "text-[var(--accent)]" : "text-foreground"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noreferrer"
        className="self-start font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
      >
        @{username} →
      </a>
    </div>
  );
}
