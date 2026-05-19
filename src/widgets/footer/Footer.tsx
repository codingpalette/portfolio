import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-border bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1080px] gap-12 px-4 py-16 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ─ ABOUT
          </p>
          <p className="mt-3 text-sm text-foreground">
            이성재 · Full-Stack Developer
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Incheon, KR
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ─ CONTACT
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            <li>
              <a
                href="mailto:adfffewr@naver.com"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                adfffewr@naver.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/codingpalette"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ─ BUILD
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            © {year} codingpalette
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Next.js 16 · Supabase
          </p>
          <Link
            href="/lab"
            className="mt-3 inline-block font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            /lab
          </Link>
        </div>
      </div>
    </footer>
  );
}
