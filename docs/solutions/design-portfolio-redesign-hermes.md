---
title: "포트폴리오를 Hermes 톤으로 재디자인"
category: "design"
tags: [design-system, oklch, tailwind-v4, pretendard, fsd]
date: 2026-05-19
---

## 문제

- 기존 shadcn 기본(neutral) 팔레트 + Geist 폰트로는 한글 가독성과 시각적 차별점이 부족.
- Three.js Hero3D가 정보 우선 사이트(채용 담당자 타겟)와 톤이 맞지 않음 — 첫 화면이 무겁고 메시지 전달이 약함.
- 23개 파일에 `text-cyan-*`, `bg-cyan-*`, `text-purple-*` 등 하드코딩된 데코 색이 누적돼 디자인 진화가 어려웠음.

## 해결책

- **DESIGN.md를 SSOT로 도입.** 모든 토큰(OKLCH 컬러, 타이포 스케일, 스페이싱, 모션 규칙)을 한곳에 모으고 CLAUDE.md에서 강제 참조하도록 연결.
- **globals.css 전면 교체.** `:root` / `.dark` 블록을 OKLCH 토큰으로 갈아끼우고 shadcn 호환 매핑(`--card`, `--popover` 등)을 새 토큰에 위임 → 23개 파일의 색을 일괄 토큰화 가능.
- **Pretendard Variable.** npm에 `@fontsource-variable/pretendard`는 없고 공식 `pretendard` 패키지의 `dist/web/variable/pretendardvariable.css` 경로를 import해야 함. 코드는 Geist Mono 유지.
- **Hero3D를 /lab 라우트로 격리.** 홈은 타이포그래픽 Hero(`HeroTypographic`)로 교체. Hero3D는 Server Component에서 `dynamic({ ssr:false })` 직접 사용 불가이므로 `Hero3DLoader.tsx`라는 `"use client"` 래퍼를 한 단계 추가.
- **`─ LABEL` + 제목 패턴을 시그니처로.** `SectionHeader` 공통 컴포넌트로 모든 섹션 헤더를 통일. 작은 모노 라벨에 박스 드로잉 캐릭터 `─`를 항상 붙임.
- **카드/버튼 그림자 제거.** DESIGN.md §4 "차분한 카드" — `border` 만으로 분리. shadow는 모달/드롭다운에만.
- **20개 태스크를 7 Phase로 단계화.** subagent-driven으로 디스패치, 빌드/린트 검증을 매 단계마다 수행.

## 재발 방지

- **CLAUDE.md의 "📚 참고 문서" 섹션이 DESIGN.md를 "반드시 먼저 읽기"로 강제.** UI 작업 전 진입점에서 멈춤.
- **shadcn 컴포넌트 추가 시 토큰 정렬 규칙이 명문화.** 사람/AI가 새 컴포넌트를 추가해도 색·반경·패딩이 자동으로 DESIGN.md를 따름.
- **하드코딩 색을 막는 grep 패턴:** `rg "text-cyan-|bg-cyan-|text-sky-|bg-sky-|text-purple-|bg-purple-"` 가 비어야 정상. 향후 도입할 색은 DESIGN.md에 토큰으로 먼저 정의.
- **Phase 7 compound 단계가 계획서 안에 명시.** 매 디자인 진화 후 solutions 기록 + DESIGN.md 업데이트.

## 운영 노트 (다음 사람을 위한 함정 가이드)

- **Tailwind v4 + shadcn 토큰 매핑**: `@theme inline` 블록의 `--color-*` 매핑이 토큰 노출 통로다. 새 색을 추가하면 `:root` / `.dark` 변수 정의 + `@theme inline` 매핑을 모두 갱신해야 클래스 자동완성/사용이 가능.
- **next-themes `defaultTheme`** 을 `dark` → `light` 로 바꾸면 첫 렌더에서 스킵 깜빡임이 거의 사라짐 (Hermes 톤이 라이트 기본이라 잘 맞음).
- **Server Component에서 `dynamic({ ssr:false })`** 는 Next.js 16에서 금지. 클라이언트 래퍼(Loader)를 한 겹 두는 패턴이 정석.
- **`text-white` 같은 절대 색**도 시맨틱 토큰(`text-destructive-foreground`)으로 빼는 것이 다크 모드 대비 안전.

## 참고

- [DESIGN.md](../../DESIGN.md) — 단일 진실 공급원
- [CLAUDE.md](../../CLAUDE.md) §"참고 문서" — DESIGN.md 강제 참조 규칙
- [docs/plans/2026-05-19-portfolio-redesign.md](../plans/2026-05-19-portfolio-redesign.md) — 20 태스크 7 Phase 구현 계획
- `src/app/globals.css` — OKLCH 토큰 정의
- `src/shared/ui/section-header.tsx`, `stack-badge.tsx`, `stat-card.tsx` — 시그니처 패턴 컴포넌트
- 브랜치 `redesign/hermes-tone` (19 commits, base: `main` `9cc5083`)
