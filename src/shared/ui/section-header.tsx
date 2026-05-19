import { cn } from "@shared/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        ─ {label}
      </p>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
