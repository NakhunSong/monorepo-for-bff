import { Suspense } from "react";
import Link from "next/link";
import { TodoList, TodoForm } from "@/features/todo";

function TodoListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

export default function TodosPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">나의 할 일 목록</h1>
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 홈으로
        </Link>
      </div>

      <div className="mb-8">
        <TodoForm />
      </div>

      <Suspense fallback={<TodoListSkeleton />}>
        <TodoList />
      </Suspense>
    </main>
  );
}
