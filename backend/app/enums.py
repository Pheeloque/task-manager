from enum import Enum


class TaskStatus(str, Enum):
    new = "new"
    in_progress = "in_progress"
    done = "done"


class TaskPriority(str, Enum):
    low = "low"
    normal = "normal"
    high = "high"


class TaskSortField(str, Enum):
    created_at = "created_at"
    priority = "priority"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"
