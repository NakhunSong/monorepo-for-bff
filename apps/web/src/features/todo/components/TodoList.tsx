import { connection } from "next/server";
import { getTodosService } from "../services";
import { TodoItem } from "./TodoItem";

export async function TodoList() {
  // 동적 렌더링 강제 (빌드 시 pre-rendering 비활성화)
  await connection();

  const { todos } = await getTodosService();

  if (todos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        할 일이 없습니다. 새로운 할 일을 추가해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
