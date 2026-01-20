# Hono RPC + Next.js BFF 모노레포

Turborepo 기반 모노레포 아키텍처로 구현한 Todo 애플리케이션입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 모노레포 | Turborepo + pnpm workspace |
| 백엔드 | Hono + @hono/zod-validator |
| 프론트엔드 | Next.js 16 + React 19 |
| 스타일링 | Tailwind CSS v4 |
| 스키마 | Zod (End-to-End 타입 안전성) |
| 테스트 | Vitest (단위) + Playwright (E2E) |
| 최적화 | React Compiler |

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   apps/web (Next.js)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    App Layer                            │ │
│  │              (app/todos/page.tsx)                       │ │
│  └────────────────────────┬───────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼───────────────────────────────┐ │
│  │                 Features Layer                          │ │
│  │  ┌─────────────┐  ┌─────────────┐                      │ │
│  │  │ components/ │  │  services/  │  ← Server Actions    │ │
│  │  │ (UI 렌더링) │  │ (BFF 로직)  │                      │ │
│  │  └─────────────┘  └──────┬──────┘                      │ │
│  └──────────────────────────┼─────────────────────────────┘ │
│                             │                                │
│  ┌──────────────────────────▼─────────────────────────────┐ │
│  │                   Infra Layer                           │ │
│  │            (Hono RPC Client Factory)                    │ │
│  └──────────────────────────┬─────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTP (hc RPC)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     apps/api (Hono)                          │
│                   (REST API + RPC 타입)                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   packages/shared                            │
│              (Zod Schema + TypeScript Types)                 │
└─────────────────────────────────────────────────────────────┘
```

## 프로젝트 구조

```
my-monorepo/
├── apps/
│   ├── api/                    # Hono 백엔드
│   │   ├── src/
│   │   │   ├── app.ts          # Hono 앱 (테스트 가능)
│   │   │   ├── app.test.ts     # API 단위 테스트
│   │   │   └── index.ts        # 서버 진입점
│   │   └── vitest.config.ts
│   │
│   └── web/                    # Next.js 프론트엔드
│       ├── src/
│       │   ├── app/            # App Router 페이지
│       │   ├── features/       # 기능별 모듈
│       │   │   └── todo/
│       │   │       ├── components/
│       │   │       └── services/   # Server Actions
│       │   └── infra/          # 인프라 레이어
│       │       └── api/        # Hono RPC 클라이언트
│       ├── e2e/                # E2E 테스트
│       └── playwright.config.ts
│
├── packages/
│   ├── shared/                 # 공유 스키마 및 타입
│   │   └── src/schema/
│   │       └── todo.ts         # Zod 스키마
│   └── config/                 # 공통 설정
│       └── tsconfig.base.json
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 시작하기

### 요구사항

- Node.js >= 20
- pnpm >= 10

### 설치

```bash
# 의존성 설치
pnpm install

# Playwright 브라우저 설치 (E2E 테스트용)
pnpm --filter web exec playwright install
```

### 개발 서버 실행

```bash
pnpm dev
```

- **Web**: http://localhost:4000
- **API**: http://localhost:4001

### 빌드

```bash
pnpm build
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (API + Web) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | ESLint 검사 |
| `pnpm test` | 단위 테스트 실행 |
| `pnpm type-check` | TypeScript 타입 검사 |
| `pnpm clean` | 빌드 산출물 정리 |

### 패키지별 스크립트

```bash
# API 단위 테스트
pnpm --filter api test
pnpm --filter api test:watch

# E2E 테스트
pnpm --filter web test:e2e
pnpm --filter web test:e2e:ui
```

## 주요 특징

### End-to-End 타입 안전성

Zod 스키마를 통해 백엔드와 프론트엔드 간 타입 일관성을 보장합니다.

```typescript
// packages/shared/src/schema/todo.ts
export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  // ...
});

export type Todo = z.infer<typeof TodoSchema>;
```

### BFF 패턴 (Server Actions)

Next.js Server Actions가 API와 클라이언트 사이의 중간 계층 역할을 합니다.

```typescript
// apps/web/src/features/todo/services/todo.service.ts
"use server";

export async function createTodoAction(prevState, formData) {
  const client = createApiClient();
  const res = await client.api.todos.$post({
    json: { title: formData.get("title") },
  });
  revalidatePath("/todos");
  return { success: true };
}
```

### Hono RPC 클라이언트

타입 안전한 API 호출을 제공합니다.

```typescript
// apps/web/src/infra/api/client.ts
import { hc } from "hono/client";
import type { AppType } from "api";

export const createApiClient = () => {
  return hc<AppType>(API_URL);
};

// 사용 예시 - 자동완성 및 타입 추론 지원
const client = createApiClient();
const res = await client.api.todos.$get();
const { todos } = await res.json();
```

## 환경 변수

### apps/web/.env.local

```bash
# API 서버 URL
API_URL=http://localhost:4001

# K8s 환경
# API_URL=http://todo-api.todo-app.svc.cluster.local
```

## 라이선스

MIT
