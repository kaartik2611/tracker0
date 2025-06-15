# Tracker App

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tracker-app.example.com)  
A task and bug tracking system with role-based workflows.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: JOSE (JWT)
- **State**: Zustand (global state)
- **Validation**: Zod (schema validation)
- **Database**: Neon (PostgreSQL)

## Features

### Authentication & Routing
- Server mutation
- Middleware-protected routes using `middleware.ts` (all except `/` and `/login`)
- JWT session management with HTTP-only cookies
- Server mutations using `useActionState` hook & server actions and Next.js caching techniques. View: [actions](https://github.com/kaartik2611/tracker0/tree/main/src/app/actions)

### Core Functionality

- **Managers** can:
  - Create developers
  - Create/edit tasks & bugs
  - Approve/reject fixes
  - View all team activities

- **Developers** can:
  - CRUD their assigned tasks/bugs
  - Reassign items
  - Submit fixes (auto-marked as `PENDING_APPROVAL`)


### UI/UX
- filtering (status/priority/assignee)
- Sorting (date)
- Interactive charts (Recharts)
