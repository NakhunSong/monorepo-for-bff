import { hc } from "hono/client";
import type { AppType } from "api";

// Server Actions에서만 사용되므로 서버 환경 변수만 필요
// K8s: API_URL=http://todo-api.todo-app.svc.cluster.local
// Local: API_URL=http://localhost:4001
const API_URL = process.env.API_URL || "http://localhost:4001";

/**
 * Hono RPC 클라이언트 팩토리
 * Next.js의 fetch 옵션을 주입받아 캐싱 및 재검증 전략을 제어할 수 있음
 */
export const createApiClient = ({
  token,
  options,
}: {
  token?: string;
  options?: RequestInit;
} = {}) => {
  return hc<AppType>(API_URL, {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);

      // 토큰이 존재하면 Authorization 헤더 추가
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return fetch(input, {
        ...init,
        ...options,
        headers,
      });
    },
  });
};

// 기본 클라이언트 (서버 컴포넌트용)
export const apiClient = createApiClient();
