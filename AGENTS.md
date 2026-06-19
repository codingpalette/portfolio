# AGENTS.md - Portfolio Project

## 프로젝트 개요

개발자 포트폴리오 웹사이트. Next.js 16 + React 19 + Supabase + Three.js 기반.
FSD(Feature-Sliced Design) 아키텍처를 엄격히 따른다.

## 📚 참고 문서 (반드시 먼저 읽기)

UI/디자인/컴포넌트 관련 작업을 시작하기 전에 **반드시** 다음 문서를 먼저 읽는다:

- **[DESIGN.md](./DESIGN.md)** — 디자인 시스템의 단일 진실 공급원 (SSOT).
  컬러 토큰(OKLCH), 타이포그래피(Pretendard + Geist Mono), 스페이싱, 컴포넌트 패턴,
  모션 규칙, 홈 페이지 섹션 구조, 마이그레이션 노트가 모두 여기 있다.
  새 컴포넌트/페이지를 만들 때 DESIGN.md의 토큰과 패턴을 따른다.
  **DESIGN.md와 충돌하는 코드는 작성 금지.** 충돌 발견 시 사용자에게 알린다.

- 작업 결과로 디자인 시스템이 진화하면 DESIGN.md를 같이 업데이트한다 (compound 단계).

---

## 🧬 컴파운드 엔지니어링 (Compound Engineering)

이 프로젝트는 **컴파운드 엔지니어링** 철학을 따른다.
원칙: _"모든 작업은 다음 작업을 더 쉽게 만들어야 한다."_

### 핵심 원칙

1. **취향은 시스템에 박는다, 리뷰에 박지 않는다** — 판단 기준을 AGENTS.md, 컨벤션, 자동화에 새긴다. 매번 리뷰로 잡지 말고 다시 안 나오게 만든다.
2. **시스템을 가르쳐라, 직접 다 하지 말고** — 에이전트에게 컨텍스트를 주는 시간은 복리로 돌아오고, 직접 키보드로 치는 시간은 그 작업 하나만 끝낸다.
3. **안전망을 만들어라, 게이트키퍼가 되지 마라** — 모든 줄을 사람이 보지 말고, 테스트·린트·타입체크·리뷰 에이전트로 검증을 자동화한다.
4. **계획이 새로운 코드다** — 코드보다 계획 문서가 더 중요하다. 결정을 종이 위에서 끝내야 코드에서 안 터진다.
5. **에이전트 네이티브 환경** — 내가 할 수 있는 모든 것(테스트 실행, 로그 확인, PR 생성, 스크린샷 등)을 에이전트도 할 수 있어야 한다.
6. **반복은 부끄러운 게 아니다** — 첫 시도는 보통 별로다. 빨리 반복해서 세 번째 시도가 첫 시도보다 빨리 끝나게 만든다.

### 메인 루프: Plan → Work → Review → Compound

모든 작업(버그 수정 5분이든, 기능 며칠이든)은 같은 4단계를 거친다.

#### 1️⃣ Plan (계획)

- 무엇을, 왜, 어떤 제약 안에서 만드는지 명확히 한다.
- **코드베이스 리서치**: 비슷한 기능이 어떻게 구현돼 있나? 어떤 FSD 레이어/패턴을 쓰나?
- **외부 리서치**: Next.js 16, React 19, Supabase 최신 문서 확인. 추측 금지.
- **솔루션 설계**: 어떤 파일이 바뀌는가? 어떤 경로로 가는가?
- 비자명한 변경은 `docs/plans/<날짜>-<기능>.md`에 계획을 남기고 시작한다.

#### 2️⃣ Work (실행)

- 계획대로 구현한다. 계획에 없는 리팩토링/추상화/주석 추가 금지.
- 변경마다 검증: `pnpm lint`, 타입체크, 빌드(필요 시).
- 무언가 깨지면 계획을 수정하고 계획에 적는다.

#### 3️⃣ Review (검토)

배포 전 반드시 다음 관점으로 self-review한다. 발견사항은 P1/P2/P3로 분류한다.

| 관점         | 체크포인트                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Security** | SQL injection, XSS, RLS 누락, 환경변수 노출, Supabase service role key 클라이언트 노출 여부 |
| **Performance** | N+1 쿼리, 누락된 인덱스, 불필요한 클라이언트 컴포넌트화, R3F 메모리 누수, 큰 번들          |
| **Architecture** | FSD 레이어 위반 (상위 레이어를 하위에서 import 등), barrel export 누락, "use client" 위치 |
| **Data**     | 마이그레이션 멱등성 (`IF NOT EXISTS`), RLS 정책, 트랜잭션 경계, 롤백 가능성                |
| **Simplicity** | YAGNI 위반, 불필요한 추상화, 죽은 코드, 과한 옵션                                          |
| **Agent-native** | 에이전트가 검증할 수 있는가? 테스트/로그/스크린샷으로 확인 가능한가?                      |

#### 4️⃣ Compound (복리화) — 가장 중요한 단계

이 단계가 빠지면 그냥 AI 보조 개발이지 컴파운드 엔지니어링이 아니다.

문제가 풀린 직후 자문한다:

- **무엇이 통했나? 무엇이 안 통했나?** 재사용 가능한 통찰은?
- **다음번에 시스템이 자동으로 잡아낼까?** 아니라면 가르쳐야 한다.

조치:

- 비자명한 해결책은 `docs/solutions/<카테고리>-<제목>.md`에 YAML frontmatter와 함께 기록한다.
- 같은 실수가 재발하지 않도록 AGENTS.md의 "패턴 & 안티패턴" 또는 "주의사항"에 추가한다.
- 반복 작업은 슬래시 커맨드/스킬로 추출한다.

### 작업 디렉토리

```
docs/
├── brainstorms/   # 무엇을 만들지 모를 때 — 요구사항 탐색
├── plans/         # 어떻게 만들지 — 실행 청사진
└── solutions/     # 풀린 문제의 재사용 가능한 기록 (compound 결과물)
todos/             # P1/P2/P3 발견사항, 보류된 작업
```

> 모든 비자명한 작업은 위 디렉토리에 흔적을 남긴다. 흔적이 없으면 복리가 안 쌓인다.

### 작업 전 자문 3가지

AI 출력을 승인하기 전(또는 내 결정을 확정하기 전) 항상 묻는다:

1. **가장 어려운 결정은 무엇이었나?** — 판단을 요한 부분을 드러낸다.
2. **거부한 대안은 무엇이고 왜 거부했나?** — 더 나은 길이 있었는지 점검.
3. **가장 자신 없는 부분은 어디인가?** — 약점을 미리 노출시킨다.

### 50/50 룰 (시간 배분)

- **50%** 기능 빌딩
- **50%** 시스템 개선 — 리뷰 자동화, 패턴 문서화, 컨벤션 추출, 에이전트 네이티브화

기능에만 시간을 다 쓰면 부채가 쌓인다. 시스템 개선은 사치가 아니라 미래 작업 가속화에 대한 투자다.

### 병렬화

- 독립적인 작업은 병렬로 (여러 grep, 여러 read 한번에).
- Agent 도구를 활용해 독립 리서치를 동시 진행.
- 한 작업이 막히면 다른 작업으로. AI에게 일을 시키는 동안 다음 계획을 짠다.

---

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
│   │   ├── guestbook/       # 방명록 페이지
│   │   └── profile/        # 프로필 페이지
│   ├── (auth)/             # 인증 레이아웃 그룹 (login, signup)
│   ├── api/cron/           # Vercel Cron 라우트 (Supabase keep-alive 등)
│   └── auth/callback/      # OAuth 콜백
├── shared/                 # 공유 레이어
│   ├── ui/                 # shadcn/ui 컴포넌트 (button, input, card, label)
│   ├── lib/                # 유틸리티 (cn 함수 등)
│   ├── api/supabase/       # Supabase 클라이언트 (client.ts, server.ts, user.ts)
│   └── config/             # 설정
├── entities/               # 엔티티 레이어
│   ├── user/               # 유저 타입 (Profile, Role, UserWithProfile)
│   ├── project/            # 프로젝트 타입 (Project)
│   └── guestbook/          # 방명록 타입 (GuestbookEntry)
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
CRON_SECRET=                # Vercel Cron 인증용
```

### 클라이언트 사용 규칙

- **서버 컴포넌트/Server Action**: `@shared/api/supabase/server` → `createClient()`
- **클라이언트 컴포넌트**: `@shared/api/supabase/client` → `createClient()`
- Middleware(proxy.ts): `@supabase/ssr`의 `createServerClient` 직접 사용

### DB 테이블

- `profiles` - 유저 프로필 (id, name, role, avatar_url)
- `projects` - 포트폴리오 프로젝트 (title, description, techs, category, link, github, thumbnail_url, sort_order, is_published)
- `guestbook_entries` - 방명록 (id, user_id, author_name, message, created_at)

### 마이그레이션

- `supabase/migrations/` 디렉토리에 SQL 파일 작성
- 네이밍: `YYYYMMDDHHMMSS_<설명>.sql`
- 적용: `supabase db push`
- RLS 정책 필수 포함, `IF NOT EXISTS` 사용하여 멱등성 보장

### Keep-Alive (무료 플랜 자동 일시정지 방지)

- `src/app/api/cron/keep-alive/route.ts` — 3일에 1회 `profiles` 테이블에 read 요청
- `vercel.json`에 `0 0 */3 * *` 스케줄 등록됨
- Vercel 환경변수에 `CRON_SECRET` 설정 필수

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
- 아이콘: Lucide React (이모지 사용 금지 — [DESIGN.md](./DESIGN.md) §8)
- 추가 명령: `pnpm dlx shadcn@latest add <component>`
- **shadcn 기본 토큰은 [DESIGN.md](./DESIGN.md)의 OKLCH 토큰으로 덮어쓴다.** 컴포넌트 추가 후 색/반경/패딩은 DESIGN.md 토큰에 맞춰 조정.

## 코딩 컨벤션

- 컴포넌트: `PascalCase` 함수 선언 (`function Component()` 또는 `export default function`)
- 파일명: 컴포넌트는 `PascalCase.tsx`, 훅/유틸은 `kebab-case.ts`
- Zustand 스토어: `use-<name>-store.ts` 네이밍
- 클라이언트 컴포넌트는 파일 최상단에 `"use client"` 명시
- Tailwind 클래스 결합: `cn()` 유틸리티 사용 (`clsx` + `tailwind-merge`)
- **주석은 기본적으로 작성하지 않는다** — 식별자가 충분히 설명하면 코멘트 없음. WHY가 비자명할 때만.
- **불필요한 추상화/방어 코드 금지** — 일어날 수 없는 상황에 대한 try/catch나 fallback은 만들지 않는다.

## Git 커밋 컨벤션

```
<type>(모듈명): <간단한 요약>
```

- 타입: `feat`, `fix`, `refactor`, `test`, `style`
- 모듈명과 요약은 한글로 작성
- 예시: `feat(게임): 2048 미니게임 추가`

## 패턴 & 안티패턴

> 같은 실수를 반복하지 않기 위해 이곳에 누적한다. (Compound 단계의 산출물)

### ✅ 패턴 (해야 할 것)

- **Server vs Client Supabase 클라이언트 분리**: Server Action/RSC는 `server.ts`, 클라이언트 컴포넌트는 `client.ts`.
- **게임 컴포넌트는 dynamic import + ssr:false 로더로 감싼다** — Three.js/Canvas 컴포넌트 SSR 오류 방지.
- **Vercel Cron 라우트는 `Authorization: Bearer <CRON_SECRET>` 헤더로 인증**.
- **마이그레이션은 멱등성 보장** (`IF NOT EXISTS`, `CREATE POLICY IF NOT EXISTS`).

### ❌ 안티패턴 (하지 말 것)

- FSD 레이어 역방향 import (entities에서 widgets import 등).
- 같은 레이어 간 횡단 import (entities/user → entities/project).
- 서비스 롤 키를 클라이언트 번들에 노출.
- 3D/R3F 컴포넌트를 `"use client"` 없이 사용.
- `app/` 페이지에서 UI 로직 직접 구현 (반드시 views/widgets에 위임).

## 주의사항

- Next.js 16 사용 중 (React 19 기반, App Router)
- 3D 컴포넌트(R3F)는 반드시 `"use client"` 필요
- GSAP은 `gsap.registerPlugin(useGSAP, ScrollTrigger)` 필수
- Supabase Storage 이미지는 `next.config.ts`에서 `*.supabase.co` 패턴 허용 설정됨
- 게임 컴포넌트는 `dynamic(() => import(...), { ssr: false })` 패턴의 Loader 사용
