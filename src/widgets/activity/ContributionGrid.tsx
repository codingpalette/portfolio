import type { Contribution } from "./fetchContributions";

const LEVEL_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-[var(--surface-muted)]",
  1: "bg-foreground/15",
  2: "bg-foreground/35",
  3: "bg-foreground/60",
  4: "bg-foreground/90",
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface Props {
  contributions: Contribution[];
}

export function ContributionGrid({ contributions }: Props) {
  if (contributions.length === 0) return null;

  const firstDate = new Date(contributions[0].date);
  const startDayOfWeek = firstDate.getDay();

  const weeks: (Contribution | null)[][] = [];
  let currentWeek: (Contribution | null)[] = Array(startDayOfWeek).fill(null);

  for (const c of contributions) {
    currentWeek.push(c);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const monthLabels: { weekIndex: number; month: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstReal = week.find((d) => d !== null);
    if (!firstReal) return;
    const m = new Date(firstReal.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ weekIndex: i, month: MONTH_LABELS[m] });
      lastMonth = m;
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1.5">
        <div className="flex h-3 gap-[3px] pl-7 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {weeks.map((_, i) => {
            const label = monthLabels.find((m) => m.weekIndex === i);
            return (
              <span key={i} className="w-[11px] shrink-0">
                {label?.month ?? ""}
              </span>
            );
          })}
        </div>

        <div className="flex gap-[3px]">
          <div className="mr-1 flex flex-col gap-[3px] text-[10px] font-mono text-muted-foreground">
            <span className="h-[11px]"></span>
            <span className="h-[11px] leading-[11px]">Mon</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px] leading-[11px]">Wed</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px] leading-[11px]">Fri</span>
            <span className="h-[11px]"></span>
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) =>
                day ? (
                  <span
                    key={day.date}
                    className={`block h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASS[day.level]}`}
                    title={`${day.date} · ${day.count} contributions`}
                  />
                ) : (
                  <span
                    key={`empty-${wi}-${di}`}
                    className="block h-[11px] w-[11px] rounded-[2px] opacity-0"
                  />
                ),
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-7 pt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Less</span>
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <span
              key={lvl}
              className={`block h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASS[lvl]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
