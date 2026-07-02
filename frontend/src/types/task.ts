export type TaskStatus = "new" | "in_progress" | "done";

export type TaskPriority = "low" | "normal" | "high";

export type SortField = "created_at" | "priority";

export type SortOrder = "asc" | "desc";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface TaskList {
  items: Task[];
  total: number;
  page: number;
  page_size: number;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface TaskQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sort_by: SortField;
  order: SortOrder;
  page: number;
  page_size: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
