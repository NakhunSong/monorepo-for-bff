import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import {
  type Todo,
  CreateTodoSchema,
  UpdateTodoSchema,
} from "@repo/shared";

const app = new Hono();

// 인메모리 저장소 (예제용)
let todos: Todo[] = [];

// 미들웨어
app.use("*", logger());

// 헬스 체크
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Todo 라우트 정의
const todoRoutes = app
  .basePath("/api")
  // 전체 목록 조회
  .get("/todos", (c) => {
    return c.json({ todos, total: todos.length });
  })
  // 단일 항목 조회
  .get("/todos/:id", (c) => {
    const id = c.req.param("id");
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return c.json({ error: "Todo not found" }, 404);
    }

    return c.json({ todo });
  })
  // 새 항목 생성
  .post("/todos", zValidator("json", CreateTodoSchema), async (c) => {
    const data = c.req.valid("json");
    const now = new Date().toISOString();

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    todos.push(newTodo);

    return c.json(
      { message: "Todo created successfully", todo: newTodo },
      201
    );
  })
  // 항목 수정
  .patch("/todos/:id", zValidator("json", UpdateTodoSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const existingTodo = todos[todoIndex];
    if (!existingTodo) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    todos[todoIndex] = updatedTodo;

    return c.json({ message: "Todo updated successfully", todo: updatedTodo });
  })
  // 항목 삭제
  .delete("/todos/:id", (c) => {
    const id = c.req.param("id");
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return c.json({ error: "Todo not found" }, 404);
    }

    todos.splice(todoIndex, 1);

    return c.json({ message: "Todo deleted successfully" });
  });

// RPC 타입 내보내기 (핵심!)
export type AppType = typeof todoRoutes;

// 서버 시작
const port = Number(process.env.PORT) || 4001;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
