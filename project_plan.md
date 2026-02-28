# Project Blueprint: Developer Portfolio (FSD + R3F + Supabase)

## 1. Project Overview
* **Project Name:** `portfolio`
* **Goal:** Build a high-performance, interactive developer portfolio website using Next.js 16, 3D graphics, and Supabase.
* **Key Characteristic:** Strict Feature-Sliced Design (FSD) architecture, 3D interactions, and dynamic content via Supabase.

## 2. Tech Stack

### Core Framework & Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x (Canary) | App Router, Server Actions |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| **Supabase** | **Latest** | **Database (Postgres), Auth, Storage (3D Assets)** |
| pnpm | Latest | Package Manager |

### 3D & Creative
| Technology | Purpose |
|------------|---------|
| Three.js | Core 3D Engine |
| React Three Fiber (R3F) | React renderer for Three.js |
| React Three Drei | Useful helpers for R3F |

### State Management
| Technology | Purpose |
|------------|---------|
| Zustand | Client-side global state |
| TanStack Query v5 | Server state management |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| Tailwind CSS v4 | Utility-first CSS |
| shadcn/ui | Reusable components |
| Lucide React | Icons |

## 3. Database Migration Convention

Supabase DB 스키마 변경이 필요할 경우, 프로젝트 루트의 `supabase/migrations/` 디렉토리에 SQL 파일을 작성한다.

### 디렉토리 구조
```text
supabase/
└── migrations/
    ├── 20260228000001_create_profiles.sql
    ├── 20260228000002_create_projects.sql
    └── ...
```

### 파일 네이밍 규칙
- 형식: `YYYYMMDDHHMMSS_<설명>.sql`
- 타임스탬프는 생성 시점 기준, 설명은 영문 snake_case
- 예시: `20260228120000_create_guestbook_entries.sql`

### 적용 방법
```bash
# Supabase CLI로 마이그레이션 적용
supabase db push

# 또는 특정 마이그레이션만 적용
supabase migration up
```

### 작성 규칙
- 각 SQL 파일은 하나의 논리적 변경 단위를 포함한다
- 테이블 생성 시 RLS(Row Level Security) 정책을 함께 작성한다
- `IF NOT EXISTS` / `IF EXISTS`를 활용하여 멱등성을 보장한다

## 4. Architecture: Feature-Sliced Design (FSD)

### Layer Structure
```text
src/
├── app/                  
├── shared/               
│   ├── ui/               
│   ├── lib/              
│   ├── api/              
│   │   └── supabase/     # Supabase client setup (Server/Client)
│   └── config/           
├── entities/             # e.g., Project, GuestbookEntry
├── features/             # e.g., WriteGuestbook, ToggleTheme
├── widgets/              
└── views/


qPijTEABn3GL8JdY
