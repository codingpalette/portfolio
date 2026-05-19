import Link from "next/link";

export default function HeroTypographic() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-24 md:px-8 md:py-32">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          ─ INTRODUCTION
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Full-Stack Developer.
          <br />
          <span className="text-muted-foreground">
            3D 인터랙티브 웹과 견고한 백엔드를
          </span>
          <br />
          <span className="text-muted-foreground">
            이어주는 개발자.
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="mailto:msbfms@gmail.com"
            className="inline-flex h-10 items-center rounded-md bg-[var(--accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get in touch →
          </a>
          <Link
            href="/projects"
            className="inline-flex h-10 items-center rounded-md border border-[var(--border-strong)] px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            View projects
          </Link>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="font-mono text-xs text-muted-foreground">
            msbfms@gmail.com · Seoul, KR · Available for opportunities
          </p>
        </div>
      </div>
    </section>
  );
}
