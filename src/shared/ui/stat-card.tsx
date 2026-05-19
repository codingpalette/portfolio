import { cn } from "@shared/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ value, label, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-[var(--surface)] px-6 py-6 transition-colors hover:border-[var(--border-strong)]",
        className,
      )}
    >
      <p
        className={cn(
          "font-mono text-4xl md:text-5xl font-semibold tabular-nums",
          accent ? "text-[var(--accent)]" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
