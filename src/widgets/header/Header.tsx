"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@features/auth";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { cn } from "@shared/lib/utils";
import { HeaderClock } from "./HeaderClock";

const navLinks = [
  { label: "Stack", href: "/#stack" },
  { label: "Activity", href: "/#activity" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-semibold text-foreground transition-colors hover:text-[var(--accent)]"
        >
          이성재.dev
        </Link>

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

        <div className="flex items-center gap-3">
          <HeaderClock />
          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-border bg-[var(--surface)] px-3 py-1.5 text-sm text-foreground transition-colors hover:border-[var(--border-strong)]"
              >
                <span>{user.profile.name || user.email}</span>
                {user.profile.role === "admin" && (
                  <span className="rounded bg-[var(--accent-subtle)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                    Admin
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-[var(--surface)] shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    프로필 수정
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    대시보드
                  </Link>
                  {user.profile.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="border-t border-border" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-[var(--destructive)]"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-[var(--border-strong)]"
            >
              로그인
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1 md:hidden"
            aria-label="메뉴 토글"
          >
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-all duration-200",
                menuOpen && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-all duration-200",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-all duration-200",
                menuOpen && "-translate-y-1.5 -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t bg-background/95 backdrop-blur-md transition-all duration-200 md:hidden",
          menuOpen ? "max-h-60 border-border" : "max-h-0 border-transparent",
        )}
      >
        <ul className="mx-auto flex max-w-[1080px] flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
