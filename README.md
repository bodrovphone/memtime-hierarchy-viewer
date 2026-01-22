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

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run test`          | Run Vitest tests               |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Run Prettier                   |
| `npm run check`         | Format + lint fix              |

## Project Structure

```
src/
├── api/          # Server functions for Memtime API
├── components/   # Reusable UI components
├── routes/       # File-based routing (TanStack Router)
├── types/        # TypeScript interfaces
├── utils/        # Utility functions (date formatting, etc.)
└── test/         # Test setup and utilities
```

Each folder contains a `readme-{folder}.md` with detailed documentation.

## Testing

The project uses Vitest with React Testing Library for unit tests. Tests are co-located with source files using the `*.test.tsx` pattern.

```bash
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Coverage

| File                | Statements | Branches | Functions | Lines    |
| ------------------- | ---------- | -------- | --------- | -------- |
| `utils/date.ts`     | 100%       | 100%     | 100%      | 100%     |
| `utils/tree.ts`     | 100%       | 100%     | 100%      | 100%     |
| `Pagination.tsx`    | 100%       | 100%     | 66%       | 100%     |
| `Header.tsx`        | 100%       | 100%     | 71%       | 100%     |
| `TimeEntryForm.tsx` | 100%       | 90%      | 100%      | 100%     |
| `TreeNode.tsx`      | 98%        | 94%      | 100%      | 98%      |
| **Overall**         | **~75%**   | **~94%** | **~85%**  | **~75%** |

**Target:** 50%+ statement coverage ✓

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│   /hierarchy    │    /time-entries    │    /time-entries/new | /$id         │
│   (Tree View)   │    (Table View)     │    (Create/Edit Form)               │
└────────┬────────┴──────────┬──────────┴──────────────┬──────────────────────┘
         │                   │                         │
         ▼                   ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TANSTACK ROUTER                                      │
│  • File-based routing          • URL search params for pagination            │
│  • Route loaders               • Success state via query params              │
└────────┬────────────────────────┬────────────────────┬──────────────────────┘
         │                        │                    │
         ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVER FUNCTIONS (createServerFn)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ getClients   │  │getTimeEntries│  │createTimeEntry│  │getTimeEntry  │     │
│  │ getProjects  │  │              │  │updateTimeEntry│  │              │     │
│  │ getTasks     │  │              │  │              │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │                 │              │
│         └─────────────────┴─────────────────┴─────────────────┘              │
│                                    │                                         │
│                    ┌───────────────┴───────────────┐                         │
│                    │  API Key (server-side only)   │                         │
│                    │  Bearer Token Authentication  │                         │
│                    └───────────────┬───────────────┘                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MEMTIME API                                        │
│                                                                              │
│  Base URL: https://interview-api.memtime-demo.deno.net/api/v1               │
│  Rate Limit: 15 requests / 60 seconds                                        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  /clients   │  │  /projects  │  │   /tasks    │  │/time-entries│         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

1. **User navigates** to a route (e.g., `/hierarchy`)
2. **Route loader** calls server function before render
3. **Server function** adds auth header, calls Memtime API
4. **API response** flows back through server function (keeps API key hidden)
5. **Component renders** with loaded data
6. **User actions** (expand node, paginate, submit form) trigger new server function calls

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
