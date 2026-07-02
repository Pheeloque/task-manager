import { useCallback, useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";
import { ApiError } from "../api/client";
import type { TaskList, TaskQuery } from "../types/task";

interface UseTasksResult {
  data: TaskList | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTasks(query: TaskQuery): UseTasksResult {
  const [data, setData] = useState<TaskList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    const loadTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchTasks(query);
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setData(null);
          setError(err instanceof ApiError ? err.message : "Failed to load tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadTasks();

    return () => {
      active = false;
    };
  }, [query, reloadToken]);

  return { data, loading, error, reload };
}
