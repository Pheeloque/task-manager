import { useState, type FormEvent } from "react";
import { createTask } from "../api/tasks";
import { ApiError } from "../api/client";
import type { TaskPriority } from "../types/task";

interface TaskFormProps {
  onCreated: () => void;
}

const TITLE_MIN = 3;
const TITLE_MAX = 120;
const DESCRIPTION_MAX = 1000;

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < TITLE_MIN || trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters`);
      return;
    }

    setSubmitting(true);
    try {
      await createTask({
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
      });
      setTitle("");
      setDescription("");
      setPriority("normal");
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create task</h2>

      <label className="field">
        <span>Title</span>
        <input type="text" value={title} maxLength={TITLE_MAX} required onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Priority</span>
        <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </label>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}
