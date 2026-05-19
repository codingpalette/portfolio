import { SectionHeader } from "@shared/ui/section-header";

export default function ContactSection() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="GET IN TOUCH"
          title="같이 만들 거리가 있다면 연락주세요."
        />

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:adfffewr@naver.com"
            className="inline-flex h-12 items-center rounded-md bg-[var(--accent)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            adfffewr@naver.com ↗
          </a>
          <a
            href="https://github.com/codingpalette"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center rounded-md border border-[var(--border-strong)] px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
