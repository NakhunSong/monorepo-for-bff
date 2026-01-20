"use client";

import { useActionState, useRef, useEffect } from "react";
import { createTodoAction, type ActionState } from "../services";

const initialState: ActionState = { success: false, message: "" };

export function TodoForm() {
  const [state, formAction, isPending] = useActionState(
    createTodoAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // 성공 시 폼 초기화
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-3">
      <input
        name="title"
        type="text"
        placeholder="할 일을 입력하세요"
        disabled={isPending}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-20 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "추가"
        )}
      </button>
    </form>
  );
}
