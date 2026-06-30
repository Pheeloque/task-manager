from fastapi import HTTPException, status

from app.enums import TaskStatus
from app.models.task import Task
from app.repositories.task import TaskRepository
from app.schemas.task import TaskCreate, TaskQuery

_DONE_TASK_LOCKED = "A completed task cannot be modified or deleted"


class TaskService:
    def __init__(self, repository: TaskRepository) -> None:
        self._repository = repository

    def create(self, data: TaskCreate) -> Task:
        task = Task(
            title=data.title,
            description=data.description,
            priority=data.priority,
        )
        return self._repository.add(task)

    def list(self, query: TaskQuery) -> tuple[list[Task], int]:
        return self._repository.list(query)

    def change_status(self, task_id: int, new_status: TaskStatus) -> Task:
        task = self._get_or_404(task_id)
        if task.status == TaskStatus.done:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail=_DONE_TASK_LOCKED
            )
        task.status = new_status
        return self._repository.save(task)

    def delete(self, task_id: int) -> None:
        task = self._get_or_404(task_id)
        if task.status == TaskStatus.done:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail=_DONE_TASK_LOCKED
            )
        self._repository.delete(task)

    def _get_or_404(self, task_id: int) -> Task:
        task = self._repository.get(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        return task
