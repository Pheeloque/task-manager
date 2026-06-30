import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.core.config import Settings, get_settings

_basic_scheme = HTTPBasic()


def require_admin(
    credentials: HTTPBasicCredentials = Depends(_basic_scheme),
    settings: Settings = Depends(get_settings),
) -> str:
    correct_login = secrets.compare_digest(credentials.username, settings.admin_login)
    correct_password = secrets.compare_digest(
        credentials.password, settings.admin_password
    )

    if not (correct_login and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username
