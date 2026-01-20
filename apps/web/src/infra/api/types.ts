import type { InferRequestType, InferResponseType } from "hono/client";
import { createApiClient } from "./client";

type Client = ReturnType<typeof createApiClient>;

// Todo 목록 조회 타입
export type TodoListResponse = InferResponseType<
  Client["api"]["todos"]["$get"]
>;

// Todo 생성 요청 타입
export type CreateTodoRequest = InferRequestType<
  Client["api"]["todos"]["$post"]
>["json"];

// Todo 생성 응답 타입
export type CreateTodoResponse = InferResponseType<
  Client["api"]["todos"]["$post"]
>;

// Todo 수정 요청 타입
export type UpdateTodoRequest = InferRequestType<
  Client["api"]["todos"][":id"]["$patch"]
>["json"];
