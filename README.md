# Task Manager

Простое приложение для управления задачами.

- `backend` — API на FastAPI с SQLite, миграциями Alembic и базовой авторизацией администратора.
- `frontend` — интерфейс на React + TypeScript + Vite.

## Запуск локально

### 1. Backend

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

API будет доступно по адресу `http://localhost:8000`, документация Swagger — `http://localhost:8000/docs`.

### 2. Frontend

В отдельном терминале:

```powershell
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Примечания

- По умолчанию frontend обращается к backend на `http://localhost:8000`.
- Если нужно изменить адрес API, задайте `VITE_API_BASE_URL` в окружении frontend.
