<div align="center">

# ⚡ TaskFlow

### An AI-enhanced project management platform — built on the MERN stack

Boards, sprints, and real collaboration — with a Generative AI layer that assists instead of automates.

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq_Llama_3.3-F55036?style=for-the-badge&logo=lightning&logoColor=white)

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-in_development-yellow?style=flat-square)
![Made with](https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F%20and%20lots%20of%20coffee-orange?style=flat-square)

<br/>

**[Live Demo](https://taskflow-gray-two.vercel.app/)**

> 🔗 Frontend: `<add Vercel URL after deployment>` &nbsp;|&nbsp; Backend: `<add Render URL after deployment>`

</div>

<br/>

---

## 📖 Table of Contents

<table>
<tr>
<td valign="top" width="33%">

**Getting Started**
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)

</td>
<td valign="top" width="33%">

**Deep Dive**
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Authentication & Permissions](#-authentication--permissions)
- [AI Design Principles](#-ai-design-principles)

</td>
<td valign="top" width="33%">

**Reference**
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Deployment](#-deployment)

</td>
</tr>
</table>

---

## 🧭 Overview

Most student PM-tool projects are CRUD demos with a chatbot bolted on. TaskFlow is built the other way around: a **fully-functional Kanban platform first** — drag-and-drop boards, sprints with live burndown, aggregation-pipeline analytics, a real notification system — with AI layered on top as a **reviewed assistant**, not the reason the app exists.

Every AI suggestion is shown to the user before anything is saved. Nothing writes to the database on the model's word alone.

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🗂️ Core Project Management
- **Workspaces & Projects** with 4-tier role hierarchy + per-project overrides
- **Kanban Boards** — smooth drag-and-drop, fractional ordering (no full-array rewrites)
- **Tasks** — priority, labels, due dates, subtasks, multi-assignee, time tracking
- **Threaded Comments** on every task
- **Sprints** with a *live-computed* burndown — never a stale cached chart
- **Analytics** via real MongoDB aggregation pipelines
- **Activity Feed** — a readable audit trail per project
- **Notifications** — assignments, comments, due-date reminders, sprint closures

</td>
<td width="50%" valign="top">

### 🤖 AI-Powered (Groq · Llama 3.3)
- **✨ Draft with AI** — title → full description + acceptance criteria
- **✨ Suggest Label** — auto-classifies type & priority
- **✨ Smart Search** — natural language → safe, structured query
- **✨ Sprint Summaries** — auto-recap when a sprint closes

> Every AI output is a **suggestion**, reviewed and approved by a human before it touches the database. See [AI Design Principles](#-ai-design-principles).

</td>
</tr>
</table>

<br/>

## 🛠️ Tech Stack

<table>
<tr><td><b>Frontend</b></td><td>

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![React Query](https://img.shields.io/badge/-React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/-Zustand-433E38?style=flat-square)
![dnd kit](https://img.shields.io/badge/-dnd--kit-764ABC?style=flat-square)

</td></tr>
<tr><td><b>Backend</b></td><td>

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![node-cron](https://img.shields.io/badge/-node--cron-5C5C5C?style=flat-square)

</td></tr>
<tr><td><b>AI & Infra</b></td><td>

![Groq](https://img.shields.io/badge/-Groq_(Llama_3.3)-F55036?style=flat-square)
![Render](https://img.shields.io/badge/-Render-46E3B7?style=flat-square&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Postman](https://img.shields.io/badge/-Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)

</td></tr>
</table>

<br/>

## 🚀 Quick Start

<details>
<summary><b>Click to expand setup instructions</b></summary>

<br/>

**Prerequisites:** Node.js 18+, a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, a free [Groq API key](https://console.groq.com/keys)

```bash
git clone <your-repo-url>
cd taskflow
```

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env    # fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm run dev              # → http://localhost:5000
```

**2. Frontend** (new terminal)
```bash
cd frontend
npm install
cp .env.example .env    # set VITE_API_BASE_URL
npm run dev              # → http://localhost:5173
```

That's it — register an account and you're in.

</details>

<br/>

## 📁 Project Structure

<details>
<summary><b>Click to expand folder tree</b></summary>

<br/>

```
taskflow/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── models/        # Mongoose schemas
│       ├── controllers/   # business logic
│       ├── middleware/    # auth + per-resource access control
│       ├── routes/        # Express route definitions
│       ├── utils/         # JWT, ordering, AI client, activity/notification helpers
│       └── jobs/          # node-cron reminder job
│
└── frontend/
    └── src/
        ├── api/            # one file per backend resource
        ├── features/       # domain-sliced components + hooks
        ├── components/ui/  # Button, Modal, Avatar, SignalDot...
        ├── context/         # Auth, Toast
        ├── layouts/          # Sidebar, Topbar, AppLayout
        ├── pages/             # route-level components
        ├── lib/                # ordering, permissions, date utils
        └── store/                # Zustand (ephemeral drag state only)
```

</details>

<br/>

## 🔑 Environment Variables

<details>
<summary><b>Click to expand variable reference</b></summary>

<br/>

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `JWT_COOKIE_EXPIRES_DAYS` | Cookie lifetime in days |
| `CLIENT_URL` | Frontend origin, for CORS |
| `GROQ_API_KEY` | From console.groq.com/keys |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

</details>

<br/>

## 🔐 Authentication & Permissions

> JWT issued as **both** an httpOnly cookie and a Bearer token — the frontend uses the Bearer token exclusively.

Roles are hierarchical — `viewer < member < admin < owner` — checked by default at the **Workspace** level. A **Project** can optionally override a plain member/viewer's role for that project only; workspace owners/admins always retain admin-level access everywhere, regardless of overrides.

Every downstream resource (`Board → List → Task → Comment`) resolves its permission by walking back up to its owning Project through **one shared helper function** — a single source of truth, not a rule re-implemented per feature.

<br/>

## 🤖 AI Design Principles

> **The core rule: nothing the AI generates is ever saved automatically.**

| Principle | How it's enforced |
|---|---|
| **Suggestions, not writes** | A drafted description or suggested label returns to the client for review. It only reaches the database through the same endpoint a manual edit would use. |
| **AI never touches the database directly** | Natural-language search extracts a small set of constrained filter fields (priority, overdue, assignee...) — the backend builds the actual MongoDB query itself. Closes off prompt injection entirely. |
| **AI failures never block core actions** | Closing a sprint still succeeds even if the AI summary call fails — the summary is just left blank. |

<br/>

## 📡 API Overview

<details>
<summary><b>Click to expand endpoint reference</b></summary>

<br/>

All routes are prefixed with `/api`.

| Resource | Base Route |
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

Full request/response examples with sample Postman payloads are documented separately in `/docs` if included in your copy of this repo.

</details>

<br/>

## 🖼️ Screenshots

<div align="center">

| Dashboard | Kanban Board |
|:---:|:---:|
| _add screenshot_ | _add screenshot_ |

| Task Drawer + AI | Sprint Burndown |
|:---:|:---:|
| _add screenshot_ | _add screenshot_ |

</div>

<br/>

## 🗺️ Roadmap

- [ ] File attachments on tasks
- [ ] User avatar upload
- [ ] Real-time sync via WebSockets *(currently optimistic request/response)*
- [ ] Editable user profile (name / password change)

<br/>

---

<div align="center">

## 👤 Author

**Lakshay Aggarwal**
B.Tech CSE (Data Science) · ABES Engineering College, AKTU

<br/>

**License:** MIT — free to use, modify, and learn from.

<sub>Built as a demonstration of full-stack MERN engineering with a scoped, responsibly-designed AI feature layer.</sub>

</div>