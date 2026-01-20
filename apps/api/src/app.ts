import { Hono } from "hono";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import {
  type Todo,
  CreateTodoSchema,
  UpdateTodoSchema,
} from "@repo/shared";

// 인메모리 저장소 (예제용)
let todos: Todo[] = [];

// 테스트용 저장소 초기화 함수
export const resetTodos = () => {
  todos = [];
};

// 테스트용 저장소 설정 함수
export const setTodos = (newTodos: Todo[]) => {
  todos = newTodos;
};

export const createApp = () => {
  const app = new Hono();

  // 미들웨어 (테스트 시에는 logger 비활성화 가능)
  if (process.env.NODE_ENV !== "test") {
    app.use("*", logger());
  }

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

  return todoRoutes;
};

// RPC 타입 내보내기
export type AppType = ReturnType<typeof createApp>;
