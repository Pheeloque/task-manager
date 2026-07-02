import type { Task, TaskStatus } from "../types/task";

interface TaskTableProps {
  tasks: Task[];
  isAdmin: boolean;
  busyId: number | null;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  new: "New",
  in_progress: "In progress",
  done: "Done",
};

const NEXT_STATUS_OPTIONS: TaskStatus[] = ["new", "in_progress", "done"];

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function TaskTable({ tasks, isAdmin, busyId, onStatusChange, onDelete }: TaskTableProps) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const locked = task.status === "done";
          const busy = busyId === task.id;
          return (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                {task.description ? <p className="task-desc">{task.description}</p> : null}
              </td>
              <td>
                <span className={`badge badge--${task.priority}`}>{task.priority}</span>
              </td>
              <td>
                <select
                  aria-label={`Status for ${task.title}`}
                  value={task.status}
                  disabled={locked || busy}
                  onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
                >
                  {NEXT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <button
                  type="button"
                  className="danger"
                  disabled={!isAdmin || locked || busy}
                  title={
                    !isAdmin
                      ? "Admin login required to delete"
                      : locked
                        ? "Completed tasks cannot be deleted"
                        : undefined
                  }
                  onClick={() => onDelete(task)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
