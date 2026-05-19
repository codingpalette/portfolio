# docs/

컴파운드 엔지니어링 작업 디렉토리.

## 구조

- **brainstorms/** — 무엇을 만들지 모를 때 요구사항을 탐색한 결과
- **plans/** — 어떻게 만들지에 대한 실행 청사진 (`YYYYMMDD-<기능>.md`)
- **solutions/** — 풀린 문제의 재사용 가능한 기록. compound 단계의 산출물

## solutions/ 파일 포맷

```markdown
---
title: "문제 제목"
category: "supabase | nextjs | fsd | 3d | game | auth | ..."
tags: [태그1, 태그2]
date: 2026-05-19
---

## 문제
무엇이 문제였는가.

## 해결책
어떻게 풀었는가.

## 재발 방지
다음번에 시스템(CLAUDE.md, 컨벤션, 테스트, 자동화)이 어떻게 자동으로 잡을 것인가.

## 참고
- 관련 파일: `path/to/file.ts`
- 관련 PR/커밋: ...
```
