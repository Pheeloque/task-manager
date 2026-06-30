from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.enums import SortOrder, TaskPriority, TaskSortField, TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    priority: TaskPriority = TaskPriority.normal


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    created_at: datetime
    updated_at: datetime


class TaskList(BaseModel):
    items: list[TaskRead]
    total: int
    page: int
    page_size: int


class TaskQuery(BaseModel):
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    search: str | None = None
    sort_by: TaskSortField = TaskSortField.created_at
    order: SortOrder = SortOrder.desc
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
