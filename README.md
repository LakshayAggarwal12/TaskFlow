# TaskFlow

**An AI-enhanced project management platform** — boards, sprints, and real-time-feeling collaboration, with a Generative AI layer that assists rather than automates. Built on the MERN stack (MongoDB, Express, React, Node.js).

> 🔗 **Live Demo:** _Coming soon — will be added here after deployment._
> - Frontend: `<add Vercel URL after deployment>`
> - Backend API: `<add Render URL after deployment>`

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication & Permissions](#authentication--permissions)
- [AI Features](#ai-features)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)
- [Author](#author)

---

## Features

### Core Project Management
- **Workspaces & Projects** — multi-tenant structure with role-based access (Owner / Admin / Member / Viewer), plus optional per-project role overrides
- **Kanban Boards** — drag-and-drop lists and tasks with fractional ordering (Trello-style), so reordering never requires rewriting sibling records
- **Tasks** — priority, labels, due dates, subtask checklists, multi-assignee support, time estimates
- **Comments** — threaded discussion per task, with author/admin edit-and-delete permissions
- **Sprints** — time-boxed sprints with a live-computed burndown snapshot (no stale, pre-cached charts)
- **Analytics** — completion rate, task status distribution, team workload, and overdue tracking via MongoDB aggregation pipelines
- **Activity Feed** — a running, human-readable log of everything happening in a project
- **Notifications** — in-app inbox for assignments, comments, due-date reminders (via a scheduled job), and sprint closures

### AI-Powered (via Groq / Llama 3.3)
- **Draft with AI** — expands a task title into a full description and acceptance criteria
- **Suggest Label** — classifies a task's type and priority from its title/description
- **Smart Search** — turns a natural-language query into a safe, structured board search
- **Sprint Summaries** — auto-generates a short recap when a sprint closes

Every AI output is a **reviewed suggestion**, never an automatic write — see [AI Features](#ai-features) for why that distinction matters.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, React Query, React Hook Form, Framer Motion, dnd-kit, Zustand |
| Backend | Node.js, Express, MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie + Bearer token dual support), bcrypt |
| AI | Groq API (Llama 3.3 70B) |
| Scheduling | node-cron (due-date reminder jobs) |
| Testing | Postman |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── config/        # MongoDB connection
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # business logic
│   │   ├── middleware/    # auth + per-resource access control
│   │   ├── routes/        # Express route definitions
│   │   ├── utils/         # shared helpers (JWT, ordering, AI client...)
│   │   └── jobs/          # node-cron reminder job
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            # one file per backend resource
    │   ├── features/       # domain-sliced components + hooks (boards, tasks, ai...)
    │   ├── components/ui/  # reusable primitives (Button, Modal, Avatar...)
    │   ├── context/         # Auth, Toast
    │   ├── layouts/          # Sidebar, Topbar, AppLayout
    │   ├── pages/             # route-level components
    │   ├── lib/                # ordering, permissions, date utils
    │   └── store/                # Zustand (drag UI state only)
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A free [Groq API key](https://console.groq.com/keys)

### Installation

```bash
git clone <your-repo-url>
cd taskflow

# Backend
cd backend
npm install
cp .env.example .env   # fill in the values — see below
npm run dev             # runs on http://localhost:5000

# Frontend (in a new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev             # runs on http://localhost:5173
```

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `JWT_COOKIE_EXPIRES_DAYS` | Cookie lifetime in days |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. `http://localhost:5173`) |
| `GROQ_API_KEY` | From [console.groq.com/keys](https://console.groq.com/keys) |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

---

## Authentication & Permissions

- JWT-based auth, issued on register/login as **both** an httpOnly cookie and a Bearer token in the response body — the frontend uses the Bearer token exclusively.
- Roles are hierarchical: `viewer < member < admin < owner`, checked at the **Workspace** level by default.
- A **Project** can optionally override a plain member/viewer's role for that project only (workspace owners/admins always retain admin-level access everywhere, regardless of overrides).
- Every downstream resource (Board → List → Task → Comment) resolves its permission by walking back up to its owning Project through one shared helper — there's a single source of truth for "can this user do this," not one per feature.

---

## AI Features

TaskFlow deliberately keeps AI as an **assistive layer**, not the core product:

- **Nothing AI generates is saved automatically.** A drafted description or suggested label is returned to the client as a suggestion; the user reviews, edits if needed, and only then does it get saved — through the exact same endpoint a manual edit would use.
- **Natural-language search never lets the model touch the database directly.** The AI only extracts a small set of constrained filter fields (priority, overdue status, assignee name, etc.) from the query text. The backend then builds the actual MongoDB query itself from those fields — this closes off prompt injection or a malformed AI response ever becoming an arbitrary database operation.
- **AI failures never block core actions.** Closing a sprint still succeeds even if the AI summary call fails — the summary is just left blank rather than the close being rejected.

---

## API Overview

All endpoints are prefixed with `/api`. Full request/response examples with sample Postman payloads are documented separately (see `/docs` if included in your copy of this repo).

| Resource | Base route |
|---|---|
| Auth | `/auth` |
| Workspaces | `/workspaces` |
| Projects | `/projects`, nested under `/workspaces/:id/projects` |
| Boards / Lists / Tasks | `/boards`, `/lists`, `/tasks` |
| Comments | `/tasks/:id/comments`, `/comments/:id` |
| Sprints | `/sprints`, nested under `/projects/:id/sprints` |
| Analytics | `/projects/:id/analytics/overview` |
| Activity | `/projects/:id/activity` |
| Notifications | `/notifications` |
| AI | `/projects/:id/ai/draft-task`, `/suggest-label`, `/search` |

---

## Testing

The backend was built and tested endpoint-by-endpoint in Postman during development. Import the base URL and a `token` variable (obtained from `/auth/login`) into a Postman environment, then exercise any route above with `Authorization: Bearer {{token}}`.

---

## Roadmap

Features intentionally out of scope for the current build:
- File attachments on tasks
- User avatar upload
- Real-time updates via WebSockets (currently request/response with optimistic UI updates)
- Editable user profile (name/password change)

---

## License

MIT

---

## Author

**Lakshay Aggarwal**
B.Tech CSE (Data Science) — ABES Engineering College, AKTU
