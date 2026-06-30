from sqlalchemy import case, func, or_, select
from sqlalchemy.orm import Session

from app.enums import SortOrder, TaskPriority, TaskSortField
from app.models.task import Task
from app.schemas.task import TaskQuery

_PRIORITY_ORDER = case(
    (Task.priority == TaskPriority.low, 1),
    (Task.priority == TaskPriority.normal, 2),
    (Task.priority == TaskPriority.high, 3),
)


class TaskRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get(self, task_id: int) -> Task | None:
        return self._db.get(Task, task_id)

    def add(self, task: Task) -> Task:
        self._db.add(task)
        self._db.commit()
        self._db.refresh(task)
        return task

    def save(self, task: Task) -> Task:
        self._db.commit()
        self._db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self._db.delete(task)
        self._db.commit()

    def list(self, query: TaskQuery) -> tuple[list[Task], int]:
        stmt = select(Task)

        if query.status is not None:
            stmt = stmt.where(Task.status == query.status)
        if query.priority is not None:
            stmt = stmt.where(Task.priority == query.priority)
        if query.search:
            pattern = f"%{query.search}%"
            stmt = stmt.where(
                or_(Task.title.ilike(pattern), Task.description.ilike(pattern))
            )

        total = self._db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

        sort_column = (
            _PRIORITY_ORDER
            if query.sort_by == TaskSortField.priority
            else Task.created_at
        )
        ordering = (
            sort_column.asc() if query.order == SortOrder.asc else sort_column.desc()
        )

        stmt = (
            stmt.order_by(ordering)
            .offset((query.page - 1) * query.page_size)
            .limit(query.page_size)
        )

        items = list(self._db.scalars(stmt).all())
        return items, total
