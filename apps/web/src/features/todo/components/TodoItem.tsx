"use client";

import type { Todo } from "@repo/shared";
import { toggleTodoAction, deleteTodoAction } from "../services";
import { useTransition } from "react";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTodoAction(todo.id, !todo.completed);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTodoAction(todo.id);
    });
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isPending}
        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      >
        삭제
      </button>
    </div>
  );
}
