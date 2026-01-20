import { z } from "zod";

/**
 * Todo 스키마 정의
 * 백엔드와 프론트엔드에서 공유되는 Single Source of Truth
 */
export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "할 일을 입력해주세요." }),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Todo 생성 스키마
 * title만 필수, 나머지는 서버에서 자동 생성
 */
export const CreateTodoSchema = TodoSchema.pick({ title: true });

/**
 * Todo 수정 스키마
 * id와 createdAt은 수정 불가, 나머지 필드는 선택적
 */
export const UpdateTodoSchema = TodoSchema.partial().omit({
  id: true,
  createdAt: true,
});

/**
 * Todo 목록 응답 스키마
 */
export const TodoListResponseSchema = z.object({
  todos: z.array(TodoSchema),
  total: z.number().optional(),
});

// 타입 추론
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
export type TodoListResponse = z.infer<typeof TodoListResponseSchema>;
