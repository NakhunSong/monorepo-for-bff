import { describe, it, expect, beforeEach } from "vitest";
import { createApp, resetTodos } from "./app";

describe("Todo API", () => {
  const app = createApp();

  beforeEach(() => {
    resetTodos();
  });

  describe("GET /health", () => {
    it("헬스 체크가 성공해야 한다", async () => {
      const res = await app.request("/health");
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe("ok");
      expect(data.timestamp).toBeDefined();
    });
  });

  describe("GET /api/todos", () => {
    it("빈 목록을 반환해야 한다", async () => {
      const res = await app.request("/api/todos");
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.todos).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe("POST /api/todos", () => {
    it("새 할 일을 생성해야 한다", async () => {
      const res = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "테스트 할 일" }),
      });
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.message).toBe("Todo created successfully");
      expect(data.todo.title).toBe("테스트 할 일");
      expect(data.todo.completed).toBe(false);
      expect(data.todo.id).toBeDefined();
    });

    it("빈 제목으로 생성 시 실패해야 한다", async () => {
      const res = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "" }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/todos/:id", () => {
    it("존재하는 할 일을 조회해야 한다", async () => {
      // 먼저 생성
      const createRes = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "조회 테스트" }),
      });
      const createData = await createRes.json();
      const todoId = createData.todo.id;

      // 조회
      const res = await app.request(`/api/todos/${todoId}`);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.todo.id).toBe(todoId);
      expect(data.todo.title).toBe("조회 테스트");
    });

    it("존재하지 않는 할 일 조회 시 404를 반환해야 한다", async () => {
      const res = await app.request("/api/todos/non-existent-id");

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("할 일을 수정해야 한다", async () => {
      // 먼저 생성
      const createRes = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "수정 전" }),
      });
      const createData = await createRes.json();
      const todoId = createData.todo.id;

      // 수정
      const res = await app.request(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "수정 후", completed: true }),
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.todo.title).toBe("수정 후");
      expect(data.todo.completed).toBe(true);
    });

    it("존재하지 않는 할 일 수정 시 404를 반환해야 한다", async () => {
      const res = await app.request("/api/todos/non-existent-id", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("할 일을 삭제해야 한다", async () => {
      // 먼저 생성
      const createRes = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "삭제 테스트" }),
      });
      const createData = await createRes.json();
      const todoId = createData.todo.id;

      // 삭제
      const res = await app.request(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Todo deleted successfully");

      // 삭제 확인
      const getRes = await app.request(`/api/todos/${todoId}`);
      expect(getRes.status).toBe(404);
    });

    it("존재하지 않는 할 일 삭제 시 404를 반환해야 한다", async () => {
      const res = await app.request("/api/todos/non-existent-id", {
        method: "DELETE",
      });

      expect(res.status).toBe(404);
    });
  });
});
