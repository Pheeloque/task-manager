from fastapi import APIRouter, Depends, Query, status

from app.core.security import require_admin
from app.dependencies import get_task_service
from app.enums import SortOrder, TaskPriority, TaskSortField, TaskStatus
from app.schemas.task import (
    TaskCreate,
    TaskList,
    TaskQuery,
    TaskRead,
    TaskStatusUpdate,
)
from app.services.task import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    return service.create(data)


@router.get("", response_model=TaskList)
def list_tasks(
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    priority: TaskPriority | None = Query(default=None),
    search: str | None = Query(default=None),
    sort_by: TaskSortField = Query(default=TaskSortField.created_at),
    order: SortOrder = Query(default=SortOrder.desc),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    service: TaskService = Depends(get_task_service),
) -> TaskList:
    query = TaskQuery(
        status=status_filter,
        priority=priority,
        search=search,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size,
    )
    items, total = service.list(query)
    return TaskList(items=items, total=total, page=page, page_size=page_size)


@router.patch("/{task_id}/status", response_model=TaskRead)
def change_status(
    task_id: int,
    data: TaskStatusUpdate,
    service: TaskService = Depends(get_task_service),
) -> TaskRead:
    return service.change_status(task_id, data.status)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_task(
    task_id: int,
    service: TaskService = Depends(get_task_service),
) -> None:
    service.delete(task_id)
