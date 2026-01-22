# Memtime Hierarchy Viewer

A time-tracking application built with TanStack Start that integrates with the Memtime API.

## Features

- **Hierarchy View** (`/hierarchy`) - Browse Clients → Projects → Tasks in an expandable tree with lazy loading and pagination
- **Time Entries** (`/time-entries`) - Paginated table of time tracking records with duration display
- **Create/Edit** (`/time-entries/new`, `/time-entries/:id`) - Forms for managing time entries

## Tech Stack

- **Framework:** TanStack Start (React 19, TanStack Router)
- **Styling:** Tailwind CSS v4
- **Build:** Vite 7
- **Language:** TypeScript
- **Deployment:** Netlify

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```
MEMTIME_API_KEY=your_api_key_here
```

### 3. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run check` | Format + lint fix |

## Project Structure

```
src/
├── api/          # Server functions for Memtime API
├── components/   # Reusable UI components
├── routes/       # File-based routing (TanStack Router)
└── types/        # TypeScript interfaces
```

Each folder contains a `readme-{folder}.md` with detailed documentation.

## Documentation

- [Product Requirements (PRD)](./docs/PRD.md)
- [Implementation Plan](./docs/implementation-plan.md)
- [Design Reference](./docs/design-reference.md)
- [API Documentation](./docs/api-v1-documentation.md)

## API

This app uses the Memtime Interview API:
- **Base URL:** `https://interview-api.memtime-demo.deno.net/api/v1`
- **Auth:** Bearer token
- **Rate Limit:** 15 requests per 60 seconds

See [API Documentation](./docs/api-v1-documentation.md) for endpoint details.
