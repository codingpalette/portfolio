# CLAUDE.md - Portfolio Project

## 프로젝트 개요

개발자 포트폴리오 웹사이트. Next.js 16 + React 19 + Supabase + Three.js 기반.
FSD(Feature-Sliced Design) 아키텍처를 엄격히 따른다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router), React 19, TypeScript 5
- **DB/Auth**: Supabase (Postgres, Auth, Storage)
- **3D**: Three.js, React Three Fiber, React Three Drei
- **애니메이션**: GSAP + ScrollTrigger
- **상태관리**: Zustand (클라이언트), TanStack Query v5 (서버)
- **스타일링**: Tailwind CSS v4, shadcn/ui (new-york 스타일)
- **패키지 매니저**: pnpm

## 빌드 & 실행

```bash
pnpm install        # 의존성 설치
pnpm dev            # 개발 서버 (localhost:3000)
pnpm build          # 프로덕션 빌드
pnpm lint           # ESLint 실행
```

## 디렉토리 구조 (FSD)

```
src/
├── app/                    # Next.js App Router (라우트 정의만)
│   ├── (main)/             # 메인 레이아웃 그룹 (Header 포함)
│   │   ├── admin/          # 관리자 페이지 (role: admin)
│   │   ├── games/          # 미니게임 (2048, 레이싱, 테트리스, 지뢰찾기, 스네이크)
│   │   └── profile/        # 프로필 페이지
│   ├── (auth)/             # 인증 레이아웃 그룹 (login, signup)
│   └── auth/callback/      # OAuth 콜백
├── shared/                 # 공유 레이어
│   ├── ui/                 # shadcn/ui 컴포넌트 (button, input, card, label)
│   ├── lib/                # 유틸리티 (cn 함수 등)
│   ├── api/supabase/       # Supabase 클라이언트 (client.ts, server.ts, user.ts)
│   └── config/             # 설정
├── entities/               # 엔티티 레이어
│   ├── user/               # 유저 타입 (Profile, Role, UserWithProfile)
│   └── project/            # 프로젝트 타입 (Project)
├── features/               # 기능 레이어
│   └── auth/               # 인증 (AuthProvider, RequireRole, useAuthStore)
├── widgets/                # 위젯 레이어
│   ├── header/             # Header (네비게이션, 유저 메뉴)
│   ├── hero/               # Hero3D (3D 히어로 + 스크롤 애니메이션)
│   └── projects/           # ProjectGallery (프로젝트 카드 그리드)
└── views/                  # 뷰 레이어 (페이지별 UI 구현)
    ├── auth/               # 로그인/회원가입 폼
    ├── admin/              # 프로젝트 CRUD 폼
    ├── profile/            # 프로필 폼
    └── games/              # 게임별 컴포넌트 + Zustand 스토어
```

## FSD 레이어 규칙

- **상위 레이어는 하위 레이어만 import 가능** (app → views → widgets → features → entities → shared)
- **같은 레이어 간 import 금지** (entities/user ↛ entities/project)
- `app/` 페이지 파일은 라우트 정의와 데이터 페칭만 수행, UI 구현은 views/widgets에 위임
- 각 모듈은 `index.ts` barrel export 사용

## Path Alias

```
@/*        → ./src/*
@shared/*  → ./src/shared/*
@entities/* → ./src/entities/*
@features/* → ./src/features/*
@widgets/* → ./src/widgets/*
@views/*   → ./src/views/*
```

## Supabase

### 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 클라이언트 사용 규칙

- **서버 컴포넌트/Server Action**: `@shared/api/supabase/server` → `createClient()`
- **클라이언트 컴포넌트**: `@shared/api/supabase/client` → `createClient()`
- Middleware(proxy.ts): `@supabase/ssr`의 `createServerClient` 직접 사용

### DB 테이블

- `profiles` - 유저 프로필 (id, name, role, avatar_url)
- `projects` - 포트폴리오 프로젝트 (title, description, techs, category, link, github, thumbnail_url, sort_order, is_published)

### 마이그레이션

- `supabase/migrations/` 디렉토리에 SQL 파일 작성
- 네이밍: `YYYYMMDDHHMMSS_<설명>.sql`
- 적용: `supabase db push`
- RLS 정책 필수 포함, `IF NOT EXISTS` 사용하여 멱등성 보장

## 인증 & 권한

- Supabase Auth 기반 (email/password)
- `proxy.ts` (Middleware)에서 라우트 보호:
  - `/admin/*` → role: admin 필요
  - `/dashboard`, `/profile` → role: user 이상
  - `/login`, `/signup` → 로그인 상태면 홈으로 리다이렉트
- 역할 계층: guest(0) < user(1) < admin(2)
- 클라이언트 인증 상태: `useAuthStore` (Zustand)

## shadcn/ui 설정

- 스타일: new-york
- 컴포넌트 경로: `@shared/ui`
- 유틸리티 경로: `@shared/lib/utils`
- 아이콘: Lucide React
- 추가 명령: `pnpm dlx shadcn@latest add <component>`

## 코딩 컨벤션

- 컴포넌트: `PascalCase` 함수 선언 (`function Component()` 또는 `export default function`)
- 파일명: 컴포넌트는 `PascalCase.tsx`, 훅/유틸은 `kebab-case.ts`
- Zustand 스토어: `use-<name>-store.ts` 네이밍
- 클라이언트 컴포넌트는 파일 최상단에 `"use client"` 명시
- Tailwind 클래스 결합: `cn()` 유틸리티 사용 (`clsx` + `tailwind-merge`)

## Git 커밋 컨벤션

```
<type>(모듈명): <간단한 요약>
```

- 타입: `feat`, `fix`, `refactor`, `test`, `style`
- 모듈명과 요약은 한글로 작성
- 예시: `feat(게임): 2048 미니게임 추가`

## 주의사항

- Next.js 16 사용 중 (React 19 기반, App Router)
- 3D 컴포넌트(R3F)는 반드시 `"use client"` 필요
- GSAP은 `gsap.registerPlugin(useGSAP, ScrollTrigger)` 필수
- Supabase Storage 이미지는 `next.config.ts`에서 `*.supabase.co` 패턴 허용 설정됨
- 게임 컴포넌트는 `dynamic(() => import(...), { ssr: false })` 패턴의 Loader 사용
