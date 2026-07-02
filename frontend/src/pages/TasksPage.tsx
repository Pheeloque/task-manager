import { useMemo, useState } from "react";
import { Filters, type FilterState } from "../components/Filters";
import { TaskForm } from "../components/TaskForm";
import { TaskTable } from "../components/TaskTable";
import { Pagination } from "../components/Pagination";
import { AdminLogin } from "../components/AdminLogin";
import { StateMessage } from "../components/StateMessage";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { deleteTask, updateTaskStatus } from "../api/tasks";
import { ApiError } from "../api/client";
import type { Task, TaskQuery, TaskStatus } from "../types/task";

const PAGE_SIZE = 10;

const INITIAL_FILTERS: FilterState = {
  search: "",
  status: "",
  priority: "",
  sort_by: "created_at",
  order: "desc",
};

export function TasksPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const auth = useAuth();

  const query: TaskQuery = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      sort_by: filters.sort_by,
      order: filters.order,
      page,
      page_size: PAGE_SIZE,
    }),
    [filters, page],
  );

  const { data, loading, error, reload } = useTasks(query);

  function handleFiltersChange(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setActionError(null);
    setBusyId(task.id);
    try {
      await updateTaskStatus(task.id, status);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(task: Task) {
    if (!auth.authHeader) {
      return;
    }
    setActionError(null);
    setBusyId(task.id);
    try {
      await deleteTask(task.id, auth.authHeader);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete task");
    } finally {
      setBusyId(null);
    }
  }

  const tasks = data?.items ?? [];

  return (
    <main className="page">
      <header className="page-header">
        <h1>Task Tracker</h1>
        <AdminLogin
          isAdmin={auth.isAdmin}
          loading={auth.loading}
          error={auth.error}
          onLogin={auth.login}
          onLogout={auth.logout}
        />
      </header>

      <section className="layout">
        <aside className="sidebar">
          <TaskForm onCreated={reload} />
        </aside>

        <section className="content">
          <Filters value={filters} onChange={handleFiltersChange} />

          {actionError ? <StateMessage variant="error" message={actionError} /> : null}

          {loading ? (
            <StateMessage variant="loading" message="Loading tasks..." />
          ) : error ? (
            <StateMessage variant="error" message={error} onRetry={reload} />
          ) : tasks.length === 0 ? (
            <StateMessage variant="empty" message="No tasks match your filters yet." />
          ) : (
            <>
              <TaskTable
                tasks={tasks}
                isAdmin={auth.isAdmin}
                busyId={busyId}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
              <Pagination
                page={data?.page ?? page}
                pageSize={data?.page_size ?? PAGE_SIZE}
                total={data?.total ?? 0}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </section>
    </main>
  );
}
