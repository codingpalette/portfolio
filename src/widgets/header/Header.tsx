"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@features/auth";
import { ThemeToggle } from "@shared/ui/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Guestbook", href: "/guestbook" },
  { label: "Games", href: "/games" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/80 shadow-[0_1px_0_rgba(128,128,128,0.1)] backdrop-blur-lg"
        : "bg-transparent"
        }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* 로고 */}
        <Link
          href="/"
          className="text-lg font-bold text-foreground transition-colors hover:text-cyan-400"
        >
          이성재
          <span className="ml-1 text-sm font-normal text-muted-foreground">.dev</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 오른쪽: 유저 메뉴 + 모바일 햄버거 */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-foreground transition-all hover:border-border hover:text-foreground"
              >
                <span>{user.profile.name || user.email}</span>
                {user.profile.role === "admin" && (
                  <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-xs text-cyan-400">
                    Admin
                  </span>
                )}
                <svg
                  className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    프로필 수정
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    대시보드
                  </Link>
                  {user.profile.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="border-t border-border" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-red-400"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-1.5 text-sm font-medium text-cyan-700 dark:text-cyan-300 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/20"
            >
              로그인
            </Link>
          )}

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="메뉴 토글"
          >
            <span
              className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
            />
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      <div
        className={`overflow-hidden border-t border-border bg-background/95 backdrop-blur-lg transition-all duration-300 md:hidden ${menuOpen ? "max-h-60" : "max-h-0 border-t-0"
          }`}
      >
        <ul className="container mx-auto flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
