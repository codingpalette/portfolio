import Link from "next/link";

const adminNavLinks = [
  { label: "대시보드", href: "/admin" },
  { label: "프로젝트 관리", href: "/admin/projects" },
  { label: "블로그 관리", href: "/admin/blog" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">관리자</h1>
          <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-600 dark:text-cyan-400">
            Admin
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 사이드바 */}
          <nav className="w-full shrink-0 lg:w-48">
            <ul className="flex gap-1 lg:flex-col">
              {adminNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 콘텐츠 */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
