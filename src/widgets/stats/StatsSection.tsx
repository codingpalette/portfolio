import { StatCard } from "@shared/ui/stat-card";

const STATS = [
  { value: "+5", label: "Years", accent: true },
  { value: "20+", label: "Projects" },
  { value: "3", label: "Products" },
  { value: "100%", label: "Shipped" },
];

export default function StatsSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
