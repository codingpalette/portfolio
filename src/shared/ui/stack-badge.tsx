import { cn } from "@shared/lib/utils";

interface StackBadgeProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function StackBadge({ children, active, className }: StackBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs",
        active
          ? "border-transparent bg-[var(--accent-subtle)] text-[var(--accent)]"
          : "border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
