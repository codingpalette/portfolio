import { Hero3DLoader } from "@views/lab";

export const metadata = {
  title: "Lab | 이성재.dev",
  description: "실험 중인 3D / 인터랙티브 작업물.",
};

export default function LabPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1080px] px-4 py-16 md:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          ─ LAB
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
          실험실
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          실험 중인 3D / 인터랙티브 작업물.
        </p>
      </section>
      <Hero3DLoader />
    </main>
  );
}
