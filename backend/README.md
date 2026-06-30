# Backend — Task Tracker API

FastAPI + SQLAlchemy 2.x + Pydantic v2 + Alembic + SQLite.

## Requirements

- **Python 3.10 – 3.13.** Python 3.14 is not yet supported by all dependencies
  (some lack prebuilt wheels and fall back to a Rust source build that fails).
  Check your version with `python --version`; if it reports 3.14, install a
  3.13 interpreter and create the virtualenv with it (e.g. `py -3.13 -m venv .venv`
  on Windows, or `python3.13 -m venv .venv` on macOS/Linux).

## Setup

macOS / Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # optional, defaults already match
alembic upgrade head          # create the SQLite schema
uvicorn app.main:app --reload # http://localhost:8000
```

Windows (PowerShell / Git Bash) — note the activate path is `Scripts`, not `bin`:

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

If `alembic` / `uvicorn` report "command not found", the virtualenv is not
active — re-run the activate step above before those commands.

Interactive docs: `http://localhost:8000/docs`.

## Endpoints

| Method | Path                  | Description                          | Auth   |
|--------|-----------------------|--------------------------------------|--------|
| POST   | `/tasks`              | Create a task                        | —      |
| GET    | `/tasks`              | List (filter / search / sort / page) | —      |
| PATCH  | `/tasks/{id}/status`  | Change status                        | —      |
| DELETE | `/tasks/{id}`         | Delete a task                        | admin  |
| POST   | `/auth/login`         | Validate administrator credentials   | admin  |

### `GET /tasks` query parameters

- `status` — `new` \| `in_progress` \| `done`
- `priority` — `low` \| `normal` \| `high`
- `search` — substring matched against `title` and `description`
- `sort_by` — `created_at` (default) \| `priority`
- `order` — `asc` \| `desc` (default `desc`)
- `page` — 1-based (default `1`)
- `page_size` — 1..100 (default `20`)

## Business rules

- `title`: 3–120 chars (required); `description`: up to 1000 chars (optional).
- A task with status `done` cannot be modified or deleted → `409 Conflict`.
- `done` cannot be moved back to another status (covered by the lock above).
- Deletion requires the administrator (HTTP Basic, `admin` / `admin`) → `401` otherwise.

## Authentication

Minimal HTTP Basic auth. Credentials are configured via `ADMIN_LOGIN` /
`ADMIN_PASSWORD` in `Settings`. Only the delete operation requires them; the
login endpoint simply validates the credentials for the frontend.
