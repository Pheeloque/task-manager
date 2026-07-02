import type { ChangeEvent } from "react";
import type { SortField, SortOrder, TaskPriority, TaskStatus } from "../types/task";

export interface FilterState {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sort_by: SortField;
  order: SortOrder;
}

interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

const STATUS_OPTIONS: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: TaskPriority | ""; label: string }[] = [
  { value: "", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export function Filters({ value, onChange }: FiltersProps) {
  function update<K extends keyof FilterState>(key: K, fieldValue: FilterState[K]) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="filters">
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Search title or description"
          value={value.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update("search", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select value={value.status} onChange={(e) => update("status", e.target.value as FilterState["status"])}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Priority</span>
        <select value={value.priority} onChange={(e) => update("priority", e.target.value as FilterState["priority"])}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select value={value.sort_by} onChange={(e) => update("sort_by", e.target.value as SortField)}>
          <option value="created_at">Created date</option>
          <option value="priority">Priority</option>
        </select>
      </label>

      <label className="field">
        <span>Order</span>
        <select value={value.order} onChange={(e) => update("order", e.target.value as SortOrder)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
    </div>
  );
}
