# Portfolio

Next.js 16 + React 19 기반의 개발자 포트폴리오 웹사이트입니다.
Three.js 3D 인터랙션, 5종 미니게임, 방명록, 역할 기반 관리자 패널을 포함하며, FSD(Feature-Sliced Design) 아키텍처를 적용했습니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **DB / Auth** | Supabase (PostgreSQL, Auth, Storage) |
| **3D / 애니메이션** | Three.js, React Three Fiber, React Three Drei, GSAP + ScrollTrigger |
| **상태관리** | Zustand 5 (클라이언트), TanStack Query v5 (서버) |
| **스타일링** | Tailwind CSS v4, shadcn/ui (new-york), Lucide React |
| **패키지 매니저** | pnpm |

## 주요 기능

### 3D Hero 섹션
- React Three Fiber 기반 인터랙티브 3D 캔버스
- 스크롤에 따라 전환되는 3개의 3D 모델 (React Logo, AI Brain, Builder Orchestrator)
- GSAP ScrollTrigger를 활용한 스크롤 기반 애니메이션
- 반응형 지원 (데스크톱: 수평 슬라이드, 모바일: 수직)

### 미니게임 (5종)
| 게임 | 설명 |
|------|------|
| **2048** | 타일 합치기 퍼즐 |
| **Racing** | React Three Fiber 기반 3D 레이싱 |
| **Tetris** | 클래식 테트리스 |
| **Snake** | 레트로 스네이크 |
| **Minesweeper** | 난이도별 지뢰찾기 |

- 각 게임별 Zustand 스토어로 게임 상태 관리
- Supabase `game_scores` 테이블에 점수 저장
- 게임별/난이도별 리더보드

### 방명록
- 인증된 사용자 작성, 공개 열람
- 관리자 삭제 권한
- Supabase RLS 정책으로 권한 제어

### 인증 & 권한
- Supabase Auth (이메일/비밀번호)
- 역할 계층: `guest` < `user` < `admin`
- Middleware(`proxy.ts`)에서 라우트별 접근 제어
- Zustand `useAuthStore`로 클라이언트 인증 상태 관리

### 관리자 패널
- 프로젝트 CRUD (제목, 설명, 기술 태그, 카테고리, 링크, 썸네일 등)
- 정렬 순서 및 공개 여부 관리

## 프로젝트 구조 (FSD)

```
src/
├── app/                    # Next.js App Router (라우트 정의)
│   ├── (auth)/             # 인증 레이아웃 (login, signup)
│   ├── (main)/             # 메인 레이아웃 (Header 포함)
│   │   ├── admin/          # 관리자 페이지
│   │   ├── dashboard/      # 대시보드
│   │   ├── games/          # 미니게임 (2048, racing, tetris, snake, minesweeper)
│   │   ├── guestbook/      # 방명록
│   │   └── profile/        # 프로필
│   └── auth/callback/      # OAuth 콜백
├── shared/                 # 공유 레이어 (UI, 유틸, Supabase 클라이언트)
├── entities/               # 엔티티 레이어 (user, project, guestbook, game-score)
├── features/               # 기능 레이어 (auth, game-score)
├── widgets/                # 위젯 레이어 (header, hero, projects, leaderboard 등)
└── views/                  # 뷰 레이어 (페이지별 UI, 게임 컴포넌트)
```

**FSD 레이어 규칙**: `app → views → widgets → features → entities → shared` (상위 → 하위만 import 가능)

## 라우트

| 경로 | 설명 | 접근 권한 |
|------|------|-----------|
| `/` | 홈 (3D Hero + About + 프로젝트 갤러리) | 공개 |
| `/games` | 게임 허브 | 공개 |
| `/games/:game` | 개별 게임 | 공개 |
| `/guestbook` | 방명록 | 읽기: 공개 / 쓰기: user+ |
| `/login`, `/signup` | 로그인, 회원가입 | 비로그인 |
| `/profile` | 프로필 수정 | user+ |
| `/dashboard` | 대시보드 | user+ |
| `/admin` | 관리자 패널 | admin |

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm
- Supabase 프로젝트

### 환경변수

`.env.local` 파일을 생성하고 아래 변수를 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 린트 실행
pnpm lint
```

### DB 마이그레이션

```bash
# Supabase CLI로 마이그레이션 적용
supabase db push
```

마이그레이션 파일은 `supabase/migrations/`에 위치합니다.

- `guestbook_entries` - 방명록 테이블 + RLS 정책
- `game_scores` - 게임 점수 테이블 + 리더보드 인덱스

## Path Alias

```
@/*         → ./src/*
@shared/*   → ./src/shared/*
@entities/* → ./src/entities/*
@features/* → ./src/features/*
@widgets/*  → ./src/widgets/*
@views/*    → ./src/views/*
```
