# DESIGN.md — Portfolio Design System

> **Status**: Draft v1 (2026-05-19)
> **Inspirations**: [hermes-agent.org/ko](https://hermes-agent.org/ko) (1차), [toss.im](https://toss.im) (참고)
> **Audience**: 채용 담당자 / 기술 리크루터

---

## 1. Design Language

### 한 줄 정의

> 차분한 사이안 액센트 + 모노스페이스 강조 + 정보 밀도 높은 그리드의 미니멀 개발자 포트폴리오.
> 텍스트와 데이터가 주연, 모션은 조연.

### 철학

1. **타이포그래피가 일러스트레이션이다** — 큰 헤딩, 모노스페이스 라벨, 수치 강조로 시각적 임팩트를 만든다. 장식 이미지/3D 그래픽 없음.
2. **여백은 콘텐츠다** — 섹션 간 넉넉한 패딩(80–128px), 카드 안쪽도 호흡감 있게.
3. **사이안은 강조에만** — 액센트 컬러(일렉트릭 사이안)는 CTA, 활성 상태, 키워드 하이라이트, 차트 한 줄에만 쓴다. 남용 금지.

### 무드 키워드

`정밀한` · `차분한` · `읽기 좋은` · `테크니컬` · `과장 없음`

---

## 2. Color Tokens

전체 색은 OKLCH로 정의(Tailwind v4 + 현재 프로젝트 컨벤션 일치). hex는 참고용.

### 라이트 모드 (기본)

| 토큰 | OKLCH | hex 근사 | 용도 |
|------|-------|----------|------|
| `--background` | `oklch(1 0 0)` | `#FFFFFF` | 페이지 배경 |
| `--surface` | `oklch(0.985 0 0)` | `#FAFAFA` | 카드/패널 배경 |
| `--surface-muted` | `oklch(0.97 0.005 240)` | `#F4F5F7` | 코드 블록, 비활성 영역 |
| `--foreground` | `oklch(0.18 0.01 240)` | `#1A1D21` | 본문 텍스트 |
| `--foreground-muted` | `oklch(0.55 0.01 240)` | `#7C8186` | 보조 텍스트, 라벨 |
| `--border` | `oklch(0.92 0.005 240)` | `#E7E9EC` | 경계선 |
| `--border-strong` | `oklch(0.85 0.005 240)` | `#D2D5D9` | 강조 경계 |
| **`--accent`** | **`oklch(0.72 0.15 200)`** | **`#00B8D9`** | **CTA, 활성, 하이라이트** |
| `--accent-hover` | `oklch(0.65 0.16 200)` | `#0099B8` | hover 상태 |
| `--accent-subtle` | `oklch(0.95 0.04 200)` | `#E0F4F8` | 배지/하이라이트 배경 |
| `--success` | `oklch(0.72 0.16 150)` | `#22C55E` | 성공 |
| `--warning` | `oklch(0.78 0.15 75)` | `#F59E0B` | 경고 |
| `--destructive` | `oklch(0.58 0.22 25)` | `#DC2626` | 위험/삭제 |

### 다크 모드

| 토큰 | OKLCH | hex 근사 | 용도 |
|------|-------|----------|------|
| `--background` | `oklch(0.14 0.01 240)` | `#0B0D10` | 페이지 배경 |
| `--surface` | `oklch(0.18 0.01 240)` | `#15181C` | 카드/패널 |
| `--surface-muted` | `oklch(0.22 0.01 240)` | `#1B1F23` | 코드 블록 |
| `--foreground` | `oklch(0.96 0.005 240)` | `#F1F3F5` | 본문 |
| `--foreground-muted` | `oklch(0.65 0.01 240)` | `#9CA1A6` | 보조 |
| `--border` | `oklch(1 0 0 / 8%)` | `rgba(255,255,255,0.08)` | 경계 |
| `--border-strong` | `oklch(1 0 0 / 15%)` | `rgba(255,255,255,0.15)` | 강조 경계 |
| **`--accent`** | **`oklch(0.78 0.16 200)`** | **`#22D3EE`** | **CTA, 활성, 하이라이트** |
| `--accent-hover` | `oklch(0.84 0.14 200)` | `#67E8F9` | hover |
| `--accent-subtle` | `oklch(0.28 0.06 200)` | `#0E2A33` | 배지/하이라이트 배경 |

### 컬러 사용 원칙

- **사이안은 한 화면에 3곳 이하** — CTA, 현재 활성 메뉴, 키 메트릭 강조 정도.
- 본문 링크는 사이안이 아닌 `--foreground` + 밑줄. hover 시에만 사이안.
- 차트는 회색조 기반 + 가장 중요한 한 줄만 사이안.
- 카드 분리는 그림자가 아닌 `--border` 로 처리 (Hermes 스타일).
- 그림자는 모달/툴팁/드롭다운에만.

---

## 3. Typography

### 폰트

| 용도 | 폰트 | 비고 |
|------|------|------|
| **본문/헤딩 (한글·영문)** | **Pretendard Variable** | `100~900` 가변. `@fontsource-variable/pretendard` 또는 CDN |
| **코드/수치/모노 라벨** | **Geist Mono** | Next 기본, 현재 설정 유지 |

### 타입 스케일 (1.250 modular scale, 반응형)

| 토큰 | 모바일 | 데스크탑 | 굵기 | 자간 | 용도 |
|------|--------|----------|------|------|------|
| `--text-display` | `3rem` (48px) | `4.5rem` (72px) | 700 | `-0.02em` | Hero 메인 |
| `--text-h1` | `2rem` (32px) | `2.5rem` (40px) | 700 | `-0.015em` | 섹션 제목 |
| `--text-h2` | `1.5rem` (24px) | `1.875rem` (30px) | 600 | `-0.01em` | 서브섹션 |
| `--text-h3` | `1.25rem` (20px) | `1.5rem` (24px) | 600 | `-0.005em` | 카드 제목 |
| `--text-body` | `1rem` (16px) | `1rem` (16px) | 400 | `0` | 본문 |
| `--text-body-lg` | `1.125rem` (18px) | `1.125rem` (18px) | 400 | `0` | 리드 문단 |
| `--text-sm` | `0.875rem` (14px) | `0.875rem` (14px) | 400 | `0` | 보조 |
| `--text-xs` | `0.75rem` (12px) | `0.75rem` (12px) | 500 | `0.02em` | 라벨/메타 |
| `--text-mono` | `0.875rem` (14px) | `0.875rem` (14px) | 500 | `0` | 코드/수치 |

### 행간

- 본문: `1.7` (한글 가독성)
- 헤딩: `1.2`
- 라벨/메타: `1.4`

### 헤딩 규칙

- h1·h2는 항상 `font-weight: 700` + 음의 자간 — 큰 글씨일수록 자간을 조여 정밀한 느낌.
- 숫자/메트릭은 Geist Mono + `font-variant-numeric: tabular-nums`.
- 헤딩 옆 보조 라벨은 모노스페이스 대문자 라벨 (예: `WORK · 2024`).

### 텍스트 색 위계

```
foreground          ── 본문, 헤딩 (98% 사용)
foreground-muted    ── 보조 텍스트, 캡션, 메타 (15%)
accent              ── 키워드 인라인 하이라이트 (드물게)
```

### 시그니처 패턴 — "라벨 + 헤딩"

```
─ FEATURES               ← 모노 라벨 (xs, muted, tracking ↑)
주요 기술 스택            ← H1 (대형, bold, 음의 자간)
```

모든 섹션 헤더의 기본형으로 채택. 박스 드로잉 캐릭터 `─`는 라벨 앞에 항상 붙임.

---

## 4. Spacing & Radius

### 스페이싱 스케일 (4px 베이스)

| 토큰 | 값 | Tailwind | 용도 |
|------|----|----|------|
| `--space-1` | 4px | `1` | 아이콘 내부, 칩 패딩 |
| `--space-2` | 8px | `2` | 인라인 요소 |
| `--space-3` | 12px | `3` | 작은 컴포넌트 |
| `--space-4` | 16px | `4` | 기본 패딩 |
| `--space-6` | 24px | `6` | 카드 내부 |
| `--space-8` | 32px | `8` | 카드 간 간격 |
| `--space-12` | 48px | `12` | 그룹 분리 |
| `--space-16` | 64px | `16` | 작은 섹션 |
| `--space-20` | 80px | `20` | 섹션 수직 (모바일) |
| `--space-32` | 128px | `32` | **섹션 수직 (데스크탑) — 시그니처** |

### 컨테이너 너비

| 토큰 | 값 | 용도 |
|------|----|------|
| `--container-narrow` | `680px` | 글/문서 단일 컬럼 (블로그, 약력) |
| `--container-default` | `1080px` | 대부분 섹션 (히어로, 프로젝트 그리드) |
| `--container-wide` | `1280px` | 풀와이드 그리드 (대시보드, 카탈로그) |

- 양옆 패딩: 모바일 `16px`, 태블릿 `24px`, 데스크탑 `32px`
- 컨테이너는 중앙 정렬, `padding-inline` 사용

### 그리드

- 기본 12컬럼, 갭 `24px` (데스크탑) / `16px` (모바일)
- 프로젝트 카드: 데스크탑 3컬럼 / 태블릿 2컬럼 / 모바일 1컬럼
- 스킬 배지: 자동 줄바꿈 플렉스 (`flex-wrap`, gap `8px`)

### 반경 (Radius)

| 토큰 | 값 | 용도 |
|------|----|------|
| `--radius-sm` | 4px | 배지, 인풋, 작은 버튼 |
| `--radius-md` | 6px | 기본 버튼, 카드 내부 요소 |
| `--radius-lg` | 8px | **카드, 모달 (기본)** |
| `--radius-xl` | 12px | 큰 패널, 미디어 |
| `--radius-full` | 9999px | 아바타, 도트, 칩 |

> 토스의 12–16px 라운드는 채택하지 않음. Hermes 톤에 맞춘 절제된 둥글기.

### 시그니처 — "차분한 카드"

```
배경:    --surface
보더:    1px solid --border  (그림자 X)
반경:    8px
패딩:    24px
hover:   보더만 --border-strong 으로 진하게
```

---

## 5. Layout Patterns

### 글로벌 레이아웃

```
┌─────────────────────────────────────────────────┐
│  Header (sticky, 64px, --border bottom)         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Main (max-width: 1080px, 중앙 정렬)             │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer (--border top)                          │
└─────────────────────────────────────────────────┘
```

**Header**:
- 64px 고정, sticky, 스크롤 시 `backdrop-blur` + 반투명 배경
- 좌측: 이름 (모노 폰트, `font-weight: 600`)
- 우측: 텍스트 nav (Projects / Blog / Games / Guestbook) + 다크모드 토글
- 모바일: 햄버거 → 풀스크린 시트

**Footer**:
- 3컬럼: 소개 한 줄 / 컨택트 (GitHub, Email, LinkedIn) / 빌드 정보 (버전·커밋 SHA, 모노)

### 홈 페이지 섹션 구조 (채용 중심 집중형)

```
1. HERO
   ─ INTRODUCTION
   Front-end Developer building 3D 인터랙티브 웹과
   견고한 백엔드를 이어주는 개발자.
   [ Get in touch → ]  [ View projects ]
   ─────────────────────────────
   msbfms@gmail.com · Seoul, KR

2. STATS
   ┌────────┬────────┬────────┬────────┐
   │  +5    │  20+   │  3     │  100%  │
   │ years  │ projs  │ prods  │ shipped│
   └────────┴────────┴────────┴────────┘

3. STACK
   ─ TECH STACK
   자주 쓰는 기술
   Frontend  [Next.js] [React] [TS] ...
   Backend   [Node] [Supabase] [Postgres]
   3D / UI   [Three.js] [GSAP] [Tailwind]

4. SELECTED WORK
   ─ SELECTED WORK · 2024–2026
   대표 프로젝트
   ┌──────┬──────┬──────┐  3컬럼 카드
   │ thumb│ thumb│ thumb│  hover → border만 진하게
   │ 제목  │ 제목  │ 제목  │
   │ 한 줄│ 한 줄│ 한 줄│
   │[배지] │[배지] │[배지] │
   └──────┴──────┴──────┘
   [ See all projects → ]

5. EXPERIENCE
   ─ EXPERIENCE
   이력
   2024 — Present  │  Company A
                   │  Senior Frontend Engineer
                   │  · 임팩트 한 줄
                   ─────────────────
   2022 — 2024     │  Company B
                   │  ...

6. CONTACT
   ─ GET IN TOUCH
   같이 만들 거리가 있다면 연락주세요.
   [ msbfms@gmail.com ↗ ]
   [ GitHub ] [ LinkedIn ]
```

### 시그니처 레이아웃 규칙

1. 모든 섹션 헤더에 모노 라벨 (`─ SECTION NAME`).
2. 섹션 수직 패딩: 데스크탑 `128px` / 모바일 `80px`.
3. 본문 max-width `680px`, 헤딩은 자유롭게 더 넓게.
4. 사이안 액센트는 페이지당 5곳 이하.

### 보조 페이지 레이아웃

- `/projects` — 풀 그리드 (1280px), 카테고리 필터는 모노 텍스트.
- `/blog` — 본문 단일 컬럼 (680px), 사이드바 없음.
- `/games`, `/guestbook` — 기존 기능 유지 + 동일 디자인 토큰 적용.

---

## 6. Components

### Button

| 변형 | 배경 | 텍스트 | 보더 | 용도 |
|------|------|--------|------|------|
| `primary` | `--accent` | `white` | 없음 | 페이지당 1개, 최우선 CTA |
| `secondary` | `transparent` | `--foreground` | `--border-strong` | 보조 CTA |
| `ghost` | `transparent` | `--foreground-muted` | 없음 | 텍스트 버튼, 인라인 |
| `danger` | `--destructive` | `white` | 없음 | 삭제 |

**공통**:
- 높이: `36px` (sm) / `40px` (md, 기본) / `48px` (lg)
- 반경: `--radius-md` (6px)
- 패딩: `12px 20px`
- 폰트: `text-sm`, `font-weight: 500`
- hover: 배경 1단계 어둡게, transform 없음
- focus: `2px outline --accent`, `outline-offset: 2px`

### Badge / Tag (스택 표시)

```
┌─────────────┐
│  TypeScript │   모노 폰트, xs, --foreground-muted
└─────────────┘   1px solid --border, --radius-full
                   padding: 2px 10px
```

- 호버 없음 (읽기 전용).
- 인터랙티브 필터일 때만 `--accent-subtle` 배경 + `--accent` 텍스트로 활성.

### Card

```
보더:    1px solid --border
배경:    --surface
반경:    --radius-lg (8px)
패딩:    24px
전환:    border-color 0.15s
hover:   border-color → --border-strong (그림자 X)
```

### Code Block (시그니처)

- 배경 `--surface-muted`, 반경 `--radius-md`, 패딩 `16px 20px`.
- 상단 우측에 언어 라벨 (모노, xs, muted).
- 좌측에 `1px` 사이안 세로 보더 (시그니처).

### Stat / Metric Card

```
┌─────────────────┐
│  +5             │   Geist Mono, 56px, 600 (선택적 사이안)
│                 │
│  YEARS          │   xs, tracking +, muted
└─────────────────┘
```

### Section Header

```tsx
<header>
  <p className="font-mono text-xs tracking-wider text-foreground-muted">
    ─ {label}
  </p>
  <h2 className="text-h1 font-bold tracking-tight mt-2">
    {title}
  </h2>
</header>
```

### Theme Toggle

- 헤더 우측, `36px` 정사각형 ghost 버튼.
- Lucide `Sun` / `Moon` 아이콘, 클릭 시 root에 `.dark` 토글.

---

## 7. Motion

### 철학

> 움직임은 의미를 전달할 때만. 장식 모션 금지.

### 허용되는 모션

| 트리거 | 동작 | 지속시간 |
|--------|------|----------|
| 페이지 진입 | 섹션이 아래에서 8px 위로 + fade-in, stagger 60ms | 400ms `ease-out` |
| 버튼 hover | 배경색만 전환 | 150ms `ease-out` |
| 카드 hover | 보더색만 전환 | 150ms `ease-out` |
| 모달/시트 | fade + 8px translate | 200ms `ease-out` |
| 테마 전환 | `color`, `background-color` 전환 | 200ms |
| 활성 nav 인디케이터 | 사이안 underline 좌→우 슬라이드 | 200ms `ease-out` |

### 금지

- 무한 회전/맥동 (장식 헤더, 배경 파티클 등).
- parallax 스크롤 — 정보 우선 사이트에 산만함.
- scale 변환 hover (Hermes 차분함과 충돌).
- 큰 컴포넌트 슬라이드 인.

### GSAP / ScrollTrigger 사용

- **유지**: 섹션 진입 페이드 + 작은 translate에만 사용.
- **제거**: 기존 Hero3D의 스크롤 연동 회전, 카메라 무브 등.
- 사용 시 `prefers-reduced-motion` 미디어 쿼리 존중 필수.

---

## 8. Imagery / Iconography

- 프로젝트 썸네일: `16:9`, `object-cover`, `--radius-lg`.
- 아바타: 원형, `--border` 1px.
- 아이콘: **Lucide React**, stroke `1.5`, 크기 `16/20/24px`.
- **이모지 사용 금지** — Hermes 톤 유지. Lucide 아이콘만.

---

## 9. Accessibility

- 본문 대비 **4.5:1** 이상, 큰 텍스트 3:1 이상 (WCAG AA).
- 모든 인터랙티브 요소 focus 가시화 (사이안 outline).
- `prefers-reduced-motion: reduce` 존중 — 모든 진입 애니메이션 비활성.
- 헤더 nav 키보드 접근 (`Tab`, `Enter`, `Space`) 보장.
- 색상에만 의존하지 않기 — 활성 상태는 색 + underline/아이콘 병행.

---

## 10. Migration Notes (현행 → 신규)

### 제거되는 것

- `src/widgets/hero/Hero3D` 의 Three.js 의존 (별도 페이지에서만 활용 검토).
- shadcn neutral 기본 팔레트 (덮어쓰기).
- 그림자 기반 카드 스타일.

### 유지되는 것

- shadcn/ui new-york 컴포넌트 base.
- FSD 아키텍처 / Path Alias.
- 게임/방명록/리더보드 기능 (디자인 토큰만 새로 적용).

### 새로 추가되는 것

- Pretendard Variable 폰트.
- Theme Toggle 컴포넌트.
- `─` 라벨 패턴 헬퍼 컴포넌트 (`<SectionHeader label="..." title="..." />`).
- OKLCH 디자인 토큰 (CSS 변수, light/dark).

---

## 11. Open Questions (구현 시 확정)

- Hero3D 의 Three.js 코드는 완전 삭제할지, `/lab` 같은 별도 라우트로 옮길지.
- Stats 섹션의 수치(연차, 프로젝트 수 등)는 정적값으로 둘지, Supabase에서 동적으로 가져올지.
- 블로그 코드 하이라이팅 라이브러리(현 Plate 에디터 외) 선택.
