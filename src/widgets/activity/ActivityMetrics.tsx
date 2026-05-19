import type { Contribution } from "./fetchContributions";

interface Props {
  contributions: Contribution[];
  totalLastYear: number;
  username: string;
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
  totalLastYear,
  username,
}: Props) {
  const last7 = sumLastN(contributions, 7);
  const last30 = sumLastN(contributions, 30);
  const longest = longestStreak(contributions);
  const current = currentStreak(contributions);

  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "Last 7 days", value: `${last7}`, accent: true },
    { label: "Last 30 days", value: `${last30}` },
    { label: "Last 12 months", value: `${totalLastYear}` },
    { label: "Longest streak", value: `${longest}d` },
    { label: "Current streak", value: `${current}d` },
  ];

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
