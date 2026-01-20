"use server";

import { revalidatePath } from "next/cache";
import { createApiClient } from "@/infra/api";

export type ActionState = {
  success: boolean;
  message: string;
};

/**
 * 할 일 목록 조회 (Server Component에서 호출)
 */
export async function getTodosService() {
  const client = createApiClient({
    options: { next: { tags: ["todos"] } },
  });

  const res = await client.api.todos.$get();

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return await res.json();
}

/**
 * 할 일 생성 (Server Action - Client Form에서 호출)
 */
export async function createTodoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const client = createApiClient();
  const title = formData.get("title") as string;

  if (!title || title.trim() === "") {
    return { success: false, message: "할 일을 입력해주세요." };
  }

  try {
    const res = await client.api.todos.$post({
      json: { title: title.trim() },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: "error" in errorData ? String(errorData.error) : "생성 실패",
      };
    }

    revalidatePath("/todos");
    return { success: true, message: "할 일이 추가되었습니다." };
  } catch (error) {
    console.error("createTodoAction error:", error);
    return { success: false, message: "서버 오류가 발생했습니다." };
  }
}

/**
 * 할 일 토글 (Server Action)
 */
export async function toggleTodoAction(
  id: string,
  completed: boolean
): Promise<ActionState> {
  const client = createApiClient();

  try {
    const res = await client.api.todos[":id"].$patch({
      param: { id },
      json: { completed },
    });

    if (!res.ok) {
      return { success: false, message: "수정 실패" };
    }

    revalidatePath("/todos");
    return { success: true, message: "수정되었습니다." };
  } catch (error) {
    console.error("toggleTodoAction error:", error);
    return { success: false, message: "서버 오류가 발생했습니다." };
  }
}

/**
 * 할 일 삭제 (Server Action)
 */
export async function deleteTodoAction(id: string): Promise<ActionState> {
  const client = createApiClient();

  try {
    const res = await client.api.todos[":id"].$delete({
      param: { id },
    });

    if (!res.ok) {
      return { success: false, message: "삭제 실패" };
    }

    revalidatePath("/todos");
    return { success: true, message: "삭제되었습니다." };
  } catch (error) {
    console.error("deleteTodoAction error:", error);
    return { success: false, message: "서버 오류가 발생했습니다." };
  }
}
