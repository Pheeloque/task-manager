import { request } from "./client";
import type { Task, TaskCreateInput, TaskList, TaskQuery, TaskStatus } from "../types/task";

export function fetchTasks(query: TaskQuery): Promise<TaskList> {
  return request<TaskList>("/tasks", {
    query: {
      status: query.status,
      priority: query.priority,
      search: query.search,
      sort_by: query.sort_by,
      order: query.order,
      page: query.page,
      page_size: query.page_size,
    },
  });
}

export function createTask(input: TaskCreateInput): Promise<Task> {
  return request<Task>("/tasks", { method: "POST", body: input });
}

export function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  return request<Task>(`/tasks/${id}/status`, { method: "PATCH", body: { status } });
}

export function deleteTask(id: number, authHeader: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE", authHeader });
}
