from fastapi import APIRouter, Depends

from app.core.security import require_admin

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(username: str = Depends(require_admin)) -> dict[str, object]:
    return {"username": username, "is_admin": True}
