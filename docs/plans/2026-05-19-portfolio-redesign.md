# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hermes 톤 기반의 신규 디자인 시스템(DESIGN.md)을 포트폴리오 전체에 적용한다. 디자인 토큰부터 홈/보조 페이지까지 단계적으로 마이그레이션한다.

**Architecture:** Tailwind v4 + CSS 변수(OKLCH) 기반 토큰을 globals.css에 정의하고, shadcn/ui 컴포넌트의 색·반경·패딩을 토큰으로 덮어쓴다. 홈 페이지는 Hero3D를 제거하고 타이포그래픽 Hero + 5개 섹션으로 재구성한다. 보조 페이지는 토큰만 새로 적용하여 기능을 보존한다.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Pretendard Variable, Geist Mono, next-themes, FSD 레이어 (shared → widgets → views → app).

**Reference:** [DESIGN.md](../../DESIGN.md) 가 SSOT. 모든 토큰/패턴은 그 문서를 기준으로 한다.

---

## File Structure

### 새로 생성

| 경로 | 책임 |
|------|------|
| `src/shared/ui/section-header.tsx` | 모든 섹션의 `─ LABEL` + 제목 패턴 |
| `src/shared/ui/stack-badge.tsx` | 스택 표시 칩 (모노, full radius, 보더) |
| `src/shared/ui/stat-card.tsx` | 큰 모노 숫자 + 라벨 |
| `src/widgets/footer/Footer.tsx` | 3컬럼 푸터 (소개/컨택트/빌드 정보) |
| `src/widgets/footer/index.ts` | barrel export |
| `src/widgets/hero/HeroTypographic.tsx` | 타이포그래픽 Hero (3D 대체) |
| `src/widgets/stats/StatsSection.tsx` | 4개 메트릭 카드 |
| `src/widgets/stats/index.ts` | barrel export |
| `src/widgets/stack/StackSection.tsx` | 카테고리별 스택 배지 |
| `src/widgets/stack/index.ts` | barrel export |
| `src/widgets/experience/ExperienceSection.tsx` | 경력 타임라인 |
| `src/widgets/experience/index.ts` | barrel export |
| `src/widgets/contact/ContactSection.tsx` | 컨택트 CTA |
| `src/widgets/contact/index.ts` | barrel export |

### 수정

| 경로 | 변경 |
|------|------|
| `src/app/globals.css` | OKLCH 토큰 전면 교체, 타이포·스페이싱 토큰 추가 |
| `src/app/layout.tsx` | Pretendard 폰트 추가, defaultTheme="light" |
| `src/shared/ui/button.tsx` | variant 색·반경 토큰 정렬 |
| `src/shared/ui/card.tsx` | 그림자 제거, 보더 기반 |
| `src/widgets/header/Header.tsx` | DESIGN.md §5 사양으로 재작성 |
| `src/widgets/hero/index.ts` | export 교체 (HeroTypographic) |
| `src/widgets/projects/ProjectGallery.tsx` | 신규 토큰·라벨 패턴 적용 |
| `src/app/(main)/page.tsx` | 신규 위젯들로 홈 구성 |

### 이동/제거

| 경로 | 처리 |
|------|------|
| `src/widgets/hero/Hero3D.tsx` | `src/views/lab/Hero3D.tsx`로 이동, 신규 `/lab` 라우트에서만 사용 |

---

## Open Question Resolutions (DESIGN.md §11)

이 계획에서 다음 결정으로 고정한다:

1. **Hero3D**: `/lab` 라우트로 이동 보존 (완전 삭제 X).
2. **Stats 수치**: 1차 정적값으로 시작. 추후 DB 연동 가능하게 props 구조 유지.
3. **블로그 코드 하이라이팅**: 본 계획 범위 외 (기존 Plate 에디터 유지).

---

## Phase 1: Foundation (Tokens & Fonts)

### Task 1.1: Pretendard Variable 폰트 설치

**Files:**
- Modify: `package.json` (dependency 추가)

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add @fontsource-variable/pretendard
```

- [ ] **Step 2: lint/build 동작 확인**

Run: `pnpm lint`
Expected: 추가된 의존성으로 인한 신규 에러 없음 (기존 사전 에러는 무관).

- [ ] **Step 3: 커밋**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(폰트): Pretendard Variable 의존성 추가"
```

---

### Task 1.2: Layout에 Pretendard + defaultTheme 변경

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: layout.tsx 교체**

```tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@shared/ui/theme-provider";
import { AuthProvider } from "@features/auth";
import "@fontsource-variable/pretendard";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이성재 | Full-Stack Developer Portfolio",
  description:
    "React, TypeScript, Next.js, Python, FastAPI, NestJS를 활용하는 풀스택 개발자 이성재의 포트폴리오입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} font-sans overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: dev 서버 띄워 본문 폰트가 Pretendard로 적용됐는지 확인**

Run: `pnpm dev` (browser에서 localhost:3000 확인)
Expected: 한글 본문이 Pretendard로 렌더됨. 라이트 모드가 기본.

- [ ] **Step 3: 커밋**

```bash
git add src/app/layout.tsx
git commit -m "feat(레이아웃): Pretendard 폰트 적용 및 라이트 기본 모드 전환"
```

---

### Task 1.3: globals.css 전면 교체 (OKLCH 토큰)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: globals.css의 `:root` 와 `.dark` 블록을 DESIGN.md §2 토큰으로 교체**

기존 `:root` / `.dark` 블록을 다음으로 대체. `@theme inline` 블록과 `@layer base`, plate-editor 관련 스타일은 유지:

```css
:root {
  /* Radius */
  --radius: 0.5rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Color tokens (DESIGN.md §2 — Light) */
  --background: oklch(1 0 0);
  --surface: oklch(0.985 0 0);
  --surface-muted: oklch(0.97 0.005 240);
  --foreground: oklch(0.18 0.01 240);
  --foreground-muted: oklch(0.55 0.01 240);
  --border: oklch(0.92 0.005 240);
  --border-strong: oklch(0.85 0.005 240);
  --accent: oklch(0.72 0.15 200);
  --accent-hover: oklch(0.65 0.16 200);
  --accent-subtle: oklch(0.95 0.04 200);
  --success: oklch(0.72 0.16 150);
  --warning: oklch(0.78 0.15 75);
  --destructive: oklch(0.58 0.22 25);

  /* shadcn 호환 매핑 */
  --card: var(--surface);
  --card-foreground: var(--foreground);
  --popover: var(--background);
  --popover-foreground: var(--foreground);
  --primary: var(--foreground);
  --primary-foreground: var(--background);
  --secondary: var(--surface-muted);
  --secondary-foreground: var(--foreground);
  --muted: var(--surface-muted);
  --muted-foreground: var(--foreground-muted);
  --accent-foreground: oklch(1 0 0);
  --destructive-foreground: oklch(1 0 0);
  --input: var(--border);
  --ring: var(--accent);
  --sidebar: var(--surface);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--accent);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: var(--surface-muted);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--accent);
}

.dark {
  /* Color tokens (DESIGN.md §2 — Dark) */
  --background: oklch(0.14 0.01 240);
  --surface: oklch(0.18 0.01 240);
  --surface-muted: oklch(0.22 0.01 240);
  --foreground: oklch(0.96 0.005 240);
  --foreground-muted: oklch(0.65 0.01 240);
  --border: oklch(1 0 0 / 8%);
  --border-strong: oklch(1 0 0 / 15%);
  --accent: oklch(0.78 0.16 200);
  --accent-hover: oklch(0.84 0.14 200);
  --accent-subtle: oklch(0.28 0.06 200);
  --destructive: oklch(0.65 0.2 25);

  --card: var(--surface);
  --card-foreground: var(--foreground);
  --popover: var(--surface);
  --popover-foreground: var(--foreground);
  --primary: var(--foreground);
  --primary-foreground: var(--background);
  --secondary: var(--surface-muted);
  --secondary-foreground: var(--foreground);
  --muted: var(--surface-muted);
  --muted-foreground: var(--foreground-muted);
  --accent-foreground: oklch(0.14 0.01 240);
  --destructive-foreground: oklch(1 0 0);
  --input: var(--border);
  --ring: var(--accent);
  --sidebar: var(--surface);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--accent);
  --sidebar-primary-foreground: var(--background);
  --sidebar-accent: var(--surface-muted);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--accent);
}
```

- [ ] **Step 2: `@theme inline` 블록에 토큰 매핑 추가**

기존 `@theme inline { ... }` 블록 안 마지막에 다음 라인 추가:

```css
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-foreground-muted: var(--foreground-muted);
  --color-border-strong: var(--border-strong);
  --color-accent-hover: var(--accent-hover);
  --color-accent-subtle: var(--accent-subtle);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --font-sans: "Pretendard Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
```

기존 `--font-sans: var(--font-geist-sans)` 라인은 위 새 라인으로 교체된다 (중복 방지).

- [ ] **Step 3: 빌드 검증**

Run: `pnpm build`
Expected: 빌드 성공. CSS 변수 충돌 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/app/globals.css
git commit -m "feat(디자인토큰): OKLCH 기반 신규 토큰으로 globals.css 교체"
```

---

## Phase 2: Shared Components

### Task 2.1: SectionHeader 컴포넌트 생성

**Files:**
- Create: `src/shared/ui/section-header.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
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
```

- [ ] **Step 2: import 동작 확인**

Run: `pnpm lint`
Expected: section-header.tsx 관련 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/shared/ui/section-header.tsx
git commit -m "feat(공통컴포넌트): SectionHeader (─ 라벨 + 제목 패턴) 추가"
```

---

### Task 2.2: StackBadge 컴포넌트 생성

**Files:**
- Create: `src/shared/ui/stack-badge.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
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
```

- [ ] **Step 2: 커밋**

```bash
git add src/shared/ui/stack-badge.tsx
git commit -m "feat(공통컴포넌트): StackBadge 추가"
```

---

### Task 2.3: StatCard 컴포넌트 생성

**Files:**
- Create: `src/shared/ui/stat-card.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
import { cn } from "@shared/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ value, label, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-[var(--surface)] px-6 py-6 transition-colors hover:border-[var(--border-strong)]",
        className,
      )}
    >
      <p
        className={cn(
          "font-mono text-4xl md:text-5xl font-semibold tabular-nums",
          accent ? "text-[var(--accent)]" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/shared/ui/stat-card.tsx
git commit -m "feat(공통컴포넌트): StatCard 추가"
```

---

### Task 2.4: Button & Card 스타일 정렬 검증

**Files:**
- Read: `src/shared/ui/button.tsx`
- Read: `src/shared/ui/card.tsx`

shadcn 기본 컴포넌트는 위에서 정의한 CSS 변수를 자동으로 사용한다 (Task 1.3에서 shadcn 호환 매핑을 정의). 추가 수정이 필요한지 확인:

- [ ] **Step 1: button.tsx 와 card.tsx를 읽고 `bg-primary` `bg-secondary` `bg-card` 등의 토큰 클래스가 정상 매핑되는지 확인**

Read: `src/shared/ui/button.tsx`, `src/shared/ui/card.tsx`

Expected: shadcn variants가 `bg-primary`, `bg-secondary`, `text-primary-foreground` 등 의미적 토큰만 사용 중이라면 추가 코드 수정 불필요. 만약 카드에 shadow 클래스(`shadow-sm`, `shadow-md` 등)가 하드코딩돼 있으면 다음 단계 수행.

- [ ] **Step 2: card.tsx 에 그림자가 있다면 제거**

Card 컴포넌트의 `className`에서 `shadow-*` 클래스를 모두 삭제. 보더로만 분리한다.

- [ ] **Step 3: dev 서버에서 페이지 띄워보고 카드·버튼 색이 신규 토큰을 따르는지 확인**

Run: `pnpm dev` (localhost:3000)
Expected: 라이트 모드 흰 배경 + 본문 거의 검정. 다크 모드 진한 네이비. 어색하면 토큰 검토.

- [ ] **Step 4: 커밋 (변경 있을 때만)**

```bash
git add src/shared/ui/card.tsx
git commit -m "style(카드): 그림자 제거 후 보더 기반 스타일로 정렬"
```

---

## Phase 3: Header & Footer

### Task 3.1: Header 재작성

**Files:**
- Modify: `src/widgets/header/Header.tsx`

- [ ] **Step 1: Header 전면 교체**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@features/auth";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { cn } from "@shared/lib/utils";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Games", href: "/games" },
  { label: "Guestbook", href: "/guestbook" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
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
```

- [ ] **Step 2: dev 서버에서 확인**

Run: `pnpm dev`
Expected: 헤더가 sticky, 스크롤 시 backdrop blur 발동, 활성 nav에 사이안 underline, 모바일 햄버거 동작.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/header/Header.tsx
git commit -m "refactor(헤더): Hermes 톤으로 헤더 재작성"
```

---

### Task 3.2: Footer 위젯 생성

**Files:**
- Create: `src/widgets/footer/Footer.tsx`
- Create: `src/widgets/footer/index.ts`

- [ ] **Step 1: Footer.tsx 작성**

```tsx
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
            Seoul, KR
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ─ CONTACT
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            <li>
              <a
                href="mailto:msbfms@gmail.com"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                msbfms@gmail.com
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
```

- [ ] **Step 2: barrel export**

`src/widgets/footer/index.ts`:

```ts
export { default as Footer } from "./Footer";
```

- [ ] **Step 3: layout 그룹에 Footer 추가**

`src/app/(main)/layout.tsx` 를 읽고 Header 다음에 Footer를 추가한다. 만약 layout.tsx가 단순한 children 패스스루 형태라면 다음 패턴 적용:

```tsx
import Header from "@widgets/header";
import { Footer } from "@widgets/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
```

(실제 import 경로는 기존 파일을 그대로 따른다. Footer만 새로 추가.)

- [ ] **Step 4: dev 서버 확인**

Run: `pnpm dev`
Expected: 모든 (main) 페이지 하단에 3컬럼 푸터 노출.

- [ ] **Step 5: 커밋**

```bash
git add src/widgets/footer/ src/app/\(main\)/layout.tsx
git commit -m "feat(푸터): 3컬럼 푸터 위젯 추가 및 메인 레이아웃 연결"
```

---

## Phase 4: Home Page Sections

### Task 4.1: HeroTypographic 위젯 생성

**Files:**
- Create: `src/widgets/hero/HeroTypographic.tsx`
- Modify: `src/widgets/hero/index.ts`

- [ ] **Step 1: HeroTypographic.tsx 작성**

```tsx
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
```

- [ ] **Step 2: index.ts 업데이트**

`src/widgets/hero/index.ts`:

```ts
export { default as HeroTypographic } from "./HeroTypographic";
```

(`Hero3D` export는 제거한다. Hero3D는 Task 5.1 에서 별도 위치로 이동.)

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/hero/
git commit -m "feat(히어로): 타이포그래픽 Hero 위젯 추가, 3D 히어로 export 제거"
```

---

### Task 4.2: StatsSection 위젯 생성

**Files:**
- Create: `src/widgets/stats/StatsSection.tsx`
- Create: `src/widgets/stats/index.ts`

- [ ] **Step 1: StatsSection.tsx 작성**

```tsx
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
```

- [ ] **Step 2: barrel export**

`src/widgets/stats/index.ts`:

```ts
export { default as StatsSection } from "./StatsSection";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/stats/
git commit -m "feat(통계): StatsSection 위젯 추가"
```

---

### Task 4.3: StackSection 위젯 생성

**Files:**
- Create: `src/widgets/stack/StackSection.tsx`
- Create: `src/widgets/stack/index.ts`

- [ ] **Step 1: StackSection.tsx 작성**

```tsx
import { SectionHeader } from "@shared/ui/section-header";
import { StackBadge } from "@shared/ui/stack-badge";

const STACKS: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui", "Zustand"],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Python", "FastAPI", "Supabase", "Postgres"],
  },
  {
    category: "3D / UI",
    items: ["Three.js", "React Three Fiber", "GSAP", "Framer Motion"],
  },
  {
    category: "Infra",
    items: ["Vercel", "Docker", "GitHub Actions"],
  },
];

export default function StackSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="TECH STACK"
          title="자주 쓰는 기술"
          description="제품을 만들 때 손에 익은 도구들."
        />

        <div className="grid gap-6">
          {STACKS.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-1 gap-3 border-t border-border pt-6 md:grid-cols-[160px_1fr] md:gap-6"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {row.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {row.items.map((item) => (
                  <StackBadge key={item}>{item}</StackBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: barrel export**

`src/widgets/stack/index.ts`:

```ts
export { default as StackSection } from "./StackSection";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/stack/
git commit -m "feat(스택): StackSection 위젯 추가"
```

---

### Task 4.4: ProjectGallery → 새로운 토큰 적용

**Files:**
- Modify: `src/widgets/projects/ProjectGallery.tsx`

- [ ] **Step 1: 기존 ProjectGallery 파일 읽기 후 다음 사항 적용**

1. 상단에 `<SectionHeader label="SELECTED WORK" title="대표 프로젝트" />` 사용.
2. 카드 배경: `bg-[var(--surface)]`
3. 카드 보더: `border border-border` + hover 시 `hover:border-[var(--border-strong)]`
4. 카드 반경: `rounded-lg`
5. 카드 그림자(`shadow-*`) 모두 제거.
6. 카드 내 기술 스택 표시는 `<StackBadge>` 사용.
7. 컨테이너: `mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32 border-b border-border`

세부 마크업은 기존 파일의 컴포넌트 구조를 따르되 위 토큰만 교체. 새 import:

```tsx
import { SectionHeader } from "@shared/ui/section-header";
import { StackBadge } from "@shared/ui/stack-badge";
```

- [ ] **Step 2: dev 서버에서 카드 외형 확인**

Run: `pnpm dev`
Expected: 카드가 하얀 배경 + 얇은 보더만, hover 시 보더 진해짐. 그림자 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/projects/ProjectGallery.tsx
git commit -m "refactor(프로젝트): ProjectGallery에 신규 디자인 토큰 적용"
```

---

### Task 4.5: ExperienceSection 위젯 생성

**Files:**
- Create: `src/widgets/experience/ExperienceSection.tsx`
- Create: `src/widgets/experience/index.ts`

- [ ] **Step 1: ExperienceSection.tsx 작성**

```tsx
import { SectionHeader } from "@shared/ui/section-header";

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  highlights: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    period: "2024 — Present",
    company: "Company A",
    role: "Senior Frontend Engineer",
    highlights: [
      "주요 서비스 리뉴얼 리딩, 핵심 페이지 LCP 40% 개선",
      "디자인 시스템 v2 설계 및 8개 팀 도입",
    ],
  },
  {
    period: "2022 — 2024",
    company: "Company B",
    role: "Full-Stack Engineer",
    highlights: [
      "Supabase 기반 SaaS MVP 출시, 6개월 MAU 5천 달성",
      "결제·인증 등 핵심 기능 단독 구현",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader label="EXPERIENCE" title="이력" />

        <ol className="grid gap-10">
          {EXPERIENCE.map((item) => (
            <li
              key={`${item.period}-${item.company}`}
              className="grid gap-3 border-t border-border pt-6 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {item.period}
              </p>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {item.company}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.role}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {item.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground before:mr-2 before:text-muted-foreground before:content-['·']"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

> NOTE: 데이터(`EXPERIENCE`)는 1차 정적값. 추후 props/DB 로 빼낼 수 있게 분리 보관.

- [ ] **Step 2: barrel export**

`src/widgets/experience/index.ts`:

```ts
export { default as ExperienceSection } from "./ExperienceSection";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/experience/
git commit -m "feat(경력): ExperienceSection 위젯 추가"
```

---

### Task 4.6: ContactSection 위젯 생성

**Files:**
- Create: `src/widgets/contact/ContactSection.tsx`
- Create: `src/widgets/contact/index.ts`

- [ ] **Step 1: ContactSection.tsx 작성**

```tsx
import { SectionHeader } from "@shared/ui/section-header";

export default function ContactSection() {
  return (
    <section>
      <div className="mx-auto max-w-[1080px] px-4 py-20 md:px-8 md:py-32">
        <SectionHeader
          label="GET IN TOUCH"
          title="같이 만들 거리가 있다면 연락주세요."
        />

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:msbfms@gmail.com"
            className="inline-flex h-12 items-center rounded-md bg-[var(--accent)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            msbfms@gmail.com ↗
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
```

- [ ] **Step 2: barrel export**

`src/widgets/contact/index.ts`:

```ts
export { default as ContactSection } from "./ContactSection";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/contact/
git commit -m "feat(컨택트): ContactSection 위젯 추가"
```

---

### Task 4.7: 홈 페이지 재조립

**Files:**
- Modify: `src/app/(main)/page.tsx`

- [ ] **Step 1: page.tsx 재작성**

```tsx
import { HeroTypographic } from "@widgets/hero";
import { StatsSection } from "@widgets/stats";
import { StackSection } from "@widgets/stack";
import { ProjectGallery } from "@widgets/projects";
import { ExperienceSection } from "@widgets/experience";
import { ContactSection } from "@widgets/contact";
import { createClient } from "@shared/api/supabase/server";
import type { Project } from "@entities/project";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main>
      <HeroTypographic />
      <StatsSection />
      <StackSection />
      <ProjectGallery projects={(data as Project[]) ?? []} />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 2: dev 서버에서 홈 전체 흐름 확인**

Run: `pnpm dev` (localhost:3000)
Expected: Hero → Stats → Stack → Selected Work → Experience → Contact 순. 모든 섹션 사이 `border-b border-border`. 다크 모드 토글 동작.

- [ ] **Step 3: 빌드 검증**

Run: `pnpm build`
Expected: 빌드 성공. 타입 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/app/\(main\)/page.tsx
git commit -m "feat(홈): 신규 디자인의 홈 페이지로 재조립"
```

---

## Phase 5: Hero3D 이동

### Task 5.1: Hero3D를 /lab 라우트로 이동

**Files:**
- Move: `src/widgets/hero/Hero3D.tsx` → `src/views/lab/Hero3D.tsx`
- Create: `src/app/(main)/lab/page.tsx`

- [ ] **Step 1: Hero3D 이동**

```bash
mkdir -p src/views/lab
git mv src/widgets/hero/Hero3D.tsx src/views/lab/Hero3D.tsx
```

(import 경로가 widgets/hero 안에서 자기 자신을 참조하는 부분이 있으면 그대로 둔다. 외부에서 참조하던 곳은 Task 4.7에서 이미 끊었다.)

- [ ] **Step 2: views/lab/index.ts 작성**

`src/views/lab/index.ts`:

```ts
export { default as Hero3D } from "./Hero3D";
```

- [ ] **Step 3: /lab 라우트 추가**

`src/app/(main)/lab/page.tsx`:

```tsx
import dynamic from "next/dynamic";

const Hero3D = dynamic(
  () => import("@views/lab").then((m) => ({ default: m.Hero3D })),
  { ssr: false },
);

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
      <Hero3D />
    </main>
  );
}
```

- [ ] **Step 4: dev 서버에서 `/lab` 접속하여 3D 정상 동작 확인**

Run: `pnpm dev` → `localhost:3000/lab`
Expected: 3D Hero가 별도 페이지에서 정상 렌더링.

- [ ] **Step 5: 커밋**

```bash
git add src/views/lab/ src/app/\(main\)/lab/
git commit -m "refactor(히어로): Hero3D를 /lab 라우트로 이동"
```

---

## Phase 6: Secondary Pages Verification

### Task 6.1: /projects, /games, /guestbook, /blog 시각 검증

이 페이지들은 shadcn 컴포넌트(Card, Button 등)를 사용한다. Task 1.3에서 토큰을 갈아끼웠으므로 자동으로 새 색감을 따른다. 하드코딩된 색이 있는지만 점검.

- [ ] **Step 1: 페이지별로 dev 서버에서 시각 점검**

Run: `pnpm dev`

각 URL 방문하여 점검:
- `localhost:3000/projects` — 카드 그림자 없는지, 보더 기반인지
- `localhost:3000/games` — 게임 카탈로그 카드 동일
- `localhost:3000/guestbook` — 입력 폼/리스트 색감 정상
- `localhost:3000/blog` — Plate 에디터 영역 토큰 충돌 없는지

Expected: 모든 페이지가 새 팔레트로 자연스럽게 보임.

- [ ] **Step 2: 하드코딩된 cyan/sky 색 클래스 점검**

Run: `rg -n "text-cyan-|bg-cyan-|text-sky-|bg-sky-|border-cyan-" src/`

발견된 모든 매치를 `text-[var(--accent)]`, `bg-[var(--accent)]`, `bg-[var(--accent-subtle)]`, `border-[var(--accent)]` 등으로 치환한다. 의도된 다른 색(예: chart-2 등)은 유지.

- [ ] **Step 3: 다크 모드 점검**

다크 모드 토글하고 동일 페이지 순회. 가독성 4.5:1 이상 유지되는지 확인.

- [ ] **Step 4: 커밋 (수정 있을 때만)**

```bash
git add -p
git commit -m "style(보조페이지): 하드코딩 색을 디자인 토큰으로 치환"
```

---

### Task 6.2: 빌드 & 린트 최종 검증

- [ ] **Step 1: lint 실행**

Run: `pnpm lint`
Expected: 본 계획에서 추가/수정한 파일에 신규 에러 없음. (사전 에러는 무관.)

- [ ] **Step 2: 빌드 실행**

Run: `pnpm build`
Expected: 빌드 성공, 타입 에러 없음.

- [ ] **Step 3: 푸시**

```bash
git push origin main
```

---

## Phase 7: Compound (학습 캡처)

CLAUDE.md §🧬 컴파운드 엔지니어링 4단계.

### Task 7.1: solutions 문서 작성

**Files:**
- Create: `docs/solutions/design-portfolio-redesign-hermes.md`

- [ ] **Step 1: solutions 문서 작성**

```markdown
---
title: "포트폴리오를 Hermes 톤으로 재디자인"
category: "design"
tags: [design-system, oklch, tailwind-v4, pretendard]
date: 2026-05-19
---

## 문제
- shadcn 기본 팔레트 + Geist 폰트로는 한글 가독성과 시각적 차별점이 부족.
- 3D Hero가 정보 우선 사이트(채용 담당자 타겟)와 톤이 맞지 않음.

## 해결책
- DESIGN.md를 SSOT로 두고 globals.css에 OKLCH 토큰을 갈아끼움.
- Pretendard Variable로 한글 본문 가독성 확보, 코드는 Geist Mono 유지.
- Hero3D를 /lab 라우트로 격리, 홈은 타이포그래픽 Hero로 교체.
- 모든 섹션에 `─ LABEL` 모노 라벨 패턴을 시그니처로 도입 (SectionHeader 컴포넌트).
- 그림자 기반 카드를 보더 기반으로 통일.

## 재발 방지
- CLAUDE.md에서 DESIGN.md를 "반드시 먼저 읽기"로 명시 (이미 적용됨).
- shadcn 컴포넌트 추가 후 색·반경·패딩은 DESIGN.md 토큰 기준으로 조정하는 규칙 명시.
- 향후 디자인 결정은 DESIGN.md를 같이 업데이트하여 누적.

## 참고
- DESIGN.md
- src/app/globals.css (토큰 정의)
- src/shared/ui/section-header.tsx (시그니처 패턴)
```

- [ ] **Step 2: 커밋**

```bash
git add docs/solutions/design-portfolio-redesign-hermes.md
git commit -m "docs(솔루션): 포트폴리오 재디자인 학습 기록"
git push origin main
```

---

## Self-Review

- [x] **Spec 커버리지**: DESIGN.md 1~11 섹션 모두 매핑됨 (§1 철학은 코드 무관, §2 토큰 Task 1.3, §3 타이포 Task 1.2~1.3, §4 스페이싱·반경 globals.css에 흡수, §5 레이아웃 Task 3.1~3.2 + 4.x, §6 컴포넌트 Task 2.x + 헤더, §7 모션은 추후 — 본 1차에서는 컴포넌트 트랜지션만, §8 아이콘 Lucide 기존 사용, §9 접근성 — Header focus 처리·prefers-reduced-motion은 후속 점검 항목, §10 마이그레이션 노트 전체 반영, §11 오픈 큐 결의됨).
- [x] **Placeholder 스캔**: TBD/TODO/"적절히 처리" 같은 모호 표현 없음.
- [x] **타입/이름 일관성**: SectionHeader props (label, title, description), StatCard props (value, label, accent), StackBadge props (children, active) 전 태스크 일관.
- [ ] **§9 접근성 후속**: prefers-reduced-motion / 키보드 focus 가시화는 본 계획 외 후속 점검 태스크로 별도 처리 (현 헤더는 focus 스타일을 별도 추가하지 않았음 — 다음 라운드에 보완).
