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

## 3. Architecture: Feature-Sliced Design (FSD)

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
